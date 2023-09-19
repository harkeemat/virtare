<template>
    <a-form class="common-form" ref="formRef" @finish="submitForm" :model="clientForm" :label-col="labelCol"
        :wrapper-col="wrapperCol">
            <a-row :gutter="[48, 16]">
                <a-col :span="12">
                    <a-form-item label="First Name" class="required">
                        <InputFields :value="patientInformation?.contact?.firstName" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="5" style="padding-right: 9px">
                    <a-form-item label="Middle Name">
                        <InputFields :value="patientInformation?.contact?.middleName" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="7" style="padding-left: 9px">
                    <a-form-item label="Last Name" class="required">
                        <InputFields :value="patientInformation?.contact?.lastName" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Gender" class="required">
                        <SelectBox ref="select" :value="patientInformation?.contact?.gender" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                {{ dateFormatList }}
                <a-col :span="12">
                    <a-form-item label="Date of Birth" class="required">
                        <DateField :value="patientInformation?.contact?.dob" :globalDateFormat="globalDateFormat" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Primary Language" class="required">
                        <SelectBox ref="select" :value="patientInformation?.primaryLanguage" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12"></a-col>
                <a-col :span="12">
                    <a-form-item label="Place of Service" class="required">
                        <SelectBox ref="select" :value="patientInformation?.placeOfService" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Time Zone" class="required">
                        <SelectBox ref="select" :value="patientInformation?.user?.timeZone" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <div class="form-heading">
                        <a-typography-title :level="3">Contact Details</a-typography-title>
                        <a-typography-text>Contact method</a-typography-text>
                    </div>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Phone Number" class="required">
                        <InputFields :value="patientInformation?.contact?.phoneNumber" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Email" class="required">
                        <InputFields :value="patientInformation?.user?.email" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Contact Method" class="required">
                        <SelectBox ref="select" :value="patientInformation?.contactMethod" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Best time to call" class="required">
                        <SelectBox ref="select" :value="patientInformation?.bestTimeToCall" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <div class="form-heading">
                        <a-typography-title :level="3">Address</a-typography-title>
                        <a-typography-text>Physical address for contractual needs</a-typography-text>
                    </div>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Line 1" class="required">
                        <InputFields :value="patientInformation?.address?.line1" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Line 2">
                        <InputFields :value="patientInformation?.address?.line2" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="City" class="required">
                        <InputFields :value="patientInformation?.address?.city" disabled/>
                    </a-form-item>
                </a-col>
                <a-col :span="5" style="padding-right: 9px">
                    <a-form-item label="State" class="required">
                        <SelectBox ref="select" :value="patientInformation?.address?.state" style="width: 100%" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="7" style="padding-left: 9px">
                    <a-form-item label="Zipcode" class="required">
                        <InputFields :value="patientInformation?.address?.zipCode" disabled/>
                    </a-form-item>
                </a-col>
            </a-row>
    </a-form>
</template>

<script>
import InputFields from "@/components/form-fields/InputFields.vue";
import SelectBox from "@/components/form-fields/SelectBox";
import DateField from "@/components/modals/search/DateField.vue";
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import { globalDateFormat } from '@/commonMethods/commonMethod';

export default {
    components: {
        InputFields,
        SelectBox,
        DateField,
    },

    setup() {
        const store = useStore()

        const patientInformation = computed(() => {
            return store.state.patientsStore.patientInformation
        })

        const focus = () => {
            console.log("focus");
        };
        const handleChange = (value) => {
            console.log(`selected ${value}`);
        };

        return {
            focus,
            handleChange,
            DateOfBirth: ref(),
            StartDate: ref(),
            EndDate: ref(),
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
            patientInformation,
            globalDateFormat,
        };
    },
};
</script>

