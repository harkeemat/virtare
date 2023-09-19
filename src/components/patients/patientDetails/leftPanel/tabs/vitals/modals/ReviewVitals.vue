<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="reviewVitalsForm" :label-col="{ span: 24 }" :wrapper-col="wrapperCol" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Review Vitals</a-typography-title>
        </a-col>

        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item label="Reviewed" class="required" name="reviewStatus" :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox @onSearch="search" @change="onChange" v-model:value="reviewVitalsForm.reviewStatus" :globalCode="vitalsStore.reviewStatus" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Comment" class="required" name="reviewedComment" :rules="[{ required: true, message: $t('global.required') }]">
                <Textarea v-model:value="reviewVitalsForm.reviewedComment" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" :name="'Cancel'" />
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="vitalsStore.buttonLoader" :disabled="disabledSave" />
    </div>
  </a-form>
  <PatientVitalsLoader />
</template>

<script setup>
  import {
		computed,
    // defineProps,
    // defineEmits,
		onMounted,
		ref
  } from "vue";
  import { reactive } from "vue";
  import Button from "@/components/button/Button.vue";
  import { useStore } from "vuex";
  import SelectBox from "@/components/form-fields/SelectBox";
  import Textarea from "@/components/form-fields/Textarea";
  import { useRoute } from "vue-router";
  import {
    closeAction,
  } from '@/commonMethods/commonMethod.js';
  import PatientVitalsLoader from '@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader';

  const props = defineProps({
    activeTab: String,
    deviceId: Number,
    vitalsId: String,
    vitalType: String,
  })

  const emit = defineEmits([
    'hideDrawer'
  ])

  const store = useStore()
  const route = useRoute()
  const disabledSave = ref(false)

  const vitalsStore = computed(() => {
    return store.state.vitals
  })

  const vitalTypeValue = computed(() => {
    return store.state.vitals.vitalTypeValue
  })

  const endParams = computed(() => {
    return store.state.vitals.endParams
  })

  const reviewVitalsForm = reactive({
    reviewStatus: "",
    reviewedComment: "",
  })
  const form = reactive({...reviewVitalsForm})
  onMounted(() => {
    store.dispatch('vitals/reviewStatus')
  })

  const onChange = (value) => {
    reviewVitalsForm.reviewStatus = value;
  }

  const search = value => {
    /** check searched value present is in list */
    let isValuePresent = vitalsStore.value?.reviewStatus.find(({name}) => new RegExp(value,'i').test(name));
    if(typeof isValuePresent === 'undefined') {
      reviewVitalsForm.reviewStatus = value;
    }

  }

  const submitForm = () => {
    disabledSave.value = true
    let data = {
      reviewStatus: reviewVitalsForm.reviewStatus,
      reviewedComment: reviewVitalsForm.reviewedComment,
      udid: props.vitalsId,
    }

    store.dispatch('vitals/reviewVitals', {
      patientId: route.params.udid,
      data: data,
    }).then((status) => {
      if(status) {
        closeAction('reviewVitals')

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

        onClose()
      }
    })
  }

  const onClose = () => {
    Object.assign(reviewVitalsForm,form)
    emit('hideDrawer')
    disabledSave.value = false
  }
</script>
