
import {
  meridiemFormatFromTimestamp,
  dateOnlyFormat,
  dateFormat,
  dobFormat,
  dobFormat2,
  convertResponse,
  convertData,
  convertChartResponse,
  timestampToDate,
  globalDateFormat,
  dateAndTimeFormate,
  dateOnlyFormatSImple,
  fullDateTimeFormat,
  deCodeString,
  key
} from '@/commonMethods/commonMethod';
import moment from 'moment';
import commonState from "@/store/common/state.js"

export const addDemographic = (state, data) => {
  //let providerArray = []
  data.contactTime = data.contactTimeId
  state.addDemographic = data
  state.addDemographic.lastName = state.addDemographic.lastName ? deCodeString(key,state.addDemographic.lastName) : '',
  state.addDemographic.firstName = state.addDemographic.firstName ? deCodeString(key,state.addDemographic.firstName) : '',
  state.addDemographic.middleName = deCodeString(key,state.addDemographic.middleName)
  state.addDemographic.patientFullName = state.addDemographic.lastName +', '+state.addDemographic.firstName +' '+state.addDemographic.middleName
  state.addDemographic.providers=[state.addDemographic?.provider?.udid]
//   providerArray.push({
//   udid:state.addDemographic?.provider?.udid,lable:state.addDemographic?.provider?.name
// })
// state.addDemographic.providerArray = providerArray
  //patient.providerArray = providerArray
}
export const status = (state, data) => {
  state.status = data
}


export const patient = (state, data) => {
  state.column = [
    {
      title: "Patient Status",
      dataIndex: "flags",
      slots: {
        customRender: "flags",
      },
      width: '140px',
      align:"center"
      
    },
    {
      title: "Reading Time", // VRH-2047 update colmn name
      dataIndex: "flagTmeStamp",
      slots: {
        customRender: "flagTmeStamp",
      },
      width: '150px',
      sorter: true,
      
    },
    {
      title: "Name",
      dataIndex: "fullName",
      slots: {
        customRender: "fullName",
      },
      sorter: true,
      width: '140px',
    },
    {
      title: "Readings ",
      dataIndex: "patientVitals",
      slots: {
        customRender: "patientVitals",
      },
      children: [
        {
          title: "BP(mmHg)",
          dataIndex: "bp",
          key: "bp",
          width: '120px',
          align: 'right',
          sorter: true,
        },
        {
          title: "BPM",
          dataIndex: "bpm",
          key: "bpm",
          width: '70px',
          align: 'right',
          sorter: true,
        },
        
        {
          title: "Spo2(%)",
          dataIndex: "spo2",
          key: "spo2",
          width: '100px',
          align: 'right',
          sorter: true,
        },
        {
          title: "Glucose(mg/dL)",
          dataIndex: "glucose",
          key: "glucose",
          width: '150px',
          align: 'right',
          sorter: true,
        },
        
        {
          title: "Weight(LBS)",
          dataIndex: "weight",
          key: "weight",
          sorter:true,
          width: '130px',
          align: 'right'
        },
      ],
    },
 
    {
      title: "Compliant",
      dataIndex: "nonCompliance",
      slots: {
        customRender: "compliance",
      },
      width: '120px',
      sorter:true,
    },
    {
      title: "Last Message",
      dataIndex: "lastMessageSent",
      ellipsis: true,
      width: '160px',
      slots: {
        customRender: "lastMessageSent",
      },
      sorter:true,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    },
    {
      title: "Age ",
      dataIndex: "age",
      sorter: true,
      width: '80px',
      align: 'right'
    },
    {
      title: "Gender ",
      dataIndex: "genderName",
      width: '100px',
    },
    {
      title:"Action ",
      dataIndex: "actions",
      slots: {
        customRender: "action",
      },
      width: '100px',
    }
  ];
  state.patientMeta = data.meta.pagination;
  state.patientList = data.data.map(element => {
      const flagTimeStamp = element.flagTmeStamp
      element.isActive= element.isActive=='Active' ? true : false,
      element.flags = element.flagColor,
        element.lastName = element.lastName ? deCodeString(key,element.lastName) : '',
        element.firstName = element.firstName ? deCodeString(key,element.firstName) : '',
        element.middleName = deCodeString(key,element.middleName)
        element.fullName = element.lastName +', '+element.firstName +' '+element.middleName
        // element.flagTmeStamp = 'September 30, 2022 12:30 PM',
        element.flagTmeStamp = element.flagTmeStamp ? dateFormat(element.flagTmeStamp) : '',
        element.lastReadingDate = element.lastReadingDate ? element.lastReadingDate : '',
        element.weight = element.weight ? element.weight : '',

        element.bp = element.patientVitals.data.length > 0 ?element.patientVitals.data.map(vitalData => { if (vitalData.vitalField == 'Systolic') { return JSON.parse(vitalData.value) } if (vitalData.vitalField == 'Diastolic') { return '/' + JSON.parse(vitalData.value) } }):'',
        element.bpm = element.patientVitals.data.length > 0 ?element.patientVitals.data.map(vitalData => { if (vitalData.vitalField == 'BPM') { return JSON.parse(vitalData.value) }}):'',
        element.spo2 = element.patientVitals.data.length > 0 ?element.patientVitals.data.map(vitalData => { if (vitalData.vitalField == 'SPO2') { return JSON.parse(vitalData.value) } }):'',
        element.glucose = element.patientVitals.data.length  > 0? element.patientVitals.data.map(vitalData => {  if (vitalData.deviceType == 'Glucose') { return JSON.parse(vitalData.value) } }) : '',
        element.glucose = element.glucose !=''?element.glucose.filter(vitalData => {  if (typeof vitalData !== 'undefined') { return vitalData } }):'',
        element.glucose = element.glucose.length >0 ? element.glucose[element.glucose.length-1]:''
        if(flagTimeStamp != null && flagTimeStamp != "") {
          const flagTimeDate = dateOnlyFormatSImple(flagTimeStamp)
          const todayDate = moment().format('yyyy-MM-DD')
          if(todayDate >= flagTimeDate && element.flagName == 'Critical') {
            const flagTimeDateTime = fullDateTimeFormat(flagTimeStamp)
            const todayDateTime = moment().format('HH')
            const addedHours = moment(flagTimeDateTime).add(2, 'hours').format('HH')
            if(todayDateTime >= addedHours) {
              element.isBlackFlag = true
            }
            else {
              element.isBlackFlag = false
            }
          }
        }
      return element
    })

}

export const updateDemographic = (state, data) => {
  state.updateDemographic = data
}

export const programList = (state, data) => {
  data.id = data.udid
  state.programList = data
}

export const counterPlus = (state) => {
  state.counter++
}

export const counterMinus = (state) => {
  state.counter--
}

export const resetCounter = (state) => {
  state.counter = 0
}


export const addPatientProgram = (state, data) => {
  state.addPatientProgram = data
}


export const programPatients = (state, data) => {
  state.programsPatient = []
  state.program = data.map(element => {

    const program = (element.program).split(" - ")[0]
    if (!state.programsPatient.includes(program)) {
      state.programsPatient.push(program);
    }
    
    element.status = element.status == 1 ? 'Active' : 'Inactive'
    element.onboardingScheduleDate = element.onboardingScheduleDate ? dateOnlyFormat(element.onboardingScheduleDate) : ""
    element.dischargeDate = element.dischargeDate ? dateOnlyFormat(element.dischargeDate) : "",
    element.renewalDate = element.renewalDate ? dateOnlyFormat(element.renewalDate) : ""
    return element;
  })
  state.columns = [
    {
      title: "Program Name",
      dataIndex: "program",
    },
    {
      title: "Onboarding scheduled date",
      dataIndex: "onboardingScheduleDate",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewalDate",
    },
    // {
    //   title: "End Date",
    //   dataIndex: "end",
    // },
    {
      title: "Discharge Date",
      dataIndex: "dischargeDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      slots: {
        customRender: "action",
      },
    },
  ];
}


export const addDevice = (state, data) => {
  state.addDevice = data
}

export const inventoryList = (state, data) => {
  state.inventoryList = data
}




export const devices = (state, data) => {

  state.devices = data.map(element => {
    element.status = element.status == 1 ? true : false
    return element;
  })

  state.devicesColumns = [
    {
      title: "Device Type",
      dataIndex: "deviceType",
    },
    {
      title: "Model No",
      dataIndex: "modelNumber",
    },
    {
      title: "MAC Address",
      dataIndex: "macAddress",
    },
    {
      title: "Active/Inactive",
      dataIndex: "active",
      slots: {
        customRender: "active",
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      slots: {
        customRender: "action",
      },
    },
  ];

}


export const parameterFields = (state, data) => {
  state.parameterFields = data.map((item) => { if (item != null) return item })
}

export const changeStatus = (state, data) => {
  state.changeStatus = data
}




export const addClinicalHistory = (state, data) => {
  state.addClinicalHistory = data
}

export const clinicalHistoryList = (state, data) => {
  state.clinicalHistoryList = data
  state.clinicalHistoryListColumns = [
    {
      title: "History",
      dataIndex: "history",
      className: "medicalHistory",
      slots: {
        customRender: "history",
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      className: "medicalHistoryAction",
      slots: {
        customRender: "action",
      },
    },
  ];
}


export const addClinicalMedicat = (state, data) => {
  state.addClinicalMedicat = data
}



export const clinicalMedicatList = (state, data) => {
  state.clinicalMedicatList = data.map(element => {
    element.startDate = element.startDate?dateOnlyFormat(element.startDate):'',
      element.endDate = element.endDate?dateOnlyFormat(element.endDate):''
    return element;
  })
  state.clinicalMedicatListColumns = [
    {
      title: "Medication List",
      dataIndex: "medicine",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      slots: {
        customRender: "frequency",
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      slots: {
        customRender: "action",
      },
    },
  ];
}


export const addInsurance = (state, data) => {
  state.addInsurance = data
}

export const updateInsurance = (state, data) => {
  state.updateInsurance = data
}

export const patientInsurance = (state, insurances) => {
  let insuranceData = {
    insuranceNumber: [],
    insuranceName: [],
    expirationDate: [],
    insuranceType: [],
  };
  insurances.map(insurance => {
    insuranceData.expirationDate.push(insurance.expirationDate)
    insuranceData.insuranceName.push(insurance.insuranceNameId)
    insuranceData.insuranceNumber.push(insurance.insuranceNumber)
    insuranceData.insuranceType.push(insurance.insuranceTypeId)
  })
  state.patientInsurance = insuranceData
}


export const addDocument = (state, data) => {
  state.addDocument = data
}

export const documents = (state, data) => {
  state.documents = data
  state.documentColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Document",
      dataIndex: "document",
      slots: {
        customRender: "document",
      },
    },
    {
      title: "	Type",
      dataIndex: "type",
    },
    {
      title: "	Tags",
      dataIndex: "tags",
      slots: {
        customRender: "tags",
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      slots: {
        customRender: "action",
      },
    },
  ];
}

export const uploadFile = (state, data) => {
  state.uploadFile = data
}
export const patientDetails = (state, patient) => {
  let providerArray =[]
  patient.phoneNumber = patient.phoneNumber ? patient.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : "";
  patient.country = patient.countryId ? patient.countryId : null;
  patient.state = patient.stateId ? patient.stateId : null;
  patient.language = patient.languageId ? patient.languageId : null;
  patient.gender = patient.genderId ? patient.genderId : null;
  patient.contactTime = patient.contactTimeId.length > 0 ? patient.contactTimeId : [];
  patient.contactType = patient.contactType.length > 0 ? patient.contactType : [];
  patient.otherLanguage = patient.otherLanguage.length > 0 ? patient.otherLanguage : [];
  patient.patientDob = patient.dob ? dobFormat(patient.dob) : null;
  patient.isApp = patient.isApp ? true : false;
  patient.lastName = patient.lastName ? deCodeString(key,patient.lastName) : '',
  patient.firstName = patient.firstName ? deCodeString(key,patient.firstName) : '',
  patient.middleName = deCodeString(key,patient.middleName)
  patient.patientFullName = patient.lastName +', '+patient.firstName +' '+patient.middleName
  patient.providers = [patient?.provider?.udid]
 

  providerArray.push({
  udid:patient?.provider?.udid,lable:patient?.provider?.name
})
   patient.providerArray = providerArray
  state.patientDetails = patient

}

export const responsiblePerson = (state, data) => {
  const responsiblePerson = data.map(item => {
    item.gender = item.genderId;
    item.relation = item.relationId;
    item.self = item.self ? true : false;
    item.lastName = item.lastName ? deCodeString(key,item.lastName) : '',
    item.firstName = item.firstName ? deCodeString(key,item.firstName) : '',
    item.middleName = deCodeString(key,item.middleName)
    item.fullName = item.lastName +', '+item.firstName +' '+item.middleName
    item.phoneNumber = data[0].phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    return item
  })

  state.responsiblePerson = responsiblePerson[0]
}

export const emergencyContact = (state, data) => {
  if(data.length>0){
    data[0].contactType = data[0].contactType.length > 0 ? data[0].contactType : [];
  data[0].contactTime = data[0].contactTimeId.length > 0 ? data[0].contactTimeId : [];
  data[0].gender = data[0].genderId;
  data[0].sameAsPrimary = data[0].sameAsPrimary ? true : false;
  data[0].lastName = data[0].lastName ? deCodeString(key,data[0].lastName) : '',
  data[0].firstName = data[0].firstName ? deCodeString(key,data[0].firstName) : '',
  data[0].middleName = deCodeString(key,data[0].middleName)
  data[0].fullName = data[0].lastName +', '+data[0].firstName +' '+data[0].middleName
  state.emergencyContact = data[0]
  }else{
    state.emergencyContact = data
  }
}

export const patientTimelineSuccess = (state, timeline) => {
  state.patientTimeline = timeline.data
  state.patientTimelineMeta = timeline.meta.pagination
}

export const patientVitalsTimeline = (state, timeline) => {
  state.patientVitalsTimeline = timeline
}

export const bloodOxygenTimeline = (state, timeline) => {
  state.bloodOxygenTimeline = timeline
}

export const bloodGlucoseTimeline = (state, timeline) => {
  state.bloodGlucoseTimeline = timeline
}

export const bloodPressureTimeline = (state, timeline) => {
  state.bloodPressureTimeline = timeline
}

export const addCondition = (state, data) => {
  state.addCondition = data
}

export const addPatientReferals = (state, data) => {
  state.addPatientReferals = data

  state.editPatientReferral = [{
    value:data.id,
    label:data.name
  }]
}

export const addPatientPhysician = (state, data) => {
  state.addPatientPhysician = data
}

export const patientDocumentsSuccess = (state, documents) => {
  state.patientDocuments = documents.map(data => {
    data.createdAt = meridiemFormatFromTimestamp(data.createdAt);
    return data;
  })
}

export const patientConditions = (state, conditions) => {
  state.patientConditions = conditions.map(condition => {
    condition.condition = condition.conditionCode+'-'+condition.conditionDescription
    condition.startDate = condition.startDate ? dateOnlyFormat(condition.startDate) : ""
    condition.endDate = condition.endDate ? dateOnlyFormat(condition.endDate) : ""
    return condition;
  })
  // state.patientConditions = conditions
  state.conditionsList = conditions
  state.latestCondition = conditions[0]
}

export const isConditionEdit = (state, data) => {
  state.isConditionEdit = data
}

export const conditionDetails = (state, condition) => { 
  condition.condition = condition.conditionId
  condition.startDate = condition.startDate ? dateOnlyFormatSImple(condition.startDate) : ""
  condition.endDate = condition.endDate ? dateOnlyFormatSImple(condition.endDate) : ""
  state.conditionDetails = condition

  state.editConditionDetails=[{
    value:condition.conditionId,
    label:condition.conditionCode+' - '+condition.conditionDescription
  }]
}

export const patientReferralSource = (state, referralSource) => {
  if (referralSource) {
    referralSource.referralDesignation = referralSource.referralDesignationId;
    state.patientReferralSource = referralSource;
  }
}

export const patientPrimaryPhysician = (state, primaryPhysician) => {
  primaryPhysician.staff = primaryPhysician.staffId
  state.patientPrimaryPhysician = primaryPhysician
}

export const isEditPatient = (state, data) => {
  state.isEditPatient = data
}

export const deleteDocument = (state, data) => {
  state.deleteDocument = data
}
export const latestDocumentSuccess = (state, data) => {
  if (data && data.length > 0) {
    state.latestDocument = data
  }
  else {
    state.latestDocument = null
  }
}

export const latestDeviceSuccess = (state, data) => {
  if (data && data.length > 0) {
    state.latestDevice = data
  }
  else {
    state.latestDevice = null
  }
}

export const latestVital = (state, data) => {
  if (data && data.length > 0) {
    data[0].takeTime = dateFormat(data[0].takeTime)
    state.latestVital = data[0]
  }
  else {
    state.latestVital = null
  }
}

export const errorMsg = (state, data) => {
  state.errorMsg = data
}

export const referralErrorMsg = (state, data) => {
  state.referralErrorMsg = data
}

export const physicianErrorMsg = (state, data) => {
  state.physicianErrorMsg = data
}

export const emergencyErrorMsg = (state, data) => {
  state.emergencyErrorMsg = data
}

export const closeModal = (state, data) => {
  state.closeModal = data
}






export const patientSearchWithBitrix = (state, data) => {
  // state.patientSearchWithBitrix = data.filter(item=>item.CONTACT_ID),
  
  state.patientSearchWithBitrix = data,
 
    state.patientSearchWithBitrixCols = [
      {
        title: "Title",
        dataIndex: state.getBitrixFieldsName?.[0]?.bitrixId,
        slots: {
          customRender: "title",
        },
      },
      {
        title: "Type",
        dataIndex: "TYPE_ID",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "action",
        },
      },
    ];
}



export const getBitrixFieldsName = (state, data) => {
 
  state.getBitrixFieldsName = data
}


export const bitrixFormCheck = (state, data) => {
  state.bitrixFormCheck = data
}

function getTypeName(val) {
  return {}.toString.call(val).slice(8, -1);
}
export const fetchFromBitrix = (state, data) => {
  state.fetchFromBitrixStatus = true
  state.fetchFromBitrix = {
    id:'',
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phoneNumber: '',
    gender: "",
    language: "",
    otherLanguage: [],
    nickName: "",
    weight: "",
    height: "",
    contactType: [],
    contactTime: [],
    medicalRecordNumber: "",
    country: 19,
    state: "",
    city: "",
    zipCode: "",
    appartment: "",
    address: "",
    fullName: "",
    familyEmail: "",
    familyPhoneNumber: "",
    familyContactType: [],
    familyContactTime: "",
    familyGender: "",
    relation: "",
    emergencyFullName: "",
    emergencyEmail: "",
    emergencyPhoneNumber: "",
    emergencyContactType: [],
    emergencyContactTime: "",
    emergencyGender: "",
    sameAsPrimary: false,
    isPrimary: true,
    responsiblePersonId: '',
    emergencyId: '',
  }

  state.fetchFromBitrixInsurance = {
    insuranceNumber:[],
    insuranceName:[]
  }
  state.getBitrixFieldsName.map(item => {
  
    if (item.patientId == "contactType") {
        state.fetchFromBitrix[item.patientId] = data[item.bitrixId]
      }
      else if (item.patientId == "contactTime") {
        state.fetchFromBitrix[item.patientId] = data[item.bitrixId]
      }
      else if (item.patientId == "insuranceNumber") {
      state.fetchFromBitrixInsurance.insuranceNumber.push(data[item.bitrixId])
    }
    else if (item.patientId == "insuranceName") {
      state.fetchFromBitrixInsurance.insuranceName.push(data[item.bitrixId])
    }
    else if (item.patientId == "secondaryInsuranceNumber") {
      state.fetchFromBitrixInsurance.insuranceNumber.push(data[item.bitrixId])
    }
    else if (item.patientId == "secondaryInsuranceName") {
      state.fetchFromBitrixInsurance.insuranceName.push(data[item.bitrixId])
    }
    else if (item.patientId == "gender") {
      state.fetchFromBitrix[item.patientId] = data[item.bitrixId]==173 ? 1 : data[item.bitrixId]==175 ? 2 : data[item.bitrixId]==176 ? 3: '' 
    }
    else if (item.patientId == "phoneNumber") {
      if((data[item.bitrixId][0].VALUE).includes('+1')) {
        let phone = (data[item.bitrixId][0].VALUE).replace('+1', '')
        state.fetchFromBitrix.phoneNumber = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
      }
    }
    else if (item.patientId == "dob") {
      state.fetchFromBitrix[item.patientId] =  getTypeName(data[item.bitrixId])=='String' ? dobFormat2(data[item.bitrixId]) : getTypeName(data[item.bitrixId])=='Object' ? dobFormat2(data[item.bitrixId].VALUE) : getTypeName(data[item.bitrixId])=="Array" ? dobFormat2(data[item.bitrixId][0]?.VALUE) :''
    }
    else if (item.patientId == "language" || item.patientId == "otherLanguage") {
      commonState.globalCodeCategories.map(item => {
        if(item.name == 'Language') {
          item.globalCode.map(element => {
            if(element.name == data['UF_CRM_1654153987']) {
              state.fetchFromBitrix['language'] = element.id
            }
            if(element.name == data['UF_CRM_1665603016972']) {
              state.fetchFromBitrix['otherLanguage'] = element.id
            }
          })
        }
      })
    }
    else{
      state.fetchFromBitrix[item.patientId] =  getTypeName(data[item.bitrixId])=='String' ? data[item.bitrixId] : getTypeName(data[item.bitrixId])=='Object' ? data[item.bitrixId].VALUE : getTypeName(data[item.bitrixId])=="Array" ? data[item.bitrixId][0]?.VALUE :''
    }
  })
}

export const patientFlags = (state, count) => {
  // const data = count.flags
  state.grids = {
    // xlGrid: parseInt(24 / data.length),
    // smGrid: parseInt(24 / parseInt(data.length / 2)),
    // xsGrid: parseInt(24 / 7)
    xlGrid: parseInt(24 / 6),
    smGrid: parseInt(24 / 6),
    xsGrid: parseInt(24 / 4)
  }
	state.patientFlags = count.data
}



export const patientVitals99 = (state, vitals) => {
  var timeArray = [];
  var vitalFieldsArray = [];
  var vitalsArray = [];
  if (vitals && (vitals.length > 0 || vitals != null)) {
    state.loadingTableStatus = true
    vitals.map(vital => {
      vitalsArray.push({
        id: vital.id,
        takeTime: vital.takeTime,
        vitalField: vital.vitalField,
        deviceType: vital.deviceType,
        value: vital.value,
        color: vital.color,
        addType: vital.addType,
      })
      if (!timeArray.includes(vital.takeTime)) {
        timeArray.push(vital.takeTime);
      }
      if (!vitalFieldsArray.includes(vital.vitalField)) {
        vitalFieldsArray.push(vital.vitalField);
      }
    })
    const convertedResponse = convertResponse(timeArray, vitalsArray)
    const patientVitals = convertData(convertedResponse)
    const patientGraphData = convertChartResponse(vitalFieldsArray, vitalsArray)
     
    
    if(vitalsArray.length > 0) {
      vitalsArray.forEach(vital => {
        switch (vital.deviceType) {
          case 'Blood Pressure':
            state.bloodPressure = patientVitals.length > 0 ? patientVitals : null;
            state.bloodPressureGraph = patientGraphData;
            break;
          // case 'Oximeter':
          //   state.bloodOxygen = patientVitals.length > 0 ? patientVitals : null;
          //   state.bloodOxygenGraph = patientGraphData;
          //   break;
          // case 'Glucose':
          //   state.bloodGlucose = patientVitals.length > 0 ? patientVitals : null;
          //   state.bloodGlucoseGraph = patientGraphData;
          //   break;
          default:
            break;
        }
      });
    }
    else {
      state.bloodPressure = null;
      state.bloodPressureGraph = null;
    }
  }else{
    state.bloodPressure = null;
    state.bloodPressureGraph = null;
  }
  
  state.loadingTableStatus = true
}


export const patientVitals100 = (state, vitals) => {
  var timeArray = [];
  var vitalFieldsArray = [];
  var vitalsArray = [];
  if (vitals && (vitals.length > 0 || vitals != null)) {
    state.loadingTableStatus = true
    vitals.map(vital => {
      vitalsArray.push({
        id: vital.id,
        takeTime: vital.takeTime,
        vitalField: vital.vitalField,
        deviceType: vital.deviceType,
        value: vital.value,
        color: vital.color,
        addType: vital.addType,
      })
      if (!timeArray.includes(vital.takeTime)) {
        timeArray.push(vital.takeTime);
      }
      if (!vitalFieldsArray.includes(vital.vitalField)) {
        vitalFieldsArray.push(vital.vitalField);
      }
    })
    const convertedResponse = convertResponse(timeArray, vitalsArray)
    const patientVitals = convertData(convertedResponse)
    const patientGraphData = convertChartResponse(vitalFieldsArray, vitalsArray)
    if(vitalsArray.length > 0) {
      vitalsArray.forEach(vital => {
        switch (vital.deviceType) {
          
          case 'Oximeter':
            state.bloodOxygen = patientVitals.length > 0 ? patientVitals : null;
            state.bloodOxygenGraph = patientGraphData;
            break;
          
          default:
            break;
        }
      });
    }
    else {
      state.bloodOxygen = null;
      state.bloodOxygenGraph = null;
    }
  }
  else {
    
    state.bloodOxygen = null;
    state.bloodOxygenGraph = null;
  }
  state.loadingTableStatus = true
}
export const patientVitals101 = (state, vitals) => {
  var timeArray = [];
  var vitalFieldsArray = [];
  var vitalsArray = [];
  if (vitals && (vitals.length > 0 || vitals != null)) {
    state.loadingTableStatus = true
    vitals.map(vital => {
      vitalsArray.push({
        id: vital.id,
        takeTime: vital.takeTime,
        vitalField: vital.vitalField,
        deviceType: vital.deviceType,
        value: vital.value,
        color: vital.color,
        addType: vital.addType,
      })
      if (!timeArray.includes(vital.takeTime)) {
        timeArray.push(vital.takeTime);
      }
      if (!vitalFieldsArray.includes(vital.vitalField)) {
        vitalFieldsArray.push(vital.vitalField);
      }
    })
    const convertedResponse = convertResponse(timeArray, vitalsArray)
    const patientVitals = convertData(convertedResponse)
    const patientGraphData = convertChartResponse(vitalFieldsArray, vitalsArray)
    if(vitalsArray.length > 0) {
      vitalsArray.forEach(vital => {
        switch (vital.deviceType) {
          case 'Glucose':
            state.bloodGlucose = patientVitals.length > 0 ? patientVitals : null;
            state.bloodGlucoseGraph = patientGraphData;
            state.bloodGlucose.map(item =>{
              if(item.glucose_before_sleep){
                item.value = item.glucose_before_sleep
              }else if(item.glucose_pre_meal){
                item.value = item.glucose_pre_meal
              }else if(item.glucose_fasting){
                item.value = item.glucose_fasting
              }else if(item.glucose_random_blood_sugar){
                item.value = item.glucose_random_blood_sugar
              }else if(item.glucose_fasting_blood_sugar){
                item.value = item.glucose_fasting_blood_sugar
              }else if(item.post_meal){
                item.value = item.post_meal
              }else{
                item.value = item.general
              }
            })
            break;
          default:
            break;
        }
      });
    }
    else {
      state.bloodGlucose = null
      state.bloodGlucoseGraph = null
    }
  }
  else {
    state.bloodGlucose = null;
    state.bloodGlucoseGraph = null;
  }
  state.loadingTableStatus = true
}


export const addCriticalNote = (state, data) => {
  state.addCriticalNote = data
  state.closeModal = true
}

export const patientCriticalNotes = (state, data) => {
  state.patientCriticalNotes = data
}

export const criticalNotesList = (state, data) => {
  state.criticalNotesList = data
}

export const latestCriticalNote = (state, data) => {
  state.latestCriticalNote = data[0]
}

export const familyMembersList = (state, responsiblePersons) => {
  state.familyMembersList = responsiblePersons.map(member => {
    member.firstName = deCodeString(key,member.firstName)
    member.lastName = deCodeString(key,member.lastName)
    member.middleName = deCodeString(key,member.middleName)
    member.fullName = member.lastName +', '+member.firstName +' '+member.middleName
    member.isPrimary = member.isPrimary ? 'Yes' : 'No'
    member.contactType = member.contactType ? JSON.parse(member.contactType) : []
    member.contactTime = member.contactTimeId ? JSON.parse(member.contactTimeId) : []
    return member
  })
}

export const familyMemberDetails = (state, responsiblePerson) => {
  if(responsiblePerson) {
    responsiblePerson.familyEmail = responsiblePerson.email
    responsiblePerson.firstName = deCodeString(key,responsiblePerson.firstName)
    responsiblePerson.lastName = deCodeString(key,responsiblePerson.lastName)
    responsiblePerson.middleName = deCodeString(key,responsiblePerson.middleName)
    responsiblePerson.fullName = responsiblePerson.lastName +', '+responsiblePerson.firstName +' '+responsiblePerson.middleName
    responsiblePerson.familyPhoneNumber = responsiblePerson.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    responsiblePerson.familyContactType = responsiblePerson.contactType ? JSON.parse(responsiblePerson.contactType) : []
    responsiblePerson.familyContactTime = responsiblePerson.contactTimeId ? JSON.parse(responsiblePerson.contactTimeId) : []
    responsiblePerson.familyGender = responsiblePerson.genderId
    responsiblePerson.relation = responsiblePerson.relationId
    responsiblePerson.isPrimary = responsiblePerson.isPrimary ? true : false
  }
  state.familyMemberDetails = responsiblePerson
}

export const physiciansList = (state, physicians) => {
  state.physiciansList = physicians
}

export const physicianDetails = (state, physician) => {
  physician.designation = physician.designationId
  state.physicianDetails = physician
}

export const emergencyContactsList = (state, emergencyContacts) => {
  state.emergencyContactsList = emergencyContacts.map(contact => {
    contact.isPrimary = contact.isPrimary ? 'Yes' : 'No'
    contact.email = contact.emergencyEmail
    contact.firstName = deCodeString(key,contact.firstName)
    contact.lastName = deCodeString(key,contact.lastName)
    contact.middleName = deCodeString(key,contact.middleName)
    contact.fullName = contact.lastName +', '+contact.firstName +' '+contact.middleName
    contact.phoneNumber = contact.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
    contact.contactType = contact.contactType ? JSON.parse(contact.contactType) : []
    contact.contactTime = contact.contactTimeId ? JSON.parse(contact.contactTimeId) : []
    return contact
  })
}

export const emergencyContactDetails = (state, emergencyContact) => {
  emergencyContact.isPrimary = emergencyContact.isPrimary ? 'Yes' : 'No'
  emergencyContact.gender = emergencyContact.genderId
  emergencyContact.email = emergencyContact.emergencyEmail
  emergencyContact.firstName = deCodeString(key,emergencyContact.firstName)
  emergencyContact.lastName = deCodeString(key,emergencyContact.lastName)
  emergencyContact.middleName = deCodeString(key,emergencyContact.middleName)
  emergencyContact.fullName = emergencyContact.lastName +', '+emergencyContact.firstName +' '+emergencyContact.middleName
  emergencyContact.phoneNumber = emergencyContact.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
  emergencyContact.contactType = emergencyContact.contactType ? JSON.parse(emergencyContact.contactType) : []
  emergencyContact.contactTime = emergencyContact.contactTimeId ? JSON.parse(emergencyContact.contactTimeId) : []
  state.emergencyContactDetails = emergencyContact
}

export const timeLineType = (state, data) => {
  state.timeLineType = data
}

export const programDetails = (state, data) => {
  const format = 'YYYY-MM-DD';
  data.program = data.programId
  data.onboardingScheduleDate = data.onboardingScheduleDate ? timestampToDate(data.onboardingScheduleDate, format) : ""
  data.dischargeDate = data.dischargeDate ? timestampToDate(data.dischargeDate, format) : "",
  data.renewalDate = data.renewalDate ? timestampToDate(data.renewalDate, format) : ""
  state.programDetails = data
}

export const medicalHistoryDetails = (state, data) => {
  state.medicalHistoryDetails = data
}

export const medicationDetails = (state, data) => {
  const format = 'YYYY-MM-DD';
  data.startDate = data.startDate?timestampToDate(data.startDate, format):""
  data.endDate = data.endDate?timestampToDate(data.endDate, format):""
  state.medicationDetails = data
  state.medicationDetails['frequency'] = data.frequency?.id
		
}

export const documentDetails = (state, data) => {
  const tags = []
  data.tag.map(tag => {
    tags.push(tag.tagId)
  })
  data.tags = tags
  data.document = data.path
  data.type = data.typeId
  state.documentDetails = data
}

export const isPicuteLoading = (state, data) => {
  state.isPicuteLoading = data
}


export const patientVitalList = (state, data) => {
  state.patientVitalList = data.map((item) => {
		item.startTime = item.startTime?dateAndTimeFormate(item.startTime,globalDateFormat):'';
    item.endTime = item.endTime?dateAndTimeFormate(item.endTime,globalDateFormat):'';
		return item;
	})
}

export const referralList = (state, data) => {
  state.referralList = data
}
export const referralDetail = (state, data) => {
  state.referralDetail = data
}

export const startOn = (state, data) => {
  state.startOn = data
}

export const criticalNoteDetails = (state, data) => {
  state.criticalNoteDetails = data
}

export const healthConditions = (state, data) => {
  state.healthConditions = data.map(item => {
    item.name = item.code+' - '+item.description
    return item
  })
}

export const showPatientDetailsModal = (state) => {
  state.visiblePatientDetailsModal = true
}

export const closePatientDetailsModal = (state) => {
  state.visiblePatientDetailsModal = false
}

export const patientUdid = (state,data) => {
  state.patientUdid = data
}

export const patientReferenceId = (state, data) => {
  state.patientReferenceId = data
}

export const filteredVitals = (state, data) => {
  state.filteredVitals = data
}

export const nonComplianceDetails = (state, data) => {
  state.nonComplianceDetails = data.map(item => {
    const then = dateFormat(item.patientInventory.data.issueDate);
    const twoDaysFromNow = moment().subtract(2, 'days').format('MMM DD, yyyy, hh:mm A');
    const fourDaysFromNow = moment().subtract(4, 'days').format('MMM DD, yyyy, hh:mm A');
    const thenDate = moment(then).format('MMM DD, yyyy, hh:mm A')
    if(thenDate >= twoDaysFromNow && thenDate < fourDaysFromNow) {
      item.flag = "#DA291C"
    }
    else if(thenDate >= fourDaysFromNow) {
      item.flag = "#E84A4A"
    }
    else if(thenDate < twoDaysFromNow) {
      item.flag = "#1D8FFB"
    }
    item.deviceType = item.patientInventory.data.deviceType
    item.date = dateFormat(item.patientInventory.data.issueDate)
    return item
  })
}

export const addPatientGroup = (state, data) => {
  state.addPatientGroup = data
}

export const getPatientGroup = (state, data) => {
  state.latestPatientGroup = data[0]
  state.getPatientGroup = data
}
