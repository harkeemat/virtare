<template>
  <a-col :span="spanColumn">
    <div class="rightCollapse">
      <div :class="addClass ? 'icon active' : 'icon'" @click="toggleRightPanel">
        <svg
          width="11"
          height="13"
          viewBox="0 0 11 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.0091 6.51806L0.251263 12.1337L0.266869 0.875386L10.0091 6.51806Z"
            fill="white"
          />
        </svg>
      </div>
      <a-tabs
        v-model:activeKey="activeTab"
        class="client-tabs"
        overlayClass="responsive-dropdown"
        @change="tabChange"
      >
        <a-tab-pane key="info" tab="Info" v-if="rolesPermissionFind(screensPermissions, [65])" :disabled="!patientTabsEnabled">
          <a-row>
            <a-col :span="14">
              <Info />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="programs" tab="Programs" v-if="rolesPermissionFind(screensPermissions, [69]) || rolesPermissionFind(screensPermissions, [540])">
          <Programs v-if="activeTab == 'programs'" />
        </a-tab-pane>
        <a-tab-pane key="devices" tab="Devices" v-if="rolesPermissionFind(screensPermissions, [71]) || rolesPermissionFind(screensPermissions, [532]) || rolesPermissionFind(screensPermissions, [537])" :disabled="!patientDevicesEnabled">
          <Devices v-if="activeTab == 'devices'"/>
        </a-tab-pane>
        <a-tab-pane key="careTeam" tab="Care Team" v-if="rolesPermissionFind(screensPermissions, [531]) || rolesPermissionFind(screensPermissions, [536])" :disabled="!patientTabsEnabled">
          <CareTeam v-if="activeTab == 'careTeam'" />
        </a-tab-pane>
        <a-tab-pane key="vitals" tab="Vitals" v-if="rolesPermissionFind(screensPermissions, [93]) || rolesPermissionFind(screensPermissions, [94]) || rolesPermissionFind(screensPermissions, [530])" :disabled="!patientVitalsEnabled">
          <VitalsTabs v-if="activeTab == 'vitals'"/>
        </a-tab-pane>
        <a-tab-pane key="medicalHistory" tab="Medical History" v-if="rolesPermissionFind(screensPermissions, [529]) || rolesPermissionFind(screensPermissions, [75])" :disabled="!patientTabsEnabled">
          <Medical v-if="activeTab == 'medicalHistory'"/>
        </a-tab-pane>
        
        <!-- <a-tab-pane key="vitalAttributes" tab="Attributes" v-if="rolesPermissionFind(screensPermissions, 93]) || rolesPermissionFind(screensPermissions, 94]) || rolesPermissionFind(screensPermissions, 530])" :disabled="!patientTabsEnabled">
          <VitalAttributes v-if="activeTab == 'vitalAttributes'"/>
        </a-tab-pane> -->
        
        
        
        <a-tab-pane key="alerts" :disabled="!patientTabsEnabled" v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [546])">
          <template #tab >
             <span>
                {{ $t('alerts.alert') }}
              <a-badge :dot="store.state.alerts.patientDot">
              </a-badge>
             </span>
          </template>
          <Alerts v-if="activeTab == 'alerts'" />
        </a-tab-pane>
        <a-tab-pane key="timeline" tab="Timeline" :disabled="!patientTabsEnabled">
          <!-- <EmptyTable :text="$t('global.timeLineTab')" /> -->
          <TimeLine v-if="activeTab == 'timeline'"/>
        </a-tab-pane>
       
        
        <!-- <a-tab-pane key="emergencyContacts" tab="Emergency contacts">
          <EmergencyContacts />
        </a-tab-pane> -->
        <a-tab-pane key="familyMembers" tab="Family Members" v-if="rolesPermissionFind(screensPermissions, [290]) || rolesPermissionFind(screensPermissions, [302]) || rolesPermissionFind(screensPermissions, [303]) || rolesPermissionFind(screensPermissions, [304])" :disabled="!patientTabsEnabled">
          <FamilyMember v-if="activeTab == 'familyMembers'"/>
        </a-tab-pane>
        <!-- rolesPermissionFind(screensPermissions, 533]) || rolesPermissionFind(screensPermissions, 534]) || rolesPermissionFind(screensPermissions, 535]) || rolesPermissionFind(screensPermissions, 538]) -->
      <a-tab-pane key="insurance" tab="Insurance" v-if="rolesPermissionFind(screensPermissions, [534])" :disabled="!patientTabsEnabled">
          <Insurance v-if="activeTab == 'insurance'"/>
        </a-tab-pane>
        <a-tab-pane key="billing" tab="Billing" v-if="rolesPermissionFind(screensPermissions, [411]) || rolesPermissionFind(screensPermissions, [412]) || rolesPermissionFind(screensPermissions, [413]) || rolesPermissionFind(screensPermissions, [414])" :disabled="!patientTabsEnabled">
          <PatientBilling v-if="activeTab == 'billing'"/>
        </a-tab-pane>
        <a-tab-pane key="appointment" tab="Appointment"  :disabled="!patientTabsEnabled">
          <Appointment v-if="activeTab == 'appointment'"/>
        </a-tab-pane>
      </a-tabs>
      <a-tab-pane key="carePlans" tab="Care Plans" :disabled="!patientTabsEnabled">
          <EmptyTable :text="$t('global.carePlanTab')" />
        </a-tab-pane>
        <a-tab-pane key="medicines" tab="Medicines" :disabled="!patientTabsEnabled">
          <Medicines v-if="activeTab == 'medicines'"/>
        </a-tab-pane>
    </div>
  </a-col>

  <!-- Right Panel -->
  <RightPanel :showRightPanel="showRightPanel" />
</template>

<script>
import Info from "@/components/patients/patientDetails/leftPanel/tabs/Info";
import Devices from "@/components/patients/patientDetails/leftPanel/tabs/devices/Devices";
import VitalsTabs from "@/components/patients/patientDetails/leftPanel/tabs/vitals/VitalsTabs";
import TimeLine from "@/components/patients/patientDetails/leftPanel/tabs/timeLine/TimeLine";
// import EmergencyContacts from "@/components/patients/patientDetails/leftPanel/tabs/emergencyContacts/EmergencyContacts";
import FamilyMember from "@/components/patients/patientDetails/leftPanel/tabs/familyMember/FamilyMember";
import CareTeam from "@/components/patients/patientDetails/leftPanel/tabs/careTeam/CareTeam";
import RightPanel from "@/components/patients/patientDetails/rightPanel/RightPanel";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Medical from "@/components/patients/patientDetails/leftPanel/tabs/medical/Medical";
import Medicines from "@/components/patients/patientDetails/leftPanel/tabs/medicines/Medicines";
import Insurance from "@/components/patients/patientDetails/leftPanel/tabs/insurance/Insurance";
import Appointment from "@/components/patients/patientDetails/leftPanel/tabs/appointment/Appointment";
import Programs from "./tabs/programs/Programs.vue";
import Alerts from "./tabs/Alerts.vue";
import { rolesPermissionFind} from '@/commonMethods/commonMethod';

import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import PatientBilling from "@/components/patients/patientDetails/leftPanel/tabs/billing/Billing.vue"
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    Insurance,
    Medicines,
    Medical,
    Info,
    TimeLine,
    VitalsTabs,
    CareTeam,
    RightPanel,
    Devices,
    FamilyMember,
    EmptyTable,
    Programs,
    Alerts,
    PatientBilling,
    Appointment
  },
  setup() {
    const spanColumn = ref(14);
    const showRightPanel = ref(true);
    const addClass = ref(false);
    const activeTab = computed(() => {
      return store.state.patientsStore.patientsTab
    })

    const store = useStore();
    const toggleRightPanel = () => {
      spanColumn.value = spanColumn.value == 14 ? 24 : 14;
      showRightPanel.value = spanColumn.value == 14 ? true : false;
      addClass.value = spanColumn.value == 14 ? false : true;
    };

    const patientTabsEnabled = computed(() =>{
      return store.state.patientsStore.patientTabsEnabled
    })

    const patientVitalsEnabled = computed(() =>{
      return store.state.patientsStore.patientVitalsEnabled
    })

    const patientDevicesEnabled = computed(() =>{
      return store.state.patientsStore.patientDevicesEnabled
    })

    const route = useRoute();

    onMounted(() => {
      //store.commit("manualTabchange", false);
      // store.commit("patientsTab", activeTab.value);
      setTimeout(()=>{
        const leftTabHeight =  document.querySelector(".rightCollapse .ant-tabs-content-holder")
        let setNotesHeight = document.querySelector(".patientNotesInner")
        setNotesHeight ? setNotesHeight.style.height = leftTabHeight?.offsetHeight + "px" :''
      },3000)
      store.dispatch('alerts/patientActiveAlert',route.params.udid);
    });

    const tabChange = (value) => {

      store.commit("patientsTab", value);
      store.commit("manualTabchange", true);
      //left tab height get
      setTimeout(()=>{
        const leftTabHeight =  document.querySelector(".rightCollapse .ant-tabs-content-holder")
        let setNotesHeight = document.querySelector(".patientNotesInner")
        setNotesHeight ? setNotesHeight.style.height = leftTabHeight?.offsetHeight + "px" :''
      },3000)

    };
    onUnmounted(()=>{
      store.commit("patientsTab", '');
    })

    return {
      patientTabsEnabled,
      patientDevicesEnabled,
      patientVitalsEnabled,
      toggleRightPanel,
      spanColumn,
      showRightPanel,
      addClass,
      activeTab,
      tabChange,
      screensPermissions : store.getters.screensPermissions,
      store,
      rolesPermissionFind
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.rightCollapse {
  position: relative;
  padding-right: 50px;

  .icon {
    width: 19px;
    height: 42px;
    background: $blue-color;
    border-radius: 4px 0px 0px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;

    svg {
      transition: 0.5s;
      transform: rotate(0deg);
    }

    &.active {
      border-radius: 4px;

      svg {
        transform: rotate(60deg);
      }
    }
  }

  .client-tabs {
    &.ant-tabs {
      :deep(.ant-tabs-nav) {
        max-width: 100%;

        .ant-tabs-nav-wrap {
          &::after,
          &::before {
            display: none;
          }
        }
      }
    }
    > :deep(.ant-tabs-content-holder) {
      > .ant-tabs-content {
        // max-height: calc(100vh - 337px);
        // overflow: auto;
        .ant-tabs-tabpane {
          .emptyTable {
            height: calc(100vh - 337px);
          }
        }
      }
    }
  }
}
</style>
