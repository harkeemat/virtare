<template>
    <div class="common-wrapper">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-typography-title :level="2" class="common-heading">Roles & Permissions</a-typography-title>
                <a-typography-text class="common-tag-line caption">
                    {{ $t('global.rolesAndPermission') }}
                </a-typography-text>
            </a-col>
            <a-col :span="24">
                <RolesAndPermissionsTable @is-copy="showModal($event)" @is-edit="edit($event)" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
import RolesAndPermissionsTable from "@/components/administration/rolesAndPermissions/tables/RolesAndPermissionsTable";
import {
    ref,
    onUnmounted
} from "vue";
import {useStore } from "vuex"
import {arrayToObjact,exportExcel} from "@/commonMethods/commonMethod"

export default {
    components: {
        RolesAndPermissionsTable,
    },

    setup() {
        const visible = ref(false)
        const roleId = ref(null)
        const editRole = ref(null)
        const store = useStore()
        const showModal = (e) => {
            visible.value = e;
            if (e.id) {
                roleId.value = e.id
                visible.value = e.check;
                editRole.value = null
            } else {
                editRole.value = null
                roleId.value = null
            }

        };
        const editShow = (e) => {
            visible.value = e;
        };
        const edit = (e) => {
            roleId.value = null
            visible.value = e.check;
            editRole.value = e.id
        }

        const handleOk = () => {
            visible.value = false;
        };

        const searchData = () => {};

       
        onUnmounted(()=>{
            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
        })
        return {
            exportExcel,
            editShow,
            arrayToObjact,
            screensPermissions:store.getters.screensPermissions,
            roleId,
            visible,
            showModal,
            handleOk,
            searchData,
            edit,
            editRole,
            pageTitle: "Roles & Permissions",
            search: store.getters.searchTable,
        };
    },
};
</script>

<style lang="scss" scoped>
.common-table {
    margin: 60px 0 0;
}
</style>
