<template>
                <a-form v-if="!showResponse" class="common-form" ref="programForm" @finish="submitForm" :model="formState" :label-col="labelCol"
                    :wrapper-col="wrapperCol" autocomplete="off">
                    <a-row :gutter="[48, 26]">
                        <a-col :span="6">
                            <a-form-item label="Start Date" class="required"
                                :rules="[{ required: true, message: $t('global.required') }]" name="fromDate">
                                <DateField
                                    :disabledDateData="current => current > dayjs() || current > dayjs(formState.toDate)"
                                    v-model:value="formState.fromDate" :globalDateFormat="globalDateFormat" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="End Date" class="required"
                                :rules="[{ required: true, message: $t('global.required') }]" name="toDate">
                                <DateField
                                    :disabledDateData="current => current > dayjs() || current < dayjs(formState.fromDate)"
                                    v-model:value="formState.toDate" :globalDateFormat="globalDateFormat" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <Button classData="primary-btn" name="Process Billing" html-type="submit"
                                :loading="loading"></Button>
                        </a-col>
                    </a-row>
                </a-form>
                <a-alert v-if="showResponse" :message="state.billing?.billingResponse" type="success" style="font-size: 16px;margin-top: 20px;" />
</template>
  
<script setup>
import { onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
//import { useRoute } from "vue-router";
import { useStore } from "vuex";
//import { tableSortingCommon } from '@/commonMethods/commonMethod';
import { globalDateFormat } from '@/commonMethods/commonMethod';
import DateField from "@/components/modals/search/DateField.vue";
import Button from "@/components/button/Button.vue";
import dayjs from 'dayjs';
const { state, dispatch, commit } = useStore();
const formState = reactive({
    fromDate: '',
    toDate: '',

})
const showResponse = ref(false)
const loading = ref(false)

const form = reactive({ ...formState })
watchEffect(() => {
    if (state.billing.getDate)
        formState.fromDate = state.billing.getDate
})
onMounted(() => {
    dispatch("getStartDateBilling")
    dispatch("orderTable", {
        data: "&orderField=&orderBy=",
    });
    dispatch("searchTable", "&search=");
    commit("billingFilterDate", { fromDate: '', toDate: '' })
    //store.dispatch("billingList");
});
const submitForm = async () => {
    
    loading.value = true
    try {
        await dispatch('generateProcessBilling', formState)
        showResponse.value = true
        Object.assign(formState, form)

    } catch (error) {
        console.log("check", error)
    }
    loading.value = false
}
const labelCol = { span: 24 }
onUnmounted(() => {
    commit("billingFilterDate", { fromDate: '', toDate: '' })
    commit("otherFilters", '')
});
//const screensPermissions = store.getters.screensPermissions
</script>
    
<style lang="scss" scoped>
.common-form {
    margin: 43px 0 59px;
}

.search-input {
    margin: 60px 0 15px;
    width: 500px !important;
}
</style>