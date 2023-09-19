<template>
<a-layout-content>
    <div class="common-bg">
        <a-row>
            <h2 style="margin: 0 0 10px">Bug Report</h2>
            <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,47,'id','name'),'name','udid')" ref="formRest" scrollToFirstError=true :model="bugReport" name="basic" autocomplete="off" layout="vertical" @finish="submitResponse">
                <a-row :gutter="20">
                    <a-col :sm="12" :xs="24">
                        <div class="form-group">
                            <a-form-item label="Reporter Email" name="bugReportEmail" :rules="[{ required: true, message: 'Reporter Email'+' '+$t('global.validation') }]">
                                <a-input @change="changedValue" v-model:value="bugReport.bugReportEmail" size="large" style="width:100%" disabled/>
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :span="12">
                        <div class="form-group bugCategory">
                            <a-form-item label="Category">
                                <a-radio-group v-model:value="bugReport.categoryId">
                                    <a-radio v-for="category,index in bugCategory" :key="index" :value="category.id">{{category.name}}</a-radio>

                                </a-radio-group>
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :sm="12" :xs="24">
                        <div class="form-group">

                            <a-form-item label="Screen" name="screenId" :rules="[{ required: true, message: 'Screen'+' '+$t('global.validation')  }]">
                                <ArrayDataSearch v-model:value="bugReport.screenId" :globalCode="screensWeb" @change="checkChangeInput()" />
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.screenId ? errorMsg.screenId[0] : ''" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :sm="12" :xs="24">
                        <div class="form-group">
                            <a-form-item :label="$t('global.title')" name="subjectTitle" :rules="[{ required: true, message: $t('global.title')+' '+$t('global.validation') }]">
                                <a-input @change="changedValue" v-model:value="bugReport.subjectTitle" size="large" style="width:100%" />
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,47,'id','name'),'name','udid')"> </FormBaseComponents>
                    <a-col :sm="12" :xs="24">
                        <div class="form-group">
                            <a-form-item :label="$t('global.priority')" name="priority" :rules="[{ required: true, message: $t('global.priority')+' '+$t('global.validation')  }]">
                                <GlobalCodeDropDown v-model:value="bugReport.priority" :dataId="84" @handleGlobalChange="handleGlobalChange($event,'bugReport.priority')" :close="closeValue" />
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.appointmentTypeId?errorMsg.appointmentTypeId[0]:''" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :sm="24" :xs="24">
                        <div class="form-group">
                            <a-form-item :label="$t('global.description')" name="description" :rules="[{ required: true, message: $t('global.description')+' '+$t('global.validation') }]">
                                <a-textarea @change="changedValue" v-model:value="bugReport.description" size="large" style="width:100%" :rows="6" />
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col :span="12">
                        <a-col :sm="24" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.document')" name="document" :rules="[{ required: false, message: $t('global.document')+' '+$t('global.validation') }]">
                                    <a-input ref="image" name="document_file" id="document_file" size="large" type="file" @change="onFileUpload" />
                                    <ErrorMessage v-if="docValidationError" name="Document is required." />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.document?errorMsg.document[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <div class="uploadDocument">
                            <div class="item" v-for="file,index in documentRecord" :key="index">
                                <FileTextOutlined class="file" />
                                <span class="name">{{file.name}}</span>
                                <CloseCircleOutlined class="close" @click="removeImage(file.name)" />
                            </div>
                        </div>
                    </a-col>
                    <a-col :span="24" style="text-align: right">
                        <a-button type="primary" html-type="submit">Bug Report</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-row>
    </div>
    <Loader />
</a-layout-content>
</template>
<script>
import { FileTextOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from 'vue-demi';
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import { useStore } from 'vuex';
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import Loader from "@/components/loader/Loader";
import {errorSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  components: {
    
    FileTextOutlined,
    CloseCircleOutlined,
    ArrayDataSearch,
    GlobalCodeDropDown,
    Loader,
    FormBaseComponents
  },
  setup() {
    const store = useStore()
    const docValidationError  = ref(false)
    const documentRecord = ref([])
    const bugCategory = store.getters.bugCategory
     const image = ref();
     const formRest = ref();
    const focus = () => {
    };
    const screensWeb = store.getters.screensWeb
    onMounted(()=>{
      store.dispatch("screensWeb")
    })
    const user = JSON.parse(localStorage.getItem("auth"))
    const bugReport = reactive({
    "screenId":'',
    "screenType":"Web",
    "subjectTitle":"",
    "buildVersion":"v1.0",
    "osVersion":"os.1.0.1",
    "deviceId":"",
    "deviceName":"Web",
    "userLoginEmail":user.user.email,
    "bugReportEmail":user.user.email,
    "categoryId":"",
    "priority":"",
    "platform":"Web",
    "location":"location",
    "document":'',
    "description":"",
    "attachment":[
        
    ]
    })
    const form = reactive({bugReport})
    const handleChange = () => {
      
    };
    const onFileUpload = (event) => {
      store.commit("loadingStatus",true)
      let docFile = event.target.files[0];
      
      //emit("onChange");
      if (docFile.size / 1024 > 5120) {
        Object.assign(bugReport, {
          document: "",
        });
        errorSwal("File size should be less than or equal to 5 MB");
       store.commit("loadingStatus",false)
        return false;
      }
      if (
        docFile.type != "image/jpg" &&
        docFile.type != "image/jpeg" &&
        docFile.type != "image/tiff" &&
        docFile.type != "image/tif" &&
        docFile.type != "image/bmp" &&
        docFile.type != "image/png" &&
        docFile.type != "application/pdf"
      ) {
        store.commit("loadingStatus",false)
        Object.assign(bugReport, {
          document: "",
        });
        errorSwal(
          "Allowed file types are JPG, JPEG, TIFF, TIF, BMP, PNG and PDF only"
        );
        return false;
      }

      let formData = new FormData();
      formData.append("file", docFile);
      docValidationError.value = false;
      store.commit("checkChangeInput", true);
      store.dispatch("uploadFile", formData).then(()=>{
          documentRecord.value.push({
        name:docFile.name,
        url:store.state.patients.uploadFile
    })
       image.value.stateValue = ''
       store.commit("loadingStatus",false)
      })
    };

    const submitResponse = () => {
      store.commit("loadingStatus",true)
      documentRecord.value.map((item)=>{
        bugReport.attachment.push(item.url)
      })
     
      store.dispatch("reportSubmit", bugReport).then(() => {
        store.state.patients.uploadFile = null
        formRest.value?.resetFields();
         Object.assign(bugReport,form);
         documentRecord.value = []
         store.commit("loadingStatus",false)
      })
    }

    function checkChangeInput() {
           
            store.commit('checkChangeInput', true)
        }
        const removeImage =(image) =>{
        
          const indx =  documentRecord.value.findIndex(v => v.name === image);
          documentRecord.value.splice(indx, indx >= 0 ? 1 : 0);
        }

        // const checkFieldsData = computed(() => {
        //     return store.state.common.checkChangeInput;
        // })
        const handleGlobalChange = (data,type) =>{
            if(type =='bugReport.priority'){
                bugReport.priority = data
            }
            
        }
    return {
      formRest,
      focus,
      handleChange,
      bugReport,
      submitResponse,
      onFileUpload,
      checkChangeInput,
      docValidationError,
      documentRecord,
      removeImage,
      screensWeb,
      bugCategory,
      user,
      handleGlobalChange,
      image,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
};
</script>
<style lang="scss" scoped>
.form-group {
  &.bugCategory {
    .ant-radio-wrapper {
      display: inline-block;
      margin: 0;
      font-family: "poppins";
    }
  }
}
.uploadDocument {
  margin: 15px 0 0;
  .item {
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 50px 10px 10px;
    position: relative;
    color: #1890ff;
    margin: 0 0 10px;
    &:last-child {
      margin: 0;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .close {
      position: absolute;
      right: 15px;
      cursor: pointer;
      color: #000;
      font-size: 16px;
    }
  }
}
</style>