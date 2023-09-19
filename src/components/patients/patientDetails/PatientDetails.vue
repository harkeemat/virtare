<template>
 <!-- arrayToObjectData(screensPermissions, 293, 'id') -->
  <div v-if="notesRecord?.pinNotes?.length > 0" class="patientAlertMessage">
    <a-carousel arrows :dots="false">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="right:80px;left: auto; z-index: 1">
          <img src="@/assets/images/icons/left-arrow-circle.svg" />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 50px">
          <img src="@/assets/images/icons/right-arrow-circle.svg" />
        </div>
      </template>

      <div class="carousel-item" v-for="notesData in notesRecord.pinNotes" :key="notesData?.udid">
        <img v-if="notesData.pin && notesData.type!='patientVital' && notesData.type!='escalation'" src="@/assets/images/icons/alert-triangle.svg" />
        <img v-else-if="notesData.type!='patientVital' && notesData.type!='escalation'" src="@/assets/images/icons/alert-triangle.svg" />
        <img v-else-if="notesData.type=='escalation'" src="@/assets/images/icons/escalation.svg">
         <!-- <MenuIcons v-else-if="notesData.type=='escalation'" icon="escalation" /> -->
        <a-typography-text :title="notesData.note">{{ notesData.note }}</a-typography-text>
        <img class="close-message" v-if="notesData.udid" @click="closePinNote(notesData)" src="@/assets/images/icons/cross.svg" />
      </div>
    </a-carousel>
    

  </div>
  <div :class="
    notesRecord?.pinNotes?.length > 0
      ? 'common-wrapper message'
      : 'common-wrapper'">
    <a-row>
      <!-- Top Section -->
      <TopSection />
    </a-row>
      <a-row>
      <!-- Tabs -->
      <PatientDetailsTabs />
    </a-row>
  </div>

    <WarningModal
      v-model:visible="showAlert"
      title="Warning!"
      bodyText="Your activities session time will be lost."
      cancelBtnText="Leave Page"
      okBtnText="Save Session"
      @leavePage="leavePage"
      @saveSession="saveSession" />

  <!-- <PatientsLoader /> -->

  <a-drawer placement="right" :closable="false" v-if="visibleTimeLogForm" :visible="visibleTimeLogForm" width="60%">
    <TimeLogForm @onClose="closeTimeLogModal" @redirectRoute="redirectRoute" :onPageLeave="true" />
  </a-drawer>
</template>

<script>
import PatientDetailsTabs from "@/components/patients/patientDetails/leftPanel/PatientDetailsTabs";
import TopSection from "@/components/patients/patientDetails/topSection/TopSection";
import { useStore } from "vuex";
import TimeLogForm from "@/components/patients/patientDetails/topSection/modals/TimeLogForm";
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { arrayToObjectData } from '@/commonMethods/commonMethod';
import MenuIcons from "@/components/layout/sidebar/icons/MenuIcons.vue";
import WarningModal from "@/components/common/confirmModals/WarningModal"
import {
  resumeTimer,
  saveTime,
} from "@/services/patientTimer/services/patientTimer.js";
import {
  DashboardOutlined,
} from "@ant-design/icons-vue";
import { stopTimer } from '@/commonMethods/commonMethod';
import { hmsToSeconds } from '@/commonMethods/commonMethod';

export default {
  components: {
    PatientDetailsTabs,
    TopSection,
    TimeLogForm,
    WarningModal,
    DashboardOutlined,
    MenuIcons
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isIdle = ref(true)

    const showAlert = ref(false);

    const leaveDetailsPage = computed(() => {
      return store.state.patientsStore.leaveDetailsPage
    })

    const patientId = ref(route?.params?.udid);
    const visibleTimeLogForm = ref(false)

    const notesRecord = store.getters.notesRecord

    const patientInformation = computed(() => {
      return store.state.patientsStore.patientInformation;
    });

    const isBillingLogged = computed(() => {
      return store.state.patientsStore.isBillingLogged;
    });

    const patientTimerValue = computed(() => {
      return store.state.patientsStore.patientTimerValue
    })

    onMounted(() => {
      store.dispatch("accessPatient", {
        patientId: patientId.value,
        data: {
          action: 'in'
        }
      })
      isIdle.value = true
      store.commit('isBillingLogged', false)
      store.commit('leaveDetailsPage', false)
      sessionStorage.removeItem("chatSession");
      store.dispatch("patientInformation", patientId.value)
      store.commit("vitals/patientBloodPressureGraph", null)
      store.commit("vitals/patientHeartRateGraph", null)
      store.commit("vitals/patientOxygenSaturationGraph", null)
      store.commit("vitals/patientGlucoseGraph", null)
      store.dispatch("pinNotes", { id: patientId.value })
      store.commit("patientsLoaderStatus", true);
    });

    onBeforeMount(() => {
      stopTimer('notLeavingPage')

      window.addEventListener("change", (event) => {
        event.preventDefault()
      });

      /* window.addEventListener("visibilitychange", (event) => {
        event.preventDefault()
        console.log('visibilitychange')
      }); */

      window.addEventListener("beforeunload", (event) => {
        if(!isBillingLogged.value) {
          if(!leaveDetailsPage.value) {
            event.returnValue = "Your activities session time will be lost."
            event.preventDefault()
          }
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('beforeunload', () => {})
    })

    const redirectRoute = () => {
      isIdle.value = false
      leavePage()
    }

    const closePinNote = (event) => {
      if (store.state.common.loading === false) {
        //change status of pin notes and remove from pin list 
        store.dispatch('statusChangePinNotes', { data: { noteId: event.udid, status: true,type:event.type }, id: patientId.value }).then((res) => {
          if (res) {
            let result = notesRecord.value.pinNotes
            //store.state.patientsNotes.pinNotes = []
            store.dispatch("patientNotesList", { id: route?.params?.udid })
            setTimeout(() => {
              store.commit("pinNotes", { data: result.filter(({ udid }) => udid != event.udid) })
            }, 1)
          }
        })
      }
      // if (store.state.common.loading === false) {
      //   //change status of pin notes and remove from pin list
      //   store.dispatch('statusChangePinNotes', { id: patientId.value }).then((res) => {
      //     if (res) {
      //       store.state.patientsNotes.pinNotes = []
      //     }
      //   })
      // }
    }

    onBeforeRouteLeave((to, from, next) => {
      localStorage.setItem('nextRouteToGo', to.fullPath)
      if(!isBillingLogged.value) {
        if(!leaveDetailsPage.value) {
          showAlert.value = true
        }
        else {
          next()
          localStorage.removeItem('nextRouteToGo')
          stopTimer('leavingPage')
        }
      }
      else {
        next()
      }
    })

    const leavePage = () => {
      store.dispatch("accessPatient", {
        patientId: patientId.value,
        data: {
          action: 'out',
          isIdle: isIdle.value,
          totalTimeSpent: !isIdle.value ? null : hmsToSeconds(patientTimerValue.value)
        }
      }).then((res) => {
        if(res) {
          store.commit('patientInfoSuccess', false)
          store.commit('patientTimerStatus', '')
          // store.commit('patientTimerValue', null)
        }
      })
      store.commit('leaveDetailsPage', true)
      let url = localStorage.getItem('nextRouteToGo')
      router.push(url)
    }

    const saveSession = () => {
      store.commit('leaveDetailsPage', false)
      showAlert.value = false
      saveTime()
      visibleTimeLogForm.value = true
    }

    const closeTimeLogModal = () => {
      resumeTimer()
      visibleTimeLogForm.value = false
    }

    return {
      patientInformation,
      notesRecord,
      closePinNote,
      arrayToObjectData,
      screensPermissions : store.getters.screensPermissions,
      visibleTimeLogForm,
      closeTimeLogModal,
      redirectRoute,
      showAlert,
      leavePage,
      saveSession,
    };
  },
};
</script>
