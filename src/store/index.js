import { createStore } from 'vuex'
import { dashBoard } from "./dashboard/index"
import  { communications } from "./communications/index"
import { patients } from "./patients/index"
import { patientsStore } from "./patientsStore/index"
import { common } from "./common/index"
import { counterCards } from "./counter-cards/index"
import { careCoordinator } from "./careCoordinator/index"
import { careCoordinatorSummary } from "./careCoordinatorSummary/index"
import { tasks } from "./tasks/index"
import { globalCodes } from "./globalCodes/index"
import { rolesAndPermissions } from "./rolesAndPermissions/index"
import { inventory } from "./inventory/index"
import { appointment } from "./appointment/index"
import { authentication } from "./authentication/index"
import { notes } from "./notes/index"
import { thresholds } from "./thresholds/index"
import { timeLogs } from "./timeLogs/index"
import { timeLogReport } from "./timeLogReport/index"
import { timeLogApproval } from "./timeLogApproval/index"
import { careTeam } from "./careTeam/index"
import { programs } from "./programs/index"
import { cptCodes } from "./cptCodes/index"
import { carePlan } from "./carePlan/index"
import {screenPermissions} from "./screenPermissions/index"
import {provider} from "./provider/index"
import { videoCall } from "./videoCall/index"
import { flags } from "./flags/index"
import { password } from "./password/index"
import { staffGroups } from "./staffGroups/index"
//import createPersistedState from "vuex-persistedstate";
import { errorLogWithDeviceInfo} from "./errorLogWithDeviceInfo"
import { questionnaireTemplate } from "./questionnaireTemplate/index"
import { questionnaireTemplateSection } from "./questionnaireTemplateSection/index"
import { questionnaire } from "./questionnaire/index"
import { workflow} from "./workflow"
import { businessDashboard } from "./businessDashboard/index"
import { clinicalDashboard } from "./clinicalDashboard/index"
import { referral } from "./referral/index"
import {escalations} from "./escalations/index"
import {reports} from "./reports/index"
import {specialists} from "./specialists/index"
import {unprocessedCommunications} from "./unprocessedCommunications/index"
import {customForm} from "./custom-form/index"
import {bugReport} from "./bugReport/index"
import {toolTip} from "./toolTip/index"
import {clients} from "./clients/index"
import { device } from "./patientsStore/device/index"
import { vitals } from "./patientsStore/vitals/index"
import { familyMember } from "./patientsStore/familyMember/index"
import { patientsCareTeam } from "./patientsStore/careTeam/index"
import { medical } from "./patientsStore/medical/index"
import { medicines } from "./patientsStore/medicines/index"
import { insurance } from "./patientsStore/insurance/index"
import { sendbirdState } from "./sendbirdChat/index"
import patientProgram from './patientsStore/patientprograms'
import patientBilling from './patientsStore/patientBilling'
import patientsTimeLine from './patientsStore/patientsTimeLine'
import alerts from './alerts'
import bitrix from './patientsStore/bitrix'
import patientsAppointment from './patientsStore/patientAppointment'
import { patientsNotes } from './patientsStore/patientsNotes'
import billing from './billing'
import specialist from './specialist/index'

export default createStore({
  modules: {
    sendbirdState,
    dashBoard,
    communications,
    patients,
    patientsStore,
    counterCards,
    common,
    careCoordinator,
    careCoordinatorSummary,
    tasks,
    globalCodes,
    rolesAndPermissions,
    inventory,
    appointment,
    authentication,
    notes,
    timeLogs,
    timeLogReport,
    thresholds,
    careTeam,
    programs,
    cptCodes,
    carePlan,
    videoCall,
    provider,
    flags,
    password,
    staffGroups,
    screenPermissions,
    errorLogWithDeviceInfo,
    questionnaireTemplate,
    questionnaire,
    workflow,
    businessDashboard,
    clinicalDashboard,
    referral,
    escalations,
    reports,
    specialists,
    timeLogApproval,
    questionnaireTemplateSection,
    unprocessedCommunications,
    customForm,
    bugReport,
    toolTip,
    clients,
    device,
    vitals,
    familyMember,
    patientsCareTeam,
    medicines,
    medical,
    insurance,
    patientProgram,
    alerts,
    bitrix,
    patientsNotes,
    patientBilling,
    billing,
    patientsTimeLine,
    patientsAppointment,
    specialist
  },
  /* Data stored even refresh the page */
//   plugins: [ createPersistedState({
//     reducer(state) {
//     return {
//       token: state.authentication.token
//       }
//     }
//   })
// ]
})
