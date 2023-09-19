<template>
  <div class="common-wrapper" v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [62,65])">
    <a-row :gutter="16">
      <a-col :span="18">
        <a-typography-title :level="2" class="common-heading">{{ route.query?.name ? route.query?.name+"'s" : '' }} Patient(s)</a-typography-title>
        <!-- <a-typography-text class="common-tag-line caption">{{ patientsStore?.newPatientsMeta?.total }} active patients</a-typography-text> -->
        <a-typography-text class="common-tag-line caption">{{ topFilterText }}</a-typography-text>
      </a-col>

      <a-col :span="6" class="text-right">
        <a-dropdown-button @click="handleButtonClick" class="primary-dropdown">
          Actions
          <template #overlay>
            <a-menu @click="handleMenuClick" class="actionDropdown">
              <a-menu-item key="new" class="newPatient" @click="showDrawer"
                v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [62])">
                <PlusOutlined />New Patient
              </a-menu-item>
              <a-menu-item key="bitrix" class="newPatient" @click="showDrawer('bitrix')"
                v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [528])">
                <PlusOutlined />ADD FROM BITRIX
              </a-menu-item>
              <a-menu-item-group v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [62,65])">
                <template #title>Filter</template>
                <a-menu-item :class="filteredKey == 'allpatients' ? 'activeMenu' : ''" title="Show All"
                  key="allpatients">Show All</a-menu-item>
                <a-menu-item :class="filteredKey == 'watchlist' ? 'activeMenu' : ''" title="Watchlist"
                  key="watchlist">Watchlist</a-menu-item>
                <a-menu-item :class="filteredKey == 'todaysReadings' ? 'activeMenu' : ''" title="Today's Readings"
                  key="todaysReadings">Today's Readings</a-menu-item>
                <a-menu-item :class="filteredKey == 'unreviewedReadings' ? 'activeMenu' : ''" title="Unreviewed Readings"
                  key="unreviewedReadings">Unreviewed Readings</a-menu-item>
                <a-menu-item :class="filteredKey == 'riskOfCompliance' ? 'activeMenu' : ''" title="Risk of Compliance"
                  key="riskOfCompliance">Risk of Compliance</a-menu-item>
                <a-menu-item :class="filteredKey == 'outOfCompliance' ? 'activeMenu' : ''" title="Out of Compliance"
                  key="outOfCompliance">Out of Compliance</a-menu-item>
                <a-menu-item :class="filteredKey == 'shouldBeDischarged' ? 'activeMenu' : ''" title="Should be Discharged"
                  key="shouldBeDischarged">Should be Discharged</a-menu-item>
              </a-menu-item-group>
            </a-menu>
          </template>
          <template #icon>
            <CaretDownOutlined />
          </template>
        </a-dropdown-button>
      </a-col>

      <div class="patient-vitals" v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [62,65])">
        <!-- All Patients List Starts Here -->
        <a-tabs v-model:activeKey="activeTab" type="card" @change="tabChanged">
          <a-tab-pane v-for="patientsFilter in patientsStore?.patientsFilter"
            :key="patientsFilter?.url ? patientsFilter?.url : patientsFilter?.flagType">
            <template #tab>
              <span v-if="patientsFilter.flagType == 'Unknown'" class="patient-status"
                :style="'width: 22px; background-color: ' + patientsFilter?.color">
                <img src="@/assets/images/icons/question-sign.svg">
              </span>
              <span v-else class="patient-status"
                :style="'width: 22px; background-color: ' + patientsFilter?.color"></span>
              <a-typography-title :level="2">
                <span>{{ patientsFilter.patientsCount }}</span>
              </a-typography-title>
              <a-typography-text class="type">{{ patientsFilter.flagType }}</a-typography-text>
            </template>
            <a-col :span="24">
              <!-- <SearchField endPoint="inventory" commit="inventory" v-if="arrayToObjectData(screensPermissions, 336, 'id')"/> -->
              <a-table class="common-table" v-if="patientsStore?.allPatientsList?.length > 0"
                :dataSource="patientsStore?.allPatientsList" :columns="patientsListColumns" :pagination="false"
                :customRow="customRow" @change="tableSorting" :scroll="{x:1500}">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'flag'">
                    <span v-if="record.flag == 'Unknown'" class="patient-status"
                      :style="{ backgroundColor: record?.color != '' ? record?.color : '#7FF000' }">
                      <img src="@/assets/images/icons/question-sign.svg">
                    </span>


                    <span v-else class="patient-status"
                      :style="{ backgroundColor: record?.color != '' ? record?.color : '#7FF000' }">
                      <!-- Plus icon -->
                      <template v-if="record?.continueReading > 0">
                        <span v-for="count in record?.continueReading" :key="count" class="plus-sign">
                          <template v-if="!(count > 3)"><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9"
                              viewBox="0 0 9 9" fill="none">
                              <path
                                d="M5.68861 8.10526H3.99561V4.917H0.894745V3.39879H3.99561V0.210526H5.68861V3.39879H8.78948V4.917H5.68861V8.10526Z"
                                fill="white" />
                            </svg>
                          </template>
                        </span>
                        <!-- <span v-for="reading in record?.continueReading" :key="reading" class="plus-sign">+</span> -->
                      </template>
                      <template v-else>
                        <span class="plus-sign-none">&nbsp;</span>
                      </template>
                      <!-- Check mark -->
                      <span class="check-mark" v-if="record?.reviewed">
                        <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.37634 3.5L0 2.07021L0.5 1.5L1.37634 2.5L3.5 0.5L4 0.774468L1.37634 3.5Z"
                            fill="white" />
                        </svg>
                      </span>
                    </span>
                  </template>
                </template>
              </a-table>
              <div v-else>
                <EmptyTable :text="$t('global.patientsTable')" />
              </div>
              <!-- Filter change then show loader only table -->
              
              <!-- Pgination if page 2 or more then show  -->
              <Pagination v-if="patientsStore?.allPatientsList?.length > 0" :meta="patientsStore?.newPatientsMeta"
                commit="allPatientsList" :endpoint="API_ENDPOINTS_V3['patient']"
                :params="'&queryType=' + filteredKey + '&filter=' + activeTab+'&staff='+staffId" loader="patientsLoaderStatus" />
            </a-col>

          </a-tab-pane>
        </a-tabs>
        <!-- First time open patients page and filter are null then this loader show -->
        <Loader v-if="store.state.patientsStore.patientsLoaderStatus || patientsLoader"/>
      </div>
      
    </a-row>
  </div>

  <a-drawer placement="right" :closable="false" :visible="visible || bitrixVisible" width="60%">
    <PatientForm @hideDrawer="hideDrawer" v-if="visible" />
    <AddPatientBitrix @hideDrawer="hideDrawer" v-if="bitrixVisible" />
  </a-drawer>
</template>

<script setup>
import {
  onMounted,
  ref,
  watchEffect
} from "vue";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons-vue";
import PatientForm from "@/components/patients/patientsList/modals/PatientForm";
import AddPatientBitrix from "@/components/patients/patientsList/modals/AddPatientBitrix";
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex';
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Loader from "@/components/patients/Loader.vue"
import Pagination from "@/components/pagination/Pagination";
import { API_ENDPOINTS_V3 } from "@/config/apiConfig"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
import { patientFilterText } from "@/config/common";
import { rolesPermissionFind} from '@/commonMethods/commonMethod';
//import SearchField from "@/components/common/input/SearchField";

    const store = useStore()
    const router = useRouter();
    const route  = useRoute()
    const activeTab = ref('All')
    const filteredKey = ref('allpatients')
    const patientListText = ref('')
    const topFilterText = ref('All Active')
    const unknownPatientsMeta = ref(365)
    const patientsStore = store.getters.patientsStore
    const patientsCount = ref(patientsStore?.value?.newPatientsMeta?.total)
    const staffId = route.query?.staffId ? route.query?.staffId : ''
    onMounted(() => {
      // store.commit('patientPrograms', null)
      // store.commit('deviceList', null)
      // store.dispatch('allPatientsList', { filter: '?queryType=' + filteredKey.value + '&filter=' + activeTab.value+'&staff='+staffId })
      // let sum = Number(patientsStore.value?.criticalPatientsMeta?.total) + Number(patientsStore.value?.wnlPatientsMeta?.total) + Number(patientsStore.value?.moderatePatientsMeta?.total)
      // unknownPatientsMeta.value = Number(patientsStore.value?.newPatientsMeta?.total) - sum
    })

    watchEffect(()=>{
      if(route.query?.staffId && route.name=="PatientsList"){
      store.dispatch('allPatientsList', { filter: '?queryType=' + filteredKey.value + '&filter=' + activeTab.value+'&staff='+staffId })
      }else if(route.name=="PatientsList"){
        store.dispatch('allPatientsList', { filter: '?queryType=' + filteredKey.value + '&filter=' + activeTab.value+'&staff=' })
      }
    })

    const visible = ref(false);
    const bitrixVisible = ref(false);

    const showDrawer = (value) => {
      if (value == 'bitrix') {
        bitrixVisible.value = true
      }
      else {
        visible.value = true;
      }
    };

    const hideDrawer = () => {
      visible.value = false;
      bitrixVisible.value = false;
    };

    
//Patient details
    function customRow(record) {
      return {
        onClick: () => {
          if(rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [65]))
{          store.dispatch("patientInformation", record.udid).then(() => {
            store.commit("patientsLoaderStatus", false);
          });
          router.push({
            name: "PatientDetails",
            params: { udid: record.udid }
          });
        }
      }
      };
    }
//table sorting
    const tableSorting = (pagination, filters, sorter) => {
      let filter = '&queryType=' + filteredKey.value + '&filter=' + activeTab.value+'&staff='+staffId
      if (patientsStore.value?.newPatientsMeta?.total > patientsStore.value?.newPatientsMeta?.per_page) {
        return tableSortingCommon('allPatientsList', API_ENDPOINTS_V3['patient'], sorter, patientsStore.value?.newPatientsMeta, filter, 'patientsLoaderStatus')
      }
    };
//change patients tab 
    const tabChanged = (key) => {
      store.dispatch('allPatientsList', { filter: '?queryType=' + filteredKey.value + '&filter=' + key+'&staff='+staffId })

    }
// Patient filetr
    const handleMenuClick = (event) => {
      //if add new patients and betrix then not change any filter
      if(!['bitrix','new'].includes(event.key)){
  
      topFilterText.value = event?.key == "allpatients" ? "All active" : patientFilterText[event?.key]
      patientsCount.value = event?.key == "allpatients" ? patientsStore.value?.newPatientsMeta?.total : patientFilterText[event?.key + 'Count']
      activeTab.value = event?.key == 'shouldBeDischarged' ? 90 : 'All'
      filteredKey.value = event?.key
      patientListText.value = event?.key == "allpatients" ? "All" : event?.item?.title
      store.dispatch('allPatientsList', { filter: '?queryType=' + filteredKey.value + '&filter=' + activeTab.value+'&staff='+staffId })
      }
    }

    const patientsListColumns = [
      {
        title: "Status",
        dataIndex: "flag",
        key: "flag",
        ellipsis: true,
        width: 80,
        align: "center",
        //sorter: (a, b) => a.flag.localeCompare(b.flag)
      },
      {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        ellipsis: true,
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      {
        title: "Care Team",
        dataIndex: "careTeam",
        key: "careTeam",
        ellipsis: true,
        //sorter: (a, b) => a.careTeam.localeCompare(b.careTeam),
      },
      {
        title: "Last Reading",
        dataIndex: "lastReading",
        key: "lastReading",
        ellipsis: true,
        //sorter: (a, b) => a.lastReading.localeCompare(b.lastReading),
      },
      {
        title: "Messages",
        dataIndex: "messages",
        key: "messages",
        ellipsis: true,
        //sorter: (a, b) => a.messages.localeCompare(b.messages),
      },
      {
        title: "Open Task",
        dataIndex: "openTasks",
        key: "openTasks",
        ellipsis: true,
        //sorter: (a, b) => a.openTasks.localeCompare(b.openTasks),
      },
      {
        title: "Nurse/MA",
        dataIndex: "nurse",
        key: "nusre",
        ellipsis: true,
        //sorter: (a, b) => a.nurse.localeCompare(b.nurse),
      },
      {
        title: "Client",
        dataIndex: "clientName",
        key: "clientName",
        ellipsis: true,
        //sorter: (a, b) => a.nurse.localeCompare(b.nurse),
      },
      {
        title: "Last Contacted",
        dataIndex: "lastContacted",
        key: "lastContacted",
        ellipsis: true,
        //sorter: (a, b) => a.lastContacted.localeCompare(b.lastContacted),
      },
    ]

</script>

<style lang="scss" scoped>
.patient-vitals {
  margin: 40px 0 0;
}
.search-input {
  margin: 0 0 15px;
  width: 500px!important;
}
</style>

