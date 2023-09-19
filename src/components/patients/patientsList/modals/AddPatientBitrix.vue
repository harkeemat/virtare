<template>
  <a-form class="common-form" ref="formRef" @finish="search" :model="formModel" :label-col="{ span: 24 }"
    :wrapper-col="wrapperCol" autocomplete="off">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">New Patient</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[27, 16]">
            <a-col :span="14">
              <a-form-item :label="$t('patient.onboarding.title')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="title">
                <a-input :placeholder="$t('patient.onboarding.title')" v-model:value="formModel.title" />
              </a-form-item>
            </a-col>
            <a-col :span="10" style="padding-top: 22px;">
              <a-button class="primary-btn" html-type="submit" :loading="bitrix.isSearching">SEARCH </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <a-button @click="onClose" class="secondary-btn"> Cancel </a-button>
    </div>
  </a-form>
</template>
<script setup>
import { reactive } from 'vue';
import { useStore } from 'vuex';

const {dispatch,state} = useStore()

const {bitrix} = state;
const formModel = reactive({
  title: "",
});

const emit = defineEmits(['hideDrawer']);
const onClose = () => {
  emit('hideDrawer')
}
const search = () => {
  dispatch('search',{formModel,emit})
}

</script>
