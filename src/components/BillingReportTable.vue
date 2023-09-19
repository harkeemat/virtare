<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="10">
        <a-typography-title :level="2" class="common-heading">Billing Report</a-typography-title>

      </a-col>
      <a-col :span="14" class="text-right">
        <a-space>
        <a-button class="secondary-btn" @click="downloadFile" >
          <template #icon>
            <download-outlined />
          </template>
          Sample CSV
        </a-button>
        <!-- <a-button class="primary-btn">
          <template #icon>
            <upload-outlined />
          </template>
          Upload CSV
        </a-button> -->
        <a-upload
          v-model:file-list="fileList"
          name="file"
          :action="URL+`billing/generate`"
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
      <a-col :span="24">
        <a-table class="common-table" :columns="columns" :data-source="billingsData" :pagination="false">
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">
              <a>{{ text }}</a>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { message } from 'ant-design-vue';
import { defineComponent, onMounted,ref } from 'vue';
import { DownloadOutlined,UploadOutlined } from '@ant-design/icons-vue';
// import { useStore } from "vuex";
const URL = import.meta.env.VITE_APP_API_URL
const columns = [{
  title: 'Patient Name',
  dataIndex: 'patient',
  key: 'patient',
}, {
  title: 'Client',
  dataIndex: 'client',
  key: 'client',
  width: 80,
}, {
  title: 'Cpt Code',
  dataIndex: 'cptCode',
  key: 'cptCode',
  ellipsis: true,
}, {
  title: 'Activity Category',
  dataIndex: 'activityCategory',
  key: 'activityCategory',
  ellipsis: true,
}, {
  title: 'Activity',
  dataIndex: 'activity',
  key: 'activity',
  ellipsis: true,
}, {
  title: 'Units',
  dataIndex: 'unit',
  key: 'unit',
  ellipsis: true,
}, {
  title: 'Fee',
  dataIndex: 'fee',
  key: 'fee',
  ellipsis: true,
}, {
  title: 'Process Date',
  dataIndex: 'processDate',
  key: 'processDate',
  ellipsis: true,
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 2 Lake Park, London No. 2 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];

export default defineComponent({
  components: {
    DownloadOutlined,
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
      beforeUpload,
      downloadFile,
      handleChange,
      fileList,
      billingsData,
      data,
      columns,
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