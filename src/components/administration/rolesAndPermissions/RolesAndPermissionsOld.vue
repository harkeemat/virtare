<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">
                        {{ pageTitle }}
                        <div class="commonBtn" >
                            <!-- <Button :name="buttonName" @click="showModal(true)" v-if="arrayToObjact(screensPermissions,1)"/> -->
                            <ShowModalButton @click="showModal(true)" :buttonText="'Role'" v-if="arrayToObjact(screensPermissions,1)"/>
                        </div>
                    </h2>
                </a-col>
                <a-col :span="12">
                    <SearchField endPoint="roleList"/>
                </a-col>
                <a-col :span="12">
                    <div class="text-right mb-24" >
                            <div class="text-right mb-24">
                            <ExportToExcel  @click="exportExcel('roleAndPermission_report','?fromDate=&toDate='+search)" v-if="arrayToObjact(screensPermissions,5)"/>
                        </div>
                    </div>
                </a-col>
                <a-col :span="24">
                    <RolesAndPermissionsTable @is-copy="showModal($event)" @is-edit="edit($event)" />
                </a-col>
            </a-row>
        </div>
    </a-layout-content>
    <!-- Modal -->
    <RolesAndPermissionsModal v-if="visible" v-model:visible="visible" @ok="handleOk" @on-submit="handleOk" :roleId="roleId" :editRole="editRole" @is-visible="editShow($event)" />
</template>

<script>
import RolesAndPermissionsTable from "@/components/administration/rolesAndPermissions/tables/RolesAndPermissionsTableOld";
import SearchField from "@/components/common/input/SearchField";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
// import Button from "@/components/common/button/Button";
import {ref,onUnmounted,defineAsyncComponent} from "vue";
import {useStore } from "vuex"
import {arrayToObjact,exportExcel} from "@/commonMethods/commonMethod"
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
export default {
    components: {
        ShowModalButton,
        RolesAndPermissionsTable,
        RolesAndPermissionsModal: defineAsyncComponent(() =>import("@/components/modals/RolesAndPermissionsModal")),
        SearchField,
        // Button,
        ExportToExcel
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
