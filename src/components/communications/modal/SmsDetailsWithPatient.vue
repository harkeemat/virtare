<template>
	<a-modal width="95%" title="Message Details" centered :footer="false" :maskClosable="false" zIndex=1060 @cancel="closeModal()">
		
		<div class="common-bg replyScreen">
			<div class="videoWrapper chatBox2">
				<div class="leftWrapper" id="videoDiv">
					<div class="chatBox" ref="scroll" id="chatBox">
						<div v-for="message in showSmsData.message" :key="message.id" :class="userId != message.senderId ? 'messageBox left' : 'messageBox right'">
							<a-row>
								<a-col :sm="20">
									<p class="sender"><span class="userIcon"><UserOutlined /></span>{{ message.sender }}</p>
									<span class="time"><span class="timeIcon"><ClockCircleOutlined /></span>{{ message.time }}</span>
									<p class="message" v-html="message.message"></p>
								</a-col>
							</a-row>
						</div>
					</div>

					<div class="replyBox">
						<a-form ref="formRef" :model="replyForm" layout="vertical" @finish="submitForm">
							<a-row>
								<a-col :span="24">
									<div class="form-group">
										<a-form-item :label="$t('communications.communicationsModal.reply')" name="message" :rules="[{ required: true, message: $t('communications.communicationsModal.message')+' '+$t('global.validation')  }]">
											<a-textarea :rows="3" v-model:value="replyForm.message" @change="checkChangeInput()" />
										</a-form-item>
									</div>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="24">
									<div class="steps-action">
										<a-button class="modal-button" @click="closeModal" >Cancel</a-button>
										<a-button class="modal-button" type="primary" html-type="submit">{{$t('global.send')}}</a-button>
									</div>
								</a-col>
							</a-row>
						</a-form>
					</div>
					
				</div>
				<ChatRightPanel :communication="communication" :isChat="false" />
			</div>
		</div>

		<Loader />
	</a-modal>
</template>

<script>
import Loader from '@/components/loader/Loader.vue';
import {
	defineComponent,
	computed,
	ref,
	reactive,
	onMounted
} from "vue-demi";
import { useStore } from 'vuex';
import { warningSwal } from '../../../commonMethods/commonMethod';
import { messages } from '../../../config/messages';
import ChatRightPanel from "@/components/common/communications/ChatRightPanel"

export default defineComponent({
	name: "AppintmentDetails",
	components: {
		Loader,
		ChatRightPanel,
	},
	props: {
		communication: {
			type: Object
		}
	},
	setup(props, { emit }) {
		const store = useStore()
    const formRef = ref(null)
		const authUser = JSON.parse(localStorage.getItem('auth'))
		const userId = authUser.user.id
		const patientUdid = ref(null)
		const patientId = ref(null)
		const communications = reactive(props.communication)
		const isCommunicationWithPatient = ref(false)

		const replyForm = reactive({
			message: "",
		});
		const form = reactive({ ...replyForm });

		const checkChangeInput = () => {
			store.commit('checkChangeInput', true)
		}

		const showSmsData = computed(() => {
			return store.state.communications.showSmsData
		})

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

		onMounted(() => {
			if(communications && communications.is_sender_patient) {
				patientUdid.value = communications.fromId
				patientId.value = communications.senderId
					isCommunicationWithPatient.value = true
			}
			else if(communications && communications.is_receiver_patient) {
				patientUdid.value = communications.toId
				patientId.value = communications.receiverId
				isCommunicationWithPatient.value = true
			}
			else {
				isCommunicationWithPatient.value = false
			}

			if(isCommunicationWithPatient.value) {
				store.dispatch("patientDetails", patientUdid.value)
				store.dispatch('patientTimeline', {
					id: patientUdid.value,
					type: ''
				});
			}
		})

		const submitForm = () => {
			store.dispatch("replyCommunication", {
				communicationId: showSmsData.value.id,
				data: replyForm
			}).then(() => {
				store.commit('checkChangeInput', false)
        store.dispatch("showSmsData", showSmsData.value.id)
				formRef.value.resetFields();
				Object.assign(replyForm, form);
			});
		};

		const closeModal = () => {
			if(checkFieldsData.value) {
				emit("is-visible", true);
				warningSwal(messages.modalWarning).then((response) => {
					if (response == true) {
						formRef.value.resetFields();
						Object.assign(replyForm, form);
						emit("is-visible", false);
						store.commit('checkChangeInput', false)
					}
					else {
						emit("is-visible", true);
					}
				})
			}
			else {
				emit("is-visible", false);
			}
		}

		return {
			userId,
			checkChangeInput,
			submitForm,
			formRef,
			replyForm,
			showSmsData,
			closeModal,
		};
	},
});
</script>

<style lang="scss" scoped>
.messageBox.left {
	float: left;
}
.messageBox.right {
	float: right;
}
.notificationModal {
	width: 100% !important;

	.itemWrapper {
		align-items: flex-start !important;
		.leftWrapper {
			padding: 0 10px 0 0;
			width: 35%;
		}
		.rightWrapper {
			padding: 0 0 0 10px;
			width: 65%;
			text-align: right;
		}
	}
}
</style>
