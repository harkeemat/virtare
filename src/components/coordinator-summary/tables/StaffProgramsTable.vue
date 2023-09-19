<template>
  <div>
    <a-table class="sortIconTable" rowKey="id" :columns="staffProgramsColumns" :data-source="staffPrograms" :pagination="false" @change="handleTableChange" >
      <!-- <template #isDefault="{record}">
        <span v-if="record.isDefault">Yes</span>
        <span v-else>No</span>
      </template> -->
      <template #actions="{record}" v-if="arrayToObjact(screensPermissions, 484)">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{$t('global.Add')}}</span>
          </template>
          <a class="icons" v-if="record.isDefault" :disabled="record.isDefault">
            <DeleteOutlined />
          </a>
          <a class="icons" v-else @click="deleteStaffProgram(record.udid)">
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

    onMounted(() => {
      store.dispatch('staffPrograms', {
        staffId: route.params.udid,
        page: ""
      })
    })
    
    const staffProgramsColumns = [
      {
        title: 'Program',
        dataIndex: 'name',
        key: 'name',
        sorter:true
      },
      /* {
        title: 'Is Default',
        dataIndex: 'isDefault',
        key: 'isDefault',
        slots: {
          customRender: 'isDefault'
        }
      }, */
      {
        title: 'Actions',
        dataIndex: 'actions',
        slots: {
          customRender: 'actions'
        }
      }
    ]

    const staffPrograms = computed(() => {
      return store.state.careCoordinator.staffPrograms
    })

    const deleteStaffProgram = (udid) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteStaffProgram', {
            staffId: route.params.udid,
            programId: udid
          }).then(() => {
            store.dispatch('staffPrograms', {
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
        store.dispatch("staffPrograms", {
          staffId: route.params.udid,
          page: store.getters.searchTable.value != null ? store.getters.searchTable.value + orderParam : orderParam
        });
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch("staffPrograms", {
          staffId: route.params.udid,
          data: store.getters.searchTable.value != null ? store.getters.searchTable.value + store.getters.orderTable.value.data : store.getters.orderTable.value.data
        });
      }
    }

    return {
      handleTableChange,
      deleteStaffProgram,
      staffProgramsColumns,
      staffPrograms,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
    }
  }
  
}
</script>