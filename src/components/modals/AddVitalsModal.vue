<template>
  <a-modal width="1000px" :title="title" centered @cancel="closeModal()">
    <a-form ref="formRef" :model="addVitalForm" layout="vertical" @finish="submitForm" autocomplete="off">
      <a-row :gutter="24">
        
        <a-col :sm="8" :xs="24" :xl="12 ">
          <div class="form-group">
            <a-form-item label="Date" name="takeDate" :rules="[{ required: true, message: 'Date '+$t('global.validation')  }]">
                <DateField   @change="checkChangeInput()" v-model:value="addVitalForm.takeDate" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" size="large" style="width: 100%"  format="MMM DD, YYYY "  value-format="YYYY-MM-DD" />
              </a-form-item>
          </div>
        </a-col>

        <a-col :sm="8" :xs="24" :xl="12 ">
          <div class="form-group">
            <a-form-item label="Time" name="time" :rules="[{ required: true, message: 'Time '+$t('global.validation')  }]">
                <a-time-picker   @change="checkChangeInput()" v-model:value="addVitalForm.time" use12-hours  size="large" style="width: 100%"  format="h:mm a"  value-format="h:mm a" />
              </a-form-item>
          </div>
        </a-col>
        
        <template v-if="idDevice != 101">
          <a-col :sm="8" :xs="24" :xl="12" v-for="field,index in addVitalForm.vitals" :key="field.id" :value="field.id">
            <div class="form-group">
              <a-form-item :label="field.fieldName == 'spo2' ? field.field+' (%)' : field.field" :id="field.id" :name="['vitals', index, 'value']" :rules="[{ required: true, message: field.field+' '+$t('global.validation')  }]">
                <a-input-number v-if="field.fieldName == 'spo2'" @change="checkChangeInput($event)" v-model:value="field.value" style="width: 100%" size="large" :min="1" :max="100" />
                <a-input v-else @change="checkChangeInput($event)" v-model:value="field.value" style="width: 100%" size="large" />
              </a-form-item>
            </div>
          </a-col>
        </template>
        
        <template v-else>
          <a-col :sm="8" :xs="24" :xl="12">
            <div class="form-group">
              <a-form-item label="Vital Type" name="type" :rules="[{ required: true, message: 'Type '+$t('global.validation')  }]">
                <a-select
                  ref="select"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                  v-model="addVitalForm.type"
                  style="width: 100%"
                  size="large"
                  @focus="focus"
                  @change="checkChangeInput()"
                  v-model:value="addVitalForm.type">
                  <a-select-option v-for="field in vitalFieldsByDeviceId" :key="field.id">{{ field.field }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-col>

          <a-col :sm="8" :xs="24" :xl="12">
            <div class="form-group">
              <a-form-item label="Value" name="value" :rules="[{ required: true, message: 'Value '+$t('global.validation')  }]">
                <a-input @change="checkChangeInput($event)" v-model:value="addVitalForm.value" style="width: 100%" size="large" />
              </a-form-item>
            </div>
          </a-col>
        </template>
        
        <a-col :sm="24" :xs="24">
          <div class="form-group">
            <a-form-item label="Note" name="comment" :rules="[{ required: true, message: $t('vitals.note') +' '+ $t('global.validation')  }]">
              <a-textarea @change="checkChangeInput()" v-model:value="addVitalForm.comment" size="large" />
            </a-form-item>
          </div>
        </a-col>
        
        <a-col :span="24">
          <div class="steps-action">
            <ModalButtons @is_click="handleCancel"/>
          </div>
        </a-col>

      </a-row>
    </a-form>
    <Loader />

  </a-modal>
</template>
<script>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import ModalButtons from "@/components/common/button/ModalButtons";
import { timeStamp, } from "@/commonMethods/commonMethod";
import Loader from "@/components/loader/Loader"
import moment from 'moment';
import dayjs from 'dayjs';
import DateField from "@/components/modals/search/DateField.vue";
import { dayWeekMonthdate } from '@/commonMethods/commonMethod';

export default {
  components: {
    ModalButtons,
    Loader,
    DateField
  },
  props: {
    title: {
      type: String
    },
    deviceId: {
      type: Number
    },
		patientId: {
			type: Number
		},
  },
  setup(props, {emit}) {
    const store = useStore()
    const route = useRoute()
    const formRef = ref()
    const idDevice = reactive(props.deviceId)
    const patientId = props.patientId ? reactive(props.patientId) : route.params.udid

    const addVitalForm = reactive({
      takeDate: '',
      time:'',
      type: '',
      value: '',
      comment: '',
      vitals:[],
    })
    const form = reactive({ ...addVitalForm })

    let vitalTypes = [{
      type: "",
      value: "",
      name: "",
    }]

    const vitalFieldsByDeviceId = computed(() => {
      return store.state.common.vitalFieldsByDeviceId
    })
   onMounted(()=>{
    store.dispatch('vitalFieldsByDeviceId', idDevice).then(() => {
      
      if(idDevice != 101) {
            vitalFieldsByDeviceId.value.map(item => {
              vitalTypes.push({
                id:item.id,
                type: item.id,
                value: '',
                name: item.fieldName,
              })
            
          })
          vitalFieldsByDeviceId.value.map((item)=>{
            addVitalForm.vitals.push({
              "field":item.field,
              "id":item.id,
              "value":'',
              fieldName:item.fieldName
            })
          })
        }
        })
   })
    watchEffect(() => {
     
    })

    function checkChangeInput() {
      // vitalTypes.some(element => {
      //   if(idDevice != 101 && event && (element.type === Number(event.target.id))) {
      //     element.value = event.target.value
      //     const field = element.name
      //     addVitalForm[field] = event.target.value
      //   }
      // })
      store.commit("checkChangeInput", true);
    }

    const submitForm = () => {
    
      const deviceInfo = {
        'name': 'Web App'
      }
      let units = ""
      let vitalsData = []
      if(idDevice != 101) {
        vitalTypes.forEach(element => {
          switch (element.name) {
            case 'systolic':
              units = 'mmHg'
              break;
            case 'diastolic':
              units = 'mmHg'
              break;
            case 'bpm':
              units = 'bpm'
              break;
            case 'spo2':
              units = '%'
              break;
            default:
              break;
          }
          let Recordvalue = addVitalForm.vitals.find((o) => o.id ===element.type)
          vitalsData.push({
            type: element.type,
            value: Number(Recordvalue?.value),
            takeTime: timeStamp(addVitalForm.takeDate+' '+addVitalForm.time),
            comment: addVitalForm.comment,
            deviceType: idDevice,
            units: units,
            createdType: 'Staff',
            deviceInfo: deviceInfo,
            addType: 'Manual',
          })
        });
        vitalsData.splice(0, 1)
      }
      else {
        vitalsData = [{
          type: addVitalForm.type,
          value: Number(addVitalForm.value),
          takeTime: timeStamp(addVitalForm.takeDate+' '+addVitalForm.time),
          comment: addVitalForm.comment,
          deviceType: idDevice,
          units: 'mg/dl',
          createdType: 'Staff',
          deviceInfo: deviceInfo,
          addType: 'Manual',
        }]
      }
      const data = {
        'vital': vitalsData
      }
    
      const bloodOxygenTimeline = store.getters.bloodOxygenTimeline
      const bloodGlucoseTimeline = store.getters.bloodGlucoseTimeline
      const bloodPressureTimeline = store.getters.bloodPressureTimeline
      
      function getVitals() {
        if (bloodOxygenTimeline.value == null) {
          store.dispatch("timeLine", {
            id: 332,
            commit: "bloodOxygenTimeline"
          }).then(() => {
            apiCall(bloodOxygenTimeline.value, 100)
          })
        } else {
          apiCall(bloodOxygenTimeline.value, 100)
        }

        if (bloodGlucoseTimeline.value == null) {
          store.dispatch("timeLine", {
            id: 332,
            commit: "bloodGlucoseTimeline"
          }).then(() => {
            apiCall(bloodGlucoseTimeline.value, 101)
          })
        } else {
          apiCall(bloodGlucoseTimeline.value, 101)
        }

        if (bloodPressureTimeline.value == null) {
          store.dispatch("timeLine", {
            id: 332,
            commit: "bloodPressureTimeline"
          }).then(() => {
            apiCall(bloodPressureTimeline.value, 99)
          })
        } else {
          apiCall(bloodPressureTimeline.value, 99)
        }
      }

      function apiCall(data, deviceId) {
        let dateFormat = dayWeekMonthdate(data)
        let dateFilter = dateFormat ? "&fromDate=" + dateFormat.fromDate + "&toDate=" + dateFormat.toDate : ''
        if(deviceId) {
          store.dispatch("patientVitals", {
            patientId: patientId?patientId:route.params.udid,
            deviceType: deviceId,
            filter: dateFilter,
          });
        }
        else {
          store.dispatch("patientVitals", {
            patientId: patientId?patientId:route.params.udid,
            deviceType: 99,
            filter: dateFilter,
          });
          store.dispatch("patientVitals", {
            patientId: patientId?patientId:route.params.udid,
            deviceType: 100,
            filter: dateFilter,
          });
          store.dispatch("patientVitals", {
            patientId: patientId?patientId:route.params.udid,
            deviceType: 101,
            filter: dateFilter,
          });
        }
      }

      store.dispatch('addVital', { patientId, data }).then(() => {
        getVitals()
        if(route.name == 'PatientSummary'){

          store.dispatch("latestNotes", patientId);
          store.dispatch("patientTimeline", {
                      id: patientId,
                      type: store.state.patients.tabvalue,
                  });
                  store.dispatch("latestVital", patientId);
        }
        store.dispatch("patientFlagsList", {patientUdid:route.params.udid,catId:1})
        formRef.value.resetFields()
        Object.assign(addVitalForm, form)
        emit('closeModal', false)
      })
    }
    
    const handleCancel = () => {
      formRef.value.resetFields();
      Object.assign(addVitalForm, form)
    };

    const checkChangedInput = computed(() => {
      return store.state.common.checkChangeInput
    })
    
    const closeModal = () => {
      emit('closeModal', checkChangedInput.value)
    }

    return {
      moment,
      closeModal,
      formRef,
      dayjs,
      addVitalForm,
      submitForm,
      handleCancel,
      vitalFieldsByDeviceId,
      checkChangeInput,
      idDevice,
      
    };
  },
}
</script>
