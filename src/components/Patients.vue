<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="10">
        <a-typography-title :level="2" class="common-heading">Patients</a-typography-title>

      </a-col>
      <a-col :span="14" class="text-right">
        <a-space>

          <a-select
      ref="select"
      v-model:value="value1"
      style="width: 120px"
      @focus="focus"
      @change="handleChange"
    >
      <a-select-option value="users">Users</a-select-option>
      <a-select-option value="contacts">Contacts</a-select-option>
      <a-select-option value="address" >Address</a-select-option>
      <a-select-option value="patientDetails">Patient Details</a-select-option>
      <a-select-option value="patientVitals">Patient Vitals</a-select-option>
      <a-select-option value="patientFlags">Patient Flags</a-select-option>
      <a-select-option value="patientPrograms">Patient Program</a-select-option>
      <a-select-option value="patientClients">Patient Client</a-select-option>
      <a-select-option value="patientInventories">Patient Device</a-select-option>
      <a-select-option value="inventories">Device</a-select-option>
    </a-select>
        <a-upload
          v-model:file-list="fileList"
          name="file"
          :action="URL+`import/patient/data?tableName=`+value1"
          :headers="headers"
          :before-upload="beforeUpload"
          showUploadList=false
          @change="handleChange"
        >
    <a-button class="primary-btn">
      <upload-outlined></upload-outlined>
      Click to Upload
    </a-button>
  </a-upload>
      </a-space>
      </a-col>
     
    </a-row>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { defineComponent, onMounted,ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
// import { useStore } from "vuex";
const URL = import.meta.env.VITE_APP_API_URL

export default defineComponent({
  components: {
    UploadOutlined
  },
  setup() {
    // const store = useStore()
    const fileList = ref([]);
    const billingsData = ref([])
    onMounted(() => {
      // store.dispatch('billingReportTable')
    })
    const handleChange = info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        billingsData.value =  info.file.response
        fileList.value = []
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        fileList.value = []
      }
    };

    const downloadFile = () =>{
      const url = URL+'sample/report/download';
      window.location.href = url;
    }

    const beforeUpload = file => {
      const isJpgOrPng = file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isJpgOrPng) {
        message.error('You can only upload csv/xls/xlsx file!');
        fileList.value = []
      }
      return isJpgOrPng;
    };
    
    return {
      value1:ref('users'),
      beforeUpload,
      downloadFile,
      handleChange,
      fileList,
      billingsData,
      headers: {
        authorization: 'authorization-text',
      },
      URL
    };
  },
});
</script>
<style  scoped>
  .common-table {
    margin:60px 0 0;
  }
</style>