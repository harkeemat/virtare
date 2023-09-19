<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">
                        CPT Codes
                        <!-- <div class="commonBtn">
                            <Button :name="buttonName" @click="showModal(true)" v-if="arrayToObjact(screensPermissions,9)" />
                        </div> -->
                    </h2>
                </a-col>
                <a-col :span="12">
                    <SearchField endPoint="cptCodeActivities" commit="cptCodeActivities" v-if="arrayToObjact(screensPermissions,14)" />
                </a-col>
                <a-col :span="12">
                    <div class="text-right mb-24">
                        <ExportToExcel @click="exportExcel('cptCode_report','?fromDate=&toDate='+search)" />
                    </div>
                </a-col>
                <a-col :span="24">
                    <CptCodesTable @is-visible="editModal($event)" v-if="arrayToObjact(screensPermissions,487)"/>
                </a-col>
            </a-row>
        </div>

    </a-layout-content>
    <!-- Add CPT Code Modal -->
    <CptCodesModal v-model:visible="visible" @ok="handleOk" @is-visible="showModal($event)" :cptId="editId" />
</template>

<script>
import CptCodesModal from "@/components/modals/CptCodesModal";
import CptCodesTable from "@/components/administration/cpt-codes/tables/CptCodesTable";
import { ref,onUnmounted, onMounted} from "vue";
import SearchField from "@/components/common/input/SearchField";
//import Button from "@/components/common/button/Button";
import { arrayToObjact,exportExcel } from "@/commonMethods/commonMethod";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import {
    useStore
} from "vuex"

export default {
    components: {
        CptCodesModal,
        CptCodesTable,
        SearchField,
       // Button,
        ExportToExcel,
    },
    setup() {
        const visible = ref(false);
        const showModal = (e) => {
            editId.value = ''
            visible.value = e;

        };
        const editModal = (e) => {
            editId.value = e.id
            visible.value = e.check;

        };
        const editId = ref(null)
        const store = useStore()
        const handleOk = () => {

            visible.value = false;
        };

        // const searchData = (value) => {
        // };
        onMounted(() => {
            
                store.dispatch('cptCodesList')
           

            store.dispatch('serviceList')

            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
            //store.commit("dataFilter")

        })

        onUnmounted(() => {
            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
            store.commit("filter", '')
        })
        return {
            exportExcel,
            screensPermissions: store.getters.screensPermissions,
            arrayToObjact,
            // searchData,
            visible,
            showModal,
            handleOk,
            editId,
            editModal,
            buttonName: 'Add CPT Code',
            search: store.getters.searchTable,
        };
    },
};
</script>
