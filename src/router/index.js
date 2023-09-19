import { createRouter,createWebHashHistory,createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import { rolesPermissionFind,alertSwal } from "@/commonMethods/commonMethod"
import store from '@/store/index'
import { messages} from '@/config/messages';
const routes = [
  {
    path: "/communications",
    name: "Communications",
    component: () => import("@/views/communications/Communications"),
    meta: { authAdmin: true,all:true },
    
  },
  {
    path: "/escalation-action/:udid?",
    name: "EscalationAction",
    component: () => import("@/components/templates/EscalationAction.vue"),
  },

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  //   meta: { authAdmin: true },
  // },
  {
    path: "/dashboard",
    name: "ClinicalDashboard",
    component: () => import("@/views/clinic/dashboard/Dashboard"),
    meta: { authAdmin: true },
    
  },

 

  {
    path: "/unprocessed-communications",
    name: "UnprocessedCommunications",
    component: () =>
      import("@/views/unprocessed-communications/UnprocessedCommunications"),
    meta: { authAdmin: true ,role:[700]},
    
  },

  // {
  //   path: "/manage-care-coordinator",
  //   name: "ManageCareCoordinators",
  //   component: () =>
  //     import("@/views/manage-care-coordinator/ManageCareCoordinator"),
  //   meta: { authAdmin: true },
  //   role:[503]
  // },

  {
    path: "/directory",
    name: "Specialists",
    component: () => import("@/views/specialists/Specialists"),
    meta: { authAdmin: true,role:[514, 515] },
    
  },

  {
    path: "/tasks",
    name: "Tasks",
    component: () => import("@/views/tasks/Tasks"),
    meta: { authAdmin: true,all:true },
    
  },

  // {
  //   path: "/manage-patients",
  //   name: "PatientsWithFilter",
  //   component: () => import("@/views/patients/Patients"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // New Patient Routes Start Here
  {
    path: "/patients",
    name: "PatientsList",
    component: () => import("@/views/patients/PatientsList"),
    meta: { authAdmin: true,role:[62,65] },
    
  },
  {
    path:'/bitrixpatients',
    name:'bitrixpatients',
    component:() => import('@/views/patients/BitrixList'),
    meta: { authAdmin: true,role:[528] },
    },
  {
    path: "/patientDetails/:udid",
    name: "PatientDetails",
    component: () => import("@/views/patients/PatientDetails"),
    meta: { authAdmin: true,role:[63] },
    
  },
  // New Patient Routes End Here


  // {
  //   path: "/manage-patients",
  //   name: "Patients",
  //   component: () => import("@/views/patients/Patients"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  {
    path: "/appointment-calendar",
    name: "AppointmnetCalendar",
    component: () => import("@/views/appoinment-calendar/AppointmentCalendar"),
    meta: { authAdmin: true,role:[112] },
    
  },

  {
    path: "/appointment-calendar/:udid",
    name: "Appointmnet Calendar for Patient",
    component: () => import("@/views/appoinment-calendar/AppointmentCalendar"),
    meta: { authAdmin: true,role:[112] },
    
  },

  {
    path: "/patients-summary/:udid",
    name: "PatientSummary",
    component: () => import("@/views/patients/PatientSummary"),
    meta: { authAdmin: true,all:true },
    
  },

  {
    path: "/coordinator-summary/:udid?",
    name: "CoordinatorSummary",
    component: () =>
      import("@/views/manage-care-coordinator/Coordinatorsummary"),
    meta: { authAdmin: true, all:true },
   
  },

  {
    path: "/admin/profile-setup/:udid?",
    name: "Profile",
    component: () =>
      import("@/components/coordinator-summary/Profile.vue"),
    meta: { authAdmin: true ,all:true},
    
  },

  // {
  //   path: "/specialist-summary/:udid?",
  //   name: "SpecialistSummary",
  //   component: () => import("@/views/specialists/SpecialistSummary"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  {
    path: "/time-tracking-report",
    name: "TimeTrackingReport",
    component: () => import("@/views/billing/Billing"),
    meta: { authAdmin: true ,role:[543]},
    
  },
  // {
  //   path: "/thresholds",
  //   name: "Thresholds",
  //   component: () => import("@/views/thresholds/Thresholds"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  {
    path: "/time-log-report",
    name: "TimeLogReport",
    component: () => import("@/views/audit-timelog/AuditTimelog"),
    meta: { authAdmin: true,role:[543] },
    
  },

  {
    path: "/time-log",
    name: "TimeLogApproval",
    component: () => import("@/views/timeLog/TimeLog"),
    meta: { authAdmin: true,role:[543] },
    
  },

  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("@/views/notifications/Notifications"),
    meta: { authAdmin: true, all:true },
   
  },
  {
    path: "/request-call-notifications",
    name: "CallNotifications",
    component: () => import("@/views/notifications/RequestCallNotifications"),
    meta: { authAdmin: true ,all:true},
    
  },
  {
    path: "/video-call/:id?",
    name: "videoCall",
    component: () => import("@/views/video-call/VideoCall"),
    meta: { authAdmin: true ,all:true},
    
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/reset-password/ResetPassword"),
    meta: { authAdmin: true,all:true},
    
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/components/forgot-password/ForgotPassword"),
  },

  {
    // path: '/',
    name: "Login",
    component: () => import("@/views/login/Login"),
  },

  {
    path: '/staff/:udid?/create-password:token?',
    name: 'CreatePassword',
    component: () => import('@/views/setup-password/CreatePassword.vue'),
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/views/logout/Logout"),
    meta: { authAdmin: true ,all:true},
    logout:'logout'
  },

  {
    path: "/setup-password/:udid?",
    name: "SetupPassword",
    component: () => import('@/views/setup-password/SetupPassword'),
  },
  {
    path: "/thank-you",
    name: "ThankYou",
    component: () => import("@/components/thankYou/ThankYou"),
  },
  {
    path: '/otp',
    name: 'Otp',
    component: () => import('@/views/otp/Otp'),
  },

  {
    path: "/global-codes",
    name: "GlobalCodes",
    component: () => import("@/views/administration/global-codes/GlobalCodes"),
    meta: { authAdmin: true ,all:true},
    
  },

  {
    path: "/manage-programs",
    name: "ManageProgram",
    component: () => import("@/views/administration/programs/Programs"),
    meta: { authAdmin: true,role:[488] },
    
  },

  // {
  //   path: "/providers",
  //   name: "ManageProviders",
  //   component: () => import("@/views/administration/providers/Providers"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  {
    path: "/clients",
    name: "ManageClients",
    component: () => import("@/views/administration/clients/Clients"),
    meta: { authAdmin: true,role:[509,508] },
    
  },

  // {
  //   path: "/addClient",
  //   name: "AddClient",
  //   component: () => import("@/views/administration/clients/AddClient"),
  //   meta: { authAdmin: true },
  //   role:[508]
  // },

  {
    path: "/clientDetails/:udid",
    name: "ClientDetails",
    component: () => import("@/views/administration/clients/ClientDetails"),
    meta: { authAdmin: true,role:[513] },
    
  },

  // {
  //   path: "/provider-summary/:id",
  //   name: "providerSummary",
  //   component: () => import("@/views/administration/providers/ProviderSummary"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  {
    path: "/roles-and-permissions",
    name: "RolesPermissions",
    component: () =>
      import(
        "@/views/administration/roles-and-permissions/RolesAndPermissions"
      ),
    meta: { authAdmin: true ,role:[485]},
    
  },
  {
    path: "/customRole",
    name: "CustomRole",
    component: () =>
      import(
        "@/components/administration/rolesAndPermissions/RolesAndPermissionsOld"
      ),
    meta: { authAdmin: true,role:[23] },
    
  },
  {
    path: "/cpt-codes",
    name: "CptCodes",
    component: () => import("@/views/administration/cpt-codes/CptCodes"),
    meta: { authAdmin: true,role:[487] },
  },
  {
    path: "/inventory",
    name: "Inventory",
    component: () => import("@/views/administration/inventory/Inventory"),
    meta: { authAdmin: true ,role:[336,337]},
    role:[336,337]
  },
  // {
  //   path: "/staff-groups",
  //   name: "StaffGroups",
  //   component: () => import("@/views/administration/staffGroups/StaffGroups"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // testing Links
  {
    path: "/testing/test",
    name: "Test",
    component: () => import("@/components/testing/Test"),
    meta: { authAdmin: true,all:true },
    
  },
  {
    path: "/testing/testList",
    name: "Test",
    component: () => import("@/components/testing/TestList"),
    meta: { authAdmin: true,all:true },
    
  },
  /* {
    path: "/testing/for-testing",
    name: "ForTesting",
    component: () => import("@/components/testing/ForTesting"),
    meta: { authAdmin: true },
    all:true
  }, */
  {
    path: "/billing-report",
    name: "BillingReportTable",
    component: () => import("@/components/BillingReportTable.vue"),
    meta: { authAdmin: true ,role:[543]},
    
  },
  {
    path: "/addPatients",
    name: "AddPatients",
    component: () => import("@/components/Patients.vue"),
    //meta: { authAdmin: true , all:true},
   
  },

  // {
  //   path: "/admin/questionnaire",
  //   name: "Questionnaire",
  //   component: () =>
  //     import("@/views/administration/questionnaire/Questionnaire"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/questionnaire-bank",
  //   name: "QuestionnaireBank",
  //   component: () => import("@/views/questionnaire-bank/QuestionnaireBank"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/questionnaire-template",
  //   name: "QuestionnaireTemplate",
  //   component: () =>
  //     import("@/views/questionnaire-template/QuestionnaireTemplate"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/template-section",
  //   name: "QuestionnaireTemplateSection",
  //   component: () =>
  //     import("@/views/template-section/QuestionnaireTemplateSection"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/question-template-detail/:udid",
  //   name: "QuestionTemplateDetail",
  //   component: () =>
  //     import("@/views/questionnaire-template/QuestionTemplateDetail"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/question-section-detail/:udid",
  //   name: "QuestionSectionDetail",
  //   component: () =>
  //     import("@/views/questionnaire-template/QuestionSectionDetail"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/template-view/:udid",
  //   name: "TemplateResponse",
  //   component: () => import("@/views/template-response/TemplateResponse"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/questionnaire-response/:udid",
  //   name: "QuestionnaireResponse",
  //   component: () => import("@/views/questionnaire-response/TemplateResponse"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/resources",
  //   name: "Resources",
  //   component: () => import("@/views/resources/Resources"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // {
  //   path: "/admin/work-flow",
  //   name: "WorkFlow",
  //   component: () => import("@/views/workflow-setup/WorkFlowSetup"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/admin/questionnaireResponse",
  //   name: "Questionnaire Response",
  //   component: () => import("@/views/questionnaireForm/QuestionnaireForm"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // {
  //   path: "/admin/workflow/:workflowUdid/workflow-actions",
  //   name: "WorkFlowActions",
  //   component: () => import("@/views/workflow-actions/WorkFlowActions"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // {
  //   path: "/admin/workflow/:workflowUdid/workflow-actions/:actionUdid",
  //   name: "WorkFlowActionsDetails",
  //   component: () => import("@/views/workflow-actions/WorkFlowActionsDetails"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  {
    path: "/businessDashboard",
    name: "BusinessDashboard",
    component: () => import("@/views/business/dashboard/Dashboard"),
    meta: { authAdmin: true ,role:[543]},
    
  },
  {
    path: "/referral",
    name: "Referral",
    component: () => import("@/views/referral/Referral"),
    meta: { authAdmin: true,role:[409] },
  },

  // {
  //   path: "/escalation",
  //   name: "Escalation",
  //   component: () => import("@/views/escalations/Escalations"),
  //   meta: { authAdmin: true },
  // },
  {
    path: "/escalations",
    name: "Alerts",
    component: () => import("@/views/alerts/Alerts"),
    meta: { authAdmin: true,role:[544] },
    
  },
  // {
  //   path: "/audit-escalation",
  //   name: "AuditEscalation",
  //   component: () => import("@/views/audit-escalation/AuditEscalation"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/templateResponse/:udid",
  //   name: "Response Template",
  //   component: () =>
  //     import(
  //       "@/components/administration/questionnaire-template/TemplateResponse"
  //     ),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: "/mail-dashboard",
  //   name: "MailDashboard",
  //   component: () => import("@/views/mail-dashboard/MailDashboard"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // {
  //   path: "/custom-dashboard",
  //   name: "CustomDashboard",
  //   component: () => import("@/views/custom-dashboard/CustomDashboard"),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },

  // {
  //   path: '/bug-report',
  //   name: 'BugReport',
  //   component: () => import('@/views/bug-report/BugReport'),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  // {
  //   path: '/admin/tool-tip',
  //   name: 'ToolTip',
  //   component: () => import('@/views/tool-tip/ToolTip'),
  //   meta: { authAdmin: true },
  //   role:[23]
  // },
  {
    path:"/escalation/:id?",
    name:"EsclationAction",
    component: () => import("@/views/EsclationAction")
  }

]
const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(),
  routes
})
function isLoggedIn() {
  return JSON.parse(localStorage.getItem('auth'))?.token
}

// this route used for requested page after login
router.beforeEach((to, from, next) => {
  /** esclation action page for external user not need authpage */
  if (to.matched.some((record) => record.meta.authAdmin)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isLoggedIn()) {
      store.dispatch("removeLocalStorage")
      next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
     //url routes with permissions 
      rolesPermissionFind(store.state.screenPermissions?.screensPermissions, to?.meta?.role) || to?.meta?.all==true ?  next() :  alertSwal(messages?.permissionsError) // go to wherever I'm going
    }
  } else {
    if (isLoggedIn() && to.name != "EsclationAction") {
      const redirectOpenUrl = localStorage.getItem("redirectUrl")
      if (to.name != "Login") {
        next({
          path: redirectOpenUrl,
          query: { redirect: to.fullPath },
        });
      } else {
        next({
          path: redirectOpenUrl,
        });
      }
    } else {
      next()
    }
    // next() // does not require auth, make sure to always call next()!
  }
});
export default router;
