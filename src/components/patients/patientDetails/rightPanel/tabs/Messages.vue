<template>
  <div class="patientMessage">
    <a-typography-text>
      <!-- <p><b>Current Session Time - </b>{{ sendBirdChatData?.totalTime }}</p> -->
      <!-- <p><b>Status - </b>{{ timerStatus?.charAt(0)?.toUpperCase() + timerStatus?.slice(1) }}</p> -->
    </a-typography-text>
    <SendBirdChat
      ref="message"
      v-if="sendBirdChatData?.createChannel"
      :config="sendBirdChatData?.createChannel"
      v-on="{
        mousewheel: handleMsgSession,
        mouseenter: handleMsgSession,
        keydown: handleMsgSession,
        mouseleave: handleMsgSession,
      }"
    />
    <template v-else>
      <a-skeleton active />
    </template>
  </div>
</template>
<script setup>
// const sendbird_URL = process.env.VUE_APP_SEND_BIRD_URL;
// const sendbird_API_Token = process.env.VUE_APP_SEND_BIRD_API_TOKEN;
import SendBirdChat from "@/components/sendBird/SendBirdChat.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
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
const message = ref();
const patientId = ref(route.params.udid);
// const loggedTime = ref();

const sendBirdChatData = computed(() => {
  return store.state.sendbirdState;
});
onMounted(() => {
  localStorage.setItem("isChatOpened", true);
  store.dispatch("createChannel", {
    patientId: patientId.value,
  });
  // store.dispatch('getMsgUnreadCount',patientId.value)
  store.state.sendbirdState.loggedTime = JSON.parse(sessionStorage.getItem("chatSession"));
  if (store.state.sendbirdState.loggedTime) {
    console.log("loggedTime", store.state.sendbirdState.loggedTime?.totalTime);
  }
  store.dispatch('readChat',route?.params?.udid)
});

onUnmounted(() => {
  store.state.sendbirdState.createChannel = null;
  // sessionStorage.removeItem("chatSession");
});

const timerStatus = computed(() => {
  return store.state.sendbirdState.timerStatus;
});

const wantToChat = computed(() => {
  return store.state.patientsStore.wantToChat;
});

const elapsedTime = ref(0);
store.state.sendbirdState.totalTime= 
  store.state.sendbirdState.loggedTime?.totalTime > 0
    ? toTime(store.state.sendbirdState.loggedTime?.totalTime)
    : "00:00:00"

// var elapsedTime.value = 0;
let lastActivityTimeInSecond = 0;
//Five minutes. 60 x 5 = 300 seconds.
var maxInactivity = 60 * 2;

const timer = ref(undefined);
//calculating time format
const formattedElapsedTime = (() => {
  store.state.sendbirdState.date = new Date(null);
  store.state.sendbirdState.newTime = hmsToSecondsOnly(store.state.sendbirdState.totalTime) * 1000 + 1000;
  if (store.state.sendbirdState.newTime != elapsedTime.value) {
    store.state.sendbirdState.date.setSeconds(store.state.sendbirdState.newTime / 1000);
  } else {
    store.state.sendbirdState.date.setSeconds(
      store.state.sendbirdState.loggedTime?.totalTime > 0
        ? store.state.sendbirdState.loggedTime?.totalTime
        : elapsedTime.value / 1000
    );
  }
  store.state.sendbirdState.utc = store.state.sendbirdState.date.toUTCString();
 return store.state.sendbirdState.utc.substring(store.state.sendbirdState.utc.indexOf(":") - 2, store.state.sendbirdState.utc.length - 3);
});

// Start session timer
const startTimer = () => {
  timer.value = setInterval(() => {
    elapsedTime.value += 1000;
    lastActivityTimeInSecond++;
    // formattedElapsedTime();
    store.state.sendbirdState.totalTime = formattedElapsedTime()
    sessionStorage.setItem(
      "chatSession",
      JSON.stringify({ totalTime: hmsToSecondsOnly(store.state.sendbirdState.totalTime) })
    );
    store.commit("timerStatus", "running");
    //if the user has been inactive or idle for longer
    //then the seconds specified in maxInactivity
    if (lastActivityTimeInSecond >= maxInactivity) {
      //Restart time
      pauseTimer(timerStatus.value, timer.value);
      warningSwal(
        `You are inactive(At chat tab) since ${maxInactivity} sec! want to keep it?`
      ).then((response) => {
        if (response == true) {
          lastActivityTimeInSecond = 0;
          store.commit("chatTimerValue", timer.value);
          pauseTimer(timerStatus.value, timer.value);
          sessionStorage.setItem(
            "chatSession",
            JSON.stringify({ totalTime: hmsToSecondsOnly(store.state.sendbirdState.totalTime) })
          );
        } else {
          let minutes = hmsToSecondsOnly(store.state.sendbirdState.totalTime) - maxInactivity;
          store.state.sendbirdState.totalTime = toTime(minutes);
          sessionStorage.setItem(
            "chatSession",
            JSON.stringify({ totalTime: hmsToSecondsOnly(store.state.sendbirdState.totalTime) })
          );
        }
      });
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
    if (wantToChat.value && patientTimerStatus.value == "running") {
      startTimer();
      store.commit("timerStatus", "running");
    }
  }
};

const patientTimerStatus = computed(() => {
  return store.state.patientsStore.patientTimerStatus;
});

function handleMsgSession(e, tab = "msg") {
  //Start session log
  if (e?.type == "mouseleave") {
    stopTimer(true, timer.value, store.state.sendbirdState.totalTime);
  } else if (
    e?.type == "keydown" ||
    e?.type == "mousewheel" ||
    e?.type == "mouseenter" ||
    e?.type == "mouseleave"
  ) {
    if (patientTimerStatus.value != "running") {
      pauseTimer(timerStatus.value, timer.value);
      if (e?.type == "keydown") {
        warningSwal(`Your timer is inactive! Do you want to chat?`).then(
          (response) => {
            if (response == true) {
              store.commit("patientTimerStatus", "");
              store.commit("wantToChat", true);
              if (e?.type == "mouseenter" || e?.type == "mousewheel") {
                resumeTimer();
                message.value?.$el?.addEventListener(e?.type, activity, true);
              }
            }
          }
        );
      }
    } else {
      store.commit("patientTimerStatus", "running");
      // store.commit('timerStatus', 'stopped')
      store.commit("wantToChat", true);
      if (e?.type == "mouseenter" || e?.type == "mousewheel" || e?.type == "keydown") {
        resumeTimer();
        message.value?.$el?.addEventListener(e?.type, activity, true);
      }
    }
  } else {
    resumeTimer();
    message.value?.$el?.addEventListener(e?.type, activity, true);
  }

  //If chat modal open from chat screen then time also be start
  /* document.getElementById("sendbird-modal-root").addEventListener("mousemove", function(){
        resumeTimer();
        document.getElementById("sendbird-modal-root").addEventListener("mousemove", activity, true);
      }); */
}
</script>

<style lang="scss" scoped>
.patientMessage {
  overflow-x: auto;
  :deep(.sendbird-channel-list) {
    width: 150px;
    .sendbird-channel-header {
      width: 150px;
      .sendbird-channel-header__title {
        width: 95px;
      }
    }
    .sendbird-channel-preview__avatar {
      display: none;
    }
    .sendbird-channel-preview__content {
      margin: 0;
    }
    .sendbird-channel-preview {
      width: 150px;
    }
  }
  :deep(.sendbird-app__conversation-wrap) {
    width: calc(100% - 150px);
    .sendbird-chat-header {
      padding: 10px;
    }
    .sendbird-conversation__messages {
      overflow: initial;
    }
    .sendbird-chat-header__left {
      margin: 0;
    }
  }
  :deep(.sendbird-app__settingspanel-wrap) {
    .sendbird-channel-settings {
      width: 250px;
    }
  }
}
</style>