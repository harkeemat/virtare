export default {
  patientInfoSuccess: false,
  patientsLoaderStatus: false,
  addPatientTabLoader:false,
  patientTabLoader:false,
  patientTimerStatus: "", // running, paused, stopped
  wantToChat: true,
  patientTimerValue: null,
  allPatientsList: [],
  criticalPatients: [],
  wnlPatients: [],
  moderatePatients: [],
  unknownPatients: [],
  patientInformation: null,
  createPatientLoading:false,
  patientsTab:'',
  manualTabchange: false,
  patientTabsEnabled: false,
  patientVitalsEnabled: false,
  patientDevicesEnabled: false,
  newPatientsMeta:null,
  criticalPatientsMeta:null,
  wnlPatientsMeta:null,
  moderatePatientsMeta:null,
  unknownPatientsMeta:364,
  createPatient: {
    isLoading: false,
    error:null,
    isCompleted:false,
  },
  statusDropDown:[],
  /** patient programs  */
  programs: [],
  programsLoading:false,
  patientProgram:{
  isLoading:false,
  error:{}
  },
  convertSystemUser:false,
  errorLog: null,
  skeleton:false,
  logBillingStatus:false,
  isBillingLogged:false,
  leaveDetailsPage:false,
  patientsFilter:[],
  referrals:[],
  patientVitalAttributes:[
  {
    name: 'Blood Pressure',
    deviceType: 'bloodPressure',
    attributes: [{
      systolic: '120-130',
      diastolic: '89-92',
      bpm: '75-85',
      assignedDate: 'April 27, 2023',
    }]
  },
  {
    name: 'Oxygen Saturation',
    deviceType: 'oximeter',
    attributes: [{
      spo2: '91-130',
      bpm: '---',
      assignedDate: 'April 27, 2023',
    }]
  },
  {
    name: 'Glucose',
    deviceType: 'glucose',
    attributes: [{
      fasting: '91-130',
      random: '90-160',
      preMeal: '91-130',
      postMeal: '---',
      beforeSleep: '---',
      assignedDate: 'April 27, 2023',
    }]
  },
  ],
}
