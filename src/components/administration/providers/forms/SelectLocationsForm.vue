<template>
  <a-form :model="providerLocationForm" autocomplete="off" :scrollToFirstError="true" layout="vertical" @finish="submitForm">
    
    <a-row :gutter="24">
      <a-col :span="24">
        <div class="form-group">
          <a-form-item name="country" :rules="[{ required: true, message: 'Country'+' '+$t('global.validation') }]">
            <GlobalCodeDropDown  v-model:value="providerLocationForm.country" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'providerLocationForm.country')" @change="checkChangeInput()" />
          </a-form-item>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="24">
        <div class="form-group">
          <a-form-item name="state" :rules="[{ required: true, message: 'State'+' '+$t('global.validation') }]">
            <GlobalCodeDropDown v-model:value="providerLocationForm.state" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'providerLocationForm.state')" @change="checkChangeInput()" />
          </a-form-item>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="24">
        <div class="form-group">
          <a-form-item name="city" :rules="[{ required: true, message: 'City'+' '+$t('global.validation') }]">
            <GlobalCodeDropDown v-model:value="providerLocationForm.city" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'providerLocationForm.city')" @change="checkChangeInput()" />
          </a-form-item>
        </div>
      </a-col>
    </a-row>

  </a-form>
</template>