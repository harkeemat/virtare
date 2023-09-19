<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-breadcrumb>
          <a-breadcrumb-item> <router-link :to="{ name: 'ManageClients' }">Clients</router-link></a-breadcrumb-item>
        </a-breadcrumb>
        <a-typography-title :level="2" class="common-heading">{{
          clientInformation?.friendlyName ?
          clientInformation?.friendlyName?.charAt(0).toUpperCase() + clientInformation?.friendlyName?.slice(1) : '' }}
        </a-typography-title>
        <a-typography-text class="common-tag-line" >
          Status : <span :class="clientInformation?.statusName == 'Active' ? 'active' : 'inActive'">{{
            clientInformation?.statusId == 428 ? 'Suspend' : clientInformation?.statusName }}</span>
        </a-typography-text>
      </a-col>
      <a-col :span="12" class="text-right" v-if="activeTab == 1 && (rolesPermissionFind(screensPermissions, [511]) || rolesPermissionFind(screensPermissions, [512]))">
        <a-dropdown-button @click="handleButtonClick" class="primary-dropdown">
          Actions
          <template #overlay>
            <a-menu @click="handleMenuClick" class="actionDropdown">
              <a-menu-item key="1" @click="showDrawer(activeTab)" v-if="rolesPermissionFind(screensPermissions, [511])">
                Edit
              </a-menu-item>
              <a-popconfirm
                :title="checkData == 427?'Are you sure want to active?':'Are you sure want to suspend?'"
                ok-text="Yes"
                cancel-text="No"
                @confirm="updateClientStatus(checkData)"
                @cancel="cancel"
              >
              <a-menu-item v-if="clientInformation?.statusId != 427" @click="checkData=427">{{
                arrayToObjectData(clientStatusCodes, 427, 'id', 'name')
              }}</a-menu-item>
              <a-menu-item v-if="clientInformation?.statusId != 428 && rolesPermissionFind(screensPermissions, [512])"
                @click="checkData= 428">Suspend</a-menu-item>
              <!-- <a-menu-item key="4" @click="updateClientStatus(deletedId)"> Delete </a-menu-item> -->
            </a-popconfirm>
            </a-menu>
          </template>
          <template #icon>
            <CaretDownOutlined />
          </template>
        </a-dropdown-button>
      </a-col>
      <a-col :span="12" class="text-right" v-if="activeTab == 2 && rolesPermissionFind(screensPermissions, [515])">
        <!-- <a-button @click="showDrawer(activeTab)" class="primary-btn"><plus-outlined />New Person</a-button> -->
        <a-dropdown-button @click="handleButtonClick" class="primary-dropdown">
          Actions
          <template #overlay>
            <a-menu @click="openPeopleMenu" class="actionDropdown">
              <a-menu-item key="addNew" class="newPatient" @click="showDrawer(activeTab)"> Add New Person</a-menu-item>
              <a-menu-item key="addExisting" class="newPatient" @click="showDrawer(activeTab)"> Add Existing Person</a-menu-item>
            </a-menu>
          </template>
          <template #icon>
            <CaretDownOutlined />
          </template>
        </a-dropdown-button>
      </a-col>
      <a-col :span="12" class="text-right" v-if="activeTab == 3 && rolesPermissionFind(screensPermissions, [519])">
        <a-button @click="showDrawer(activeTab)" class="primary-btn"><plus-outlined />New Site</a-button>
      </a-col>
      <a-col :span="12" class="text-right" v-if="activeTab == 4 && rolesPermissionFind(screensPermissions, [523])">
        <a-button @click="showDrawer(activeTab)" class="primary-btn"><plus-outlined />New Care Team</a-button>
      </a-col>
      <a-col :span="24">
        <a-tabs v-model:activeKey="activeTab" class="client-tabs">
          <a-tab-pane key="1" tab="Info">
            <a-row>
              <a-col :span="12">
                <Info />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="People" v-if="rolesPermissionFind(screensPermissions, [514])">
            <PeopleList v-if="activeTab==2"/>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Sites" v-if="rolesPermissionFind(screensPermissions, [518])">
            <SitesList v-if="activeTab==3"/>
          </a-tab-pane>
          <a-tab-pane key="4" tab="Care Teams" v-if="rolesPermissionFind(screensPermissions, [522])">
            <CareTeams v-if="activeTab==4" />
          </a-tab-pane>
          <a-tab-pane key="5" tab="Patients" v-if="rolesPermissionFind(screensPermissions, [527])">
            <Patients v-if="activeTab==5"/>
          </a-tab-pane>
          <a-tab-pane key="6" tab="Billing" v-if="rolesPermissionFind(screensPermissions, [527])">
            <Billing v-if="activeTab==6"/>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
  <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
    <AddClient v-if="modalInfo == 'client' && visible" :isEdit="addClient" :formHeading="formHeading"
      @onClose="onClose" />
    <People v-if="modalInfo == 'people' && addNewPerson && visible" :isEdit="addPeople" :formHeading="formHeading" @onClose="onClose" />
    <AddExistingPeople v-if="modalInfo == 'people' && addExistingPerson && visible" :formHeading="formHeading" @onClose="onClose" />
    <Sites v-if="modalInfo == 'sites' && visible" :isEdit="addSite" :formHeading="formHeading" @onClose="onClose" />
    <CareTeam v-if="modalInfo == 'careTeam' && visible" :isEdit="addCare" :formHeading="formHeading" @onClose="onClose"
      formType="careTeam" />
</a-drawer>
</template>
<script>
import Info from "@/components/administration/clients/Tabs/clientDetails/Info";
import AddClient from "@/components/administration/clients/AddClient";
import People from "@/components/administration/clients/Tabs/addClient/People";
import AddExistingPeople from "@/components/administration/clients/Tabs/addClient/AddExistingPeople";
import Sites from "@/components/administration/clients/Tabs/addClient/Sites";
import CareTeam from "@/components/administration/clients/Tabs/addClient/CareTeam";
import PeopleList from "@/components/administration/clients/Tabs/clientDetails/PeopleList";
import SitesList from "@/components/administration/clients/Tabs/clientDetails/Sites";
import Patients from "@/components/administration/clients/Tabs/clientDetails/Patients";
import Billing from "@/components/administration/clients/Tabs/clientDetails/Billing";
import CareTeams from "@/components/administration/clients/Tabs/clientDetails/CareTeams";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { computed, onMounted, ref,onUnmounted } from "vue-demi";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { arrayToObjectData, rolesPermissionFind} from "@/commonMethods/commonMethod";
// import { message } from 'ant-design-vue';
export default {
  components: {
    Info,
    AddClient,
    People,
    AddExistingPeople,
    Sites,
    CareTeam,
    PeopleList,
    SitesList,
    Patients,
    CareTeams,
    CaretDownOutlined,
    PlusOutlined,
    Billing
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const visible = ref(false)
    const addClient = ref(false)
    const addPeople = ref(false)
    const addSite = ref(false)
    const addCare = ref(false)
    const clientInformation = computed(() => {
      return store.state.clients.clientInformation
    })
    const clientStatusCodes = computed(() => {
      return store.state.common.clientStatusCodes
    })
    const clients = store.getters.clients
    onMounted(() => {
      store.dispatch('programList')
      store.dispatch('clientInformation', route.params.udid)
    })
    const activeTab = ref('1')
    const editInfo = ref(false);
    const addNewPerson = ref(false);
    const addExistingPerson = ref(false);
    const modalInfo = ref("");
    const formHeading = ref("");

    const openPeopleMenu = (event) => {
      visible.value = true
      modalInfo.value = "people";
      addPeople.value = false
      if(event.key == 'addNew') {
        formHeading.value = "Add New Person";
        addNewPerson.value = true
        addExistingPerson.value = false
      }
      else if(event.key == 'addExisting') {
        formHeading.value = "Add Existing Person";
        addNewPerson.value = false
        store.dispatch('allPeopleList', route.params.udid)
        addExistingPerson.value = true
      }
    }

    const showDrawer = (activeTab) => {
      //all error  null in add drawer
      store.state.clients.errorClients = ''
      visible.value = true;
      store.commit('siteProgramsList', null)
      if (activeTab && activeTab == 1) {
        modalInfo.value = "client";
        formHeading.value = clientInformation.value?.friendlyName;
        //add client = false and edit client = true
        addClient.value = true
      }
      /* else if (activeTab && activeTab == 2) {
        modalInfo.value = "people";
        formHeading.value = "Add Person";
        //add people = false and edit people = true
        addPeople.value = false
      } */
      else if (activeTab && activeTab == 3) {
        modalInfo.value = "sites";
        formHeading.value = "New Site";
        //add site = false and edit site = true
        addSite.value = false
      } else if (activeTab && activeTab == 4) {
        modalInfo.value = "careTeam";
        formHeading.value = "New Care Team";
        //add care = false and edit care = true
        addCare.value = false
      }
    };
    const onClose = (event) => {
      visible.value = event;
      if (clients.value?.addCareTeam) {
        store.commit('careTeambutton', true)
      }
      store.commit('addClientSite', null)
      store.commit('updateClientSite', null)
    };
    const checkData = ref()
    const updateClientStatus = (statusId) => {
      store.dispatch('updateClientStatus', {
        clientId: route.params.udid,
        statusId: statusId ? statusId : 427
      }).then(() => {
        store.dispatch('clientInformation', route.params.udid)
      })
    }
    onUnmounted(()=>{
      store.state.clients.clientsList = []
      store.state.clients.sitesList = []
      store.state.clients.peopleList = []
      store.state.clients.careTeamListByClient = []
    })
    const cancel = e => {
      console.log(e);
      // message.error('Click on No');
    };
    return {
      checkData,
      cancel,
      openPeopleMenu,
      addNewPerson,
      addExistingPerson,
      editInfo,
      modalInfo,
      activeTab,
      formHeading,
      clientInformation,
      updateClientStatus,
      visible,
      showDrawer,
      onClose,
      clientStatusCodes,
      arrayToObjectData,
      rolesPermissionFind,
      addClient,
      addPeople,
      addSite,
      addCare,
      screensPermissions:store.getters.screensPermissions,
    };
  },
};
</script>
