<template>
    <div  >
      <div class="common-bg">
        <a-row>
          <a-col :xl="6" :lg="6">
          <h2 class="pageTittle">{{$t('patientSummary.patientSummary')}}</h2>
        </a-col>
        <a-col :xl="18" :lg="18" >
            <div class="timer" @click="actionTrack(paramsId,288,'patient')" >
            <h3>{{$t('patientSummary.currentSession')}} : {{formattedElapsedTime}}</h3>
            <a-button v-if="(showStartTimer && !showPauseTimer) && arrayToObjact(screensPermissions,472)" type="primary" @click="startTimer">{{$t('patientSummary.startTimer')}}</a-button>
            <a-button v-if="(!showResumeTimer && showPauseTimer) && arrayToObjact(screensPermissions,472)" type="primary" @click="pauseTimer">{{$t('patientSummary.pauseTimer')}}</a-button>
            <a-button v-if="(showResumeTimer && !showStartTimer) && arrayToObjact(screensPermissions,472)" type="primary" @click="startTimer">{{$t('patientSummary.resumeTimer')}}</a-button>
            <a-button v-if="!showStartTimer && arrayToObjact(screensPermissions,472)" id="timer3" type="primary" @click="stopTimer" style="margin-left: 5px">{{$t('patientSummary.stopTimer')}}</a-button>
          </div>
          
        </a-col>
        <a-col :xl="12" :lg="12">
          <a-space>
            <a-button type="primary"  @click="sendMessage" v-if="conversationWithPatient != null">
              <template #icon><MessageOutlined /></template>
              Message
            </a-button>
              <SendMessage v-if="arrayToObjact(screensPermissions,109) && patientDetails" :patientId="{id:paramsId,name:patientDetails?.fullName,contactType:patientDetails?.contactType[0]}"></SendMessage>
              <a-button type="primary" @click="startCall" :loading="iconLoading">
                <template #icon><VideoCameraOutlined /></template>
               Call
            </a-button>
          </a-space>
        </a-col>
        <a-col :xl="12" :lg="12">
          <div class="pageTittle patientSummaryFilters">
            <div class="filter">
              <a-button @click="showButton(1) ; actionTrack(paramsId,285,'patient')" :class="button == 1 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 285)">Timeline</a-button>
              <a-button @click="showButton(2) ; actionTrack(paramsId,286,'patient')" :class="button == 2 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 286)">Care Plan</a-button>
              <a-button @click="showButton(3) ; actionTrack(paramsId,287,'patient')" :class="button == 3 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 287)">Patient Vitals</a-button>
              <a-button @click="showButton(4) ; actionTrack(paramsId,287,'patient')" :class="button == 4 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 287)">Escalation</a-button>
              <!-- <a-button @click="showButton(5) ; actionTrack(paramsId,287,'patient')" :class="button == 5 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 287)">Assigned Questionnaire</a-button>
              <a-button @click="showButton(6) ; actionTrack(paramsId,287,'patient')" :class="button == 6 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 287)">Assigned Custom From</a-button> -->
              <a-button @click="showButton(7) ; actionTrack(paramsId,287,'patient')" :class="button == 7 ? 'active' : ''" v-if="arrayToObjact(screensPermissions, 287)">Pending Task</a-button>
            </div>
          </div>
        </a-col>
        <a-col :sm="24">
          <CriticalNotes v-if="patientCriticalNotes && patientCriticalNotes.length > 0" />
        </a-col>
        <a-col :sm="24" :xs="24" style="margin:15px 0 0">
          <div>
            <PatientSummaryContent :patientId="paramsId" :buttonId="button" @deleteUser="deleteUser($event)"/>
          </div>
          <div v-if="button == 2">
            <CarePlanView/>
          </div>
          <div v-if="button == 3">
            <PatientVitalsView/>
          </div>
          <div v-if="button == 4">
            <Escalation :patientId="paramsId"/>
          </div>
          <div v-if="button == 6">
            <AddPatientGroupModal :patientId="paramsId"/>
          </div>
        </a-col>
      </a-row>
      </div>
    </div>
  <TimelineLoader/>
  <ChatWithPatientInformation v-model:visible="chatWithPatientInfoVisible" v-if="chatWithPatientInfoVisible && conversation" :communication="conversation" :conversationId="conversationId" :idPatient="receiverId" :timer="formattedElapsedTime" @pauseTimer="pauseTimer" @stopTimer="stopTimer" @startTimer="startTimer" />
  <VideoCallVue  v-if="videoModal && conferenceId" v-model:visible="videoModal" :conferenceId ="conferenceId"/>
  <AuditTimeLog v-if="visible" v-model:visible="visible" @saveAuditTimeLog="handleOk($event)" :Id="selectedRow" :editData="auditTimeLog" :confirm="true"/>
</template>

<script>
import PatientSummaryContent from "@/components/patients/patientSummary/views/PatientSummaryContent";
import CriticalNotes from "@/components/patients/patientSummary/common/CriticalNotes";
import ChatWithPatientInformation from "@/components/modals/ChatWithPatientInformation";
import dayjs from "dayjs"; 
import { ref, computed,onBeforeMount, onUnmounted,reactive, onMounted, defineAsyncComponent, watchEffect} from "vue";
import { useStore } from 'vuex';
import TimelineLoader from "@/components/loader/TimelineLoader"
import { onBeforeRouteLeave, useRoute,useRouter  } from 'vue-router';
import AuditTimeLog from "@/components/time-log-approval/AuditTimeLogs.vue";

import {
  getSeconds,
  actionTrack,
  enCodeStringVideoURL,
  arrayToObjact
} from '@/commonMethods/commonMethod';
import {
  MessageOutlined,
  VideoCameraOutlined
} from "@ant-design/icons-vue";
const value = ref(dayjs("12:08", "HH:mm"));
function clearEvent(event){
  event.returnValue = '';
}
    
export default {
  components: {
    MessageOutlined,
    VideoCameraOutlined,
    PatientSummaryContent,
    CriticalNotes,
    ChatWithPatientInformation,
    AddPatientGroupModal:defineAsyncComponent(()=>import('@/components/modals/AddPatientGroupModal')),
    TimelineLoader,
    AuditTimeLog,
    SendMessage:defineAsyncComponent(()=>import("@/components/communications/top/SendMessage")),
    VideoCallVue:defineAsyncComponent(()=>import('@/components/video-call/PatientVideoCall.vue')),
  },
  setup() {
    localStorage.removeItem('timeApprovalId')
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const patientUdid = route.params.udid
    const authUser =  JSON.parse(localStorage.getItem('auth'))
    const notevisible = ref(false);
    const devicevisible = ref(false);
    const documentvisible = ref(false);
    const addnotesvisible = ref(false);
    const timelogsvisible = ref(false);
    const bloodoxygenvisible = ref(false);
    const bloodglucosevisible = ref(false);
    const chatWithPatientInfoVisible = ref(false);
    const videoModal = ref(false)
    const isEditTimeLog = ref(false);
    const loader= ref(true)
    const visible =ref(false)
    const selectedRow = ref([])
    const showDiv = ref(false)
    const auditTimeLog = reactive({
      timeAmount: "",
      typeId: "",
    });
    const timeApprovalType = computed(() => {
      return store.state.common.timeApprovalType
    })
    const pendingApprovalStatus = computed(() => {
      return store.state.common.pendingApprovalStatus
    })
    const iconLoading = ref(false)
    const showStartTimer = computed(() => {
      return store.state.common.showStartTimer
    });
    const showPauseTimer = computed(() => {
      return store.state.common.showPauseTimer
    });
    const showResumeTimer = computed(() => {
      return store.state.common.showResumeTimer
    });
    const patientDetails = computed(()=>{
      return store.state.patients.patientDetails
    })

    watchEffect(()=>{
      if(route.params.udid && route.name == "PatientSummary"){
        patientDetail();
      }
    })

    const receiverId = ref(null)
    const screensPermissions = store.getters.screensPermissions
    onMounted(() => {
      localStorage.removeItem('cancelButton')
      if(route.name == "PatientSummary") {
        arrayToObjact(screensPermissions.value,472) ?  startTimer() : ''
        patientDetail();
      }
    })

    function patientDetail(){ 
      store.dispatch('patientDetails', route.params.udid).then(() => {
          receiverId.value = patientDetails.value?.user?.data?.id
          store.dispatch("program", patientUdid);
          store.commit("loadingTableStatus",true)
          loader.value = true
          store.dispatch('devices', route.params.udid)
           store.dispatch('activeCptCodes')
          //store.dispatch('allPatientsList')
          store.dispatch('flagsForPatient')
          store.dispatch('assignedForm', route.params.udid);
          store.dispatch('allStaffList')
          store.dispatch("flagsList")
          store.dispatch('patientFlagsList', {patientUdid:route.params.udid,catId:1});
          store.dispatch('patientFlagsList', {patientUdid:route.params.udid,catId:2});
          store.dispatch('patientCriticalNotes', route.params.udid);
          store.dispatch('responsiblePerson', route.params.udid);
          store.dispatch("patientCareCoordinatorsList", {
            patientUdid: route.params.udid,
            type: 1,
          });
          store.dispatch("patientCareCoordinatorsList", {
            patientUdid: route.params.udid,
            type: 0,
          });
          store.dispatch('patientConditions', route.params.udid);
          store.dispatch('emergencyContactsList', route.params.udid).then(()=>{
            store.commit("loadingTableStatus",false)
            loader.value = false
          })
          if(!showStartTimer.value && route.params.globalSearch) {
            elapsedTime.value = 0;
            store.commit('showStartTimer', true);
            clearInterval(timer.value);
            startTimer()
          }
          store.dispatch("conversationWithPatient", receiverId.value)
        })
    }

    function videoCall() {
      store.dispatch("appointmentCalls",{patientId:patientUdid})
    }
    const custom = ref(false);
    const current = ref(0);
    const handleOkcustom = (e) => {
      console.log(e);
      custom.value = false;
    };
    const next = () => {
      current.value++;
    };
    const prev = () => {
      current.value--;
    };
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
    const patientCriticalNotes = computed(() => {
      return store.state.patients.patientCriticalNotes
    })
    const button = ref(1);
    function showButton(value) {
      button.value = value;
      if(value==7){
        store.dispatch('getStepsForms', route.params.udid);
      }
    }
    
    // Countdown Timer
    const elapsedTime = ref(0)
    const timer = ref(undefined)
    const formattedElapsedTime = computed(() => {
      const date = new Date(null);
      date.setSeconds(elapsedTime.value / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    })
    const timerValue = ref(30000)
    
    function startTimer() {
      showDiv.value = true
      timer.value = setInterval(() => {
        elapsedTime.value += 1000;
        if((elapsedTime.value)%timerValue.value === 0) {
          const newFormattedElapsedTime = getSeconds(formattedElapsedTime.value)
          const timeApprovalId =  localStorage.getItem('timeApprovalId')
          if((timeApprovalId && timeApprovalId != null) && route.name == 'PatientSummary') {
            const data = {
              time: newFormattedElapsedTime,
              isAutomatic: true,
            }
            store.dispatch("updateTimeApproval", {
              timeApprovalId: timeApprovalId,
              data: data
            })
          }
          else {
            if(route.name == 'PatientSummary') {
              store.dispatch("timeApproval", {
                staff: authUser.user.staffUdid,
                patient: route.params.udid,
                time: newFormattedElapsedTime,
                type: timeApprovalType.value,
                status: pendingApprovalStatus.value,
                entityType: 'patient',
                referenceId: route.params.udid,
                isAutomatic: true
              })
            }
          }
        }
      }, 1000);
      store.commit('showPauseTimer', true);
      store.commit('showStartTimer', false);
      store.commit('showResumeTimer', false);
    }

    const stopTimer = () => {
      
      const seconds = getSeconds(formattedElapsedTime.value)
      const cancelButton = ref(localStorage.getItem('cancelButton'))
     
      if(cancelButton.value != null) {
        store.commit("loadingTableStatus", true)
      }

      visible.value = true
      auditTimeLog.timeAmount = seconds
      
      if(!showStartTimer.value) {
        store.commit('showStartTimer', true);
        store.commit('showPauseTimer', false);
        store.commit('showResumeTimer', false);
        isEditTimeLog.value = true;
        clearInterval(timer.value);

        const timeApprovalId =  localStorage.getItem('timeApprovalId')
        if((timeApprovalId && timeApprovalId != null)) {
          
           selectedRow.value= [timeApprovalId]
           
          const data = {
            time: seconds,
            isAutomatic: false,
          }
          store.dispatch("updateTimeApproval", {
            timeApprovalId: timeApprovalId,
            data: data
          }).then(() => {
            if(cancelButton.value) {
              router.push({
                path: cancelButton.value
              });
              localStorage.removeItem('cancelButton')
            }
            localStorage.removeItem('timeApprovalId')
            store.commit("loadingTableStatus", false)
          })
        }
        else {
          store.dispatch("timeApproval", {
            staff: authUser.user.staffUdid,
            patient: route.params.udid,
            time: seconds,
            type: timeApprovalType.value,
            status: pendingApprovalStatus.value,
            entityType: 'patient',
            referenceId: route.params.udid,
            isAutomatic: true
          }).then(() => {
            let timeId = localStorage.getItem('timeApprovalId')
            selectedRow.value= [timeId]
            if(cancelButton.value) {
              
              router.push({
                path: cancelButton.value
              });
              localStorage.removeItem('cancelButton')
            }
            localStorage.removeItem('timeApprovalId')
            store.commit("loadingTableStatus", false)
          })
        }
      }
    };

    const pauseTimer = () => {
      store.commit('showResumeTimer', true);
      store.commit('showPauseTimer', false);
      clearInterval(timer.value);
    };
  
    const handleClose = ({link=null,modal, value, cancelBtn}) => {
      if(modal == 'cancelButton') {
        if(link==true&& cancelBtn != null) {
          elapsedTime.value = 0;
          store.commit('showStartTimer', true);
          clearInterval(timer.value);
          router.push({
            path: cancelBtn
          });
        }
        else {
          if(!showPauseTimer.value) {
            startTimer()
          }
          store.commit('showStartTimer', false);
        }
      }
      else if(modal == 'closeTimeLogModal') {
        if(!showPauseTimer.value) {
          startTimer()
        }
        store.commit('showStartTimer', false);
      }
      else if(modal == 'addTimeLog') {
        elapsedTime.value = 0;
        store.commit('showStartTimer', true);
        clearInterval(timer.value);
        if(cancelBtn != null) {
          router.push({
            path: cancelBtn
          });
        }
      }
      if(value == undefined) {
        if(!showPauseTimer.value) {
          startTimer()
        }
        store.commit('showStartTimer', false);
      }
    };
    
    onUnmounted(() => {
      store.commit('showStartTimer', false);
      store.commit('showPauseTimer', true);
      store.commit('showResumeTimer', false);
      store.state.patients.tabvalue = []
      clearInterval(timer.value);
      localStorage.removeItem('timeApprovalId')
      window.removeEventListener('beforeunload', clearEvent); 
      store.state.patients.patientDetails = ''
      store.state.patients.patientDocuments = ''
      store.state.patients.patientTimeline = ''
      store.state.patients.patientConditions = []
      store.state.patients.patientReferralSource = ''
      store.state.patients.referralList = ''
      store.state.patients.familyMembersList = ''
      store.state.patients.emergencyContactsList = ''
      store.state.patients.timeLineType = ''
      store.state.patients.timeLineType = ''
      store.state.patients.latestVital = []
      store.state.patients.latestCriticalNote = []
      store.state.customForm.assignedForm = null
    })

    const conferenceId = computed(() => {
			return store.state.videoCall.conferenceId
		})

    const startCallForm = reactive({
      flag: "d76ad323-cd1b-4bcf-ae3d-2300daa1ea17",
      note: "Call",
      patientId: route.params.udid,
    })
    const form = reactive({ ...startCallForm })

    const startCall = () => {
      store.commit('showStartTimer', true);
      iconLoading.value = true
      videoModal.value = true
      store.commit('loadingStatus', true)
      store.dispatch("appointmentCalls", startCallForm).then(() => {
        iconLoading.value = false
      })
    }
    onBeforeMount(() => {
        window.addEventListener('beforeunload',clearEvent);
    })

    const conversationWithPatient = computed(() => {
      return store.state.communications.conversationWithPatient
    })

    const conversation = computed(() => {
      return store.state.communications.conversationsList
    })
    const conversationId = ref(null)
    const sendMessage = () => {
      conversationId.value = conversationWithPatient.value.id
      store.dispatch("conversation", conversationId.value).then(() => {
        chatWithPatientInfoVisible.value = true
      })
    }
    const handleOk = (event) => {
      if(!event.close && event.isSaved) {     
        visible.value = event?.close
        let link = localStorage.getItem('cancelButton')
        if(link != null) {
          showDiv.value = false
          router.push(link)
        }
        else {
          clearInterval(timer.value);
          elapsedTime.value = 0;
        }
      }
      else if(!event.close && !event.isSaved) {
        visible.value = true
      }
      else if(event.close && !event.isSaved) {
        visible.value = false
        let link = localStorage.getItem('cancelButton')
        if(link != null) {
          showDiv.value = false
          router.push(link)
        }
        else {
          startTimer()
        }
      }
    }
      
    const deleteUser= (event) =>{
      showDiv.value = false
      event ? router.push('/manage-patients') :''
    }
      
      onBeforeRouteLeave((to, from, next) => {
        localStorage.setItem('cancelButton', to.fullPath)
        if(showDiv.value) {
          stopTimer('leavingPage')
          /* const seconds = getSeconds(formattedElapsedTime.value)
          auditTimeLog.timeAmount = seconds
          visible.value = true
          clearInterval(timer.value); */
        }
        else {
          next()
          
        }
      })

    return {
      handleOk,
      videoModal,
      patientDetails,
      form,
      startCallForm,
      clearEvent,
      screensPermissions,
      arrayToObjact,
      enCodeStringVideoURL,
      conferenceId,
      videoCall,
      startCall,
      sendMessage,
      paramsId:route.params.udid,
      actionTrack,
      stopTimer,
      formattedElapsedTime,
      isEditTimeLog,
      startTimer,
      handleOkcustom,
      custom,
      next,
      prev,
      handleChange,
      notevisible,
      devicevisible,
      documentvisible,
      addnotesvisible,
      timelogsvisible,
      bloodoxygenvisible,
      bloodglucosevisible,
      patientCriticalNotes,
      chatWithPatientInfoVisible,
      conversation,
      conversationId,
      conversationWithPatient,
      receiverId,
      selectedRow,
      visible,
      handleClose,
      onChange: (pagination, filters, sorter, extra) => {
        console.log("params", pagination, filters, sorter, extra);
      },
    
      value1: ref(),
      size: ref("large"),
      value3: ref([]),
      value,
      dayjs,
      button,
      showButton,
      loader,
      iconLoading,
      showStartTimer,
      showPauseTimer,
      showResumeTimer,
      pauseTimer,
      patientUdid,
      auditTimeLog,
      showDiv,
      deleteUser,
    };  
      
  

    
  },

  beforeRouteLeave (to, from, next) {
    localStorage.setItem('cancelButton', to.fullPath)
    var button= document.getElementById("timer")
    var formSubmit= document.getElementById("timer3")
    
    if(button) {
      formSubmit ? formSubmit.click() :''
    }
    else {
      console.log("dsds",next,from)
    }
  }
  
};
</script>

<style lang="scss">
.timer {
  font-size: 12px !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 1199px) {
    margin: 0 0 20px;
  }
  h3 {
    margin: 0 10px 0 0;
  }
  .primaryBtn {
    font-size: 12px;
    padding: 6px 10px;
    &:first-of-type{
      margin-right: 5px;
    }
  }
}
.blueBtn {
  position: relative;
  top: 0;
}
</style>
