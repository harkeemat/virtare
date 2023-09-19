<template>
  <div class="send-grid-wrapper" >
      <Chat :config="configData" :setSbUserInfo="setSbUserInfo" :setUnreadMessageCount="setUnreadMessageCount" />
  </div>
</template> 

<script>
// import SendBirdCall from 'sendbird-calls';
import { applyPureReactInVue } from "veaury";
import { ref } from "vue";
import ChatReactComponent from "@/react_app/Chat.jsx";
import { useStore } from "vuex";
// SendBirdCall.useMedia()
// SendBirdCall.init(config.APP_ID)
export default {
  components: {
    Chat: applyPureReactInVue(ChatReactComponent),
  },
  props:{
    config:Object
  },
  setup(props) {
    const store = useStore();
    const userRef = ref(null);  
    const messageCountRef = ref(null); 
    const memberName =  props?.config?.members?.find((item)=>{
             return item.nickname !== props?.config?.operators[0]?.nickname
            })
    return {
       memberName, 
      setSbUserInfo: (user) => {
        userRef.value = user;
        store.state.sendbirdState.unReadUser = user
      },
      setUnreadMessageCount: (count) => {
        messageCountRef.value = count;
        store.state.sendbirdState.unReadCount = count
      },
      sbUserInfo: userRef,
      messageCount: messageCountRef,
      configData :{
          APP_ID: "4B227587-808E-48C0-86A6-83F8DF1266E1",
          USER_ID: props?.config?.operators[0]?.user_id, // member id
          OPT_NICKNAME: props?.config?.operators[0]?.nickname, 
          MEM_NICKNAME: memberName?.nickname,
          MEM_USERID:memberName?.user_id,
          PROFILE_URL: memberName?.profile_url,
          CHANNEL_URL:props?.config?.channel?.channel_url  // channel url 
        }
    };
  },
};
</script>
