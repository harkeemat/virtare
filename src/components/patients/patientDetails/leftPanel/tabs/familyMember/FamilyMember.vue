<template>
    <a-table v-if="familyMemberRecord?.familyMemberList?.length > 0" :dataSource="familyMemberRecord?.familyMemberList" :columns="columns"
        class="common-table" :pagination="false" :customRow="customRow" @change="tableSorting">
        <template #bodyCell="{ column,text }">
      <template v-if="column.dataIndex == 'isPrimary'">
        <span v-if="text=='1'">Yes</span>
        <span v-else>—</span>
      </template> 
    </template>
    </a-table>
    <div v-else>
        <EmptyTable :text="$t('global.deviceTab')" />
    </div>
    <a-col :span="24" v-if="familyMemberRecord?.familyMemberList?.length > 0">
        <Pagination :meta="familyMemberRecord?.familyMemberMeta" commit="familyMemberList"
            :endpoint="familyMemberListing(route?.params?.udid)" :params="null"
            loader="patientTabLoader" />
    </a-col>
    <PatientTabsLoader />
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddFamilyMember @onClose="onClose($event)" :isEdit="true"/>
    </a-drawer>
</template>
  
<script>
import { onMounted, ref } from "vue";
import AddFamilyMember from "@/components/patients/patientDetails/leftPanel/tabs/familyMember/AddFamilyMember";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { familyMemberListing } from "@/config/apiConfig"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
export default {
    components: {
        AddFamilyMember,
        Pagination,
        EmptyTable,
        PatientTabsLoader,
    },
    setup() {
        const visible = ref(false);
        const route = useRoute()
        const store = useStore()
        const familyMemberRecord = store.getters.familyMemberRecord
        onMounted(() => {
            store.dispatch("familyMemberList", { id: route?.params?.udid })
        })
        function customRow(record) {
            return {
                onClick: () => {
                    
                    store.dispatch("detailOfFamilyMember", { id: route?.params?.udid,familyMemberId: record?.udid }).then(()=>{
                        visible.value = true;
                    })
                },
            };
        }
        const tableSorting = (pagination, filters, sorter) => {
            let filter = ''
            if (familyMemberRecord.value?.familyMemberMeta?.total > familyMemberRecord.value?.familyMemberMeta?.per_page) {
                return tableSortingCommon('familyMemberList', familyMemberListing(route?.params?.udid), sorter, familyMemberRecord.value?.familyMemberMeta, filter, 'patientTabLoader')
            }
        };
        const onClose = (event) =>{
            visible.value = event;
        }
        return {
            onClose,
            customRow,
            visible,
            tableSortingCommon,
            familyMemberListing,
            route,
            familyMemberRecord,
            tableSorting,
            columns: [
                {
                    title: "Name",
                    dataIndex: "firstName",
                    key: "Name",
                    sorter: (a, b) => a.firstName.localeCompare(b.firstName)
                },
                {
                    title: "Relationship",
                    dataIndex: "relation",
                    key: "relation",
                    sorter: (a, b) => a.relation.localeCompare(b.relation)
                },
                {
                    title: "Phone",
                    dataIndex: "phoneNumber",
                    key: "phoneNumber",
                    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber)
                },
                {
                    title: "Email",
                    dataIndex: "email",
                    key: "email",
                    sorter: (a, b) => a.email.localeCompare(b.email)
                },
                
                {
                    title: "Emergency Contact",
                    dataIndex: "isPrimary",
                    key: "email",
                    sorter: (a, b) => a.email.localeCompare(b.email)
                },
                
            ],
        };
    },
};
</script>
  
