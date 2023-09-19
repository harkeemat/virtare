<template>
  <div>
    <a-layout-header>
      <div class="header-wrapper">
        <div class="logo">
          <div class="logoInner">
            <router-link to="/">
              <img src="@/assets/images/logo/logo.svg" alt="image" />
            </router-link>
          </div>
        </div>
        <div class="header-control">
          <div class="header-inner">
            <div class="location"></div>
            <div class="search"
              v-if="(rolesPermissionFind(screensPermissions, [63]) || rolesPermissionFind(screensPermissions, [40])) && !route.path.match('/admin/') && route.path.match('/patients')">
              <HeaderSearch v-model:value="value" @handleChange="handleChange($event)" />
            </div>
            <div class="profile" :class="ellipse ? 'show' : ''">
              <div class="notifications">
                <a-dropdown :trigger="['click']" overlayClassName="notifications">
                  <a class="ant-dropdown-link" @click.prevent>
                    <div class="icon">
                      <a-badge :count="requestCall ? requestCall.length : ''"
                        :number-style="{ backgroundColor: '#267dff' }">
                        <!-- <img src="@/assets/images/icons/calendar.svg"> -->
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M17 4H19C19.7956 4 20.5587 4.31607 21.1213 4.87868C21.6839 5.44129 22 6.20435 22 7V15.3542C21.4789 14.7638 20.7862 14.3284 20 14.126V12H4V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15.5351C16.2267 21.1956 17.5194 22 19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V7C2 6.20435 2.31607 5.44129 2.87868 4.87868C3.44129 4.31607 4.20435 4 5 4H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2C8.26522 2 8.51957 2.10536 8.70711 2.29289C8.89464 2.48043 9 2.73478 9 3V4H15V3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V4ZM4 10H20V7C20 6.73478 19.8946 6.48043 19.7071 6.29289C19.5196 6.10536 19.2652 6 19 6H17V7C17 7.26522 16.8946 7.51957 16.7071 7.70711C16.5196 7.89464 16.2652 8 16 8C15.7348 8 15.4804 7.89464 15.2929 7.70711C15.1054 7.51957 15 7.26522 15 7V6H9V7C9 7.26522 8.89464 7.51957 8.70711 7.70711C8.51957 7.89464 8.26522 8 8 8C7.73478 8 7.48043 7.89464 7.29289 7.70711C7.10536 7.51957 7 7.26522 7 7V6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7V10Z"
                            fill="#8A969F" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M22 18C22 19.6569 20.6569 21 19 21C17.3431 21 16 19.6569 16 18C16 16.3431 17.3431 15 19 15C20.6569 15 22 16.3431 22 18ZM19.5 18V19.5H18.5V18H19.5ZM19.5 17.5V16.5H18.5V17.5H19.5Z"
                            fill="#8A969F" />
                        </svg>
                      </a-badge>
                    </div>
                  </a>
                  <template #overlay>
                    <a-menu class="headerDropdown notificationsDropdown" style="max-height: 400px; overflow: auto">
                      <a-menu-item class="title">{{ 'Call Request' }}</a-menu-item>
                      <a-menu-item class="listing" v-for="(reqCall, index) in requestCall" :key="index">
                        <!-- <a class="d-flex align-items-center"> -->
                        <div class="flex-grow-1 summary" style="padding:10px" v-if="reqCall?.patient?.id">
                          <h3>
                            <router-link class="bluecolor"
                              :to="{ name: 'PatientSummary', params: { udid: reqCall?.patient?.id }, query: { filter: filter } }">{{
                                reqCall.patient?.fullName }}</router-link>
                          </h3>
                          <strong style="padding-left:10px">Time : </strong> {{
                            reqCall.contactTime.name }}
                        </div>
                        <!-- </a> -->
                        <div class="steps-action" style="padding-bottom:15px;margin-right:10px"
                          v-if="reqCall?.patient?.id">
                          <a-button style="margin-right: 10px" @click="rejectReqCall(reqCall.patient?.id, reqCall?.id)">{{
                            'Reject' }}</a-button>
                          <a-button type="primary"
                            @click="requestCallNotification(reqCall.patient?.id, reqCall.patient.fullName, reqCall?.id)">{{
                              'Accept' }}</a-button>
                        </div>
                      </a-menu-item>
                      <a-menu-item class="allNotication">
                        <router-link to="/request-call-notifications">{{ `Check All Requests` }}</router-link>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div class="notifications">
                <a-dropdown :trigger="['click']" overlayClassName="notifications">
                  <a class="ant-dropdown-link" @click.prevent>
                    <div class="icon">
                      <a-badge :count="count ? count : ''" :number-style="{ backgroundColor: '#267dff' }">
                        <!-- <img src="@/assets/images/icons/notification.svg"> -->

                        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M14.125 20.375C14.125 20.6734 14.0065 20.9595 13.7955 21.1705C13.5845 21.3815 13.2984 21.5 13 21.5H6.99999C6.70162 21.5 6.41547 21.3815 6.20449 21.1705C5.99351 20.9595 5.87499 20.6734 5.87499 20.375C5.87499 20.0766 5.99351 19.7905 6.20449 19.5795C6.41547 19.3685 6.70162 19.25 6.99999 19.25H13C13.2984 19.25 13.5845 19.3685 13.7955 19.5795C14.0065 19.7905 14.125 20.0766 14.125 20.375ZM19.0281 16.8125C18.8644 17.0979 18.6282 17.3349 18.3434 17.4996C18.0585 17.6642 17.7352 17.7506 17.4062 17.75H2.59374C2.2645 17.7478 1.94159 17.6593 1.65717 17.4935C1.37276 17.3276 1.13676 17.0901 0.972699 16.8047C0.808633 16.5192 0.722223 16.1958 0.722077 15.8665C0.72193 15.5373 0.808051 15.2137 0.971862 14.9281C1.50624 14.0094 2.14374 12.2563 2.14374 9.125V8.75C2.14127 7.71673 2.34266 6.69311 2.73637 5.73778C3.13008 4.78246 3.70837 3.91418 4.43814 3.18267C5.16791 2.45116 6.0348 1.8708 6.98919 1.47481C7.94358 1.07882 8.96671 0.874997 9.99999 0.875H10.0562C14.3594 0.903125 17.8562 4.475 17.8562 8.83438V9.125C17.8562 12.2563 18.4937 14.0094 19.0281 14.9281C19.1935 15.2146 19.2806 15.5395 19.2806 15.8703C19.2806 16.2011 19.1935 16.526 19.0281 16.8125ZM16.7875 15.5C15.8219 13.475 15.6062 10.9531 15.6062 9.125V8.83438C15.6062 5.70312 13.1125 3.14375 10.0469 3.125H9.99999C9.26183 3.12375 8.53073 3.26854 7.84876 3.55101C7.16679 3.83348 6.54743 4.24807 6.02635 4.77089C5.50527 5.29372 5.09276 5.91445 4.81256 6.59736C4.53237 7.28027 4.39003 8.01186 4.39374 8.75V9.125C4.39374 10.9531 4.17811 13.475 3.21249 15.5H16.7875Z"
                            fill="#8A969F" />
                        </svg>
                      </a-badge>
                    </div>
                  </a>
                  <template #overlay>
                    <a-menu class="headerDropdown notificationsDropdown" style="max-height: 400px; overflow: auto">
                      <a-menu-item class="title">{{ $t("header.notification") }}</a-menu-item>
                      <a-menu-item class="listing" v-for="(notification, index) in notifications" :key="index">
                        <div v-if="notification.type == 'Escalation'"
                          @click="isReadNotification(notification?.id, notification.type, notification?.type_id);">
                          <div class="summary">
                            <h3>{{ notification.title }}</h3>
                             <p>{{ notification.body }}</p>
                            <p class="" v-if="notification.time">{{
                              dateOnlyFormat(date) === dateOnlyFormat(notification.time)
                              ? 'Today'
                              : dateOnlyFormat(notification.time)
                              }} {{
                                  meridiemFormatFromTimestamp(notification.time)
                              }} </p>
                          </div>
                        </div>
                        <router-link v-if="notification.type != 'Escalation' && notification.type != 'Chat'"
                          :to="notification.type == 'Appointment' ? '' : '/communications'"
                          @click=" isReadNotification(notification?.id, notification?.type, notification?.type_id)">
                          <div class="summary">
                            <h3>{{ notification?.title }}</h3>
                            <p>{{ notification?.body }}</p>
                            <p> <span v-if="notification.time">{{
                              dateOnlyFormat(date) === dateOnlyFormat(notification.time)
                              ? 'Today'
                              : dateOnlyFormat(notification.time)
                            }}</span>
                              <span class="" v-if="notification.time">{{
                                meridiemFormatFromTimestamp(notification.time)
                              }} </span>
                            </p>
                          </div>
                        </router-link>
                        <!-- Chat notifications -->
                        <router-link v-if="notification.type == 'Chat'"
                        :to="{ name: '', params: { udid: '' } }"
                          @click=" isReadNotification(notification?.id, notification?.type, notification?.type_id)">
                          <div class="summary">
                            <h3>{{ notification?.title }}</h3>
                            <p>{{ notification?.body }}</p>
                            <p> <span v-if="notification.time">{{
                              dateOnlyFormat(date) === dateOnlyFormat(notification.time)
                              ? 'Today'
                              : dateOnlyFormat(notification.time)
                            }}</span>
                              <span class="" v-if="notification.time">{{
                                meridiemFormatFromTimestamp(notification.time)
                              }} </span>
                            </p>
                          </div>
                        </router-link>
                      </a-menu-item>
                      <a-menu-item class="allNotication">
                        <router-link to="/notifications">{{ $t('header.checkAllNotifications') }}</router-link>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div class="profile-menu notifications">
                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    <div class="image">
                      <!-- <img src="../../../assets/images/userAvatar.png" alt="image" /> -->
                      <img v-if="authUser?.user?.profilePhoto" :src="authUser?.user?.profilePhoto" alt="avatar"
                        class="ant-upload-text" />
                      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M16 9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13C10.9391 13 9.92172 12.5786 9.17157 11.8284C8.42143 11.0783 8 10.0609 8 9C8 7.93913 8.42143 6.92172 9.17157 6.17157C9.92172 5.42143 10.9391 5 12 5C13.0609 5 14.0783 5.42143 14.8284 6.17157C15.5786 6.92172 16 7.93913 16 9ZM14 9C14 9.53043 13.7893 10.0391 13.4142 10.4142C13.0391 10.7893 12.5304 11 12 11C11.4696 11 10.9609 10.7893 10.5858 10.4142C10.2107 10.0391 10 9.53043 10 9C10 8.46957 10.2107 7.96086 10.5858 7.58579C10.9609 7.21071 11.4696 7 12 7C12.5304 7 13.0391 7.21071 13.4142 7.58579C13.7893 7.96086 14 8.46957 14 9Z"
                          fill="#8A969F" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M12 1C5.925 1 1 5.925 1 12C1 18.075 5.925 23 12 23C18.075 23 23 18.075 23 12C23 5.925 18.075 1 12 1ZM3 12C3 14.09 3.713 16.014 4.908 17.542C5.74723 16.4399 6.8299 15.5467 8.07143 14.9323C9.31297 14.3179 10.6797 13.9988 12.065 14C13.4323 13.9987 14.7819 14.3095 16.0109 14.9088C17.2399 15.508 18.316 16.3799 19.157 17.458C20.0234 16.3216 20.6068 14.9952 20.8589 13.5886C21.111 12.182 21.0244 10.7355 20.6065 9.36898C20.1886 8.00243 19.4512 6.75505 18.4555 5.73004C17.4598 4.70503 16.2343 3.93186 14.8804 3.47451C13.5265 3.01716 12.0832 2.88877 10.6699 3.09997C9.25652 3.31117 7.91379 3.85589 6.75277 4.68905C5.59175 5.52222 4.64581 6.61987 3.99323 7.8912C3.34065 9.16252 3.00018 10.571 3 12ZM12 21C9.93395 21.0031 7.93027 20.2923 6.328 18.988C6.97293 18.0647 7.83134 17.3109 8.83019 16.7907C9.82905 16.2705 10.9388 15.9992 12.065 16C13.1772 15.9991 14.2735 16.2636 15.2629 16.7714C16.2524 17.2793 17.1064 18.0159 17.754 18.92C16.1393 20.2667 14.1026 21.0029 12 21Z"
                          fill="#8A969F" />
                      </svg>
                      <!-- <img v-else  src="@/assets/images/userAvatar.png" alt="image" /> -->
                    </div>
                  </a>
                  <template #overlay>

                    <a-menu class="headerDropdown">
                      <div class="basicInfo">
                        {{ userName }}

                        <!-- {{ userName ? userName : authUser?.user?.lastName+ ', ' + authUser?.user?.firstName }} -->
                        <p>
                          {{ accessPermissions ? accessPermissions[0]?.role : '' }}
                        </p>
                      </div>
                      <a-menu-item key="0" @click="profileShow">
                        {{ $t("header.myProfile") }}
                      </a-menu-item>
                      <a-menu-item key="3">
                        <router-link :to="{ name: 'ResetPassword' }">
                          Reset Password
                        </router-link>
                      </a-menu-item>
                      <a-menu-item key="3">
                        <a @click="logout()">
                          Logout
                        </a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppointmentDetails v-if="isAppointment" v-model:visible="isAppointment" @closeModal="closeModal(event)" />
      <EscaltionViewModal v-model:visible="escaltionViewModal" v-if="escaltionViewModal"
        @saveViewModal="saveModal($event)" />
      <TaskDetails v-model:visible="taskVisibleView" :taskId="taskID" :onlyView="onlyView" />
    </a-layout-header>
  </div>
  <a-drawer placement="right" :closable="false" :visible="satffVisible" width="60%">
    <People v-if="satffVisible" :isStaff="true" :formHeading="formHeading" @onClose="onClose" fromScreen="peopleList"
      :staffId="staffId" />
  </a-drawer>
  <WarningModal v-model:visible="showAlert" title="Warning!" bodyText="Your activities session time will be lost."
    cancelBtnText="Leave Page" okBtnText="Save Session" @leavePage="leavePage" @saveSession="saveSession" />
  <a-drawer placement="right" :closable="false" v-if="visibleTimeLogForm" :visible="visibleTimeLogForm" width="60%">
    <TimeLogForm @onClose="closeTimeLogModal" @redirectRoute="redirectRoute" :onPageLeave="true" />
  </a-drawer>
</template>
<script setup>
import TimeLogForm from "@/components/patients/patientDetails/topSection/modals/TimeLogForm";
import { ref, computed, watchEffect, onMounted } from "vue";
import { useStore } from "vuex";
import HeaderSearch from "./HeaderSearch";
import AppointmentDetails from "../../modals/AppointmentDetails";
import People from "@/components/administration/clients/Tabs/addClient/People";
import {
  meridiemFormatFromTimestamp,
  dateOnlyFormat,
  deCodeString,
  key,
  rolesPermissionFind
} from "@/commonMethods/commonMethod";
import { useRoute, useRouter } from "vue-router";
import StaffDetail from "@/components/care-coordinator/StaffDetail.vue";
import TaskDetails from "@/components/tasks/modals/TaskDetails.vue";
import EscaltionViewModal from "@/components/escalations/EscalationViewModal";
import {
  saveTime,
  resumeTimer,
} from "@/services/patientTimer/services/patientTimer.js";
import WarningModal from "@/components/common/confirmModals/WarningModal";
const emit = defineEmits(["is-heardeVisible"]);
const store = useStore();
const router = useRouter();
const ellipse = ref(false);
const taskID = ref();
const onlyView = ref(true);
const taskVisibleView = ref(false);
const escalationVisible = ref(false);
const isAppointment = ref();
const patientId = ref();
const escaltionViewModal = ref(false);
const patientName = ref();
const date = Math.round(+new Date() / 1000);
const authUser = ref(JSON.parse(localStorage.getItem("auth")))
const userName = ref(authUser.value?.user?.lastName + ', ' + authUser.value?.user?.firstName)
const route = useRoute();
const satffVisible = ref(false);
const staffId = ref("");

const profileShow = () => {
  store.dispatch("peopleDetails", { id: authUser.value?.user?.staffUdid })
  satffVisible.value = true;
};
const value = ref();

const showAlert = ref(false);

const leaveDetailsPage = computed(() => {
  return store.state.patientsStore.leaveDetailsPage;
});

const visibleTimeLogForm = ref(false);

const onClose = (event) => {
  satffVisible.value = event;
  authUser.value = JSON.parse(localStorage.getItem("auth"))
  userName.value = authUser.value?.user?.lastName + ', ' + authUser.value?.user?.firstName
};
const visibleEscalationModal = computed(() => {
  return store.state.authentication.visibleEscalationModal;
});

const accessPermissions = computed(() => {
  return store.state.authentication.accessPermissions;
});
watchEffect(() => {
  
  if (JSON.parse(localStorage.getItem("barmenu")) == true) {
    document.body.classList.add("show");
  }
  if (visibleEscalationModal.value) {
    escaltionViewModal.value = true;
  }

});

onMounted(() => {
  //store.dispatch("accessPermissions");
});

const notifications = computed(() => {
  return store.state.common.getNotificationsList;
});

const handleChange = (val) => {
  if (val) {
    // value.value = val;
    router.push({
      name: "PatientDetails",
      params: {
        udid: val,
        globalSearch: true,
      },
    });
  } else {
    value.value = "";
  }
};

const isReadNotification = (id, type, typeId) => {
  if (type == "task") {
    store.dispatch("editTask", { id: typeId });
    taskID.value = typeId;
    taskVisibleView.value = true;
  }else if(type == "Escalation"){
    if(rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [63])){
    router.push({
      name: "PatientDetails",
      params: {
        udid: typeId,
        globalSearch: true,
      },
    });
  }
  }
  store.dispatch("isReadUpdateNotification", id).then(() => {
    store.dispatch("notificationList");
  });
};

function closeModal(status) {
  isAppointment.value = status;
}
const saveModal = (value) => {
  escalationVisible.value = value;
};

const requestCallNotification = (pId, value, id) => {
  patientId.value = pId;
  patientName.value = value;
  store
    .dispatch("isReadCallNotification", { patientId: pId, id: id })
    .then((resp) => {
      if (resp == true) {
        store.dispatch("requestCall");
      }
    });
};

const rejectReqCall = (pId, id) => {
  store
    .dispatch("isReadCallNotification", { patientId: pId, id: id })
    .then((resp) => {
      if (resp == true) {
        store.dispatch("requestCall");
      }
    });
};

const isBillingLogged = computed(() => {
  return store.state.patientsStore.isBillingLogged;
});

function logout() {
  if (!isBillingLogged.value) {
    if (!leaveDetailsPage.value) {
      if (route.name == "PatientDetails") {
        showAlert.value = true;
      } else {
        store.dispatch("logoutUser");
      }
    } else {
      store.dispatch("logoutUser");
    }
  } else {
    store.dispatch("logoutUser");
  }
}

const leavePage = () => {
  store.commit("leaveDetailsPage", true);
  store.dispatch("logoutUser");
};

const saveSession = () => {
  store.commit("leaveDetailsPage", false);
  showAlert.value = false;
  saveTime();
  visibleTimeLogForm.value = true;
};

const screensPermissions = store.getters.screensPermissions;
const requestCall = computed(() => {
  return store.state.appointment.requestCall;
});
const count = store.getters.notificationCount;

const closeTimeLogModal = () => {
  resumeTimer();
  visibleTimeLogForm.value = false;
};

const redirectRoute = () => {
  visibleTimeLogForm.value = false;
  store.commit("patientTimerValue", null);
  leavePage();
};
</script>

<style scoped>.ant-btn-group.ant-dropdown-button {
  /* position: relative; */
  margin-left: 12px;
}

span.headerIcon {
  padding: 4px 9px 9px 7px;
  background-color: #1890ff;
  color: #ffffff;
  position: relative;
  top: -2px;
  border-left: 1px solid #ffffff;
}

button.ant-btn.ant-btn-primary.ant-dropdown-trigger {
  border-left: 1px solid #ffffff;
}</style>
