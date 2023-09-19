<template>
<a-modal max-width="1140px" width="98%" title="Video Call"  centered :footer="false" :maskClosable="false" @cancel="hangUp()">
   
       
            <a-row>
                <a-col :span="24" :xl="12" :lg="24">
                    <div class="videoCallHeading">
                        <h2 class="pageTittle">Video Call</h2>
                        <span></span><img width="30" src="../../assets/images/flag-orange.svg" />
                    </div>
                </a-col>
                <a-col :xl="12" :lg="24">
                    <div class="timer">
                        <h3>{{$t('patientSummary.currentSession')}} : {{formattedElapsedTime}}</h3>
                    </div>
                </a-col>
            </a-row>
            <div class="videoWrapper">
                <!-- video call  -->'
                <div class="leftWrapper" id="videoDiv">
                    <div class="videoCall">
                        <video id="videoCallLoader" ref="videoCall" ></video>
                    </div>
                    <div class="footer">
                        <a-button class="endCall" :size="size" block @click="hangUp()">End Call</a-button>
                    </div>
                </div>
                <ChatRightPanel v-if="patientId" :idPatient="patientId" :currentUrl="currentUrl" />
            </div>
            <Loader />
      
</a-modal>
</template>

<script>
import {
  ref,
  toRefs,
  onMounted,
  computed,
  reactive,
  watchEffect,
  onUnmounted,
} from "vue";
// import {
//   useRouter,
// } from "vue-router";
import { useStore } from "vuex";
import Loader from "@/components/loader/VideoLoader";
// import { Web } from "@/assets/js/sip-0.20.0";
import { notification } from "ant-design-vue";
import { successSwal, deCodeStringVideoURL,enCodeStringVideoURL } from "@/commonMethods/commonMethod";
import { message } from "ant-design-vue";
import moment from "moment";
import ChatRightPanel from "@/components/common/communications/ChatRightPanel";
const Web ={}
export default {
  components: {
    Loader,
    ChatRightPanel,
  },
  props: {
    conferenceId: String,
  },

  setup(props) {
    // the DOM element(video) will be assigned to the ref after initial render
    const sipDomain = import.meta.env.VITE_APP_SIP_DOMAIN;
    const store = useStore();
    const videoCall = ref();
    const decodedUrl = ref();
    const visibleDrawer = ref(false);
    // const router = useRouter();
    const profile = ref(false);
    const tabvalue = reactive({
      tab: [],
    });
    //copy url
    const currentUrl = ref();
    async function copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        message.success("Copied");
      } catch ($e) {
        message.error("Cannot copy");
      }
    }
    //end url

    const upcomingCallDetails = reactive({
      user: "",
    });

    const simpleUserHangup = ref();
    const session = computed(() => {
      return store.state.authentication.simpleUser;
    });

    const authentication = computed(() => {
      return store.state.authentication;
    });

    const guestUser = computed(() => {
      return store.state.videoCall;
    });

    const acceptVideoCallDetails = computed(() => {
      return store.state.videoCall.acceptVideoCallDetails;
    });

    // Countdown Timer
    const elapsedTime = ref(0);
    const timer = ref(undefined);

    const formattedElapsedTime = computed(() => {
      const date = new Date(null);
      date.setSeconds(elapsedTime.value / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    });

    onMounted(() => {
      profile.value = true;
    //   localStorage.setItem("barmenu", JSON.stringify(true));
      if (props.conferenceId) {
        store
          .dispatch("guestUser", {
            conference: props.conferenceId,
            name: authentication.value.loggedInUser.user.name,
            email: authentication.value.loggedInUser.user.email,
          })
          .then(() => {
            if(props.conferenceId){
              // store.dispatch("getVideoDetails", props.conferenceId);
            }
            store.commit("videoLoadingStatus", true);
            if (props.conferenceId) {
              currentUrl.value = window.location.origin + '/#/video-call/'+enCodeStringVideoURL(props.conferenceId);
              decodedUrl.value = props.conferenceId;
              let callNotification = 0;
              const key = `open${Date.now()}`;
              authentication.value.options = Web.SimpleUserOptions = {
                aor: `sip:${guestUser.value.guestUser.sipId}@${sipDomain}`,
                media: {
                  constraints: {
                    audio: true,
                    video: true,
                  },
                  remote: {
                    video: videoCall.value ? videoCall.value : null//<video> </video>,
                  },
                },
                delegate: {
                  onCallHangup: async () => {
                    if (callNotification == 1) {
                      notification.close(key);
                    } else {
                      store.state.videoCall.getVideoDetails = null;
                      store.state.videoCall.acceptVideoCallDetails = null;
                      //call end api
                      store.dispatch("callNotification", {
                        id: decodedUrl.value,
                        status: "end",
                      });
                      successSwal("Call Ended! Thank You");
                    //   router.push("/dashboard");
                    }
                  },
                },
                userAgentOptions: {
                  displayName: guestUser.value.guestUser.sipId,
                  authorizationPassword: "123456",
                  authorizationUsername: guestUser.value.guestUser.sipId,
                  sessionDescriptionHandlerFactoryOptions: {
                    peerConnectionOptions: {
                      rtcConfiguration: {
                        iceServers: [
                          {
                            urls: "stun:stun.xten.com",
                          },
                          {
                            urls: "turn:numb.viagenie.ca",
                            username: "mailto:webrtc@live.com",
                            credential: "muazkh",
                          },
                        ],
                      },
                    },
                  },
                },
              };

              // Construct a SimpleUser instance
              const simpleUser = new Web.SimpleUser(
                authentication.value.server,
                authentication.value.options
              );
              // Connect to server and place call
              simpleUser
                .connect()
                .then(() => {
                  simpleUser.register().then(() => {
                    //call start api/
                    startTimer();
                    store.dispatch("callNotification", {
                      id: decodedUrl.value,
                      status: "start",
                    });
                    simpleUser.call(`sip:${decodedUrl.value}@${sipDomain}`);
                    simpleUserHangup.value = simpleUser;
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
            //   router.push("/dashboard");
            }
            //} //end conference video call
          });
      } else if (session.value) {
        session.value.options.media.remote = {
          video: videoCall.value ? videoCall.value : null//<video> </video>,
        };
        //getting upcoming call user details
        upcomingCallDetails.user =
          session.value.session.incomingInviteRequest.message.from.uri.raw.user;
        store
          .dispatch(
            "acceptVideoCallDetails",
            upcomingCallDetails.user.substring(2)
          )
          .then((resp) => {
            if (resp == true) {
              //start one to one callstatus api
              startTimer();
              store.dispatch("startCall", {
                id: acceptVideoCallDetails.value.patient.id,
                status: "start",
              });
            }
          });
        session.value.answer();
      }
    });

    // Answer call
    function hangUp() {
      if (decodedUrl.value) {
        simpleUserHangup.value.hangup().then(() => {
          //call end api
          store.state.videoCall.getVideoDetails = null;
          store.state.videoCall.acceptVideoCallDetails = null;
          store.state.videoCall.conferenceId = null;
          store.state.videoCall.guestUser = null;
        });
      } else {
        session.value.hangup().then(() => {
          //end one to one call status api
          store.dispatch("startCall", {
            id: acceptVideoCallDetails.value.patient.id,
            status: "end",
          });
        //   router.push("/dashboard");
        });
      }
    }

    const getVideoDetails = computed(() => {
      return store.state.videoCall.getVideoDetails;
    });

    const patientUdid = computed(() => {
      return store.state.videoCall.getVideoDetails.patientUdid;
    });

    const patientId = ref(null);

    // used for patient vital
    watchEffect(() => {
      if (getVideoDetails.value || acceptVideoCallDetails.value) {
        patientId.value = getVideoDetails.value
          ? getVideoDetails.value.patientUdid
          : acceptVideoCallDetails.value.patient.id;
        store.dispatch(
          "patientDetails",
          getVideoDetails.value
            ? getVideoDetails.value.patientUdid
            : acceptVideoCallDetails.value.patient.id
        );
        store.dispatch("timeLineType");
        store.dispatch("patientTimeline", {
          id: getVideoDetails.value
            ? getVideoDetails.value.patientUdid
            : acceptVideoCallDetails.value.patient.id,
          type: "",
        });
      }
    //   if (JSON.parse(localStorage.getItem("barmenu")) == true) {
    //     document.body.classList.add("show");
    //   }
      if (getVideoDetails.value != null) {
        videoLoader();
        store.dispatch("patientVitals", {
          patientId: getVideoDetails.value.patientDetailed.id,
          deviceType: 99,
          filter: ""
        });
        store.dispatch("patientVitals", {
          patientId: getVideoDetails.value.patientDetailed.id,
          deviceType: 100,
          filter: ""
        });
        store.dispatch("patientVitals", {
          patientId: getVideoDetails.value.patientDetailed.id,
          deviceType: 101,
          filter: ""
        });
        store.dispatch("devices", getVideoDetails.value.patientDetailed.id);
      } else if (acceptVideoCallDetails.value != null) {
        videoLoader();
        store.dispatch("patientVitals", {
          patientId: acceptVideoCallDetails.value.patient.id,
          deviceType: 99,
          filter: ""
        });
        store.dispatch("patientVitals", {
          patientId: acceptVideoCallDetails.value.patient.id,
          deviceType: 100,
          filter: ""
        });
        store.dispatch("patientVitals", {
          patientId: acceptVideoCallDetails.value.patient.id,
          deviceType: 101,
          filter: ""
        });
        store.dispatch("devices", acceptVideoCallDetails.value.patient.id);
      }
    }); //end

    function videoLoader() {
      // start loader untill load video element
      let MuteInterval = setInterval(function () {
        //start loader
        store.commit("videoLoadingStatus", true);
        if (!document.querySelector("#videoCallLoader").paused) {
          //remove loder
          store.commit("videoLoadingStatus", false);
          clearInterval(MuteInterval);
        }
      }, 3000);
    }

    onUnmounted(() => {
      store.commit("videoLoadingStatus", false);
    //   localStorage.setItem("barmenu", JSON.stringify(false));
      store.state.videoCall.getVideoDetails = null;
      store.state.videoCall.acceptVideoCallDetails = null;
      store.state.videoCall.conferenceId = null;
      store.state.videoCall.guestUser = null;
      profile.value = false;
    });

    const patientTimeline = computed(() => {
      return store.state.patients.patientTimeline;
    });

    function chnageTab() {
      store.commit("loadingTableStatus", true);
      store
        .dispatch("patientTimeline", {
          id: getVideoDetails.value.patientUdid,
          type: tabvalue.tab.length == 0 ? "" : tabvalue.tab.join(","),
        })
        .then(() => {
          store.commit("loadingTableStatus", false);
        });
    }
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });

    function startTimer() {
      timer.value = setInterval(() => {
        elapsedTime.value += 1000;
      }, 1000);
    }

    return {
        enCodeStringVideoURL,
      patientDetails,
      chnageTab,
      ...toRefs(tabvalue),
      timeLineType: store.getters.timeLineType,
      patientUdid,
      moment,
      patientTimeline,
      visibleDrawer,
      guestUser,
      videoLoader,
      decodedUrl,
      copyURL,
      currentUrl,
      deCodeStringVideoURL,
      acceptVideoCallDetails,
      upcomingCallDetails,
      getVideoDetails,
      simpleUserHangup,
      hangUp,
      videoCall,
      size: ref("large"),
      patientId,
      formattedElapsedTime,
    };
  },
};
</script>

<style lang="scss">
.timer {
  font-size: 13px !important;
  float: right;
}

.overFlow {
  height: 500px;
  overflow: auto;
}

.bold {
  font-weight: bold;
}
</style>
