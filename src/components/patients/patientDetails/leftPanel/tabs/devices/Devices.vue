<template>
    <a-table v-if="deviceRecord?.deviceList?.length > 0" :dataSource="deviceRecord?.deviceList" :columns="columns"
        class="common-table" :pagination="false" @change="tableSorting">
        <template #bodyCell="{ column, record }" v-if="rolesPermissionFind(screensPermissions, [537])">
            <template v-if="column.dataIndex == 'deviceType'">
                <span v-if="record?.archive" class="strike-through">{{ record?.deviceType }}</span>
                <span v-else>{{ record?.deviceType }}</span>
            </template>
            <template v-if="column.dataIndex == 'manufacture'">
                <span v-if="record?.archive" class="strike-through">{{ record?.manufacture }}</span>
                <span v-else>{{ record?.manufacture }}</span>
            </template>
            <template v-if="column.dataIndex == 'serialNumber'">
                <span v-if="record?.archive" class="strike-through">{{ record?.serialNumber }}</span>
                <span v-else>{{ record?.serialNumber }}</span>
            </template>
            <template v-if="column.dataIndex == 'unasigned'">
                <a-popconfirm :title="messages.deviceUnassign" ok-text="Yes" cancel-text="No" @confirm="deleteFunction(record?.id)" :disabled="record?.archive">
                    <span v-if="record?.archive">Archived</span>
                    <span v-else class="unassign">Unassign</span>
                    <!-- <span class="unassign"> Unassign</span> -->
                </a-popconfirm>
                <!-- <span class="unassign" @click="showModal"> unassign</span> -->
                <!-- <a-modal v-model:visible="unassignvisible" title="" @ok="handleOk" class="confirm-modal" width="350px" centered
                    :footer="false">
                    <img src="@/assets/images/icons/info.svg"/>
                    <a-typography-title :level="3" class="common-sub-heading">Are you sure?</a-typography-title>
                    <a-typography-text class="common-tag-line">Do you want to unassign this device?</a-typography-text>
                    <a-space :size="10">
                        <Button classData="secondary-btn" name="No"/>
                        <Button classData="primary-btn" name="Yes"/>
                    </a-space>
                </a-modal> -->
            </template>
        </template>
    </a-table>

    <div v-else>
        <EmptyTable :text="$t('global.deviceTab')" />
    </div>
    <a-col :span="24" v-if="deviceRecord?.deviceList?.length > 0">
        <Pagination :meta="deviceRecord?.deviceMeta" commit="deviceList" :endpoint="deviceListing(route?.params?.udid)"
            :params="null" loader="patientTabLoader" />
    </a-col>
    <PatientTabsLoader />

    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddDevice @onClose="onClose($event)" />
    </a-drawer>
</template>
  
<script>
//import Button from "@/components/button/Button.vue";
import { onMounted, onUnmounted, ref } from "vue";
import AddDevice from "@/components/patients/patientDetails/leftPanel/tabs/devices/AddDevice";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { deviceListing } from "@/config/apiConfig";
import { tableSortingCommon ,rolesPermissionFind } from "@/commonMethods/commonMethod";
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { messages } from "@/config/messages";
export default {
    components: {
        AddDevice,
        Pagination,
        EmptyTable,
        PatientTabsLoader,
        //Button
    },
    setup() {
        const unassignvisible = ref(false);
        const showModal = () => {
            unassignvisible.value = true;
        };
        const handleOk = (e) => {
            console.log(e);
            unassignvisible.value = false;
        };

        const visible = ref(false);
        const route = useRoute();
        const store = useStore();
        const deviceRecord = store.getters.deviceRecord;
        onMounted(() => {
            store.dispatch("deviceList", { id: route?.params?.udid });
        });

        const deleteFunction = (id) => {
            store
                .dispatch("deviceDelete", { id: route?.params?.udid, deleteId: id })
                .then(() => {
                    store.dispatch("deviceList", { id: route?.params?.udid }).then(() => {
                        if(deviceRecord.value?.deviceList?.length == 0){
                        store.commit('patientVitalsEnabled', false)
                        store.commit('patientTabsEnabled', false)
                        }
                    })
                });
        };
        const tableSorting = (pagination, filters, sorter) => {
            let filter = "";
            if (
                deviceRecord.value?.deviceMeta?.total >
                deviceRecord.value?.deviceMeta?.per_page
            ) {
                return tableSortingCommon(
                    "deviceList",
                    deviceListing(route?.params?.udid),
                    sorter,
                    deviceRecord.value?.deviceMeta,
                    filter,
                    "patientTabLoader"
                );
            }
        };
        const onClose = (event) => {
            visible.value = event;
        };
        onUnmounted(() => {
            store.state.device.deviceList = [];
        });
        return {
            deleteFunction,
            onClose,
            visible,
            tableSortingCommon,
            deviceListing,
            route,
            deviceRecord,
            tableSorting,
            unassignvisible,
            showModal,
            handleOk,
            messages,
            rolesPermissionFind,
            screensPermissions : store.getters.screensPermissions,
            columns: [
                {
                    title: "Device",
                    dataIndex: "deviceType",
                    key: "device",
                    sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
                },
                {
                    title: "Manufacturer",
                    dataIndex: "manufacture",
                    key: "manufacture",
                    sorter: (a, b) => a.manufacture.localeCompare(b.manufacture),
                },
                {
                    title: "Serial No .",
                    dataIndex: "serialNumber",
                    key: "serialNumber",
                    sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
                },
                {
                    title: "",
                    dataIndex: "unasigned",
                },
            ],
        };
    },
};
</script>
  

