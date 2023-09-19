<template>
	<a-modal width="50%" title="Messages" centered :maskClosable="false"  @cancel="closeModal()" class="chatModal">
		<a-row :gutter="24">
			<a-col :span="24" class="chatBox2">
				<div class="chatBox" ref="scroll" id="chatBox">
					<a-list item-layout="horizontal">
						<a-list-item>
							<a-list-item-meta>
								<template #avatar>
									<a-avatar>
										<img v-if="patientPic" :src="patientPic" alt="" />
										<img v-else src="@/assets/images/userAvatar.png" alt="" />
									</a-avatar>
								</template>
								<template #title>
									<a v-if="auth.user.id != communication.senderId" href="#">{{ communication.from }}</a>
									<a v-else href="#">{{ communication.to }}</a>
								</template>
								<template #description>
									<span>Active</span>
								</template>
							</a-list-item-meta>
						</a-list-item>
					</a-list>
					<!-- <div class="chatBoxInner">
						<div class="innerChatBox" v-for="msg,index in list.conversationList" :key="index">
							<div v-if="auth.user.id == 1">
								<div class="chatWrapper left" v-if="auth.user.id != msg.senderId && msg.senderId == list.conversationList[0].senderId">
									<div class="message">
										{{msg.message}}
									</div>
									<div class="time">{{ msg.createdAt }}</div>
								</div>
								<div class="chatWrapper right" v-else-if="auth.user.id == msg.senderId || msg.senderId != list.conversationList[0].senderId">
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
					</div> -->
					<ChatScreenBody :conversationList="list.conversationList" :communication="communication" screen="withoutPatient" />
				</div>
			</a-col>
		</a-row>
		<Loader />
		<template #footer>
			<a-form ref="formRef" :model="formValue" layout="vertical" @finish="sendMsg" @finishFailed="taskFormFailed">
				<div class="sendMessage" v-if="auth.user.id==communication.receiverId || auth.user.id==communication.senderId">
					<a-input v-model:value="formValue.msgSend" size="large" placeholder="Type Message">
						<template #addonAfter>
							<!-- <a-button v-show="name=='communication' && !Id" class="modal-button" type="primary" html-type="submit">{{$t('global.send')}}</a-button> -->
							<SendOutlined @click="sendMsg" />
						</template>
					</a-input>
				</div>
				<div class="sendMessage" v-else>
					<a-input v-model:value="formValue.msgSend" size="large" placeholder="Type Message" disabled>
						<template #addonAfter >
							<!-- <a-button v-show="name=='communication' && !Id" class="modal-button" type="primary" html-type="submit">{{$t('global.send')}}</a-button> -->
							<SendOutlined @click="sendMsg" />
						</template>
					</a-input>
				</div>
			</a-form>
		</template>
	</a-modal>
</template>

<script>
	import {
		SendOutlined
	} from "@ant-design/icons-vue";
	import {
		watchEffect,
		reactive,
		ref,
		onUnmounted,
		onMounted,
		// computed
	} from "vue"
	import {
		useStore
	} from "vuex"
	import {
		dateFormat,
		timeStamp
	} from "@/commonMethods/commonMethod"
	import Loader from "@/components/loader/Loader";
	import moment from "moment"
	import ChatScreenBody from "@/components/communications/ChatScreenBody";

	export default {
		components: {
			SendOutlined,
			ChatScreenBody,
			Loader,
		},
		props: {
			communication: {
				type: Object,
				patientPic:String
			}
		},
		setup(props) {
			const store = useStore()
			const formValue = reactive({
				msgSend: ''
			})
			// const toScroll = computed(() => {
			// 	return store.state.common.toScroll
			// })

			const scroll = ref()
			const auth = JSON.parse(localStorage.getItem("auth"))
			let interval = setInterval(() => {
				store.dispatch("conversation", props.communication.id)
				// if(toScroll.value) {
					getScroll()
					store.commit('toScroll', false)
				// }
			}, 5000);

			const list = store.getters.communicationRecord.value
			
			const tableContent = ref(null)
			watchEffect(() => {
				store.state.communications.conversationList = ""
				store.dispatch("conversation", props.communication.id)
				tableContent.value = document.getElementsByClassName('chatBoxInner')
				// if(toScroll.value) {
					getScroll()
					store.commit('toScroll', false)
				// }
			})

			function getScroll() {
				setTimeout(() => {
					if(tableContent.value[0].scrollTop < tableContent.value[0].scrollHeight+10) {
						tableContent.value[0].scrollTop = tableContent.value[0].scrollHeight+10
					}
				},2000)
			}

			function sendMsg() {
				if (formValue.msgSend) {
					list.conversationList.push({
						conversationId: props.communication.id,
						senderId: auth.user.id,
						message: formValue.msgSend,
						type: "text",
						isRead: 0,
						createdAt: timeStamp(moment())
					})
					store.dispatch("conversationSend", {
						conversationId: props.communication.id,
						message: formValue.msgSend,
						type: "text",
					}).then(() => {
					})

					formValue.msgSend = ''
					// store.state.communications.conversationList=""
					//store.dispatch("conversation", props.communication.id)
				}
				getScroll()
			}

			function closeModal() {
				store.state.communications.conversationList = ""
				clearInterval(interval);
			}

			onMounted(() => {
				getScroll()
			})

			onUnmounted(() => {
				clearInterval(interval)
			})

			return {
				list,
				sendMsg,
				formValue,
				dateFormat,
				closeModal,
				auth,
				scroll,

			};
		},
	};
</script>

<style scoped>
	.chatBox {
		height: auto !important;
	}
	.chatBox .chatBoxInner {
		min-height: calc(100vh - 320px) !important;
    overflow: auto !important;
	}
</style>