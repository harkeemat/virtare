<template>
	<a-modal width="70%" v-if="emailMessages" :title="'Subject: '+ emailMessages[0].subject" centered class="chatModal" :footer="false" @cancel="closeModal()" :maskClosable="false">
		<!-- <a-form ref="formRef" :model="replyForm" layout="vertical" @finish="submitForm"> -->
			<div class="leftWrapper" v-for="email in emailMessages" :key="email.id">
				<div v-for="message in email.message" :key="message.id" :class="userId != message.senderId ? 'messageBox left' : 'messageBox right'">
					<a-row>
						<a-col :sm="20">
							<!-- <p class="msgTitle"><strong>Message:</strong></p> -->
							<p class="sender"><span class="userIcon"><UserOutlined /></span>{{ message.sender }}</p>
							<span class="time"><span class="timeIcon"><ClockCircleOutlined /></span>{{ message.time }}</span>
							<p class="message" v-html="message.message"></p>
						</a-col>
					</a-row>
				</div>
			<br />
			</div>
			<br />
			<div class="replyBox">
				<a-form ref="formRef" :model="replyForm" layout="vertical" @finish="submitForm">
					<a-row>
						<a-col :span="24">
							<div class="form-group">
								<a-form-item :label="$t('communications.communicationsModal.reply')" name="message" :rules="[{ required: true, message: $t('communications.communicationsModal.message')+' '+$t('global.validation')  }]">
									<ckeditor :editor="editor" :config="editorConfig" v-model="replyForm.message" @change="checkChangeInput()"></ckeditor>
									<!-- <a-textarea v-model:value="replyForm.message" allow-clear @change="checkChangeInput()" /> -->
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
	</a-modal>
</template>

<script>
import { computed, reactive, ref } from 'vue-demi';
import {
	useStore
} from "vuex"
import { messages } from '@/config/messages';
import { warningSwal } from '@/commonMethods/commonMethod';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
// import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
// import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
// import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import UI from '@ckeditor/ckeditor5-ui/src/paragraph';

export default {
	components: {
    UserOutlined,
    ClockCircleOutlined,
	},
	props: {
		communication: {
			type: Object
		}
	},
	setup(props, { emit }) {
		const store = useStore()
		const formRef = ref()
		const authUser = JSON.parse(localStorage.getItem('auth'))
		const userId = authUser.user.id

		const replyForm = reactive({
			message: "",
		});

		const form = reactive({ ...replyForm });

		const submitForm = () => {
			store.dispatch("replyCommunication", {
				communicationId: props.communication.id,
				data: replyForm
			}).then(() => {
				store.dispatch("communicationsView", props.communication.id)
				store.dispatch("communicationsList");
				// emit("is-visible", false);
				formRef.value.resetFields();
				Object.assign(replyForm, form);
				store.commit('checkChangeInput', false)
			});
		};

		const checkChangeInput = () => {
			store.commit('checkChangeInput', true)
		}
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

		const handleClear = () => {
			formRef.value.resetFields();
			Object.assign(replyForm, form);
		}

		const closeModal = () => {
			emit("is-visible", true);
			if(checkFieldsData.value) {
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
			formRef,
			replyForm,
			submitForm,
			handleClear,
			checkChangeInput,
			closeModal,
			emailMessages: store.getters.communicationsView,
			editor: ClassicEditor,
			editorData: '<p>Content of the editor.</p>',
			editorConfig: {
				toolbar: [
					'heading',
					'|',
					'alignment',
					'bold',
					'italic',
					'link',
					'bulletedList',
					'numberedList',
					'uploadImage',
					'blockQuote',
					'undo',
					'redo',
				],
				image: {
					toolbar: [
						'imageStyle:inline',
						'imageStyle:block',
						'imageStyle:side',
						'|',
						'toggleImageCaption',
						'imageTextAlternative'
					]
				},
			},
		};
	},
};
</script>

<style lang="scss" scoped>
.leftWrapper{
		overflow: auto;
    max-height: calc(100vh - 610px);
}
.chatWrapper {
	padding: 8px 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	&.right {
		align-items: flex-end;
	}
	&.left {
		.message {
			background-color: #1890ff;
			color: #fff;
		}
	}
	.message {
		max-width: 500px;
		font-size: 13px;
		background-color: #f9f9f9;
		border-radius: 5px;
		padding: 10px;
		color: #111;
	}
}

span.time {
	font-size: 12px;
	color: #999;
	padding-bottom: 10px;
	position: relative;
	right: -2px;
}
.replyBox { padding: 30px 0px; width: 100%; float: left; }
.messageBox {
	padding: 10px 30px;
	background: #f0f8ff;
	margin-bottom: 20px;
	width: 90%;
}
// .msgTitle { padding-bottom: 5px }
p.sender {
	font-size: 16px;
	color: #838383;
}
p.message {
	padding: 20px 0px 0 20px;
	// padding-top: 5px !important;
	overflow: hidden;
	max-height: fit-content;
}
.chatModal .ant-modal-content .ant-modal-body {
	overflow: auto !important;
}
.userIcon .anticon-user {
	position: relative;
	top: -4px;
	right: 7px;
	font-size: 18px;
}
.timeIcon .anticon-clock-circle {
	position: relative;
	top: -2px;
	right: 7px;
	font-size: 16px;
}
</style>