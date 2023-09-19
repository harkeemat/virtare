<template>
    <a-form class="common-form" :model="state.notes" @finish="submitForm" ref="formRef" :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <div class="drawerBody" ref="drawerBody">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-typography-title :level="2" class="common-heading">Add Notes</a-typography-title>
                </a-col>
                <a-col :span="24">
                    <a-row :gutter="[48, 16]">
                        <a-col :span="24">
                            <a-form-item :label="$t('patient.medical.note')" class="required" name="note"
                                :rules="[{ required: true, message: $t('global.required') }]">
                                <!-- <Textarea  /> -->
                               <!-- <a-textarea v-model:value="state.notes.note" :rows="20" :style="{height:notesHight+' px'}"  /> -->
                               <a-textarea v-model:value="state.notes.note" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('patient.notes.category')" name="category" :rules="[
                                {
                                    required: false,
                                    message: $t('global.required'),
                                },
                            ]">
                                <AutoComplete v-model:value="state.notes.category"  :record="notesRecord?.autoCompleteCategory"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" >
                            <a-form-item :label="$t('patient.notes.notesType')"  name="notesTypeId" v-if="authUser?.type==0">
                                <a-checkbox  class="custom-checkbox"  v-model:checked="state.notes.notesTypeId" >{{ $t('patient.notes.internal') }}</a-checkbox>
                            </a-form-item>
                        </a-col>

                        <a-col :span="12">
                            <a-form-item  name="pin">
                                <a-checkbox class="custom-checkbox"  v-model:checked="state.notes.pin">{{ $t('patient.notes.pin') }}</a-checkbox>
                            </a-form-item>
                        </a-col>
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

<script>
import { onMounted, reactive, ref } from 'vue'
import Textarea from "@/components/form-fields/Textarea";
//import SelectBox from "@/components/form-fields/SelectBox.vue"
import AutoComplete from "@/components/form-fields/AutoComplete"
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import Button from "@/components/button/Button.vue";
export default {
    components: {
        Textarea,
        //SelectBox,
        Button,
        AutoComplete
    },
    setup(props, { emit }) {
        const formRef = ref()
        const store = useStore()
        const route = useRoute()
        const common = store.getters.commonRecords
        const notesRecord = store.getters.notesRecord
        const authUser = JSON.parse(localStorage.getItem("auth"))
        const state = reactive({
            notes: {
                note: '',
                category: '',
                notesTypeId:false,
                pin: false
            }
        })
        const form = reactive({ ...state.notes });
        const drawerBody = ref(null);
        const notesHight = ref(20)

        onMounted(() => {
            store.dispatch('autoCompleteCategory',{id:route?.params?.udid});
            notesHight.value = drawerBody.value.clientHeight*(60/100)
        })
        const submitForm = () => {
            store.dispatch("addPatientNotes", { id: route?.params?.udid, data: state.notes }).then((res) => {
                if (res) {
                        store.state.patientsNotes.pinNotes = []
                        store.dispatch("pinNotes", { id: route?.params?.udid })
                        store.dispatch("patientNotesList", { id: route?.params?.udid })
                    onClose()
                }
            })
        }
        const onClose = () => {
            //close form
            store.commit('loading', false)
            formRef.value?.resetFields();
            Object.assign(state.notes, form)
            emit('onClose', false)
        };
        const notesTypeChange = (event) =>{
            if(event.target.checked){
                state.notes.notesTypeId = 1
            }else{
                state.notes.notesTypeId = 2
            }
        }
        return {
            notesTypeChange,
            formRef,
            onClose,
            store,
            state,
            submitForm,
            labelCol: { span: 24 },
            common,
            notesRecord,
            drawerBody,
            notesHight,
            authUser
        }
    }
}
</script>
<style scoped lang="scss">
    textarea.ant-input {
        min-height: calc(100vh - 420px)!important;
    }
</style>