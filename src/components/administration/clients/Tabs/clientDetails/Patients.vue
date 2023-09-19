<template>
    <a-table class="common-table no-link" :scroll="{ y: 'calc(100vh - 370px)' }"
        v-if="clients.clientPatientsRecord?.length > 0" :dataSource="clients?.clientPatientsRecord" :columns="columns"
        :pagination="false" @change="tableSorting">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex == 'status'">
                <span v-if="record?.status" :class="record?.status ? 'status-active-circle' : ''"
                    :style="'background-color:' + record?.status" :title="record?.statusAlt" class="patient-status">
                    <img v-if="record?.statusAlt == 'Unknown'" src="@/assets/images/icons/question-sign.svg"></span>
                <span v-else>-</span>
            </template>
            <template v-if="column.dataIndex == 'name'">
                <a v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [63])"
                    @click="patientsDetial(record)">{{ text }}</a>
                <span v-else>{{ text }}</span>
            </template>
            <template v-if="column.dataIndex == 'join_date'">
                {{ dateFormatClient(record?.join_date) }}
            </template>
            <template v-if="column.dataIndex == 'program'">
                <div class="programTag" v-if="record?.program?.length > 0">
                    <a-tag v-for="program in record.program" :key="program.id" class="customPills"
                        :style="'border-color:' + program?.color + ';color:' + program?.color">{{
                            program?.code }}</a-tag>
                </div>
                <div v-else>
                    -
                </div>
            </template>
        </template>
    </a-table>
    <div v-else>
        <EmptyTable :text="$t('global.patientTable')" />
    </div>
    <a-col :span="24" v-if="clients?.clientPatientsRecord?.length > 0">
        <Pagination :meta="clients?.patientMeta" commit="clientPatientsRecord"
            :endpoint="API_ENDPOINTS['clientPatients'] + `/${route?.params?.udid}`" :params="null"
            loader="clientLoadingStatus" />
    </a-col>
    <ClientLoader />
</template>

<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue"
import { useStore } from 'vuex';
import { onMounted } from 'vue-demi';
import { useRoute, useRouter } from 'vue-router';
import { dateFormatClient, tableSortingCommon, rolesPermissionFind } from "@/commonMethods/commonMethod"
import ClientLoader from "@/components/administration/clients/ClientLoader.vue"
import { API_ENDPOINTS } from "@/config/apiConfig"
import Pagination from "@/components/pagination/Pagination"
const store = useStore()
const route = useRoute()
const router = useRouter()
const clients = store.getters.clients

const patientsDetial = (record) => {

    router.push({
        name: "PatientDetails",
        params: { udid: record.id }
    });
}

onMounted(() => {
    store.dispatch("clientPatientsRecord", { clientId: route.params.udid })
})
const tableSorting = (pagination, filters, sorter) => {
    let filter = ''
    if (clients.value?.clientMeta?.total > clients.value?.clientMeta?.per_page) {
        return tableSortingCommon('clientsList', API_ENDPOINTS['clientPatients'] + `/${route?.params?.udid}`, sorter, clients.value?.clientMeta, filter, 'clientLoadingStatus')
    }
};
const columns = [
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 80,
        align: "center",
        sorter: (a, b) => a.status.localeCompare(b.status)
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
        title: "Join Date",
        dataIndex: "join_date",
        key: "date",
        sorter: (a, b) => a.join_date - b.join_date
    },
    {
        title: "Programs",
        dataIndex: "program",
        key: "programs",
        ellipsis: true,
        sorter: (a, b) => {
            if (a && a.program && a.program.length && b && b.program && b.program.length) {
                return a.program.length - b.program.length;
            } else if (a && a.program && a.program.length) {
                // That means be has null program, so a will come first.
                return -1;
            } else if (b && b.program && b.program.length) {
                // That means a has null program so b will come first.
                return 1;
            }

            // Both program has null value so there will be no order change.
            return 0;
        }

    },
    {
        title: "Site",
        dataIndex: "site",
        key: "site",
        ellipsis: true,
        sorter: (a, b) => a.site.localeCompare(b.site)
    },
    {
        title: "Care Team",
        dataIndex: "careteam",
        key: "team",
        ellipsis: true,
        sorter: (a, b) => a.careteam.localeCompare(b.careteam)
    },
    {
        title: "Compliance Status",
        dataIndex: "complience",
        key: "status",
        ellipsis: true,
        sorter: (a, b) => a.complience.localeCompare(b.complience)
    },
]

</script>


