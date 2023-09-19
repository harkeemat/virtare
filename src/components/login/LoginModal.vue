<template>
    <a-modal class="modalH-auto"  max-width="100%" width="300px" :title="'Authentication'" centered :closable="false"  :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="loginForm" layout="vertical" @finish="loginUser">
        <div class="field">
            <a-form-item name="password" :rules="[{ required: true, message: $t('login.psdPlaceholder')+' '+$t('global.validation')  }]">
                <a-input-password v-model:value="loginForm.password" :placeholder="$t('login.psdPlaceholder')" size="large" />
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

import { computed, reactive, ref, onUnmounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  setup(props,{emit}) {
    const store = useStore();
    const route = useRoute();

    const loginForm = reactive({
      password: "",
    });

    const record = computed(() => {
        return store.state.escalations.singleEscalationRecord;
    })
    const iconLoading = ref(false);
    const loginUser = () => {
      iconLoading.value = true;
      store.dispatch("escalationAuth", {
        escalationPassword:loginForm.password,
        id:route.params.udid
    }).then((resp) => {
        if(resp == true){    
            emit('closeModal', false)
            if(route.params.udid){
                store.dispatch("singleEscalationRecord", route.params.udid).then((resp)=>{
                    if(resp == true){
                        store.dispatch("patientDetails", record.value.patient?.id);
                        store.dispatch("devices", record.value.patient?.id).then((resp)=>{
                        if(resp==true){
                         store.dispatch("patientVitals", {
                          patientId: record.value.patient?.id,
                          deviceType: 99,
                          filter: "",
                        });
                        store.dispatch("patientVitals", {
                          patientId: record.value.patient?.id,
                          deviceType: 100,
                          filter: "",
                        });
                        store.dispatch("patientVitals", {
                          patientId: record.value.patient?.id,
                          deviceType: 101,
                          filter: "",
                            });
                            }
                        });
                }
                })
               }
        }else{
            iconLoading.value = false;
        }
      });
    };

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

    

    function closeModal() {
      //
    }

    return {
      closeModal,
      errorMsg,
      loginForm,
      loginUser,
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
