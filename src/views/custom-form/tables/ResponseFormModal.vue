<template>
    <a-modal class="modalH-auto" max-width="1140px" width="40%" :title="'Report Data'" centered   :footer="false" :maskClosable="false" @cancel="closeModal()">
      <!-- <a-table :columns="customFormData?.responseTemplate?.columns" :pagination="false" :data-source="customFormData?.responseTemplate?.values" @change="onChange" >
        <template #action="{record}" >
            <a-tooltip placement="bottom">
            <template #title>
                <span>{{'Info'}}</span>
            </template>
            <a class="icons" @click="viewData(record.id)">
              <InfoCircleOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom">
            <template #title>
                <span>{{'Response'}}</span>
            </template>
            <a class="icons" @click="responseTemplate(record.id)">
              <FileSearchOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom">
            <template #title>
                <span>{{$t('global.delete')}}</span>
            </template>
            <a class="icons" @click="deleteTemplate(record.id)">
                <DeleteOutlined  />
            </a>
        </a-tooltip>
    </template>
    </a-table> -->
     <div class="reportItem" v-for="item in customFormData?.responseTemplate?.columns" :key="item.id"> <span>{{item.title}} :</span> <span>{{customFormData?.responseTemplate?.values[0][item.dataIndex]}} </span></div>
    </a-modal>
    </template>
  <script>
  
  import { computed,reactive} from "vue";
//   import { useRoute } from "vue-router";
  import { useStore } from "vuex";
  export default {
    props: {
        // 
    },
  setup() {
    const store = useStore();
    // const route = useRoute();
    const formState = reactive({});

    const form = reactive({
            ...formState,
        });

    const customFormData = computed(()=>{
        return store.state.customForm
    })
  
    function closeModal() {
        Object.assign(formState,form)
    }
  
    return {
        form,
        formState,
      customFormData,
      closeModal,
    };
  },
  };
  </script>
  
  <style lang="scss" scoped>
  span.error {
  color: #ff0000;
  }
  .reportItem {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    span {
      padding: 10px 15px 10px 0;
      &:first-child {
        color: #999;
        width: 60%;
      }
      &:last-child {
        color: #000;
        font-weight: 500;
      }
    }
    &:last-child {
      border: none;
    }
  }
  
  </style>
  