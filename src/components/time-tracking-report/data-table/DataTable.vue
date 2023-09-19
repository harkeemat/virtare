<template>
<a-row>
    <a-col :span="8" style="padding-bottom:15px" v-if="!selectedRowKeys?.length>0">
    <a-row :span="24" v-if="arrayToObjact(screensPermissions, 411)">
      <a-col :span="24">
        <SearchField endPoint="cptCodes"  />
        </a-col>
    </a-row>
    </a-col>
    <a-col :span="8" style="padding-bottom:15px" v-else>
    <a-row :span="24" v-if="arrayToObjact(screensPermissions, 412)">
      <a-col :span="18">
        <GlobalCodeDropDown  ref="formRef" v-model:value="status" :dataId="68" @handleGlobalChange="handleGlobalChange($event)" placeholder="Please select status" />
    </a-col>
    <a-col :span="2">
        <div class="button-left">
            <a-button :disabled="!status || checkStatus?.length>1" class="blueBtn" @click="submitStatus">Submit</a-button>
        </div>
    </a-col>
        
    </a-row>
      
    </a-col>
    <a-col :span="16" v-if="arrayToObjact(screensPermissions, 413)">
        <div class="text-right mb-24">
            <ExportToExcel @click="exportExcel('cptBilling_report',filters)" />
        </div>
    </a-col>
</a-row>
<a-row style="padding-bottom:15px" v-show="selectedRowKeys?.length>0">
    <!-- <a-col :span="6">
        <GlobalCodeDropDown v-model:value="status" :globalCode="reportStatus" placeholder="Please select status" />
    </a-col>
    <a-col :span="6">
        <div class="button-left">
            <a-button :disabled="!status" class="blueBtn" @click="submitStatus">Submit</a-button>
        </div>
    </a-col> -->
</a-row>
<ErrorMessage v-if="checkStatus?.length>1" name="Please select record of same status." />
<a-table class="sortIconTable" rowKey="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="column" :data-source="dataList" :scroll="{ x: 1500,y:'calc(100vh - 390px)' }" :pagination="false" @change="handleTableChange">
    
    <template #serviceId="{ record }" v-if="arrayToObjact(screensPermissions, 414)">
        <a><span @click="showReportData(record.id)">{{record.serviceId}}</span></a>
    </template>
    <template #patient="{ record }" >
    <router-link v-if="arrayToObjact(screensPermissions, 65) && record.patient.id " :to="{ name: 'PatientSummary', params: { udid: record.patient.id },query:{filter:filter} }">{{ record.patient.fullName.length>12?record.patient.fullName.substring(0,12)+'...': record.patient.fullName}}</router-link>
    <a @click="showPatientModal( record.patient.id)" v-if="arrayToObjact(screensPermissions, 65)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
    <span v-else>{{record.patient.fullName }}</span>
    </template>
    <template #typeOfService="{ record }">
        <!-- <span>{{record.typeOfService.name}} </span> -->
        <a-tooltip placement="bottom">
            <template #title>
                <span>{{record.typeOfService.name}}</span>
            </template>
            <span>{{record.typeOfService.name}}</span>
        </a-tooltip>
        <!-- <p>{{record.device?.length>0?record.device[0]?.deviceType:record.vital[0]?.deviceType}}</p> -->
    </template>
    <template #condition="{ record }" v-if="arrayToObjact(screensPermissions, 414)">
        <a><span @click="showModal(record.condition)">{{record.condition[0]?.code?record.condition[0]?.code+', ...':''}}</span></a>
    </template>
    <template #cptCode="{ record }">
        <span>{{record.cptCode.name}}</span>
    </template>
    <template #billingAmout="{ record }">
        <span>{{record.cptCode.billingAmout}}</span>
    </template>
    <template #placeOfService="{ record }">
        <span>{{record.placeOfService.name}}</span>
    </template>
    <template #status="{ record }">
        <span>{{record.status.name}}</span>
    </template>

    <template #TotalFee="{record}">
        <span>{{(record.cptCode.billingAmout * record.numberOfUnit).toFixed(2)}}</span>
    </template>
    <template #patientReferral="{record}">
        <a-tooltip placement="bottom">
            <template #title>
              <span>{{record?.patient?.patientReferral?.name}}</span>
            </template>
            <span>{{record?.patient?.patientReferral?.name}}</span>
        </a-tooltip>
    </template>
    <template #patientReferralProviderName="{ record }">
      <span>{{record?.patient?.patientReferralProviderName}}</span>
    </template>
    <!-- <template #action="{record}">
        <a-tooltip placement="bottom" @click="showReportData(record.id)">
            <template #title>
                <span>{{ 'View' }}</span>
            </template>
            <a class="icons">
                <EyeOutlined /></a>
        </a-tooltip>
    </template> -->
</a-table>
<TableLoader />
<RecordView v-model:visible="reportViewModal" />
<ConditionView v-model:visible="conditionViewModal" :conditionsData="conditionsData"/>
</template>

<script>
import {
  ref,
  onMounted,
  defineComponent,
  defineAsyncComponent,
  computed,
  toRefs,
  reactive,
} from "vue";
import { useStore } from "vuex";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import SearchField from "@/components/common/input/SearchField";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import {exportExcel,showPatientModal,arrayToObjact} from "@/commonMethods/commonMethod";
import TableLoader from "@/components/loader/TableLoader";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
const column = [
  {
    title: "#",
    dataIndex: "serviceId",
    align: "center",
    width: "80px",
    slots: {
      customRender: "serviceId",
    },
  },
  {
    title: "Patient Name",
    dataIndex: "patient",
    sorter: true,
    slots: {
      customRender: "patient",
    },
    width: "12%",
  },
  {
    title: "Place of Service",
    dataIndex: "placeOfService",
    slots: {
      customRender: "placeOfService",
    },
    width: "11%",
  },
  {
    title: "ICD 10 Code",
    dataIndex: "condition",
    slots: {
      customRender: "condition",
    },
    width: "9%",
  },
  {
    title: "Date of Service",
    dataIndex: "billingDate",
    sorter: true,
    width: "12%",
  },
  
  {
    title: "Type of Service",
    dataIndex: "typeOfService",
    slots: {
      customRender: "typeOfService",
    },
    sorter: true,
    width: "12%",
  },
  {
    title: "CPT Code",
    dataIndex: "cptCode",
    sorter: true,
    slots: {
      customRender: "cptCode",
    },
    align: "right",
    width: "9%",
  },
  {
    title: "#Units",
    dataIndex: "numberOfUnit",
    align: "right",
    width: "8%",
  },
  {
    title: "Fee($)",
    dataIndex: "billingAmout",
    slots: {
      customRender: "billingAmout",
    },
    align: "right",
    width: "8%",
  },
  {
    title: "Total Fee($)",
    slots: {
      customRender: "TotalFee",
    },
    align: "right",
    width: "10%",
  },
  {
    title: "Status",
    dataIndex: "status",
    slots: {
      customRender: "status",
    },
    width: "8%",
  },
  {
    title: "Name of Referral",
    dataIndex: "patientReferral",
    slots: {
      customRender: "patientReferral",
    },
    width: "10%",
    sorter: true,
  },
  {
    title: "Referral Provider",
    dataIndex: "patientReferralProviderName",
    slots: {
      customRender: "patientReferralProviderName",
    },
    width: "8%",
  },
];
export default defineComponent({
  components: {
    ErrorMessage,
    TableLoader,
    InfoCircleOutlined,
    GlobalCodeDropDown,
    ExportToExcel,
    SearchField,
    RecordView: defineAsyncComponent(() => import("../modals/ReportView")),
    ConditionView: defineAsyncComponent(() => import("../modals/ConditionsView.vue")),
  },
  setup() {
    const store = useStore();
    const reportViewModal = ref();
    const state = reactive({
      selectedRowKeys: [],
    });
    const formRef = ref();
    const status = ref();
    const conditionViewModal = ref(false)
    const conditionsData = ref()
    let data = [];
    const meta = store.getters.cptCodesMeta;
    const dataList = store.getters.cptCodes;
    const route = useRoute();
    let dateFilter = "";
    let filter = "";

    function checkDate() {
      filter = route.query.filter
        ? "&filter=" + route.query.filter
        : "&filter=";
      dateFilter =
        route.query.fromDate && route.query.toDate
          ? "?fromDate=" +
            route.query.fromDate +
            "&toDate=" +
            route.query.toDate
          : store.getters.cptCodeFilterDates.value;
    }
    let scroller = "";
    onMounted(() => {
      
      var tableContent = document.querySelector(".ant-table-body");
      tableContent?.addEventListener("scroll", (event) => {
        checkDate();
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;
        if (currentScroll >= maxScroll) {
          let current_page = meta.value.current_page + 1;

          if (current_page <= meta.value.total_pages) {
            scroller = maxScroll;
            data = dataList.value;

            store.state.reports.cptCodesMeta = "";

            store
              .dispatch(
                "cptCodes",
                dateFilter
                +"&page=" +
                  current_page +
                  
                  filter +
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
          "cptCodes",
          dateFilter +
            store.getters.searchTable.value +
            
            filter +
            orderParam
        );
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch(
          "cptCodes",
          dateFilter +
            store.getters.searchTable.value +
            store.getters.orderTable.value.data +
            
            filter +
            store.getters.orderTable.value.data
        );
      }
    };

    function loadMoredata() {
      const newData = dataList.value;
      newData.forEach((element) => {
        data.push(element);
      });

      store.state.reports.cptCodes = data;
      var tableContent = document.querySelector(".ant-table-body");

      setTimeout(() => {
        tableContent.scrollTo(0, scroller);
      }, 50);
    }
    function showReportData(id) {
      store.dispatch("reportDetailList", id);
      reportViewModal.value = true;
    }
    let statusArray =[]
    const checkStatus = ref([])
    const onSelectChange = (selectedRowKeys,selectedRows) => {
      statusArray = selectedRows.map((item)=>item.status.name)
      checkStatus.value = statusArray.filter(function(item, pos) {
        return statusArray.indexOf(item) == pos;
      })
      if(!selectedRowKeys.length>0){
        status.value = null
      }
      state.selectedRowKeys = selectedRowKeys;
      
    };



    const reportStatus = computed(() => {
      return store.state.common.CPTCodeStatus;
    });
    const submitStatus = () => {
      if (status.value && state.selectedRowKeys) {
        store
          .dispatch("cptCodeStatusUpdate", {
            status: status.value,
            CPTCodeId: state.selectedRowKeys,
          })
          .then((resp) => {
            if (resp == true) {
              (status.value = null)
              checkDate();
                // store.dispatch("cptCodes");
                store
              .dispatch(
                "cptCodes",

                dateFilter+
                  filter +
                  // store.getters.searchTable.value +
                  store.getters.orderTable.value.data
              )
              setTimeout(() => {
                state.selectedRowKeys = [];
              }, 1000);
            }
          });
      }
    };

     const showModal = (data) =>{
       conditionViewModal.value = true
       conditionsData.value = data
     }

    const handleGlobalChange = (data) =>{
        status.value = data
    }
    
    return {
      handleGlobalChange,
      checkStatus,
      arrayToObjact,
      showPatientModal,
      formRef,
      exportExcel,
      conditionsData,
      conditionViewModal,
      showModal,
      onSelectChange,
      submitStatus,
      status,
      reportStatus,
      ...toRefs(state),
      loadMoredata,
      handleTableChange,
      reportViewModal,
      showReportData,
      column,
      dataList,
      filters:store.getters.cptCodeFilterDates,
      search: store.getters.searchTable,
      screensPermissions:store.getters.screensPermissions
    };
  },
});
</script>

<style>
</style>
