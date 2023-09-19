<template>
<div class="common-bg" v-if="clientResponse">
    <h2 class="pageTittle">
       
        {{ clientResponse?.questionnaire_template?.templateName}}
        <router-link to="/admin/questionnaireResponse" class="b-inline ml-10">
            <a-button class="btn">Back</a-button>
        </router-link>
    </h2>
   
    <a-row>
        <a-col :span=12>
            <div class="templateType">
                <div>User Type : <span> {{clientResponse?.EntityType==246 ? "Staff" : "Patient"}}</span></div>
                <!-- <div>Staff Name : <span> {{questionnaireResponseDetails ? questionnaireResponseDetails.userName :''}}</span></div>
                <div>Template Type : <span> {{questionnaireResponseDetails ? questionnaireResponseDetails.templateType : ''}}</span></div> -->
            </div>
        </a-col>
        <a-col :span="12">

            <div class="templateType right" v-if="clientResponse">
               
                <div>Status : <span> {{clientResponse?.status}}</span></div>
                <div>Filled Date : <span> {{clientResponse?.createdAt}}</span></div>
                
                <div v-if="Array.isArray(data)==true && data.length>0">Score : <a><span @click="getResponse" :title="data ? data[0].program:''"> {{data ? data[0].program.substring(0,10)+'...':'score'}}</span></a></div>
            </div>
        </a-col>
    </a-row>
    <a-form ref="formRef" :model="questionnaireTemplate" layout="vertical"  >
<div class="template" v-for="questionList,index in clientResponse?.assignSection" :key="index">

            <!-- <div v-if="questionList.entityType=='question'">

                <div>
                    <a-typography-title :level="5">{{questionList.question.question}}</a-typography-title>
                    <div class="templateInner">
                        <div v-if="questionList.question.dataTypeId==243">
                            <a-radio-group v-if="questionList.question.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.question.id]">
                                <a-col :span="24" v-for="(options,index) in questionList.question.options" :key="index">
                                    <div class="questionOutput">
                                        <div class="numbers">{{index+1}}.</div>
                                        <a-radio v-model:value="options.id"></a-radio>
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-radio-group>
                        </div>
                        <div v-else-if="questionList.question.dataTypeId==244">
                            <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.question.id]">
                                <a-col :span="24" v-for="(options,index) in questionList.question.options" :key="index">
                                    <div class="questionOutput">
                                        <div>{{index+1}}.</div>
                                        <a-checkbox class="ml-10 " v-model:checked="options.defaultOption" v-model:value="options.id">
                                        </a-checkbox>
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-checkbox-group>
                        </div>
                        <div v-else>
                            <a-col :span="24">

                                <div class="form-group">
                                    <a-form-item name="templateName">
                                        <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.question.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                        <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="healthTemplateBox" v-if="questionList.questions.length>0">
                <h4 v-if="questionList"> {{questionList.sectionName}}</h4>
                <div v-if="questionList.questions.length>0">

                    <div v-for="record,index in questionList.questions" :key="index" class="questionTemplatesItems">

                        <a-typography-title :level="5">{{ record.question }}</a-typography-title>
                        <div class="templateInner">
                            <div v-if="record.dataTypeId==243">

                                <a-radio-group v-if="record.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.sectionId+''+record.id]" disabled>
                                    <a-col :span="24" v-for="option,optionIndex in record.options" :key="optionIndex">
                                        <div class="questionOutput" v-if="record.answerFillUp==option.id" >

                                            <a-radio v-model:value="option.id" ></a-radio>
                                            <div class="ml-10 ">
                                                <p>{{ option.option }}</p>
                                            </div>
                                        </div>

                                    </a-col>
                                </a-radio-group>

                            </div>
                            <div v-else-if="record.dataTypeId==244">
                                <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.sectionId+''+record.id]">
                                    <a-col :span="24" v-for="(option,index) in record.options" :key="index">
                                        <div class="questionOutput" v-if="arrayToObjact(checkBoxmodifi,option.id)">

                                            <a-checkbox class="ml-10 " v-model:checked="option.defaultOption" v-model:value="option.id" disabled>
                                            </a-checkbox>
                                            <div class="ml-10 ">
                                                <p>{{ option.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-checkbox-group>
                            </div>
                            <div v-else-if="record.dataTypeId==242">
                                <div class="form-group">
                                    <a-input-number disabled v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.id]" placeholder="Enter number..." :bordered="false" width="100%" />
                                </div>
                            </div>
                            <div v-else class="form-group">

                                <a-textarea disabled v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                

                            </div>
                        </div>
                       

                    </div>
                </div>
                <!-- <div v-else>
                    <div v-for="record,index in questionList.questionSection" :key="index">
                        <a-typography-title :level="5">{{ index+1 +'. '+record.question }}</a-typography-title>
                        <div class="templateInner">
                            <div v-if="record.question.dataTypeId==243">
                                <a-radio-group v-if="record.question.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.sectionId+''+record.question.id]">
                                    <a-col :span="24" v-for="(options,index) in record.question.options" :key="index">
                                        <div class="questionOutput">
                                            
                                            <a-radio v-model:value="options.id"></a-radio>
                                            <div class="ml-10 ">
                                                <p>{{ options.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-radio-group>
                            </div>
                            <div v-else-if="record.question.dataTypeId==244">
                                <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.sectionId+''+record.question.id]">
                                    <a-col :span="24" v-for="(options,index) in record.question.options" :key="index">
                                        <div class="questionOutput">
                                            
                                            <a-checkbox class="ml-10 " v-model:checked="options.defaultOption" v-model:value="options.id">
                                            </a-checkbox>
                                            <div class="ml-10 ">
                                                <p>{{ options.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-checkbox-group>
                            </div>
                            <div v-else-if="record.question.dataTypeId==241">
                                <a-col :span="24">

                                    <div class="form-group">
                                        <a-form-item name="templateName">
                                            <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.question.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                            <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                                        </a-form-item>

                                    </div>
                                </a-col>
                            </div>
                            <div v-else-if="record.question.dataTypeId==242">
                                <a-col :span="24">

                                    <div class="form-group">
                                        <a-form-item name="templateName">
                                            <a-input-number v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.question.id]" placeholder="Enter number..." :bordered="false" :rows="2" width="100%" />
                                           
                                        </a-form-item>

                                    </div>
                                </a-col>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>

        </div>
        <!-- <div class="template" v-for="questionList in detailsQuestionnaireTemplate.questionnaireQuestion" :key="questionList.id">

            <div v-if="questionList.entityType=='question'">

                <div>
                    <a-typography-title :level="5">{{questionList.question.question}}</a-typography-title>
                    <div class="templateInner">
                        <div v-if="questionList.question.dataTypeId==243">
                            <a-radio-group v-if="questionList.question.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.question.id]">
                                <a-col  v-for="(options,index) in questionList.question.options" :key="index">
                                    <div class="questionOutput">
                                        
                                        
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-radio-group>
                        </div>
                        <div v-else-if="questionList.question.dataTypeId==244">
                            <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.question.id]">
                                <a-col v-for="(options,index) in questionList.question.options" :key="index">
                                    <div class="questionOutput">
                                      
                                        <a-checkbox class="ml-10 " v-model:checked="options.defaultOption" v-model:value="options.id">
                                        </a-checkbox>
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-checkbox-group>
                        </div>
                        <div v-else>
                            <a-col >

                                <div class="form-group">
                                    <a-form-item name="templateName">
                                        <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.question.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                        <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                        </div>
                    </div>
                </div>
            </div>
            <div class="healthTemplateBox" v-else>
                <h4> {{questionList.questionnaireSection.sectionName}}</h4>
                
                <div v-for="record,index in questionnaireResponseDetails.clientQuestionResponse[questionList.questionnaireSection.sectionName]" :key="index">

                    <a-typography-title :level="5">{{ record.question.question }}</a-typography-title>
                    <div class="templateInner">
                        <div v-if="record.question.dataTypeId==243">

                            <a-radio-group v-if="record.answer" v-model:value="questionnaireTemplate.radioOption[questionList.questionnaireSection.id+''+record.question.id]" disabled>
                                <div  v-for="(options,index) in record.question.options" :key="index">
                                    <div class="questionOutput" v-if="record.answer==options.id">
                                       
                                        <a-radio v-model:value="options.id" checked></a-radio>
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </div>
                            </a-radio-group>
                        </div>
                        <div v-else-if="record.question.dataTypeId==244">
                            <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.questionnaireSection.id+''+record.question.id]" disabled v-if="record.answer">
                                <a-col  v-for="(options,index) in record.question.options" :key="index">

                                    <div class="questionOutput" v-if="arrayToObjact(checkBoxmodifi,options.id)">
                                        
                                        <a-checkbox class="ml-10 " v-model:checked="options.id" v-model:value="options.id">
                                        </a-checkbox>
                                        <div class="ml-10 ">
                                            <p>{{ options.option }}</p>
                                        </div>
                                    </div>
                                </a-col>
                            </a-checkbox-group>
                        </div>
                        <div v-else-if="record.question.dataTypeId==242">
                            <a-col  v-if="record.answer" >

                                <div class="form-group">
                                    <a-form-item>
                                        
<a-input-number v-model:value="record.answer" placeholder="Enter number..." :bordered="false"  width="100%" disabled/>
                                    </a-form-item>

                                </div>
                            </a-col>
                        </div>
                        <div v-else>
                            <a-col  v-if="record.answer">

                                <div class="form-group">
                                    <a-form-item>
                                        <a-textarea v-model:value="record.answer" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" disabled />

                                    </a-form-item>

                                </div>
                            </a-col>
                        </div>
                    </div>
                </div>
            </div> 

        </div> -->

    </a-form>

    <TableLoader />
</div>
<CommonLoader v-else />
<Score v-model:visible="visibleModal" title="Response Score" />
</template>

<script>
import { defineComponent, ref, onMounted, reactive, watchEffect,onUnmounted } from "vue";
import TableLoader from "@/components/loader/TableLoader";
import CommonLoader from "@/components/loader/CommonLoader";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Score from "@/components/questionnaireForm/modals/ScoreModal"
import {arrayToObjact} from "@/commonMethods/commonMethod";
const columns = [{
        title: "Programs",
        dataIndex: "program",

    },
    {
        title: "Score",
        dataIndex: "score",
    },
    {
        title: "Actions",
        dataIndex: "actions",
        slots: {
            customRender: "actions",
        },
    },
];
export default defineComponent({
    name: "Question Template Details",
    components: {
        TableLoader,
        CommonLoader,
        Score
    },
    setup() {
        
        const store = useStore();
        const route = useRoute();
        const userName = JSON.parse(localStorage.getItem("responseusername"));
        const questionnaireTemplate = reactive({
            templateText: [],
            radioOption: [],
            checkBoxOption: [],
        });
        const udid = route.params.udid;
        const show = ref(false)
        const visibleModal = ref(false)
        const checkBoxmodifi = ref([])
        const questionnaireResponseDetails = store.getters.questionnaireResponseDetails
        const detailsQuestionnaireTemplate = store.getters.detailsQuestionnaireTemplate
        const clientResponse = store.getters.clientResponse
        onMounted(() => {
store.dispatch("clientResponse", udid).then(() => {
            
                if(Array.isArray(clientResponse.value.score)==true){
store.commit("scoreCount", clientResponse.value.score)
                }
                
                clientResponse.value ?
                    clientResponse.value.assignSection.forEach((element) => {
                        element.questions.map((records) => {
                            recursiveLoop(records, element)

                        })

                    }) :
                    "";
            })

        });

        function recursiveLoop(records, element) {
            
            if (records.dataTypeId == 243 || records.dataTypeId == 244) {

                let checkBox = [];
                if (records.answerFillUp && records.dataTypeId == 243) {
                    questionnaireTemplate.radioOption[element.sectionId + '' + records.id] = records.answerFillUp
                   
                } else if (records.answerFillUp && records.dataTypeId == 244) {
                    checkBox = records.answerFillUp
                    records.answerFillUp.map((record)=>{
 checkBoxmodifi.value.push({
                                                    id: record
                                                })
                    })
                   
                }

                records.options ? records.options.map((item) => {

                    if (item.defaultOption == 1 && records.dataTypeId == 243 && !records.answerFillUp) {
                        questionnaireTemplate.radioOption[element.sectionId + '' + records.id] = item.id;
                    }
                    if (item.defaultOption == 1 && records.dataTypeId == 244 && !records.answerFillUp) {
                        checkBox.push(item.id);

                    }
                    if(records?.dataTypeId == 243){
                    if (item.id == records?.answerFillUp || (item?.defaultOption ==1 && !records?.answerFillUp) ) {
                       if(item?.question?.length){
                                   
                var radioIndex = -1
                for(var k = 0; k < element.questions.length; k++) {
                    if(element.questions[k].id === records?.id) {
                        radioIndex = k;
                        break;
                    }
                }
              
                    item.question.map((item) => {
                        item.parentId = records?.id
                        radioIndex++
                     
                 element.questions.splice(radioIndex, 0, item)
                 
                 recursiveLoop(item, element)
                    })
              
                        }     
                    }
                    }else if(records?.dataTypeId == 244){
                        let checkBoxId = records?.answerFillUp.find(answerData=>{answerData==item.id})
                        if (checkBoxId || (item?.defaultOption ==1 && !records?.answerFillUp) ) {
                       
                        if(item?.question.length){
                                   
                var index = -1
                for(var i = 0; i < element.questions.length; i++) {
                    if(element.questions[i].id === records?.id) {
                        index = i;
                        break;
                    }
                }
              
                    item.question.map((item) => {
                        item.parentId = records?.id
                        index++
                     
                 element?.questions.splice(index, 0, item)
                 
                 recursiveLoop(item, element)
                    })
              
                        }         
                           
                            
                    
                    }
                    }

                }) : ''

                if (checkBox.length > 0) {
                    questionnaireTemplate.checkBoxOption[element.sectionId + '' + records.id] = checkBox;
                }
            } else {
                questionnaireTemplate.templateText[element.sectionId + '' + records.id] = records.answerFillUp
            }

        }

        watchEffect(() => {

            detailsQuestionnaireTemplate.value ?
                detailsQuestionnaireTemplate.value.questionnaireQuestion.forEach((element) => {

                    if (element.entityType != 'question') {

                        questionnaireResponseDetails.value ? questionnaireResponseDetails.value.clientQuestionResponse[element.questionnaireSection.sectionName].map((records) => {

                            if (records.question.dataTypeId == 243 || records.question.dataTypeId == 244) {
                                let checkBox = [];
                                records.question.options.forEach((item) => {

                                    if (records.question.dataTypeId == 243 && records.answer == item.id) {

                                        questionnaireTemplate.radioOption[element.questionnaireSection.id + '' + records.question.id] = records.answer;
                                    }
                                    if (records.question.dataTypeId == 244) {
                                        if (records.answer) {
                                            let checkBoxArray = []
                                            records.answer.map((record) => {
                                                checkBoxArray.push(record);
                                                checkBoxmodifi.value.push({
                                                    id: record
                                                })

                                            })
                                            checkBox = checkBoxArray
                                        }

                                    }
                                });
                                
                                if (checkBox.length > 0) {
                                    questionnaireTemplate.checkBoxOption[element.questionnaireSection.id + '' + records.question.id] = checkBox;
                                }
                            }
                        }) : ''
                    }

                }) :
                "";
        });
        const getResponse = () => {
            visibleModal.value = true

        }
 onUnmounted(() => {
             store.state.questionnaireTemplate.detailsQuestionnaireTemplate = ''
             store.state.questionnaireTemplate.questionnaireResponseDetails = ''
            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
           // window.removeEventListener("scroll")

        })
        return {
            udid,
            questionnaireTemplate,
            detailsQuestionnaireTemplate,

            value: ref("1"),
            show,
            columns,
            data: store.getters.scoreCount,
            userName,
            questionnaireResponseDetails,
            getResponse,
            visibleModal,
            arrayToObjact,
            checkBoxmodifi,
            clientResponse
        };
    },
});
</script>

<style lang="scss" scoped>
.pageTittle {
    text-align: center;
    background: #e3e3e3;
    padding: 15px 0;
    margin: 0;

    a {
        position: absolute;
        right: 10px;
    }
}

.templateType {
    font-size: 18px;
    padding: 10px 0;
    color: #000;
    text-transform: capitalize;

    span {
        font-weight: 600;
    }
}

.template {
    margin: 15px 0 0;
    border: 1px solid #e3e3e3;
    padding: 15px;

    h4 {
        font-size: 22px;
        margin: 0 0 15px;
    }

    h5.ant-typography {
        margin: 0 0 5px;
    }

    .questionOutput {
        >div {
            width: 500px;
        }
    }

}

.right {
    text-align: right;
}
</style>
