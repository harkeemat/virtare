export default {
  escalationCounter: 0,
  escalation: null,
  escalationStaus: null,
  escalationMeta: null,
  escalationAuditMeta:null,
  addBasicEscalation: null,
  esacalationFlagList: null,
  escalationNotesList: null,
  esacalationCarePlansList: null,
  escalationVitalList: null,
  singleEscalationRecord: null,
  singleEscalationDataArray: null,
  escalationList:null,
  escalationNots: null,
  escalationVitals: null,
  escalationCarePlan: null,
  editEscalationStaff: null,
  editEscalationPatient: null,
  editEscalationDetails: null,
  editSecondStepper: null,
  getAuditData:null,
  escalationAudit:null,
  escalationHistory:null,
  escalationDateFilter:null,
  columnData : [{
    title: "Patient",
    dataIndex: "patientName",
    sorter: true,
    slots: {
        customRender: "patientName",
    },
},
{
  title: "Type",
  dataIndex: "escalationType",
  sorter: true,
  slots: {
      customRender: "escalationType",
  },
},
{
title: "Date",
dataIndex: "createdAt",
sorter: true,
},
{
  title: "Created By",
  dataIndex: "assignedBy",
  sorter: true,
  slots:{
      customRender: "assignedBy",
  },
  },
{
title: "Send To",
dataIndex: "assignedTo",
sorter: true,
slots:{
    customRender: "escalationAssignedTo",
},
},
{
  title: "Reason",
  dataIndex: "reason",
  sorter: true,
  slots: {
      customRender: "reason",
  },
},
{
  title: "Status",
  dataIndex: "status",
  sorter: true,
  slots: {
      customRender: "status",
  },
},

{
  title: "Action Taken",
  dataIndex: "takenAction",
  sorter: true,
  slots: {
      customRender: "takenAction",
  },
},

// {
//   title: "Audit",
//   dataIndex: "audit",
//   slots: {
//       customRender: "audit",
//   },
// },

{
  title: "Loop Closed",
  dataIndex: "closeLoop",
  slots: {
      customRender: "closeLoop",
  },
},

{
    title: "Escalation Report",
    dataIndex: "action",
    slots: {
        customRender: "action",
    },
    
},
],
  staffColumns: 
  [{
      title: 'Name',
      dataIndex: 'name',
      slots: {
        customRender: 'name'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: 'Designation',
    //   dataIndex: 'designation',
    //   slots: {
    //     customRender: 'designation'
    //   },
    //   filterMultiple: false,
    //   onFilter: (value, record) => record.designation.indexOf(value) === 0,
    //   sorter: (a, b) => a.designation.localeCompare(b.designation),
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      slots: {
        customRender: 'specialization'
      },
      // sorter: true,
      filterMultiple: false,
      onFilter: (value, record) => record.specialization.indexOf(value) === 0,
      sorter: (a, b) => a.specialization.localeCompare(b.specialization),
      sortDirections: ['descend', 'ascend'],
    },
    // 	{
    // 		title: 'Network',
    // 		dataIndex: 'network',
    //   sorter: true
    // 	},


  ],
  careCircleColumns: [{
      title: 'Name',
      dataIndex: 'name',
      slots: {
        customRender: 'name'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: 'Designation',
    //   dataIndex: 'designation',
    //   slots: {
    //     customRender: 'designation'
    //   },
    //   filterMultiple: false,
    //   onFilter: (value, record) => record.designation.indexOf(value) === 0,
    //   sorter: (a, b) => a.designation.localeCompare(b.designation),
    //   sortDirections: ['descend', 'ascend'],
    // },

    {
      title: 'Specialization',
      dataIndex: 'specialization',
      slots: {
        customRender: 'specialization'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.specialization.indexOf(value) === 0,
      sorter: (a, b) => a.specialization.localeCompare(b.specialization),
      sortDirections: ['descend', 'ascend'],
    },


  ],
  providerColumns: [{
      title: 'Name',
      dataIndex: 'fullName',
      slots: {
        customRender: 'name'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      slots: {
        customRender: 'location'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.location.indexOf(value) === 0,
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Address',
      dataIndex: 'address',
      filterMultiple: false,
      onFilter: (value, record) => record.address.indexOf(value) === 0,
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ['descend', 'ascend'],
    },


  ],
  escalationStaffs: null,
  careCircle: null,
  escReferral: null,
  // specialist: null,
  patientVital: null,
  appointment: null,
  patientFlag: null,
  vitalColumns : [

    {
      title: "Device Type",
      dataIndex: "deviceType",
      key: "deviceType",
      className: "vital-deviceType",
      width:"5%",
      filters: [
        {
          text: "Glucose",
          value: "Glucose",
        },
        {
          text: "Oximeter",
          value: "Oximeter",
        },
        {
          text: "Blood Pressure",
          value: "Blood Pressure",
        },
        // {
        //   text: "Weight",
        //   value: "weight",
        // },
      ],
      filterMultiple: true,
      onFilter: (value, record) => record.deviceType.indexOf(value) === 0,
      sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
      sortDirections: ['descend', 'ascend'],
    },
    
    {
      title: "Vital",
      dataIndex: "vitalField",
      key: "vitalField",
      className: "vital-vitalField",
      width:"5%",
      filters: [{
        text: "Blood Pressure",
        value: "BPM",
      },
      {
        text: "Spo2",
        value: "SPO2",
      },
      // {
      //   text: "Glucose",
      //   value: "Glucose",
      // },
      // {
      //   text: "Weight",
      //   value: "weight",
      // },
    ],
      
      filterMultiple: true,
      onFilter: (value, record) => record.vitalField.indexOf(value) === 0,
      sorter: (a, b) => a.vitalField.localeCompare(b.vitalField),
      sortDirections: ['descend', 'ascend'],
    },
    
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      className: "vital-value",
      width:"5%",
      filterMultiple: false,
      onFilter: (value, record) => record.value.indexOf(value) === 0,
      sorter: (a, b) => a.value - b.value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Date/Time",
      dataIndex: "takeTime",
      width:"5%",
      onFilter: (value, record) => record.takeTime.indexOf(value) === 0,
      sorter: (a, b) => a.takeTime.localeCompare(b.takeTime),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Color",
      dataIndex: "color",
      width:"5%",
      key: "color",
      className: "vital-color",
      slots: {
        customRender: "color",
      },
    },
  ],

  bloodPressureColumns: [
    {
      title: "Time & Date Vitals Taken",
      dataIndex: "time",
      key: "2",
    },
    {
      title: "Systolic",
      dataIndex: "systolic",
      sorter: true,
      key: "3",
    },
    {
      title: "Diastolic",
      dataIndex: "diastolic",
      sorter: true,
      key: "4",
    },
    {
      title: "BPM",
      dataIndex: "bpm",
      sorter: true,
      key: "5",
    },
  ],
  bloodPressureSource: [
    {
      key: "1",
      time: "Jul 19, 2022, 11:18 PM",
      systolic: "120",
      diastolic: "90",
      bpm: "66",
    },
    {
      key: "2",
      time: "Jul 19, 2022, 12:18 PM",
      systolic: "110",
      diastolic: "95",
      bpm: "70",
    },
  ],
  notesColumns: [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      className: "note-date",
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      className: "note-category",
      filterMultiple: false,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      className: "note-type",
      filters: [{
          text: "Vitals",
          value: "Vitals",
        },
        {
          text: "Appointment",
          value: "Appointment",
        },
        {
          text: "Flag",
          value: "Flag",
        },
        {
          text: "Timelog",
          value: "timelog",
        }],
      filterMultiple: true,
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      className: "note-text",
      slots: {
        customRender: "note",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.note.indexOf(value) === 0,
      sorter: (a, b) => a.note.localeCompare(b.note),
      sortDirections: ['descend', 'ascend'],
      ellipsis: true,
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      key: "addedBy",
      slots: {
        customRender: "addedBy",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.addedBy.indexOf(value) === 0,
      sorter: (a, b) => a.addedBy.localeCompare(b.addedBy),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Priority",
      dataIndex: "color",
      slots: {
        customRender: "color",
      },
      filters: [{
          text: "High",
          value: "High",
        },
        {
          text: "Medium",
          value: "Medium",
        },
        {
          text: "Low",
          value: "Low",
        },
      ],
    },
  ],

  carePlanColumns: [
    {
      title: "Device",
      dataIndex: "deviceType",
      filterMultiple: false,
      onFilter: (value, record) => record.deviceType.indexOf(value) === 0,
      sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Vital Type",
      dataIndex: "vitalField",
      filterMultiple: false,
      onFilter: (value, record) => record.vitalField.indexOf(value) === 0,
      sorter: (a, b) => a.vitalField.localeCompare(b.vitalField),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      sorter: true,
      slots: {
        customRender: "frequency",
      },
    },
    {
      title: "High Value",
      dataIndex: "highValue",
      filterMultiple: false,
      onFilter: (value, record) => record.highValue.indexOf(value) === 0,
      sorter: (a, b) => a.highValue - b.highValue,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Low Value",
      dataIndex: "lowValue",
      filterMultiple: false,
      onFilter: (value, record) => record.lowValue.indexOf(value) === 0,
      sorter: (a, b) => a.lowValue - b.lowValue,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Note",
      dataIndex: "note",
      filterMultiple: false,
      onFilter: (value, record) => record.note.indexOf(value) === 0,
      sorter: (a, b) => a.note.localeCompare(b.note),
      sortDirections: ['descend', 'ascend'],
    },
  ],
  flagColumns: [
    {
      title: "Name",
      dataIndex: "flagName",
      
      filterMultiple: false,
      onFilter: (value, record) => record.flagName.indexOf(value) === 0,
      sorter: (a, b) => a.flagName.localeCompare(b.flagName),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Note",
      dataIndex: "reason",
      filterMultiple: false,
      onFilter: (value, record) => record.reason.indexOf(value) === 0,
      sorter: (a, b) => a.reason.localeCompare(b.reason),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Color",
      dataIndex: "color",
      slots: {
        customRender: "color",
      },
    },
  ],

  specialistColumn: [{
      title: "Name",
      dataIndex: "name",
      // sorter: true,
      slots: {
        customRender: "name",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: "Designation",
    //   dataIndex: "designation",
    //   // sorter: true,
    //   slots: {
    //     customRender: "designation",
    //   },
    //   filterMultiple: false,
    //   onFilter: (value, record) => record.designation.indexOf(value) === 0,
    //   sorter: (a, b) => a.designation.localeCompare(b.designation),
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: "Specialization",
      dataIndex: "specialization",
      // sorter: true,
      slots: {
        customRender: "specialization",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.specialization.indexOf(value) === 0,
      sorter: (a, b) => a.specialization.localeCompare(b.specialization),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Organization",
      dataIndex: "organisation",
      // sorter: true,
      slots: {
        customRender: "organisation",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.organisation.indexOf(value) === 0,
      sorter: (a, b) => a.organisation.localeCompare(b.organisation),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Location",
      dataIndex: "location",
      // sorter: true,
      slots: {
        customRender: "location",
      },
      filterMultiple: false,
      onFilter: (value, record) => record.location.indexOf(value) === 0,
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ['descend', 'ascend'],
    },
  ],
  addAssignTo:null,
  escalationSpecialist:null,
  submitActionForm:null
}
