<template>
  <div class="callRightWrapper chatBoxRight">
    <span  v-if="!isDetails" class="dragImg" @mousedown="resize($event)"  @touchstart="resize($event)"><img src="@/assets/images/drag.png" alt="" /></span>
    <div class="header">
      <a-row>
        <a-col :span="12">
            <PatientInfoTop :patientUdid="patientUdid" />
        </a-col>
        <a-col :span="12">
          <a-row>
            <PatientTimelineIcon :isBold="timelineDetailVisible" @onClick="showTimelineModal" :patientId="patientUdid" />
            <PatientNotesIcon :isBold="notesDetailVisible" @onClick="showNotesModal" :patientId="patientUdid" />
            <PatientDocumentsIcon :isBold="documentDetailVisible" @onClick="showDocumentsModal" :patientId="patientUdid" />
            <PatientVitalsIcon :isBold="patientVitalsVisible" @onClick="showVitalsModal" :patientId="patientUdid" />
            <PatientAppointmentsIcon :isBold="patientAppointmentsVisible" @onClick="showAppointments" :patientId="patientUdid" />
            <PinIcon @onClick="addPin" />
            <StartCall v-if="isChat && !isDetails" :patientId="patientUdid" />
            <a-col :span="8" v-if="currentUrl && !isChat">
              <div class="moreAction" @click="copyURL(currentUrl)">
                <div class="moreActionImg purpleBgColor">
                  <CopyFilled />
                </div>
                <p>Copy Url</p>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>

    <div class="body">
      <!-- <a-row :gutter="24"> -->
        <!-- <a-col :span="24"> -->
          <!-- <Pins v-if="patientPins && patientPins.length > 0" :patientPins="patientPins" :patientUdid="patientUdid" /> -->
        <!-- </a-col> -->
      <!-- </a-row> -->
     
        <Pins v-if="patientPins && patientPins.length > 0" :patientPins="patientPins" :patientUdid="patientUdid" />
        <PatientTimeline v-if="timelineDetailVisible == true" :isCommunication="true" :profileId="patientUdid" className="thumbDesc patientTimeline"/>
        <NotesDetail v-if="notesDetailVisible == true" :isCommunication="true" :patientId="patientUdid" />
        <DocumentDetail v-if="documentDetailVisible == true" :isCommunication="true" :patientId="patientUdid" />
        <PatientVitalsGrid v-if="patientVitalsVisible == true" :isCommunication="true" :patientId="patientUdid" />
        <AppointmentsTable v-if="patientAppointmentsVisible == true" :patientId="patientUdid" />
        <AddPin v-model:visible="addPinModalVisible" :patientUdid="patientUdid" @closeModal="closeModal"/>
     
    </div>

  </div>
</template>

<script>
import PatientInfoTop from "@/components/patients/patientSummary/PatientInfoTop"
import PatientTimeline from "@/components/patients/patientSummary/PatientTimeline"
import Pins from "@/components/patients/patientSummary/common/CriticalNotes"
import {
  watchEffect,
  reactive,
  ref,
  computed,
  toRefs,
} from "vue"
import {
  useStore
} from "vuex"
import {
  dateFormat,
} from "@/commonMethods/commonMethod"
import NotesDetail from "@/components/video-call/table/NotesDetail"
import DocumentDetail from "@/components/video-call/table/DocumentDetail"
import AppointmentsTable from "@/components/communications/tables/AppointmentsTable"
import PatientVitalsGrid from "@/components/patients/patientSummary/views/PatientVitalsGrid"
import AddPin from "@/components/modals/CriticalNote"
import PatientTimelineIcon from "@/components/common/PatientTimelineIcon"
import PatientNotesIcon from "@/components/common/PatientNotesIcon"
import PatientDocumentsIcon from "@/components/common/PatientDocumentsIcon"
import PatientVitalsIcon from "@/components/common/PatientVitalsIcon"
import PatientAppointmentsIcon from "@/components/common/PatientAppointmentsIcon"
import PinIcon from "@/components/common/PinIcon"
import StartCall from "@/components/common/StartCall"
import { message } from "ant-design-vue";
import { CopyFilled } from "@ant-design/icons-vue";
import { useRoute } from 'vue-router'

export default {
  components: {
    PatientTimelineIcon,
    PatientNotesIcon,
    PatientDocumentsIcon,
    PatientVitalsIcon,
    PatientAppointmentsIcon,
    PinIcon,
    StartCall,
    PatientInfoTop,
    PatientTimeline,
    NotesDetail,
    DocumentDetail,
    AppointmentsTable,
    PatientVitalsGrid,
    Pins,
    AddPin,
    CopyFilled,
  },
  props: {
    communication: {
      type: Object
    },
    idPatient: {
      type: Number
    },
    isChat: {
      type: Boolean
    },
    currentUrl: {
      type: String
    },
    isDetails:Boolean
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const formValue = reactive({
      msgSend: ''
    })
    const notesDetailVisible = ref(false)
    const documentDetailVisible = ref(false)
    const patientVitalsVisible = ref(false)
    const patientAppointmentsVisible = ref(false)
    const timelineDetailVisible = ref(true)
    const addPinModalVisible = ref(false)
    var patientUdid =  reactive(props.idPatient?props.idPatient:route.params.udid)
    const patientId =  ref(null)
    const communications = props.communication ? reactive(props.communication) : null
    const isCommunicationWithPatient = ref(false)
    const tabvalue = reactive({
      tab: [],
    })

    const showTimelineModal = () => {
      patientVitalsVisible.value = false
      notesDetailVisible.value = false
      documentDetailVisible.value = false
      timelineDetailVisible.value = true
      patientAppointmentsVisible.value = false
    }

    const showNotesModal = () => {
      notesDetailVisible.value = true
      documentDetailVisible.value = false
      patientVitalsVisible.value = false
      patientAppointmentsVisible.value = false
      timelineDetailVisible.value = false
    }

    const showDocumentsModal = () => {
      documentDetailVisible.value = true
      notesDetailVisible.value = false
      patientVitalsVisible.value = false
      patientAppointmentsVisible.value = false
      timelineDetailVisible.value = false

    }
    const showVitalsModal = () => {
      patientVitalsVisible.value = true
      patientAppointmentsVisible.value = false
      notesDetailVisible.value = false
      documentDetailVisible.value = false
      timelineDetailVisible.value = false

    }
    
    const showAppointments = () => {
      patientVitalsVisible.value = false
      patientAppointmentsVisible.value = true
      notesDetailVisible.value = false
      documentDetailVisible.value = false
      timelineDetailVisible.value = false

    }

    const addPin = () => {
      addPinModalVisible.value=true
    }

    const scroll = ref()
    const auth = JSON.parse(localStorage.getItem("auth"))
    
    watchEffect(() => {
      store.state.communications.conversationList = ""
      store.commit('loadingStatus', false)
      setTimeout(() => {
        store.commit('loadingStatus', false)
      }, 3000)
      if(communications && communications.is_sender_patient) {
        patientUdid = communications.fromId
        patientId.value = communications.senderId
        isCommunicationWithPatient.value = true
      }
      else if(communications && communications.is_receiver_patient) {
        patientUdid = communications.toId
        patientId.value = communications.receiverId
        isCommunicationWithPatient.value = true
      }
      else {
        isCommunicationWithPatient.value = false
      }

      if(isCommunicationWithPatient.value) {
        store.dispatch("timeLineType")
      }
      if(route.name == "PatientSummary") {
        store.dispatch("program", route.params.udid)
      }
      else {
        store.dispatch("program", patientUdid)
      }
    })

    const list = store.getters.communicationRecord.value

    function closeModal() {
      store.state.communications.conversationList = ""
      addPinModalVisible.value = false
    }

    const patientPins = computed(() => {
      return store.state.patients.patientCriticalNotes
    })

    async function copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        message.success("Copied");
      } catch ($e) {
        message.error("Cannot copy");
      }
    }

    function resize() {
      window.addEventListener("mousemove", resizeDiv);
      window.addEventListener("touchmove", resizeDiv);
    }
    function resizeDiv(e) {
      if(e.clientX <= 1360) {
        let video_width = ((e.clientX - 50) / document.body.clientWidth) * 100;
        document.getElementById("videoDiv").style.width = video_width + "%";
      }
    }
    window.addEventListener("mouseup", () => {
    
      window.removeEventListener("mousemove", resizeDiv);
    });
      window.addEventListener("touchend", () => {
   
      window.addEventListener("touchmove", resizeDiv);
    });

    return {
      resize,
      resizeDiv,
      copyURL,
      list,
      formValue,
      dateFormat,
      closeModal,
      auth,
      scroll,
      showNotesModal,
      showDocumentsModal,
      showVitalsModal,
      showAppointments,
      addPin,
      showTimelineModal,
      addPinModalVisible,
      patientUdid,
      patientId,
      notesDetailVisible,
      documentDetailVisible,
      patientVitalsVisible,
      timelineDetailVisible,
      ...toRefs(tabvalue),
      timeLineType: store.getters.timeLineType,
      patientPins,
      patientAppointmentsVisible,

    }
  },
}
</script>

<style scoped>
/* .chatBoxDiv {
  height: 680px !important;
} */
.chatBox {
  height: 640px !important;
}
.patientTimeline {
  width: 100% !important;
}
.callButton {
  margin-bottom: 20px;
}
.anticon {
  color: #ffffff;
  font-size: 16px !important;
  position: relative !important;
  top: -2px !important;
}
.callRightWrapper {
  padding: 0!important;
  background-color: #fff!important;
}
.callRightWrapper .header {
    display: block;
    align-items: center;
    position: relative;
    background-color: #daeedb;
    padding: 15px;
}
.callRightWrapper .body {
  overflow-y: auto;
  max-height: calc(100vh - 420px);
  overflow-x: hidden;
}
.callRightWrapper .header .patientInfo .patientImg .info {
  margin-left: -50px !important;
}
</style>
