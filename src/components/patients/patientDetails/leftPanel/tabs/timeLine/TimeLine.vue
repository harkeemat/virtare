<template>
  <!-- <EmptyTable :text="$t('global.timeLineTab')" /> -->
  <div class="patientNotesOuter timeline">
    <div class="filterBy">
      <a-tag
        closable
        v-for="(filter, index) in filtersName"
        :key="index"
        @close="handleClose(filter)"
        >{{ filter.name }}</a-tag
      >
      <a-dropdown-button :trigger="['click']">
        Filter By
        <template #overlay>
          <a-menu class="filterMenu">
            <a-checkbox-group v-model:value="filters" @change="handleChange">
              <a-checkbox
                class="custom-checkbox"
                v-for="filter in store.state.patientsTimeLine
                  .patientsTimeLineFilter"
                :key="filter.id"
                :value="filter.id"
                >{{ filter.name }}</a-checkbox
              >
            </a-checkbox-group>
          </a-menu>
        </template>
        <template #icon>
          <CaretDownOutlined />
        </template>
      </a-dropdown-button>
      <!-- <span>Filter By</span> -->
    </div>
    <div>
      <EmptyTable
        v-if="store.state.patientsTimeLine.patientsTimeLineList.length == 0"
        :text="$t('global.timelineTab')"
      />
      <a-table
        v-if="store.state.patientsTimeLine?.patientsTimeLineList?.length > 0"
        :dataSource="store.state.patientsTimeLine.patientsTimeLineList"
        :columns="columns"
        class="common-table no-link"
        :pagination="false"
        @change="tableSorting"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'createdBy'">
            <span
              >{{ text }}
              {{ record.roleName ? "(" + record?.roleName + ")" : "" }}</span
            >
          </template>
        </template>
      </a-table>
      <Loader v-if="store.state.patientsTimeLine.patientsTimeLineLoading" />
    </div>
    <a-col
      :span="24"
      v-if="store.state.patientsTimeLine.patientsTimeLineList?.length > 0"
    >
      <Pagination
        v-if="store.state.patientsTimeLine.patientsTimeLineMeta"
        :meta="store.state.patientsTimeLine?.patientsTimeLineMeta"
        commit="PATIENTS_TIMELINE_LIST"
        :endpoint="`patientData/list/patient/${route?.params?.udid}/timeLine`"
        :params="'&type=' + typesWithString"
        loader="PATIENTS_TIMELINE_LOADING"
      />
    </a-col>
  </div>
</template>
<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Loader from "@/components/patients/Loader";
import Pagination from "@/components/pagination/Pagination";
import { tableSortingCommon } from "@/commonMethods/commonMethod";
const store = useStore();
const route = useRoute();
/**Time line filters in array*/
const filters = ref([]);
const filtersName = ref([]);
const typesWithString = ref("");
const handleClose = (removedTag) => {
  //store.state.patientsTimeLine.patientsTimeLineMeta = ''
  filtersName.value = filtersName.value.filter(
    (tag) => tag.name !== removedTag.name
  );
  const tags = filterIdModification();
  // filters.value = tags;
  typesWithString.value = tags?.length > 0 ? tags?.toString() : "";
  store.dispatch("patientsTimeLineList", {
    id: route?.params?.udid,
    filter:
      "?type=" + typesWithString.value + store.getters.orderTable.value?.data,
  });
  filters.value = filters.value.filter((tag) => tag !== removedTag.id);
  setNotesHeight();
};
const handleChange = () => {
  //store.state.patientsTimeLine.patientsTimeLineMeta = null
  typesWithString.value =
    filters.value?.length > 0 ? filters.value?.toString() : "";
  filterModification();
  store.dispatch("patientsTimeLineList", {
    id: route?.params?.udid,
    filter:
      "?type=" + typesWithString.value + store.getters.orderTable.value?.data,
  });
  setNotesHeight();
};
const filterIdModification = () => {
  let filetrsId = [];
  filtersName.value?.map((item) => {
    filetrsId.push(item.id);
  });
  return filetrsId;
};
const filterModification = () => {
  filtersName.value = [];
  store.state.patientsTimeLine.patientsTimeLineFilter.map((item) => {
    if (filters.value.includes(item.id)) {
      filtersName.value.push(item);
    }
  });
};
onMounted(async () => {
  store.dispatch("patientsTimeLineFilter");
  store.dispatch("patientsTimeLineList", {
    id: route?.params?.udid,
    filter: "?type=" + "",
  });
  //await store.dispatch("patientsTimeLineList", { id: route?.params?.udid, filter: '?type=' + '' })
});
/**
 * Set notes section height according to timeline table height
 */
const setNotesHeight = () => {
  setTimeout(() => {
    const leftTabHeight = document.querySelector(
      ".rightCollapse .ant-tabs-content-holder"
    );
    let setNotesHeight = document.querySelector(".patientNotesInner");
    setNotesHeight
      ? (setNotesHeight.style.height = leftTabHeight?.offsetHeight + "px")
      : "";
  }, 3000);
};
onUnmounted(() => {
  store.state.patientsTimeLine.patientsTimeLineList = [];
  store.state.patientsTimeLine.patientsTimeLineMeta = "";
});
const tableSorting = (pagination, filters, sorter) => {
  let filter = "&type=" + typesWithString.value;
  if (
    store.state.patientsTimeLine?.patientsTimeLineMeta?.total >
    store.state.patientsTimeLine?.patientsTimeLineMeta?.per_page
  ) {
    return tableSortingCommon(
      "PATIENTS_TIMELINE_LIST",
      `patientData/list/patient/${route?.params?.udid}/timeLine`,
      sorter,
      store.state.patientsTimeLine?.patientsTimeLineMeta,
      filter,
      "PATIENTS_TIMELINE_LOADING"
    );
  }
};

const columns = [
  {
    title: "Date And Time ",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
  },
  {
    title: "Activity",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Performed By",
    dataIndex: "createdBy",
    key: "createdBy",
  },
];
</script>

