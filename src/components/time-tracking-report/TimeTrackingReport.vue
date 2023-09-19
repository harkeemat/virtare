<template>
  <a-layout-content>
      <div class="common-bg">
          <a-row v-if="arrayToObjact(screensPermissions, 411)">
              <a-col :span="24">
                
                  <h2 class="pageTittle">{{$t('global.reports')}}
                      <DateFilter :Buttons="timeLineButton?.cptTimeline" @clickButtons="showButton($event);" :custom="true" commit="cptTimeline" />
                  </h2>
              </a-col>
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
              <a-col :sm="24" :xs="24">
                  <a-form :model="customFilter" name="auditTimeLog" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" layout="vertical" @finish="updateFilter" v-if="customDateShow">
                      <a-row :gutter="24">
                          <a-col :sm="10" :xs="24">
                              <div class="form-group">
                                  <label>{{$t('global.startDate')}}</label>
                                  <!-- <a-date-picker :format="globalDateFormat" value-format="YYYY-MM-DD" :disabledDate="d => !d || d.isSameOrAfter(dateSelect)" v-model:value="customFilter.startDate" :size="size" style="width: 100%" /> -->
                                    <DateField :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :disabledDateData="current => !current || current > dayjs(dateSelect).subtract(1,'day')" v-model:value="customFilter.startDate" :size="size"/>
                                  </div>
                          </a-col>
                          <a-col :sm="10" :xs="24">
                              <div class="form-group">
                                  <label>{{$t('global.endDate')}}</label>
                                  <DateField  :globalDateFormat="globalDateFormat" :disabledDateData="current => !current || current < dayjs(customFilter.startDate).subtract(0,'day')" value-format="YYYY-MM-DD" v-model:value="customFilter.endDate" :size="size"  @change="dateChange" />
                              </div>
                          </a-col>

                          <a-col :sm="2" :xs="24">
                              <div class="text-right mt-28">
                                  <a-button type="primary" html-type="submit">{{$t('timeLogReport.view')}}</a-button>
                              </div>
                          </a-col>
                      </a-row>
                  </a-form>
              </a-col>
          </a-row>
          <a-row v-if="arrayToObjact(screensPermissions, 411)">
              <a-col :span="24">
                  <DataTable />
                  <!-- <TableLoader /> -->
              </a-col>
          </a-row>
      </div>
  </a-layout-content>
</template>

<script>
import { onMounted, ref, onUnmounted, reactive, watchEffect } from "vue";
import moment from "moment";
import dayjs from 'dayjs';
// import TableLoader from "@/components/loader/TableLoader";
import { timeStampFormate,arrayToObjact,dayWeekMonthdate } from "@/commonMethods/commonMethod";
import DataTable from "./data-table/DataTable";
import DateFilter from "@/components/common/DateFilter.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import DateField from "@/components/modals/search/DateField.vue";
export default {
  components: {
    DataTable,
    // TableLoader,
    DateFilter,
    DateField
  },

  setup() {
    const store = useStore();
    const patient = ref([]);
    const route = useRoute();
    const router = useRouter();
    const startDate = ref(null);
    const endDate = ref(null);
    const dateSelect = ref(null);

    const customFilter = reactive({
      startDate: "",
      endDate: "",
    });

    function dateChange() {
      dateSelect.value = moment(customFilter.endDate).add(1, "day");
    }

    const timeLineButton = store.getters.reports;
    const customDateShow = ref(false);
    watchEffect(()=>{
      if (store.state.common.filterDateDataGet.length > 0) {
        if (timeLineButton.value?.cptTimeline == null) {
          store
            .dispatch("timeLine", {
              id: 122,
              commit: "cptTimeline",
            })
            .then(() => {
              apiCall(timeLineButton.value?.cptTimeline);
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
        store.dispatch("cptCodes", date + "&filter=" + filter);
      } else {
        // store.dispatch("timeLine", {
        //   id: 122,
        //   commit: "cptTimeline",
        // })
        // store.commit("dateFilter", "");
      }
      if (timeLineButton.value?.cptTimeline != null) {  
              apiCall(timeLineButton.value?.cptTimeline);
        
      }
      
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    onUnmounted(() => {
      store.dispatch("cptCodeFilterDates", "?fromDate=&toDate=");
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
            "cptCodes",
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
          store.dispatch("cptCodes");
        }
      } else {
        if (route.query.filter) {
          router.replace({
            query: {
              filter: route.query.filter,
            },
          });
          store.dispatch("cptCodes", "?filter=" + route.query.filter);
        } else {
          router.replace({
            query: {},
          });
          store.dispatch("cptCodes");
        }
      }
    }

    function showButton(id) {
      if (id == 426) {
        customDateShow.value = true;
      } else {
        customDateShow.value = false;
        apiCall(timeLineButton.value?.cptTimeline);
      }
    }

    function apiCall(data) {
      let dateFormate = dayWeekMonthdate(data,true)

      store.dispatch(
        "cptCodeFilterDates",
        "?fromDate=" +
        moment(dateFormate.fromDate).format("YYYY-MM-DD") +
          "&toDate=" +
          moment(dateFormate.toDate).format("YYYY-MM-DD")
      );
       store.commit(
        "otherFilters",
        "&fromDate=" +
        moment(dateFormate.fromDate).format("YYYY-MM-DD") +
          "&toDate=" +
          moment(dateFormate.toDate).format("YYYY-MM-DD")
      );
      store.dispatch(
        "cptCodes",
        "?fromDate=" +
        moment(dateFormate.fromDate).format("YYYY-MM-DD") +
          "&toDate=" +
          moment(dateFormate.toDate).format("YYYY-MM-DD") +
          "&page="+store.getters.searchTable.value
      );
    }

    function updateFilter() {
      if (customFilter.startDate && customFilter.endDate) {
        //store.getters.timeLogReports.value.timeLog = ""
        // store.getters.timeLogReports.value.timeLogeMeta = ''
        startDate.value = customFilter.startDate
          ? moment(customFilter.startDate).format("YYYY-MM-DD")
          : "";
        endDate.value = customFilter.endDate
          ? moment(customFilter.endDate).format("YYYY-MM-DD")
          : "";
        store.dispatch(
          "cptCodeFilterDates",
          "?fromDate=" + startDate.value + "&toDate=" + endDate.value
        );
        store.dispatch(
          "cptCodes",
          "?fromDate=" + startDate.value + "&toDate=" + endDate.value + "&page="
        );
      }
    }

    return {
      dateSelect,
      dateChange,
      arrayToObjact,
      startDate,
      endDate,
      updateFilter,
      customFilter,
      customDateShow,
      route,
      dayjs,
      remove,
      showButton,
      patient,
      timeLineButton,
      size: ref("large"),
      screensPermissions:store.getters.screensPermissions,
      dayWeekMonthdate
    };
  },
};
</script>

<style lang="scss">
.button-left {
  padding-left: 15px;
}
</style>
