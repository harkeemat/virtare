<template>
<a-modal width="1000px"  :title="$t('appointmentCalendar.addAppointment.addAppointment')" centered :maskClosable="maskebale" @cancel="closeModal()" :footer="false">
    <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,1,'id','name'),'name','udid')"> </FormBaseComponents>
    <a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,1,'id','name'),'name','udid')" :model="appointmentForm" layout="vertical" @finish="submitForm" @finishFailed="onFinishFailed">
        <a-row :gutter="24">
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('appointmentCalendar.addAppointment.patient')" name="patientId" :rules="[{ required: true, message: $t('appointmentCalendar.addAppointment.patient')+' '+$t('global.validation')  }]">
                        <a-input v-if="isPatientSummary || isChat || patientId" v-bind:value="patientName" :disabled="true" size="large" />
                        <PatientDropDown listHeight="250" v-else :disabled="isPatientSummary || isChat ||patientId" v-model:value="appointmentForm.patientId" @handlePatientChange="handlePatientChange($event)" @change="checkChangeInput()" :close="closeValue" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.patientId?errorMsg.patientId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.careCoodinator')" name="staffId" :rules="[{ required: true, message: $t('global.careCoodinator')+' '+$t('global.validation')  }]">
                        <!-- <StaffDropDown v-model:value="appointmentForm.staffId" @handleStaffChange="handleStaffChange($event)" @change="checkChangeInput()" :close="closeValue" /> -->
                        <ArrayDataSearch v-if="patientStaff.length > 0 && appointmentForm.patientId"  v-model:value="appointmentForm.staffId" :globalCode="patientStaff" @change="checkChangeInput()" />
                        <a-input disabled v-else size="large" placeholder="Select patient with assigned health team member"></a-input>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.staffId?errorMsg.staffId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('appointmentCalendar.addAppointment.startDate')" name="startDate" :rules="[{ required: true, message: $t('appointmentCalendar.addAppointment.startDate')+' '+$t('global.validation') }]">
                        <DateField :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" v-model:value="appointmentForm.startDate" format="DD, MMM YYYY" value-format="YYYY-MM-DD" :size="size"  @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.startDate?errorMsg.startDate[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.startTime')" name="startTime" :rules="[{ required: true, message: $t('global.startTime')+' '+$t('global.validation') }]">
                        <a-time-picker :minute-step="15"  format="hh:mm A" v-model:value="appointmentForm.startTime" :size="size" style="width: 100%" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.startTime?errorMsg.startTime[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.duration') +' '+$t('global.time')" name="durationId" :rules="[{ required: true, message: $t('global.duration') +' '+$t('global.time')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown  v-model:value="appointmentForm.durationId" :dataId="31" @handleGlobalChange="handleGlobalChange($event,'appointmentForm.durationId'); checkChangeInput()" :close="closeValue"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.durationId?errorMsg.durationId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="'Time Zone'" name="timezoneId" :rules="[{ required: true, message: 'Time Zone'+' '+$t('global.validation')  }]">
                         <TimeZoneDropDown  listHeight="200" v-model:value="appointmentForm.timezoneId" @handleTimeZoneChange="handleTimeZoneChange($event); checkChangeInput()" :close="closeValue" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.timezoneId ? errorMsg.timezoneId[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('appointmentCalendar.addAppointment.typeOfVisit')" name="typeOfVisit" :rules="[{ required: true, message: $t('appointmentCalendar.addAppointment.typeOfVisit')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown  v-model:value="appointmentForm.typeOfVisit" :dataId="1" @handleGlobalChange="handleGlobalChange($event,'appointmentForm.typeOfVisit'); checkChangeInput()" :close="closeValue"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.appointmentTypeId?errorMsg.appointmentTypeId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="'Priority'" name="flag" :rules="[{ required: true, message: $t('common.flag')+' '+$t('global.validation')  }]">
                        <ArrayDataSearch v-model:value="appointmentForm.flag" :globalCode="flagsList" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.flag[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="24">
                <div class="form-group">
                    <a-form-item :label="$t('appointmentCalendar.addAppointment.note')" name="note" :rules="[{ required: true, message: $t('appointmentCalendar.addAppointment.note')+' '+$t('global.validation') }]">
                        <a-textarea v-model:value="appointmentForm.note" allow-clear @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.note?errorMsg.note[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="24">
                <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
            </a-col>
        </a-row>
    </a-form>
    <Loader />
</a-modal>
</template>

<script>
import {
    ref,
    watchEffect,
    computed,
    reactive,
    onMounted
} from "vue"
import {
    useStore
} from "vuex"
import ErrorMessage from "../common/messages/ErrorMessage"
import moment from 'moment';
import dayjs from 'dayjs';
import FormButtons from "@/components/common/button/FormButtons";
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue"
import TimeZoneDropDown from "@/components/modals/search/TimeZoneSearch.vue"
// import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue"
import {
    useRoute
} from 'vue-router'
import { timeStamp, disableHours, warningSwal,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import {
    messages
} from "@/config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import Loader from "@/components/loader/Loader";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import DateField from "@/components/modals/search/DateField.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
    components: {
    ErrorMessage,
    FormButtons,
    PatientDropDown,
    // StaffDropDown,
    Loader,
    GlobalCodeDropDown,
    TimeZoneDropDown,
    ArrayDataSearch,
    DateField,
    FormBaseComponents
},
    props: {
        staff: {
            type: Object
        },
        patient: {
            type: Object
        },
        maskebale: {
            type: Boolean
        },
        patientId: {
            type: Number
        },
        patientName: {
            type: String
        },
        isChat: {
            type: Boolean
        },
    },
    setup(props, {
        emit
    }) {
        const formRef = ref();
        const route = useRoute();
        const store = useStore()
        const staffData = ref([]);
        const patientData = ref([]);
        const patientUdid = route.name == 'PatientSummary' ? route.params.udid : props.patientId;
        const disabled = ref(false)
        const isPatientSummary = ref(false)
        const closeValue = ref(false)

        const filterOption = (input, option) => {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        const appointmentForm = reactive({
            patientId: '',
            staffId: '',
            startDate: '',
            startTime: '',
            durationId: '',
            typeOfVisit: '',
            flag: '',
            note: '',
            timezoneId:''
        });

        const flagsList = computed(() => {
            return store.state.flags.flagsList
        })
        const patientStaff = computed(() => {
        return store.state.appointment.patientStaff
      })

        onMounted(() => {
            store.state.flags.flagsList ? '' : store.dispatch('flagsList')
        })

        watchEffect(() => {

            if (props.patientId != null) {
                Object.assign(appointmentForm, {
                    patientId: props.patientId
                })
                store.dispatch('patientStaff', patientUdid)
                disabled.value = true
                if (route.name == "PatientSummary") {
                    isPatientSummary.value = true
                }
            }

        })

        const handleStaffChange = (val) => {
			store.commit('checkChangeInput', true)
            appointmentForm.staffId = val;
        };

        const handleTimeZoneChange = (val) => {
			store.commit('checkChangeInput', true)
            appointmentForm.timezoneId = val;
        };

        const handlePatientChange = (val) => {
			store.commit('checkChangeInput', true)
            appointmentForm.patientId = val;
            store.dispatch('patientStaff', val)
        };

        const onFinishFailed = () => {
            //
        };

        const list = ref([])
        const durationList = computed(() => {
            return store.state.common.duration;
        })
        const typeOfVisitList = computed(() => {
            return store.state.common.typeOfVisit;
        })

        // const allPatients = computed(() => {
        //     return store.state.common.allPatientsList
        // })

        const staffList = props.staff ? reactive(props.staff) : computed(() => {
            return store.state.common.allStaffList
        })
        const errorMsg = computed(() => {
            if (store.state.careCoordinator.errorMsg) {
                // scrollToTop()
            }
            return store.state.careCoordinator.errorMsg
        })
        const date= ref()
        const submitForm = () => {
            store.state.careCoordinator.errorMsg = null
            date.value = appointmentForm.startDate
            
            const timeFormat = (dayjs(appointmentForm.startTime)).format('HH:mm');
            store.dispatch('addAppointment', {
                patientId: patientUdid ? patientUdid : appointmentForm.patientId,
                staffId: appointmentForm.staffId,
                startDate: appointmentForm.startDate ? timeStamp(date.value + " " + timeFormat) : "",
                startTime: appointmentForm.startTime ? timeFormat : "",
                durationId: appointmentForm.durationId,
                appointmentTypeId: appointmentForm.typeOfVisit,
                note: appointmentForm.note,
                flag: appointmentForm.flag,
                timezoneId:appointmentForm.timezoneId
            }).then((resp) => {
                if(resp==true){
                    closeValue.value = true;
                            setTimeout(()=>{
                                closeValue.value = false;
                            },100)
                    if (props.patientId != null && route.name == 'PatientSummary') {
                        
                        store.dispatch('latestAppointment', patientUdid)
                        store.dispatch('patientAppointmentsList', patientUdid)
                        store.dispatch('patientTimeline', {
                            id: patientUdid,
                            type: ''
                        });
                    }
                    if (store.state.appointment.appointmentSuccessMsg) {
                        
                        store.dispatch("calendarDateSelect", moment(date))
                        store.state.appointment.appointmentSuccessMsg = null
                        emit('is-visible', {
                            check: false,
                            date: moment(date.value)
                        });
                        emit('is-heardeVisible', {
                            check: false,
                            date: moment(date.value)
                        });
                        handleCancel()
                    }
                    if (props.isChat) {
                        store.dispatch('latestAppointment', patientUdid)
                        store.dispatch('patientAppointmentsList', patientUdid)
                    }
                    emit("closeModal", {
                        modal: 'addAppointment',
                        value: false
                    });
                }
				
            });
			
            store.commit('checkChangeInput', false)
        }

       
        const form = reactive({
            ...appointmentForm
        })

        const handleCancel = () => {
			closeValue.value = true
            formRef.value.resetFields();
            Object.assign(appointmentForm, form)
            //emit('is-visible', false);
			closeValue.value = false
        };

        function checkChangeInput() {
            store.state.careCoordinator.errorMsg = ''
            store.commit('checkChangeInput', true)
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        })

        function closeModal() {
            emit('is-visible', {
                            check: true,
                            date: ''
                        });
                        emit("closeModal", {
                        modal: 'addAppointment',
                        value: true
                    });
            if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        store.state.appointment.appointmentSuccessMsg = null
                        closeValue.value = true
                        setTimeout(() => {
                            closeValue.value = false
                        }, 100)
                        handleCancel();
                        emit('is-visible', {
                            check: false,
                            date: moment(date.value)
                        });
                        emit("closeModal", {
                            modal: 'addAppointment',
                            value: false
                        });
                        emit('is-heardeVisible', false);
                        store.commit('checkChangeInput', false)
                    } else {
                        emit("is-visible", true);
                        emit("closeModal", {
                            modal: 'addAppointment',
                            value: true
                        });
                    }
                });
            } else {
                formRef.value.resetFields();
                emit('is-visible', {
                            check: false,
                            date: moment(date.value)
                        });
                        emit("closeModal", {
                            modal: 'addAppointment',
                            value: false
                        });
            }
        }

       // function getTime() {
            // let timeSelect = timeStamp(appointmentForm.startTime)
            // if (timeStampFormate(timeSelect, 'HH:00') < '08:00' || timeStampFormate(timeSelect, 'HH:00') > '20:00') {
            //     appointmentForm.startTime = ''
            // }
        //}

        const handleGlobalChange = (data,type) =>{
            if(type =='appointmentForm.durationId'){
                appointmentForm.durationId = data
            }
            if(type=='appointmentForm.typeOfVisit'){
                appointmentForm.typeOfVisit = data
            }
        }

        return {
            patientStaff,
            handleGlobalChange,
            handleTimeZoneChange,
            checkFieldsData,
            checkChangeInput,
            handlePatientChange,
            handleStaffChange,
            loadingStatus: store.getters.loadingStatus,
            staffData,
            patientData,
            // allPatients,
            form,
            errorMsg,
            staffList,
            appointmentForm,
            submitForm,
            durationList,
            typeOfVisitList,
            size: ref("large"),
            onFinishFailed,
            handleCancel,
            moment,
            dayjs,
            formRef,
            list,
            closeModal,
            disabled,
            isPatientSummary,
            filterOption,
            closeValue,
            disableHours,
            flagsList,
            formData:store.getters.formTitle,
            arrayToObjectData,
            formTitleNames
        };
    },
};
</script>
