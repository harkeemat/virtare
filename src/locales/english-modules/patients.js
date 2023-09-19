const patient = {

  onboarding: {
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    gender: "Gender",
    biologicalGender: "Biological Gender",
    dob: "Date Of Birth",
    primaryLanguage: "Primary Language",
    secondaryLanguage: "Secondary Language",
    timeZone: "Timezone",
    lane1: "Line 1",
    lane2: "Line 2",
    city: "City",
    state: "State",
    zipcode: "Zipcode",
    height: "Height",
    weight: "Weight",
    insuranceNumber: "INSURANCE NUMBER",
    insuranceName: "INSURANCE NAME",
    startDate: "Start Date",
    endDate: "End Date",
    program: "Program",
    site: "Site",
    client:"CLIENT",
    bestTimeToCall:"Best time to call",
    careTeam: "CareTeam",
    placeOfService: "Place Of Service",
    email:"Email",
    phoneNumber:"Phone Number",
    contactMethod:"Contact Method",
    preferredTimeofDayforContact:'Time of Day to Contact in Order of Preference',
    referral:"REFERRAL",
    dobMessage:"Patient must be 18 years old or above.",
    /** bitrix */
    title:'SEARCH PATIENT'
  },

    patients:'RPM Worklist',
    isApp:'SNF Patient?',
    addNewPatients:'Patient',
    critical:'Critical',
    trending:'Trending',
    WNL:'WNL',
    watchList:'Watch List',
    messages:'Messages',
    escalations:'Escalations',
    patientConditions:'Condition(s)',
    referralSource:'Referral Source (Assisted Living, Home Health, Cardiologist)',
    fax:'Fax',
    sameAsabove:'Same as above',
    primaryPhysician:'Primary Care Coordinator',


  demographics:{
    language:'Primary Language',
    otherLanguage:'Secondary Language',
    nickName:'Nickname',
    weight:'Weight',
    height:'Height',
    preferredMethodofContact:'Contact Method in Order of Preference',
    preferredTimeofDayforContact:'Time of Day to Contact in Order of Preference',
    MRN:'MRN( Medical Record Number) ',
    suiteorApartment:'Suite or Apartment',
    primaryFamilyMember:'Responsible Person',
    responsiblePerson:'Responsible Person',
    self:'Self',
    fullName:'Full Name',
    emailAddress:'Email Address',
    emergencyContact:'Emergency Contact',
    sameAsPrimaryFamilyMemberInfo:'Same as Responsible Person info',
    sameAsResponsiblePersonInfo:'Same as Responsible Person info',
  },

  conditions:{
    healthConditions:'Health Conditions',
    A00:'Certain infectious and parasitic diseases (A00-B99)',
    C00:'Neoplasms (C00-D49)',
    E00:'Endocrine, nutritional and metabolic diseases (E00-E89)',
    F01:'Mental, Behavioral and Neurodevelopmental disorders (F01-F99 )',
    G00:'Diseases of the nervous system (G00-G99)',
    H00:'Diseases of the eye and adnexa (H00-H59)',
    H60:'Diseases of the ear and mastoid process(H60-H95)',
    I00:'Diseases of the circulatory system (I00-I99)',
  },

  programs:{
    program:'Programs',
    onboardinScheduledDate:'Onboarding scheduled date',
    dischargeDate:'Discharge Date'

  },

  devices:{
    deviceType:'Device Type',
    modelNo:'Model No',
    serialNo:'Serial No',
    MACAddress:'MAC Address',
    deviceTime:'Device Time',
    ServerTime:'Server Time',
    inventory:'Inventory',
    manufacturer:"Manufacturer"
  },

  parameters:{
    bloodPressure:'Blood Pressure',
    systolic:'Systolic',
    diastolic:'Diastolic',
    pulse:'Pulse',
    BPM:'BPM',
    bloodOxygenSaturation:'Blood Oxygen Saturation',
    SPO2:'SPO2',
    glucosen:'Glucosen',
    FastingBloodSugar:'Fasting Blood Sugar',
    randomBloodSugar:'Random Blood Sugar'
  },

  clinicalData:{
    medicalHistory:'Medical History',
    medication:'Medication',
    medicine:'Medicine',
    frequency:'Frequency'
  },

  insurance:{
    insuranceNumber:'Insurance Number',
    insuranceName:'Insurance Name',
    expirationDate:'Effective Date',
    secondaryInsurance:'Secondary Insurance',
    tertiaryInsurance:'Tertiary Insurance'


  },
  careTeam:{
    careTeam:"Care TEam",
    nurse:"Nurse/MA",
    assignCareTeam:"Assign Care Team",
    specialist:"Specialist"
  },
  medical:{
    diagnosis:"Diagnosis",
    diagnosisCode: "Diagnose Code",
    diagnoseDate:"Diagnosis Date",
    note:"Note",
    cured:"Cured"
  },
  notes:{
    category:"Category",
    notesType:"Note Type",
    pin:"Pin it",
    internal:"Internal"
  },
  message:{
  careTeam:"Care team not found"
  }
}


export default patient
