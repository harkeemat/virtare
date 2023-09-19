<template>
  <div class="notications common-bg">
    <a-layout-content>
      <div>
        <a-row>
          <a-col :span="24">
            <h2 class="pageTittle">Notifications</h2>
          </a-col>
          <a-col :span="24">
            <ul class="scrollNext" :scroll="
              height ? { y: height } : { x: 900, y: 'calc(100vh - 470px)' }
            ">
              <div v-for="(notification, index) in notifications" :key="index" style="margin: 0 0 15px">
                <li class="listing" v-for="(notf, index) in notification.value" :key="index"
                  :class="notf.Isread ? 'read' : 'unread'">
                  <div class="d-flex align-items-center" v-if="notf.type == 'Escalation'" @click="
                    isReadNotification(
                      notf.id,
                      notf.type,
                      notf.type_id,
                      notification.date
                    );
                  getEscalationId(notf?.type_id);
                                        ">
                    <div class="flex-grow-1 ms-3 summary">
                      <h3>{{ notf.title }}</h3>
                      <p>{{ notf.body }}</p>
                      <br />
                      <strong class="" v-if="notf.time">{{
                        dateOnlyFormat(date) === dateOnlyFormat(notf.time)
                        ? ""
                        : dateOnlyFormat(notf.time)
                      }}</strong>&nbsp;
                      <strong class="" v-if="notf.time">{{ meridiemFormatFromTimestamp(notf.time) }}
                      </strong>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3 summary" v-else>
                    <h3>{{ notf.title }}</h3>
                    <p>{{ notf.body }}</p>
                    <br />
                    <strong class="" v-if="notf.time">{{
                      dateOnlyFormat(date) === dateOnlyFormat(notf.time)
                      ? ""
                      : dateOnlyFormat(notf.time)
                    }}</strong>&nbsp;
                    <strong class="" v-if="notf.time">{{ meridiemFormatFromTimestamp(notf.time) }}
                    </strong>
                  </div>
                </li>
              </div>
              <!-- <li class="listing unread">
                    <a class="d-flex align-items-center" href="#">
                      <div class="flex-grow-1 ms-3 summary">
                        <p>Just a reminder that you have appoinment</p>
                        <span class="date">20 minutes ago</span>
                      </div>
                    </a>
                  </li>
                  <li class="listing read">
                    <a class="d-flex align-items-center" href="#">
                      <div class="flex-grow-1 ms-3 summary">
                        <p>Just a reminder that you have appoinment</p>
                        <span class="date">20 minutes ago</span>
                      </div>
                    </a>
                  </li> -->
            </ul>
          </a-col>
        </a-row>
        <Loader />
      </div>
      <AppointmentDetails v-if="isAppointment" v-model:visible="isAppointment" @closeModal="closeModal(event)" />
      <EscaltionViewModal v-model:visible="escaltionViewModal" v-if="escaltionViewModal" />
      <TaskDetails v-model:visible="taskVisibleView" :taskId="taskID" :onlyView="onlyView" />
    </a-layout-content>
  </div>
</template>

<script>
import { onMounted, computed, ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import {
  meridiemFormatFromTimestamp,
  dateOnlyFormat,
} from "@/commonMethods/commonMethod";
import AppointmentDetails from "@/components/modals/AppointmentDetails";
import Loader from "@/components/loader/Loader";
import EscaltionViewModal from "@/components/escalations/EscalationViewModal";
export default {
  components: {
    AppointmentDetails,
    EscaltionViewModal,
    Loader,
    TaskDetails: defineAsyncComponent(() =>
      import("@/components/tasks/modals/TaskDetails.vue")
    ),
  },
  setup() {
    const searchAll = ref(false);
    const store = useStore();
    const isAppointment = ref(false);
    const escaltionViewModal = ref(false);
    const taskID = ref();
    const onlyView = ref(true);
    const date = Math.round(+new Date() / 1000);
    const taskVisibleView = ref(false);
    const meta = store.getters.notificationsRecords.value;
    let data = [];

    const notifications = computed(() => {
      return store.state.common.getNotifications;
    });

    let scroller = "";
    let dateFilter = "&fromDate=&toDate=";
    let filter = "";
    onMounted(() => {
      var tableContent = document.querySelector(".scrollNext");
      store.dispatch("getNotifications");
      tableContent?.addEventListener("scroll", (event) => {
        let maxScroll = event.target.scrollHeight - event.target.clientHeight;
        let currentScroll = event.target.scrollTop + 2;
        if (currentScroll >= maxScroll) {
          let current_page = meta.notificationsMeta.current_page + 1;
          if (current_page <= meta.notificationsMeta.total_pages) {
            data = meta.getNotifications;
            scroller = maxScroll;
            store.state.common.notificationsMeta = "";
            if (!searchAll.value) {
              store
                .dispatch(
                  "getNotifications",
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
        }
      });
      // store.dispatch("getNotifications")
    });

    function loadMoredata() {
      const newData = meta.getNotifications;
      newData.forEach((element) => {
        data.push(element);
      });
      meta.getNotifications = data;
      var tableContent = document.querySelector(".scrollNext");
      setTimeout(() => {
        tableContent.scrollTo(0, scroller);
      }, 50);
    }

    const isReadNotification = () => {
      // let object = notifications.value.find((obj) => obj?.date === date);
      // let isreadObject = object?.value.find((obj) => obj?.id == id);
      // isreadObject.Isread = 1;
      // if (type == "Appointment") {
      //   isAppointment.value = true;
      //   store.dispatch("appointmentDetails", typeId);
      //   notifications.value;
      // } else if (type == "task") {
      //   store.dispatch("editTask", {
      //     id: typeId,
      //   });
      //   taskID.value = typeId;
      //   taskVisibleView.value = true;
      // }
      // store.dispatch("isReadUpdateNotification", id).then(() => { });
    };

    function closeModal(status) {
      isAppointment.value = status;
    }
    function getEscalationId() {
      // store.dispatch("getEscalationId", id).then((resp) => {
      //   if (resp == true) {
      //     escaltionViewModal.value = true;
      //   }
      //});
    }
    return {
      escaltionViewModal,
      getEscalationId,
      closeModal,
      isAppointment,
      isReadNotification,
      notifications,
      meridiemFormatFromTimestamp,
      dateOnlyFormat,
      date,
      taskVisibleView,
      taskID,
      onlyView,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.notications {
  ul {
    list-style: none;
    padding: 0;
    max-height: calc(100vh - 185px);
    overflow: auto;

    .listing {
      background-color: $border-color-2;
      border-radius: 8px;
      margin: 0 0 15px;

      &:last-child {
        margin: 0;
      }

      &.read {
        .d-flex {
          text-decoration: none;
          padding: 10px 15px;
          color: #444;
        }
      }

      &.unread {
        background-color: $secondary-color;
      }

      .d-flex {
        text-decoration: none;
        padding: 10px 15px;
        color: #444;

        .summary {
          p {
            font-size: 14px;
            line-height: 18px;
          }

          .date {
            font-size: 12px;
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>
