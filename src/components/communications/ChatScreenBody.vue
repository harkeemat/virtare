<template>
  <div class="chatBoxInner">
    <div v-if="screen == 'withoutPatient'">
      <div class="innerChatBox" v-for="msg,index in conversationList" :key="index">
        <div v-if="auth.user.id == 1">
          <div class="chatWrapper left" v-if="auth.user.id != msg.senderId && msg.senderId == conversationList[0].senderId">
            <div class="message">
              {{msg.message}}
            </div>
            <div class="time">{{ msg.createdAt }}</div>
          </div>
          <div class="chatWrapper right" v-else-if="auth.user.id == msg.senderId || msg.senderId != conversationList[0].senderId">
            <div class="message">
              {{msg.message}}
            </div>
            <div class="time" >{{ msg.createdAt }}</div>
          </div>
        </div>
        <div v-else>
          <div class="chatWrapper left" v-if="auth.user.id != msg.senderId">
            <div class="message">
              {{msg.message}}
            </div>
            <div class="time">{{ msg.createdAt }}</div>
          </div>
          <div class="chatWrapper right" v-else-if="auth.user.id == msg.senderId">
            <div class="message">
              {{msg.message}}
            </div>
            <div class="time" >{{ msg.createdAt }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="msg,index in conversationList" :key="index">
        <div class="chatWrapper left" v-if="msg.senderId == patientId">
          <div class="message">
            {{msg.message}}
          </div>
          <div class="time">{{ msg.createdAt }}</div>
        </div>
        <div class="chatWrapper right" v-if="msg.senderId != patientId">
          <div class="message">
            {{msg.message}}
          </div>
          <div class="time" >{{ msg.createdAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from 'vue-demi'
import { useStore } from 'vuex'
export default {
  props: {
    conversationList: {
      type: Array
    },
    communication: {
      type: Object
    },
    screen: {
      type: String
    },
    patientId: {
      type: Number
    },
    communicationId: {
      type: Number
    },
  },
  setup(props) {
    const auth = JSON.parse(localStorage.getItem("auth"))
    const store = useStore()
    const tableContent = ref(null)
    const conversationId = props.communicationId ? reactive(props.communicationId) : props.communication.id

    watchEffect(() => {
      store.state.communications.conversationList = ""
      store.dispatch("conversation", conversationId)
      tableContent.value = document.getElementsByClassName('chatBoxInner')
      getScroll()
    })

    function getScroll() {
      setTimeout(() => {
        // if(tableContent.value[0].scrollTop < tableContent.value[0].scrollHeight+10) {
          tableContent.value[0].scrollTop = tableContent.value[0].scrollHeight+10
        // }
      }, 2000)
    }

    return {
      auth,
    }
  }
}
</script>