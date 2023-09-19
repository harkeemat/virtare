<template>
  <a-col :span="10" v-if="showRightPanel" id="rightPanel" >
    <a-tabs v-model:activeKey="activeTab" class="client-tabs right-tabs" >
      <a-tab-pane key="14" v-if="rolesPermissionFind(screensPermissions, [87]) ||rolesPermissionFind(screensPermissions, [95])">
        <template #tab>
          <span> Notes </span>
        </template>
        <Notes v-if="activeTab == '14'"/>
      </a-tab-pane>
      <a-tab-pane key="15" v-if="patientInformation?.snf == false">
        <template #tab >
          <span>
            Messages 
            <span class="custom-badge" v-if="sendBirdChatData?.unReadCount > 0 &&
                sendBirdChatData?.patientId?.localeCompare(patientInformation?.udid)==0">{{sendBirdChatData?.unReadCount > 9? "9+": sendBirdChatData?.unReadCount}}
            </span>
          </span>
        </template>
        <div v-if="activeTab == '15'">
          <Messages v-if="activeTab == '15'" />
        </div>
      </a-tab-pane>
      <a-tab-pane key="16">
        <template #tab>
          <span> Tasks </span>
        </template>
        <Tasks />
      </a-tab-pane>
    </a-tabs>
  </a-col>
</template>

<script>
import Notes from "@/components/patients/patientDetails/rightPanel/tabs/notes/Notes";
import Messages from "@/components/patients/patientDetails/rightPanel/tabs/Messages";
import Tasks from "@/components/patients/patientDetails/rightPanel/tabs/Tasks";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
export default {
  props: {
    showRightPanel: Boolean,
  },
  components: {
    Notes,
    Messages,
    Tasks,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const patientInformation = computed(() => {
      return store.state.patientsStore.patientInformation;
    });
    const sendBirdChatData = computed(() => {
      return store.state.sendbirdState;
    });
    const screensPermissions = store.getters.screensPermissions;

    onMounted(()=>{
      localStorage.setItem("isChatOpened", true);
      setTimeout(()=>{
        if(route?.params?.udid && route.name == 'PatientDetails' && patientInformation.value?.snf==false){
        store.dispatch('getMsgUnreadCount',route?.params?.udid)
      }
      },2000)
    })

    onUnmounted(()=>{
      localStorage.removeItem("isChatOpened");
      store.state.sendbirdState.unReadCount = null
    })


    return {
      sendBirdChatData,
      patientInformation,
      activeTab: ref("14"),
      rolesPermissionFind,
      screensPermissions,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.common-wrapper {
  .client-tabs {
    &.ant-tabs {
      :deep(.ant-tabs-nav) {
        max-width: 100%;

        .ant-tabs-nav-wrap {
          &::after,
          &::before {
            display: none;
          }
        }
        .ant-tabs-content-holder {
          position: relative;
        }
      }
    }

    &.right-tabs {
      background-color: $table-color;
      :deep(.ant-tabs-nav) {
        padding: 0 27px;
      }
    }
  }
}
</style>