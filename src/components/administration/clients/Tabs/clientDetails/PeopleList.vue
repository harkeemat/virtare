<template>
  <a-table class="common-table" :scroll="{ y: 'calc(100vh - 370px)' }" v-if="clients?.peopleList?.length > 0"
    :dataSource="clients.peopleList" :columns="columns" :pagination="false" :customRow="customRow" @change="tableSorting">
    <!-- <template #bodyCell="{ column }">
      <template v-if="column.dataIndex == 'status'">
        <span class="status-active-circle"></span>
      </template> 
    </template> -->
  </a-table>
  <div v-else>
    <EmptyTable :text="$t('global.peopleTable')" />
  </div>
  <a-col :span="24" v-if="clients?.peopleList?.length > 0">
    <Pagination :meta="clients?.peopleMeta" commit="peopleList"
      :endpoint="API_ENDPOINTS['peopleListing'] + `/${route?.params?.udid}`" :params="null"
      loader="clientLoadingStatus" />
  </a-col>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose" width="60%">
    <People v-if="visible" :isEdit="isEdit" :formHeading="formHeading" @onClose="onClose" fromScreen="peopleList" />
  </a-drawer>
  <ClientLoader />
</template>
<script>
import { useRoute } from 'vue-router';
import People from "@/components/administration/clients/Tabs/addClient/People";
import { onMounted, ref } from "vue-demi";
import { useStore } from 'vuex';
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
import ClientLoader from "@/components/administration/clients/ClientLoader.vue";
import { API_ENDPOINTS } from "@/config/apiConfig"
import { tableSortingCommon,rolesPermissionFind } from '@/commonMethods/commonMethod';
import Pagination from "@/components/pagination/Pagination";
export default {
  components: {
    People,
    EmptyTable,
    ClientLoader,
    Pagination
  },
  setup() {
    const route = useRoute()
    const formHeading = ref("");
    const store = useStore()
    const showEditModal = ref(false);
    const visible = ref(false);
    const clients = store.getters.clients
    const isEdit = ref(false)
    const screensPermissions =  store.getters.screensPermissions
    onMounted(() => {
      store.dispatch("peopleList", { clientId: route.params.udid })

    })
    function customRow(record) {
      if(rolesPermissionFind(screensPermissions.value, [517])){
      return {
        onClick: () => {
          store.state.clients.errorClients = ''
          // showEditModal.value = true
          isEdit.value = true
          store.dispatch("peopleDetails", { id: record?.id, clientId: route?.params?.udid })
          formHeading.value = record.name;
          visible.value = true;
        },
      };
    }
    }

    const onClose = (event) => {
      visible.value = event;
    };
    const tableSorting = (pagination, filters, sorter) => {
      let filter = ''
      if (clients.value?.clientMeta?.total > clients.value?.clientMeta?.per_page) {
        return tableSortingCommon('clientsList', API_ENDPOINTS['peopleListing'] + `/${route?.params?.udid}`, sorter, clients.value?.clientMeta, filter, 'clientLoadingStatus')
      }
    };
    return {
      onClose,
      customRow,
      formHeading,
      showEditModal,
      visible,
      clients,
      isEdit,
      route,
      API_ENDPOINTS,
      tableSorting,
      tableSortingCommon,
      rolesPermissionFind,
      columns: [
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
          dataIndex: "fullName",
          key: "name",
          ellipsis: true,
          sorter: (a, b) => a.fullName.localeCompare(b.fullName)
        },
        {
          title: "Job Title",
          dataIndex: "title",
          key: "title",
          sorter: (a, b) => a.title.localeCompare(b.title)
        },
        {
          title: "Speciality",
          dataIndex: "specialization",
          key: "speciality",
          ellipsis: true,
          sorter: (a, b) => a.specialization.localeCompare(b.specialization)
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          ellipsis: true,
          sorter: (a, b) => a.role.localeCompare(b.role)
        },
        {
          title: "Sites",
          dataIndex: "site",
          key: "sites",
          ellipsis: true,
          sorter: (a, b) => a.site.localeCompare(b.site)
        },
        {
          title: "Care Teams",
          dataIndex: "careTeam",
          key: "teams",
          ellipsis: true,
          sorter: (a, b) => a.careTeam.localeCompare(b.careTeam)
        },
        {
          title: "NPI",
          dataIndex: "npi",
          key: "npi",
          ellipsis: true,
          sorter: (a, b) => a.npi.localeCompare(b.npi)
        },
      ],
    };
  },
};
</script>

