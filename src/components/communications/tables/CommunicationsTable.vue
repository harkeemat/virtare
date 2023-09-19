<template>
  <a-row>
    <a-col :span="24">
      <a-table class="sortIconTable" rowKey="id" :columns="communicationsColumns" :data-source="communicationsData" :scroll="{ x: 1500 }" @change="onChange" />
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'type'">
          <span>
            <smile-outlined />
            Type
          </span>
        </template>
      </template>
    </a-col>
  </a-row>
</template>

<script>
const communicationsColumns = [
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Message Category",
    dataIndex: "message",
    sorter: {
      compare: (a, b) => a.message - b.message,
      multiple: 3,
    },
  },
  {
    title: "Patient",
    dataIndex: "patient",
    sorter: {
      compare: (a, b) => a.patient - b.patient,
      multiple: 2,
    },
  },
  {
    title: "Sent To",
    dataIndex: "sentto",
    sorter: {
      compare: (a, b) => a.sentto - b.sentto,
      multiple: 1,
    },
  },
    {
    title: "Sent",
    dataIndex: "sent",
    sorter: {
      compare: (a, b) => a.sent - b.sent,
      multiple: 1,
    },
  },
    {
    title: "Appt Type, Date, Time",
    dataIndex: "appt",
    sorter: {
      compare: (a, b) => a.appt - b.appt,
      multiple: 1,
    },
  },
  {
    title: "Resend",
    dataIndex: "resend",
    sorter: {
      compare: (a, b) => a.resend - b.resend,
      multiple: 1,
    },
  },
];
const communicationsData = [
  {
    key: "1",
    type:"",
    status: "Delievered",
    message:"Appointment Reminder",
    patient: "John",
    sentto: 22998876654,
    sent: "Nov 11, 2021 - 11:30 Am",
    appt: "OLS APPT TYPE Nov 11, 2021 - 11:30 Am",
    resend: 70,
  },
  {
    key: "2",
    type:"",
    status: "Voice Mail",
    message:"Recall Reminder",
    patient: "Smith",
    sentto: 22998876654,
    sent: "Nov 11, 2021 - 11:30 Am",
    appt: "OLS APPT TYPE Nov 11, 2021 - 11:30 Am",
    resend: 70,
  },
  {
    key: "3",
    type:"",
    status: "Sent",
    message:"Patient Message",
    patient: "Steve",
    sentto: 22998876654,
    sent: "Nov 11, 2021 - 11:30 Am",
    appt: "OLS APPT TYPE Nov 11, 2021 - 11:30 Am",
    resend: 70,
  },
  {
    key: "4",
    type:"",
    status: "Sent",
    message:"Portal Invitation",
    patient: "Robert",
    sentto: 22998876654,
    sent: "Nov 11, 2021 - 11:30 Am",
    appt: "OLS APPT TYPE Nov 11, 2021 - 11:30 Am",
    resend: 70,
  },
];
export default {
  setup() {
    return {
      communicationsData,
      communicationsColumns,
    };
  },
}
</script>