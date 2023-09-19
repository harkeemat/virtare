<template>
  <!-- check logged in user -->
  <div class="h-100" v-if="checkAuth || isLogged">
    <!-- Login Loader -->
    <div v-if="screensPermissions == null" class="loader">
      <div class="loaderWrapper">
        <div class="loaderInner"></div>
      </div>
      <!-- end loader -->
    </div>
    <a-layout class="h-100">
      <!-- header component -->
      <Header
        v-if="
          !route.path.match('/escalation-action/') &&
          !route.path.match('/templateResponse/') &&
          route.name !=='EsclationAction'
        "
      />
      <a-layout>
        <!-- super admin sidebar -->
        <AdminSidebar
          v-if="
            route.path.match('/admin/') &&
            !route.path.match('/escalation-action/') &&
            !route.path.match('/templateResponse/') &&
            route.name !=='EsclationAction'
          "
        />
        <!-- admin sidebar -->
        <Sidebar
          v-else-if="
            !route.path.match('/escalation-action/') &&
            !route.path.match('/templateResponse/') &&
            route.name !=='EsclationAction'
          "
        />
        <!-- All routes render here -->
        <a-layout>
          <router-view />
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
  <!-- After logout -->
  <div class="h-100" v-else>
    <router-view />
  </div>
  <LogoutLoader />
  <!-- Login loader  -->

  <!-- end loader -->
  <!-- called global modal -->
  <CareCoordinatorDetailsModal
    v-if="visibleModal"
    v-model:visible="visibleModal"
    @closeModal="handleOk"
  />
  <PatientDetails
    v-if="visiblePatientModal && patientUdid"
    v-model:visible="visiblePatientModal"
    @closeModal="handleOk"
  />
</template>

<script>
import { onMounted, computed, defineAsyncComponent } from "vue";
// import router from "@/router";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import LogoutLoader from "@/components/loader/LogoutLoader.vue";
import SendbirdChat from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
export default {
  components: {
    LogoutLoader,
    PatientDetails: defineAsyncComponent(() =>
      import("@/components/patients/patientSummary/modals/PatientDetails.vue")
    ),
    CareCoordinatorDetailsModal: defineAsyncComponent(() =>
      import("@/components/coordinator-summary/CareCoordinatorDetailsModal.vue")
    ),
    Header: defineAsyncComponent(() =>
      import("@/components/layout/header/Header.vue")
    ),
    Sidebar: defineAsyncComponent(() =>
      import("@/components/layout/sidebar/Sidebar.vue")
    ),
    AdminSidebar: defineAsyncComponent(() =>
      import("@/components/administration/layout/sidebar/Sidebar.vue")
    ),
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    //const router = useRouter()
    let date = new Date();
    const authUser = JSON.parse(localStorage.getItem("auth"));

    const isLogged = computed(() => {
      return store.state.authentication.loggedInUser;
    });

    const checkAuth = isLogged.value ? isLogged.value : authUser?.user.staff;
    const refreshToken = computed(() => {
      return store.state.authentication.expiresIn;
    });

    const visibleModal = computed(() => {
      return store.state.careCoordinatorSummary.visibleModal;
    });

    const visiblePatientModal = computed(() => {
      return store.state.patients.visiblePatientDetailsModal;
    });

    const patientUdid = computed(() => {
      return store.state.patients.patientUdid;
    });

    const screensPermissions = computed(() => {
      return store.state.screenPermissions.screensPermissions;
    });

    const initSendbird = async () => {
      await SendbirdChat.init({
        appId: "4B227587-808E-48C0-86A6-83F8DF1266E1",
        modules: [new GroupChannelModule()],
      });
    };

    onMounted(async () => {
      document.body.classList.add("test");
      if (refreshToken.value != null) {
        if (refreshToken.value > date.getTime()) {
          store.dispatch("filterDateDataGet");
          store.dispatch("globalCodes");
          // store.dispatch("appointmentConference");
          store.dispatch("notificationList");
          let differenceDate = refreshToken.value - date.getTime();
          setTimeout(() => {
            store.dispatch("refreshToken");
          }, differenceDate);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("barmenu");
          localStorage.removeItem("staff");
          localStorage.removeItem("token");
          localStorage.removeItem("auth");
          localStorage.removeItem("roleAuth");
          localStorage.removeItem("access");
          localStorage.removeItem("accessPermission");
          localStorage.removeItem("permission");
          localStorage.removeItem("screensPermission");
          localStorage.removeItem("widgetsPermission");
          localStorage.removeItem("expiresIn");
          localStorage.removeItem("checkLogin");
          localStorage.removeItem("taskRoute");
          localStorage.removeItem("communicationRoute");
          sessionStorage.removeItem("chatSession");
          localStorage.removeItem('redirectUrl')
          // sessionStorage.removeItem("noteSession");

          setTimeout(() => {
            // router.go();
          }, 1000);
        }
        store.dispatch("roleAccess");
      }
      localStorage.removeItem("isChatOpened");
      initSendbird(); // init sendbird app
    });

    function handleOk() {
      store.commit("closeStaffDetailsModal");
      store.commit("closePatientDetailsModal");
    }

    return {
      route,
      isLogged,
      checkAuth,
      patientUdid,
      visiblePatientModal,
      handleOk,
      visibleModal,
      screensPermissions,
    };
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.SelectLanguage {
  padding-top: 10px;
  text-align: center;
}
</style>
