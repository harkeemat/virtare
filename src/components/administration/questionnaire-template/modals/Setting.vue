<template>
<a-modal width="800px" class="toCapitalFirst" :title="templateRecord ? templateRecord.templateName + '(Settings)':''" centered :maskClosable="false" :footer="false" @cancel="closeModal()">

    <div class="templateType">
        <div class="toggleBtn">
            <span @click="responseChange(true)">{{response==false ? 'Not accepting responses' : 'Accepting responses'}} </span>
            <a-switch v-model:checked="response" @click="responseChange(false)" />
        </div>
        <div class="inputBox">
            <span v-if="response!=true">
                <label>Message for respondents</label>
                <a-input v-model:value="responseSubmit.responseMessage" style="width: 100%" size="large" @blur="addMessage()" placeholder="Message for respondents" /></span>
        </div>
        <div class="toggleBtn">
            <span @click="responseEditChange(true)">{{'Response editing not allowed' }} </span>

            <a-switch v-model:checked="responseEdit" @click="responseEditChange(false)" />
        </div>
        <div class="toggleBtn">
            <span @click="requiredFields(true)">{{'Make questions required by default'}} </span>

            <a-switch v-model:checked="requiredFieldsValue" @click="requiredFields(false)" />
        </div>
        <div class="toggleBtn">
            <span @click="progressBar(true)">{{'Show progress bar'}} </span>

            <a-switch v-model:checked="progressBarValue" @click="progressBar(false)" />
        </div>

        <div class="toggleBtn">
            <span @click="limitResponse(true)">{{'Limit to 1 response' }} </span>

            <a-switch v-model:checked="limitResponseValue" @click="limitResponse(false)" />
        </div>

        <div class="inputBox">
            <span>
                <label>Confirmation message</label>
                <a-input v-model:value="responseSubmit.submitResponseMessage" style="width: 100%" size="large" @blur="submitMessage()" placeholder="Message for submit form" /></span>
        </div>
        <!-- <div > <span @click="responseAddressChange(true)">{{responseAddress==false ? 'Not send to email addresses' : 'Send to  email addresses'}} </span><a-switch v-model:checked="responseAddress" @click="responseAddressChange(false)"/></div> -->
    </div>

</a-modal>
</template>

<script>
import { ref,  defineComponent,reactive, onMounted } from "vue";
import { useStore } from "vuex";
export default defineComponent({
emits: ["is-visible"],
    components: {

    },
    props: {
        templateRecord: Object,
        templateId:String
    },

    setup(props, {
        emit
    }) {
        const store = useStore();
        const response = ref(false);
        const responseEdit = ref(false)
        const responseAddress = ref(false)
        const limitResponseValue = ref(false)
        const requiredFieldsValue = ref(false)
        const progressBarValue = ref(false)
        const responseSubmit = reactive({
            responseMessage: '',
            submitResponseMessage: ''

        })
        //const oneTime = ref(true)
        onMounted(() => {
            
   
                response.value = props.templateRecord?.questionnaireCustomField?.responseShow ? parseInt(props.templateRecord?.questionnaireCustomField?.responseShow) == 1 ? true : false : ''
                responseSubmit.responseMessage = props.templateRecord?.questionnaireCustomField?.responseMessage,
                    responseSubmit.submitResponseMessage = props.templateRecord?.questionnaireCustomField?.submitResponseMessage,
                    responseEdit.value = props.templateRecord?.questionnaireCustomField?.responseEdit ? parseInt(props.templateRecord?.questionnaireCustomField?.responseEdit) == 1 ? true : false : ''
                responseAddress.value = props.templateRecord?.questionnaireCustomField?.responseAddress ? parseInt(props.templateRecord?.questionnaireCustomField?.responseAddress) == 1 ? true : false : ''
                limitResponseValue.value = props.templateRecord?.questionnaireCustomField?.limitResponse ? parseInt(props.templateRecord?.questionnaireCustomField?.limitResponse) == 1 ? true : false : ''
                requiredFieldsValue.value = props.templateRecord?.questionnaireCustomField?.requiredFields ? parseInt(props.templateRecord?.questionnaireCustomField?.requiredFields) == 1 ? true : false : ''
                progressBarValue.value = props.templateRecord?.questionnaireCustomField?.progressBar ? parseInt(props.templateRecord?.questionnaireCustomField?.progressBar) == 1 ? true : false : ''

          
        })

        const responseChange = (event) => {
            if (event) {

                response.value = !response.value
            }
            responsUpdateApi()

        }
        const responseEditChange = (event) => {
            if (event) {

                responseEdit.value = !responseEdit.value
            }
            responsUpdateApi()
        }
        const responseAddressChange = (event) => {
            if (event) {

                responseAddress.value = !responseAddress.value
            }
            responsUpdateApi()
        }
        const limitResponse = (event) => {
            if (event) {

                limitResponseValue.value = !limitResponseValue.value
            }
            responsUpdateApi()
        }
        const addMessage = () => {
            responsUpdateApi()
        }
        const submitMessage = () => {
            responsUpdateApi()
        }
        const requiredFields = (event) => {
            if (event) {

                requiredFieldsValue.value = !requiredFieldsValue.value
            }
            responsUpdateApi()
        }
        const progressBar = (event) => {
            if (event) {

                progressBarValue.value = !progressBarValue.value
            }
            responsUpdateApi()
        }
        const responsUpdateApi = () => {
            store.dispatch("updateQuestionnaireTemplate", {
                data: {
                    "questionnaireCustomField": {
                        "responseMessage": responseSubmit.responseMessage,
                        "responseAddress": responseAddress.value,
                        "responseEdit": responseEdit.value,
                        "responseShow": response.value,
                        "submitResponseMessage": responseSubmit.submitResponseMessage,
                        "progressBar": progressBarValue.value,
                        "requiredFields": requiredFieldsValue.value,
                        "limitResponse": limitResponseValue.value,

                    }
                },
                show: false,
                id: props.templateId
            })
        }
        function closeModal() {
           
            emit("is-visible", {
                    show: false,
                    id: true,
                    questionnaireCustomField: {
                   
                    "responseShow": response.value ? "1":"0",
                    "responseMessage": responseSubmit.responseMessage,
                    "responseEdit": responseEdit.value ? "1":"0",
                    "responseAddress": response.value ? "1":"0",
                    "submitResponseMessage":responseSubmit.submitResponseMessage,
                    "progressBar":progressBarValue.value ? "1":"0",
                    "requiredFields":requiredFieldsValue.value ? "1":"0",
                    "limitResponse":limitResponseValue.value ? "1":"0",

                }
                })
        }
        return {

            addMessage,
            response,
            responseEdit,
            responseAddress,
            responseAddressChange,
            responseEditChange,
            responseChange,
            responseSubmit,
            submitMessage,
            requiredFields,
            progressBar,
            limitResponse,
            limitResponseValue,
            requiredFieldsValue,
            progressBarValue,
            closeModal

        };
    },
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variable.scss';

.templateType {
    .toggleBtn {
        margin: 0 0 15px;
        display: flex;
        justify-content: space-between;

        span {
            font-family: $font-family-semi-bold;
            width: 80%;
        }
    }

    .inputBox {
        margin: 0 0 15px;

        label {
            font-family: $font-family-semi-bold;
        }

        input {
            border: none;
            border-bottom: 1px solid #d9d9d9;
            padding-left: 5px !important;

            &:focus {
                box-shadow: none;
            }
        }
    }
}
</style>
