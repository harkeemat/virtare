<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="addStaffRoleForm" :label-col="labelCol"
    :wrapper-col="wrapperCol" autocomplete="off">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">
            Role
          </a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="24">
              <a-form-item label="Role" name="role" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">

                <SelectBox v-model:value="addStaffRoleForm.role" @focus="focus" :placeholderData="$t('clients.role')"
                  :globalCode="commonRecord?.rolesDropDown" />
                <ErrorMessage v-if="errorMsg" :name="errorMsg.roles ? errorMsg.roles : ''" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="emit('onClose', false)" :name="'Cancel'" />
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="commonRecord.loading" />
    </div>
  </a-form>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import Button from "@/components/button/Button.vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const emit = defineEmits(['onClose'])

const store = useStore()
const route = useRoute()

const labelCol = { span: 24 }
const wrapperCol = { span: 24 }

const commonRecord = store.getters.commonRecords

const addStaffRoleForm = reactive({
  role: ''
})


onMounted(() => {
  store.dispatch("rolesDropDown")
})

const submitForm = () => {
  store.dispatch("addStaffRole", {
    id: route.params.udid,
    data: {
      roles: Object.values(addStaffRoleForm)
    },
  }).then(() => {
    store.dispatch("staffRoles", route.params.udid);
    emit("onClose", false)
  })
}
</script>