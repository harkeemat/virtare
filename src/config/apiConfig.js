// API end points
export const API_ENDPOINTS = {
    // Authentication
    login: "login",
    logout: "logout",
    refreshToken: "refreshToken",
    //dashboard
    interval:"globalstartEnd/date",
    cptCodeGraph:"cptCode/billingSummary",
    // Patients
    patient:"patient",
    patientsList:"patient",
    patientDetails:"patient",
    counterCard:"patient/count",
    financial:"financialStats",
    cptCode:"patient/count",
    totalPatientsChart:"patient/chart",
    timeLine:"patient/new",
    timeLineType:"timeLineType",
    patientProfile:"patientProfile",
    referral:"referral",
    // Appointments
    appointment:"appointment",
    todayAppointment:"appointment/today",
    appointmentChart:"appointment/summary",
    futureAppointments:"appointment/future",
    newRequests:"appointment/new",
    addAppointment:"appointment",
    seacrhAppointment:"appointment/search",
    appointmentConference:'appointment/conference',
    // Care Coordinator
    staffList:"staff",
    staff:"staffData/list",
    staffDetails:'staffData/staffView/',
    specialization:"staff/specialization",
    network:"staff/network",
    // Communications
    communication:"communication",
    communicationsList:"communication",
    communicationTypes:"communication/type",
    addCommunication:"communication",
    communicationsCount:"communication/count",
    communicationsView:"communication/messages",
    callStatus:"call/status",
    CallPlanned:"call/staff",
    timeApproval:"timeApproval",
    //conversation
    conversation:'conversation',
    getConversation:'get-conversation',
    conversationSend:'send-message',
    // Tasks
    task:"task",
    taskStatus:"task/status",
    allTaskStatus:"task/status/summery",
    taskPriority:"task/priority",
    searchTasks:"task/search",
    taskTeamMember:'task/staff',
    taskCategory: 'task/category',
	completeTaskRate: 'task/completion/rates',
    // Global Codes
    globalCodesList: 'globalCodeCategory',
    globalCode: 'globalCode', 
    // inventory
    inventory: 'inventory',
    model: 'model',
    // Roles & Permissions
    role: 'role',
    rolesList: 'roleList',
    addPermissions:'rolePermission',
    rolePermissions: 'permissionList',
    roleDetails: 'roleDetails',
    rolePermissionEdit:'rolePermissionEdit', 
    dashboardWidget:'widget',
    widgetAccess:'widgetAccess',
    dashboardWidgetList:"dashboardWidget",
    // Notes
    notes: 'patient/notes',
    // timeLogs
    timeLog: 'patient/timeLog',
    deleteTimeLog: 'deleteTimeLog',
    activeCptCodes :'cptCodeActivities',
    activitiesList :'list/activities',
    //Thresholds
    getVital:'field',
    generalParameter:'generalParameterGroup',
    deleteParameter:'generalParameter',
    //Programs
    programsList:"program",
    program:"program",
    // CPT Codes
    cptCodes: 'cptCode',
    service: 'service',
    // Vital Fields
    field: 'field',
    //Providers
    provider:'provider',
    // Flags
    flag:'flag',
    // Critical Notes
    criticalNote:'criticalNote',
    //notification
    notification:'notification',
    // Change Password
    changePassword:'changePassword',
    forgotPassword:'forgot/password',
    validateCode:'forgotPassword/verify',
    setupPassword:'generate/newPassword',
    // Staff Groups
    group:'group',
    staffGroup:'staffGroup',
    groupPermissions:'groupPermission',
    //Questionnaire Template
    questionnaireTemplate:'questionnaireTemplate',
    //Section 
    questionnaireTemplateSection:'questionnaireSection',
    //Questionnaire
    questionnaire:'question',
    //clinical dashboard
    clinicalTask:'taskCount',
    patientsFlag:'patientFlagCount',
    appointmentCount:'appointmentCount',
    escalationCount:'escalationCount',
    referalCount:"referalCount",
    referralList:'referral',
    setting:"users/setting",
    // Conditions
    condition: "condition",
    // Specialists
    specialists: "staffData/getSpecialists",
    // Communication Inbound
    communicationInbound: "communicationInbound",
    //bug
    bugReport:"bug",
    //client
    client:"client",
    addClient:"client/addClient",
    getClient:"client/getClient",
    updateClient:"client/updateClient",
    destroyClient:"client/destroyClient",
    updateStatus:"client/updateStatus",
    contact:"contact",
    site:"site",
    siteList:"siteList",
    createCareTeam:"careTeam/create",
    careTeamList:"careTeam/list",
    careTeamListByClient:"careTeam/listByClient",
    careTeamDetails:"careTeam/list",
    destroyCareTeam:"careTeam/destroy",
    updateCareTeam:"careTeam/update",
    careTeam:"careTeam",
    create:"create",
    peopleList:"people/list",
    addCareTeamMember:"careTeam/member/addMember",
    careTeamMembersList:"careTeam/member/listByCareTeamId",
    destroyCareTeamMember:"careTeam/member/destroy",
    clientPatients:"client/get-patients",
    //people
    people:"people/create",
    peopleListing:"people/list",
    peopleDetail:"people/detail",
    peopleUpdate:"people/update",
    teamHead:"people/list/users",
    //timeZone
    timeZone:"timezone?isActive=1&code=utf-8",
    rolesDropDown:"all-roles",
    //address
    addressGet:"client/get-all-address",
    staffSites:"locations",
    //device in patients
    manufacture:'serialNumber',
    newPatient:"patients",
    //careTeam 
    membersFromCareTeam:'careTeam/member/listByCareTeamId',
    allSpecialists:"allSpecialists",
    specialistsList:"listSpecialistsByPatientId",
    assignSpecialistToPatient:"assignSpecialistToPatient",
    //patients family details
    familyMemberDetail:"patientData/familyMemberDetail",
    deleteFamilyMember:"patientData/familyMember",
    patientsCareTeamDetail:"careTeam/member/listByCareTeamDetail"
}

export const API_ENDPOINTS_V3 = {
    patient: 'patientData/list',
}

export const  clientProgram = (id) =>{
    return "client/"+id+"/program"
}
export const  searchTags = (id) =>{
    return "notes/patient/"+id+"/tags"
}
export const  patientPinNote = (id) =>{
    return "notes/patient/"+id+"/pin-notes"
}
export const  sitePrograms = (id) => {
    return "site/"+id+"/program"
}
export const deviceListing = (id) =>{
    return "patient/"+id+"/device"
}


export const emergencyContactsList = (id) => {
    return "patient/"+id+"/emergency"
}

export const emergencyContactInfo = (patientUdid, emergencyContactId) => {
    return "patient/"+patientUdid+"/emergency/"+emergencyContactId
}

export const deviceAdd = (id) =>{
    return "patientData/"+id+"/inventory"
}
export const careTeamAssign = (id) =>{
    return "patientData/"+id+"/care-team"
}

export const addFamilyMember = (id) =>{
    return "patient/"+id+"/family"
}
export const familyMemberListing = (id) =>{
    return "patientData/familyMember/"+id
}
export const medicalAdd = (id) =>{
    return "patientData/"+id+"/history"
}

export const medicalListing = () =>{
    // return "patientData/history"
}

export const medicinesAdd = () =>{
    // return "patientData/"+id+"/history"
}
export const patientsInsurance = (id) =>{
    return "patientData/"+id+"/insurance"
}
export const patientsNotes = (id) =>{
    return "notes/patient/"+id+"/notes"
}
// export const getApiUrl = key => {
//     return API_URL + API_ENDPOINTS[key];
// };
    
// }
