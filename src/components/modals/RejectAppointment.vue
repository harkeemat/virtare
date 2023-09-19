<template>
  <a-modal width="40%" title="Reject Reason" :footer="false"  :maskClosable="false" centered @cancel="onCloseModal()" zIndex="1080">
    <a-form ref="formRef" :model="reasons" layout="vertical" @finish="submitRejectAppt">
			<a-row :gutter="24">
				<a-col :span="24">
					<div class="form-group">
						<a-form-item :label="'Reason'" name="reason" :rules="[{ required: true, message: 'Reason'+' '+$t('global.validation') }]">
							<a-textarea v-model:value="reasons.reason"  />
							<!-- <ErrorMessage v-if="errorMsg" :name="errorMsg.reason?errorMsg.reason[0]:''" /> -->
						</a-form-item>
					</div>
				</a-col>
				<a-col :span="24">
					<div class="steps-action">
						<a-button class="modal-button" :disabled="!reasons.reason" type="primary" html-type="submit">{{'Submit'}}</a-button>
					</div>
				</a-col>
			</a-row>
    </a-form>
	</a-modal>
</template>

<script>
import { reactive } from "vue-demi";
import { useStore } from 'vuex';
export default {
  name: "RejectAppintment",
	props:{
		Id:String,
		statusId:Number
	},
  setup(props,{emit}) {
    const store = useStore()
    const reasons = reactive({
		reason:null
	});

    const submitRejectAppt = () => {
		store.dispatch("appintmentStatus", { 
			id: props.Id, 
			statusId: props.statusId,
			cancellationNote:reasons.reason 
		}).then((response)=>{
			if(response.status ===200){
				emit("closeModal", false)
			}
		})
	}
    const onCloseModal = () => {}

    return {
      submitRejectAppt,
      reasons,
      onCloseModal,
    };
  },
};
</script>