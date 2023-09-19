<template>
<a-modal width="800px" :title="isAdd ? 'Edit Global Code' : 'Add Global Code'" :footer="false" :maskClosable="false" @cancel="closeModal()" centered>

    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,33,'id','name'),'name','udid')" ref="formRef" :model="globalCodeForm" layout="vertical" @finish="submitForm">

        <a-row :gutter="24">
            <a-col :sm="9" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('globalCodes.category')" name="globalCodeCategory" :rules="[{ required: true, message: $t('globalCodes.category')+' '+$t('global.validation')  }]">
                            <ArrayDataSearch  v-if="globalCodeCategories" @change="checkChangeInput()"  v-model:value="globalCodeForm.globalCodeCategory" :globalCode="globalCodeCategories"/>
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="9" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('globalCodes.codeName')" name="name" :rules="[{ required: true, message: $t('globalCodes.codeName')+' '+$t('global.validation')  }]">
                        <a-input v-model:value="globalCodeForm.name" size="large" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="6" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('globalCodes.activeStatus')" name="status">
                        <a-switch v-model:checked="globalCodeForm.isActive" @change="UpdateStatus($event);checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('globalCodes.description')" name="description" :rules="[{ required: true, message: $t('globalCodes.description')+' '+$t('global.validation')  }]">
                        <a-textarea v-model:value="globalCodeForm.description" placeholder="Description" allow-clear @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,33,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :sm="24" :span="24">
                <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
            </a-col>
        </a-row>
    </a-form>
    <Loader />
</a-modal>
</template>

<script>
import {
    ref,
    reactive,
    computed,
    watchEffect
} from "vue";
import {
    useStore
} from "vuex"
import FormButtons from "@/components/common/button/FormButtons";
import {
    warningSwal,arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import {
    messages
} from "../../config/messages";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import Loader from "@/components/loader/Loader"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
    components: {
        FormButtons,
        ArrayDataSearch,
        Loader,
        FormBaseComponents
    },
    props: {
        isAdd: {
            type: Boolean
        }
    },
    setup(props, {
        emit
    }) {
        const store = useStore()
        const formRef = ref()
        const checked = ref([false]);

        const formButton = ref(false)
        const handleCancel = () => {
            emit('is-visible', false);
        };

    
        const codeDetails = store.getters.globalCodeDetails
        const globalCodeForm = reactive({
            globalCodeCategory: '',
            name: '',
            description: '',
            isActive: true,
        });

        watchEffect(() => {
            formButton.value=false
            if (props.isAdd != null) {
                Object.assign(globalCodeForm, codeDetails.value)
                globalCodeForm.isActive = codeDetails.value ? codeDetails.value.isActive ? true : false : false
            }
        })

        const globalCodeCategories = computed(() => {
            return store.state.common.globalCodeCategories;
        })

        

        const form = reactive({
            ...globalCodeForm
        })
        const handleClear = () => {
            formRef.value.resetFields();
            Object.assign(globalCodeForm, form)
            formButton.value = false
        }

        const submitForm = () => {
            if (props.isAdd) {
                const data = {
                    "name": globalCodeForm.name,
                    "description": globalCodeForm.description,
                    "isActive": globalCodeForm.isActive,
                    "globalCodeCategory": globalCodeForm.globalCodeCategory
                }
                const id = props.isAdd;
                store.dispatch('updateGlobalCode', {
                    id,
                    data
                }).then(() => {
                    store.dispatch('globalCodesList')
                    store.dispatch("globalCodes");
                })

            } else {
                formButton.value = true

                store.dispatch('addGlobalCode', globalCodeForm).then(() => {
                    store.dispatch('globalCodesList')
                    store.dispatch("globalCodes");
                })
                emit('close-modal', false);
            }
            store.commit('checkChangeInput', false)
            emit('close-modal', false);
            handleClear()
        }

        function closeModal() {
            emit("close-modal", true)
            if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        handleClear()
                        emit("close-modal", false);

                        store.commit('checkChangeInput', false)
                    } else {
                        emit("close-modal", true);
                    }
                })
            } else {
                handleClear()
                emit("close-modal", false)
            }
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        })

        function checkChangeInput() {
            store.commit('checkChangeInput', true)
        }

        function UpdateStatus(event) {
            
            globalCodeForm.isActive = event
            
        }
        return {
            UpdateStatus,
            checkChangeInput,
            checkFieldsData,
            closeModal,
            formRef,
            handleClear,
            globalCodeCategories,
            globalCodeForm,
            submitForm,
            handleCancel,
            size: ref("large"),
            checked,
            formButton,
            formTitleNames,
            arrayToObjectData,
            formData:store.getters.formTitle,
        };
    },
};
</script>
