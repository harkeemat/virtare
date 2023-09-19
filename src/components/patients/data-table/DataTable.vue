<template>
<div class="patientTable">
    <a-table rowKey="id" :columns="meta.column" :data-source="meta.patientList" :scroll="{ x: 1600,y:'calc(100vh - 516px)' }" :pagination="false" @change="handleTableChange">
        <template #fullName="{ text, record }" v-if="arrayToObjact(screensPermissions, 65)">  
            <router-link :class="record.isApp==1 ?'red-color':''" :to="{ name: 'PatientSummary', params: { udid: record.id },query:{filter:filter} }">
                <a-tooltip v-if="record.isApp==1">
                        <template #title>{{record.isApp==1 ? 'SNF Patient':''}}</template>
                       <span> {{ text }}</span> 
                </a-tooltip>
                <span v-else> {{ text }}</span> 
            </router-link>
        </template>
        <template #flags="{ record }">
            <a-tooltip placement="bottom">
                <a class="icons">
                    <Flags :flag="record.flagColor" :data="record" /></a>
            </a-tooltip>
        </template>
        <template #flagTmeStamp="{ record }">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{record?.flagTmeStamp}}</span>
                </template>
                <span class="icons">
                   {{record?.flagTmeStamp}}
                </span>
            </a-tooltip>
        </template>
        <template #patientVitals>
            <WarningOutlined />
        </template>
        <template #lastReadingDate>
            <WarningOutlined />
        </template>
        <template #lastMessageSent="{record}">
            <a-tooltip>
                <template #title>{{record?.lastMessageSent}}</template>
                <span>{{record?.lastMessageSent?.length>40 ? record?.lastMessageSent.substring(0,40) : record?.lastMessageSent}}</span>
            </a-tooltip>
        </template>
        <template #status="{record}">
            <a-switch v-model:checked="record.isActive" @change="updateStatus(record.id, $event)" :disabled="!arrayToObjact(screensPermissions,478)" />
        </template>
        <template #action="{ record }" v-if="arrayToObjact(screensPermissions,63)">
        <a-tooltip placement="bottom" v-if="record.flagName =='Escalation'">
                <template #title>
                    <span>{{$t('Raise Escalation')}}</span>
                </template>
                <a class="icons" @click="showEscalationModal(record.id)" >
                    <PlusCircleTwoTone style="font-size:20px"/> 
                </a>
            </a-tooltip>
            <a-tooltip placement="bottom" v-else >
                <template #title disabled>
                    <span>{{$t('Raise Escalation')}}</span>
                </template>
                <a  class="icons" disabled>
                    <PlusCircleOutlined style="font-size:20px"/>
                </a>
            </a-tooltip>        
        </template>
    </a-table>
    <EscaltionModal v-model:visible="escaltionModal" @saveModal="saveModal($event)" v-if="escaltionModal" :patientId="patientId" />
</div>
</template>

<script>
import {
  WarningOutlined,
//   DeleteOutlined,
  PlusCircleTwoTone,
  PlusCircleOutlined
} from "@ant-design/icons-vue";
import { messages } from "@/config/messages";
import { warningSwal,showPatientModal,tableYScrollerCounterPage } from "@/commonMethods/commonMethod";
import { onMounted,ref, defineComponent } from "vue";
import { useStore } from "vuex";
import Flags from "@/components/common/flags/Flags";
import {
  arrayToObjact,
} from "@/commonMethods/commonMethod";
import { useRoute } from "vue-router";
import EscaltionModal from "@/components/escalations/EscalationModal";
export default defineComponent({
  name: "DataTable",
  components: {
    EscaltionModal,
    PlusCircleTwoTone,
    WarningOutlined,
    // DeleteOutlined,
    Flags,
    PlusCircleOutlined
  },
setup() {
const store = useStore();
const idData = ref();
const resetPasswordVisible = ref();
const meta = store.getters.patientsRecord.value;
let data = [];
const route = useRoute();
const escaltionModal =ref(false)
const  filter = ref('');
const patientId = ref()
let date = "";
filter.value = route.query.filter ? route.query.filter : "";
function checkDate() {
    filter.value = route.query.filter ? route.query.filter : "";
    date =
        route.query.fromDate && route.query.toDate ?
        "&fromDate=" +
        route.query.fromDate +
        "?toDate=" +
        route.query.toDate :
        "&fromDate=&toDate=";
}
let scroller = "";
onMounted(() => {
    var tableContent = document.querySelector(".ant-table-body");
    tableContent?.addEventListener("scroll", (event) => {
        checkDate();
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;
        if (currentScroll >= maxScroll) {
            // you're at the bottom of the page
            let current_page = meta.patientMeta.current_page + 1;
            if (current_page <= meta.patientMeta.total_pages) {
                scroller = maxScroll;
                meta.patientMeta = "";
                data = meta.patientList;
                //store.state.patients.patientList = ""
                store
                    .dispatch(
                        "patients",
                        "?page=" +
                        current_page +
                        date +
                        "&filter=" +
                        filter.value +
                        store.getters.searchTable.value +
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
    const newData = meta.patientList;
    newData.forEach((element) => {
        data.push(element);
    });
    store.state.patients.patientList = data;
    var tableContent = document.querySelector(".ant-table-body");
    setTimeout(() => {
        tableContent.scrollTo(0, scroller);
    }, 50);
}

const handleTableChange = (pag, filters, sorter) => {
    checkDate();
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
            "patients",
            "?page=" +
            date +
            "&filter=" +
            filter.value +
            store.getters.searchTable.value +
            orderParam
        );
    } else {
        store.dispatch("orderTable", {
            data: "&orderField=&orderBy=",
        });
        store.dispatch(
            "patients",
            "?page=" +
            date +
            "&filter=" +
            filter.value +
            store.getters.searchTable.value +
            store.getters.orderTable.value.data
        );
    }
};
const resetPasseord = (id) => {
    warningSwal(messages.resetPassword).then((response) => {
          if (response == true) {
            store.dispatch("passwordReset", {endPoint:'patient',id:id})
          } else {
            // emit("saveModal", true);
          }
        });
    
};

const saveModal = (value) => {
    resetPasswordVisible.value = value
    escaltionModal.value = value
}
const showEscalationModal = (id) => {
    store.dispatch('patientDetails', id)
    patientId.value = id
    store.commit("resetEscalationCounter");
    store.state.escalations.addBasicEscalation = null;
    escaltionModal.value = true;
            
};

return {
    patientId,
    showEscalationModal,
    escaltionModal,
    showPatientModal,
    idData,
    saveModal,
    resetPasswordVisible,
    resetPasseord,
    screensPermissions: store.getters.screensPermissions,
    arrayToObjact,
    meta,
    handleTableChange,
    // deletePatients,
    // updateStatus,
    filter,
    tableYScrollerCounterPage
};
},
});
</script>


