
<template>
<a-table rowKey="id" :columns="rolesColumns" :data-source="meta.rolesList"   :scroll="{ x: 900,y:'calc(100vh - 280px)'}" :pagination=false @change="handleTableChange">
    <template #actions="{record}" >
        
      <a-tooltip placement="bottom" v-if="record.roleType === 'Predefined' || arrayToObjact(role.user.staff.role,record.udid)!=undefined" disabled >
            <template #title v-if="arrayToObjact(screensPermissions,2)">
                <span>Edit</span>
            </template>
            <a class="icons" @click="editRole(record.udid)" disabled v-if="arrayToObjact(screensPermissions,2)">
                <EditOutlined />
            </a>
        </a-tooltip>
        <a-tooltip v-else placement="bottom">
            <template #title v-if="arrayToObjact(screensPermissions,2)">
                <span>Edit</span>
            </template>
            <a class="icons" @click="editRole(record.udid)" v-if="arrayToObjact(screensPermissions,2)">
              
                <EditOutlined /></a>
        </a-tooltip>
        <a-tooltip placement="bottom" >
            <template #title v-if="(record.roleType === 'Predefined' || arrayToObjact(role.user.staff.role,record.udid)!=undefined) && arrayToObjact(screensPermissions,3)" >
                <span>Delete</span>
            </template>
            <template #title v-else >
                <span>Delete</span>
            </template>
            <a class="icons" v-if="(record.roleType === 'Predefined' || arrayToObjact(role.user.staff.role,record.udid)!=undefined) && arrayToObjact(screensPermissions,3)" disabled>
                <DeleteOutlined /></a>
            <a class="icons" v-else-if="arrayToObjact(screensPermissions,3)" @click="deleteRole(record.udid)">
                <DeleteOutlined /></a>
        </a-tooltip>

        <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions, 464)">
            <template #title>
                <span>Copy</span>
            </template>
            <a class="icons" @click="copyRole(record.udid)" >
                <CopyOutlined />
            </a>
        </a-tooltip>
    </template>
    <template #isActive="{record}" >
      
        <a-switch v-if="(record.id ===1 || arrayToObjact(role.user.staff.role,record.udid)!=undefined) || arrayToObjact(role.user.staff.role,record.udid)!=undefined" v-model:checked="record.status"  disabled/>
        <a-switch v-else v-model:checked="record.isActive"  @change="UpdateRoleStatus(record.udid, $event)" :disabled="!arrayToObjact(screensPermissions,504)"/>
    </template>
</a-table>
<Loader />
</template>
<script>
import {
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import {
  warningSwal,
  arrayToObjact,
  
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import Loader from "@/components/loader/Loader";
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    CopyOutlined,
    Loader,
  },

  setup(props, { emit }) {
    const store = useStore();
const role = JSON.parse(localStorage.getItem("auth"))
    onMounted(() => {
      store.dispatch("rolesList");
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    const editRole = (id) => {
      store.getters.rolesAndPermissionsRecord.value.editRolesAndPermissions = ""
      store.dispatch("roleDetails", id);
      store.dispatch("editPermissions", id);
      store.dispatch("editdWidget", id);
      emit("is-edit", {
        check: true,
        id: id,
      });
    };

    const deleteRole = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteRole", id).then(() => {
            store.dispatch("rolesList");
          });
        }
      });
    };

    const copyRole = (id) => {
      store.dispatch("roleDetails", id);
      emit("is-copy", {
        check: true,
        id: id,
      });
    };

    const UpdateRoleStatus = (id, status) => {
      const data = {
        isActive: status,
      };
      store
        .dispatch("UpdateRole", {
          id,
          data,
          show: true,
        })
        .then(() => {
          //store.dispatch('rolesList')
        });
    };

    const rolesColumns = [
      {
        title: "Role Name",
        dataIndex: "name",
        sorter: true,
      },
      {
        title: "Type of Role ",
        dataIndex: "roleType",
        sorter: true,
      },
      {
        title: "Level",
        dataIndex: "level",
        sorter: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        sorter: true,
      },
      {
        title: "Active/Inactive",
        dataIndex: "isActive",
        slots: {
          customRender: "isActive",
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
    //ifinitescroller
   
    const meta = store.getters.rolesAndPermissionsRecord.value;
    let data = [];
    const loader = ref(false);
    let scroller = "";
        onMounted(() => {
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2;
                if (currentScroll >= maxScroll) {
          let current_page = meta.rolesMeta.current_page + 1;

          if (current_page <= meta.rolesMeta.total_pages) {
            scroller = maxScroll;
            data = meta.rolesList;
            loader.value = true;
            store.state.rolesAndPermissions.rolesMeta = "";
            store.state.rolesAndPermissions.rolesList = "";

            store
              .dispatch(
                "rolesList",
                store.getters.searchTable.value +
                  "&page=" +
                  current_page +
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
      const newData = meta.rolesList;
      newData.forEach((element) => {
        data.push(element);
      });
      meta.rolesList = data;
      var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50);
            
      loader.value = false;
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
          "rolesList",
          store.getters.searchTable.value + orderParam
        );
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch(
          "rolesList",
          store.getters.searchTable.value + store.getters.orderTable.value.data
        );
      }
    };
    return {
      loader,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
      rolesColumns,
      data,
      editRole,
      deleteRole,
      copyRole,
      UpdateRoleStatus,
      meta,
      role,
      handleTableChange,
    };
  },
};
</script>
