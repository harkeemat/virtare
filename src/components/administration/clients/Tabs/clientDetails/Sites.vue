<template>
  <a-table class="common-table" :scroll="{ y: 'calc(100vh - 370px)' }" v-if="sitesList?.sitesList?.length > 0"
    :dataSource="sitesList?.sitesList" :columns="siteColumns" :pagination="false" :customRow="customRow"
    @change="tableSorting">
    <template #bodyCell="{ column, text, record }">

      <template v-if="column.dataIndex == 'location'">
        <span v-if="text == 2">{{ record.city }}, {{ record.stateName }}</span>
        <span v-else>Virtual</span>
      </template>
      <template v-if="column.dataIndex == 'programs'">
        <div class="programTag">
          <a-tag v-for="program in record.programs" :key="program.id" class="customPills" :style="
            'border-color:' + program?.color + ';color:' + program?.color">{{ program.code }}</a-tag>
        </div>
      </template>
    </template>
  </a-table>

  <div v-else>
    <EmptyTable :text="$t('global.siteTable')" />
  </div>
  <a-col :span="24" v-if="sitesList?.sitesList?.length > 0">
    <Pagination :meta="sitesList?.siteMeta" commit="sitesList" :endpoint="
      API_ENDPOINTS['client'] +
      `/${route?.params?.udid}/` +
      API_ENDPOINTS['site']
    " :params="null" loader="clientLoadingStatus" />
  </a-col>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose" width="60%">
    <Sites :isEdit="true" v-if="visible" :siteUdid="siteUdid" :formHeading="formHeading" @onClose="onClose" />
  </a-drawer>
  <ClientLoader />
</template>
<script>
// import { useRouter } from 'vue-router';
import Sites from "@/components/administration/clients/Tabs/addClient/Sites";
import { onMounted, ref } from "vue-demi";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import ClientLoader from "@/components/administration/clients/ClientLoader.vue";
import Pagination from "@/components/pagination/Pagination";
import { API_ENDPOINTS } from "@/config/apiConfig"
import { tableSortingCommon, rolesPermissionFind } from '@/commonMethods/commonMethod';
export default {
  components: {
    Sites,
    EmptyTable,
    ClientLoader,
    Pagination,
  },
  setup() {
    // const router = useRouter();
    const formHeading = ref("");
    const siteUdid = ref(null);
    const showEditModal = ref(false);
    const visible = ref(false);
    const store = useStore();
    const route = useRoute();
    const screensPermissions = store.getters.screensPermissions
    const sitesList = store.getters.clients;
    onMounted(() => {
      store.dispatch("sitesList", { clientId: route?.params?.udid });
    });

    function customRow(record) {
      if (rolesPermissionFind(screensPermissions.value, [521])) {
        return {
          onClick: () => {
            store.state.clients.errorClients = "";
            siteUdid.value = record.udid;
            store
              .dispatch("clientSiteDetails", {
                clientId: route.params.udid,
                siteId: record.udid,
              })
              .then((response) => {
                if (response) {
                  formHeading.value = record.friendlyName;
                  visible.value = true;
                }
              });
          },
        };
      }
    }
    const onClose = (event) => {
      visible.value = event;
    };

    const deleteSite = (siteId) => [
      store
        .dispatch("deleteSite", {
          clientId: route.params.udid,
          siteId: siteId,
        })
        .then((status) => {
          if (status) {
            visible.value = false;
            store.dispatch("sitesList", route.params.udid);
          }
        }),
    ];
    const tableSorting = (pagination, filters, sorter) => {
      let filter = ''
      if (sitesList.value?.clientMeta?.total > sitesList.value?.clientMeta?.per_page) {
        return tableSortingCommon('clientsList', API_ENDPOINTS['client'] + `/${route?.params?.udid}/` + API_ENDPOINTS['site'], sorter, sitesList.value?.clientMeta, filter, 'clientLoadingStatus')
      }
    };
    return {
      deleteSite,
      siteUdid,
      sitesList,
      customRow,
      formHeading,
      showEditModal,
      visible,
      onClose,
      API_ENDPOINTS,
      route,
      tableSorting,
      tableSortingCommon,
      rolesPermissionFind,
      siteColumns: [
        // {
        //   title: "Status",
        //   dataIndex: "status",
        //   key: "status",
        //   width: 80,
        //   align: "center",
        //   sorter: (a, b) => a.status.localeCompare(b.status)
        // },
        {
          title: "Name",
          dataIndex: "friendlyName",
          key: "friendlyName",
          ellipsis: true,
          sorter: (a, b) => a.friendlyName.localeCompare(b.friendlyName),
        },
        {
          title: "Location",
          dataIndex: "location",
          key: "location",
          ellipsis: true,
          sorter: (a, b) => a?.city?.localeCompare(b?.city),
        },
        {
          title: "Site Head",
          dataIndex: "isHead",
          key: "site",
          ellipsis: true,
          sorter: (a, b) => a.isHead.localeCompare(b.isHead),
        },
        {
          title: "Programs",
          dataIndex: "programs",
          key: "programs",
          ellipsis: false,
          sorter: (a, b) =>
            a?.programs[0]?.code?.localeCompare(b?.programs[0]?.code),
        },
        {
          title: "Care Teams",
          dataIndex: "CareTeam",
          key: "teams",
          ellipsis: true,
          sorter: (a, b) => a.CareTeam - b.CareTeam,
        },
        {
          title: "Staff",
          dataIndex: "staff",
          key: "staff",
          ellipsis: true,
          sorter: (a, b) => a.staff - b.staff,
        },
        {
          title: "Active Patients",
          dataIndex: "patients",
          key: "patients",
          ellipsis: true,
          sorter: (a, b) => a?.patients - b.patients,
        },
      ],
    };
  },
};
</script>

