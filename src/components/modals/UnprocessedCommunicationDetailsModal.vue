<template>
  <a-modal :title="communicationType == 'Email' && communicationDetails.subject ? 'Subject: '+communicationDetails.subject : communicationType" width="70%" centered :footer="false" :maskClosable="false" @cancel="closeModal">
    <div class="communicationDetails" v-if="communicationDetails">
      
      <div class="messageBox">
				<a-row>
					<a-col :sm="20">
						<p class="sender">
              <span class="avatar">
                <PhoneOutlined v-if="communicationType == 'SMS'" />
                <MailOutlined v-if="communicationType == 'Email'" />
              </span>
              {{ communicationDetails.from }}
            </p>
						<p class="time">
              <span class="avatar">
                <ClockCircleOutlined />
              </span>
              {{ communicationDetails.createdAt}}</p>
						<p class="message" style="padding-top: 10px !important;" v-html="communicationDetails.message ? communicationDetails.message : '--'"></p>
					</a-col>
				</a-row>
			</div>
      
    </div>
  </a-modal>
</template>

<script>
import { computed, ref, watchEffect } from 'vue-demi'
import { useStore } from 'vuex'
import {
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
  },
  setup(props, { emit }) {
    const store = useStore()
    const communicationType = ref(null)

    const communicationDetails = computed(() => {
      return store.state.unprocessedCommunications.communicationDetails
    })

    watchEffect(() => {
      communicationType.value = communicationDetails.value ? communicationDetails.value.type : ''
    })

    const closeModal = () => {
      emit('closeModal')
    }

    return {
      communicationType,
      communicationDetails,
      closeModal,
    }
  }
}
</script>

<style>
.messageBox { padding: 10px 30px; background: #f0f8ff; }
.msgTitle { padding-bottom: 5px }
p.sender {
	font-size: 16px;
	color: #838383;
}
span.avatar {
  position: relative;
  top: -4px;
  right: 5px;
}
p.message {
	font-size: 16px;
	padding-left: 20px;
	padding-top: 5px;
  overflow: auto !important;
}
p.time {
	font-size: 12px;
	color: #838383;
  padding-left: 4px !important;
}
</style>