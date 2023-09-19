<template>
  <div class="patientInfo" v-if="patientDetails">
      <ProfileImage :isLeft="true" @onEditPatient="editPatient(patientDetails.id)" />
      <div class="pat-profile" v-if="patientDetails">
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 289)">
              <div class="thumb-head" >
                Patient Status
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddFlagModal('Patient Status',1); actionTrack(paramsId,289,'patient')" /><br />
              </div>
              <div class="thumb-desc" v-if="latestFlag?.latestFlag" @click="flagTimeLineButton();flagsListModalShow('Patient Status',{show:true},1);">
                  <a><Flags :data="latestFlag?.latestFlag.flags.data" :flag="latestFlag?.latestFlag.color" /></a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 289)">
              <div class="thumb-head" >
                Work Status
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddFlagModal('Work Status',2); actionTrack(paramsId,289,'patient')" /><br />
              </div>
              <div class="thumb-desc" v-if="latestFlag?.latestFlagCat2" @click="flagTimeLineButton();flagsListModalShow('Work Status',{show:true},2);">
                  <a><Flags :data="latestFlag?.latestFlagCat2.flags.data" :flag="latestFlag?.latestFlagCat2.color" /></a>
              </div>
          </div>
          <div class="pat-profile-inner">
              <div class="thumb-head">
                  Vital Summary
                  <!-- <PlusOutlined @click="addVitalsModel" /> -->
              </div>
              <div v-if="bloodPressure != null || bloodGlucose != null || bloodOxygen != null || latestVital != null" class="thumb-desc">
                  <a href="javascript:void(0)" v-if="arrayToObjact(screensPermissions, 287)">
                      <span @click="showVitalsModal();actionTrack(paramsId,287,'patient')">{{ latestVital.deviceType }} {{ latestVital.value }}, {{ latestVital.takeTime }}</span>
                  </a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 296)">
              <div class="thumb-head" >
                  Notes
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="addNotesModal();actionTrack(paramsId,296,'patient')" />
              </div>
              <div v-if="latestNotes != null && arrayToObjact(screensPermissions, 324)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showNotesModal();actionTrack(paramsId,324,'patient')">{{ latestNotes[0].note }}</a>
              </div>
          </div>
          <div class="pat-profile-inner">
              <div class="thumb-head">Compliance</div>
              <div class="thumb-desc">
                <span v-if="patientDetails.nonCompliance == 'No'">
                  <a @click="showNonCompliance">{{ patientDetails.nonCompliance }}</a>
                </span>
                <span v-if="patientDetails.nonCompliance == 'Yes'">
                  {{ patientDetails.nonCompliance }}
                </span>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 88) || arrayToObjact(screensPermissions, 112)">
              <div class="thumb-head" >
                  Appointments
                  <PlusOutlined v-if="patientDetails.isActive==true && arrayToObjact(screensPermissions, 112)" @click="showAddAppointmentModal();actionTrack(paramsId,294,'patient')" /><br />
              </div>
              <div v-if="latestAppointment != null && arrayToObjact(screensPermissions, 88)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="appointmentShow()">
                      {{ latestAppointment[0].staff.fullName+' '+latestAppointment[0].date }}
                  </a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 290)">
              <div class="thumb-head" >
                  {{ $t('global.familyMembers') }}
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddFamilyMemberModal();actionTrack(paramsId,290,'patient')" /><br />
              </div>
              <div v-if="familyMembersList && familyMembersList.length > 0 && arrayToObjact(screensPermissions, 302)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showFamilyMembersModal();actionTrack(paramsId,302,'patient')">
                      {{ familyMembersList[0].fullName }}
                      <!-- {{ familyMembersList[0].firstName+' '+familyMembersList[0].middleName+' '+familyMembersList[0].lastName }} -->
                  </a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 291)">
              <div class="thumb-head" >
                  {{ $t('global.careCoordinators') }}
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddPhysicianModal(1);actionTrack(paramsId,291,'patient')" /><br />
              </div>
              <div v-if="latestCareCoordinator != null && arrayToObjact(screensPermissions, 305)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showCoordinatorsListingModal(1);actionTrack(paramsId,305,'patient')">{{ latestCareCoordinator.staff }}</a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 292)">
              <div class="thumb-head" >
                  Emergency Contacts
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddEmergencyContactModal();actionTrack(paramsId,292,'patient')" /><br />
              </div>
              <div v-if="emergencyContactsList && emergencyContactsList.length > 0 && arrayToObjact(screensPermissions, 308)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showEmergencyContactDetailsModal();actionTrack(paramsId,308,'patient')">{{ emergencyContactsList[0].fullName }}</a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 293)">
              <div class="thumb-head"  >Pin
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showCriticalModal(); actionTrack(paramsId,293,'patient')"/>
              </div>
              <div v-if="latestCriticalNote != null && arrayToObjact(screensPermissions, 311)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showCriticalNotesDetails();actionTrack(paramsId,311,'patient')">{{ latestCriticalNote ? latestCriticalNote.criticalNote : '' }}</a>
              </div>
          </div>

          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 295)">
              <div class="thumb-head" >
                  Task
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="addTaskModal();actionTrack(paramsId,295,'patient')" /><br />
              </div>
              <div v-if="latestTask != null && arrayToObjact(screensPermissions, 295)" class="thumb-desc">
                  <!-- <router-link target="_blank" :to="{ name: 'Tasks', query: {view: 'dashboard'} }" @click="actionTrack(paramsId,314,'patient')">{{ latestTask[0].title }}</router-link> -->
                  <a @click="actionTrack(paramsId,314,'patient');showTaskModal(patientDetails.id)">{{latestTask[0].title }}</a>
              </div>
          </div>

          <!-- <div class="pat-profile-inner">
          <div class="thumb-head" v-if="arrayToObjact(screensPermissions, 296)">
            Notes <PlusOutlined @click="addNotesModal();actionTrack(paramsId,296,'patient')" />
          </div>
          <div v-if="latestNotes != null && arrayToObjact(screensPermissions, 324)" class="thumb-desc" >
            <a href="javascript:void(0)" @click="showNotesModal();actionTrack(paramsId,324,'patient')" >{{ latestNotes[0].note }}</a>
          </div>
        </div> -->
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 297)">
              <div class="thumb-head" >
                  Documents
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="addDocumentsModal('true');actionTrack(paramsId,297,'patient')" />
              </div>
              <div v-if="latestDocument != null && arrayToObjact(screensPermissions, 317)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showDocumentsModal();actionTrack(paramsId,317,'patient')">{{ latestDocument[0].name }}</a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 297)">
              <div class="thumb-head" >
                  Conditions
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showConditionsModal()" />
              </div>
              <div v-if="latestCondition != null && arrayToObjact(screensPermissions, 317)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showConditionsModal();actionTrack(paramsId,317,'patient')">{{latestCondition.condition}}</a>
              </div>
          </div>
          <!-- Medical History -->
          <div class="pat-profile-inner">
              <div class="thumb-head" v-if="arrayToObjact(screensPermissions, 297)">
                History & Meds
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showClinicalModal(patientDetails.id)" />
              </div>
              
              <div v-if="(patientsData?.clinicalHistoryList?.length>0 != null || patientsData.clinicalMedicatList?.length>0 != null ) && arrayToObjact(screensPermissions, 317)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showClinicalModal(patientDetails?.id);actionTrack(paramsId,317,'patient')">{{patientsData.clinicalHistoryList?.length>0?patientsData?.clinicalHistoryList[0]?.history:patientsData?.clinicalMedicatList?.length>0?patientsData?.clinicalMedicatList[0]?.medicine:''}}</a>
              </div>
          </div>
          <!-- end -->
          <!-- Medication -->
          <!-- <div class="pat-profile-inner">
              <div class="thumb-head" v-if="arrayToObjact(screensPermissions, 297)">
                Medication
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showConditionsModal()" />
              </div>
              <div v-if="latestCondition != null && arrayToObjact(screensPermissions, 317)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showConditionsModal();actionTrack(paramsId,317,'patient')">{{latestCondition.condition}}</a>
              </div>
          </div> -->
          <!-- end -->
          <div class="pat-profile-inner">
              <div class="thumb-head" v-if="arrayToObjact(screensPermissions, 298)">
                  Health Team
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="showAddPhysicianModal(0);actionTrack(paramsId,298,'patient')" />
              </div>
              <div v-if="careTeamList != null && arrayToObjact(screensPermissions, 324)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showCoordinatorsListingModal(0);actionTrack(paramsId,324,'patient')">{{ careTeamList[0]?.staff }}</a>
                  <!-- <router-link target="_blank" :to="{ name: 'CoordinatorSummary', params: { udid: latestCareTeam.staffId  }}" >
              {{ latestCareTeam.staff }}
            </router-link> -->
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 299)">
              <div class="thumb-head" >
                  TimeLogs
                  <PlusOutlined v-if="patientDetails.isActive==true" @click="addTimelogModal();actionTrack(paramsId,299,'patient')" />
              </div>
              <div v-if="latestTimeLog != null && arrayToObjact(screensPermissions, 325)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showTimelogModal();actionTrack(paramsId,325,'patient')">{{ latestTimeLog[0].category+' '+latestTimeLog[0].date }}</a>
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 106) || arrayToObjact(screensPermissions, 326)">
              <div class="thumb-head" >
                  Devices
                  <PlusOutlined v-if="patientDetails.isActive==true && arrayToObjact(screensPermissions, 106)" @click="addDeviceModal();actionTrack(paramsId,300,'patient')" />
              </div>
              <div v-if="latestDevice != null && arrayToObjact(screensPermissions, 326)" class="thumb-desc">
                  <a href="javascript:void(0)" @click="showDeviceModal();actionTrack(paramsId,326,'patient')">{{ latestDevice[0].deviceType+'('+latestDevice[0].modelNumber+')' }}</a>
              </div>
          </div>

          <div class="pat-profile-inner">
              <div class="thumb-head">
                  Referral
              </div>
              <div v-if="referralDetail != null" class="thumb-desc">
                  <a href="javascript:void(0)" @click="referral" v-if="referralDetail">{{ referralDetail.name }}</a>
              </div>
              <div v-else class="thumb-desc">
                  <a href="javascript:void(0)">N/A</a>
              </div>
          </div>

          

          <!-- <div class="pat-profile-inner">
              <div class="thumb-head">
                  Group <PlusOutlined v-if="patientDetails.isActive==true && arrayToObjact(screensPermissions, 473)" @click="groupModal" />
              </div>
              <div v-if="latestPatientGroup != null && arrayToObjact(screensPermissions, 326)" class="thumb-desc">
                <a href="javascript:void(0)" @click="groupDetailsView">{{ latestPatientGroup.group }}</a>
              </div>
              <div v-else class="thumb-desc">
                <a href="javascript:void(0)" @click="groupDetailsView">N/A</a>
              </div>
          </div> -->
          <div class="pat-profile-inner">
              <div class="thumb-head" v-if="arrayToObjact(screensPermissions, 63)">
                  Status
              </div>
              <div class="thumb-desc">
                <a-switch v-model:checked="patientDetails.isActive" @change="updateStatus(patientDetails?.id, $event)" :disabled="!arrayToObjact(screensPermissions,63)" />
              </div>
          </div>
          <div class="pat-profile-inner" v-if="arrayToObjact(screensPermissions, 64)">
              <div class="thumb-head" >
                  Delete
              </div>
              <div class="thumb-desc icons">
                <DeleteOutlined @click="deletePatients(patientDetails?.id)" />
              </div>
          </div>

      </div>
      <TaskTableModal v-if="TaskModalVisible" v-model:visible="TaskModalVisible" @isEdit="editTask($event)"/>
      
      <TasksModal  v-model:visible="visibleTaskModal" @saveTaskModal="handleOk($event)" :taskId="taskID"/>

      <ReferralViewModal v-if="referralDetail" v-model:visible="referralView" :referralDetail="referralDetail" />
      <AddPatientGroupModal v-if="addGroupModalView" v-model:visible="addGroupModalView" @closeModal="handleOk" />
      <PatientGroupDetailsModal v-if="groupDetailsModalView" v-model:visible="groupDetailsModalView" @closeModal="handleOk" />
      <AddFamilyMemberModal v-model:visible="addfamilyMembersVisible" :patientId="patientDetails.id" @closeModal="handleOk" :isFamilyMemberEdit="false" />
      <AddEmergencyContacts v-model:visible="addEmergencyContactModalVisible" @closeModal="handleOk" :isEmergencyContactEdit="isEmergencyContactEdit" />
      <AddCriticalNote v-model:visible="criticalModalVisible" @closeModal="handleOk" @saveModal="handleCriticalNote($event)" />
      <AddAppointmentModal v-model:visible="addAppointmentVisible" v-if="addAppointmentVisible" :patientId="patientDetails.id" :patientName="patientDetails.patientFullName" @closeModal="handleOk" @is-visible="handleOk" />
      <AddTasksModal v-model:visible="addTaskModalVisible" :patientId="patientDetails.id" @closeModal="handleOk" />
      <AddNotesModal v-model:visible="addNoteVisible" @closeModal="handleOk" />
      <a-modal width="70%" v-model:visible="addDocumentVisible" title="Add Documents" :maskClosable="false" centered @cancel="closeModal()" :footer="false">
          <Documents :paramId="paramsId" :idPatient="patientDetails.id" entity="patient" @document="addDocumentsModal($event)" />
      </a-modal>
      <AddCoordinatorsModal v-if="careCoordinatorsVisible" v-model:visible="careCoordinatorsVisible" @closeModal="handleOk" :staffType="staffType" :title="title" :isEditCareCoordinator="false" />
      <AddTimeLogsModal v-model:visible="addTimeLogsVisible" @closeModal="addTimeLogsClose($event)" />
      <AddDeviceModal v-model:visible="addDeviceVisible" :patientDetails="patientDetails" @closeModal="handleOk" />
      <PatientFlagsModal v-model:visible="flagsModalVisible" :categoryName="categoryName" :categoryId="categoryId" :patientId="patientDetails.id" @closeModal="handleOk" :flags="[]" title="add" />
      <FlagList v-model:visible="flagsListModal" v-if="flagsListModal" :categoryName="categoryName" :categoryId="categoryId" :patientUdid="patientDetails.id" @closeModal="flagsListModalShow($event)"  title="Flags List" />
      <PatientsModal v-model:visible="patientsModalVisible" :isEdit="true" @closeModal="handleOk" />

      <FamilyMembersDetailsModal v-model:visible="familyMembersModalVisible" :patientId="patientDetails.id" @closeModal="handleOk" />
      <!-- <PhysiciansDetailsModal v-if="physiciansModalVisible" v-model:visible="physiciansModalVisible" @isPhysicianEdit="editPhysician" @closeModal="handleOk" :staffType="staffType" /> -->
      <EmergencyContactsDetailsModal v-model:visible="emergencyContactsModalVisible" @isEmergencyContactEdit="editEmergencyContact" @closeModal="handleOk" />
      <CoordinatorsListingModal v-if="coordinatorsListingModalVisible" v-model:visible="coordinatorsListingModalVisible" :staffType="staffType" :title="title" @closeModal="handleOk" />
      <CriticalNotesDetailModal v-model:visible="criticalNotesDetailVisible" @closeModal="handleOk" />
      <PatientVitalsDetailsModal v-model:visible="patientVitalsVisible" :patientId="patientDetails.id" @closeModal="handleOk" />
      <NotesDetailModal v-model:visible="notesDetailVisible" v-if="notesDetailVisible" @closeModal="handleOk" />
      <DocumentDetailModal v-model:visible="documentDetailVisible" :patientDetails="patientDetails" @closeModal="handleOk" />
      <ConditionsModal v-if="conditionsVisible" v-model:visible="conditionsVisible" @closeModal="handleOk" />
      <ClinicalModal v-if="clinicalVisible" v-model:visible="clinicalVisible" @closeModal="handleOk" :idPatient="patientDetails.id"/>
      <TimeLogsDetailModal v-model:visible="timeLogsDetailVisible" @editTimeLog="editTimeLog($event)" />
      <DeviceDetailModal v-if="deviceDetailVisible" v-model:visible="deviceDetailVisible" :patientDetails="patientDetails" @closeModal="handleOk" />
      <NonComplianceDetailsModal v-model:visible="visibleNonCompliance" @closeModal="handleOk" />

      <a-modal width="70%" v-model:visible="appointmentShowVisible" title="Appointment" :maskClosable="false" centered @cancel="closeModal()" :footer="false">
          <AppointmentsTable v-if="appointmentShowVisible == true" :patientId="patientDetails.id" />
      </a-modal>
  </div>
</template>

<script>
import {
  // WarningOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";

import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
//  import FlagList from "@/components/patients/patientSummary/modals/FlagList";
import {
  ref,
  computed,
  defineComponent,
  defineAsyncComponent,
  onMounted,
} from "vue-demi";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { actionTrack, arrayToObjact } from "@/commonMethods/commonMethod";
import ReferralViewModal from "@/components/patients/patientSummary/modals/ReferralViewModal";
import NonComplianceDetailsModal from "@/components/modals/NonComplianceDetailsModal";
import AppointmentsTable from "@/components/communications/tables/AppointmentsTable";
// import TaskModal from "@/components/tasks/modals/TaskTableModal"
export default defineComponent({
  emits: ["deleteUser"],
  components: {
    // WarningOutlined,
    DeleteOutlined,
    NonComplianceDetailsModal,
    PlusOutlined,
    FlagList:defineAsyncComponent(() =>
      import("@/components/patients/patientSummary/modals/FlagList")
    ),
    PatientFlagsModal: defineAsyncComponent(() =>
      import("@/components/modals/PatientFlagsModal")
    ),
    PatientsModal: defineAsyncComponent(() =>
      import("@/components/modals/PatientsModal")
    ),
    AddAppointmentModal: defineAsyncComponent(() =>
      import("@/components/modals/AddAppointment")
    ),
    AddTasksModal: defineAsyncComponent(() =>
      import("@/components/modals/TasksModal")
    ),
    AddNotesModal: defineAsyncComponent(() =>
      import("@/components/modals/AddNote")
    ),
    NotesDetailModal: defineAsyncComponent(() =>
      import("@/components/modals/NotesDetail")
    ),
    Documents: defineAsyncComponent(() =>
      import("@/components/modals/forms/Documents")
    ),
    DocumentDetailModal: defineAsyncComponent(() =>
      import("@/components/modals/DocumentDetail")
    ),
    ConditionsModal: defineAsyncComponent(() =>
      import("@/components/modals/ConditionsModal")
    ),

    ClinicalModal: defineAsyncComponent(() =>
      import("@/components/modals/ClinicalModal")
    ),

    AddCoordinatorsModal: defineAsyncComponent(() =>
      import("@/components/modals/AddCoordinatorsModal")
    ),
    AddTimeLogsModal: defineAsyncComponent(() =>
      import("@/components/modals/AddTimeLogs")
    ),
    TimeLogsDetailModal: defineAsyncComponent(() =>
      import("@/components/modals/TimeLogsDetail")
    ),
    AddDeviceModal: defineAsyncComponent(() =>
      import("@/components/modals/AddDevice")
    ),
    DeviceDetailModal: defineAsyncComponent(() =>
      import("@/components/modals/DeviceDetail")
    ),
    PatientVitalsDetailsModal: defineAsyncComponent(() =>
      import("@/components/modals/PatientVitalsDetailsModal")
    ),
    Flags: defineAsyncComponent(() =>
      import("@/components/common/flags/Flags")
    ),
    AddCriticalNote: defineAsyncComponent(() =>
      import("@/components/modals/CriticalNote")
    ),
    CriticalNotesDetailModal: defineAsyncComponent(() =>
      import("@/components/modals/CriticalNotesDetail")
    ),
    AddFamilyMemberModal: defineAsyncComponent(() =>
      import("@/components/modals/AddFamilyMemberModal")
    ),
    FamilyMembersDetailsModal: defineAsyncComponent(() =>
      import("@/components/modals/FamilyMembersDetailsModal")
    ),
    // AddPhysicianModal: defineAsyncComponent(()=>import("@/components/modals/AddPhysicianModal")),
    // // PhysiciansDetailsModal: defineAsyncComponent(()=>import("@/components/modals/PhysiciansDetailsModal")),
    AddEmergencyContacts: defineAsyncComponent(() =>
      import("@/components/modals/AddEmergencyContacts")
    ),
    EmergencyContactsDetailsModal: defineAsyncComponent(() =>
      import("@/components/modals/EmergencyContactsDetailsModal")
    ),
    CoordinatorsListingModal: defineAsyncComponent(() =>
      import("@/components/modals/CoordinatorsListingModal")
    ),
    ProfileImage: defineAsyncComponent(() =>
      import("@/components/common/ProfileImage")
    ),
    ReferralViewModal,
    AppointmentsTable,
    TaskTableModal:defineAsyncComponent(() =>
      import("@/components/tasks/modals/TaskTableModal")
    ),
    TasksModal:defineAsyncComponent(() =>
      import("@/components/modals/TasksModal")
    ),
    AddPatientGroupModal:defineAsyncComponent(() =>
      import("@/components/modals/AddPatientGroupModal")
    ),
    PatientGroupDetailsModal:defineAsyncComponent(() =>
      import("@/components/modals/PatientGroupDetailsModal")
    ),
  },
  setup(props,{emit}) {
    const store = useStore();
    const route = useRoute();
    //const router = useRouter()
    const custom = ref(false);
    const flagsListModal = ref(false)
    const visibleTaskModal =ref(false)
    const TaskModalVisible = ref(false)
    const appointmentShowVisible = ref(false);
    const isFamilyMemberEdit = ref(false);
    const isPhysicianEdit = ref(false);
    const criticalNotesDetailVisible = ref(false);
    const flagsModalVisible = ref(false);
    const addfamilyMembersVisible = ref(false);
    const familyMembersModalVisible = ref(false);
    const criticalModalVisible = ref(false);
    const patientsModalVisible = ref(false);
    const addAppointmentVisible = ref(false);
    const addTaskModalVisible = ref(false);
    const addVitalsVisible = ref(false);
    const patientVitalsVisible = ref(false);
    const addNoteVisible = ref(false);
    const notesDetailVisible = ref(false);
    const addDocumentVisible = ref(false);
    const documentDetailVisible = ref(false);
    const conditionsVisible = ref(false);
    const careCoordinatorsVisible = ref(false);
    const addTimeLogsVisible = ref(false);
    const timeLogsDetailVisible = ref(false);
    const addDeviceVisible = ref(false);
    const deviceDetailVisible = ref(false);
    // const addPhysicianModalVisible = ref(false);
    // const physiciansModalVisible = ref(false);
    const coordinatorsListingModalVisible = ref(false);
    const addEmergencyContactModalVisible = ref(false);
    const isEmergencyContactEdit = ref(false);
    const emergencyContactsModalVisible = ref(false);
    const staffType = ref(0);
    const title = ref(null);
    const categoryId = ref()
    const categoryName =  ref()
    const referralView = ref(false);
    const addGroupModalView = ref(false);
    const groupDetailsModalView = ref(false);
    const visibleNonCompliance = ref(false);
    const clinicalVisible = ref(false)
    const patientAppointmentsList = computed(() => {
      return store.state.appointment.patientAppointmentsList;
    });

    function referral() {
      referralView.value = true;
    }
    const flagsListModalShow =(name,event,catId)=>{
      categoryName.value =  name
      flagsListModal.value = event?.show
      categoryId.value = catId

    }

    const groupModal = () =>  {
      store.dispatch('groupsList')
      addGroupModalView.value = true;
    }

    const groupDetailsView = () =>  {
      store.dispatch("getPatientGroup", route.params.udid);
      groupDetailsModalView.value = true;
    }

    onMounted(() => {
      if (route.name == "PatientSummary") {
        // store.dispatch("patientConditions", route.params.udid)
        //store.dispatch('responsiblePerson', route.params.udid)
        store.dispatch("emergencyContact", route.params.udid);
        store.dispatch("patientAppointmentsList", route.params.udid);
        store.dispatch("familyMembersList", route.params.udid);
        store.dispatch("latestAppointment", route.params.udid);
        store.dispatch("latestTask", route.params.udid);
        store.dispatch("latestVital", route.params.udid);
        store.dispatch("latestNotes", route.params.udid);
        store.dispatch("clinicalHistoryList",route.params.udid);
        store.dispatch("clinicalMedicatList",route.params.udid);
        store.dispatch("latestDocument", route.params.udid);
        store.dispatch("latestTimeLog", route.params.udid);
        store.dispatch("latestDevice", route.params.udid);
        store.dispatch("criticalNotesList", route.params.udid);
        store.dispatch("referralDetail", route.params.udid);
        store.dispatch("getPatientGroup", route.params.udid);
      }
    });

    const latestCriticalNote = computed(() => {
      return store.state.patients.latestCriticalNote;
    });

    const familyMembersList = computed(() => {
      return store.state.patients.familyMembersList;
    });

    const latestCareCoordinator = computed(() => {
      return store.state.careTeam.latestCareCoordinator;
    });
    const careTeamList = computed(() => {
      return store.state.careTeam.careTeamList;
    });
    const emergencyContactsList = computed(() => {
      return store.state.patients.emergencyContactsList;
    });

    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });

    const latestFlag = computed(() => {
      return store.state.flags;
    });

    const latestVital = computed(() => {
      return store.state.patients.latestVital;
    });

    const latestNotes = computed(() => {
      return store.state.notes.latestNotes;
    });
    const latestAppointment = computed(() => {
      return store.state.appointment.latestAppointment;
    });
    const latestTask = computed(() => {
      return store.state.tasks.latestTask;
    });
    const latestDocument = computed(() => {
      return store.state.patients.latestDocument;
    });
    const latestCondition = computed(() => {
      return store.state.patients.latestCondition;
    });
    const latestHealthTeam = computed(() => {
      return store.state.careTeam.latestHealthTeam;
    });
    const latestTimeLog = computed(() => {
      return store.state.timeLogs.latestTimeLog;
    });
    const latestDevice = computed(() => {
      return store.state.patients.latestDevice;
    });
    const getResponsiblePersonDetails = computed(() => {
      return store.state.patients.getResponsiblePersonDetails;
    });

    const handleOk = ({ modal, value }) => {
      
      if (modal && value) {
        addEmergencyContactModalVisible.value = modal == "addEmergencyContact" ? value : false;
        // addPhysicianModalVisible.value = modal == 'addPhysician' ? value : false;
        addfamilyMembersVisible.value = modal == "addResponsiblePerson" ? value : false;
        patientsModalVisible.value = modal == "editPatient" ? value : false;
        //addDocumentVisible.value = modal == 'addDocument' ? value : false;
        documentDetailVisible.value = modal == "documentDetails" ? value : false;
        flagsModalVisible.value = modal == "addFlag" ? value : false;
        criticalNotesDetailVisible.value = modal == "criticalNotesDetails" ? value : false;
        addAppointmentVisible.value = modal == "addAppointment" ? value : false;
        addTaskModalVisible.value = modal == "addTask" ? value : false;
        addNoteVisible.value = modal == "addNote" ? value : false;
        careCoordinatorsVisible.value = modal == "addCareTeam" ? value : false;
        addDeviceVisible.value = modal == "addInventory" ? value : false;
        familyMembersModalVisible.value = modal == "familyMembersList" ? value : false;
        // physiciansModalVisible.value = modal == 'physiciansList' ? value : false;
        emergencyContactsModalVisible.value = modal == "emergencyContactsList" ? value : false;
        deviceDetailVisible.value = modal == "devicesListing" ? value : false;
        coordinatorsListingModalVisible.value = modal == "deleteCareTeam" ? value : false;
        addfamilyMembersVisible.value = modal == "addFamilyMember" ? value : false;
        addGroupModalView.value = modal == "addGroup" ? value : false;
        groupDetailsModalView.value = modal == "groupDetails" ? value : false;
      } else {
        flagsModalVisible.value = false;
        notesDetailVisible.value = false;
        addAppointmentVisible.value = false;
        addTaskModalVisible.value = false;
        addVitalsVisible.value = false;
        patientVitalsVisible.value = false;
        addNoteVisible.value = false;
        careCoordinatorsVisible.value = false;
        timeLogsDetailVisible.value = false;
        addDeviceVisible.value = false;
        deviceDetailVisible.value = false;
        addEmergencyContactModalVisible.value = false;
        // addPhysicianModalVisible.value = false;
        addfamilyMembersVisible.value = false;
        patientsModalVisible.value = false;
        addDocumentVisible.value = false;
        documentDetailVisible.value = false;
        criticalNotesDetailVisible.value = false;
        familyMembersModalVisible.value = false;
        // physiciansModalVisible.value = false;
        emergencyContactsModalVisible.value = false;
        coordinatorsListingModalVisible.value = false;
        clinicalVisible.value = false,
        addGroupModalView.value = false
        groupDetailsModalView.value = false
      }
    };

    const showAddEmergencyContactModal = () => {
      addEmergencyContactModalVisible.value = true;
      isEmergencyContactEdit.value = false;
    };

    const showEmergencyContactDetailsModal = () => {
      emergencyContactsModalVisible.value = true;
    };

    const showAddFamilyMemberModal = () => {
      addfamilyMembersVisible.value = true;
      isFamilyMemberEdit.value = false;
    };

    const showFamilyMembersModal = () => {
      familyMembersModalVisible.value = true;
    };

    const editEmergencyContact = () => {
      isEmergencyContactEdit.value = true;
      addEmergencyContactModalVisible.value = true;
    };

    const showAddPhysicianModal = (val) => {
      // addPhysicianModalVisible.value = true
      careCoordinatorsVisible.value = true;
      isPhysicianEdit.value = false;
      staffType.value = val;
      title.value = val == 1 ? "Add Care Coordinator" : "Add Health Team";
    };

    // const showPhysiciansModal = (val) => {
    //   // physiciansModalVisible.value = true
    //   staffType.value = val
    // }

    const showCoordinatorsListingModal = (val) => {
      coordinatorsListingModalVisible.value = true;
      staffType.value = val;
      title.value = val == 1 ? "Care Coordinators" : "  Health Team";
    };

    const editPhysician = () => {
      isPhysicianEdit.value = true;
      // addPhysicianModalVisible.value = true
    };

    const showCriticalModal = () => {
      criticalModalVisible.value = true;
    };

    const showCriticalNotesDetails = () => {
      store.dispatch("patientCriticalNotes", route.params.udid);
      criticalNotesDetailVisible.value = true;
    };
    const handleCriticalNote = (value) => {
      criticalModalVisible.value = value;
    };

    const showModalCustom = () => {
      custom.value = true;
    };

    const editPatient = (patientUdid) => {
      store.dispatch("patientDetails", patientUdid);
      store.dispatch("responsiblePerson", patientUdid);
      store.dispatch("emergencyContact", patientUdid);
      store.dispatch("patientConditions", patientUdid);
      store.dispatch("patientInsurance", patientUdid);
      store.dispatch("programList");
      patientsModalVisible.value = true;
      store.commit("isEditPatient", true);
    };
    const showAddAppointmentModal = () => {
      addAppointmentVisible.value = true;
    };

    const addTaskModal = () => {
      addTaskModalVisible.value = true;
    };

    const addVitalsModel = () => {
      addVitalsVisible.value = true;
    };

    const showAddFlagModal = (name,catId) => {
      flagsModalVisible.value = true;
      store.dispatch('flagsForPatient',catId)
      categoryId.value = catId,
      categoryName.value =  name
    };

    const showVitalsModal = () => {
      patientVitalsVisible.value = true;
    };

    const addNotesModal = () => {
      addNoteVisible.value = true;
    };

    const showNotesModal = () => {
      store.dispatch("notesList", route.params.udid);
      notesDetailVisible.value = true;
    };

    const addDocumentsModal = (event) => {
      store.commit("clearStaffFormValidation", false);
      addDocumentVisible.value = event;
    };

    const showDocumentsModal = () => {
      documentDetailVisible.value = true;
    };

    const showConditionsModal = () => {
      store.commit("isConditionEdit", false);
      conditionsVisible.value = true;
    };

    const showClinicalModal = () => {
      store.commit("isClinicalEdit", false);
      clinicalVisible.value = true;
    };

    // const addCareTeamModal = () => {
    //   careCoordinatorsVisible.value = true;
    //   staffType = 0;
    // }

    const addTimelogModal = () => {
      addTimeLogsVisible.value = true;
    };
    const addTimeLogsClose = (value) => {
      addTimeLogsVisible.value = value;
    };

    const showTimelogModal = () => {
      store.dispatch("timeLogsList", {
        id: route.params.udid,
      });
      timeLogsDetailVisible.value = true;
    };

    const addDeviceModal = () => {
      store.commit("dropdownListing", null);
      addDeviceVisible.value = true;
    };

    const showDeviceModal = () => {
      deviceDetailVisible.value = true;
    };

    const timeLogDetails = ref(null);
    const editTimeLog = (value) => {
      timeLogDetails.value = value;
    };

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function closeModal() {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            addDocumentVisible.value = false;
            store.commit("clearStaffFormValidation", true);
            store.commit("checkChangeInput", false);

            store.state.careCoordinator.addStaff = null;
          } else {
            store.commit("clearStaffFormValidation", false);

            addDocumentVisible.value = true;
          }
        });
      } else {
        store.commit("clearStaffFormValidation", true);
      }
    }
    const flagTimeLineButton = () => {
      store.state.patients.tabvalue = [7];
      store.dispatch("patientTimeline", {
        id: route.params.udid,
        type: store.state.patients.tabvalue.join(","),
      });
    };

    function appointmentShow() {
      appointmentShowVisible.value = true;
    }
    const showTaskModal=(id) =>{
      let dateFilter = ''
      let filter = ''
      let orderParam = "&orderField=&orderBy=";
      let islimit = "&islimit="
      store.dispatch("showTaskModalData", {
        id: id,
        filters: "?page=" + dateFilter + filter + orderParam + islimit
      })
      TaskModalVisible.value = true
    }

    const editTask = (id) => {
      visibleTaskModal.value = true
        emit("isEdit", {
          check: true,
          id: id
        });
      };

    const showNonCompliance = () => {
      store.dispatch('nonComplianceDetails', route.params.udid)
      visibleNonCompliance.value = true
    }

    const patientsData = computed(() => {
      return store.state.patients;
    });

    const latestPatientGroup = computed(() => {
      return store.state.patients.latestPatientGroup
    })

    const updateStatus = (id, status) => {
    const data = {
        isActive: status,
    };
    store.dispatch("updatePatientStatus", {
        id,
        data,
    });
    };

    function deletePatients(id) {
    warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
            // var index = meta.patientList.findIndex(function (o) {
            //     return o.id === id;
            // });
            store.dispatch("patientsDelete", id).then((resp)=>{
              if(resp==true){
                emit("deleteUser",true)
                
              }

            })
            // meta.patientList.splice(index, 1);
        }
    });
  }
 
    return {
      deletePatients,
      updateStatus,
      patientsData,
      clinicalVisible,
      showClinicalModal,
      // deleteFlag,
      categoryName,
      categoryId,
      showNonCompliance,
      visibleNonCompliance,
      visibleTaskModal,
      editTask,
      TaskModalVisible,
      showTaskModal,
      patientAppointmentsList,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      actionTrack,
      paramsId: route.params.udid,
      latestCriticalNote,
      showCriticalNotesDetails,
      handleCriticalNote,
      handleOk,
      editTimeLog,
      showAddAppointmentModal,
      editPatient,
      showModalCustom,
      custom,
      value10: ref([]),

      criticalNotesDetailVisible,
      flagsModalVisible,
      editPhysician,
      showAddFamilyMemberModal,
      showFamilyMembersModal,
      addfamilyMembersVisible,
      familyMembersModalVisible,
      showCriticalModal,
      criticalModalVisible,
      patientsModalVisible,
      addAppointmentVisible,
      addTaskModalVisible,
      addVitalsVisible,
      patientVitalsVisible,
      addNoteVisible,
      notesDetailVisible,
      addDocumentVisible,
      documentDetailVisible,
      conditionsVisible,
      careCoordinatorsVisible,
      addTimeLogsVisible,
      timeLogsDetailVisible,
      addDeviceVisible,
      deviceDetailVisible,

      showAddFlagModal,
      addTaskModal,
      addVitalsModel,
      showVitalsModal,
      addNotesModal,
      showNotesModal,
      addDocumentsModal,
      showDocumentsModal,
      showConditionsModal,
      // addCareTeamModal,
      addTimelogModal,
      showTimelogModal,
      addDeviceModal,
      showDeviceModal,
      showCoordinatorsListingModal,

      getResponsiblePersonDetails,
      familyMembersList,
      patientDetails,
      timeLogDetails,
      isPhysicianEdit,
      isFamilyMemberEdit,

      latestFlag,
      latestAppointment,
      latestTask,
      latestVital,
      latestNotes,
      latestDocument,
      latestCondition,
      latestHealthTeam,
      latestCareCoordinator,
      latestTimeLog,
      latestDevice,

      // addPhysicianModalVisible,
      // physiciansModalVisible,
      coordinatorsListingModalVisible,
      showAddPhysicianModal,
      // showPhysiciansModal,

      emergencyContactsList,
      editEmergencyContact,
      showAddEmergencyContactModal,
      showEmergencyContactDetailsModal,
      addEmergencyContactModalVisible,
      isEmergencyContactEdit,
      emergencyContactsModalVisible,

      staffType,
      title,
      closeModal,
      addTimeLogsClose,
      referralView,
      addGroupModalView,
      referral,
      referralDetail: store.getters.referralDetail,
      flagTimeLineButton,
      appointmentShowVisible,
      appointmentShow,
      groupModal,
      groupDetailsView,
      latestPatientGroup,
      groupDetailsModalView,
      careTeamList,
      flagsListModal,
      flagsListModalShow
    };
  },
});
</script>
