<template>
  <a-table class="common-table" :scroll="{ y: 'calc(100vh - 370px)' }" v-if="clients?.careTeamListByClient?.length > 0"
    :dataSource="clients?.careTeamListByClient" :columns="columns" :pagination="false" :customRow="customRow"
    @expand="expandRow" :row-class-name="
      (record, index) => (record.udid === expandedRecordId ? 'active' : '')">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex == 'programs'">
        <div class="programTag">
          <a-tag v-for="program in record.programs" :key="program.id" class="customPills"
            :style="'border-color:' + program?.color + ';color:' + program?.color">{{ program.code }}</a-tag>
        </div>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <a-space :size="42">
        <a-typography-title :level="3" class="common-sub-heading">Members</a-typography-title>
        <a-button class="primary-btn" @click="showDrawer('member', record)" v-if="rolesPermissionFind(screensPermissions, [526])"><plus-outlined />New member</a-button>
      </a-space>

      <a-table class="common-table inner-table" :dataSource="record?.careTeamMembers" :columns="membercolumns"
        :pagination="false" :customRow="customRow" @change="tableSorting">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'name'">
            <a-tooltip>
              <template #title>{{ record?.isSiteHead ? 'Site Head' : 'Care Team Head' }}</template>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                v-if="record?.isSiteHead" style="margin-right: 5px; vertical-align: middle">
                <path
                  d="M4.14286 22C3.57143 22 3.07143 21.7857 2.64286 21.3571C2.21429 20.9286 2 20.4286 2 19.8571V4.14286C2 3.57143 2.21429 3.07143 2.64286 2.64286C3.07143 2.21429 3.57143 2 4.14286 2H19.8571C20.4286 2 20.9286 2.21429 21.3571 2.64286C21.7857 3.07143 22 3.57143 22 4.14286V19.8571C22 20.4286 21.7857 20.9286 21.3571 21.3571C20.9286 21.7857 20.4286 22 19.8571 22H4.14286ZM4.14286 18C5.30952 17.2381 6.56548 16.6667 7.91072 16.2857C9.25595 15.9048 10.619 15.7143 12 15.7143C13.381 15.7143 14.7441 15.9048 16.0893 16.2857C17.4345 16.6667 18.6905 17.2381 19.8571 18V4.14286H4.14286V18ZM12 17.8571C10.7381 17.8571 9.53572 18.0179 8.39286 18.3393C7.25 18.6607 6.19048 19.1667 5.21429 19.8571H18.7857C17.7619 19.1667 16.6667 18.6607 15.5 18.3393C14.3333 18.0179 13.1667 17.8571 12 17.8571ZM12 13.8214C10.9048 13.8214 9.97024 13.4345 9.19643 12.6607C8.42262 11.8869 8.03572 10.9524 8.03572 9.85715C8.03572 8.76191 8.42262 7.82738 9.19643 7.05357C9.97024 6.27976 10.9048 5.89286 12 5.89286C13.0952 5.89286 14.0298 6.27976 14.8036 7.05357C15.5774 7.82738 15.9643 8.76191 15.9643 9.85715C15.9643 10.9524 15.5774 11.8869 14.8036 12.6607C14.0298 13.4345 13.0952 13.8214 12 13.8214ZM11.9821 11.9286C12.5655 11.9286 13.0595 11.7321 13.4643 11.3393C13.8691 10.9464 14.0714 10.4583 14.0714 9.875C14.0714 9.29167 13.87 8.79762 13.4673 8.39286C13.0645 7.9881 12.5754 7.78572 12 7.78572C11.4048 7.78572 10.9107 7.98711 10.5179 8.38989C10.125 8.79266 9.92857 9.28174 9.92857 9.85715C9.92857 10.4524 10.125 10.9464 10.5179 11.3393C10.9107 11.7321 11.3988 11.9286 11.9821 11.9286Z"
                  fill="#8A969F" />
              </svg>

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                v-if="record?.isHead">
                <path
                  d="M17.1 14.475C16.442 14.475 15.8858 14.2478 15.4315 13.7935C14.9772 13.3391 14.75 12.783 14.75 12.125C14.75 11.467 14.9772 10.9108 15.4315 10.4565C15.8858 10.0021 16.442 9.77498 17.1 9.77498C17.758 9.77498 18.3142 10.0021 18.7685 10.4565C19.2228 10.9108 19.45 11.467 19.45 12.125C19.45 12.783 19.2228 13.3391 18.7685 13.7935C18.3142 14.2478 17.758 14.475 17.1 14.475ZM12.2 20V18.725C12.2 18.2916 12.2917 17.9208 12.475 17.6125C12.6583 17.3041 12.9167 17.0666 13.25 16.9C13.8667 16.5833 14.4917 16.35 15.125 16.2C15.7583 16.05 16.4167 15.975 17.1 15.975C17.7833 15.975 18.4417 16.0458 19.075 16.1875C19.7083 16.3291 20.3333 16.5666 20.95 16.9C21.2833 17.05 21.5417 17.2833 21.725 17.6C21.9083 17.9166 22 18.2916 22 18.725V20H12.2ZM10 11.975C8.9 11.975 8 11.625 7.3 10.925C6.6 10.225 6.25 9.32498 6.25 8.22498C6.25 7.12498 6.6 6.22498 7.3 5.52498C8 4.82498 8.9 4.47498 10 4.47498C11.1 4.47498 12 4.82498 12.7 5.52498C13.4 6.22498 13.75 7.12498 13.75 8.22498C13.75 9.32498 13.4 10.225 12.7 10.925C12 11.625 11.1 11.975 10 11.975ZM2 20V17.65C2 17.0833 2.14167 16.5625 2.425 16.0875C2.70833 15.6125 3.13056 15.25 3.69168 15C4.81389 14.5 5.8875 14.125 6.9125 13.875C7.9375 13.625 8.96454 13.5 9.99363 13.5C10.5312 13.5 11.0083 13.525 11.425 13.575C11.8417 13.625 12.2917 13.7 12.775 13.8L12.1375 14.4375L11.5 15.075C11.2833 15.0416 11.05 15.0208 10.8 15.0125C10.55 15.0041 10.2833 15 10 15C9.05622 15 8.13277 15.0958 7.22965 15.2875C6.32655 15.4791 5.35 15.8333 4.3 16.35C4.06667 16.4666 3.875 16.65 3.725 16.9C3.575 17.15 3.5 17.4 3.5 17.65V18.5H10.7V20H2ZM10 10.475C10.65 10.475 11.1875 10.2625 11.6125 9.83748C12.0375 9.41248 12.25 8.87498 12.25 8.22498C12.25 7.57498 12.0375 7.03748 11.6125 6.61248C11.1875 6.18748 10.65 5.97498 10 5.97498C9.35 5.97498 8.8125 6.18748 8.3875 6.61248C7.9625 7.03748 7.75 7.57498 7.75 8.22498C7.75 8.87498 7.9625 9.41248 8.3875 9.83748C8.8125 10.2625 9.35 10.475 10 10.475Z"
                  fill="#8A969F" />
              </svg>
            </a-tooltip>

            {{ text }}
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
  <div v-else>
    <EmptyTable :text="$t('global.careTeamTable')" />
  </div>
  <a-col :span="24" v-if="clients?.careTeamListByClient?.length > 0">
    <Pagination :meta="clients?.careMeta" commit="careTeamListByClient" :endpoint="
      API_ENDPOINTS['careTeamListByClient'] + `/${route?.params?.udid}`
    " :params="null" loader="clientLoadingStatus" />
  </a-col>
  <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
    <CareTeam v-if="formType == 'careTeam' && visible" :isEdit="true" :formType="formType" :formHeading="formHeading"
      @onClose="onClose" />
    <CareTeamMember v-if="formType == 'member' && visible" :isEdit="isEdit" :isHead="isHead"
      :siteAndCareMessage="siteAndCareMessage" :formType="formType" :formHeading="formHeading" @onClose="onClose"
      fromScreen="careTeams" :memberUdid="memberUdid" :careTeamId="careTeamId" :recordId="recordId" />
  </a-drawer>
  <ClientLoader />
</template>

<script>
import CareTeam from "@/components/administration/clients/Tabs/addClient/CareTeam";
import { PlusOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, watchEffect } from "vue-demi";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import CareTeamMember from "@/components/administration/clients/Tabs/addClient/CareTeamMember";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import ClientLoader from "@/components/administration/clients/ClientLoader.vue";
import { API_ENDPOINTS } from "@/config/apiConfig";
import Pagination from "@/components/pagination/Pagination";
import { tableSortingCommon, rolesPermissionFind  } from '@/commonMethods/commonMethod';
export default {
  components: {
    CareTeam,
    CareTeamMember,
    PlusOutlined,
    EmptyTable,
    ClientLoader,
    Pagination,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const careTeamId = ref(null);
    const formType = ref("careTeam");
    const clients = store.getters.clients;
    onMounted(() => {
      store.dispatch("careTeamListByClient", { clientId: route?.params?.udid });
    });
    watchEffect(() => {
      if (clients.value?.addCareTeam && clients.value?.careTeambutton) {
        setTimeout(() => {
          var tableContent = document.querySelector(
            ".ant-table-row-expand-icon"
          );
          tableContent ? tableContent.click() : "";
          store.state.clients.addCareTeam = null;
          store.commit("careTeambutton", false);
        }, 1000);
      }
    });
    const formHeading = ref("");
    const memberUdid = ref("");
    const recordId = ref(null);
    const showEditModal = ref(false);
    const visible = ref(false);
    const isEdit = ref(false);
    const expandedRecordId = ref();
    const isHead = ref(0);
    const siteAndCareMessage = ref("");
    const screensPermissions = store.getters.screensPermissions
    function customRow(record) {
      
      return {
        onClick: () => {
          if (!record.careTeamMembers) {
            if (rolesPermissionFind(screensPermissions.value, [517])) {
              isEdit.value = true;
              recordId.value = record?.memberUdid;
              formType.value = "member";
              siteAndCareMessage.value = record?.isSiteHead ? "site head" : "clinical head";
              isHead.value = record?.isHead ? record?.isHead : record?.isSiteHead;
              store
                .dispatch("peopleDetails", {
                  id: record?.memberUdid,
                  clientId: route?.params?.udid,
                })
                .then((response) => {
                  if (response) {
                    formHeading.value = record?.name;
                    memberUdid.value = record?.udid;
                    visible.value = true;
                  }
                });
            }
          } else {
            if (rolesPermissionFind(screensPermissions.value, [525])) {
              formType.value = "careTeam";
              store.dispatch("careTeamDetails", record.udid).then((response) => {
                if (response) {
                  formHeading.value = record.name;
                  visible.value = true;
                  store.dispatch(
                    "siteProgramsList",
                    clients.value?.careTeamDetails?.siteId
                  );
                }
              });
              store.dispatch("siteHead", {
                id: route?.params?.udid,
                status: "",
              });
              store.dispatch("careTeamMembersList", record.udid).then(() => {
                careTeamId.value = record.udid;
              });
              formHeading.value = record.name;
              visible.value = true;
            }
          }
        },
      };
    }
    const onClose = (event) => {
      visible.value = event;
    };

    const showDrawer = (type, value) => {
      // store.dispatch("siteHead", {
      //   id: route.params.udid,
      //   status: "2",
      // });
      formHeading.value = "New Member";
      isEdit.value = false;
      careTeamId.value = value.udid;
      formType.value = type;
      visible.value = true;
    };

    const getMembers = (isExpanded, record) => {
      careTeamId.value = record.udid;
      if (isExpanded) {
        store.dispatch("careTeamMembersList", record.udid);
      }
    };

    const expandRow = (expanded, record) => {
      expandedRecordId.value = expanded ? record.udid : "";
    };
    const tableSorting = (pagination, filters, sorter) => {
      let filter = ''
      if (clients.value?.clientMeta?.total > clients.value?.clientMeta?.per_page) {
        return tableSortingCommon('clientsList', API_ENDPOINTS['careTeamListByClient'] + `/${route?.params?.udid}`, sorter, clients.value?.clientMeta, filter, 'clientLoadingStatus')
      }
    };

    return {
      expandedRecordId,
      expandRow,
      formType,
      getMembers,
      clients,
      customRow,
      formHeading,
      showEditModal,
      visible,
      onClose,
      showDrawer,
      memberUdid,
      recordId,
      careTeamId,
      isEdit,
      API_ENDPOINTS,
      route,
      isHead,
      tableSorting,
      tableSortingCommon,
      rolesPermissionFind,
      screensPermissions,
      siteAndCareMessage,
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "Clinical Head",
          dataIndex: "teamHead",
          key: "teamHead",
          sorter: (a, b) => a.teamHead.localeCompare(b.teamHead),
        },
        {
          title: "Programs",
          dataIndex: "programs",
          key: "programs",
          sorter: (a, b) =>
            a?.programs[0]?.code?.localeCompare(b?.programs[0]?.code),
        },
        {
          title: "Staff",
          dataIndex: "staff",
          key: "staff",
          sorter: (a, b) => a.staff - b.staff,
        },
        {
          title: "Site",
          dataIndex: "site",
          key: "sites",
          sorter: (a, b) => a.site.localeCompare(b.site),
        },
        {
          title: "Active Patients",
          dataIndex: "patients",
          key: "patients",
          sorter: (a, b) => a.patients - b.patients,
        },
      ],

      membercolumns: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "Job Title",
          dataIndex: "title",
          key: "title",
          sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
          title: "Role",
          dataIndex: "roleName",
          key: "roleName",
          sorter: (a, b) => a.roleName.localeCompare(b.roleName),
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.inner-table {
  margin: 21px 0 0;
}
</style>

