<template>
  <div class="unprocessedCommunications">
    <a-table class="sortIconTable" rowKey="id" :columns="unprocessedCommunicationsColumns" :data-source="unprocessedCommunications" :pagination="false" @change="handleTableChange">
      
      <template #type="{ record }">
        <a-tooltip placement="right">
          <template #title>
            <span>{{ record.type }}</span>
          </template>
          <a class="icons" v-if="record.type == 'Email'">
            <MailOutlined />
          </a>
        </a-tooltip>
        <a-tooltip placement="right">
          <template #title>
            <span>{{ record.type }}</span>
          </template>
          <a class="icons" v-if="record.type == 'SMS'">
            <MessageOutlined />
          </a>
        </a-tooltip>
      </template>

      <template #actions="{record}" v-if="arrayToObjact(screensPermissions, 505) || arrayToObjact(screensPermissions, 506)">
        <a-tooltip placement="right" v-if="arrayToObjact(screensPermissions, 505)">
          <template #title>
            View
          </template>
          <a class="icons" @click="viewMessage(record.id, record.type)">
            <EyeOutlined />
          </a>
        </a-tooltip>
        <a-tooltip placement="right" v-if="arrayToObjact(screensPermissions, 506)">
          <template #title>
            Assign
          </template>
          <a class="icons" @click="assignToStaff(record.id, record.type)">
            <UserAddOutlined />
          </a>
        </a-tooltip>
      </template>

    </a-table>
  </div>
  
  <UnprocessedCommunicationDetailsModal v-model:visible="visibleViewModal" @closeModal="closeModal" />
  <AssignUnprocessedCommunicationModal v-model:visible="visibleAssignModal" :isUnprocessed="true" @closeModal="closeModal" @is-visible="closeModal" />

</template>

<script>
import { computed, onMounted, ref } from 'vue-demi'
import {
  MailOutlined,
  MessageOutlined,
  EyeOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import { useStore } from 'vuex';
import UnprocessedCommunicationDetailsModal from "@/components/modals/UnprocessedCommunicationDetailsModal"
import AssignUnprocessedCommunicationModal from "@/components/modals/AssignUnprocessedCommunicationModal"
import { arrayToObjact } from "@/commonMethods/commonMethod";

export default {
  components: {
    MailOutlined,
    MessageOutlined,
    EyeOutlined,
    UserAddOutlined,
    UnprocessedCommunicationDetailsModal,
    AssignUnprocessedCommunicationModal,
  },
  setup() {
    const store = useStore()
    const communicationType = ref(null)
    const visibleViewModal = ref(false)
    const visibleAssignModal = ref(false)

    onMounted(() => {
      store.dispatch('unprocessedCommunications')
    })
    const unprocessedCommunications = computed(() => {
      return store.state.unprocessedCommunications.unprocessedCommunications
    })
    const meta = store.getters.unprocessedCommunicationsMeta;
        let data = [];
        let scroller = "";
        onMounted(() => {
            var tableContent = document?.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2;
                let current_page = meta.staffMeta.current_page + 1;
                if (currentScroll >= maxScroll) {
                    

                    if (current_page <= meta.value.total_pages) {
                        scroller = maxScroll;
                        meta.value = "";
                        data = meta.staffs;
                        //store.state.careCoordinator.staffs = "";

                        store
                            .dispatch(
                                "unprocessedCommunications",
                                "?page=" +
                                current_page +
                                store.getters.searchTable.value +
                                store.getters.orderTable.value.data
                            )
                            .then(() => {
                                loadMoredata();
                            });
                    }
                }
            });
        });

        function loadMoredata() {
            const newData = meta.staffs;

            newData.forEach((element) => {
                data.push(element);
            });
            store.state.unprocessedCommunications.unprocessedCommunications = data;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50);
        }
        const handleTableChange = (pag, filters, sorter) => {
            if (sorter.order) {
                let order = sorter.order == "ascend" ? "ASC" : "DESC";
                let orderParam = "&orderField=" + sorter.field + "&orderBy=" + order;
                store.dispatch("orderTable", {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters,
                });
                store.dispatch(
                    "unprocessedCommunications",
                    "?page=" + store.getters.searchTable.value + orderParam
                );
            } else {
                store.dispatch("orderTable", {
                    data: "&orderField=&orderBy=",
                });
                store.dispatch(
                    "unprocessedCommunications",
                    "?page=" +
                    store.getters.searchTable.value +
                    store.getters.orderTable.value.data
                );
            }
        };
    const unprocessedCommunicationsColumns = [
      {
        title: 'From',
        dataIndex: 'from',
        sorter: true,
        key: 'from',
      },
      {
        title: 'To',
        dataIndex: 'to',
        sorter: true,
        key: 'to',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        sorter: true,
        slots: {
          customRender: 'type'
        }
      },
      {
        title: 'Date & Time',
        dataIndex: 'createdAt',
        sorter: true,
        key: 'createdAt',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        slots: {
          customRender: 'actions'
        }
      },
    ]

    

    const viewMessage = (id, type) => {
      communicationType.value = type
      unprocessedCommunications.value.map(item => {
        if(item.id == id) {
          store.commit('communicationDetails', item)
        }
      })
      visibleViewModal.value = true
    }

    const assignToStaff = (id, type) => {
      communicationType.value = type
      unprocessedCommunications.value.map(item => {
        if(item.id == id) {
          store.commit('communicationDetails', item)
        }
      })
      setTimeout(() => {
        visibleAssignModal.value = true
      }, 1000);
    }

    const closeModal = (value) => {
      visibleViewModal.value = false
      visibleAssignModal.value = value ? value : false
    }

    const screensPermissions = computed(() => {
      return store.state.screenPermissions.screensPermissions;
    });

    return {
      unprocessedCommunicationsColumns,
      unprocessedCommunications,
      viewMessage,
      assignToStaff,
      communicationType,
      closeModal,
      visibleViewModal,
      visibleAssignModal,
      arrayToObjact,
      screensPermissions,
      handleTableChange
    }
  }
}
</script>

<style>
	.unprocessedCommunications .anticon-mail svg,
  .unprocessedCommunications .anticon-message svg {
    fill: #000000 !important;
  }
</style>