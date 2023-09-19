<template>
  <PatientInformation />
  <a-col :span="12">
    <div class="patientTiminig">
      <PatientTimer v-if="timerComponet"/>
      <!-- v-if="patientsStore.patientsTab!='timeline'" -->
      <a-dropdown-button @click="handleButtonClick" class="primary-dropdown" >
        Actions
        <template #overlay>
          <a-menu @click="openForm" class="actionDropdown">
            <a-menu-item key="editPatient" v-if="patientsStore.patientsTab=='info' && rolesPermissionFind(screensPermissions, [63])" class="newPatient"> Edit Patient</a-menu-item>
            <a-menu-item key="editClient" class="newPatient"> Edit Client</a-menu-item>
            <a-menu-item key="addManualTime" class="newPatient"> Add Manual Time</a-menu-item>

            <a-menu-item key="convertUser" v-if="patientsStore.patientsTab=='info' && rolesPermissionFind(screensPermissions, [539]) && (store.state.patientsStore.patientInformation?.snf) && rolesPermissionFind(screensPermissions, [539])" class="newPatient" @click="() => store.commit('convertSystemUser',true)"> Convert to System User</a-menu-item>

            <a-menu-item key="devices" v-if="patientsStore.patientsTab=='devices' && rolesPermissionFind(screensPermissions, [71])" class="newPatient"><PlusOutlined /> Device </a-menu-item>
            <a-menu-item key="familyMembers" v-if="patientsStore.patientsTab=='familyMembers' && rolesPermissionFind(screensPermissions, [290])" class="newPatient"><PlusOutlined /> Family Member </a-menu-item>
            <a-menu-item key="careTeam" v-if="patientsStore.patientsTab=='careTeam' && rolesPermissionFind(screensPermissions, [531])" class="newPatient"><PlusOutlined /> Assign Care Team </a-menu-item>
            <a-menu-item key="programs" v-if="patientsStore.patientsTab=='programs' && rolesPermissionFind(screensPermissions, [69])" class="newPatient"><PlusOutlined /> Program</a-menu-item>

            <!-- Vitals Tab Starts Here -->
            
            <!-- Set Vitals Default Ranges -->
            <template v-for="deviceType in deviceTypes" :key="deviceType.id">
              <a-menu-item :key="deviceType?.id+'_ranges'" v-if="arrayToObjectData(store.state.device?.deviceList,deviceType?.name,'deviceType') && patientsStore.patientsTab=='vitals'" class="newPatient">Set {{ deviceType.field }} Range </a-menu-item>
            </template>
            <a-menu-item key="heartRateRanges" v-if="patientsStore.patientsTab=='vitals'" class="newPatient">Set Heart Rate Range </a-menu-item>

            <!-- Add Vitals -->
            <template v-for="deviceType in store.state.device?.deviceList" :key="deviceType.deviceTypeId">
              <a-menu-item 
                :key="deviceType"
                v-if="arrayToObjectData(store.state.device?.deviceList, deviceType?.deviceType,'deviceType')
                  && patientsStore.patientsTab=='vitals'
                  && rolesPermissionFind(screensPermissions, [93])
                  && !deviceType.archive"
                class="newPatient" >
                <PlusOutlined /> {{ deviceType.field }}
              </a-menu-item>
            </template>

            <!-- Vitals Tab Ends Here -->

            <a-menu-item key="insurance" v-if="patientsStore.patientsTab=='insurance' && rolesPermissionFind(screensPermissions, [533])" class="newPatient"><PlusOutlined /> Add Insurance </a-menu-item>
            <a-menu-item key="medicalHistory" v-if="patientsStore.patientsTab=='medicalHistory' && rolesPermissionFind(screensPermissions, [75])" class="newPatient"><PlusOutlined /> Add Medical </a-menu-item>
             <a-menu-item v-if="patientsStore.patientsTab=='alerts' && rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [546])" key="alerts" class="newPatient"><PlusOutlined />
                New {{ $t('alerts.alert') }}
            </a-menu-item>
          </a-menu>
        </template>
        <template #icon>
          <CaretDownOutlined />
        </template>
      </a-dropdown-button>
    </div>
  </a-col>
  <a-drawer placement="right" :closable="false" :visible="visibleForm" width="60%">
    <EditClient @onClose="closeForm($event)" v-if="urlKey=='editClient'"/>
    <PatientForm @hideDrawer="closeForm($event)" v-if="visiblePatientForm && patientsStore.patientsTab=='info'" />
    <AddPatientVitals @onClose="closeForm($event)" v-if="visibleAddVitals && patientsStore.patientsTab=='vitals'" :deviceId="deviceId" :formTitle="deviceName" />
    <AssignCareTeam @onClose="closeForm($event)" v-if="visibleCareTeamForm && patientsStore.patientsTab=='careTeam'"/>
    <AddProgram @onClose="closeForm($event)" v-if="visibleProgramForm && patientsStore.patientsTab=='programs'"/>
    <AddDevice @onClose="closeForm($event)" v-if="visibleDeviceForm && patientsStore.patientsTab=='devices'"/>
    <AddFamilyMember @onClose="closeForm($event)" v-if="visibleFamilyMemberForm && patientsStore.patientsTab=='familyMembers'"/>
    <AddInsurance @onClose="closeForm($event)" v-if="visibleInsuranceForm && patientsStore.patientsTab=='insurance'"/>
    <AddMedical @onClose="closeForm($event)" v-if="visibleMedicalHistoryForm && patientsStore.patientsTab=='medicalHistory' &&urlKey=='medicalHistory'"/>
    <Create  v-if="visibleAlertsForm && patientsStore.patientsTab=='alerts' && urlKey=='alerts'"  @hideDrawer="closeForm" />
    <!-- Vital Defaults -->
    <SetBPRanges v-if="visibleBPDefaultsForm" @hideDrawer="hideDrawer" />
    <SetHeartRateRanges v-if="visibleHeartRateDefaultsForm" @hideDrawer="hideDrawer" />
    <SetOxygenRanges v-if="visibleOxygenDefaultsForm" @hideDrawer="hideDrawer" />
    <SetGlucoseRanges v-if="visibleGlucoseDefaultsForm" @hideDrawer="hideDrawer" />
    <AddManualTime v-if="visibleAddManualTimeForm && urlKey=='addManualTime'" @hideDrawer="hideDrawer" />
  </a-drawer>

</template>

<script>
import PatientInformation from  "@/components/patients/patientDetails/topSection/PatientInformation"
import EditClient from  "@/components/patients/patientDetails/topSection/modals/EditClient"
import PatientTimer from  "@/components/patients/patientDetails/topSection/PatientTimer"
import { CaretDownOutlined,PlusOutlined } from "@ant-design/icons-vue";
import PatientForm from "@/components/patients/patientsList/modals/PatientForm";
import AddPatientVitals from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/AddPatientVitals";
import { arrayToObjectData,rolesPermissionFind } from '@/commonMethods/commonMethod';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import AddDevice from "@/components/patients/patientDetails/leftPanel/tabs/devices/AddDevice";
import AddFamilyMember from "@/components/patients/patientDetails/leftPanel/tabs/familyMember/AddFamilyMember";
import AssignCareTeam from "@/components/patients/patientDetails/leftPanel/tabs/careTeam/AssignCareTeam";
import AddInsurance from "@/components/patients/patientDetails/leftPanel/tabs/insurance/AddInsurance";
import AddMedical from "@/components/patients/patientDetails/leftPanel/tabs/medical/AddMedical";
import AddProgram from "../leftPanel/tabs/programs/AddProgram.vue";
import Create from "@/components/alerts/Create";
import { useRoute } from 'vue-router';
import SetBPRanges from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/vitalDefaults/SetBPRanges"
import SetHeartRateRanges from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/vitalDefaults/SetHeartRateRanges"
import SetOxygenRanges from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/vitalDefaults/SetOxygenRanges"
import SetGlucoseRanges from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/vitalDefaults/SetGlucoseRanges"
import AddManualTime from "@/components/patients/patientDetails/topSection/modals/AddManualTime"
import { deviceIds } from "@/config/common";

export default {
  components: {
    SetBPRanges,
    SetHeartRateRanges,
    SetOxygenRanges,
    SetGlucoseRanges,
    PatientInformation,
    PatientTimer,
    CaretDownOutlined,
    PatientForm,
    AddDevice,
    AddFamilyMember,
    PlusOutlined,
    AssignCareTeam,
    AddPatientVitals,
    AddInsurance,
    AddMedical,
    AddProgram,
    Create,
    EditClient,
    AddManualTime,
  },
  setup() {
    const store = useStore()
    const patientsStore = store.getters.patientsStore
    const deviceId = ref(null)
    const deviceName = ref(null)
    const route = useRoute()
    const timerComponet = ref(true)

    const visibleForm = ref(false)
    const visiblePatientForm = ref(false)
    const visibleDeviceForm = ref(false)
    const visibleFamilyMemberForm = ref(false)
    const visibleAddVitals = ref(false)
    const visibleBPDefaultsForm = ref(false)
    const visibleHeartRateDefaultsForm = ref(false)
    const visibleOxygenDefaultsForm = ref(false)
    const visibleGlucoseDefaultsForm = ref(false)
    const visibleAddManualTimeForm = ref(false)
    const visibleCareTeamForm = ref(false)
    const visibleProgramForm = ref(false)
    const visibleInsuranceForm = ref(false)
    const visibleMedicalHistoryForm = ref(false)
    const visibleAlertsForm = ref(false)

    onMounted(()=>{
      timerComponet.value = true
      store.state.device.deviceList?.length>0 ? '' : store.dispatch("deviceList", { id: route?.params?.udid });
    })

    const deviceTypes = computed(() => {
      return store.state.vitals.deviceTypes
    })

    const urlKey = ref()

    const openForm = (value) => {
      urlKey.value = value.key
      visibleForm.value = true
      /** patientform will be open for convert user as well as edit patient. */
      if(['editPatient','convertUser'].includes(value.key)) {
        visiblePatientForm.value = true
      }
      else if(value.key == 'devices') {
        visibleDeviceForm.value = true
      }
      else if(value.key == 'familyMembers') {
        visibleFamilyMemberForm.value = true
      }
      else if(value.key == 'careTeam') {
        visibleCareTeamForm.value = true
      }
      else if(value.key == 'programs') {
        visibleProgramForm.value = true
      }
      else if(value.key == 'insurance') {
        visibleInsuranceForm.value = true
      }
      else if(value.key == 'medicalHistory') {
        visibleMedicalHistoryForm.value = true
      }
      else if(value.key == 'alerts') {
        visibleAlertsForm.value = true
      }
      else if(value.key == 'addManualTime') {
        visibleAddVitals.value = false
        visibleGlucoseDefaultsForm.value = false
        visibleBPDefaultsForm.value = false
        visibleHeartRateDefaultsForm.value = false
        visibleOxygenDefaultsForm.value = false
        visibleAddManualTimeForm.value = true
      }
      else if(patientsStore.value.patientsTab == 'vitals') {
        visibleAddManualTimeForm.value = false
        visibleAddVitals.value = false
        visibleGlucoseDefaultsForm.value = false
        visibleBPDefaultsForm.value = false
        visibleHeartRateDefaultsForm.value = false
        visibleOxygenDefaultsForm.value = false

        if(value.key == '99_ranges') {
          visibleBPDefaultsForm.value = true
          store.dispatch('vitals/getBPVitalDefaults', {
            patientId: route.params.udid,
            deviceType: deviceIds.bloodPressureDeviceId
          })
        }
        else if(value.key == 'heartRateRanges') {
          visibleHeartRateDefaultsForm.value = true
          store.dispatch('vitals/getHeartRateVitalDefaults', {
            patientId: route.params.udid,
            deviceType: deviceIds.heartRateDeviceId
          })
        }
        else if(value.key == '100_ranges') {
          visibleOxygenDefaultsForm.value = true
          store.dispatch('vitals/getOxygenVitalDefaults', {
            patientId: route.params.udid,
            deviceType: deviceIds.bloodOxygenDeviceId
          })
        }
        else if(value.key == '101_ranges') {
          visibleGlucoseDefaultsForm.value = true
          store.dispatch('vitals/getGlucoseVitalDefaults', {
            patientId: route.params.udid,
            deviceType: deviceIds.glucoseDeviceId,
            vitalType: 0,
          })
        }
        else {
          visibleAddVitals.value = true
          deviceId.value = value.key.deviceTypeId;
          deviceName.value = value.key.field;
        }

      }
    }

    const closeForm = (event =false) => {
      visibleForm.value = false
      visiblePatientForm.value = event
      visibleDeviceForm.value = event
      visibleFamilyMemberForm.value = event
      visibleAddVitals.value = event
      visibleBPDefaultsForm.value = event
      visibleHeartRateDefaultsForm.value = event
      visibleOxygenDefaultsForm.value = event
      visibleGlucoseDefaultsForm.value = event
      visibleAddManualTimeForm.value = event
      visibleCareTeamForm.value = event
      visibleProgramForm.value = event
      visibleInsuranceForm.value = event
      visibleMedicalHistoryForm.value = event
      visibleAlertsForm.value = event
    }

    onUnmounted(()=>{
      timerComponet.value = false
      store.state.device.deviceList = []
    })

    const handleButtonClick = (e) => {
      console.log('click left button', e);
    };

    const hideDrawer = () => {
      visibleForm.value = false
      visiblePatientForm.value = false
      visibleDeviceForm.value = false
      visibleFamilyMemberForm.value = false
      visibleAddVitals.value = false
      visibleBPDefaultsForm.value = false
      visibleHeartRateDefaultsForm.value = false
      visibleOxygenDefaultsForm.value = false
      visibleGlucoseDefaultsForm.value = false
      visibleAddManualTimeForm.value = false
      visibleCareTeamForm.value = false
      visibleProgramForm.value = false
      visibleInsuranceForm.value = false
      visibleMedicalHistoryForm.value = false
      visibleAlertsForm.value = false
    }

    return {
      openForm,
      closeForm,
      patientsStore,
      handleButtonClick,
      deviceId,
      deviceName,
      deviceTypes,
      store,
      arrayToObjectData,
      screensPermissions : store.getters.screensPermissions,
      timerComponet,
      hideDrawer,
      urlKey,
      visibleForm,
      visiblePatientForm,
      visibleDeviceForm,
      visibleFamilyMemberForm,
      visibleAddVitals,
      visibleBPDefaultsForm,
      visibleHeartRateDefaultsForm,
      visibleOxygenDefaultsForm,
      visibleGlucoseDefaultsForm,
      visibleAddManualTimeForm,
      visibleCareTeamForm,
      visibleProgramForm,
      visibleInsuranceForm,
      visibleMedicalHistoryForm,
      visibleAlertsForm,
      rolesPermissionFind
    }
  }

}
</script>
