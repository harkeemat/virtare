<template>
    <a-layout-content>
      <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle">
                    {{ $t('communications.communications') }}
                    <div class="addtaskButton">
                        <StartCall @click="showStartCallModal" v-if="arrayToObjact(screensPermissions,107)" data-v-5d567869="showStartCallModal"></StartCall>
                        <SendMessage v-if="arrayToObjact(screensPermissions,109)"></SendMessage>
                    </div>
                    <div class="filter">
                      <button class="btn dashboardView" :class="toggle ? 'active' : ''" @click="toggleButton('dashboard')"  >
                        <span class="btn-content">{{$t('tasks.dashboardView')}}</span>
                      </button>
                      <button class="btn listView" :class="!toggle ? 'active' : ''" @click="toggleButton('list')">
                        <span class="btn-content">{{$t('global.listView')}}</span>
                      </button>
                    </div>
                </h2>
            </a-col>
            <a-col :span="24">
                <!-- Dashboard View -->
                <div class="dashboard-view" v-show="toggle && dashboardView" >
                    <DashboardView v-if="arrayToObjact(screensPermissions,109)"/>
                </div>
                <!-- List View -->
                <div class="list-view" v-show="!toggle && listView">
                    <ListView />
                </div>
            </a-col>
        </a-row>
        <Loader />
        </div>
    </a-layout-content>
    <AddStartCall v-model:visible="AddStartCall"  @is-visible="closeStartCallModal($event)"/>
</template>
<script>
import { ref, h, defineComponent, defineAsyncComponent, watchEffect } from "vue";
import DashboardView from "@/components/communications/DashboardView.vue";
import ListView from "@/components/communications/ListView.vue";
import StartCall from "@/components/communications/top/StartCall.vue";
import { notification, Button } from "ant-design-vue";
import { useStore } from "vuex";
import {arrayToObjact} from "@/commonMethods/commonMethod.js"
import Loader from "@/components/loader/Loader.vue";
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({
  components: {
    DashboardView,
    ListView,
    StartCall,
    SendMessage:defineAsyncComponent(()=>import("@/components/communications/top/SendMessage")),
    Loader,
    AddStartCall:defineAsyncComponent(()=>import("@/components/modals/AddStartCall"))

  },
  
  setup() {
    const toggle = ref(true);
    const router = useRouter()
    const route = useRoute()
    const dashboardView = ref(true)
    const listView = ref(false)
    
    watchEffect(() => {
      
      if(route.query.view == 'list') {
        dashboardView.value = false
        listView.value = true
        toggle.value = false
      }
      else if(route.query.view == 'dashboard') {
        dashboardView.value = true
        listView.value = false
        toggle.value = true
      }
    })

    function toggleButton(val) {
      store.commit('communicationRoute', val)
      localStorage.setItem('communicationRoute', val)
      store.commit('loadingStatus', true)
      if(val == 'list') {
        router.replace({query: {view: 'list'}});
        dashboardView.value = false
        listView.value = true
        toggle.value = false
      }
      else if(val == 'dashboard') {
        router.replace({query: {view: 'dashboard'}});
        dashboardView.value = true
        listView.value = false
        toggle.value = true
      }

      setTimeout(()=>{
        // toggle.value=!toggle.value
        store.commit('loadingStatus', false)
      },1000)
    }

    const AddStartCall = ref(false)
    const handleChange = () => {
    };
    const store = useStore()
    const openNotification = (data) => {
      var key = `open${Date.now()}`;
      var message = "";
      var description = null 
      (
        `<div class="notificationBody">
          <p>
            Date Time : <span>December 20, 2021 12:00 PM</span>
          </p>
          <p>
            Patient Name : <span>Jane Doe</span>
          </p>
          <p class="summary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            at incidunt !
          </p>
        </div>`
      );
      var button = "";
      
      const boxname = data.boxname;
      const placement = data.placement;
      if(boxname == 'email') {
        // message = <h2>Email</h2>;
        // button = h(
        //   Button,
        //   {
        //     type: "primary",
        //     onClick: () => notification.close(key),
        //   },
        //   "Reply"
        // );
      }
      else if(boxname == 'sms') {
        // key = key;
        // message = <h2>SMS</h2>;
        // button = h(
        //   Button,
        //   {
        //     type: "primary",
        //     onClick: () => notification.close(key),
        //   },
        //   "Reply"
        // );
      }
      else if(boxname == 'reminder') {
        // key = key;
        // message = <h2>Reminder</h2>;
      }
      else if(boxname == 'call') {
        // key = key;
        // message = <h2>Call</h2>;
        // button = [
        //   h(
        //     Button,
        //     {
        //       onClick: () => notification.close(key),
        //     },
        //     "Cancel "
        //   ),
        //   h(
        //     Button,
        //     {
        //       type: "primary",
        //       onClick: () => notification.close(key),
        //     },
        //     "Accept"
        //   ),
        // ];
      }

      notification.open({
        message: message,
        description: description,
        btn: button,
        key: key,
        onClose: close,
        placement
      });
    };

    function showStartCallModal(){
      AddStartCall.value =true
    }
    function closeStartCallModal(e){
      AddStartCall.value =e
    }
    function closeModal(value) {
      AddStartCall.value = value
    }

 
    return {
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      closeModal,
      closeStartCallModal,
      showStartCallModal,
      AddStartCall,
      toggle,
      openNotification,
      handleChange,
      toggleButton,
      dashboardView,
      listView,
    };
  },
});
</script>
