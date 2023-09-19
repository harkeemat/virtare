<template>
  <a-modal title="Location Programs" width="60%" :footer="false" :maskClosable="false" @cancel="closeModal()" centered>
    <div>
      <a-form :model="locationProgramsForm" autocomplete="off" :scrollToFirstError="true" layout="vertical" @finish="submitForm">
        <a-row :gutter="24">
          
          <a-col :span="24">
            <div class="form-group">
              <a-form-item label="Program(s)" name="programs" :rules="[{ required: true, message: $t('providers.programs')+' '+$t('global.validation') }]">
                <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" ref="select" mode="multiple" v-model:value="locationProgramsForm.programs" style="width: 100%" size="large" @change="checkChangeInput()">
                  <a-select-option hidden>Select Program(s)</a-select-option>
                  <a-select-option v-for="program in dropdownLocationPrograms" :key="program.udid ? program.udid : program.programUdid" :value="program.udid ? program.udid : program.programUdid">{{ program.name ? program.name : program.program }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-col>

          <a-col :span="24">
            <FormButtons @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <ErrorMessage v-if="errorMsg" :name="errorMsg.programs ? errorMsg.programs[0] : ''" />

    <div class="locationPrograms">
      <a-table class="sortIconTable" rowKey="id" :columns="locationProgramsColumns" :data-source="locationPrograms" :pagination="false">
        <template #actions="{record}">
          <a-tooltip placement="right">
            <template #title>
              <span>Delete</span>
            </template>
            <a class="icons">
              <DeleteOutlined @click="deleteProgram(record)" />
            </a>
          </a-tooltip>
        </template>
      </a-table>
    </div>
    
    <div class="steps-action">
      <a-form-item >
        <a-button class="modal-button" type="primary" @click="closeModal">Done</a-button>
      </a-form-item>
    </div>


  </a-modal>
</template>

<script>
import {
  computed,
	onMounted,
  reactive,
	ref,
	watchEffect,
} from 'vue-demi'
import { useStore } from 'vuex'
import FormButtons from "@/components/common/button/FormButtons"
import {
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from 'vue-router';
import { warningSwal } from '../../commonMethods/commonMethod';
import { messages } from '../../config/messages';
import ErrorMessage from "@/components/common/messages/ErrorMessage"
// import { successSwal } from '../../commonMethods/commonMethod';

export default {
  components: {
    FormButtons,
    DeleteOutlined,
    ErrorMessage,
  },
  props: {
    locationId: {
      type: Number
    },
    parentLocationId: {
      type: Number
    },
    entityType: {
      type: String
    },
    parentEntityType: {
      type: String
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    
    const locationProgramsForm = reactive({
      programs: []
    })
    const form = reactive({ ...locationProgramsForm })

    onMounted(() => {
      store.state.provider.errorMsg = ''
      store.dispatch('manageProgramList')
      // store.commit('programsByProvider', route.params.id)
      // store.dispatch('programsByProvider', props.providerID)
    })
    
    const locationPrograms = computed(() => {
      return store.state.provider.locationPrograms
    })
    
    const providerPrograms = computed(() => {
      return store.state.provider.providerPrograms
    })
    
    const dropdownLocationPrograms = computed(() => {
      return store.state.provider.dropdownLocationPrograms
    })

    watchEffect(() => {
      if(props.parentEntityType != "") {
        if(locationPrograms.value?.length > 0) {
          locationPrograms.value.map(locationProgram => {
            dropdownLocationPrograms.value.map((providerProgram, index) => {
              if(providerProgram.programId == locationProgram.programId) {
                dropdownLocationPrograms.value.splice(index, 1)
              }
            })
          })
        }
      }
      else {
        if(locationPrograms.value?.length > 0) {
          locationPrograms.value.map(locationProgram => {
            providerPrograms.value.map((providerProgram, index) => {
              if(providerProgram.id == locationProgram.programId) {
                providerPrograms.value.splice(index, 1)
              }
            })
          })
        }
      }
    })
    
    const providerLocations = computed(() => {
      return store.state.provider.providerLocations
    })
    
    /* const locationPrograms = [
      {
        key: '1',
        program: 'BHI - Mental Well Being Services',
      },
      {
        key: '2',
        program: 'RTM - Remote Therapeutic Monitoring',
      },
      {
        key: '3',
        program: 'PCM - Principal Care Management',
      },
      {
        key: '4',
        program: 'VIPC - Virtual/in Person Healthcare Services',
      },
    ] */

    const locationProgramsColumns = [
      {
        title: "Program",
        dataIndex: "program",
        key: "program",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions"
        },
      },
    ]
    
    const checkChangeInput = () => {
      store.commit("checkChangeInput", true);
    }
    
    /* const checkForData = () => {
      locationPrograms.value.map((locationProgram) => {
        let index = providerPrograms.value.findIndex(x => x.udid === locationProgram.udid);
        if(index !== -1) {
          let programs = providerPrograms.value.splice(index, 1)
          store.commit('providerPrograms', programs)
        }
      })
    } */

    const closeModal = () => {
      store.state.provider.errorMsg = ''
      emit('closeModal')
    }

    const submitForm = () => {
      // successSwal('Created Successfully')
      store.dispatch('assignProgramToLocation', {
        providerID: route.params.id,
        locationID: props.locationId,
        entityType: props.entityType,
        data: locationProgramsForm,
      }).then(() => {
        store.dispatch('providerLocations', route.params.id)
        if(props.parentEntityType != "") {
          store.dispatch('dropdownLocationPrograms', {
            providerID: route.params.id,
            locationID: props.parentLocationId,
            entityType: props.parentEntityType,
          }).then(() => {
            if(locationPrograms.value?.length > 0) {
              locationPrograms.value.map(locationProgram => {
                dropdownLocationPrograms.value.map((providerProgram, index) => {
                  if(providerProgram.programId == locationProgram.programId) {
                    dropdownLocationPrograms.value.splice(index, 1)
                  }
                })
              })
            }
          })
        }
        else {
          store.commit('dropdownLocationPrograms', providerPrograms.value)
        }
        store.dispatch('locationPrograms', {
          providerID: route.params.id,
          locationID: props.locationId,
          entityType: props.entityType,
        })
        Object.assign(locationProgramsForm, form)
      })
      // emit('closeModal')
    }

    const dropdownPrograms = ref([])
    const deleteProgram = (record) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteLocationProgram', {
            providerID: route.params.id,
            locationID: props.locationId,
            programID: record.programId,
            entityType: record.entityType,
          }).then(() => {
            store.dispatch('providerLocations', route.params.id)
            store.dispatch('locationPrograms', {
              providerID: route.params.id,
              locationID: props.locationId,
              entityType: props.entityType,
            }).then(() => {
              if(locationPrograms.value?.length > 0) {
                locationPrograms.value.map(locationProgram => {
                  if(record.id != locationProgram.programId) {
                    dropdownPrograms.value.push(record)
                  }
                })
              }
              else {
                if(props.parentEntityType != "") {
                  store.dispatch('dropdownLocationPrograms', {
                    providerID: route.params.id,
                    locationID: props.parentLocationId,
                    entityType: props.parentEntityType,
                  })
                }
                /* else {
                  store.dispatch('dropdownLocationPrograms', providerPrograms.value)
                } */
              }
              store.dispatch('providerLocations', route.params.id)
              store.commit('dropdownLocationPrograms', dropdownPrograms.value)
            })
          })
        }
      })
    }

    const errorMsg = computed(() => {
      return store.state.provider.errorMsg
    })

    return {
      // checkForData,
      checkChangeInput,
      locationProgramsColumns,
      locationPrograms,
      providerLocations,
      dropdownLocationPrograms,
      closeModal,
      locationProgramsForm,
      submitForm,
      deleteProgram,
      providerPrograms,
      errorMsg,
    }
  }
}
</script>

<style scoped>
  .anticon-plus {
    color: #1D8FFB;
    font-size: 20px !important;
  }
  .locationPrograms {
    position: relative;
    top: 20px;
    padding: 50px 0;
  }
</style>