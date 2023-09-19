<template>
  <a-table  rowKey="id" class="sortIconTable"
    :columns="globalCodesColumns"
    :data-source="globalCodesList"
     :pagination=false
     :scroll="{ y:'calc(100vh - 280px)'}"
    @change="handleTableChange">
    <template #actions="{record}">
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,7)">
        <template #title>
          <span>Edit</span>
        </template>
        <span class="icons"><EditOutlined @click="editGlobalCode(record.id)" /></span>
      </a-tooltip>
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,8)">
        <template #title>
          <span>Delete</span>
        </template>
        <span class="icons"><DeleteOutlined @click="deleteGlobalCode(record.id)" /></span>
      </a-tooltip>
    </template>
    <template #isActive="{record}" >
      <a-switch v-model:checked="record.isActive" @change="updateStatus(record.id, $event)" :disabled="!arrayToObjact(screensPermissions,266)"/>
    </template>
  </a-table>
</template>

<script>
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { watchEffect ,onMounted} from "vue";
import { useStore } from "vuex";
import {warningSwal,arrayToObjact} from "@/commonMethods/commonMethod"
import { messages } from '@/config/messages';
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
  },
  setup(props, {emit}) {
    const store = useStore()
    watchEffect(() => {
      store.dispatch('globalCodesList')
      store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
    })
    
    const globalCodesList = store.getters.globalCodesList
    const meta = store.getters.globalMeta
        let data = []
        
       let scroller = "";
        onMounted(() => {
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2;
                let current_page = meta.value.current_page + 1
                if (currentScroll >= maxScroll) {
                    if (current_page <= meta.value.total_pages) {
                        scroller = maxScroll;
                        store.state.globalCodes.globalMeta = ""
                      
                        data = globalCodesList.value
                        
                        
                        store.dispatch("globalCodesList", store.getters.searchTable.value+"&page=" + current_page+store.getters.orderTable.value.data).then(() => {
                            loadMoredata()
                        })

                    }
                }
            })
        })

        function loadMoredata() {
            const newData = globalCodesList.value
            newData.forEach(element => {
                data.push(element)
            });
            store.state.globalCodes.globalCodesList = data
            
var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50);
            

        }
    const editGlobalCode = (id) => {
      emit('edit-global-code', id)
    }

    const updateStatus = (id, status) => {
      const data = {
        "isActive": status
      };
      store.dispatch('updateGlobalCode', {id, data}).then(() => {
        
      })
    }

    const deleteGlobalCode = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteGlobalCode', id).then(() => {
            store.dispatch('globalCodesList')
          })
        }
      })
    }

    const globalCodesColumns = [
      {
        title: "Category",
        dataIndex: "globalCodeCategory",
        key: "globalCodeCategory",
        sorter:true
      
        
      },
      {
        title: "Code Name",
        dataIndex: "name",
        
        sorter:true
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter:true
      },
      {
        title: "Status",
        dataIndex: "isActive",
        slots: {
          customRender: "isActive"
        },
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      },
    ];

   
    const handleTableChange = (pag, filters, sorter) => {
            if (sorter.order) {
                let order = sorter.order == 'ascend' ? 'ASC' : 'DESC'
                let orderParam = '&orderField=' + sorter.field + '&orderBy=' + order
                store.dispatch('orderTable', {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters
                })
                store.dispatch("globalCodesList", store.getters.searchTable.value + orderParam)

            } else {

                store.dispatch('orderTable', {
                    data: '&orderField=&orderBy='
                })
                store.dispatch("globalCodesList", store.getters.searchTable.value + store.getters.orderTable.value.data)
            }
        }
    return {
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      editGlobalCode,
      deleteGlobalCode,
      globalCodesColumns,
      globalCodesList,
      updateStatus,
      warningSwal,
      //tableYScroller,
      handleTableChange
    }
  }
}
</script>

<style>
  th.codeActions {
    width: 120px;
  }
  th.codeStatus, th.usedCount {
    width: 150px;
  }
 
</style>