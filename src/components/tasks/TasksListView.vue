<template>
<a-row class="mb-24" :gutter="24">
    <a-col :span="24">
        <h2 class="pageTittle">
            <DateFilter :Buttons="timeLineButton?.taskDateFiletrs" @click="showButton($event)" commit="taskDateFiletrs" />
        </h2>
    </a-col>
</a-row>
<a-row>
    <div class="commonTags">
        <a-tag v-if="route.query.filter" closable @close="remove('filter')">{{
        route.query.filter
      }}</a-tag>
        <!-- <a-tag v-if="route.query.toDate && route.query.fromDate" closable @close="remove('date')"></a-tag> -->
    </div>
</a-row>
<a-row class="mb-24" :gutter="24">
    <a-col :xl="6" :sm="8" :xs="12" v-for="status in tasks.taskStatus" :key="status.id">
        <FilterCard :filterCount="CompletedTasksFilterCount" :count="status.total ? status.total : 0" :color="status.color" class="blockLists five" :heading="status.text" @click="linkOpen(status.text)" />
    </a-col>
</a-row>
<a-row :gutter="24">
    <a-col :span="6">
        <SearchField endPoint="task" />
    </a-col>
    <a-col :span="6">
        <StaffDropDown mode="multiple" @handleStaffChange="handleStaffChange($event, 'assignedTo')" placeholder="Assigned To" />
    </a-col>
    <a-col :span="6">
        <StaffDropDown mode="multiple" @handleStaffChange="handleStaffChange($event, 'assignedBy')" placeholder="Reported By" />
    </a-col>
    <a-col :span="6" v-if="Buttons?.globalCode == 'Custom'">
        <DatePicker @onChange="handleStaffChange($event, 'dateRange')" v-model:value="dateRange" datePickerType="range" :dateRange="dateRange" />
    </a-col>
</a-row>

<a-row :gutter="24" class="tasktable">
    <a-col :span="24">
        <div class="text-right mb-24">
            <ExportToExcel @click="
            exportExcel(
              'task_report',
              '?filter=' + route.query.filter + dateFilter + search
            )
          " v-if="arrayToObjact(screensPermissions, 118)" />
        </div>
    </a-col>
    <TaskTable @is-Edit="editTask($event)" :tasksListColumns="tasksListColumns" @onChange="handleStaffChange($event, 'search')" :fromAll="true"></TaskTable>
</a-row>
</template>
<script>
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch";
import { ref, onUnmounted, onMounted, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
import TaskTable from "@/components/tasks/TaskTable";

import {
  arrayToObjact,
  exportExcel,
  timeStampFormate,
  globalDateFormat,
  dayWeekMonthdate,
} from "@/commonMethods/commonMethod";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import DatePicker from "@/components/common/DatePicker";
import { useRoute, useRouter } from "vue-router";
import FilterCard from "@/components/common/cards/FilterCard";
import { timeStamp } from "../../commonMethods/commonMethod";
import DateFilter from "@/components/common/DateFilter.vue";
const tasksListColumns = [
  {
    title: "Priority ",
    dataIndex: "priority",
    sorter: true,
  },
  {
    title: "Due Date ",
    dataIndex: "dueDate",
    sorter: true,
    slots: {
      customRender: "dueDate",
    },
  },
  {
    title: "Assigned To",
    dataIndex: "assignedTo",
    sorter: true,
    slots: {
      customRender: "assignedTo",
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: true,
    slots: {
      customRender: "taskName",
    },
  },
  {
    title: "Status ",
    dataIndex: "taskStatus",
    sorter: true,
    slots: {
      customRender: "status",
    },
  },

  {
    title: "Category",
    dataIndex: "category",
    sorter: true,
    slots: {
      customRender: "category",
    },
  },
  // {
  //     title: 'Start Date ',
  //     dataIndex: 'startDate',
  //     sorter: true
  // },

  // },
  // {
  //     title: 'Type',
  //     dataIndex: 'taskType',
  //     sorter: true,
  //     slots: {
  //         customRender: 'taskType'
  //     }
  // },
  {
    title: "Assigned By",
    dataIndex: "assignedBy",
    sorter: true,
    slots: {
      customRender: "assignedBy",
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    slots: {
      customRender: "action",
    },
  },
];
export default {
  components: {
    SearchField,
    TaskTable,
    DateFilter,
    ExportToExcel,
    StaffDropDown,
    DatePicker,
    FilterCard,
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const toDate = ref("");
    const dateRange = ref();
    //var dateRangeQuery = []
    //const params = ref("")
    const assignedByValue = ref("&assignedBy=");
    const assignedToValue = ref("&assignedTo");
    const fromDateValue = ref("&fromDate=");
    const toDateValue = ref("&toDate=");
    //const filterValue = ref("")
    //const searchValue = ref("")
    const tasks = computed(() => {
      return store.state.tasks;
    });
    const CompletedTasksFilterCount = [
      {
        key: 0,
        text: "Urgent",
        link: "http://www.alipay.com/",
      },
      {
        key: 1,
        text: "2nd Menu Item",
        link: "http://www.taobao.com/",
      },
    ];
    onMounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.commit("otherFilters");

      // store.dispatch('otherFilters', "&fromDate=&toDate=")
      if (route.query.filter || route.query.fromDate) {
        let timelineId = route.query.timelineId ? route.query.timelineId : 122;
        store
          .dispatch("timeLine", {
            id: timelineId,
            commit: "taskDateFiletrs",
          })
          .then(() => {
            apiCall(timeLineButton.value);
          });
      } else {
        // if (timeLineButton.value) {
        //         apiCall(timeLineButton.value);
        //     }
        store
          .dispatch("timeLine", {
            id: 122,
            commit: "taskDateFiletrs",
          })
          .then(() => {
            apiCall(timeLineButton.value?.taskDateFiletrs);
          });
      }
    });
    function linkOpen(name) {
      let date = store.getters.otherFilters.value
        ? store.getters.otherFilters.value
        : route.query.fromDate && route.query.toDate
        ? "&fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate
        : "&fromDate=&toDate=";
      store.dispatch("tasksList", "?filter=" + name + date);
      router.replace({
        query: {
          view: "list",
          filter: name,
        },
      });
    }
    const handleStaffChange = (value, type) => {
      if (type == "dateRange") {
        let newValue = value.value;
        fromDateValue.value =
          newValue.length > 0 ? `&fromDate=${timeStamp(newValue[0])}` : "";
        toDateValue.value =
          newValue.length > 0 ? `&toDate=${timeStamp(newValue[1])}` : "";
        //remove('date')
      } else if (type == "assignedBy") {
        assignedByValue.value = value.length > 0 ? `&assignedBy=${value}` : "";
      } else if (type == "assignedTo") {
        assignedToValue.value = value.length > 0 ? `&assignedTo=${value}` : "";
      }
      let filter = route.query.filter ? route.query.filter : "";
      store.commit(
        "otherFilters",
        fromDateValue.value +
          toDateValue.value +
          assignedByValue.value +
          assignedToValue.value
      );
      store.dispatch("taskStatus", fromDateValue.value + toDateValue.value);
      store.dispatch(
        "tasksList",
        "?active=1" +
          store.getters.otherFilters.value +
          "&filter=" +
          filter +
          store.getters.searchTable.value +
          store.getters.orderTable.value.data
      );

      //store.dispatch('searchTasks', params.value)
    };

    const editTask = (id) => {
      emit("isEdit", {
        check: true,
        id: id,
      });
    };
    const timeLineButton = store.getters.taskRecords;
    watchEffect(() => {
      if (store.state.common.filterDateDataGet.length > 0) {
        if (timeLineButton.value == null) {
          store
            .dispatch("timeLine", {
              id: 122,
              commit: "taskDateFiletrs",
            })
            .then(() => {
              apiCall(timeLineButton.value?.taskDateFiletrs);
            });
        }
      }
    });
    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.commit(
        "otherFiButtons: store.getters.dashboardTimeLineButton,lters",
        null
      );
      //store.state.common.filter=''
    });

    function remove(event) {
      //alert(event)
      if (event == "filter") {
        if (route.query.fromDate && route.query.toDate) {
          router
            .replace({
              query: {
                view: "list",
                toDate: toDate.value,
                fromDate: route.query.fromDate,
              },
            })
            .then(() => {
              store.dispatch(
                "taskStatus",
                "?fromDate=" +
                  route.query.fromDate +
                  "&toDate=" +
                  route.query.toDate
              );
              store.dispatch(
                "tasksList",
                "?fromDate=" +
                  route.query.fromDate +
                  "&toDate=" +
                  route.query.toDate
              );
            });
        } else {
          router
            .replace({
              query: {
                view: "list",
              },
            })
            .then(() => {
              store.dispatch("tasksList");
            });
        }
      } else {
        if (route.query.filter) {
          store.dispatch("tasksList", "?filter=" + route.query.filter);
          setTimeout(() => {
            router.replace(
              {
                query: {
                  view: "list",
                  filter: route.query.filter,
                },
              },
              5000
            );
          });
        } else {
          router.replace({
            query: {
              view: "list",
            },
          });
          store.dispatch("tasksList");
        }
      }
    }
    const showButton = () => {
      apiCall(timeLineButton.value?.taskDateFiletrs);
    };
    const apiCall = (event) => {
      let filter = route.query.filter ? route.query.filter : "";
      let dateFormate = dayWeekMonthdate(event, false);
      store.commit(
        "otherFilters",
        "&fromDate=" +
          dateFormate.fromDate +
          "&toDate=" +
          dateFormate.toDate +
          assignedByValue.value +
          assignedToValue.value
      );
      store.dispatch(
        "taskStatus",
        "&fromDate=" + dateFormate.fromDate + "&toDate=" + dateFormate.toDate
      );
      store.dispatch(
        "tasksList",
        "?active=1" +
          store.getters.otherFilters.value +
          "&filter=" +
          filter +
          store.getters.searchTable.value +
          store.getters.orderTable.value.data
      );
    };
    return {
      search: store.getters.searchTable,
      exportExcel,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      size: ref([]),
      // tasksColumns,
      editTask,
      remove,
      route,
      timeStampFormate,
      globalDateFormat,
      tasksListColumns,
      handleStaffChange,
      dateRange,
      tasks,
      linkOpen,
      CompletedTasksFilterCount,
      dateFilter: store.getters.otherFilters,
      timeLineButton,
      showButton,
    };
  },
};
</script>

<style>
.tasktable {
  position: relative;
  top: 25px;
}
</style>