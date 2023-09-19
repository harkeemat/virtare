<template>
	<a-modal width="60%" :title="$t('global.addPhysician')" centered @cancel="closeModal()">
		<a-row :gutter="24">
      <a-col :sm="24" :xs="24">
				<a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')" layout="vertical" ref="formRef" :model="addPhysicianForm" @finish="submitForm">
					<a-row :gutter="24">
						
						<a-col :sm="12" :xs="24">
							<div class="form-group">
								<a-form-item :label="$t('global.name')" name="name" :rules="[{ required: true, message: $t('global.name')+' '+$t('global.validation') }]">
									<a-input @change="changedValue" v-model:value="addPhysicianForm.name" size="large" />
									<ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
								</a-form-item>
							</div>
						</a-col>
						
						<a-col :sm="12" :xs="24">
							<div class="form-group">
								<a-form-item :label="$t('global.designation')" name="designation" :rules="[{ required: true, message: $t('global.designation')+' '+$t('global.validation') }]">
									<GlobalCodeDropDown @change="changedValue"  v-model:value="addPhysicianForm.designation" :dataId="17" @handleGlobalChange="handleGlobalChange($event)"/>
									<ErrorMessage v-if="errorMsg" :name="errorMsg.designation?errorMsg.designation[0]:''" />
								</a-form-item>
							</div>
						</a-col>
						
						<a-col :sm="12" :xs="24">
							<div class="form-group">
								<a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.email')+' '+$t('global.validation') }]">
									<a-input @change="changedValue" v-model:value="addPhysicianForm.email" placeholder="test@test.com" size="large"/>
									<ErrorMessage v-if="errorMsg" :name="errorMsg.email ? errorMsg.email[0] : ''" />
								</a-form-item>
							</div>
						</a-col>
						
						<a-col :sm="12" :xs="24">
							<div class="form-group">
								<a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.phoneNo')+' '+$t('global.validation'),pattern:regex.phoneNumber}]">
									<a-input-number @change="changedValue" v-model:value="addPhysicianForm.phoneNumber" placeholder="Please enter 10 digit number" size="large" maxlength="10" style="width: 100%" />
									<!-- <vue-tel-input  @change="changedValue" v-model.trim:value="addPhysicianForm.phoneNumber" v-bind="bindProps" /> -->
									<!-- <PhoneNumber @change="changedValue" v-model.trim:value="addPhysicianForm.phoneNumber" @setPhoneNumber="setPhoneNumber"/> -->
									<ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
								</a-form-item>
							</div>
						</a-col>
						
						<a-col :sm="12" :xs="24">
							<div class="form-group">
								<a-form-item :label="$t('patient.fax')" name="fax" :rules="[{ required: false, message: $t('patient.fax')+' '+$t('global.validation') }]">
									<a-input @change="changedValue" v-model:value="addPhysicianForm.fax" size="large" />
									<ErrorMessage v-if="errorMsg" :name="errorMsg.fax?errorMsg.fax[0]:''" />
								</a-form-item>
							</div>
						</a-col>
						<FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')"> </FormBaseComponents>

						<a-col :sm="24" :span="24">
							<ModalButtons :Id="id" @is_click="handleClear"/>
						</a-col>

					</a-row>
				</a-form>
        <Loader />
      </a-col>
    </a-row>
	</a-modal>
</template>

<script>
import ModalButtons from "@/components/common/button/ModalButtons";
import Loader from "@/components/loader/Loader.vue";
import { computed, reactive, ref, watchEffect, onUnmounted } from 'vue-demi'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import ErrorMessage from "../common/messages/ErrorMessage"
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import { messages } from "@/config/messages";
import {warningSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  components: {
    ModalButtons,
    Loader,
	ErrorMessage,
	GlobalCodeDropDown,
	// PhoneNumber
    FormBaseComponents
  },
  props: {
    isPhysicianEdit: {
			type: Boolean
		},
  },
	setup(props, { emit }) {
		const store = useStore()
		const route = useRoute()
		const formRef = ref()
		const patientUdid = route.params.udid
		// const isEdit = reactive(props.isPhysicianEdit)
    const isValueChanged = ref(false);

    const globalCode = computed(() => {
      return store.state.common;
    });

		const modalClose = computed(() => {
			return store.state.patients.closeModal
		})

		const addPhysicianForm = reactive({
			name: '',
			designation: '',
			email: '',
			phoneNumber: '',
			fax: '',
		})

		const setPhoneNumber = (value) => {
      addPhysicianForm.phoneNumber = value;
    };
    const form = reactive({ ...addPhysicianForm });

    const changedValue = () => {
			isValueChanged.value = true;
    }

    function closeModal() {
			if(isValueChanged.value) {
				warningSwal(messages.modalWarning).then((response) => {
					if (response == true) {
						emit("closeModal", {
							modal: 'addPhysician',
							value: false
						});
						Object.assign(addPhysicianForm, form);
						isValueChanged.value = false;
					}
					else {
						emit("closeModal", {
							modal: 'addPhysician',
							value: true
						});
					}
				})
			}
    }

    const patients = computed(() => {
      return store.state.patients;
    });
		
		const id = ref(null)
		if(props.isPhysicianEdit) {
			id.value = patients.value.physicianDetails;
		}

    watchEffect(() => {
      if(props.isPhysicianEdit) {
        Object.assign(addPhysicianForm, patients.value.physicianDetails);
      }
    })
		
		onUnmounted(() => {
			store.commit('errorMsg', null)
		})

		const submitForm = () => {
      if(props.isPhysicianEdit) {
				store.dispatch('updatePhysician', {
					patientUdid: patientUdid,
					familyUdid: patients.value.physicianDetails.id,
					data: addPhysicianForm
				}).then(() => {
					if(route.name == 'PatientSummary') {
						store.dispatch('physiciansList', patientUdid);
					}
					if(modalClose.value == true) {
						emit("closeModal", {
							modal: 'addPhysician',
							value: false
						});
						formRef.value.resetFields();
						Object.assign(addPhysicianForm, form)
					}
				})
			}
			else {
				store.dispatch('addPhysician', {
					patientUdid: patientUdid,
					data: addPhysicianForm,
				}).then(() => {
					if(route.name == 'PatientSummary') {
						store.dispatch('physiciansList', patientUdid);
					}
					if(modalClose.value == true) {
						emit("closeModal", {
							modal: 'addPhysician',
							value: false
						});
						formRef.value.resetFields();
						Object.assign(addPhysicianForm, form)
					}
				})
			}
		}

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(addPhysicianForm, form)
    }

		const errorMsg = computed(() => {
			return store.state.patients.errorMsg
		})

		const handleGlobalChange = (data) =>{
			addPhysicianForm.designation = data
		}

		return {
			handleGlobalChange,
			setPhoneNumber,
			formRef,
			globalCode,
			addPhysicianForm,
			submitForm,
			handleClear,
			errorMsg,
			modalClose,
			closeModal,
			changedValue,
			isValueChanged,
			id,
			bindProps: store.state.common.bindProps,
			formData:store.getters.formTitle,
			arrayToObjectData,
			formTitleNames
		}
	}
}
</script>