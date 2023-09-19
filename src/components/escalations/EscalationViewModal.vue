<template>
    <a-modal width="1200px" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
        <div class="">
            <h1 style="text-align:center">Escalation Report</h1>
            <a-form ref="formRef" :model="escalationAction" layout="vertical" autocomplete="off"
                @finish="submitForm">
                <a-row>

                    <a-col :sm="24" :xs="24">
                        <div class="escalationForm">
                            <div class="patientDetails">
                                <img v-if="patient.patientDetails?.profilePhoto" :src="patient.patientDetails?.profilePhoto" alt="image" />
                                <img v-else src="@/assets/images/userAvatar.png" alt="image" />
                                <div class="info">
                                    <h2><a
                                            @click="showPatientModal(patient.patientDetails?.id)">{{ patient.patientDetails?.fullName }}</a>
                                    </h2>
                                    <p> <b>DOB : </b> <span>{{ patient.patientDetails?.patientDob }}</span></p>
                                    <p v-if="patient.patientDetails?.genderName"><b>Gender :</b>
                                        {{ patient.patientDetails?.genderName }}</p>
                                    <p><b>Escalation Date : </b> <span>{{ record?.createdAt }}</span></p>
                                    <p v-if=" escalation.singleEscalationRecord?.escalationClose "><b>Closed Date: </b> {{ escalation.singleEscalationRecord?.escalationClose }}</p>
                                    <p><b>Escalation Type : </b><a-tag
                                            :color="record?.color">{{ record?.type }}</a-tag> </p>

                                </div>
                                <div class="referalPhysicsan">
                                    <h2>Physician</h2>
                                    <p><b> Name : </b> <a
                                            @click="showStaffModal(userName.user?.staffUdid)">{{ userName.user?.name }}</a>
                                    </p>
                                    <p><b>Practice (Building): </b> </p>
                                </div>
                            </div>
                        </div>
                    </a-col>
                    <a-col :sm="24" :xs="24">
                        <h3>Reason for Escalation:</h3>
                        <p>{{ record?.reason }}</p>
                    </a-col>

                    <a-col :sm="24" :xs="24">
                        <h2 class="graphDetails">Latest Reading</h2>
                        <div class="mb-10" v-if="!patient.devices?.length > 0">
                            <a-alert
                                message="No devices are assigned to this Patient. Please assign device(s) to see Vitals."
                                type="error" />
                        </div>
                        <a-row v-else>
                            <!-- bloodOxygen -->
                            <a-col :sm="8" v-if="patient?.bloodOxygen?.length > 0">
                                <vue-speedometer :width="290" :height="230" :labelFontSize="12"
                                    :valueTextFontSize="13" :needleHeightRatio="0.6" :minValue="10"
                                    :maxValue="110"
                                    :value="patient?.bloodOxygen[0]?.oximeter_spo2 < 110 ? patient?.bloodOxygen[0]?.oximeter_spo2 : 110"
                                    :customSegmentStops='[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]'
                                    :segmentColors='["#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f5ad42", "#26bf28"]'
                                    :currentValueText="`SPO2 Level (` + patient?.bloodOxygen[0].takeDate + ' ' + patient?.bloodOxygen[0].takeOnlyTime + ')'"
                                    :customSegmentLabels='[
                                    
                                        {
                                            text: "10",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "20",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "30",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "40",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "50",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "60",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "70",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "80",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "90",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "100",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                    
                                    
                                    ]' :ringWidth="68" :needleTransitionDuration="3333" needleTransition="easeElastic"
                                    needleColor="#a7ff83" textColor="#000000" />
                            </a-col>
                            <a-col :sm="8" v-if="patient?.bloodOxygen?.length > 0">
                                <vue-speedometer :width="300" :height="230" :labelFontSize="12"
                                    :valueTextFontSize="13" :needleHeightRatio="0.6" :minValue="0"
                                    :maxValue="130"
                                    :value="patient?.bloodOxygen[0]?.oximeter_bpm < 130 ? patient?.bloodOxygen[0]?.oximeter_bpm : 130"
                                    :customSegmentStops='[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]'
                                    :segmentColors='["#f54b42", "#f54b42", "#f54b42", "#f54b42", "#f54b42", "#adf542", "#26bf28", "#26bf28", "#10b011", "#f5c842", "#f54b42", "#f54b42", "#f54b42"]'
                                    :currentValueText="`BPM Level (` + patient?.bloodOxygen[0].takeDate + ' ' + patient?.bloodOxygen[0].takeOnlyTime + ')'"
                                    :customSegmentLabels='[
                                    
                                        {
                                            text: "10",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "20",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "30",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "40",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "50",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "60",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "70",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "80",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "90",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "100",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "110",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "120",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "130",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                    
                                    
                                    ]' :ringWidth="68" :needleTransitionDuration="3333" needleTransition="easeElastic"
                                    needleColor="#a7ff83" textColor="#000000" />
                            </a-col>
                            <!-- bloodGlucose -->
                            <a-col :sm="8" v-if="patient?.bloodGlucose?.length > 0">
                                <vue-speedometer :width="290" :height="230" :labelFontSize="12"
                                    :valueTextFontSize="13" :needleHeightRatio="0.6" :minValue="0"
                                    :maxValue="200"
                                    :value="patient?.bloodGlucose[0]?.value < 200 ? patient?.bloodGlucose[0]?.value : 200"
                                    :customSegmentStops='[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]'
                                    :segmentColors='["#f54b42", "#f54b42", "#f54b42", "#f5ad42", "#10b011", "#10b011", "#f5ad42", "#f54b42", "#f54b42", "#f54b42"]'
                                    :currentValueText="`Glucose (` + patient?.bloodGlucose[0].takeDate + ' ' + patient?.bloodGlucose[0].takeOnlyTime + ')'"
                                    :customSegmentLabels='[
                                    
                                        {
                                            text: "20",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "40",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "60",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "80",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "100",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "120",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "140",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "160",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "180",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "200",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                    
                                    
                                    ]' :ringWidth="68" :needleTransitionDuration="3333" needleTransition="easeElastic"
                                    needleColor="#a7ff83" textColor="#000000" />
                            </a-col>
                            <!-- bloodPressure -->
                            <a-col :sm="8" v-if="patient?.bloodPressure?.length > 0">
                                <vue-speedometer :width="300" :height="230" :labelFontSize="12"
                                    :valueTextFontSize="13" :needleHeightRatio="0.6" :minValue="0"
                                    :maxValue="200"
                                    :value="patient?.bloodPressure[0]?.blood_pressure_systolic < 200 ? patient?.bloodPressure[0]?.blood_pressure_systolic : 200"
                                    :customSegmentStops='[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]'
                                    :segmentColors='["#f54b42", "#f58742", "#f5ad42", "#d4f542", "#90d42c", "#90d42c", "#d4f542", "#f58742", "#f57242", "#f54b42"]'
                                    :currentValueText="`BP(Systolic) (` + patient?.bloodPressure[0].takeDate + ' ' + patient?.bloodPressure[0].takeOnlyTime + ')'"
                                    :customSegmentLabels='[
                                    
                                        {
                                            text: "20",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "40",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "60",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "80",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "100",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "120",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "140",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "160",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "180",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "200",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                    
                                    
                                    ]' :ringWidth="68" :needleTransitionDuration="3333" needleTransition="easeElastic"
                                    needleColor="#a7ff83" textColor="#000000" />
                            </a-col>
                            <a-col :sm="8" v-if="patient?.bloodPressure?.length > 0">
                                <vue-speedometer :width="300" :height="230" :labelFontSize="12"
                                    :valueTextFontSize="13" :needleHeightRatio="0.6" :minValue="0"
                                    :maxValue="200"
                                    :value="patient?.bloodPressure[0]?.blood_pressure_diastolic < 200 ? patient?.bloodPressure[0]?.blood_pressure_diastolic : 200"
                                    :customSegmentStops='[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]'
                                    :segmentColors='["#f54b42", "#f58742", "#d4f542", "#90d42c", "#f5c842", "#f58742", "#f54b42", "#f54b42", "#f54b42", "#f54b42"]'
                                    :currentValueText="`BP(Diastolic) (` + patient?.bloodPressure[0].takeDate + ' ' + patient?.bloodPressure[0].takeOnlyTime + ')'"
                                    :customSegmentLabels='[
                                    
                                        {
                                            text: "20",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "40",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "60",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "80",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "100",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "120",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "140",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "160",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "180",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                        {
                                            text: "200",
                                            position: "INSIDE",
                                            color: "#333435",
                                        },
                                    
                                    
                                    ]' :ringWidth="68" :needleTransitionDuration="3333" needleTransition="easeElastic"
                                    needleColor="#a7ff83" textColor="#000000" />
                            </a-col>

                        </a-row>
                    </a-col>
                    <a-col :sm="24" :xs="8">
                        <h2 class="mb-10 ">Details </h2>
                    </a-col>
                    <a-col :sm="24" :xs="24">
                        <a-tabs v-model:activeKey="activeKey" type="card">
                            <a-tab-pane key="1" tab="Vitals">
                                <PatientVitalsGrid :isEscalationAction="true" :patientId="patientId"/>
                            </a-tab-pane>
                            <a-tab-pane key="2" tab="Notes" v-if="escalation?.escalationNots?.length>0">
                                <a-table :scroll="{ x: 900 }" class="sortIconTable" rowKey="id" :columns="escalation.notesColumns"
                                    :data-source="escalation.escalationNots" :pagination="false">
                                    <template #addedBy="{ record }">
                                        <a @click="showStaffModal(record.addedById)">{{ record.addedBy }}</a>
                                    </template>
                                    <template #color="{ record }">
                                        <span>{{ record.flag }}</span>
                                    </template>
                                </a-table>
                            </a-tab-pane>
                            <a-tab-pane key="3" tab="Flags" v-if="escalation?.escalationFlags?.length>0">
                                <a-table  :scroll="{ x: 900 }" class="sortIconTable" rowKey="id" :columns="escalation.flagColumns"
                                    :data-source="escalation.escalationFlags" :pagination="false">
                                    <template #name="{ record }">
                                        <span>{{ record.flagName }}</span>
                                    </template>
                                    <template #color="{ record }">
                                        <a-tooltip placement="bottom">
                                            <template #title>
                                                <span>{{ record.flagName }}</span>
                                            </template>
                                            <a class="icons">
                                                <Flags :flag="record.color" />
                                            </a>
                                        </a-tooltip>
                                    </template>
                                </a-table>
                            </a-tab-pane>
                            <a-tab-pane key="4" tab="Care Plans" v-if="escalation?.escalationCarePlan?.length>0">
                                <a-table  :scroll="{ x: 900 }" class="sortIconTable" rowKey="id" :columns="escalation.carePlanColumns"
                                    :data-source="escalation.escalationCarePlan" :pagination="false">
                                </a-table>
                            </a-tab-pane>

                            <a-tab-pane key="5" tab="Escalation" v-if="escalation?.escalationList?.length>0">
                                <a-table  :scroll="{ x: 1200 }" class="sortIconTable" rowKey="id" :columns="escalation.columnData"
                                    :data-source="escalation.escalationList" :pagination="false">
                                    <template #patientName="{ record }"
                                        v-if="arrayToObjact(screensPermissions, 405)">
                                        <!-- <router-link v-if="record.patient?.id " :to="{ name: 'PatientSummary', params: { udid: record.patient?.id } }">{{ record.patient.fullName?.length>12?record.patient?.fullName.substring(0,15)+'...':record.patient?.fullName}}</router-link> -->
                                        <a @click="showPatientModal(record.patient?.id)" class="nameInfoIcon"
                                            v-if="record.patient?.id">
                                            {{
                                                record.patient.fullName?.length > 12 ? record.patient?.fullName.substring(0, 12) + '...' : record.patient?.fullName
                                            }}
                                        </a>

                                    </template>
                                    <!-- <template #escalationStaff="{ record }" v-else>
                                            <span v-for="esc,i in record.escalationStaff.data" :key="esc.id">
                                                {{i==0?' ':','}} <span>{{ esc.staffName }}</span>
                                            </span>
                                        </template> -->
                                    <template #assignedBy="{ record }"
                                        v-if="arrayToObjact(screensPermissions, 408)">
                                        <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedBy?.id } }">{{ record.assignedBy.fullName.length>10?record.assignedBy.fullName.substring(0,10)+'...':record.assignedBy.fullName }}</router-link> -->
                                        <a v-if="record.assignedBy"
                                            @click="showStaffModal(record.assignedBy.id)" class="nameInfoIcon">
                                            {{
                                                record.assignedBy.fullName.length > 10 ? record.assignedBy.fullName.substring(0, 10) + '...' : record.assignedBy.fullName
                                            }}
                                        </a>
                                    </template>
                                    <template #escalationAssignedTo="{ record }"
                                        v-if="arrayToObjact(screensPermissions, 408)">
                                        <a v-if="record.escalationAssignTo?.length > 0"
                                            @click="showDetails(record.escalationAssignTo)">{{ record.escalationAssignTo[0]?.staff.fullName.substring(0, 10) + '...' }}</a>
                                    </template>
                                    <template #escalationType="{ record }">
                                        <span>{{ record.type }}</span>
                                    </template>
                                    <template #reason="{ record }">
                                        <a-tooltip placement="bottom">
                                            <template #title>
                                                <span>{{ record.reason }}</span>
                                            </template>
                                            <a class="icons">
                                                {{ record.reason?.length > 30 ? record.reason.substring(0, 30) + '...' : record.reason }}
                                            </a>
                                        </a-tooltip>
                                    </template>
                                </a-table>
                            </a-tab-pane>
                        </a-tabs>
                    </a-col>
                    <a-col :span="24">
                        <a-row v-if="record?.status != 'Responded'">
                            <a-col :span="24">
                                <h2 class="mb-10 mt-28">Action Required</h2>
                            </a-col>
                            <a-col :sm="24" :xs="24" :xl="24">
                                <div class="form-group">
                                    <a-form-item label="Choose Action" name="action"
                                        :rules="[{ required: true, message: 'Action' + ' ' + $t('global.validation') }]">
                                        <GlobalCodeDropDown @change="checkChangeInput()"
                                            v-model:value="escalationAction.action" :dataId="76"
                                            @handleGlobalChange="handleGlobalChange($event)"
                                            style="width: 100%;" />
                                    </a-form-item>
                                </div>
                            </a-col>

                            <a-col :sm="24" :xm="24" v-if="escalationAction.action">
                                <div class="form-group">
                                    <a-form-item label="Note" name="note"
                                        :rules="[{ required: true, message: $t('tasks.tasksModal.longDescription') + ' ' + $t('global.validation') }]">
                                        <a-textarea v-model:value="escalationAction.note"
                                            placeholder="Description" :auto-size="{ minRows: 3 }"
                                            @change="checkChangeInput()" />
                                    </a-form-item>
                                </div>
                            </a-col>

                            <a-col :sm="24" :xs="24" style="padding-top: 10px">
                                <div class="text-right">
                                    <a-button @click="cancel">Cancel</a-button>
                                    <a-button type="primary" html-type="submit"
                                        style="margin-left: 10px">{{ $t('global.submit') }}</a-button>
                                </div>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <Loader />
        <ViewDetails :arrayData="escalationAssignToData" v-if="viewModal" v-model:visible="viewModal" />
    </a-modal>
</template>

<script>
import {
    defineAsyncComponent,
    defineComponent,
    reactive,
    ref,
    computed,
    onMounted,
    watchEffect
} from "vue";
import {
    useStore
} from "vuex";
import {
    arrayToObjact,
    showPatientModal,
    showStaffModal,
} from "@/commonMethods/commonMethod";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import Flags from "@/components/common/flags/Flags";
import PatientVitalsGrid from "@/components/patients/patientSummary/views/PatientVitalsGrid"
import Loader from "@/components/loader/Loader";
import { useRoute } from "vue-router";
export default defineComponent({
    components: {
        PatientVitalsGrid,
        Flags,
        Loader,
        GlobalCodeDropDown,
        ViewDetails: defineAsyncComponent(() =>
            import("@/components/escalations/ViewDetails.vue")
        ),
    },
    props:{
        patientId:String
    },
    setup(props, { emit }) {
        const store = useStore();
        const route = useRoute();
        const formRef = ref();
        const activeKey = ref('1');
        const viewModal = ref(false);
        const escalationAssignToData = ref();
        const counter = ref(1)
        const userName = JSON.parse(localStorage.getItem("auth"))
        const escalationAction = reactive({
            action: '',
            appointment: false,
            note: "",
            carePlanNote: "",
            medicationNote: "",
            dietNote: "",
        });

        onMounted(() => {
            // 
        });

        const escalation = computed(() => {
            return store.state.escalations;
        })
        const record = computed(() => {
            return store.state.escalations.singleEscalationRecord;
        })

        const patient = computed(() => {
            return store.state.patients;
        })

        watchEffect(() => {
            if (patient.value.patientDetails?.id && counter.value == 1) {
                // store.dispatch('patientDetails', patient.value.patientDetails?.id)
                store.dispatch("devices", patient.value.patientDetails?.id).then((resp) => {
                    if (resp == true) {
                        store.dispatch("patientVitals", {
                            patientId: patient.value.patientDetails?.id,
                            deviceType: 99,
                            filter: "",
                        });
                        store.dispatch("patientVitals", {
                            patientId: patient.value.patientDetails?.id,
                            deviceType: 100,
                            filter: "",
                        });
                        store.dispatch("patientVitals", {
                            patientId: patient.value.patientDetails?.id,
                            deviceType: 101,
                            filter: "",
                        });
                    }
                });
                counter.value++
            }
        })

        const submitForm = () => {
            let data = {
                action: escalationAction.action,
                note: escalationAction.note,
                physician: userName.user.staffUdid
            }
            store.dispatch("submitActionForm", {
                data: data,
                escalationId: record.value.id

            }).then((resp) => {
                if (resp == true) {
                    store.dispatch("escalation")
                    emit("saveViewModal", false)
                }
            })
        }

        const closeModal = () => {
            emit("saveViewModal", false);
            if (route.name != "PatientSummary") {
                store.state.patients.patientDetails =null
            }
        }

        const cancel = () => {
            emit("saveViewModal", false);
            if (route.name != "PatientSummary") {
                store.state.patients.patientDetails =null
            }
        }



        function checkChangeInput() {
            store.commit('checkChangeInput', true)
        }

        const handleGlobalChange = (data) => {
            escalationAction.action = data;
        }

        function showDetails(data) {
            viewModal.value = true;
            store.state.escalations.getAuditData = null
            escalationAssignToData.value = data.map(item => {
                item.name = item.staff?.fullName
                item.designation = item.staff?.designation
                item.specialization = item.staff?.specialization
                return item
            });
        }

        return {
            counter,
            showDetails,
            viewModal,
            escalationAssignToData,
            closeModal,
            userName,
            handleGlobalChange,
            patient,
            cancel,
            record,
            escalation,
            activeKey,
            formRef,
            escalationAction,
            submitForm,
            arrayToObjact,
            showPatientModal,
            showStaffModal,
            checkChangeInput,
            screensPermissions: store.getters.screensPermissions,
        };
    },
});
</script>
<style lang="scss" scoped>
.escalationForm {
    .patientDetails {
        display: flex;
        border-bottom: 1px solid #e3e3e3;
        padding: 20px 0;
        margin: 0 0 20px;
        @media (max-width:767px) {
            flex-wrap: wrap;
        }
        img {
            height: 100px;
            width: 100px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 15px;
        }
        .info {
            padding: 0 15px 0 0;
            @media (max-width:767px) {
                padding: 0 0 15px;
            }
            
        }
        .referalPhysicsan {
            @media (min-width:767px) {
                padding: 0 0 0 15px;
                border-left: 1px solid #e3e3e3;
            }
            @media (max-width:767px) {
                border-top: 1px solid #e3e3e3;
                padding: 15px 0 0;
                width:100%;
            }
        }
    }
    
}

.graphDetails {
    padding: 20px 0 0;
    border-top: 1px solid #e3e3e3;
    margin: 20px 0 20px;

}
</style>