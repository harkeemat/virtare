<template>
  <a-form ref="formRef" class="common-form" :model="peopleForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-typography-title :level="2" class="common-heading">
        {{ props.formHeading }}
      </a-typography-title>
      <a-row :gutter="[48, 16]">
        <a-col :span="24">
          <a-form-item label="Staff" class="required" name="staffId" :rules="[{ required: false, message: $t('global.required') }]">
            <SelectBox v-model:value="peopleForm.staffId" :globalCode="allPeopleList" placeholderData="Staff" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item label="Is External?" name="type">
            <a-checkbox v-model:checked="peopleForm.type" :disabled="false">External</a-checkbox>
          </a-form-item>
        </a-col> -->
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="common.loading" />
    </div>
  </a-form>
  <AddClientLoader />
</template>

<script setup>
// Packages
import { computed, reactive, ref } from "vue"
import { useStore } from "vuex";

// Components
import Button from "@/components/button/Button";
import SelectBox from "@/components/form-fields/SelectBox"
import AddClientLoader from "@/components/administration/clients/AddClientLoader";
import { useRoute } from "vue-router";

const labelCol = { span: 24 }
const wrapperCol = { span: 24 }
const store = useStore()
const route = useRoute()
const formRef = ref()

const allPeopleList = computed(() => {
  return store.state.clients.allPeopleList
})

const props = defineProps([
  'formHeading',
  'isEdit',
  'isStaff',
])
const emit = defineEmits(['onClose'])
const common = store.getters.commonRecords

const peopleForm = reactive({
  clientId: route.params.udid,
  staffId: '',
  type: true,
})

const submitForm = () => {
  console.log({peopleForm})
  store.dispatch('addExistingPerson', peopleForm).then((response) => {
    if(response) {
      store.dispatch("peopleList", { clientId: route.params.udid })
      onClose()
    }
  })
}

const onClose = () => {
  emit('onClose', false)
  formRef.value.resetFields()
}
</script>