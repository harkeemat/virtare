<template>
    <a-modal width="95%" title="Messages" centered :maskClosable="false" @cancel="closeModal()" class="chatModal"
        :footer="false">
        <a-row :gutter="24">
            <a-col :xl="24" :lg="24">
                <div class="timer">
                    <h3>
                        {{ $t("patientSummary.currentSession") }} :
                        {{ formattedElapsedTime }}
                    </h3>
                    <a-button v-if="showStartTimer && !showPauseTimer" type="primary" @click="startTimer">{{
                        $t("patientSummary.startTimer")
                    }}</a-button>
                    <a-button v-if="showPauseTimer" type="primary" @click="pauseTimer">{{
                        $t("patientSummary.pauseTimer")
                    }}</a-button>
                    <a-button v-if="showResumeTimer && !showStartTimer" type="primary" @click="startTimer">{{
                        $t("patientSummary.resumeTimer")
                    }}</a-button>
                    <a-button v-if="!showStartTimer" type="primary" id="timer" @click="stopTimer">{{
                        $t("patientSummary.stopTimer")
                    }}</a-button>
                </div>
            </a-col>
        </a-row>
        <div class="replyScreen">
            <div class="videoWrapper chatBox2">
                <div class="leftWrapper" id="videoDiv">
                    <div class="chatBox" ref="scroll" id="chatBox">
                        <ChatScreenBody :conversationList="reverseRecord(conversationList)"
                            :communication="communication" screen="withPatient" :patientId="patientId"
                            :communicationId="communicationId" />
                        <a-form ref="formRef" class="messageBox" :model="formValue" layout="vertical" @finish="sendMsg"
                            @finishFailed="taskFormFailed">
                            <div class="sendMessage">
                                <a-input v-model:value="formValue.msgSend" size="large" placeholder="Type Message"
                                    isDisabled>
                                    <template #addonAfter>
                                        <SendOutlined @click="sendMsg" />
                                    </template>
                                </a-input>
                            </div>
                            <!-- <div class="sendMessage" v-if="auth.user.id == receiverId || auth.user.id == senderId">
                            <a-input v-model:value="formValue.msgSend" size="large" placeholder="Type Message">
                                <template #addonAfter>
                                    <SendOutlined @click="sendMsg" />
                                </template>
                            </a-input>
                        </div>
                        <div class="sendMessage" v-else>
                            <a-input v-model:value="formValue.msgSend" size="large" placeholder="Type Message" disabled>
                                <template #addonAfter disabled>
                                    <SendOutlined @click="sendMsg" />
                                </template>
                            </a-input>
                        </div> -->
                        </a-form>
                    </div>
                </div>

                <ChatRightPanel :idPatient="patientUdid" :communication="communication" :isChat="true" />
            </div>
        </div>
        <Loader />
    </a-modal>
</template>

<script>
import { SendOutlined } from "@ant-design/icons-vue";
import ChatScreenBody from "@/components/communications/ChatScreenBody";
import {
    watchEffect,
    reactive,
    ref,
    onUnmounted,
    computed,
    toRefs,
    onMounted,
} from "vue";
import { useStore } from "vuex";
import {
    dateFormat,
    actionTrack,
    // enCodeString,
    getSeconds,
} from "@/commonMethods/commonMethod";
import Loader from "@/components/loader/Loader";
import moment from "moment";
import ChatRightPanel from "@/components/common/communications/ChatRightPanel";
import { useRoute } from "vue-router";
// import { warningSwal } from '../../commonMethods/commonMethod'
// import { messages } from '../../config/messages'

export default {
    components: {
        ChatRightPanel,
        SendOutlined,
        Loader,
        ChatScreenBody,
    },
    props: {
        communication: {
            type: Object,
        },
        conversationId: {
            type: Number,
        },
        idPatient: {
            type: Number,
        },
        timer: {
            type: String,
        },
    },
    setup(props, { emit }) {
        const store = useStore();
        const route = useRoute();
        route.params.from = "";
        route.params.typeId = "";
        localStorage.setItem("isChatOpened", true);
        const formValue = reactive({
            msgSend: "",
        });
        const notesDetailVisible = ref(false);
        const documentDetailVisible = ref(false);
        const patientVitalsVisible = ref(false);
        const patientAppointmentsVisible = ref(false);
        const timelineDetailVisible = ref(true);
        const addPinModalVisible = ref(false);
        const patientUdid = ref(null);
        const patientId = props.idPatient ? reactive(props.idPatient) : ref(null);
        const communications = reactive(props.communication);
        const communicationId = props.conversationId
            ? reactive(props.conversationId)
            : props.communication.id;
        const isCommunicationWithPatient = ref(false);
        const conversationList = ref([]);
        const routeName = route.name;
        const tabvalue = reactive({
            tab: [],
        });
        const showStartTimer = computed(() => {
            return store.state.common.showStartTimer;
        });
        const showPauseTimer = computed(() => {
            return store.state.common.showPauseTimer;
        });
        const showResumeTimer = computed(() => {
            return store.state.common.showResumeTimer;
        });

        const patient = ref(null);
        if (communications.is_sender_patient) {
            patient.value = communications.fromId;
        } else if (communications.is_receiver_patient) {
            patient.value = communications.toId;
        }

        const pendingApprovalStatus = computed(() => {
            return store.state.common.pendingApprovalStatus;
        });

        const appMessage = computed(() => {
            return store.state.common.appMessage;
        });

        // Countdown Timer Start and Stop
        const elapsedTime = ref(0);
        const timer = ref(undefined);

        const formattedElapsedTime = computed(() => {
            const date = new Date(null);
            date.setSeconds(elapsedTime.value / 1000);
            const utc = date.toUTCString();
            return props.timer ? props.timer : utc.substr(utc.indexOf(":") - 2, 8);
        });

        function startTimer() {
            emit("startTimer");
            timer.value = setInterval(() => {
                elapsedTime.value += 1000;
            }, 1000);
            store.commit("showPauseTimer", true);
            store.commit("showStartTimer", false);
            store.commit("showResumeTimer", false);
        }

        const stopTimer = () => {
            emit("stopTimer");
            if (routeName != "PatientSummary") {
                store
                    .dispatch("timeApproval", {
                        staff: auth.user.staffUdid,
                        patient: patient.value,
                        time: getSeconds(formattedElapsedTime.value),
                        type: appMessage.value,
                        status: pendingApprovalStatus.value,
                        entityType: "communication",
                        referenceId: communicationId,
                    })
                    .then(() => {
                        clearInterval(timer.value);
                        elapsedTime.value = 0;
                        store.commit("showStartTimer", true);
                        store.commit("showPauseTimer", false);
                        store.commit("showResumeTimer", false);
                    });
            }
        };

        const pauseTimer = () => {
            emit("pauseTimer");
            store.commit("showResumeTimer", true);
            store.commit("showPauseTimer", false);
            clearInterval(timer.value);
        };

        const showNotesModal = () => {
            store.commit("loadingStatus", true);
            notesDetailVisible.value = true;
            documentDetailVisible.value = false;
            patientVitalsVisible.value = false;
            patientAppointmentsVisible.value = false;
            timelineDetailVisible.value = false;
            store.commit("loadingStatus", false);
        };

        const showDocumentsModal = () => {
            store.commit("loadingStatus", true);
            documentDetailVisible.value = true;
            notesDetailVisible.value = false;
            patientVitalsVisible.value = false;
            patientAppointmentsVisible.value = false;
            timelineDetailVisible.value = false;
            store.commit("loadingStatus", false);
        };
        const showVitalsModal = () => {
            patientVitalsVisible.value = true;
            patientAppointmentsVisible.value = false;
            notesDetailVisible.value = false;
            documentDetailVisible.value = false;
            timelineDetailVisible.value = false;
        };
        const showAppointments = () => {
            patientVitalsVisible.value = false;
            patientAppointmentsVisible.value = true;
            notesDetailVisible.value = false;
            documentDetailVisible.value = false;
            timelineDetailVisible.value = false;
        };
        const addPin = () => {
            addPinModalVisible.value = true;
        };

        const showTimelineModal = () => {
            store.commit("loadingStatus", true);
            patientVitalsVisible.value = false;
            notesDetailVisible.value = false;
            documentDetailVisible.value = false;
            timelineDetailVisible.value = true;
            store.commit("loadingStatus", false);
        };

        const scroll = ref();
        const auth = JSON.parse(localStorage.getItem("auth"));
        let interval = setInterval(() => {
            store.dispatch("latestmessage", communicationId).then(() => {
               
                store.getters.latestmessage.value.map((item) => {
                    conversationList.value.push(item);
                });
                store.getters.latestmessage.value.length > 0 ? getScroll() : "";
            });
            // getScroll()
        }, 2000);

        const tableContent = ref(null);
        const list = computed(() => {
            return store.state.communications.conversationList;
        });
        const meta = store.getters.messagesMeta;
        var record = [];
        var scroller = "";
        watchEffect(() => {
           
            // store.state.communications.conversationList = []
            // store.dispatch("conversation", communicationId).then(()=>{

            //  // list.conversationList.reverse()
            //   conversationList.value = list.conversationList.reverse()
            // })
            tableContent.value = document.getElementsByClassName("chatBoxInner");
            //getScroll()
            if (list.value.length > 0) {
                setTimeout(() => {
                    var tableContent1 = document.querySelector(".chatBoxInner");
                
                    tableContent1.addEventListener("scroll", (event) => {
                        let currentScroll = event.target.scrollTop;

                        if (currentScroll < 3) {
                            let current_page = meta.value.current_page + 1;

                            if (current_page <= meta.value.total_pages) {
                                scroller = event.target.scrollHeight;
                                store.state.communications.messagesMeta = "";
                                record = conversationList.value;

                                store.state.communications.conversationList = [];
                                store
                                    .dispatch(
                                        "conversation",
                                        communicationId + "&page=" + current_page
                                    )
                                    .then(() => {
                                        loadMoredata();
                                    });
                            }
                        }
                    });
                }, 4000);
            }
        });

        function loadMoredata() {
            const newData = list.value;

            newData.forEach((element) => {
                record.push(element);
            });

            conversationList.value = record;
            setTimeout(() => {
                tableContent.value[0].scrollTop = scroller - 10;
            }, 10);
        }

        function getScroll() {
            setTimeout(() => {
                if (
                    tableContent.value &&
                    tableContent.value[0].scrollTop <
                    tableContent.value[0].scrollHeight + 10 ==
                    true
                ) {
                    tableContent.value[0].scrollTop =
                        tableContent.value[0].scrollHeight + 10;
                }
            }, 1000);
        }

        function sendMsg() {
            if (formValue.msgSend) {
                conversationList.value.push({
                    conversationId: communicationId,
                    senderId: auth.user.id,
                    message: formValue.msgSend,
                    type: "text",
                    isRead: 0,
                    createdAt: "Today, " + moment().format("HH:mm A"),
                });
                store.dispatch("conversationSend", {
                    conversationId: communicationId,
                    message: formValue.msgSend,
                    type: "text",
                });
                formValue.msgSend = "";
                getScroll();
            }
            //conversationList.value = list.conversationList
        }

        function closeModal() {
            localStorage.removeItem("isChatOpened");
            store.state.communications.conversationList = [];
            clearInterval(interval);
            addPinModalVisible.value = false;
            localStorage.removeItem("patientUdid");
            if (!showStartTimer.value && routeName != "PatientSummary") {
                store
                    .dispatch("timeApproval", {
                        staff: auth.user.staffUdid,
                        patient: patient.value,
                        time: getSeconds(formattedElapsedTime.value),
                        type: appMessage.value,
                        status: pendingApprovalStatus.value,
                        entityType: "communication",
                        referenceId: communicationId,
                    })
                    .then(() => {
                        emit("is-visible", false);
                    });
            }
        }

        onMounted(() => {
          
            if (!showStartTimer.value && routeName != "PatientSummary") {
                startTimer();
            }
            store.commit("loadingStatus", false);
            setTimeout(() => {
                store.commit("loadingStatus", false);
            }, 3000);
            store.dispatch("conversation", communicationId + "&page=").then(() => {
                // list.conversationList.reverse()
                conversationList.value = list.value;

                getScroll();
            });
            if (communications.is_sender_patient) {
                patientUdid.value = communications.fromId;
                patientId.value = communications.senderId;
                isCommunicationWithPatient.value = true;
            } else if (communications.is_receiver_patient) {
                patientUdid.value = communications.toId;
                patientId.value = communications.receiverId;
                isCommunicationWithPatient.value = true;
            } else {
                isCommunicationWithPatient.value = false;
            }

            if (isCommunicationWithPatient.value) {
                store.dispatch("patientDetails", patientUdid.value);
                store.dispatch("patientTimeline", {
                    id: patientUdid.value,
                    type: "",
                });
            }
        });

        onUnmounted(() => {
            if (route.name != "PatientSummary") {
                store.commit("showStartTimer", false);
                store.commit("showPauseTimer", true);
                store.commit("showResumeTimer", false);
                // stopTimer()
                clearInterval(interval);
            }
        });

        const flagsList = computed(() => {
            return store.state.flags.flagsList;
        });

        const patientPins = computed(() => {
            return store.state.patients.patientCriticalNotes;
        });

        const patientFlag = ref(null);
        flagsList.value?.forEach((flag) => {
            if (flag.name == "Normal") {
                patientFlag.value = flag.id;
            }
        });

        function reverseRecord(data) {
            return data.sort(function (a, b) {
                return a.id - b.id;
            });
        }

        const isDisabled =
            auth.user.id == communications.receiverId ||
                auth.user.id == communications.senderId
                ? true
                : false;

        return {
            // enCodeString,
            list,
            sendMsg,
            formValue,
            dateFormat,
            closeModal,
            auth,
            scroll,
            showNotesModal,
            showDocumentsModal,
            showVitalsModal,
            showAppointments,
            addPin,
            showTimelineModal,
            addPinModalVisible,
            patientUdid,
            patientId,
            notesDetailVisible,
            documentDetailVisible,
            patientVitalsVisible,
            timelineDetailVisible,
            ...toRefs(tabvalue),
            patientPins,
            patientAppointmentsVisible,
            conversationList,
            reverseRecord,
            communicationId,
            isDisabled,
            formattedElapsedTime,
            actionTrack,
            startTimer,
            stopTimer,
            pauseTimer,
            showStartTimer,
            showPauseTimer,
            showResumeTimer,
            routeName,
        };
    },
};
</script>

<style scoped>

.chatBox {
    height: auto !important;
    max-height: 100% !important;
}

.patientTimeline {
    width: 100% !important;
}

.chatBox .chatBoxInner {
    min-height: calc(100vh - 390px) !important;
    overflow: auto !important;
}

.callButton {
    margin-bottom: 20px;
}

.callRightWrapper .patientTimeline .ant-timeline {
    overflow: unset !important;
}

.callRightWrapper .header .patientInfo .patientImg .info {
    margin-left: -50px !important;
}

span.dragImg {
    display: none !important;
    z-index: 9;
}

.messageBox {
    position: sticky;
}

.float-right {
    position: relative;
    top: -30px;
    float: right;
    right: 50px;
}

.timer {
    font-size: 13px !important;
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 0 0 10px;
}
</style>
