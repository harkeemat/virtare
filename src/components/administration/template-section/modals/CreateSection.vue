<template>
<a-modal width="80%" :title="update ? $t('questionnaire.editSection') : $t('questionnaire.createSection')" centered :maskClosable="false" @cancel="closeModal()" :footer="false">
    <a-form ref="formRef" :model="questionnaireSection" layout="vertical" @finish="update ? updateSection() : addSection()" @finishFailed="onFinishFailed">
        <a-row :gutter="16">
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('questionnaire.sectionName')" name="sectionName" :rules="[{ required: true, message: $t('questionnaire.sectionName') +' '+$t('global.validation') }]">
                        <a-input v-model:value="questionnaireSection.sectionName" :placeholder="$t('questionnaire.enterSectionName')" style="width: 100%" size="large" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.sectionName[0]:''" />
                    </a-form-item>

                </div>

            </a-col>

            <a-col :span="12">
                <!-- <div class="form-group questionnairTag">
                    <a-form-item :label="$t('questionnaire.tags')" name="tags">
                        <a-select ref="select" v-model:value="questionnaireSection.tags" style="width: 100%" @focus="focus" @change="handleChange" mode="tags" size="large" :placeholder="$t('questionnaire.selectTags')" :getPopupContainer="triggerNode => triggerNode.parentNode">
                        </a-select>
                    </a-form-item>
                </div> -->

            </a-col>
            <a-col :span="24">
                <FormButtons @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />

            </a-col>
        </a-row>
        <TableLoader />
    </a-form>

</a-modal>
</template>

<script>
import { ref, reactive, defineComponent, computed,watchEffect } from "vue";
import { useStore } from "vuex";
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import TableLoader from "@/components/loader/TableLoader"
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import FormButtons from "@/components/common/button/FormButtons"
export default defineComponent({
    components: {
        TableLoader,
        ErrorMessage,
        FormButtons
    },
    props: {
        update: String,
        sectionName: String,
        templateId: String
    },

    setup(props, {
        emit
    }) {
        const store = useStore();
        const formRef = ref();
        const disabled = ref(false)
        const questionnaireSection = reactive({
            sectionName: "",

            tags: [],
        });
        const form = reactive({
            ...questionnaireSection
        })
        watchEffect(() => {
            if (props.sectionName) {
                questionnaireSection.sectionName = props.sectionName
            }
            if (props.update) {

                if (store.getters.sectionDetailsList) {
                    Object.assign(questionnaireSection, store.getters.sectionDetailsList.value)

                } else {
                    Object.assign(questionnaireSection, form)
                }
            }
        })
        const detailsQuestionnaireTemplate = store.getters.detailsQuestionnaireTemplate
        const addSection = () => {
            disabled.value = true
            store.dispatch("addQuestionnaireTemplateSection", {
                data: {
                    sectionName:questionnaireSection.sectionName
                    
                },
                show: false
            }).then(() => {
                if (store.state.common.successMsg) {

                    store.dispatch("sectionAssignToTemplate", {
                        id: props.templateId,
                        sectionId: [store.getters.questionnaireTemplateSection.value.id],
                        method: "post",
                        showPopup: true
                    }).then(() => {
                        if (store.state.common.successMsg) {

                            reset()
                            // let id = detailsQuestionnaireTemplate.value.id
                            // store.state.questionnaireTemplate.detailsQuestionnaireTemplate = null
                            store.dispatch("detailsQuestionnaireTemplate", {id:detailsQuestionnaireTemplate.value.id,data:"questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId,noOfDays"})
                            disabled.value = false
                            emit("is-visible", {
                                show: false,
                                id: props.templateId
                            })
                        }
                    })
                }
            })
        }
        const updateSection = () => {
            store.dispatch("updateQuestionnaireTemplateSection", {
                data: questionnaireSection,
                id: props.update
            }).then(() => {
                if (store.state.common.successMsg) {
                    emit("is-visible", {
                        show: false,
                        id: ''
                    })
                    reset()
                    store.dispatch("questionnaireTemplateSectionList")
                }
            })
        }

        function reset() {
            store.state.patients.errorMsg = ""
            store.commit("checkChangeInput", false)
            Object.assign(questionnaireSection, form)
            disabled.value = false
        }

        function closeModal() {
            if (checkFieldsData.value) {
                emit("is-visible", {
                    show: true,
                    id: props.update
                })
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        emit("is-visible", {
                            show: false,
                            id: props.update
                        })
                        reset()
                        disabled.value = false
                    } else {
                        emit("is-visible", {
                            show: true,
                            id: props.update
                        })
                    }
                });
            } else {
                formRef.value.resetFields();
                emit("is-visible", {
                    show: false,
                    id: props.update
                })
            }
        }

        function checkChangeInput() {
            store.commit("checkChangeInput", true);
        }
        const errorMsg = store.getters.errorMsg.value
        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput
        })
        return {
            questionnaireSection,
            addSection,
            closeModal,
            checkChangeInput,
            checkFieldsData,
            errorMsg,
            formRef,
            updateSection,
            questionnaireSectionType: store.getters.questionnaireSectionType
        };
    },
});
</script>
