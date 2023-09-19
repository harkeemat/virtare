
<template>
  <a-col :span="24">
    <EmptyTable :text="$t('global.inventoryTable')" v-if="meta.rolesList?.length === 0" />
    <a-table v-else class="sortIconTable common-table no-link" rowKey="id" :columns="rolesColumns" :data-source="meta.rolesList"
       @change="handleTableChange" :pagination="false">
    </a-table>
    <Loader />
  </a-col>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import {
  warningSwal,
  arrayToObjact,

} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import Loader from "@/components/loader/Loader";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
export default {
  components: {
    Loader,
    EmptyTable
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
        width: 500
      },
      {
        title: "Description",
        dataIndex: "description",
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

<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
