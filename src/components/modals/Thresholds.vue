<template>
<a-modal width="1000px" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,25,'id','name'),'name','udid')" :title="threshodId ? 'Edit General Parameters': $t('thresholds.thresholdModal.generalParameters')" centered :footer="false" :maskClosable="false" @cancel="closeModal()">

    <Loader v-if="threshodId" />

    <a-form ref="formRef" :model="thresholdForm" layout="vertical" @finish="submitForm" @finishFailed="taskFormFailed">
        <a-row :gutter="24">
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('thresholds.thresholdModal.generalParametersGroup')" name="generalParametersGroup" :rules="[{required: true,message:$t('thresholds.thresholdModal.generalParametersGroup') + ' ' +$t('global.validation'),},]">
                        <a-input v-model:value="thresholdForm.generalParametersGroup" size="large" @change="checkChangeInput()"/>
                    </a-form-item>
                </div>
            </a-col>
            <a-col :md="12" :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.type')" name="deviceTypeId" :rules="[{required: true,message: $t('global.type') + ' ' + $t('global.validation'),},]">
                       
                        <GlobalCodeDropDown v-model:value="thresholdForm.deviceTypeId" :dataId="22" @handleGlobalChange="handleGlobalChange($event); handleDevice(); checkChangeInput();" :disabled="threshodId ? true : false" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.deviceType ? errorMsg.deviceType[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
        </a-row>

        <div v-if="vitalData">
            <a-row :gutter="24" v-for="(vital, i) in vitalData" :key="i">
                <a-col :md="12" :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('thresholds.thresholdModal.highLimit') +'(' +vital.field +')'" name="generalParametershigh[vital.id]" :rules="[{required:false, message:'Only number is required.',pattern:new RegExp(/\d+(\.\d{1,2})?$/g)}]">
                            <!-- <a-input v-model="value" size="large" /> -->
                            <a-input v-model:value="thresholdForm.generalParametershigh[vital.id]" size="large" style="width: 100%" @change="checkChangeInput()"/>
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.note ? errorMsg.high[0] : ''" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :md="12" :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('thresholds.thresholdModal.lowLimit') +'(' +vital.field +')'" name="generalParameterslow[vital.id]" :rules="[{required:false, message:'Only number is required.',pattern:new RegExp(/\d+(\.\d{1,2})?$/g)}]">
                            <!-- <a-input v-model="value" size="large" /> -->
                            <a-input v-model:value="thresholdForm.generalParameterslow[vital.id]" size="large" style="width: 100%" @change="checkChangeInput()"/>
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.note ? errorMsg.low[0] : ''" />
                        </a-form-item>
                    </div>
                </a-col>
                <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,25,'id','name'),'name','udid')"> </FormBaseComponents>
            </a-row>
        </div>
        <a-row :gutter="24">
            <a-col :span="24">
                <div class="steps-action">
                    <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
                </div>
            </a-col>
        </a-row>
    </a-form>
</a-modal>
</template>

<script>
import {
    ref,
    reactive,
    computed,
    watchEffect
} from "vue";
import FormButtons from "@/components/common/button/FormButtons";
import ErrorMessage from "../common/messages/ErrorMessage";
import {
    useStore
} from "vuex";
import {
    regex
} from "@/RegularExpressions/regex";
import Loader from "@/components/loader/Loader";
import {
    warningSwal, arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import {
    messages
} from "../../config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
const OPTIONS = ["Jane Doe", "Steve Smith", "Joseph William"];
const OPTIONSTAG = ["Admin", "Clinical", "Office", "Personal"];

export default {
    components: {
        ErrorMessage,
        FormButtons,
        Loader,
        GlobalCodeDropDown,
        FormBaseComponents
    },
    props: {
        threshodId: {
            type: String,
        },
    },
    setup(props, {
        emit
    }) {
        const store = useStore();

        const value = ref();
        const value2 = ref();
        const formRef = ref();
        const formButton = ref(false);
        const selectedItems = ref(["Jane Doe"]);
        const filteredOptions = computed(() =>
            OPTIONS.filter((o) => !selectedItems.value.includes(o))
        );

        const selectedItemsForTag = ref(["Admin"]);
        const filteredOptionsForTag = computed(() =>
            OPTIONSTAG.filter((o) => !selectedItemsForTag.value.includes(o))
        );

        const thresholdForm = reactive({
            deviceType: "",
            deviceTypeId: "",
            generalParametersGroup: "",
            generalParametershigh: [],
            generalParameterslow: [],
            udid: [],
        });
        const form = reactive({
            ...thresholdForm,
        });
        const globalCode = computed(() => {
            return store.state.common;
        });

        const vitalData = computed(() => {
            return store.state.thresholds.vitalData;
        });
        const vitalEdit = computed(() => {
            return store.state.thresholds;
        });
        function checkChangeInput() {
			store.commit('checkChangeInput', true)
		}

		const checkFieldsData = computed(() => {
			return store.state.common.checkChangeInput;
		})
        function closeModal() {
            emit("is-visible", true)
            if (checkFieldsData.value) {
				warningSwal(messages.modalWarning).then((response) => {
					if (response == true) {
                        handleCancel();
                        emit("is-visible", false);
						
						store.commit('checkChangeInput', false)
					} else {
					
                        emit("is-visible", true);
						
						store.commit('checkChangeInput', true)
					}
				});
			}
			else {
				handleCancel()
                emit("is-visible", false)
			}
           
           
        }

        function handleDevice() {
            store.state.thresholds.vitalData = null;
            thresholdForm.generalParametershigh = [];
            thresholdForm.generalParameterslow = [];
            store.dispatch("getVital", thresholdForm.deviceTypeId);
        }

        const submitForm = () => {
            formButton.value = true;
            let parameter = [];
            thresholdForm.generalParameterslow.forEach(function (Element, i) {
                if (Element) {
                   
                    parameter.push({
                        type: i,
                        lowLimit: Element,
                        highLimit: thresholdForm.generalParametershigh[i],
                        parameterId: props.threshodId ? thresholdForm.udid[i] : "",
                    });
                }
            });
            if (props.threshodId != null) {
                store.dispatch("updateGeneralParameterGroup", {
                    data: {
                        deviceTypeId: thresholdForm.deviceTypeId,
                        generalParameterGroup: thresholdForm.generalParametersGroup,
                        parameter: parameter,
                    },
                    id: props.threshodId,
                }).then(() => {
                    store.dispatch("generalParameterList")
                    emit("is-visible", false)
                    handleCancel()
                })
            } else {
                store.dispatch("addGeneralParameterGroup", {
                    deviceTypeId: thresholdForm.deviceTypeId,
                    generalParameterGroup: thresholdForm.generalParametersGroup,
                    parameter: parameter,
                }).then(() => {
                    store.dispatch("generalParameterList")
                    emit("is-visible", false)
                    handleCancel()
                })
            }
            store.commit('checkChangeInput', false) 

        };

        const handleCancel = () => {
            formRef.value.resetFields();
            Object.assign(thresholdForm, form);
            store.commit("vitalNull");
        };
        watchEffect(() => {
            if (props.threshodId != null) {
                if (vitalEdit.value.vitalEdit) {
                    store.commit("loadingStatus", true);
                    store.dispatch("getVital", vitalEdit.value.vitalEdit.deviceTypeId);

                    Object.assign(thresholdForm, vitalEdit.value.vitalEdit);

                    setTimeout(() => {
                        store.commit("loadingStatus", false);
                    }, 2000);
                }
            }
        });

        const handleGlobalChange = (data) =>{
            thresholdForm.deviceTypeId = data
        }

        return {
            handleGlobalChange,
            handleDevice,
            globalCode,
            thresholdForm,
            vitalData,
            handleCancel,
            submitForm,
            selectedItems,
            filteredOptions,
            filteredOptionsForTag,
            selectedItemsForTag,
            size: ref("large"),
            value,
            value2,
            formRef,
            regex,
            vitalEdit,
            closeModal,
            formButton,
            checkChangeInput,
            formData:store.getters.formTitle,
            arrayToObjectData,
            formTitleNames
        };
    },
};
</script>
