<template>
  <a-modal class="modalH-auto" max-width="1140px" width="30%" :title="title?title:'Close Escalation'" centered   :footer="false" :maskClosable="false" @cancel="closeModal()">
  <a-form :model="description" layout="vertical" @finish="title?addNote():submitForm()">
    <div class="form-group">
        <a-form-item label="Description" name="description" :rules="[{ required: false, message: $t('tasks.tasksModal.longDescription')+' '+$t('global.validation')  }]">
          <a-textarea v-model:value="description" placeholder="Description" :auto-size="{ minRows: 3 }" @change="checkChangeInput()" />
        </a-form-item>
      </div>
      <div class="field">
          <span class="error">{{ errorMsg.errorMsg }}</span>
      </div>
      <div class="buttons" style="float:right">
          <a-button class="btn primary" type="primary" html-type="submit" :loading="iconLoading">{{'Submit'}}</a-button>
      </div>
  </a-form>
  </a-modal>
  </template>
<script>

import { computed, ref, onUnmounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  props: {
    title:String,
    escalationId:String,
  },
setup(props,{emit}) {
  const store = useStore();
  const route = useRoute();
  const description = ref()
  const  filtterDates = store.getters.otherFilters

  // const record = computed(() => {
  //     return store.state.escalations.singleEscalationRecord;
  // })
  const iconLoading = ref(false);
  const submitForm = () => {
    iconLoading.value = true;
    store.dispatch("closeEscalation", {
      description:description.value,
      escalationId:props.escalationId
      }).then((resp) => {
      if(resp == true){    
          emit('closeModal', false) 
          store.dispatch("escalation")
      }else{
          iconLoading.value = false;
      }
    });
  };

  const addNote = () =>{
    iconLoading.value = true;
    store.dispatch("escalationComment", {
      description:description.value,
      escalationId:props.escalationId
      }).then((resp) => {
      if(resp == true){    
          emit('closeModal', false) 
          store.dispatch("escalationAudit",filtterDates.value?filtterDates.value:'')
      }else{
          iconLoading.value = false;
      }
    });
  }

  const errorMsg = computed(() => {
    return store.state.authentication;
  })

  watchEffect(() => {
    if (errorMsg.value.errorMsg) {
        iconLoading.value = false
    }
  });
  onUnmounted(() => {
    iconLoading.value = false;
    store.state.authentication.errorMsg = "";
  });

  function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

  function closeModal() {
    //
  }

  return {
    addNote,
    checkChangeInput,
    closeModal,
    errorMsg,
    description,
    submitForm,
    route,
    iconLoading,
    // loggedInUser,
    filtterDates: store.getters.otherFilters,
  };
},
};
</script>

<style lang="scss" scoped>
span.error {
color: #ff0000;
}

</style>
