<template>
<div class="">
    <a-table rowKey="id" :columns="columnData" :data-source="escalationMainList" style="width:100%" :pagination="false" @change="handleTableChange" :scroll="height? {y: height } : { x: 900,y:'calc(100vh - 290px)'}">
        <template #patientName="{ record }" v-if="arrayToObjact(screensPermissions, 405)">
            <!-- <router-link v-if="record.patient?.id " :to="{ name: 'PatientSummary', params: { udid: record.patient?.id } }">{{ record.patient.fullName?.length>12?record.patient?.fullName.substring(0,15)+'...':record.patient?.fullName}}</router-link> -->
            <a @click="showPatientModal(record.patient?.id)" class="nameInfoIcon" v-if="record.patient?.id && record.patient?.fullName">
                <!-- <InfoCircleOutlined /> -->
                {{ record.patient.fullName?.length>20?record.patient?.fullName.substring(0,20)+'...':record.patient?.fullName}}
            </a>
        </template>
        <template #patientName="{ record }" v-else>
           <span>{{ record.patient.fullName?.length>20?record.patient?.fullName.substring(0,20)+'...':record.patient?.fullName}}</span>
        </template>
  
        <template #assignedBy="{ record }" v-if="arrayToObjact(screensPermissions, 408)">
            <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedBy?.id } }">{{ record.assignedBy.fullName.length>12?record.assignedBy.fullName.substring(0,10)+'...':record.assignedBy.fullName }}</router-link> -->
            <a v-if="record.assignedBy && record.assignedBy?.fullName" @click="showStaffModal(record.assignedBy.id)" class="nameInfoIcon">
                <!-- <InfoCircleOutlined /> -->
                {{ record.assignedBy.fullName?.length>20?record.assignedBy?.fullName.substring(0,200)+'...':record.assignedBy?.fullName }}
            </a>
        </template>

        <template #assignedBy="{ record }" v-else>
          <span>{{ record.assignedBy.fullName?.length>20?record.assignedBy?.fullName.substring(0,200)+'...':record.assignedBy?.fullName }}</span>
        </template>

        <template #escalationAssignedTo="{ record }" v-if="arrayToObjact(screensPermissions, 419)">
            <a v-if="record.escalationAssignTo?.length>0 && record.escalationAssignTo[0]?.staff.fullName" @click="showDetails(record.escalationAssignTo)">{{record.escalationAssignTo[0]?.staff.fullName.substring(0,20)+'...'}}</a>
        </template>

        <template #escalationType="{ record }">
            <span>{{record.type}}</span>
        </template>
        <template #closeLoop="{record}" v-if="arrayToObjact(screensPermissions, 420)">
            <a-button v-if="record?.status =='Responded' && record?.escalationClose==''" class="btn primary" type="primary" @click="closeLoop(record.id)">{{'Open'}}</a-button>
            <a-tooltip placement="bottom" v-else-if="record?.escalationClose!=''">
                <template #title>
                  <span>{{record?.escalationClose?.description}}</span>
                </template>
                <a-tag color="red" >Closed</a-tag>
            </a-tooltip>
            
        </template>
        <template #takenAction="{ record }">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{record.escalationAction[0]?.note}}</span>
                </template>
                <span class="icons">
                  {{ record.escalationAction[0]?.action}}
                </span>
            </a-tooltip>
        </template>
        <template #reason="{ record }">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{record.reason}}</span>
                </template>
                <span class="icons">
                    {{record.reason?.length>30?record.reason.substring(0,30)+'...':record.reason}}
                </span>
            </a-tooltip>
        </template>
        <template #audit="{record}" v-if="arrayToObjact(screensPermissions, 418)">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{'Audit Data'}}</span>
                </template>
                <a class="icons" @click="showAudit(record.id)">
                    <!-- <FileTextOutlined /> -->
                    <FileTextOutlined />
                </a>
            </a-tooltip>
        </template>
        <template #action="{record}" v-if="arrayToObjact(screensPermissions, 404)">
            <a-tooltip placement="bottom" @click="showEscalationData(record.id,'view', record.patient.id)">
                <template #title>
                    <span>{{ 'View' }}</span>
                </template>
                <a class="icons">
                    <EyeOutlined />
                </a>
            </a-tooltip>
        </template>
    </a-table>
</div>
<ViewDetails :arrayData="escalationAssignToData" v-if="viewModal" v-model:visible="viewModal" />
<CloseLoop v-if="closeLoopModal" v-model:visible="closeLoopModal" :escalationId="escalationId" @closeModal="closeModal($event)" />
</template>
<script>
  import {
    EyeOutlined,
    FileTextOutlined,
    // InfoCircleOutlined
  } from "@ant-design/icons-vue";
  import { defineComponent, onMounted, ref, defineAsyncComponent } from "vue";
  import { useStore } from "vuex";
  // import Flags from "@/components/common/flags/Flags";
  // import ViewDetails from "@/components/escalations/ViewDetails.vue";
  import { useRoute } from "vue-router";
  import {
    arrayToObjact,
    showPatientModal,
    showStaffModal,
  } from "@/commonMethods/commonMethod";
  export default defineComponent({
    name: "EscalationTable",
    components: {
      EyeOutlined,
      FileTextOutlined,
      // StopOutlined,
      // Flags,
      // InfoCircleOutlined,
      ViewDetails: defineAsyncComponent(() =>
        import("@/components/escalations/ViewDetails.vue")
      ),
      CloseLoop: defineAsyncComponent(() =>
        import("@/components/escalations/CloseLoop.vue")
      ),
    },
    props: {
      columnData: Array,
  
      otherParam: String,
      patientId:String,
      height: Number,
      islimit: Number,
    },
    setup(props, { emit }) {
      const store = useStore();
      let data = [];
      const authUser = ref();
      const viewModal = ref(false);
      const closeLoopModal = ref(false);
      const escalationId = ref()
      const escalationAssignToData = ref();
      const meta = store.getters.escalationMeta;
      const escalationMainList = store.getters.escalation;
      const route = useRoute();
      let dateFilter = "";
      let filter = "";
  
      function checkDate() {
        filter = route.query.filter
          ? "&filter=" + route.query.filter
          : "&filter=";
        dateFilter =
          route.query.fromDate && route.query.toDate
            ? "&fromDate=" +
              route.query.fromDate +
              "&toDate=" +
              route.query.toDate
            : store.getters.dateFilter.value
            ? "&fromDate=" +
              store.getters.dateFilter.value.fromDate +
              "&toDate=" +
              store.getters.dateFilter.value.toDate
            : "&fromDate=&toDate=";
      }
      let scroller = "";
      onMounted(() => {
        authUser.value = JSON.parse(localStorage.getItem("auth"));
        checkDate();
        var tableContent = document.querySelector(".ant-table-body");
        tableContent?.addEventListener("scroll", (event) => {
          let maxScroll = event.target.scrollHeight - event.target.clientHeight;
          let currentScroll = event.target.scrollTop + 2;
          if (currentScroll >= maxScroll) {
            let current_page = meta.value.current_page + 1;
  
            if (current_page <= meta.value.total_pages) {
              scroller = maxScroll;
              data = escalationMainList.value;
  
              store.state.escalations.escalationMeta = "";
  
              store
                .dispatch(
                  "escalation",
                  "?page=" +
                    current_page +
                    dateFilter +
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
    
      function loadMoredata() {
        const newData = escalationMainList.value;
        newData.forEach((element) => {
          data.push(element);
        });
        store.state.escalations.escalation = data;
        var tableContent = document.querySelector(".ant-table-body");
        setTimeout(() => {
          tableContent?.scrollTo(0, scroller);
        }, 50);
      }
  
      const showEscalationData = (id, type, pId) => {
        if (type == "view") {
          emit("showEscalationData", {
            value: true,
            type: type,
            id: id,
            patientId:pId
          });
        } else {
          emit("showEscalationData", {
            value: true,
            type: type,
            id: id,
            patientId:pId
          });
        }
        
        store.dispatch("singleEscalationRecord", id);
        // store.dispatch("escalationDelete", id);
        store.dispatch("patientDetails", pId);
  
        // store.dispatch("devices", pId).then((resp) => {
        //   if (resp == true) {
        //     store.dispatch("patientVitals", {
        //       patientId: pId,
        //       deviceType: 99,
        //       filter: "",
        //     });
        //     store.dispatch("patientVitals", {
        //       patientId: pId,
        //       deviceType: 100,
        //       filter: "",
        //     });
        //     store.dispatch("patientVitals", {
        //       patientId: pId,
        //       deviceType: 101,
        //       filter: "",
        //     });
        //   }
        // });
      };
      const handleTableChange = (pag, filters, sorter) => {
        checkDate();
        let islimit = props.islimit ? "&islimit=" + props.islimit : "&islimit=";
        let otherParam = props.otherParam ? props.otherParam : "";
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
            "escalation",
            "?page=" +
              store.getters.searchTable.value +
              dateFilter +
              filter +
              orderParam +
              otherParam +
              islimit
          );
        } else {
          store.dispatch("orderTable", {
            data: "&orderField=&orderBy=",
          });
          store.dispatch(
            "escalation",
            "?page=" +
              store.getters.searchTable.value +
              store.getters.orderTable.value.data +
              otherParam +
              dateFilter +
              filter +
              store.getters.orderTable.value.data +
              islimit
          );
        }
      };
  
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
  
      function showAudit(id) {
        store.dispatch("getAuditData", id).then((resp) => {
          if (resp == true) {
            viewModal.value = true;
            escalationAssignToData.value = null;
          }
        });
      }
  
      function closeLoop (id) {
        closeLoopModal.value = true;
        escalationId.value =id
      }

      function closeModal(value){
        closeLoopModal.value =value
      }
  
      return {
        closeModal,
        escalationId,
        closeLoopModal,
        closeLoop,
        showAudit,
        escalationAssignToData,
        showDetails,
        viewModal,
        authUser,
        showStaffModal,
        showPatientModal,
        arrayToObjact,
        escalationMainList,
        loadMoredata,
        handleTableChange,
        showEscalationData,
        screensPermissions: store.getters.screensPermissions,
        
      };
    },
  });
  </script>
  
  <style lang="scss">
  .icon {
    svg {
      font-size: 26px;
    }
  }
  </style>