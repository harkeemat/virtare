<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">
            {{ $t("escalation.auditEscalation") }}
            <DateFilter
              v-if="timeLineButton?.escalationDateFilter"
              :Buttons="timeLineButton?.escalationDateFilter"
              @clickButtons="showButton($event)"
              commit="escalationDateFilter"
            />
          </h2>
        </a-col>
      </a-row>
      <!-- <a-row class="addBtn">
              <a-button @click="addTimelogModal" class="primaryBtn">{{ $t('timeLogs.addTimeLog') }}</a-button>
            </a-row> -->
      <a-row>
        <div class="commonTags">
          <a-tag v-if="route.query.filter" closable @close="remove('filter')">{{
            route.query.filter
          }}</a-tag>
          <a-tag
            v-if="route.query.toDate && route.query.fromDate"
            closable
            @close="remove('date')"
          >
            {{ timeStampFormate(route.query.fromDate, globalDateFormat) }} To
            {{ timeStampFormate(route.query.toDate, globalDateFormat) }}
          </a-tag>
        </div>
      </a-row>
      <a-row>
        <a-col :sm="20" :xs="24">
          <a-form
            :model="auditEscalation"
            name="auditEscalation"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            layout="vertical"
            @finish="updateAuditTime"
            v-if="customDateShow"
          >
            <a-row :gutter="24">
              <a-col :sm="8" :xs="24">
                <div
                  class="form-group"
                  v-if="arrayToObjact(screensPermissions, 332)"
                >
                  <label>{{ $t("global.startDate") }}</label>
                  <DateField
                    :globalDateFormat="globalDateFormat"
                    value-format="YYYY-MM-DD"
                    :disabledDateData="
                      (current) =>
                        !current ||
                        current > dayjs(dateSelect).subtract(1, 'day')
                    "
                    v-model:value="auditEscalation.startDate"
                    :size="size"
                  />
                </div>
              </a-col>
              <a-col :sm="8" :xs="24">
                <div
                  class="form-group"
                  v-if="arrayToObjact(screensPermissions, 332)"
                >
                  <label>{{ $t("global.endDate") }}</label>
                  <DateField
                    :globalDateFormat="globalDateFormat"
                    :disabledDateData="
                      (current) =>
                        !current ||
                        current <
                          dayjs(auditEscalation.startDate).subtract(0, 'day')
                    "
                    value-format="YYYY-MM-DD"
                    v-model:value="auditEscalation.endDate"
                    :size="size"
                    @change="dateChange"
                  />
                </div>
              </a-col>
              <a-col :sm="2" :xs="24">
                <div
                  class="text-right mt-28"
                  v-if="arrayToObjact(screensPermissions, 332)"
                >
                  <a-button type="primary" html-type="submit">{{
                    $t("timeLogReport.view")
                  }}</a-button>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <SearchField
            endPoint="escalationAudit"
            v-if="arrayToObjact(screensPermissions, 65)"
            mode=""
          />
        </a-col>
        <a-col :span="12">
          <div class="text-right mb-24">
            <ExportToExcel
              @click="exportExcel('escalationAudit_report', filtterDates?filtterDates:'')"
              v-if="arrayToObjact(screensPermissions, 333)"
            />
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <ListTable />
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
  <TableLoader />
  <ViewDetails
    :arrayData="escalationAssignToData"
    v-if="viewModal"
    v-model:visible="viewModal"
  />
</template>

<script>
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import DateFilter from "@/components/common/DateFilter.vue";
import ListTable from "./ListTable.vue";
import {
  exportExcel,
  arrayToObjact,
  timeStampFormate,
  globalDateFormat,
  showPatientModal,
  showStaffModal,
  startimeAdd,
  endTimeAdd,
  timeStamp,
} from "@/commonMethods/commonMethod";
import {
  ref,
  reactive,
  onUnmounted,
  onMounted,
  computed,
  defineComponent,
  defineAsyncComponent,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import moment from "moment";
import dayjs from "dayjs";
import SearchField from "@/components/common/input/SearchField";
import { useRoute } from "vue-router";
import TableLoader from "@/components/loader/TableLoader.vue";
import DateField from "@/components/modals/search/DateField.vue";
export default defineComponent({
  components: {
    ExportToExcel,
    DateFilter,
    SearchField,
    TableLoader,
    ListTable,
    ViewDetails: defineAsyncComponent(() =>
      import("@/components/escalations/ViewDetails.vue")
    ),
    DateField,
  },
  setup() {
    const store = useStore();
    const dateSelect = ref(null);
    const route = useRoute();
    const timeLineButton = store.getters.escalations;
    const customDateShow = ref(false);
    const viewModal = ref();
    const escalationAssignToData = ref();
    const startDate = ref(null);
    const endDate = ref(null);
    const auditEscalation = reactive({
      startDate: "",
      endDate: "",
    });

    function dateChange() {
      dateSelect.value = moment(auditEscalation.endDate).add(1, "day");
    }

    watchEffect(() => {
      if (timeLineButton?.value?.escalationDateFilter?.globalCodeId == 426) {
        customDateShow.value = true;
      }
      if (store.state.common?.filterDateDataGet?.length > 0) {
        if (timeLineButton.value?.escalationDateFilter == null) {
          store
            .dispatch("timeLine", {
              id: 122,
              commit: "escalationDateFilter",
            })
            .then(() => {
              apiCall(timeLineButton.value?.escalationDateFilter);
            });
        }
      }
    });

    onMounted(() => {
      if (timeLineButton.value?.escalationDateFilter != null) {
        apiCall(timeLineButton.value?.escalationDateFilter);
      }
      // else{
      //   store.dispatch("timeLine", {id: 122,commit: "escalationDateFilter",})
      // }
      store.dispatch("timeLine", {id: 122,commit: "escalationDateFilter",})
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    function updateAuditTime() {
      if (auditEscalation.startDate && auditEscalation.endDate) {
        //store.getters.timeLogReports.value.timeLog = ""
        store.getters.timeLogReports.value.timeLogeMeta = "";
        startDate.value = auditEscalation.startDate
          ? timeStamp(startimeAdd(moment(auditEscalation.startDate)))
          : "";
        endDate.value = auditEscalation.endDate
          ? timeStamp(endTimeAdd(moment(auditEscalation.endDate)))
          : "";
        store.dispatch(
          "escalationAudit",
          "?fromDate=" +
            startDate.value +
            "&toDate=" +
            endDate.value +
            "&page=" +
            store.getters.searchTable.value
        );
      }
    }

    function clearData() {
      auditEscalation.startDate = "";
      auditEscalation.endDate = "";
      store.dispatch("escalationAudit", "?fromDate=&toDate=&page=");
    }

    function scrolller() {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }

    onUnmounted(() => {
      //store.dispatch("auditEscalationFilterDates", "?fromDate=&toDate=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.commit("filter", "");
      store.commit("dateFilter", "");
    });

    function showButton(id) {
      if (id == 426) {
        customDateShow.value = true;
      } else {
        customDateShow.value = false;
        apiCall(timeLineButton.value?.escalationDateFilter);
      }
    }

    function apiCall(data) {
      let from = moment();
      let to = moment();
      if (data?.globalCodeId == 122) {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      } else if (data?.globalCodeId == 123) {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      } else if (data?.globalCodeId == 124) {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      } else {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      }

      let dateFormate = {
        fromDate: "",
        toDate: "",
      };
      if (data?.globalCodeId == 122) {
        dateFormate = {
          fromDate: from ? timeStamp(startimeAdd(from)) : "",
          toDate: to ? timeStamp(endTimeAdd(to)) : "",
        };
      } else {
        dateFormate = {
          fromDate: timeStamp(startimeAdd(to)),
          toDate: timeStamp(endTimeAdd(from)),
        };
      }
      store.commit("dateFilter", dateFormate);
      store.commit(
        "otherFilters",
        "?fromDate=" + dateFormate.fromDate + "&toDate=" + dateFormate.toDate
      );
      store.dispatch(
        "escalationAudit",
        "?fromDate=" +
          dateFormate.fromDate +
          "&toDate=" +
          dateFormate.toDate +
          store.getters.searchTable?.value +
          store.getters.orderTable?.value?.data
      );
    }

    function showAudit(id) {
      store.dispatch("getAuditData", id).then((resp) => {
        if (resp == true) {
          viewModal.value = true;
          escalationAssignToData.value = null;
        }
      });
    }

    const escalationData = computed(() => {
      return store.state.escalations;
    });

    function showDetails(data) {
      viewModal.value = true;
      store.state.escalations.getAuditData = null;
      escalationAssignToData.value = data.map((item) => {
        item.name = item.staff?.fullName;
        item.designation = item.staff?.designation;
        item.specialization = item.staff?.specialization;
        return item;
      });
    }

    return {
      dayjs,
      updateAuditTime,
      timeLineButton,
      showDetails,
      showPatientModal,
      showStaffModal,
      showAudit,
      viewModal,
      escalationAssignToData,
      escalationData,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
      exportExcel,
      dateSelect,
      auditEscalation,
      dateChange,
      filtterDates: store.getters.otherFilters,
      value1: ref(),
      size: ref("large"),
      scrolller,
      clearData,
      timeStampFormate,
      globalDateFormat,
      route,
      showButton,
      customDateShow,
    };
  },
});
</script>

<style lang="scss">
</style>
