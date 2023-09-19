<template>
    <a-form class="common-form" ref="formRef" :label-col="{ span: 24 }" :wrapper-col="wrapperCol" @finish="submitForm" :model="reviewVitalsForm">
        <div class="drawerBody">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-typography-title :level="2" class="common-heading">Vital detail</a-typography-title>
                </a-col>

                <a-col :span="24">
                    <a-row :gutter="[48, 16]">
                        <a-col :span="6" v-for="vital, index in patientsVitalDetails?.vitals" :key="index">
                            <div class="vital-detail">
                                <a-typography-title :level="3">{{ vital }}</a-typography-title>
                                <a-typography-text :style="{'text-transform': index == 'bpm' ? 'uppercase' : 'capitalize'}">{{ index }}</a-typography-text>
                            </div>
                        </a-col>
                        <a-col :span="6" v-if="patientsVitalDetails?.color">
                            <div class="vital-detail">
                                <span class="patient-status" :style="{'background-color': patientsVitalDetails?.color}"></span>
                                <a-typography-text>Status</a-typography-text>
                            </div>
                        </a-col>
                    </a-row></a-col>
                <a-col :span="24">
                    <a-row :gutter="[48, 16]">
                        <a-col :span="12">
                            <a-form-item label="Date">
                                <DateField :value="patientsVitalDetails?.date" :globalDateFormat="globalDateFormat" style="width: 100%" disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="Time">
                                <TimePicker :value="patientsVitalDetails?.time" :globalTimeFormat="globalTimeFormat" style="width:100%" disabled />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="Time Zone">
                                <InputFields :value="patientsVitalDetails?.time_zone" disabled/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="Reviewed By">
                                <InputFields :value="patientsVitalDetails?.reviewedBy" disabled/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="POSTED TYPE">
                                <InputFields :value="patientsVitalDetails?.postedType" disabled/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="DEVICE TYPE">
                                <InputFields :value="patientsVitalDetails?.deviceType" disabled/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="REVIEW STATUS">
                                <InputFields :value="patientsVitalDetails?.reviewStatus == 0 ? '' : patientsVitalDetails?.reviewStatus" disabled/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="COMMENT">
                                <Textarea :value="patientsVitalDetails?.reviewedComment" disabled/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>

                <a-col :span="24" v-if="patientsVitalDetails?.reviewStatus == 0 && rolesPermissionFind(screensPermissions, [530])">
                    <div class="form-heading">
                        <a-typography-title :level="3">Review Vital</a-typography-title>
                        <a-typography-text>Review patient vital</a-typography-text>
                    </div>
                </a-col>
                <a-col :span="24" v-if="patientsVitalDetails?.reviewStatus == 0 && rolesPermissionFind(screensPermissions, [530])">
                    <a-row :gutter="[48, 16]">
                        <a-col :span="12">
                        <a-form-item label="Reviewed" class="required" name="reviewStatus" :rules="[{ required: true, message: $t('global.required') }]">
                            <SelectBox @onSearch="search" @change="onChange" v-model:value="reviewVitalsForm.reviewStatus" :globalCode="vitalsStore.reviewStatus" :disabled="!isReview" />
                        </a-form-item>
                        </a-col>
                        <a-col :span="24">
                        <a-form-item label="Comment" class="required" name="reviewedComment" :rules="[{ required: true, message: $t('global.required') }]">
                            <Textarea v-model:value="reviewVitalsForm.reviewedComment" :disabled="!isReview" />
                        </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>

        </div>
        <div class="drawerFooter" :class="patientsVitalDetails?.reviewStatus == 0 && rolesPermissionFind(screensPermissions, [530]) && !isReview ? `justifyBet` : ``">
            <Button v-if="patientsVitalDetails?.reviewStatus == 0 && rolesPermissionFind(screensPermissions, [530]) && !isReview" classData="primary-btn"  :name="'Review'" @click="enableReview"/>
            <a-space align="right">
            <Button classData="secondary-btn" :name="'Cancel'" @click="onClose"/>
            <Button classData="primary-btn" html-type="submit" v-if="patientsVitalDetails?.reviewStatus == 0 && rolesPermissionFind(screensPermissions, [530])" :name="'Save'" />
            </a-space>
        </div>
    </a-form>
</template>

<script  setup>
    import InputFields from "@/components/form-fields/InputFields.vue";
    import Button from "@/components/button/Button.vue";
    import SelectBox from "@/components/form-fields/SelectBox";
    import Textarea from "@/components/form-fields/Textarea";
    import DateField from "@/components/modals/search/DateField.vue";
    import TimePicker from "@/components/form-fields/TimePicker";
    import {
        computed,
        // defineEmits,
        // defineProps,
        onMounted,
        reactive,
        onUnmounted,
        ref,
    } from "vue";
    import { useStore } from "vuex";
    import {
        openAction,
        closeAction,
    } from '@/commonMethods/commonMethod.js';
    import { useRoute } from "vue-router";
    import { globalDateFormat, globalTimeFormat } from '@/commonMethods/commonMethod';
    import { rolesPermissionFind } from '@/commonMethods/commonMethod';

    const store = useStore()
    const route = useRoute()

    const screensPermissions = store.getters.screensPermissions

    const props = defineProps({
        activeTab: String,
        deviceId: Number,
        vitalsId: String,
    })

    const emit = defineEmits([
        'hideDrawer'
    ])


    const formRef = ref()
    const isReview = ref(false)

    const reviewVitalsForm = reactive({
        reviewStatus: "",
        reviewedComment: "",
    })
    const reviewVitalsFormReactive = reactive({ ...reviewVitalsForm })

    onMounted(() => {
        Object.assign(reviewVitalsForm, reviewVitalsFormReactive)
        formRef.value.resetFields()
        store.dispatch('vitals/reviewStatus')
    })

    onUnmounted(() => {
       isReview.value = false;
    });
    const vitalsStore = computed(() => {
        return store.state.vitals
    })

    const patientVitalId = computed(() => {
        return store.state.vitals.patientVitalId
    })

    const patientsVitalDetails = computed(() => {
        return store.state.vitals.patientsVitalDetails
    })

    /* const patientActionTimerValue = computed(() => {
        return store.state.common.patientActionTimerValue
    }) */

    const onClose = () => {
        emit('hideDrawer',false)
        store.commit('vitals/patientVitalId', null)
    }

    const enableReview = () => {
        openAction()  // Add Action Name
        isReview.value = true
    }

    const search = value => {
        let isValuePresent = vitalsStore.value?.reviewStatus.find(({name}) => new RegExp(value,'i').test(name));
        if(typeof isValuePresent === 'undefined') {
            reviewVitalsForm.reviewStatus = value;
        }
    }

    const onChange = (value) => {
        reviewVitalsForm.reviewStatus = value;
    }

    const vitalTypeValue = computed(() => {
        return store.state.vitals.vitalTypeValue
    })

  const endParams = computed(() => {
    return store.state.vitals.endParams
  })

  const submitForm = () => {
    let data = {
      reviewStatus: reviewVitalsForm.reviewStatus,
      reviewedComment: reviewVitalsForm.reviewedComment,
      udid: props.vitalsId != null ? props.vitalsId : patientVitalId.value,
    }

    store.dispatch('vitals/reviewVitals', {
      patientId: route.params.udid,
      data: data,
    }).then((status) => {
      if(status) {
        closeAction('reviewVitals')

        store.commit('vitals/patientVitalId', null)
        store.dispatch('vitals/patientVitalsTable', {
          patientId: route.params.udid,
          deviceType: props?.deviceId,
          activeTab: props?.activeTab,
          endParams: endParams.value,
        })
        if(props?.deviceId == 101) {
          store.dispatch('vitals/patientVitalsGraph', {
            patientId: route.params.udid,
            deviceType: props?.deviceId,
            activeTab: props?.activeTab,
            vitalType: vitalTypeValue.value,
          })
        }
        else {
          store.dispatch('vitals/patientVitalsGraph', {
            patientId: route.params.udid,
            deviceType: props?.deviceId,
            activeTab: props?.activeTab,
          })
        }
        store.dispatch('patientInformation', route.params.udid)
        store.dispatch('patientNotesList',{id:route.params.udid})
        store.dispatch('vitals/patientLatestVitals', route.params.udid)
        emit('hideDrawer')
      }
    })
  }
</script>
