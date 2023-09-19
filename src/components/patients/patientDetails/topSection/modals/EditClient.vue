<template>
    <ClientLoader />
    <a-form ref="formRef" class="common-form" :model="clients" :label-col="labelCol" :wrapper-col="wrapperCol"
      @finish="submitForm">
      <div class="drawerBody">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-row :gutter="[48, 16]">
                <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Edit Client</a-typography-title>
                </div>
              </a-col>
              <a-col :span="12">
              <a-form-item label="Client" class="required" name="clientId"
              :rules="[{ required: true, message: $t('global.required') }]"
              >
                  <SelectBox v-model:value="clients.clientId" entity="client"
                  :placeholderData="$t('patient.onboarding.client')"
                  :globalCode="store.state.clients.clientsList"
                  
                  />
                </a-form-item>
              </a-col>
              <a-col />
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div class="drawerFooter">
        <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
        <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="common.loading" />
      </div>
    </a-form>
</template>
<script setup>
  import { onMounted, reactive, ref} from "vue";
  import SelectBox from "@/components/form-fields/SelectBox.vue"
  import Button from "@/components/button/Button.vue";
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import ClientLoader from "@/components/administration/clients/ClientLoader.vue"  

    const emit = defineEmits(['onClose'])
      const store = useStore()
      const common = store.getters.commonRecords
      const formRef = ref()
      const route = useRoute()

      const clients = reactive({
        clientId:store.state.patientsStore.patientInformation?.clientId
,
      })
      const labelCol={span : 24};
      const form = reactive({ ...clients })
      onMounted(() => {
        store.dispatch("clientsList",{"filter":"?type=active"})
        
      })
  
      const submitForm = async () => {
        try{
        await store.dispatch('getClientsForPatients',{patientId:route?.params?.udid,data:clients})
        onClose()
        store.dispatch("patientInformation", route?.params?.udid)
        }catch(error){
            console.log(error)
        }
          
      }
      const onClose = () => {
        formRef.value?.resetFields();
        Object.assign(clients, form)
        emit('onClose', false)
      };
  
      
  </script>
  