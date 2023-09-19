<template>
<a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,20,'id','name'),'name','udid')" scrollToFirstError=true :model="documents" name="basic" autocomplete="off" layout="vertical" @finish="addDocument" @finishFailed="onFinishFailed">
    <a-row :gutter="24">
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.name')" name="name" :rules="[{ required: true, message: $t('global.name')+' '+$t('global.validation') }]">
                    <a-input @change="changedValue" v-model:value="documents.name" size="large" style="width:100%" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.document')" name="document" :rules="[{ required: isEditDocument?false:true, message: $t('global.document')+' '+$t('global.validation') }]">
                    <a-input :disabled="isEditDocument" ref="image" name="document_file" id="document_file" size="large" type="file" @change="onFileUpload" />
                    <ErrorMessage v-if="docValidationError" name="Document is required." />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.document?errorMsg.document[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.type')" name="type" :rules="[{ required: true, message: $t('global.type')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown @change="changedValue" v-model:value="documents.type" :dataId="11" @handleGlobalChange="handleGlobalChange($event,'documents.type')" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.type?errorMsg.type[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.tags')" name="tags" :rules="[{ required: true, message: $t('global.tags')+' '+$t('global.validation') }]">
                    <!-- <a-select v-model:value="documents.tags" mode="multiple" size="large" placeholder="Select Tags" style="width: 100%" :options="globalCode.documentTags.globalCode.map((item) => ({ label: item.name, value: item.id }))" @change="changedValue" /> -->
                    <GlobalCodeDropDown @change="changedValue" size="large" v-model:value="documents.tags" mode="tags" :dataId="12" @handleGlobalChange="handleGlobalChange($event,'documents.tags')" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.tags?errorMsg.tags[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,20,'id','name'),'name','udid')"> </FormBaseComponents>
    </a-row>
    <ErrorMessage v-if="isEditDocument" :name="isEditDocument?' * Can not update file in the document field!':''" />
    <a-row :gutter="24" class="mb-24">
        <a-col :span="24" v-if="paramId">
            <a-button html-type="reset" style="margin-right: 8px" @click="reset()">{{$t('global.clear')}}</a-button>
            <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
        </a-col>
        <a-col :span="24" v-else>
            <a-button type="primary" html-type="submit" style="float:right">{{$t('global.save')}}</a-button>
        </a-col>
    </a-row>
    <a-row :gutter="24" class="mb-24" v-show="!paramId">
        <a-col :span="24">

            <DocumentTable :Id="Id" @onEditDocument="updateDocument" @deleteDoc="deleteDoc()" />
            <TableLoader />
        </a-col>
    </a-row>
</a-form>
<Loader />
</template>

<script>
import {
  defineComponent,
  computed,
  reactive,
  watchEffect,
  ref,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader";
import TableLoader from "@/components/loader/TableLoader";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import { useRoute } from "vue-router";
import DocumentTable from "../../patients/data-table/DocumentTable.vue";
import { errorSwal,arrayToObjectData,formTitleNames } from "@/commonMethods/commonMethod";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    // DeleteOutlined,
    Loader,
    // FileOutlined,
    ErrorMessage,
    DocumentTable,
    GlobalCodeDropDown,
    TableLoader,
    FormBaseComponents
  },
  props: {
    patientId: {
      type: Number,
    },
    idPatient: {
      type: String,
    },
    entity: String,
    paramId: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientId = props.idPatient
      ? reactive(props.idPatient)
      : route.params.udid
      ? route.params.udid
      : "";

    const docValidationError = ref(false);
    const formRef = ref();
    const image = ref();
    const isEditDocument = ref(false);
    const isDocumentrequired = ref(true);
    const documentUdid = ref(null);

    const changedValue = () => {
      emit("onChange");
      store.commit("checkChangeInput", true);
    };

    const filePath = computed(() => {
      return store.state.patients.uploadFile;
    });

    const documentDetail = computed(() => {
      return store.state.patients.documentDetails;
    });

    const documents = reactive({
      name: "",
      document: filePath.value ? filePath.value : "",
      type: "",
      tags: [],
      entity: "patient",
    });
    const form = reactive({
      ...documents,
    });

    const updateDocument = (documentDetails) => {
      isEditDocument.value = true;
      isDocumentrequired.value = false;
      documentUdid.value = documentDetails.id;
      Object.assign(documents, documentDetails);
    };

    const onFileUpload = (event) => {
      let docFile = event.target.files[0];
      emit("onChange");
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
      documents.document = docFile;

      store.commit("checkChangeInput", true);
      store.dispatch("uploadFile", formData);
    };
    const staffs = computed(() => {
      return store.state.careCoordinator;
    });
    watchEffect(() => {
      if (staffs.value.clearStaffFormValidation) {
        formRef.value.resetFields();
        Object.assign(documents, form);
      }
      if (patientId) {
        store.dispatch("documents", patientId);
      }
    });
    const patients = computed(() => {
      return store.state.patients;
    });

    const addStaff = computed(() => {
      return store.state.careCoordinator.addStaff;
    });

    const addDocument = () => {
      if (props.entity == "patient") {
        const document = ref(null);
        if (filePath.value && filePath.value != null) {
          document.value = filePath.value;
        } else {
          document.value = documentDetail.value.document;
        }
        const patientData = {
          name: documents.name,
          // document: document.value,
          type: documents.type,
          tags: documents.tags,
          entity: "patient",
        };

        if (isEditDocument.value) {
          store
            .dispatch("updateDocument", {
              data: patientData,
              patientUdid: patientId ? patientId : route.params.udid,
              documentUdid: documentUdid.value,
            })
            .then(() => {
              if (props.paramId) {
                emit("document", false);
              } else {
                emit("onChange", false);
              }

              formRef.value.resetFields();

              store.state.patients.uploadFile = null;
              documents.document = "";

              image.value.stateValue = "";
              docValidationError.value = false;
              Object.assign(documents, form);
              store.dispatch(
                "documents",
                patientId ? patientId : route.params.udid
              );
              store.dispatch(
                "latestDocument",
                patientId ? patientId : route.params.udid
              );
              store.dispatch(
                "patientDocuments",
                patientId ? patientId : route.params.udid
              );
              store.dispatch("patientTimeline", {
                id: patientId ? patientId : route.params.udid,
                type: "",
              });
              isDocumentrequired.value = true;
              isEditDocument.value = false
            });
        } else {
          if (filePath.value == null) {
            docValidationError.value = true;
          } else {
          const patientData = {
              name: documents.name,
              document: document.value,
              type: documents.type,
              tags: documents.tags,
              entity: "patient",
            } ;
            store
              .dispatch("addDocument", {
                data: patientData,
                id: patientId ? patientId : route.params.udid,
              })
              .then(() => {
                store.dispatch(
                  "documents",
                  patientId ? patientId : route.params.udid
                );
                store.dispatch(
                  "latestDocument",
                  patientId ? patientId : route.params.udid
                );
                store.dispatch(
                  "patientDocuments",
                  patientId ? patientId : route.params.udid
                );
                store.dispatch("patientTimeline", {
                  id: patientId ? patientId : route.params.udid,
                  type: "",
                });
                if (props.paramId) {
                  emit("document", false);
                  emit("closeModal", false);
                } else {
                  emit("onChange", false);
                }
                formRef.value.resetFields();
                image.value.stateValue = "";
                docValidationError.value = false;
                store.state.patients.uploadFile = null;
                documents.document = "";
                Object.assign(documents, form);
              });
          }
        }
      }
    };

    const documentsData = computed(() => {
      return store.state.patients.documents;
    });

    const documentColumns = computed(() => {
      return store.state.patients.documentColumns;
    });
    const globalCode = computed(() => {
      return store.state.common;
    });
    const handleChange = () => {
      
    };
    const onFinishFailed = () => {};
    let Id = null;
    if (props.paramId) {
      Id = props.paramId ? props.paramId : addStaff.value.id;
    } else {
      if (patientId != null) {
        Id = patientId;
      } else {
        Id = patients.value.addDemographic
          ? patients.value.addDemographic.id
          : "";
      }
    }

    onMounted(() => {
      reset();
      formRef.value.resetFields();
    });

    function reset() {
      Object.assign(documents, form);
      store.state.patients.uploadFile = null;
    }

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg;
    });

    function deleteDoc() {
      reset();
      isEditDocument.value = false;
      isDocumentrequired.value = false;
      documentUdid.value = "";
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
      isEditDocument,
      handleGlobalChange,
      deleteDoc,
      image,
      docValidationError,
      changedValue,
      formRef,
      reset,
      Id,
      onFinishFailed,
      handleChange,
      // warningSwal,
      // deleteDocument,
      globalCode,
      onFileUpload,
      filePath,
      documents,
      addDocument,
      patients,
      documentColumns,
      documentsData,
      updateDocument,
      errorMsg,
      isDocumentrequired,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
