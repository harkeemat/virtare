<template>
  <a-modal width="1000px" :title="title" centered :footer="false"  :maskClosable="false" @cancel="closeModal()">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')" :model="notes" name="basic" autocomplete="off" layout="vertical" @finish="addCriticalNote" @finishFailed="notesFailed">
      <a-row :gutter="24">
        <a-col :sm="24" :xs="24">
          <div class="form-group">
            <a-form-item label="Note" name="criticalNote" :rules="[{ required: true, message: 'Note'+' '+$t('global.validation') }]">
              <a-textarea style="width: 100%" v-model:value="notes.criticalNote" rows="4" @change="checkChangeInput()"/>
            </a-form-item>
          </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')"> </FormBaseComponents>
      </a-row>
      <a-row :gutter="24" class="mb-24">
       
       <a-col :span="24">
                <ModalButtons :Id="criticalNoteId" @is_click="handleCancel" @is_cancel="closeModal" />
            </a-col>
      </a-row>
    </a-form>
		<Loader />
  </a-modal>
</template>

<script>
import { defineComponent, reactive, computed,ref, watchEffect } from "vue";
import { useStore } from "vuex";
import {warningSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import { messages } from "@/config/messages";
import {useRoute} from "vue-router"
import Loader from "@/components/loader/Loader";
import ModalButtons from "@/components/common/button/ModalButtons";
export default defineComponent({
	components: {
		Loader,
    ModalButtons,
    FormBaseComponents
	},
	props: {
		patientUdid: {
      type: Number
    },
		criticalNoteId: {
      type: Number
    },
    
	},
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientId = props.patientUdid ? reactive(props.patientUdid) : route.params.udid
    const notes = reactive({
      criticalNote: "",
    });

    const criticalNoteDetails = computed(() => {
      return store.state.patients.criticalNoteDetails
    })

    const latestCriticalNote = computed(() => {
      return store.state.patients.latestCriticalNote
    })

    watchEffect(() => {
      if(props.criticalNoteId) {
        Object.assign(notes, {
          criticalNote: criticalNoteDetails.value ? criticalNoteDetails.value.criticalNote : ''
        })
      }
      else if(!props.criticalNoteId) {
        Object.assign(notes, {
          criticalNote: latestCriticalNote.value ? latestCriticalNote.value.criticalNote : ''
        })
      }
    })
 const patient = computed(() => {
      return store.state.patients.closeModal;
    });
    function addCriticalNote() {
    
      if(props.criticalNoteId) {
        store.dispatch("updateCriticalNote", {
          patientId: patientId,
          criticalNoteId: props.criticalNoteId,
          criticalNote: notes,
        }).then(() => {
          store.dispatch('criticalNotesList', patientId);
          store.dispatch('patientCriticalNotes', patientId);
          
          if(patientId) {
            store.dispatch('patientTimeline', {
              id:patientId,
              type:store.state.patients.tabvalue.join(",")
            });
          }
          emit("saveModal", false)
          emit("closeModal")
        })
      }
      else {
        store.state.patients.patientCriticalNotes= ''
        store.dispatch("addCriticalNote", {
          udid:patientId,
          criticalNote:notes
        }).then(() => {
          store.dispatch('criticalNotesList', patientId);
          store.dispatch('patientCriticalNotes', patientId);
          
          if(patientId) {
            store.dispatch('patientTimeline', {
              id:patientId,
              type:store.state.patients.tabvalue.join(",")
            });
          }
          emit("saveModal", false)
          emit("closeModal")
        })
      }
    }
    const form = reactive({
      ...notes,
    });
    function reset() {
      Object.assign(notes, form);
    }

    function checkChangeInput(){
      store.commit('checkChangeInput',true)
    }

    const checkFieldsData = computed(()=>{
      return store.state.common.checkChangeInput;
    })

    function closeModal() {

      emit("saveModal", true)
      if(checkFieldsData.value){
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            Object.assign(notes, form);
            store.commit('checkChangeInput',false)
          } else {
            emit("saveModal", true);
            emit("closeModal");
          }
        });
      }
      else {
        emit("saveModal", false)
      }
    }
    return {
      notes,
      patient,
      reset,
      checkChangeInput,
      addCriticalNote,
      closeModal,
      size: ref("large"),
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
