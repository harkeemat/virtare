
<template>
<a-dropdown v-if="count <= 3" :trigger="['click']" overlayClassName="valueItem">
    <a class="ant-dropdown-link one" @click.prevent>
        <div class="dropdown">
            <p>
                <strong><span>{{cardRecords.appointmentType}}</span></strong>
                <span>{{cardRecords.patient}} </span>
            </p>
            <img src="../../assets/images/profile-1.jpg" alt="image" />
        </div>
    </a>
    <template #overlay>
        <a-menu>
            <a-menu-item key="1">
                <div class="calendarDropdown">
                    <div class="itemWrapper">
                        <div class="leftWrapper">Appointment Type</div>
                        <div class="rightWrapper">{{cardRecords.appointmentType}}</div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Date Time</div>
                        <div class="rightWrapper">
                            {{ dateAndTimeFormate(cardRecords.date,'MMM DD, yyyy hh:mm A')}}

                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Coordinator</div>
                        <div class="rightWrapper" v-if="arrayToObjact(screensPermissions,38)">
                        <a @click="showStaffModal(cardRecords.staff_id)" >{{ cardRecords.staff }}</a>
                            <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid:cardRecords.staff_id}}">{{cardRecords.staff}}</router-link> -->
                        </div>
                        <div class="rightWrapper" v-else>
                            <span >{{cardRecords.staff}}</span>
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Patient</div>
                        <div class="rightWrapper" v-if="arrayToObjact(screensPermissions,63)">
                         <a @click="showPatientModal( cardRecords.patient_id)" >{{ cardRecords.patient }}</a>
                            <!-- <router-link :to="{ name: 'PatientSummary', params: { udid:cardRecords.patient_id}}">{{cardRecords.patient}}</router-link> -->
                        </div>
                        <div class="rightWrapper" v-else>
                            <span >{{cardRecords.patient}}</span>
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Start Time</div>
                        <div class="rightWrapper">{{ dateAndTimeFormate(cardRecords.date,'hh:mm A') }} {{cardRecords?.abbr}}</div>
                    </div>
                    <!-- <div class="itemWrapper">
                        <div class="leftWrapper">Time Zone</div>
                        <div class="rightWrapper">{{ cardRecords.timezone?'('+cardRecords.timezone.data.abbr+')':''}}</div>
                    </div> -->
                    <div class="itemWrapper">
                        <div class="leftWrapper">Duration</div>
                        <div class="rightWrapper">{{ cardRecords.duration }}</div>
                    </div>
                    <div class="itemWrapper">
                      <div class="leftWrapper">Priority</div>
                      <div class="rightWrapper">
                         <span >{{ cardRecords.flagName }}</span>
                      </div>
                    </div>
                    <div class="itemWrapper" v-if="cardRecords.flags">
                      <div class="leftWrapper">Flag</div>
                      <div class="rightWrapper">
                        <span class="box" :title="cardRecords.flagName" :style="{ 'background-color': cardRecords.flags }"></span>
                      </div>
                    </div>
                    <div class="notesWrapper">
                        <span>Notes</span>
                        <p>
                            {{cardRecords.notes}}
                        </p>
                    </div>
                    
                    <!-- <div class="createTask">
                        <a-tooltip placement="left">
                            <template #title>
                                <span>Add Task</span>
                            </template>
                            <router-link to="tasks">
                                <FileAddOutlined />
                            </router-link>
                        </a-tooltip>
                    </div> -->
                    <div >
                        <a-tooltip placement="left">
                            
                            <button v-if="cardRecords?.appoinmentStatus" class="ant-btn ant-btn-primary" disabled>{{cardRecords.appoinmentStatus}}</button>
                            <button v-else class="ant-btn ant-btn-primary" @click="changeStatus(cardRecords)">Appointment Status</button>
                        </a-tooltip>
                    </div>
                </div>
            </a-menu-item>
        </a-menu>
    </template>
</a-dropdown>
<div v-else-if="count==4">
    <a-button class="loadMore" type="primary" @click="showModal(allRecord)">{{length-4}}+</a-button>
</div>
<div v-else></div>
<!-- <a-modal width="1100px" centered v-model:visible="visible" title="Appointment" @ok="handleOk" maskClosable="true" @cancel="closeModal()">
    <a-table rowKey="id" :columns="columns" :data-source="getMoreAppointment">
      <template #staff="{text,record}" >
        <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.staff_id  }}">{{ text }}</router-link>
    </template>
    <template #patient="{ text, record }" v-if="arrayToObjact(screensPermissions, 63)">
            <router-link :to="{ name: 'PatientSummary', params: { udid: record.patient_id } }">{{ text }}</router-link>

        </template>
      <template #flags="{ record }">
        
         <a-tooltip placement="bottom">
                <template #title>
                    <span>{{ record.flagName }}</span>
                </template>
                <a class="icons">
                    <Flags :flag="record.flags"/></a>
            </a-tooltip>
       
      </template>
    </a-table>
</a-modal> -->

<AppointmentListing v-model:visible="visible" :appointments="getMoreAppointment" v-if="getMoreAppointment"/>
</template>
<script>
import { ref, reactive, computed ,createVNode} from "vue";
//import { FileAddOutlined } from "@ant-design/icons-vue";
import { dateAndTimeFormate,arrayToObjact,showStaffModal,showPatientModal } from "@/commonMethods/commonMethod";

import { useStore } from "vuex";
import AppointmentListing from "@/components/appoinment-calendar/modals/AppointmentListing"
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
const columns = [
  {
    title: "Appointment Type",
    dataIndex: "appointmentType",
    key: "appointmentType",
  },
  {
    title: "Care Coordinator",
    dataIndex: "staff",
    key: "staff",
    slots: {
      customRender: "staff",
    },
  },
  {
    title: "Patient",
    dataIndex: "patient",
    key: "patient",
    slots: {
      customRender: "patient",
    },
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    customRender: ({ record }) => {
      return dateAndTimeFormate(record.date, "MMM DD, yyyy");
    },
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Start Time",
    dataIndex: "date",
    customRender: ({ record }) => {
      return dateAndTimeFormate(record.date, "hh:mm A");
    },
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    ellipsis: true,
  },
  {
    title: "Flags",
    dataIndex: "flags",
    key: "flags",
    slots: {
      customRender: "flags",
    },
  },
];
export default {
  components: {
    //FileAddOutlined,

    AppointmentListing
  },
  props: {
    cardData: {
      type: Object,
    },
    count: {
      type: Number,
    },
    length: {
      type: Number,
    },
    tabName: {
      type: String,
    },
    data: {
      type: Array,
    },
  },
  setup(props) {
    const visible = ref(false);
    const store = useStore();
    const allRecord = reactive(props.data);
    const cardRecords = reactive(props.cardData);
    const tab = reactive(props.tabName);

    function showModal(appointmentRecord) {
      //appointment show after 4 records
      store.dispatch("showMoreRecords", {
        data: appointmentRecord,
        to: 4,
      });
      visible.value = true;
    }
    const getMoreAppointment = computed(() => {
      return store.state.appointment.showMoreRecords;
    });

    function closeModal() {
      store.state.appointment.showMoreRecords = "";
    }
    function changeStatus(event){
      Modal.confirm({
                title: 'Please indicate appointment status: Attended or Not Attended.',
                icon: createVNode(ExclamationCircleOutlined),
                
                okText: 'Attended',
                cancelText: 'Not Attended',
                onOk() {

                store.dispatch("appointmentStatus",{id:event.udid,data:{appoinmentStatus:1}})
                cardRecords.appoinmentStatus = "Attended"
                },
                onCancel() {
                    store.dispatch("appointmentStatus",{id:event.udid,data:{appoinmentStatus:2}})
                    cardRecords.appoinmentStatus = "Not Attended"
                },
                class: 'modalH-auto',
            });
    }
    return {
      showPatientModal,
      showStaffModal,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      visible,
      getMoreAppointment,
      allRecord,
      tab,
      showModal,
      cardRecords,
      columns,
      closeModal,
      dateAndTimeFormate,
      changeStatus
    };
  },
};
</script>
