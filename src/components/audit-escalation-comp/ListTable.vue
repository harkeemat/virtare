<template>
  <div class="">
    <a-table class="sortIconTable"  rowKey="staffId" :scroll="{x: 1500, y: 'calc(100vh - 300px)' }" :columns="columnData"
      :data-source="escalationMainList" @change="handleTableChange" :pagination="false">
      <template #patientName="{ record }" v-if="arrayToObjact(screensPermissions, 405)">
        <!-- <router-link v-if="record.patient?.id " :to="{ name: 'PatientSummary', params: { udid: record.patient?.id } }">{{ record.patient.fullName?.length>12?record.patient?.fullName.substring(0,15)+'...':record.patient?.fullName}}</router-link> -->
        <a @click="showPatientModal(record.patient?.id)" class="nameInfoIcon"
          v-if="record.patient?.id && record.patient?.fullName">
          <!-- <InfoCircleOutlined /> -->
          {{
            record.patient.fullName?.length > 20
              ? record.patient?.fullName.substring(0, 20) + "..."
              : record.patient?.fullName
          }}
        </a>
      </template>
      <template #patientName="{ record }" v-else>
        <span>{{
          record.patient.fullName?.length > 20
          ? record.patient?.fullName.substring(0, 20) + "..."
          : record.patient?.fullName
          }}</span>
      </template>
      <template #assignedBy="{ record }" v-if="arrayToObjact(screensPermissions, 408)">
        <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedBy?.id } }">{{ record.assignedBy.fullName.length>12?record.assignedBy.fullName.substring(0,10)+'...':record.assignedBy.fullName }}</router-link> -->
        <a v-if="record.assignedBy && record.assignedBy?.fullName" @click="showStaffModal(record.assignedBy.id)"
          class="nameInfoIcon">
          <!-- <InfoCircleOutlined /> -->
          {{
            record.assignedBy.fullName?.length > 20
              ? record.assignedBy?.fullName.substring(0, 200) + "..."
              : record.assignedBy?.fullName
          }}
        </a>
      </template>
      <template #assignedBy="{ record }" v-else>
        <span>{{
          record.assignedBy.fullName?.length > 20
          ? record.assignedBy?.fullName.substring(0, 200) + "..."
          : record.assignedBy?.fullName
          }}</span>
      </template>
      <template #escalationAssignedTo="{ record }" v-if="arrayToObjact(screensPermissions, 419)">
        <a v-if="
          record.escalationAssignTo?.length > 0 &&
          record.escalationAssignTo[0]?.staff.fullName
          " @click="showDetails(record.escalationAssignTo)">{{
          record.escalationAssignTo[0]?.staff.fullName.substring(0, 20) +
            "..."
          }}</a>
      </template>
      <template #escalationType="{ record }">
        <span>{{ record.type }}</span>
      </template>
      <template #closeLoop="{ record }" v-if="arrayToObjact(screensPermissions, 420)">
        <a-button v-if="record?.status == 'Responded' && record?.escalationClose == ''" class="btn primary"
          type="primary" @click="closeLoop(record.id)">{{ "Open" }}</a-button>
        <a-tooltip placement="bottom" v-else-if="record?.escalationClose != ''">
          <template #title>
            <span>{{ record?.escalationClose?.description }}</span>
          </template>
          <a-tag color="red">Closed</a-tag>
        </a-tooltip>
      </template>
      <template #takenAction="{ record }">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{ record.escalationAction[0]?.note }}</span>
          </template>
          <span class="icons">
            {{ record.escalationAction[0]?.action }}
          </span>
        </a-tooltip>
      </template>
      <template #reason="{ record }">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{ record.reason }}</span>
          </template>
          <a class="icons">
            {{
              record.reason?.length > 30
                ? record.reason.substring(0, 30) + "..."
                : record.reason
            }}
          </a>
        </a-tooltip>
      </template>
      <template #description="{ record }">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{ record?.escalationAuditDescription.description }}</span>
          </template>
          <span class="icons">
            {{
              record?.escalationAuditDescription.description?.length > 20
                ? record?.escalationAuditDescription.description.substring(
                  0,
                  30
                ) + "..."
                : record?.escalationAuditDescription.description
            }}
          </span>
        </a-tooltip>
      </template>
      <template #action="{ record }" v-if="arrayToObjact(screensPermissions, 404)">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{ "Add Note" }}</span>
          </template>
          <!-- <a-button  class="btn primary" type="primary" @click="closeLoop(record.id)">{{'+ Add'}}</a-button> -->
          <a class="icons-action" v-if="!record?.escalationAuditDescription.description"
            @click="closeLoop(record.id)">
            <PlusCircleTwoTone style="font-size: 20px" />
        </a>
        <a class="icons-action" v-else :disabled="record?.escalationAuditDescription.description">
            <PlusCircleTwoTone style="font-size: 20px" />
        </a>
        </a-tooltip>

        <a-tooltip placement="bottom" @click="showAudit(record.id)">
          <template #title>
            <span>{{ "View" }}</span>
          </template>
          <a class="icons">
            <EyeOutlined style="font-size: 20px"/>
          </a>
        </a-tooltip>
      </template>
    </a-table>
  </div>
  <ViewDetails :arrayData="escalationAssignToData" v-if="viewModal" v-model:visible="viewModal" />
  <CloseLoop v-if="closeLoopModal" title="Add Note" v-model:visible="closeLoopModal" :escalationId="escalationId"
    @closeModal="closeModal($event)" />
</template>
<script>
import { EyeOutlined, PlusCircleTwoTone } from "@ant-design/icons-vue";
import { defineComponent, onMounted, ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  arrayToObjact,
  showPatientModal,
  showStaffModal,
} from "@/commonMethods/commonMethod";
const columnData = [
  {
    title: "Patient",
    dataIndex: "patientName",
    sorter: true,
    slots: {
      customRender: "patientName",
    },
  },
  {
    title: "Type",
    dataIndex: "escalationType",
    sorter: true,
    slots: {
      customRender: "escalationType",
    },
  },
  {
    title: "Date",
    dataIndex: "createdAt",
  },
  {
    title: "Created By",
    dataIndex: "assignedBy",
    sorter: true,
    slots: {
      customRender: "assignedBy",
    },
  },
  {
    title: "Send To",
    dataIndex: "assignedTo",
    sorter: true,
    slots: {
      customRender: "escalationAssignedTo",
    },
  },
  {
    title: "Reason",
    dataIndex: "reason",
    sorter: true,
    slots: {
      customRender: "reason",
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: true,
    slots: {
      customRender: "status",
    },
  },

  {
    title: "Action Taken ",
    dataIndex: "takenAction",
    sorter: true,
    slots: {
      customRender: "takenAction",
    },
  },

  {
    title: "Loop Closed",
    dataIndex: "closeLoop",
    slots: {
      customRender: "closeLoop",
    },
  },

  {
    title: "Description",
    dataIndex: "description",
    slots: {
      customRender: "description",
    },
  },

  {
    title: "Final Report",
    dataIndex: "action",
    slots: {
      customRender: "action",
    },
  },
];
export default defineComponent({
  name: "EscalationTable",
  components: {
    EyeOutlined,
    PlusCircleTwoTone,
    ViewDetails: defineAsyncComponent(() =>
      import("@/components/escalations/ViewDetails.vue")
    ),
    CloseLoop: defineAsyncComponent(() =>
      import("@/components/escalations/CloseLoop.vue")
    ),
  },
  props: {
    otherParam: String,
    height: Number,
    islimit: Number,
  },
  setup(props, { emit }) {
    const store = useStore();
    let data = [];
    const authUser = ref();
    const viewModal = ref(false);
    const closeLoopModal = ref(false);
    const escalationId = ref();
    const escalationAssignToData = ref();
    const meta = store.getters.escalationAuditMeta;
    const escalationMainList = store.getters.escalationAudit;
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
                "escalationAudit",
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
        });
      } else {
        emit("showEscalationData", {
          value: true,
          type: type,
          id: id,
        });
      }
      store.dispatch("singleEscalationRecord", id);
      // store.dispatch("escalationDelete", id);
      store.dispatch("patientDetails", pId);

      store.dispatch("devices", pId).then((resp) => {
        if (resp == true) {
          store.dispatch("patientVitals", {
            patientId: pId,
            deviceType: 99,
            filter: "",
          });
          store.dispatch("patientVitals", {
            patientId: pId,
            deviceType: 100,
            filter: "",
          });
          store.dispatch("patientVitals", {
            patientId: pId,
            deviceType: 101,
            filter: "",
          });
        }
      });
    };
    const handleTableChange = (pag, filters, sorter) => {
      checkDate();
      let islimit = props.islimit ? "&islimit=" + props.islimit : "&islimit=";
      let otherParam = props.otherParam ? props.otherParam : "";
      if (sorter?.order) {
        let order = sorter?.order == "ascend" ? "ASC" : "DESC";
        let orderParam = "&orderField=" + sorter?.field + "&orderBy=" + order;
        store.dispatch("orderTable", {
          data: orderParam,
          orderBy: order,
          page: pag,
          filters: filters,
        });
        store.dispatch(
          "escalationAudit",
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
          "escalationAudit",
          "?page=" +
          store.getters.searchTable?.value +
          store.getters.orderTable?.value.data +
          otherParam +
          dateFilter +
          filter +
          store.getters.orderTable?.value.data +
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

    function closeLoop(id) {
      closeLoopModal.value = true;
      escalationId.value = id;
    }

    function closeModal(value) {
      closeLoopModal.value = value;
    }

    return {
      columnData,
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

.icons-action {
  margin-right: 15px;
}
</style>
