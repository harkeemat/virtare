<template>
    <a-layout-sider>
        <div class="icon">
            <MenuOutlined @click="barMenu"/>
        </div>
        <div class="menuList" @mouseenter="isHovering(true)" @mouseleave="isHovering(false)">
            <a-menu theme="light" mode="inline">
                
                <!-- <a-menu-item key="3">
                    <router-link to="/admin/providers" v-if="rolesPermissionFind(screensPermissions, 489)">
                        <OneToOneOutlined /><span class="menuItem">Providers</span>
                    </router-link>
                </a-menu-item> -->
                

                <!-- <a-menu-item key="5">
                    <router-link to="/admin/global-codes" v-if="rolesPermissionFind(screensPermissions, 486)">
                        <GlobalOutlined /><span class="menuItem">Global Codes</span>
                    </router-link>
                </a-menu-item> -->
                
                <!-- <a-menu-item key="7">
                    <router-link to="/admin/staff-groups" v-if="rolesPermissionFind(screensPermissions, 422)">
                        <TeamOutlined />
                        <span class="menuItem">{{ $t("global.groups") }}</span>
                    </router-link>
                </a-menu-item> -->
                <!-- <router-link to="/nested">
                        <a-menu-item>
                            <FileTextOutlined /><span class="menuItem">Nested Demo</span></a-menu-item>
                    </router-link> -->
                <!-- <div class="subMenu">
                <router-link  :to="linkTo" v-if="rolesPermissionFind(screensPermissions, 447) || rolesPermissionFind(screensPermissions, 445)">
                <div class="questionnaireMenu" @click="toggle = !toggle">
                   
                    <FileTextOutlined /><span class="menuItem">Questionnaire</span>
                    <DownOutlined v-if="toggle"/>
                    <UpOutlined v-else/>
                    
                </div>
                </router-link>
                <div class="dropDown" v-show="toggle">
                    <router-link to="/admin/questionnaire-template" v-if="rolesPermissionFind(screensPermissions, 447)">
                        <a-menu-item>
                            <ReconciliationOutlined /><span class="menuItem">Templates</span></a-menu-item>
                    </router-link>
                    <router-link to="/admin/questionnaire-bank" v-if="rolesPermissionFind(screensPermissions, 445)">
                        <a-menu-item>
                            <FileTextOutlined /><span class="menuItem">Question Bank</span></a-menu-item>
                    </router-link>
                    <router-link to="/admin/questionnaireResponse" v-if="rolesPermissionFind(screensPermissions, 332)">
                        <a-menu-item>
                              <ReadOutlined /><span class="menuItem">Questionnaire Response</span>
                        </a-menu-item>
                    </router-link>
                </div>
            </div> -->
                <!-- <router-link to="/admin/work-flow" >
                <a-menu-item>
                    <ApartmentOutlined />
                    <span class="menuItem">{{'WorkFlow Setup'}}</span>
                </a-menu-item>
            </router-link> -->

                <!-- <router-link to="/admin/custom-form" v-if="rolesPermissionFind(screensPermissions, 486)">
                <a-menu-item>
                    <FileTextOutlined /><span class="menuItem">Custom Form</span></a-menu-item>
            </router-link> -->
                <!-- <div class="subMenu">
                <router-link  to="/admin/custom-form" >
                <div class="questionnaireMenu" @click="customFormToggle = !customFormToggle">
                    
                    <FileTextOutlined /><span class="menuItem">Custom Form</span>
                    <DownOutlined />
                </div></router-link>
                <div class="dropDown" v-show="customFormToggle">
                    <router-link to="/admin/form-builder" v-if="rolesPermissionFind(screensPermissions, 447)">
                        <a-menu-item>
                            <ReconciliationOutlined /><span class="menuItem">Form Builder</span></a-menu-item>
                    </router-link>
                    
                </div>
            </div> -->

                <!-- <a-sub-menu key="sub1">
          <template #title>
            <span>
                <router-link  to="/admin/custom-form" >
                  <FileTextOutlined />
                <span>Custom Form</span>
             </router-link>
            </span>
          </template>
          <a-menu-item key="3">
            <router-link to="/admin/form-builder" v-if="rolesPermissionFind(screensPermissions, 447)">
                <ReconciliationOutlined />
                <span>Form Builder</span>
            </router-link>
          </a-menu-item> 
        </a-sub-menu> -->
                <!-- <a-menu-item key="8">
                    <router-link to="/admin/tool-tip" v-if="rolesPermissionFind(screensPermissions, 492)">
                        <FormOutlined /><span class="menuItem">{{
                            $t("sidebar.toolTip")
                        }}</span>
                    </router-link>
                </a-menu-item> -->

                <a-menu-item key="9">
                    <router-link to="/dashboard">
                        <HomeOutlined /><span class="menuItem">Home</span>
                    </router-link>
                </a-menu-item>
            </a-menu>
        </div>
        <span class="version">V: 3.0 03/07/2023</span>
    </a-layout-sider>
</template>

<script>
import {
  defineComponent,
  onUnmounted,
  toRefs,
  ref,
  reactive,
  watchEffect,
  computed,
} from "vue";
import {
  OneToOneOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  HomeOutlined,
  SafetyOutlined,
  //GlobalOutlined,
  ReadOutlined,
  // FileTextOutlined,
  // TeamOutlined,
  // ReconciliationOutlined,
  // DownOutlined,
  // FormOutlined,
  MenuOutlined,
  // UpOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
export default defineComponent({
  components: {
    OneToOneOutlined,
    CreditCardOutlined,
    FileDoneOutlined,
    // UpOutlined,
    //GlobalOutlined,
    //ApartmentOutlined,
    HomeOutlined,
    SafetyOutlined,
    // ReconciliationOutlined,

    // FileTextOutlined,
    // DownOutlined,
    ReadOutlined,
    // TeamOutlined,
    // FormOutlined,
    MenuOutlined,
  },

  setup() {
    const store = useStore();
    //const linkTo = ref(null);
    const state = reactive({
      // selectedKeys: ["1"],
    });
    const screensPermissions = computed(() => {
      return store.state.screenPermissions.screensPermissions;
    });
    watchEffect(() => {
      // if (screensPermissions.value) {
      //   if (rolesPermissionFind(screensPermissions.value, [447])) {
      //     linkTo.value = { name: "QuestionnaireTemplate" };
      //   } else if (rolesPermissionFind(screensPermissions.value, [445])) {
      //     linkTo.value = { name: "QuestionnaireBank" };
      //   }
      // }
    });
    onUnmounted(() => {
      document.body.classList.remove("show");
    });

    // Class added in body section
    function barMenu() {
      var barMenu = JSON.parse(localStorage.getItem("barmenu"));
      if (barMenu == true) {
        localStorage.setItem("barmenu", JSON.stringify(false));
      } else {
        localStorage.setItem("barmenu", JSON.stringify(true));
      }
      document.body.classList.toggle("show");
    }
    const toggle = ref(true);
    const customFormToggle = ref(true);
    const isHovering = (value) => {
      if (value == true) {
        document.body.classList.add("activeSidebar");
      } else {
        document.body.classList.remove("activeSidebar");
      }
    };
    return {
      isHovering,
      ...toRefs(state),
      // collapsed: ref(false),
      toggle,
      customFormToggle,
      rolesPermissionFind,
     // linkTo,
      barMenu,
      screensPermissions,
      // selectedKeys: ref(["1"]),
    };
  },
});
</script>

<style lang="scss">
#nav {
  a {
    color: #000;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
