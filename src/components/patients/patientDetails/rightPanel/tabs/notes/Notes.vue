<template>
  <div
    ref="notesId"
    v-on="{
      mousewheel: handleNoteSession,
      mouseenter: handleNoteSession,
      keydown: handleNoteSession,
      mouseleave: handleNoteSession,
    }"
  >
    <div class="patientNotesOuter">
      <div class="patientNotesInner notesGrid">
        <div
          class="patientNotes"
          v-for="(notesRecord, key) in notesRecord?.patientNotesList"
          :key="key"
        >
          <a-typography-title :level="5"
            ><span>{{
              dayjs(key).format(globalDateFormat)
            }}</span></a-typography-title
          >
          <div
            v-for="notes in notesRecord"
            :key="notes?.udid"
            :class="notes?.type == 1 ? 'notesWrapper internal' : 'notesWrapper'"
          >
            <div class="time">
              {{
                notes?.createdAt
                  ? dateAndTimeFormate(notes?.createdAt, globalTimeFormat)
                  : ""
              }}
            </div>
            <div class="message">
              {{ notes?.note }}
            </div>
            <div class="name">
              <img v-if="notes?.profilePhoto" :src="notes?.profilePhoto" />
              <img v-else src="@/assets/avatar.png" />
              <span>{{ notes?.notesCreatedBy }}. {{ notes?.role }} </span>
            </div>
          </div>
        </div>
        <!-- <div v-if="notesRecord?.notesMeta?.current_page < notesRecord?.notesMeta?.total_pages" class="load-more"><span @click="loadMore">Load More...</span></div> -->
      </div>
      <div class="addNotes">
        <a-button
          @click="showDrawer"
          v-if="rolesPermissionFind(screensPermissions, [95])"
          ><span>Add notes</span>
          <PlusOutlined />
        </a-button>
      </div>
    </div>

    <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      width="60%"
    >
      <AddNotes @onClose="closeForm($event)" v-if="visible" />
    </a-drawer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddNotes from "@/components/patients/patientDetails/rightPanel/tabs/notes/AddNotes.vue";
import { PlusOutlined } from "@ant-design/icons-vue";

import { onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import dayjs from "dayjs";
import {
  dateAndTimeFormate,
  globalTimeFormat,
  rolesPermissionFind,
  globalDateFormat,
  deepMergeObjects
} from "@/commonMethods/commonMethod";
//import { patientsNotes } from "@/config/apiConfig";
import {
  stopTimer,
  pauseTimer,
  toTime,
  hmsToSecondsOnly,
  // formatTime,
} from "@/services/sendBirdChat/services/trackActivity.js";
import { warningSwal } from "@/commonMethods/commonMethod";
    const store = useStore();
    const route = useRoute();
    const visible = ref(false);
    const notesId = ref();
    const loggedTime = ref();
    const notesRecord = store.getters.notesRecord;
    const showDrawer = () => {
      visible.value = true;
    };
    let record = [];
    let scroller = "";
    const screensPermissions = store.getters.screensPermissions;
    onMounted(async () => {
      // loggedTime.value = await JSON.parse(
      //   sessionStorage.getItem("noteSession")
      // );
      if (loggedTime.value) {
        console.log("loggedTime", loggedTime.value?.totalTime);
      }
      try {
        await store.dispatch("patientNotesList", { id: route?.params?.udid });

        //infinite scroller
        var tableContent = document.querySelector(".notesGrid");
        tableContent?.addEventListener("scroll", (event) => {
          let maxScroll = event.target.scrollHeight - event.target.clientHeight;
          let currentScroll = event.target.scrollTop + 1;
          if (currentScroll >= maxScroll) {
            let current_page = notesRecord.value?.notesMeta?.current_page + 1;
            if (current_page <= notesRecord.value?.notesMeta?.total_pages) {
              scroller = maxScroll;
              notesRecord.value.notesMeta = "";
              record = notesRecord.value?.patientNotesList;
              store
                .dispatch("patientNotesList", {
                  filter:
                    "?page=" +
                    current_page +
                    store.getters.orderTable.value?.data,
                  id: route?.params?.udid,
                })
                .then(() => {
                  loadMoredata();
                });
            }
          }
        });
      } catch (error) {
        console.warn(error);
      }
    });

    onUnmounted(() => {
      // sessionStorage.removeItem("noteSession");
    });
    function loadMoredata() {
      store.state.patientsNotes.patientNotesList = deepMergeObjects(record,store.state.patientsNotes.patientNotesList)
      // Object.assign(record, {
      //   ...notesRecord.value?.patientNotesList,
      //   ...record,
      // });
      //store.state.patientsNotes.patientNotesList = record;
      var tableContent = document.querySelector(".notesGrid");

      setTimeout(() => {
        tableContent?.scrollTo(0, scroller);
      }, 50);
    }

    const closeForm = (event) => {
      visible.value = event;
    };

    const timerStatus = computed(() => {
      return store.state.sendbirdState.timerStatus;
    });

    const elapsedTime = ref(0);
    const totalTime = ref("00:00:00");
    // var elapsedTime.value = 0;
    let lastActivityTimeInSecond = 0;
    //Five minutes. 60 x 5 = 300 seconds.
    var maxInactivity = 60 * 2;

    const timer = ref(undefined);
    //calculating time format
    const formattedElapsedTime = computed(() => {
      const date = new Date(null);
      const newTime = hmsToSecondsOnly(totalTime.value) * 1000 + 1000;
      if (newTime != elapsedTime.value) {
        date.setSeconds(newTime / 1000);
      } else {
        date.setSeconds(
          loggedTime.value?.totalTime > 0
            ? loggedTime.value?.totalTime
            : elapsedTime.value / 1000
        );
      }
      const utc = date.toUTCString();
      return utc.substring(utc.indexOf(":") - 2, utc.length - 3);
    });

    // Start session timer
    const startTimer = () => {
      timer.value = setInterval(() => {
        elapsedTime.value += 1000;
        lastActivityTimeInSecond++;
        totalTime.value = formattedElapsedTime.value;
        // sessionStorage.setItem(
        //   "noteSession",
        //   JSON.stringify({ totalTime: hmsToSecondsOnly(totalTime.value) })
        // );
        store.commit("timerStatus", "running");
        //if the user has been inactive or idle for longer
        //then the seconds specified in maxInactivity
        if (lastActivityTimeInSecond >= maxInactivity) {
          //Restart time
          pauseTimer(timerStatus.value, timer.value);
          // `You are inactative from ${formatTime(maxInactivity)} mins! want to keep it?`
          /* warningSwal(
            `You are inactive(At note tab) since ${maxInactivity} sec! want to keep it?`
          ).then((response) => {
            if (response == true) {
              lastActivityTimeInSecond = 0;
              pauseTimer(timerStatus.value, timer.value);
              sessionStorage.setItem(
                "noteSession",
                JSON.stringify({ totalTime: hmsToSecondsOnly(totalTime.value) })
              );
            } else {
              let minutes = hmsToSecondsOnly(totalTime.value) - maxInactivity;
              totalTime.value = toTime(minutes);
              sessionStorage.setItem(
                "noteSession",
                JSON.stringify({ totalTime: hmsToSecondsOnly(totalTime.value) })
              );
            }
          }); */
        }
      }, 1000);
    };

    // track user activity when the user active
    function activity() {
      lastActivityTimeInSecond = 0;
      resumeTimer();
    }

    // Resume the session
    const resumeTimer = () => {
      if (timerStatus.value != "running") {
        store.commit("timerStatus", "running");
        startTimer();
      } else {
        // alert()
      }
    };

    function handleNoteSession(e) {
      if (e?.type == "mouseleave") {
        stopTimer(true, timer.value, totalTime.value);
      } else {
        resumeTimer();
        notesId.value?.addEventListener(e?.type, activity, true);
      }
    }
   
</script>
