<template>
    <a-layout-content>
    <div class="common-bg">
            <Title :title="$t('appointmentCalendar.appointmentCalendar')" @calenderToggle="calenderView($event)" :isActive="toggle" :button="{
                fullCalendarView: $t('appointmentCalendar.fullCalendarView'),
                hideCalendarView:$t('appointmentCalendar.hideCalendarView')
              }" />

            <div class="calendarWrapper">
                <div class="calendarLeft" v-show="toggle">
                    <!-- <div class="apptBtn" v-if="arrayToObjact(screensPermissions,112)"> -->
                        <!-- <a-button type="primary"  @click="showModal(true)">
                            {{$t('appointmentCalendar.newAppointment')}}</a-button> -->
                            <ShowModalButton class="apptBtn"  @click="showModal(true)" :buttonText="$t('appointmentCalendar.newAppointment')" v-if="arrayToObjact(screensPermissions,112)"/>
                    <!-- </div> -->
                    <Calendar @is-click="selectDate($event)" :dateSelected="fromDate" />
                    <Physicians @staff-select="staffSelect($event)" :physiciansId="physiciansId" v-if="arrayToObjact(screensPermissions,37)" />
                        </div>
                <div class="calendarRight" :class="toggle==true?'':'active'">
                    <Loader v-if="!showLoaderMain" />
                    <a-tabs v-model:activeKey="activeKey" @change="tabClick(activeKey,dayjs())" v-if="arrayToObjact(screensPermissions,42) || arrayToObjact(screensPermissions,112)">
                        <a-tab-pane key="1" tab="Day">
                            <DayAppointment />
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Tomorrow">
                            <DayAppointment />
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Week">
                            <WeekAppointment @is-dateClick="selectDate($event)" @week-select="weekChange($event)" tabName="week"></WeekAppointment>
                        </a-tab-pane>
                        <a-tab-pane key="4" tab="Month">
                            <MonthAppointment v-if="monthRecord" :appointment="appointmentSearch" @is-dateClick="selectDate($event)" @is-month="monthDate($event)" :seclectDate="month"></MonthAppointment>
                        </a-tab-pane>
                    </a-tabs>
                  </div>
                </div>
            <Loader v-if="showLoaderMain" />
        <!--modal-->
        <AddAppointment :maskClosable="maskebale" v-model:visible="appointmentModal" @ok="handleOk" @is-visible="showModal($event)" :staff="staffList" :patient="patientsList" />
        <!---->
    </div>
    </a-layout-content>
</template>
<script>
import AddAppointment from "@/components/modals/AddAppointment";
import Title from "./Title";
import Calendar from "./Calendar";
import Physicians from "./Physicians";
import DayAppointment from "./DayAppointment";
import MonthAppointment from "./MonthAppointment";
import WeekAppointment from "./WeekAppointment";
import { ref, computed, onUnmounted, onMounted, watchEffect } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import Loader from "@/components/loader/Loader";
import { arrayToObjact } from "@/commonMethods/commonMethod";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
export default {
  components: {
    ShowModalButton,
    AddAppointment,
    Title,
    Calendar,
    Physicians,
    DayAppointment,
    MonthAppointment,
    WeekAppointment,
    Loader,
  },
  props: {
    headerData: {
      type: String,
    },
  },
  setup(props) {
    const toggle = ref(true);
    const maskebale = ref(false);
    const activeKey = ref("1");
    const store = useStore();
    const month = ref(dayjs());
    const fromDate = ref(dayjs());
    const toDate = ref(dayjs());
    let datePick = dayjs();
    const physiciansId = ref([]);
    const showLoaderMain = ref(true);
    const monthRecord = ref(false);
    ///This fuction is working for date select in calendar and view appointment according select date
    function selectDate(event) {
      showLoaderMain.value = false;
      activeKey.value = "1";
      store.state.appointment.searchAppointmentRecords = "";
      fromDate.value = dayjs(event);
      toDate.value = dayjs(event);
      datePick = dayjs(event);
      searchApi();
    }

        function weekChange(event) {
            datePick = dayjs(event).startOf('week')
            fromDate.value = dayjs(datePick).startOf('week')
            toDate.value = dayjs(datePick).endOf('week')
            store.state.appointment.calendarDate = fromDate.value
            searchApi()
        }

    function tabClick(value, tabDate) {
      showLoaderMain.value = false;
      store.state.appointment.searchAppointmentRecords = "";
      if (value == 1) {
        activeKey.value = "1"
        datePick = tabDate;
        fromDate.value = tabDate;
        toDate.value = tabDate;
      } else if (value == 2) {
        datePick = dayjs().add(1, "days");
        fromDate.value = dayjs().add(1, "days");
        toDate.value = dayjs().add(1, "days");
      } else if (value == 3) {
        datePick = dayjs(tabDate).startOf("week");

        store.dispatch("weekName", {
          from: dayjs(tabDate).startOf("week"),
          to: dayjs(tabDate).endOf("week"),
        });
        fromDate.value = dayjs(tabDate).startOf("week");
        toDate.value = dayjs(tabDate).endOf("week");
      } else if (value == 4) {
        monthRecord.value = false;
        datePick = dayjs(tabDate).startOf("month");
        month.value = dayjs();
        fromDate.value = dayjs(tabDate).startOf("month");
        toDate.value = dayjs(tabDate).endOf("month");
      } else {
        datePick = tabDate;
        fromDate.value = tabDate;
        toDate.value = tabDate.add(1, "days");
      }
      searchApi();
    }

    function monthDate(event) {
      monthRecord.value = false;
      showLoaderMain.value = false;
      activeKey.value = "4";
      month.value = dayjs(event);
      datePick = dayjs(event);
      fromDate.value = dayjs(event).startOf("month");
      toDate.value = dayjs(event).endOf("month");
      store
        .dispatch("searchAppointment", {
          fromDate: fromDate.value,
          toDate: toDate.value,
          tabId: 4,
          physiciansId:
            physiciansId.value.length == 0 ? "" : physiciansId.value.join(","),
        })
        .then(() => {
          monthRecord.value = true;
        });
    }
    watchEffect(() => {
      if (props.headerData) {
        selectDate(props.headerData);
      }
    });
    onMounted(() => {
      store.dispatch("getStaffs").then(() => {});

      searchApi();
    });

    function searchApi() {
      let staffId = [];
      store.getters.appointmentRecords.value.getStaff
        ? store.getters.appointmentRecords.value.getStaff.map((item) => {
            staffId.push(item.id);
          })
        : "";
      physiciansId.value = staffId;
      store.state.appointment.searchAppointmentRecords = "";
      store.state.appointment.calendarDate = "";

      store.dispatch("calendarDateSelect", datePick);
      store
        .dispatch("searchAppointment", {
          fromDate: fromDate.value,
          toDate: toDate.value,
          tabId: activeKey.value,
          physiciansId:
            physiciansId.value.length == 0 ? "" : physiciansId.value.join(","),
        })
        .then(() => {
          monthRecord.value = true;
        });
    }
    // const patientsList = computed(() => {
    //     return store.state.common.allPatientsList
    // })
    const staffList = computed(() => {
      return store.state.common.allStaffList;
    });

    function calenderView(event) {
      toggle.value = event;
    }
    const appointmentModal = ref(false);
    const showModal = (event) => {
      if (event.date) {
        selectDate(event.date);
        appointmentModal.value = event.check;
      } else {
        appointmentModal.value = event;
      }
    };
    const handleOk = () => {
      appointmentModal.value = false;
    };

    function staffSelect() {
      let staffId = [];
      store.getters.appointmentRecords.value.getStaff
        ? store.getters.appointmentRecords.value.getStaff.map((item) => {
            staffId.push(item.id);
          })
        : "";
      physiciansId.value = staffId;
      store
        .dispatch("searchAppointment", {
          fromDate: fromDate.value,
          toDate: toDate.value,
          tabId: activeKey.value,
          physiciansId:
            physiciansId.value.length == 0 ? "" : physiciansId.value.join(","),
        })
        .then(() => {
          monthRecord.value = true;
        });
      showLoaderMain.value = false;
    }

    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
       store.commit("filter", "");
      //store.commit("dataFilter", "");
    });
    return {
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      month,
      appointmentSearch: store.getters.searchAppointmentRecords,
      maskebale,
      activeKey,
      selectDate,
      fromDate,
      toDate,
      // patientsList,
      staffList,
      calenderView,
      value1: ref(),
      toggle,
      tabClick,
      appointmentModal,
      handleOk,
      showModal,
      searchApi,
      datePick,
      monthDate,
      staffSelect,
      physiciansId,
      showLoaderMain,
      dayjs,
      weekChange,
      monthRecord,
    };
  },
};
</script>

<style lang="scss" scoped>

.apptBtn { 
  text-align: center;
  margin: 0 0 25px 0;
}
.calendarWrapper {
  display: flex;
  .calendarLeft {
    width: 300px;
    margin-right: 30px;
  }
  .calendarRight {
    width: calc(100% - 330px);
    &.active {
      width: 100%;
    }
  }
}
</style>

