<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="18">
        <a-typography-title :level="2" class="common-heading">Clients</a-typography-title>
        <a-typography-text class="common-tag-line caption">
          {{ $t('global.clientsText') }}
        </a-typography-text>
      </a-col>
      <a-col :span="6" class="text-right" v-if="rolesPermissionFind(screensPermissions, [508])">
        <!-- <router-link :to="{ name: 'AddClient' }"> -->
        <a-button class="primary-btn" @click="showDrawer">
          <template #icon>
            <PlusOutlined />
          </template>
          New Client
        </a-button>
        <!-- </router-link> -->
      </a-col>
      <a-col :span="24" v-if="rolesPermissionFind(screensPermissions, [509])">
        <SearchField
           commit="clientsList"
           endPoint="client/getClient"
           loader="loadingTableStatus"
          />
        <a-table class="common-table" v-if="client?.clientsList?.length > 0" :dataSource="client?.clientsList"
          :customRow="customRow" :columns="clientColumns" @change="tableSorting" :pagination="false"
          >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'status'">
              <span v-if="record?.statusName == 'Active'" class="status-active-circle" title="Active"></span>
              <span v-if="record?.statusName == 'Deleted'" class="status-deleted-circle" title="Deleted"></span>
              <span v-if="record?.statusName == 'In Active'" class="status-suspended-circle" title="Suspend"></span>
            </template>
            <template v-if="column.dataIndex == 'location'">
              {{ record?.city }}, {{ record?.stateName }}
            </template>
            <template v-if="column.dataIndex == 'activePatients'">
              {{ record.activePatients }}
            </template>
            <template v-if="column.dataIndex == 'programs'">
              <div class="programTag">
                <a-tag v-for="program in record.programs" :key="program.id" class="customPills"
                  :style="'border-color:' + program?.color + ';color:' + program?.color">{{
                    program.code }}</a-tag>
              </div>
            </template>
          </template>
        </a-table>
        <div v-else>
          <EmptyTable :text="$t('global.clientTable')" />
        </div>
        <ClientLoader />
      </a-col>
      <a-col :span="24" v-if="client?.clientsList?.length > 0 && rolesPermissionFind(screensPermissions, [509])">
        <Pagination :meta="client?.clientMeta" commit="clientsList" :endpoint="API_ENDPOINTS['getClient']" :params="null"
          loader="clientLoadingStatus" />
      </a-col>
    </a-row>
  </div>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose" width="60%">
    <AddClient @onClose="onClose" v-if="visible" />
  </a-drawer>
</template>

<script>
import AddClient from "@/components/administration/clients/AddClient";
import { PlusOutlined } from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import ClientLoader from "@/components/administration/clients/ClientLoader.vue"
import Pagination from "@/components/pagination/Pagination";
import { API_ENDPOINTS } from "@/config/apiConfig"
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { tableSortingCommon, rolesPermissionFind } from '@/commonMethods/commonMethod';
import SearchField from "@/components/common/input/SearchField";
export default {
  components: { PlusOutlined, AddClient, ClientLoader, Pagination, EmptyTable,SearchField },
  setup() {
    const router = useRouter();
    const store = useStore()
    const placement = ref("left");
    const visible = ref(false);
    const isEdit = ref(false);
    const client = store.getters.clients
    const screensPermissions = store.getters.screensPermissions
    onMounted(() => {
      store.dispatch('clientsList')
    })

    const showDrawer = () => {
      visible.value = true;
      isEdit.value = false;
    };

    const onClose = (event) => {
      visible.value = event;
    };
    function customRow(record) {
      if (rolesPermissionFind(screensPermissions.value, [513])) {
        return {
          onClick: () => {
            // store.dispatch('clientInformation', record.udid).then(() => {
            router.push({
              name: "ClientDetails",
              params: { udid: record.udid }
            });
            // })
          },
        }
      }
    }

    const clientColumns = [
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 80,
        align: "center",
        //sorter: (a, b) => a.statusName.localeCompare(b.statusName)
      },
      {
        title: "Friendly Name",
        dataIndex: "friendlyName",
        key: "friendlyName",
        ellipsis: true,
        sorter: (a, b) => a.friendlyName.localeCompare(b.friendlyName),
      },
      {
        title: "Contract Type",
        dataIndex: "contractTypeName",
        key: "contractTypeName",
        ellipsis: true,
        sorter: (a, b) => a.contractTypeName.localeCompare(b.contractTypeName),
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "city",
        ellipsis: true,
        sorter: (a, b) => a?.city?.localeCompare(b?.city)

      },
      {
        title: "Active Patients",
        dataIndex: "activePatients",
        key: "activePatients",
        ellipsis: true,
        sorter: (a, b) => a.activePatients - b.activePatients

      },
      {
        title: "Programs",
        dataIndex: "programs",
        key: "programs"
      //   sorter: (a, b) => {
      //                   if (a && a.program && a.program.length && b && b.program && b.program.length) {
      //                       return a.program.length - b.program.length;
      //                   } else if (a && a.program && a.program.length) {
      //                       // That means be has null program, so a will come first.
      //                       return -1;
      //                   } else if (b && b.program && b.program.length) {
      //                       // That means a has null program so b will come first.
      //                       return 1;
      //                   }

      //                   // Both program has null value so there will be no order change.
      //                   return 0;
      //               }
       },
    ]
    const tableSorting = (pagination, filters, sorter) => {
      let filter = ''
      if (client.value?.clientMeta?.total > client.value?.clientMeta?.per_page) {
        return tableSortingCommon('clientsList', API_ENDPOINTS['getClient'], sorter, client.value?.clientMeta, filter, 'clientLoadingStatus')
      }
    };
    return {
      customRow,
      placement,
      visible,
      isEdit,
      showDrawer,
      onClose,
      clientColumns,
      client,
      API_ENDPOINTS,
      tableSorting,
      tableSortingCommon,
      rolesPermissionFind,
      screensPermissions,
    };
  },
};
</script>


<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>