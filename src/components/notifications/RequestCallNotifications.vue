<template>
    <a-layout-content class="notications">
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">Request Call Notifications</h2>
                </a-col>
                <a-col :span="24">
                    <ul>
                        <div style="margin: 0 0 15px;" v-if="requestCall?.length>0">
                            <li class="listing " v-for="(reqCall, index) in requestCall" :key="index">
                                <div v-if="reqCall.patient?.fullName ">
                                    <div class="flex-grow-1 summary" style="padding:10px" v-if="reqCall?.patient?.id">
                                        <h3 >
                                            <router-link style="color:#267dff!important" class="bluecolor" :to="{ name: 'PatientSummary', params: { udid: reqCall.patient?.id  },query:{filter:filter} }">{{ reqCall.patient?.fullName  }}</router-link>
                                        </h3>
                                        <strong style="padding-left:15px">Time : </strong> {{ reqCall.contactTime?.name }}
                                    </div>
                                    <!-- </a> -->
                                    <div class="steps-action" style="padding-bottom:15px;margin-right:10px" v-if="reqCall?.patient?.id">
                                        <a-button style="margin-right: 10px" @click="rejectReqCall(reqCall.patient?.id,reqCall?.id)">{{'Reject'}}</a-button>
                                        <a-button type="primary" @click="requestCallNotification(reqCall.patient?.id,reqCall.patient?.fullName,reqCall?.id)">{{'Accept'}}</a-button>
                                    </div>
                                </div>
                            </li>
                        </div>
                        <div v-else class="noData">
                            <h3>No Data!</h3>
                        </div>

                    </ul>
                </a-col>
            </a-row>
        </div>
        <AddAppointment v-if="isAppointment" v-model:visible="isAppointment" @is-visible="closeModal($event)" :patientId="patientId" :patientName="patientName" />
    </a-layout-content>
</template>

<script>
import {
    onMounted,
    computed,
    ref
} from 'vue';
import {
    useStore
} from "vuex";
import {
    meridiemFormatFromTimestamp,
    dateOnlyFormat,
} from "@/commonMethods/commonMethod";
import AddAppointment from "@/components/modals/AddAppointment"
export default {
    components: {
        AddAppointment
    },
    setup() {
        const store = useStore();
        const isAppointment = ref(false);
        const patientId = ref()
        const patientName = ref()
        const date = Math.round(+new Date() / 1000);
        onMounted(() => {
            // store.dispatch("getNotifications")
        })
        const notifications = computed(() => {
            return store.state.common.getNotifications;
        });

        const requestCallNotification = (pId, value,id) => {
            isAppointment.value = true;
            patientId.value = pId
            patientName.value = value
            store.dispatch('isReadCallNotification',{patientId:pId,id:id}).then((resp)=>{
            if(resp==true){
              store.dispatch("requestCall");
            }
          })
        };

        function closeModal(status) {
            isAppointment.value = status.check
        }
        const rejectReqCall = (pId,id) =>{
          store.dispatch('isReadCallNotification',{patientId:pId,id:id}).then((resp)=>{
            if(resp==true){
              store.dispatch("requestCall");
            }
          })
        }
        return {
            requestCall: computed(() => {
                return store.state.appointment.requestCall
            }),
            rejectReqCall,
            patientId,
            patientName,
            closeModal,
            isAppointment,
            requestCallNotification,
            notifications,
            meridiemFormatFromTimestamp,
            dateOnlyFormat,
            date
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.noData{
  text-align: center;
}
.notications {
    ul {
        list-style: none;
        padding: 0;
        max-height: calc(100vh - 185px);
        overflow: auto;

        .listing {
            background-color: $gray-color-100;
            border-radius: 8px;
            margin: 0 0 15px;

            &:last-child {
                margin: 0;
            }

            &.read {
                a {
                    p {
                        font-family: $font-family-semi-bold;
                    }
                }
            }

            &.unread {
                background-color: $secondary-color;
            }

            a {
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
