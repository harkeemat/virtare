<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">{{$t('timeLogReport.auditTimeLog')}}
                        <DateFilter :Buttons="timeLineButton?.timelineReport" @clickButtons="showButton($event)" :hideArray="hideFilterAuditLog" commit="timelineReport" />
                    </h2>
                </a-col>
            </a-row>
            <a-row class="addBtn">
              <!-- <a-button @click="addTimelogModal" type="primary">{{ $t('timeLogs.addTimeLog') }}</a-button> -->
              <ShowModalButton @click="addTimelogModal" :buttonText="$t('timeLogs.addTimeLog')" />
            </a-row>
            <a-row>
                <div class="commonTags">
                    <a-tag v-if="route.query.filter" closable @close="remove('filter')">{{route.query.filter}}</a-tag>
                    <a-tag v-if="route.query.toDate && route.query.fromDate" closable @close="remove('date')">
                        {{timeStampFormate(route.query.fromDate,globalDateFormat) }} To {{timeStampFormate(route.query.toDate,globalDateFormat)}}
                    </a-tag>
                </div>
            </a-row>
            <a-row>
                <a-col :sm="20" :xs="24">
                    <a-form :model="auditTimeLog" name="auditTimeLog" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" layout="vertical" @finish="updateAuditTime" v-if="customDateShow">
                        <a-row :gutter="24">
                            <a-col :sm="8" :xs="24">
                                <div class="form-group" v-if="arrayToObjact(screensPermissions, 332)">
                                    <label>{{$t('global.startDate')}}</label>
                                    <!-- <a-date-picker :format="globalDateFormat" value-format="YYYY-MM-DD" :disabledDate="d => !d || d.isSameOrAfter(dateSelect)" v-model:value="auditTimeLog.startDate" :size="size" style="width: 100%" /> -->
                                      <DateField :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :disabledDateData="current => !current || current > dayjs(dateSelect).subtract(1,'day')" v-model:value="auditTimeLog.startDate" :size="size"/>
                                    </div>
                            </a-col>
                            <a-col :sm="8" :xs="24">
                                <div class="form-group" v-if="arrayToObjact(screensPermissions, 332)">
                                    <label>{{$t('global.endDate')}}</label>
                                    <!-- <a-date-picker :format="globalDateFormat" :disabledDate="d => !d || d.isSameOrBefore(auditTimeLog.startDate)" value-format="YYYY-MM-DD" v-model:value="auditTimeLog.endDate" :size="size" style="width: 100%" @change="dateChange" /> -->
                                      <DateField :globalDateFormat="globalDateFormat" :disabledDateData="current => !current || current < dayjs(auditTimeLog.startDate).subtract(0,'day')" value-format="YYYY-MM-DD" v-model:value="auditTimeLog.endDate" :size="size"  @change="dateChange" />
                                    </div>
                            </a-col>

                            <a-col :sm="2" :xs="24">
                                <div class="text-right mt-28" v-if="arrayToObjact(screensPermissions, 332)">
                                    <a-button type="primary" html-type="submit">{{$t('timeLogReport.view')}}</a-button>
                                </div>
                            </a-col>
                            
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="12">
                    <SearchField endPoint="timeLog" v-if="arrayToObjact(screensPermissions, 65)" mode="" />
                </a-col>
                <a-col :span="12">
                    <div class="text-right mb-24">
                        <ExportToExcel @click="exportExcel('patientTimelog_report',filtterDates)" v-if="arrayToObjact(screensPermissions, 333)" />
                    </div>
                </a-col>
            </a-row>

            <a-row>
                <TimeLogTable @scrolller="scrolller" v-if="arrayToObjact(screensPermissions, 332)" />
            </a-row>
        </div>
    </a-layout-content>
    <AddTimeLogsModal v-if="addTimeLogsVisible" v-model:visible="addTimeLogsVisible" @closeModal="addTimeLogsClose($event)" />
</template>

<script>
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import DateFilter from "@/components/common/DateFilter.vue";
import {
  exportExcel,
  arrayToObjact,
  timeStampFormate,
  globalDateFormat,hideFilterAuditLog,dayWeekMonthdate
} from "@/commonMethods/commonMethod";
import { ref, reactive, onUnmounted, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import TimeLogTable from "./TimeLogTable";
import moment from "moment";
import dayjs from 'dayjs';
import SearchField from "@/components/common/input/SearchField";
import AddTimeLogsModal from "@/components/modals/AddTimeLogs";
import { useRoute, useRouter } from "vue-router";
import DateField from "@/components/modals/search/DateField.vue";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
export default {
  components: {
    ShowModalButton,
    TimeLogTable,
    ExportToExcel,
    DateFilter,
    SearchField,
    AddTimeLogsModal,
    DateField
  },
  setup() {
    const store = useStore();
    const checked = ref([false]);
    const linkTo = "patients-summary";
    const auditTimeLog = reactive({
      startDate: "",
      endDate: "",
    });
    const dateSelect = ref(null);
    const startDate = ref(null);
    const endDate = ref(null);
    const route = useRoute();
    const router = useRouter();
    const timeLineButton = store.getters.timeLogReport;
    const customDateShow = ref(false);
    const addTimeLogsVisible = ref(false);

    const addTimelogModal = () => {
      addTimeLogsVisible.value = true;
    };

    function dateChange() {
      dateSelect.value = moment(auditTimeLog.endDate).add(1, "day");
    }
    watchEffect(()=>{
      if (store.state.common.filterDateDataGet.length > 0) {
        if (timeLineButton.value?.timelineReport == null) {
          store
            .dispatch("timeLine", {
              id: 122,
              commit: "timelineReport",
            })
            .then(() => {
              apiCall(timeLineButton.value);
            });
        }
      }
    })
    onMounted(() => {
      if (route.query.filter || route.query.fromDate) {
        let filter = route.query.filter ? route.query.filter : "";
        let date =
          route.query.fromDate && route.query.toDate
            ? "?fromDate=" +
              timeStampFormate(route.query.fromDate, "YYYY-MM-DD") +
              "&toDate=" +
              timeStampFormate(route.query.toDate, "YYYY-MM-DD")
            : "?fromDate=&toDate=";
        //store.dispatch('auditTimeLogFilterDates', "?fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate)
        store.dispatch("timeLogReportList", date + "&filter=" + filter);
      } else {
        // store
        //     .dispatch("timeLine", {
        //       id: 122,
        //       commit: "timelineReport",
        //     })
        // store.commit("dateFilter", "");
        if (timeLineButton.value?.timelineReport != null) {
          apiCall(timeLineButton.value?.timelineReport);
        }
      }

      store.dispatch("auditTimeLogFilterDates", "?fromDate=&toDate=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    function clearData() {
      auditTimeLog.startDate = "";
      auditTimeLog.endDate = "";
      store.dispatch("timeLogReportList", "?fromDate=&toDate=&page=");
    }

    function scrolller() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }

    function updateAuditTime() {
      if (auditTimeLog.startDate && auditTimeLog.endDate) {
        //store.getters.timeLogReports.value.timeLog = ""
        store.getters.timeLogReports.value.timeLogeMeta = "";
        startDate.value = auditTimeLog.startDate
          ? moment(auditTimeLog.startDate).format("YYYY-MM-DD")
          : "";
        endDate.value = auditTimeLog.endDate
          ? moment(auditTimeLog.endDate).format("YYYY-MM-DD")
          : "";
        store.dispatch(
          "auditTimeLogFilterDates",
          "?fromDate=" + startDate.value + "&toDate=" + endDate.value
        );
        store.dispatch(
          "timeLogReportList",
          "?fromDate=" + startDate.value + "&toDate=" + endDate.value + "&page="
        );
      }
    }
    onUnmounted(() => {
      store.dispatch("auditTimeLogFilterDates", "?fromDate=&toDate=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.commit("filter", "");
      store.commit("dateFilter", "");
    });

    function remove(event) {
      if (event == "filter") {
        if (route.query.fromDate && route.query.toDate) {
          store.dispatch(
            "timeLogReportList",
            "?fromDate=" +
              timeStampFormate(route.query.fromDate, "YYYY-MM-DD") +
              "&toDate=" +
              timeStampFormate(route.query.toDate, "YYYY-MM-DD")
          );
          setTimeout(() => {
            router.replace({
              query: {
                fromDate: route.query.fromDate,
                toDate: route.query.toDate,
              },
            });
          }, 1000);
        } else {
          router.replace({
            query: {},
          });
          store.dispatch("timeLogReportList");
        }
      } else {
        if (route.query.filter) {
          router.replace({
            query: {
              filter: route.query.filter,
            },
          });
          store.dispatch("timeLogReportList", "?filter=" + route.query.filter);
        } else {
          router.replace({
            query: {},
          });
          store.dispatch("timeLogReportList");
        }
      }
    }

    function showButton(id) {
      if (id == 426) {
        customDateShow.value = true;
      } else {
        customDateShow.value = false;
        apiCall(timeLineButton.value?.timelineReport);
      }
    }

    function apiCall(data) {
      let dateFormate = dayWeekMonthdate(data,true)

      store.dispatch(
        "auditTimeLogFilterDates",
        "?fromDate=" +
        moment(dateFormate.fromDate).format("YYYY-MM-DD") +
          "&toDate=" +
          moment(dateFormate.toDate).format("YYYY-MM-DD")
      );
      store.dispatch(
        "timeLogReportList",
        "?fromDate=" +
        moment(dateFormate.fromDate).format("YYYY-MM-DD") +
          "&toDate=" +
          moment(dateFormate.toDate).format("YYYY-MM-DD") +
          "&page="
      );
    }

    const addTimeLogsClose = (value) => {
      addTimeLogsVisible.value = value;
    };

    return {
      dayjs,
      addTimeLogsClose,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
      exportExcel,
      linkTo,
      updateAuditTime,
      checked,
      dateSelect,
      auditTimeLog,
      dateChange,
      filtterDates: store.getters.auditTimeLogFilterDates,
      value1: ref(),
      size: ref("large"),
      timeLogReports: store.getters.timeLogReports,
      scrolller,
      clearData,
      remove,
      timeStampFormate,
      globalDateFormat,
      route,
      timeLineButton,
      showButton,
      customDateShow,
      addTimelogModal,
      addTimeLogsVisible,
      hideFilterAuditLog,
      dayWeekMonthdate
    };
  },
};
</script>

<style lang="scss">
</style>
