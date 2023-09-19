<template>
  <a-layout-sider>
    <div class="icon">
      <MenuOutlined @click="barMenuFn" />
    </div>
    <div class="menuList" @mouseenter="isHovering(true)" @mouseleave="isHovering(false)">
      <a-menu id="dddddd" mode="inline" @click="handleClick">
        <!-- <a-menu-item key="1">
          <router-link to="/dashboard">
            <MenuIcon icon="home" /><span class="menuItem">{{
              $t("sidebar.clinical")
            }}</span>
          </router-link>
        </a-menu-item> -->
        <!-- <a-menu-item key="2" v-if="rolesPermissionFind(widgetsPermissions, [3, 7, 8, 9])">
          <router-link to="/businessDashboard">
            <CreditCardOutlined /><span class="menuItem">{{
              $t("sidebar.business")
            }}</span>
          </router-link>
        </a-menu-item> -->
        <a-menu-item key="3" v-if="rolesPermissionFind(screensPermissions, [544])">
          <router-link to="/escalations">
            <a-badge :dot="store.state.alerts.alertDot">
              <MenuIcon icon="escalation" /><span class="menuItem" id="test">{{
                $t("alerts.alerts")
              }}</span>
            </a-badge>
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="4" v-if="rolesPermissionFind(screensPermissions, [109])">
          <router-link
            :to="{
              name: 'Communications',
              query: {
                view: communicationRoute ? communicationRoute : 'dashboard',
              },
            }"
          >
            <MenuIcon icon="message" /><span class="menuItem">{{
              $t("sidebar.messages")
            }}</span>
          </router-link>
        </a-menu-item> -->
        <!-- <a-menu-item key="5" v-if="rolesPermissionFind(screensPermissions, [113])">
          <router-link
            :to="{
              name: 'Tasks',
              query: { view: tasks ? tasks : 'dashboard' },
            }"
          >
            <MenuIcon icon="task" /><span class="menuItem">{{
              $t("sidebar.tasks")
            }}</span>
          </router-link>
        </a-menu-item> -->
        <!-- <a-menu-item key="6" v-if="rolesPermissionFind(screensPermissions, [112])">
          <router-link to="/appointment-calendar">
            <MenuIcon icon="calendar" /><span class="menuItem"
              >{{ $t("sidebar.calendar") }}
            </span>
          </router-link>
        </a-menu-item> -->
        <a-menu-item key="7" v-if="rolesPermissionFind(screensPermissions, [409])">
          <router-link to="/referral">
            <FileDoneOutlined /><span class="menuItem">{{ $t("sidebar.referral") }}</span>
          </router-link>
        </a-menu-item>
        <!-- [ 65 , 62 ] /** only read permission is needed to show this screen */ -->
        <a-menu-item key="8" v-if="rolesPermissionFind(screensPermissions, [65, 62])">
          <router-link to="/patients">
            <MenuIcon icon="patient" /><span class="menuItem">{{
              $t("sidebar.patients")
            }}</span>
          </router-link>
        </a-menu-item>
        <!-- <a-divider v-if="rolesPermissionFind(screensPermissions, [411])"></a-divider> -->
        <!-- <a-menu-item key="9" v-if="rolesPermissionFind(screensPermissions, [415])">
          <router-link to="/time-log">
            <FieldTimeOutlined /><span class="menuItem">{{
              $t("sidebar.timeLog")
            }}</span>
          </router-link>
        </a-menu-item> -->
       <a-menu-item key="10" v-if="rolesPermissionFind(screensPermissions, [514, 515])">
          <router-link to="/directory">
            <MenuIcon icon="directory"/><span class="menuItem">{{ $t('specialists.title') }}</span>
          </router-link>
        </a-menu-item>

        <!-- <a-sub-menu key="7" @titleClick="titleClick" v-if="rolesPermissionFind(screensPermissions, [40, 37])">
          <template #icon>
            <MenuIcon icon="directory" />
          </template>
          <template #title
            ><span class="menuItem">{{ $t("sidebar.staff") }}</span></template
          >
          <a-menu-item key="11" v-if="rolesPermissionFind(screensPermissions, [40, 37])">
            <router-link to="/manage-care-coordinator">
              <TeamOutlined /><span class="menuItem">{{ $t("sidebar.in") }}</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="12" v-if="rolesPermissionFind(screensPermissions, [40])">
            <router-link to="/specialists">
              <MedicineBoxOutlined /><span class="menuItem">{{ $t("sidebar.out") }}</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu> -->
        <a-divider v-if="rolesPermissionFind(screensPermissions, [543])"></a-divider>
        <a-menu-item key="10" v-if="rolesPermissionFind(screensPermissions, [543])">
          <router-link to="/time-tracking-report">
            <MenuIcon icon="billing"/><span class="menuItem">{{
              $t("sidebar.reports")
            }}</span>
          </router-link>
        </a-menu-item>
        <a-divider v-if="rolesPermissionFind(screensPermissions, [509,508,336,337])"></a-divider>
        <a-menu-item key="13" v-if="rolesPermissionFind(screensPermissions, [509, 508])">
          <router-link to="/clients">
            <MenuIcon icon="client" /><span class="menuItem">{{
              $t("sidebar.clients")
            }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="14" v-if="rolesPermissionFind(screensPermissions, [336,337])">
          <router-link to="/inventory">
            <MenuIcon icon="device" />
            <span class="menuItem">{{ $t("sidebar.device") }}</span>
          </router-link>
        </a-menu-item>
        <a-divider
          v-if="rolesPermissionFind(screensPermissions, [485, 487, 488])"
        ></a-divider>
        <a-menu-item key="15" v-if="rolesPermissionFind(screensPermissions, [485])">
          <router-link to="/roles-and-permissions">
            <SafetyOutlined /><span class="menuItem">Roles & Permissions </span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="16" v-if="rolesPermissionFind(screensPermissions, [487])">
          <router-link to="/cpt-codes">
            <CreditCardOutlined /><span class="menuItem">CPT Codes</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="17" v-if="rolesPermissionFind(screensPermissions, [488])">
          <router-link to="/manage-programs">
            <ReadOutlined /><span class="menuItem">Programs</span>
          </router-link>
        </a-menu-item>
        <!-- <a-divider></a-divider> -->
      </a-menu>
    </div>
    <span class="version">V : 3.0 03/08/2023</span>
  </a-layout-sider>
</template>
<script setup>
import { computed, onUnmounted, ref, watch, watchEffect, onMounted } from "vue";
import {
  CreditCardOutlined,
  FileDoneOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  FieldTimeOutlined,
  MenuOutlined,
  SafetyOutlined,
  ReadOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import MenuIcon from "@/components/layout/sidebar/icons/MenuIcons.vue";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
const store = useStore();
const barMenu = ref(JSON.parse(localStorage.getItem("barmenu")));
const screensPermissions = computed(() => {
  return store.state.screenPermissions.screensPermissions;
});

onMounted(() => {
  if (JSON.parse(localStorage.getItem('auth'))?.token !== null)
    store.dispatch("alerts/checkActiveAlert");
});

onUnmounted(() => {
  document.body.classList.remove("show");
});

const openKeys = ref(["sub1"]);
const handleClick = () => { };
const titleClick = () => { };
watch(
  () => openKeys,
  () => {}
);

const tasks = computed(() => {
  return store.state.tasks.taskRoute;
});
const communicationRoute = computed(() => {
  return store.state.communications.communicationRoute;
});
function barMenuFn() {
  barMenu.value = JSON.parse(localStorage.getItem("barmenu"));
  if (barMenu.value == true) {
    localStorage.setItem("barmenu", JSON.stringify(false));
  } else {
    localStorage.setItem("barmenu", JSON.stringify(true));
  }
  document.body.classList.toggle("show");
}

// Class added in body section
const isHovering = (value) => {
  if (value == true) {
    document.body.classList.add("activeSidebar");
  } else {
    document.body.classList.remove("activeSidebar");
  }
};

const widgetsPermissions = store.getters.widgetsPermissions;
</script>

