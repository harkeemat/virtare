<template>
<a-alert class="mb-24" message="Patients are highlighted" type="error"></a-alert>
<a-table rowKey="id" :columns="communicationColumns" :data-source="meta.communicationsList" :scroll="{ x: 900,y:'calc(100vh - 350px)'}" :pagination="false" :rowClassName="(record) => auth.user.id!=record.messageSender && record.isRead==0 ? 'bold' : ''" @change="handleTableChange">

    <template #expandedRowRender="{ record }">
        <p>{{ record.message }}</p>
    </template>
    <template #from="{ record }" class="custom">
        <div v-if="record.is_sender_patient" class="customTd">
            <span v-if="arrayToObjact(screensPermissions,63) && record.fromId">
                <router-link :to="{ name: 'PatientSummary', params: { udid: record.fromId } }">
                    {{record.from}}
                </router-link>
                <a @click="showPatientModal( record.fromId)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
            </span>
            <span v-else-if="record.fromId">
                {{record.from}}
            </span>
        </div>
        <div v-else>
            <span v-if="arrayToObjact(screensPermissions,38) && record.fromId">
                <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.fromId } }">
                    {{record.from}}
                </router-link>
                <a @click="showStaffModal( record.fromId)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
            </span>
            <span v-else-if="record.fromId">
                {{record.from}}
            </span>
        </div>
    </template>

    <template #to="{ record }" class="custom">
        <div v-if="record.is_receiver_patient" class="customTd">
            <span v-if="arrayToObjact(screensPermissions,63) && record.to">
                <router-link :to="{ name: 'PatientSummary', params: { udid: record.toId } }">
                    {{record.to}}
                </router-link>
                <a @click="showPatientModal( record.toId)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
            </span>
            <span v-else>
                {{record.to}}
            </span>
        </div>
        <div v-else>
            <span v-if="arrayToObjact(screensPermissions,38) && record.toId">
                <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.toId } }">
                    {{record.to}}
                </router-link>
                <a @click="showStaffModal( record.toId)" class="nameInfoIcon">
                    <InfoCircleOutlined /></a>
            </span>
            <span v-else-if="record.toId">
                {{record.to}}
            </span>
        </div>
    </template>

    <template #resend>
        <a-tooltip placement="bottom">
            <template #title>
                <span>{{ $t("communications.message") }}</span>
            </template>
            <a class="icons">
                <EyeOutlined /></a>
        </a-tooltip>
    </template>

    <template #priority="{ record }">
        <a-tooltip placement="right">
            <template #title>{{ $t("common.urgent") }}</template>
            <span class="circleBox" style="background-color: #ff6061" v-if="record.priority == 'Urgent'"></span>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>{{ $t("common.medium") }}</template>
            <span class="circleBox" style="background-color: #ffa800" v-if="record.priority == 'Medium'"></span>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>{{ $t("common.normal") }}</template>
            <span class="circleBox" style="background-color: #008000" v-if="record.priority == 'Normal'"></span>
        </a-tooltip>
    </template>

    <template #type="{ record }">
        <a-tooltip placement="right">
            <template #title>
                <span>{{ record.type }}</span>
            </template>
            <a class="icons" v-if="record.type == 'App Message'">
                <CommentOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>
                <span>{{ record.type }}</span>
            </template>
            <a class="icons" v-if="record.type == 'App Call'">
                <PhoneOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>
                <span>{{ record.type }}</span>
            </template>
            <a class="icons" v-if="record.type == 'Email'">
                <MailOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>
                <span>{{ record.type }}</span>
            </template>
            <a class="icons" v-if="record.type == 'SMS'">
                <MobileOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="right">
            <template #title>
                <span>{{ record.type }}</span>
            </template>
            <a class="icons" v-if="record.type == 'Reminder'">
                <AlertOutlined />
            </a>
        </a-tooltip>
    </template>

    <template #action="{record}" v-if="arrayToObjact(screensPermissions,109)">
    <a-tooltip placement="bottom" v-if="record.type == 'SMS'">
            <template #title>
                <span>{{ $t("common.reply") }}</span>
            </template>
            <a class="icons" v-if="record.type == 'SMS'"  @click="showModal(record, $event)">
                <MessageOutlined />
            </a>
        </a-tooltip>
    
        <a-tooltip placement="bottom" v-else-if="record.type == 'App Message'">
            <template #title>
                <span>{{ $t("common.reply") }}</span>
            </template>
            <a class="icons" @click="showModal(record, $event)">
                <MessageOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom" v-else-if="record.type == 'Email'">
            <template #title>
                <span>{{ $t("common.reply") }}</span>
            </template>
            <a class="icons" @click="showModal(record, $event)">
                <MessageOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom" v-else>
            <template #title>
                <span>{{ $t("common.view") }}</span>
            </template>
            <a class="icons" @click="viewData(record)">
                <EyeOutlined />
            </a>
        </a-tooltip>
    </template>

</a-table>
<SmsDetails v-if="visibleSmsDetails && communicationId" v-model:visible="visibleSmsDetails" @is-visible="handleOk" :communication="communicationId" />
<SmsDetailsWithPatient v-if="visibleSmsDetailsWithPatient && communicationId" v-model:visible="visibleSmsDetailsWithPatient" @is-visible="handleOk" :communication="communicationId" />
<ReplyEmailModal v-if="visibleGmail && communicationId" v-model:visible="visibleGmail" @is-visible="handleOk" :communication="communicationId" />
<ReplyEmailWithPatientModal v-if="visibleGmailWithPatient && communicationId" v-model:visible="visibleGmailWithPatient" @is-visible="handleOk" :communication="communicationId" />
<CommunicationView v-model:visible="visibleCommunication" v-if="visibleCommunication" />
<Chat v-model:visible="visible" v-if="visible && communicationId" @ok="handleOk" @is-visible="handleOk" :communication="communicationId" />
<ChatWithPatientInformation v-model:visible="chatWithPatientInfoVisible" v-if="chatWithPatientInfoVisible && communicationId" @ok="handleOk" @is-visible="handleOk" :communication="communicationId" />
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import Chat from "@/components/modals/Chat";
import ChatWithPatientInformation from "@/components/modals/ChatWithPatientInformation";
import {
  arrayToObjact,
  showStaffModal,
  showPatientModal,
} from "@/commonMethods/commonMethod";
import ReplyEmailWithPatientModal from "@/components/modals/ReplyEmailWithPatientModal";
import ReplyEmailModal from "@/components/modals/ReplyEmailModal";
import CommunicationView from "@/components/modals/CommunicationView";
import SmsDetails from "../modal/SmsDetails"
import SmsDetailsWithPatient from "../modal/SmsDetailsWithPatient"
import {
  EyeOutlined,
  MessageOutlined,
  MobileOutlined,
  CommentOutlined,
  PhoneOutlined,
  MailOutlined,
  AlertOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from "vue-router";
export default {
  components: {
    EyeOutlined,
    MessageOutlined,
    MobileOutlined,
    CommentOutlined,
    PhoneOutlined,
    MailOutlined,
    AlertOutlined,
    ReplyEmailWithPatientModal,
    ReplyEmailModal,
    CommunicationView,
    Chat,
    ChatWithPatientInformation,
    InfoCircleOutlined,
    SmsDetails,
    SmsDetailsWithPatient,
  },
  props: {},
  setup() {
    const communicationColumns = [
      {
        title: "From",
        dataIndex: "from",
        key: "from",
        sorter: true,
        slots: {
          customRender: "from",
        },
      },
      {
        title: "To",
        dataIndex: "to",
        key: "to",
        sorter: true,
        slots: {
          customRender: "to",
        },
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        slots: {
          customRender: "type",
        },
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
        slots: {
          customRender: "priority",
        },
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        sorter: {
          compare: (a, b) => a.category - b.category,
          multiple: 2,
        },
      },
      {
        title: "Last Update",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: {
          compare: (a, b) => a.createdAt - b.createdAt,
          multiple: 2,
        },
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        slots: {
          customRender: "action",
        },
      },
    ];
    const store = useStore();
    const route = useRoute();
    const visibleGmail = ref(false);
    const visibleGmailWithPatient = ref(false);
    const visibleCommunication = ref(false);
    const communicationId = ref(null);
    const auth = JSON.parse(localStorage.getItem("auth"));
    const meta = store.getters.communicationRecord.value;
    const visible = ref(false);
    const chatWithPatientInfoVisible = ref(false);
    const visibleSmsDetails = ref(false)
    const visibleSmsDetailsWithPatient = ref(false)
    let data = [];

    watchEffect(() => {
      if (meta.communicationsList) {
        meta.communicationsList.forEach((element) => {
          if (route.params.typeId == element.id) {
            communicationId.value = element;
          }
        });
      }
      if (route.params.from == "push" && communicationId.value != null) {
        if (
          communicationId.value.is_receiver_patient ||
          communicationId.value.is_sender_patient
        ) {
          chatWithPatientInfoVisible.value = true;
          visible.value = false;
        } else if (
          !communicationId.value.is_receiver_patient &&
          !communicationId.value.is_sender_patient
        ) {
          visible.value = true;
          chatWithPatientInfoVisible.value = false;
        }
      }
    });

    let scroller = "";
    onMounted(() => {
      var tableContent = document.querySelector(".ant-table-body");
      tableContent?.addEventListener("scroll", (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;
        if (currentScroll >= maxScroll) {
          let current_page = meta.communicationMeta.current_page + 1;

          if (current_page <= meta.communicationMeta.total_pages) {
            scroller = maxScroll;
            data = meta.communicationsList;
            meta.communicationMeta = "";
            store
              .dispatch(
                "communicationsList",
                "?page=" +
                  current_page +
                  store.getters.searchTable.value +
                  store.getters.orderTable.value.data
              )
              .then(() => {
                loadMoredata(tableContent);
              });
          }
        }
      });
    });

    function loadMoredata(tableContent) {
      const newData = meta.communicationsList;

      newData.forEach((element) => {
        data.push(element);
      });
      meta.communicationsList = data;
      setTimeout(() => {
        tableContent.scrollTo(0, scroller);
      }, 50);
    }
    const handleTableChange = (pag, filters, sorter) => {
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
          "communicationsList",
          "?page=" + store.getters.searchTable.value + orderParam
        );
      } else {
        store.dispatch("orderTable", {
          data: "&orderField=&orderBy=",
        });
        store.dispatch(
          "communicationsList",
          "?page=" +
            store.getters.searchTable.value +
            store.getters.orderTable.value.data
        );
      }
    };
    const showModal = (e, event) => {
      if (e.type == "App Message") {
        store.commit("loadingStatus", true);
        setTimeout(() => {
          if (e.is_receiver_patient || e.is_sender_patient) {
            chatWithPatientInfoVisible.value = true;
          } else {
            visible.value = true;
          }
          store.commit("loadingStatus", false);
          communicationId.value = e;
          event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
            "bold"
          );
        }, 3000);
      }
      else if(e.type == "Email") {
        communicationId.value = e;
        store.commit("loadingStatus", true);
        store.dispatch("communicationsView", e.id)
        setTimeout(() => {
          if (e.is_receiver_patient || e.is_sender_patient) {
            visibleGmailWithPatient.value = true;
          }
          else {
            visibleGmail.value = true;
          }
          store.commit("loadingStatus", false);
          event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
            "bold"
          );
        }, 3000);
      }
      else if(e.type == "SMS") {
        communicationId.value = e;
        store.commit("loadingStatus", true);
        store.dispatch("showSmsData", e.id)
        setTimeout(() => {
          if (e.is_receiver_patient || e.is_sender_patient) {
            visibleSmsDetailsWithPatient.value = true;
          }
          else {
            visibleSmsDetails.value = true;
          }
          store.commit("loadingStatus", false);
          event.target.parentElement.parentElement.parentElement.parentElement.classList.remove(
            "bold"
          );
        }, 3000);
      }
      else {
        communicationId.value = e;
        store.dispatch("communicationsView", e.id).then(() => {
          visibleGmail.value = true;
        });
      }
    };

    const viewData = (e) => {
      store.dispatch("callDetails", e.id).then(() => {
        visibleCommunication.value = true;
      });
    };

    const handleOk = (value) => {
      visible.value = value ? value : false;
      visibleGmail.value = value ? value : false;
      visibleSmsDetails.value = value ? value : false;
      visibleSmsDetailsWithPatient.value = value ? value : false;
      chatWithPatientInfoVisible.value = value ? value : false;
    };

    return {
      visibleSmsDetails,
      visibleSmsDetailsWithPatient,
      // showSms,
      showPatientModal,
      showStaffModal,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      communicationColumns,
      meta,
      visible,
      showModal,
      handleOk,
      communicationId,
      auth,
      handleTableChange,
      viewData,
      visibleGmail,
      visibleGmailWithPatient,
      visibleCommunication,
      chatWithPatientInfoVisible,
    };
  },
};
</script>

<style>
.customTd {
  display: block;
  background-color: rgb(255 250 96);
  width: 100%;
  height: 100%;
  padding: 7px;
}

.highLight {
  color: red;
}

.ant-table-wrapper
  .ant-table
  .ant-table-content
  .ant-table-body
  .ant-table-tbody
  tr
  td {
  white-space: normal !important;
}
.anticon-mobile svg {
  fill: #000;
  font-size: 22px;
}
</style>
