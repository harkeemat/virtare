<template>
<a-modal title="Add New Care Coordinator" centered width="50%" :maskClosable="maskebale" :footer="false" @cancel="closeModal()">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')" ref="formRef" :model="physicianForm" layout="vertical" @finish="addPhysician" @finishFailed="onFinishFailed">
        <a-row :gutter="24">
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('appointmentCalendar.careCoordinator')" name="staffId" :rules="[{ required: true, message: $t('appointmentCalendar.careCoordinator')+' '+$t('global.validation')  }]">
                        <StaffDropDown  v-model:value="physicianForm.staffId" @handleStaffChange="handleStaffChange($event); checkChangeInput()" :close="closeValue" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg" />
                    </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :sm="24" :xs="24">
                <div class="steps-action">
                    <a-form-item>
                        <a-button class="modal-button" type="primary" :disabled="submit" html-type="submit">{{$t('global.add')}}</a-button>
                    </a-form-item>
                </div>
            </a-col>
        </a-row>
    </a-form>
</a-modal>
</template>

<script>
import {
    ref,
    reactive,
    computed,
} from "vue";
import {
    useStore
} from "vuex";
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue";
import {warningSwal ,arrayToObjectData,formTitleNames,arrayToObjact} from "@/commonMethods/commonMethod";
import { messages } from '@/config/messages';
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import ErrorMessage from "@/components/common/messages/ErrorMessage"
export default {
    props: {},
    components: {
        StaffDropDown,
        FormBaseComponents,
        ErrorMessage
    },
    setup(props, { emit }) {
        const closeValue = ref(false)
        const formRef = ref()


        function checkChangeInput() {
            store.commit("checkChangeInput", true);
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        });
        const errorMsg = ref('')
        const store = useStore();
        const handleChange = () => {
            
        };

        const handleBlur = () => {};

        const handleFocus = () => {};

        const filterOption = (input, option) => {
            
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        const staffList = store.getters.commonRecords.value;

        const physicianForm = reactive({
            staffId: "",
        });
        const submit = ref(false)
        const addPhysician = () => {
            submit.value = true
            if(store.getters.appointmentRecords.value.getStaff){
                let object = arrayToObjact(
                store.getters.appointmentRecords.value.getStaff,
                physicianForm.staffId
            );
            if(!object){
                store.dispatch("staffSummary", physicianForm.staffId).then(() => {
                addStaff(physicianForm.staffId);
                
            });
            }else{
                errorMsg.value = messages.alreadyAssign
                submit.value = false
                //emit("is-visible", {show:false,event:false});
            }
            }else{
                emit("is-visible", {show:false,event:true});
                store.dispatch("staffSummary", physicianForm.staffId).then(() => {
                addStaff(physicianForm.staffId);
                })
            }
            
           
        };
        const form = reactive({ ...physicianForm });

        function addStaff(event) {
            Object.assign(physicianForm, form);
            let object = arrayToObjact(
                store.getters.appointmentRecords.value.getStaff,
                event
            );

            if (!object) {
                store.dispatch("getStaffs", store.state.careCoordinatorSummary.staffSummary);
                submit.value = false
            }
            
            emit("is-visible", {show:false,event:true});
        }

        function closeModal() {
            emit("is-visible", {show:true,event:false});
            if(checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        errorMsg.value = ''
                        emit("is-visible", {show:false,event:false});
                        store.commit('checkChangeInput', false)
                        Object.assign(physicianForm, form)
                        formRef.value.resetFields()
                    }
                    else {
                        emit("is-visible", {show:true,event:false});
                    }
                });
            }
            else {
                errorMsg.value = ''
                emit("is-visible", {show:false,event:false});
                Object.assign(physicianForm, form)
                formRef.value.resetFields()

            }
        }

        const handleStaffChange = (val) => {
            errorMsg.value = ''
            physicianForm.staffId = val;
        };

        return {
            handleStaffChange,
            value: ref(undefined),
            filterOption,
            handleBlur,
            handleFocus,
            handleChange,
            staffList,
            physicianForm,
            addPhysician,
            closeModal,
            closeValue,
            checkChangeInput,
            formRef,
            formData:store.getters.formTitle,
            arrayToObjectData,
            formTitleNames,
            submit,
            errorMsg
        };
    },
};
</script>
<style scoped>
.steps-action{
    float:right
}
</style>
