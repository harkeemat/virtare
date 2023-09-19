
<template>

    <a-col :sm="3" :xs="24" v-if="selectedRow?.length>0 && arrayToObjact(screensPermissions, 416)">
        <h3>{{'Actions:'}}</h3>
    </a-col>
    <a-col :sm="2" :xs="24" v-if="selectedRow?.length>0 && arrayToObjact(screensPermissions, 416)">
        <a-button :disabled="checkMsgTypeStatus?.length>1 || checkPatientStatus?.length>1"  class="modal-button handleClear" type="primary" html-type="submit" @click="editTimeLog(selectedRow)" v-if="arrayToObjact(screensPermissions, 334)">{{'Approve'}}</a-button>
    </a-col>
    <a-col :sm="1" :xs="24" v-if="selectedRow?.length>0 && arrayToObjact(screensPermissions, 416)">
        <a-button :disabled="checkMsgTypeStatus?.length>1 || checkPatientStatus?.length>1"  @click="rejectButton(selectedRow)" class="modal-button">Reject</a-button>
    </a-col>
    <a-col :sm="24" :xs="24" v-if="selectedRow?.length>0 && arrayToObjact(screensPermissions, 416)">
      <ErrorMessage v-if="checkMsgTypeStatus?.length>1 || checkPatientStatus?.length>1" name="Please select same type of patient and type." />
    </a-col>
    <a-col :sm="24" :xs="24" class="table-row" v-if="meta">
        <a-table rowKey="id" :row-selection="{ selectedRowKeys: selectedRow, onChange: rowSelection,getCheckboxProps }" :columns="meta.timeLogReportColumns" :pagination="false" :scroll="{ y:'calc(100vh - 310px)'}" :data-source="meta.timeApproval" @change="handleTableChange">
            <template #staff="{record}">
                <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.staff.id  }}" v-if="arrayToObjact(screensPermissions,38)">{{record.staff.fullName.length>15?record.staff.fullName.substring(0,15)+'...':record.staff.fullName}}</router-link>
                <a v-if="arrayToObjact(screensPermissions,38)" @click="showStaffModal( record.staff.id)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
                <span v-else>{{record.staff}}</span>
            </template>
            <template #patient="{record}">
                <router-link :to="{ name: 'PatientSummary', params: { udid: record.patient.id } }" v-if="arrayToObjact(screensPermissions, 63) || record.patientAccess==true">{{record.patient.fullName.length>15?record.patient.fullName.substring(0,15)+'...':record.patient.fullName}}</router-link>
                <a v-if="arrayToObjact(screensPermissions, 63) || record.patientAccess==true" @click="showPatientModal( record.patient.id)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
                <span v-else :title="messages.access">{{record.patient.fullName}}</span>
            </template>
            <template #flags="{ record }">
                <!-- <Flags :flag="record.flagColor" :data="record" /> -->
                <span>{{record.flagName}}</span>
            </template>
            <template #flag="{ text }">
                <span>
                    <img class="reportFlag" src="../../assets/images/flag-orange.svg" alt="image" /></span>
                <span v-if="text.match(/two/g)"><img class="reportFlag" src="../../assets/images/flag-red.svg" alt="image" /></span>
            </template>
            <template #actions>
                <!-- <a-tooltip placement="bottom" @click="editTimeLog(record.id)" v-if="arrayToObjact(screensPermissions, 334)">
                <template #title>
                    <span>{{$t('global.edit')}}</span>
                </template>
                <a class="icons">
                    <EditOutlined /></a>
            </a-tooltip> -->
                <!-- <a-tooltip placement="bottom" @click="viewTimeLog(record.id)" v-if="arrayToObjact(screensPermissions, 332)">
                <template #title>
                    <span>{{ $t("common.view") }}</span>
                </template> -->
                <!-- <div>
                    <a-button :disabled="record?.statusId==329 || record?.statusId==330" class="modal-button handleClear" type="primary" html-type="submit" @click="editTimeLog(record.id)" v-if="arrayToObjact(screensPermissions, 334)">{{'Approve'}}</a-button>
                    <a-button :disabled="record?.statusId==329 || record?.statusId==330" @click="rejectButton(record.id)" class="modal-button">Reject</a-button>
                </div> -->
                <!-- <a class="icons">
                    <EyeOutlined />
                </a>
            </a-tooltip> -->
            </template>
            <template #active="key">
                <a-switch v-model:checked="checked[key.record.key]" :disabled="!arrayToObjact(screensPermissions,334)" />
            </template>
        </a-table>
        <TableLoader />

        <AuditTimeLog v-if="visible" v-model:visible="visible" @saveAuditTimeLog="handleOk($event)" :Id="selectedRow" :editData="auditTimeLog" />
    </a-col>
<!-- <ViewTimeLogTable v-if="viewReport" v-model:visible="viewReport" :id="Id"  /> -->
</template>
<script>
import { ref, onMounted, computed,reactive } from "vue";
import {
  // DeleteOutlined,
  // EditOutlined,
  // EyeOutlined
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import AuditTimeLog from "./AuditTimeLogs.vue";
// import ViewTimeLogTable from "./ViewTimeLogTable";
// import { messages } from "@/config/messages";
import TableLoader from "@/components/loader/TableLoader";
import { useStore } from "vuex";
import {
  warningSwal,
  arrayToObjact,
  timeStampFormate,
  showStaffModal,
  showPatientModal,
  tableYScroller
} from "@/commonMethods/commonMethod";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
// import Flags from "@/components/common/flags/Flags";
import { useRoute } from "vue-router";

export default {
  components: {
    InfoCircleOutlined,
    // DeleteOutlined,
    // EyeOutlined,
    // EditOutlined,
    TableLoader,
    AuditTimeLog,
    // ViewTimeLogTable,
    ErrorMessage
    // Flags,
  },
  props: {},
  setup(props, { emit }) {
    const store = useStore();
    const visible = ref(false);
    const viewReport = ref(false);
    const Id = ref();
    const auditTimeLog = reactive({
      timeAmount: "",
      typeId: "",
    });
    const selectedRow = ref([])
    const handleOk = (event) => {
      visible.value = event?.close;
      selectedRow.value = null
      emit("scrolller");
      if(!event?.close){
        selectedRow.value = null
      }
      
    };
    const route = useRoute();
    const editTimeLog = (id) => {
      store.commit("errorMsg", null);
      // store.dispatch("editAuditTimeLogApproval", id);
      visible.value = true;
      Id.value = id;
    };
    const auditId = ref("");

    function viewTimeLog(id) {
      // store.dispatch("timeLogView", id);
      viewReport.value = true;
      auditId.value = id;
    }
    // const modalData = store.getters.timeLogView
    const columns = store.getters.viuewTimeReportModal;

    const meta = store.getters.timeLogApproval.value;
    const loader = ref(false);
    // const metaData = computed(()=>{
    //   return store.state.timeLogReport.timeLogeMeta
    // })
    let data = [];

    let filter = "";
    let date = "";

    function checkDate() {
      filter = route.query.filter ? route.query.filter : "";
      
      date =
        route.query.fromDate && route.query.toDate
          ? "?fromDate=" +
            timeStampFormate(route.query.fromDate, "YYYY-MM-DD") +
            "&toDate=" +
            timeStampFormate(route.query.toDate, "YYYY-MM-DD")
          : store.getters.auditTimeLogFilterDates.value
          ? store.getters.auditTimeLogFilterDates.value
          : "?fromDate=&toDate=";
    }

    let scroller = "";
    onMounted(() => {
      
      var tableContent = document.querySelector(".ant-table-body");
      tableContent?.addEventListener("scroll", (event) => {
        checkDate();
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 1;
        
        if (currentScroll >= maxScroll) {
          let current_page = meta?.timeLogeMeta?.current_page + 1;
          if (current_page <= meta?.timeLogeMeta?.total_pages) {
            scroller = maxScroll;
            meta.timeLogeMeta = ''
            store.state.timeLogReport.timeLogeMeta = "";
            data = meta.timeApproval;

            store
              .dispatch(
                "timeLogApprovalList",
                date +
                  "&filter=" +
                  filter +
                  "&page=" +
                  current_page +
                  store.getters.orderTable.value.data +
                  store.getters.searchTable.value
              )
              .then(() => {
                loadMoredata();
              });
          }
        }
      });
    });

    function loadMoredata() {
      const newData = meta.timeApproval;

      newData.forEach((element) => {
        data.push(element);
      });
      store.state.timeLogApproval.timeApproval=data;
     
      var tableContent = document.querySelector(".ant-table-body");

      setTimeout(() => {
        tableContent.scrollTo(0, scroller);
      }, 50);

      loader.value = false;
    }

    //timeLogReport
    const auditTimes = computed(() => {
      return store.state.timeLogReport;
    });
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
          "timeLogApprovalList",
          date +
            "&filter=" +
            filter +
            store.getters.searchTable.value +
            orderParam
        );
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch(
          "timeLogApprovalList",
          date +
            "&filter=" +
            filter +
            store.getters.searchTable.value +
            store.getters.orderTable.value.data
        );
      }
    };

    const rejectButton = (id) => {
      warningSwal("Are you sure you want to reject ?").then((response) => {
        if (response == true) {
          store
            .dispatch("rejectApproval", {
              data: {
                status: 330,
                id:id
              },
              // id: id,
            })
            .then(() => {
              store.dispatch(
              "timeLogApprovalList",
              date +
              "?filter=" +
              filter +
              store.getters.searchTable.value +
              store.getters.orderTable.value.data
            );
              selectedRow.value = null
            });
        } else {
          // emit("saveAuditTimeLog", true);
          // disableButton.value = false;
        }
      });
    };

    let patientArray =[]
    const checkPatientStatus = ref([])
    const msgTypeArray =ref([])
    const checkMsgTypeStatus = ref([])
    const rowSelection = (selectedRowKeys, selectedRows) => {
      patientArray = selectedRows.map((item)=>item.patient.fullName)
      checkPatientStatus.value = patientArray.filter(function(item, pos) {
        return patientArray.indexOf(item) == pos;
      })
      msgTypeArray.value = selectedRows.map((item)=>item.type)
      checkMsgTypeStatus.value = msgTypeArray.value.filter(function(item, pos) {
        return msgTypeArray.value.indexOf(item) == pos;
      })
      if(checkMsgTypeStatus.value?.length>0 && checkPatientStatus.value?.length>0){
        // selectedRow.value = selectedRowKeys
        auditTimeLog.typeId = selectedRows[0].typeId
        //  selectedRows.map(item=>{
        //   auditTimeLog.timeAmount = auditTimeLog.timeAmount + item.timeAmount
        // })
        let time = selectedRows.map((item)=>item.timeAmount)
        auditTimeLog.timeAmount=time.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        );
      }
      
        return  selectedRow.value = selectedRowKeys
      }
     const getCheckboxProps = (record) => ({
        disabled: record.status === "Approved" || record.status === "Rejected",
        // Column configuration not to be checked
        name: record.status,
      })
    

    return {
      getCheckboxProps,
      auditTimeLog,
      checkMsgTypeStatus,
      checkPatientStatus,
      selectedRow,
      rowSelection,
      // onSelectChange,
      rejectButton,
      showPatientModal,
      showStaffModal,
      screensPermissions: store.getters.screensPermissions,
      handleTableChange,
      Id,
      arrayToObjact,
      auditTimes,
      editTimeLog,
      handleOk,
      loader,
      visible,
      meta,
      viewTimeLog,
      modalData: store.getters.timeLogView,
      columns,
      viewReport,
      timeStampFormate,
      auditId,
      tableYScroller
    };
  },
};
</script>

<style scoped>
.handleClear {
  margin-right: 10px;
}
.table-row{
  padding-top: 15px;
}
</style>
