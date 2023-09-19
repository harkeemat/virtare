<template>
    <a-table class="common-table" v-if="meta.staffs?.length > 0" rowKey="id"
        :data-source="store.state.careCoordinator.staffs" :scroll="{x:1500}" :pagination=false :columns="columns"
        @change="tableSorting" :customRow="customRow">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex == 'role'">
                <span>{{ text }}</span>
            </template>
            <template v-if="column.dataIndex == 'createdAt'">
                <span>{{ dateFormat(text) }}</span>
            </template>
            <template v-if="column.dataIndex == 'lastReadingDate'">
                <WarningOutlined />
            </template>
        </template>
    </a-table>
    <div v-if="meta.staffs?.length == 0">
        <EmptyTable :text="$t('global.staffPage')" />
    </div>
    <a-col :span="24" v-if="store.state.careCoordinator.staffs?.length > 0">
        <Pagination :meta="meta?.staffMeta" commit="staff" endpoint="staffData/list"
            :params="search + '&filter=' + urlFilters" loader="loadingTableStatus" />
    </a-col>
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <StaffDetail @onClose="onClose($event)" v-if="visible" :staffId="staffId" />
    </a-drawer>
</template>

<script setup>
import { dateFormat, rolesPermissionFind, tableSortingCommon } from "@/commonMethods/commonMethod";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import StaffDetail from "@/components/care-coordinator/StaffDetail.vue";
const props = defineProps(["urlFilters"])
const visible = ref(false)
const staffId = ref('')
const store = useStore();
const meta = store.getters.staffRecord.value;
const search = store.getters.searchTable
onMounted(() => {
    
});


const tableSorting = (pagination, filters, sorter) => {
    let filter = search.value + '&filter=' + props.urlFilters;
    if (
        meta?.staffMeta?.total >
        meta?.staffMeta?.per_page
    ) {
        // sorting api call (commit,endpont,sorting,meta,filter,loader)
        return tableSortingCommon(
            "staff",
            'staffData/list',
            sorter,
            meta?.staffMeta,
            filter,
            "loadingTableStatus"
        );
    }
};
const screensPermissions = store.getters.screensPermissions
function customRow(record) {
    return {
        onClick: () => {
            staffId.value = record.udid
            visible.value = true;
        },
    };
}
const onClose = (event) => {
    visible.value = event;
}
const columns = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),

    },
    {
        title: 'Role',
        dataIndex: 'role',
        sorter: (a, b) => a.role.localeCompare(b.role),
    },

    {
        title: 'Specialization',
        dataIndex: 'specialization',
        sorter: (a, b) => a.specialization.localeCompare(b.specialization),

    },
    {
        title: 'Network',
        dataIndex: 'network',
        sorter: (a, b) => a.network.localeCompare(b.network),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        sorter: (a, b) => a.createdAt - b.createdAt,

    },
    // {
    // 	title: 'Status',
    // 	dataIndex: 'status',
    // },
];
</script>

