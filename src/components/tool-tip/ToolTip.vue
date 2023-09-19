<template>
  
<div class="common-bg" >
    <h2 style="margin: 0 0 10px" >Tool Tip</h2>
    <a-form ref="formRest" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')" scrollToFirstError=true :model="toolTip" name="basic" autocomplete="off" layout="vertical" @finish="submitResponse">
        <a-row :gutter="20">
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item label="Screen" name="screenId" :rules="[{ required: true, message: $t('common.flag')+' '+$t('global.validation')  }]">
                        <ArrayDataSearch v-model:value="toolTip.screenId" :globalCode="screensWeb" @change="screen" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.screenId ? errorMsg.screenId[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item label="Form" name="formId" :rules="[{ required: true, message: 'Form'+' '+$t('global.validation')  }]">
                        <ArrayDataSearch v-model:value="toolTip.formId" :globalCode="formRecords" @change="formRecord" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.formId ? errorMsg.formId[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item label="Field" name="fieldId" :rules="[{ required: true, message: 'Field'+' '+$t('global.validation')  }]">
                        <ArrayDataSearch v-model:value="toolTip.fieldId" :globalCode="fieldName" @change="fieldData($event)" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.screenId ? errorMsg.screenId[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.description')" name="description" :rules="[{ required: true, message: $t('global.description')+' '+$t('global.validation') }]">
                        <a-textarea @change="changedValue" v-model:value="toolTip.description" size="large" style="width:100%" :rows="6" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.name?errorMsg.name[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents v-if="formData.length>0" :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')"> </FormBaseComponents>
            <a-col :span="24" style="text-align: right">
                <a-button type="primary" html-type="submit">Submit</a-button>
            </a-col>
        </a-row>
    </a-form>
</div>
<Loader />
</template>
<script>
import { onMounted, reactive, ref } from 'vue-demi';
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import { useStore } from 'vuex';
import Loader from "@/components/loader/Loader";
import { arrayToObjectData,formTitleNames } from "@/commonMethods/commonMethod";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  components: {
    ArrayDataSearch,
    Loader,
    FormBaseComponents
  },
  setup() {
    const store = useStore()
    const formRest = ref();
    const screensWeb = store.getters.screensWeb
    const formRecords = store.getters.formRecords
    const fieldName = store.getters.getObject
    const toolTip = reactive({
      "screenId": '',
      "formId": "",
      "description": "",
      "fieldId": ''
    })
    onMounted(() => {
      store.dispatch("screensWeb")
      
      //store.dispatch("tooltip",{id:formId?.id,name:formId.udid,type:"form"})
    })
    const screen = () => {
      toolTip.formId=''
      toolTip.fieldId = ''
      toolTip.description = ''
      store.dispatch("formRecords",{id:toolTip.screenId,type:"form"})
      // store.dispatch("tooltip",{id:event,name:formId.udid,type:"screen"})
      
    }
    const formRecord = () => {
      toolTip.fieldId = ''
      toolTip.description = ''
      store.dispatch("getObject", { id: toolTip.formId, type: "form" })
    }
    const fieldData = () => {
      toolTip.description = ''
      let object = arrayToObjectData(fieldName.value, toolTip.fieldId,'id')
      toolTip.description = object.description
    }
    const user = JSON.parse(localStorage.getItem("auth"))

    const form = reactive({ toolTip })
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
    const submitResponse = () => {
      store.dispatch("toolTipSubmit", {
        id: toolTip.fieldId,
        data: { description: toolTip.description }
      }).then(() => {
        store.dispatch("tooltip")
        formRest.value.resetFields();
        toolTip.description = ''
        toolTip.fieldId = ''
        toolTip.screenId = ''
        toolTip.formId = ''
        Object.assign(toolTip, form)
      })


    }
    return {
      formRest,
      focus,
      handleChange,
      toolTip,
      submitResponse,
      screen,
      screensWeb,
      user,
      fieldData,
      formRecords,
      formRecord,
      fieldName,
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
