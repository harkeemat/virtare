<template>
<a-form :model="documents" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,12,'id','name'),'name','udid')" ref="formRest" scrollToFirstError=true name="basic"   autocomplete="off" layout="vertical" @finish="addDocument" @finishFailed="onFinishFailed">
    <a-row :gutter="24">
        <a-col :sm="12" :xs="24">
            <div class="form-group">
             
                <a-form-item :label="$t('global.name')" name="name" :rules="[{ required: true, message: $t('global.name')+' '+$t('global.validation') }]">
                    <a-input v-model:value="documents.name" size="large" @change="checkChangeInput()" />
                    <!-- <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" /> -->
                </a-form-item>
            </div>
        </a-col>
        <a-col :sm="12" :xs="24" >
            <div class="form-group">
                <a-form-item :label="$t('global.document')" name="document" :rules="[{ required: paramId && documentDetails?false:true, message: $t('global.document')+' '+$t('global.validation') }]">
                    <a-input :disabled="paramId && documentDetails" ref="image" name="document_file" id="document_file" size="large" type="file" @change="onFileUpload" />
                    <ErrorMessage v-if="docValidationError || errorMsg" name="Document is required." />
                </a-form-item>
              
            </div>
        </a-col>
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.type')" name="type" :rules="[{ required: true, message: $t('global.type')+' '+$t('global.validation') }]">
                    <!-- <a-select ref="select" v-model:value="documents.type" style="width: 100%" size="large" @change="checkChangeInput()">
                        <a-select-option value="" disabled>{{'Select Type'}}</a-select-option>
                        <a-select-option v-for="documentType in globalCode.documentTypes.globalCode" :key="documentType.id" :value="documentType.id">{{documentType.name}}</a-select-option>
                    </a-select> -->
                    <GlobalCodeDropDown v-model:value="documents.type" :dataId="11" @handleGlobalChange="handleGlobalChange($event,'documents.type')" @change="checkChangeInput()" />
                    <!-- <ErrorMessage v-if="errorMsg" :name="errorMsg.type?errorMsg.type[0]:''" /> -->
                </a-form-item>
            </div>
        </a-col>
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.tags')" name="tags" :rules="[{ required: true, message: $t('global.tags')+' '+$t('global.validation') }]">
                    <!-- <a-select v-model:value="documents.tags" mode="multiple" size="large" placeholder="Select Tags" style="width: 100%" :options="globalCode.documentTags.globalCode.map((item) => ({ label: item.name, value: item.id }))" @change="checkChangeInput()" /> -->
                    <GlobalCodeDropDown v-model:value="documents.tags" mode="tags" :dataId="12" @handleGlobalChange="handleGlobalChange($event,'documents.tags')" @change="checkChangeInput()" />
                    <!-- <ErrorMessage v-if="errorMsg" :name="errorMsg.tags?errorMsg.tags[0]:''" /> -->
                </a-form-item>
            </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,12,'id','name'),'name','udid')"> </FormBaseComponents>
    </a-row>
    <ErrorMessage v-if="paramId && documentDetails" :name="paramId && documentDetails?' * Can not update file in the document field!':''" />
    <a-row :gutter="24" class="mb-24">
        <a-col :span="24" v-if="paramId && !documentDetails">
            <a-button html-type="reset" style="margin-right: 8px" @click="reset()">{{$t('global.clear')}}</a-button>
            <a-button type="primary" html-type="submit" >{{$t('global.save')}}</a-button>
        </a-col>
        <a-col :span="24" v-else-if="paramId && documentDetails">
            <a-button type="primary" html-type="submit" style="float:right">{{$t('global.update')}}</a-button>
        </a-col>
        <a-col :span="24" v-else>
            <a-button type="primary" html-type="submit" style="float:right">{{$t('global.save')}}</a-button>
        </a-col>
    </a-row>
    <a-row :gutter="24" class="mb-24" v-show="!paramId">
        <a-col :span="24">
            <DocumentTable :Id="Id" />
            <Loader />
        </a-col>
    </a-row>
</a-form>
</template>

<script>
import { defineComponent, computed, reactive, watchEffect, ref } from "vue";
// import { DeleteOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader";
import { warningSwal, errorSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import { useRoute } from "vue-router";
import DocumentTable from "../../care-coordinator/tables/DocumentTable.vue";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    // DeleteOutlined,
    Loader,
    ErrorMessage,
    DocumentTable,
    GlobalCodeDropDown,
    FormBaseComponents
  },
  props: {
    idPatient: {
      type: Number,
    },
    entity: String,
    paramId: String,
    clearData: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const formRest = ref();
    const patientId = reactive(props.idPatient);
    const patientUdid = route.params.udid;
    const docValidationError = ref(false);
    const image = ref();

    const onFileUpload = (event) => {
       store.commit("checkChangeInput", true)
      let docFile = event.target.files[0];
      if (docFile.size / 1024 > 5120) {
        Object.assign(documents, {
          document: "",
        });
        errorSwal("File size should be less than or equal to 5 MB");
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
        Object.assign(documents, {
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
      documents.document = docFile
      store.commit("checkChangeInput", true);
      store.dispatch("uploadFile", formData);
    };
    const addStaffs = computed(() => {
      return store.state.careCoordinator;
    });

    const documentDetails = computed(() => {
      return store.state.careCoordinator.documentStaffDetails
    })

    const filePath = computed(() => {
      return store.state.patients.uploadFile;
    });

    const documents = reactive({
      name: "",
      document: documentDetails.value?documentDetails.value.path:filePath.value,
      type: "",
      tags: [],
      entity: "staff",
    });

   

    const addDocument = () => {
      if (filePath.value == null && !documentDetails.value) {
        docValidationError.value = true;
      } else if (documentDetails.value) {
            store.dispatch("updateStaffDocument", {
            data: {
            name: documents.name,
            // document: filePath.value? filePath.value:documentDetails.value.path ,
            type: documents.type,
            tags: documents.tags,
            entity: "staff",
          },
              satffUdid: route.params.udid? route.params.udid: addStaffs.value.addStaff.id ,
              documentUdid: documentDetails.value.id,
            }).then(()=>{
              store.commit('checkChangeInput', false)
            })
            setTimeout(() => {
          if (addStaffs.value.closeModal == true) {
            image.value.stateValue = "";
            docValidationError.value = false;
            store.dispatch(
              "staffDocuments",
              route.params.udid? route.params.udid: addStaffs.value.addStaff.id
            );
            reset();
            store.state.careCoordinator.documentStaffDetails=null
            image.value.stateValue = ''
            emit("saveModal");
          }
        }, 2000);
      }else {
        store.dispatch("addStaffDocument", {
          data: {
            name: documents.name,
            document: filePath.value ? filePath.value : "",
            type: documents.type,
            tags: documents.tags,
            entity: "staff",
          },
          id: props.paramId ? props.paramId : addStaffs.value.addStaff.id,
        }).then(()=>{
              store.commit('checkChangeInput', false)
            })
        setTimeout(() => {
          if (addStaffs.value.closeModal == true) {
            image.value.stateValue = "";
            docValidationError.value = false;
            store.dispatch(
              "staffDocuments",
              props.paramId ? props.paramId : addStaffs.value.addStaff.id
            );
            reset();
            image.value.stateValue = ''
            emit("saveModal");
          }
        }, 2000);
      }
      store.state.provider.dropdownProviderLocations = []
    };

     const form = reactive({
      ...documents,
    });

    const documentsData = computed(() => {
      return store.state.patients.documents;
    });

    const documentColumns = computed(() => {
      return store.state.patients.documentColumns;
    });
    const globalCode = computed(() => {
      return store.state.common;
    });

    function deleteDocument(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteDocument", {
            id: addStaffs.value.addStaff.id,
            documentId: id,
          });
          setTimeout(() => {
            store.dispatch("staffDocuments", addStaffs.value.addStaff.id);
          }, 2000);
        }
      });
    }
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
    const onFinishFailed = (value) => {
      console.log('staff Document',value);
    };

    function reset() {
      formRest.value.resetFields();
      image.value.stateValue = ''
      store.state.patients.uploadFile = null
      Object.assign(documents, form);
     
    }

    watchEffect(() => {
       if (props.clearData == true) {
        Object.assign(documents, form);
        formRest.value.resetFields();
      }
      if (patientId != null) {
        store.dispatch("documents", patientUdid);
      }
      if (addStaffs.value.clearStaffFormValidation) {
        formRest.value.resetFields();
      }
      if(documentDetails.value){
        Object.assign(documents, documentDetails.value)
      }else{
        Object.assign(documents, form);
        // formRest.value.resetFields();
      }
    });

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    const handleGlobalChange = (data,type) =>{
      if (type == "documents.type") {
        documents.type = data;
      }
      if (type == "documents.tags") {
        documents.tags = data;
      }
      }

    return {
      handleGlobalChange,
      documentDetails,
      image,
      formRest,
      docValidationError,
      checkChangeInput,
      Id: addStaffs.value.addStaff ? addStaffs.value.addStaff.id : "",
      reset,
      onFinishFailed,
      handleChange,
      warningSwal,
      deleteDocument,
      globalCode,
      onFileUpload,
      filePath,
      documents,
      addDocument,
      documentColumns,
      documentsData,
      errorMsg: addStaffs.value.errorMsg,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
