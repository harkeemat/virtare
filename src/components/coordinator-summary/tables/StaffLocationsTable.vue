<template>
  <div>
    <a-table class="sortIconTable" rowKey="id" :columns="staffLocationsColumns" :data-source="staffLocations" :pagination="false" @change="handleTableChange" >
      <template #entityType="{record}">
        <span v-if="record.subLocationLevel">{{ record.subLocationLevel }}</span>
        <span v-else>{{ record.entityType }}</span>
      </template>
      <template #isDefault="{record}">
        <span v-if="record.isDefault"><strong>Yes</strong></span>
        <span v-else><strong>No</strong></span>
      </template>
      <template #actions="{record}" v-if="arrayToObjact(screensPermissions, 481)">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{$t('global.delete')}}</span>
          </template>
          <a class="icons" v-if="record.isDefault" :disabled="record.isDefault">
            <DeleteOutlined />
          </a>
          <a class="icons" v-else @click="deleteStaffLocation(record.udid)">
            <DeleteOutlined />
          </a>
        </a-tooltip>
      </template>
    </a-table>
  </div>
</template>

<script>
import {
  DeleteOutlined,
} from "@ant-design/icons-vue"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue-demi'
import { warningSwal } from '../../../commonMethods/commonMethod'
import { messages } from '../../../config/messages'
import { arrayToObjact } from "@/commonMethods/commonMethod";

export default {
  components: {
    DeleteOutlined,
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const staffLocations = computed(() => {
      return store.state.careCoordinator.staffLocations
    })

    onMounted(() => {
      store.dispatch('staffLocations', {
        staffId: route.params.udid,
        page: ""
      })
      staffLocations.value.map(item => {
        JSON.parse(JSON.parse(item.locationsHierarchy))
        
      })
    })
    
    const staffLocationsColumns = [
      {
        title: 'Location',
        dataIndex: 'locationName',
        key: 'locationName',
        filterMultiple: false,
        onFilter: (value, record) => record.locationName.indexOf(value) === 0,
        sorter: (a, b) => a.locationName.localeCompare(b.locationName),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Level',
        dataIndex: 'entityType',
        key: 'entityType',
        slots: {
          customRender: 'entityType'
        },
        filterMultiple: false,
        onFilter: (value, record) => record.entityType.indexOf(value) === 0,
        sorter: (a, b) => a.entityType.localeCompare(b.entityType),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Is Default',
        dataIndex: 'isDefault',
        key: 'isDefault',
        slots: {
          customRender: 'isDefault'
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        slots: {
          customRender: 'actions'
        }
      },
    ]

    const deleteStaffLocation = (udid) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteStaffLocation', {
            staffId: route.params.udid,
            locationId: udid
          }).then(() => {
            store.dispatch('staffLocations', {
              staffId: route.params.udid,
              page: ""
            })
          })
        }
      })
    }

    const handleTableChange = (pag, filters, sorter) => {
      if (sorter.order) {
        let order = sorter.order == "ascend" ? "ASC" : "DESC";
        let orderParam = "?orderField=" + sorter.field + "&orderBy=" + order;
        store.dispatch("orderTable", {
          data: orderParam,
          orderBy: order,
          page: pag,
          filters: filters,
        });
        store.dispatch('staffLocations', {
          staffId: route.params.udid,
          page: store.getters.searchTable.value != null ? store.getters.searchTable.value + orderParam : orderParam
        });
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch('staffLocations', {
          staffId: route.params.udid,
          data: store.getters.searchTable.value != null ? store.getters.searchTable.value + store.getters.orderTable.value.data : store.getters.orderTable.value.data
        });
      }
    }

    return {
      handleTableChange,
      deleteStaffLocation,
      staffLocationsColumns,
      staffLocations,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
    }
  }
  
}
</script>