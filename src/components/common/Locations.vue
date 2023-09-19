<template>
    <a-modal  max-width="1140px" width="30%" title="Add Location" centered   :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="Location" layout="vertical" @finish="title?addNote():submitForm()">
      <div class="form-group">
          <a-form-item label="Location" name="location" :rules="[{ required: false, message: $t('tasks.tasksModal.longDescription')+' '+$t('global.validation')  }]">
            <GlobalCodeDropDown v-model:value="location" :dataId="83" @handleGlobalChange="handleGlobalChange($event); checkChangeInput()" />
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
  import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
  export default {
    props: {
      title:String,
      escalationId:String
    },
    components:{
        GlobalCodeDropDown
    },
  setup() {
    const store = useStore();
    const route = useRoute();
    const location = ref()
  
    // const record = computed(() => {
    //     return store.state.escalations.singleEscalationRecord;
    // })
    const iconLoading = ref(false);
    const submitForm = () => {
      iconLoading.value = true;
    //   store.dispatch("closeEscalation", {
    //     location:location.value,
    //     escalationId:props.escalationId
    //     }).then((resp) => {
    //     if(resp == true){    
    //         emit('closeModal', false) 
    //         store.dispatch("escalation")
    //     }else{
    //         iconLoading.value = false;
    //     }
    //   });
    };
  
    const addNote = () =>{
      iconLoading.value = true;
    //   store.dispatch("escalationComment", {
    //     location:location.value,
    //     escalationId:props.escalationId
    //     }).then((resp) => {
    //     if(resp == true){    
    //         emit('closeModal', false) 
    //         store.dispatch("escalationAudit")
    //     }else{
    //         iconLoading.value = false;
    //     }
    //   });
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

    function handleGlobalChange(value){
        location.value = value
    }
  
    return {
      handleGlobalChange,
      addNote,
      checkChangeInput,
      closeModal,
      errorMsg,
      location,
      submitForm,
      route,
      iconLoading,
      // loggedInUser,
    };
  },
  };
  </script>
  
  <style lang="scss" scoped>
  span.error {
  color: #ff0000;
  }
  
  </style>
  