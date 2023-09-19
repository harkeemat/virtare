<template>
  <a-col :sm="24" :xs="24">
    <a-table
      rowKey="id"
      :columns="meta.timeLogReportColumns"
      :pagination="false"
      :scroll="{x:1380, y: 'calc(100vh - 370px)' }"
      :data-source="meta.timeLogReportList"
      @change="handleTableChange"
    >
      <template #staff="{ record }">
        <router-link
          :to="{
            name: 'CoordinatorSummary',
            params: {
              udid: record.staffId ? record.staffId : 'eyrer8758458958495',
            },
          }"
          v-if="arrayToObjact(screensPermissions, 38)"
          >{{
            record.staff.length > 12
              ? record.staff.substring(0, 12) + "..."
              : record.staff
          }}</router-link
        >
        <a
          v-if="arrayToObjact(screensPermissions, 38)"
          @click="showStaffModal(record.staffId)"
          class="nameInfoIcon"
        >
          <InfoCircleOutlined
        /></a>
        <span v-else>{{ record.staff }}</span>
      </template>
      <template #patient="{ record }">
        <router-link
          :to="{ name: 'PatientSummary', params: { udid: record.patientId } }"
          v-if="
            arrayToObjact(screensPermissions, 63) ||
            record.patientAccess == true
          "
        >
          <a-tooltip placement="bottom">
            <template #title>
              <span>{{ record.patient }}</span>
            </template>
            <a class="icons">
              {{
                record.patient.length > 10
                  ? record.patient.substring(0, 10) + "..."
                  : record.patient
              }}</a
            >
          </a-tooltip>
        </router-link>
        <a
          v-if="
            arrayToObjact(screensPermissions, 63) ||
            record.patientAccess == true
          "
          @click="showPatientModal(record.patientId)"
          class="nameInfoIcon"
        >
          <InfoCircleOutlined
        /></a>
        <span v-else :title="messages.access">
          <a-tooltip placement="bottom">
            <template #title>
              <span>{{ record.patient }}</span>
            </template>
            <a class="icons">
              {{
                record.patient.length > 10
                  ? record.patient.substring(0, 10) + "..."
                  : record.patient
              }}</a
            >
          </a-tooltip>
        </span>
      </template>
      <template #flags="{ record }">
        <!-- <Flags :flag="record.flagColor" :data="record" /> -->
        <span>{{ record.flagName }}</span>
      </template>
      <template #flag="{ text }">
        <span>
          <img
            class="reportFlag"
            src="../../assets/images/flag-orange.svg"
            alt="image"
        /></span>
        <span v-if="text.match(/two/g)"
          ><img
            class="reportFlag"
            src="../../assets/images/flag-red.svg"
            alt="image"
        /></span>
      </template>
      <template #actions="{ record }">
        <a-tooltip
          placement="bottom"
          @click="editTimeLog(record.id)"
          v-if="arrayToObjact(screensPermissions, 334)"
        >
          <template #title>
            <span>{{ $t("global.edit") }}</span>
          </template>
          <a class="icons"> <EditOutlined /></a>
        </a-tooltip>
        <a-tooltip
          placement="bottom"
          @click="viewTimeLog(record.id)"
          v-if="arrayToObjact(screensPermissions, 332)"
        >
          <template #title>
            <span>{{ $t("common.view") }}</span>
          </template>
          <a class="icons">
            <EyeOutlined />
          </a>
        </a-tooltip>
      </template>
      <template #active="key">
        <a-switch
          v-model:checked="checked[key.record.key]"
          :disabled="!arrayToObjact(screensPermissions, 334)"
        />
      </template>
    </a-table>
    <TableLoader />

    <AuditTimeLog
      v-if="visible"
      v-model:visible="visible"
      @saveAuditTimeLog="handleOk($event)"
      :Id="Id"
    />
  </a-col>
  <ViewTimeLogTable
    v-if="viewReport"
    v-model:visible="viewReport"
    :id="auditId"
  />
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  // DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import AuditTimeLog from "../modals/AuditTimeLogs";
import ViewTimeLogTable from "./ViewTimeLogTable";
import { messages } from "@/config/messages";
import TableLoader from "@/components/loader/TableLoader";
import { useStore } from "vuex";
import {
  warningSwal,
  arrayToObjact,
  timeStampFormate,
  showStaffModal,
  showPatientModal,
} from "@/commonMethods/commonMethod";

// import Flags from "@/components/common/flags/Flags";
import { useRoute } from "vue-router";

export default {
  components: {
    // DeleteOutlined,
    EyeOutlined,
    EditOutlined,
    TableLoader,
    AuditTimeLog,
    ViewTimeLogTable,
    InfoCircleOutlined,
    // Flags,
  },
  props: {},
  setup(props, { emit }) {
    const store = useStore();
    const visible = ref(false);
    const viewReport = ref(false);
    const Id = ref();
    const handleOk = (event) => {
      visible.value = event;
      emit("scrolller");
    };
    const route = useRoute();
    const editTimeLog = (id) => {
      store.commit("errorMsg", null);
      store.dispatch("editAuditTimeLog", id);
      visible.value = true;
      Id.value = id;
    };
    const auditId = ref("");

    function viewTimeLog(id) {
      store.dispatch("timeLogView", id);
      viewReport.value = true;
      auditId.value = id;
    }
    // const modalData = store.getters.timeLogView
    const columns = store.getters.viuewTimeReportModal;

    function deleteTimeLog(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteTimeLog", id);
          setTimeout(() => {
            store.dispatch("timeLogReportList");
          }, 2000);
        }
      });
    }

    const meta = store.getters.timeLogReports.value;
    const loader = ref(false);
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
      checkDate();
      var tableContent = document.querySelector(".ant-table-body");
      tableContent?.addEventListener("scroll", (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;
        if (currentScroll >= maxScroll) {
          let current_page = meta.timeLogeMeta.current_page + 1;
          if (current_page <= meta.timeLogeMeta.total_pages) {
            scroller = maxScroll;
            data = meta.timeLogReportList;

            loader.value = true;

            store.state.timeLogReport.timeLogeMeta = "";

            store
              .dispatch(
                "timeLogReportList",
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
      const newData = meta.timeLogReportList;

      newData.forEach((element) => {
        data.push(element);
      });
      meta.timeLogReportList = data;
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
          "timeLogReportList",
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
          "timeLogReportList",
          date +
            "&filter=" +
            filter +
            store.getters.searchTable.value +
            store.getters.orderTable.value.data
        );
      }
    };

    return {
      showPatientModal,
      showStaffModal,
      screensPermissions: store.getters.screensPermissions,
      handleTableChange,
      Id,
      arrayToObjact,
      auditTimes,
      editTimeLog,
      handleOk,
      deleteTimeLog,
      loader,
      visible,
      meta,

      viewTimeLog,
      modalData: store.getters.timeLogView,
      columns,
      viewReport,
      timeStampFormate,
      auditId,
    };
  },
};
</script>
