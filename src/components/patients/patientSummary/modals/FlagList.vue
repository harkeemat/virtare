<template>
    <a-modal width="1000px" :title="categoryName?categoryName:' Status'" centered :maskClosable="false" @cancel="closeModal">
      <a-row :gutter="24">
        <a-col :sm="24" :xs="24">
          <a-table  rowKey="id"  :columns="flagColumns" :data-source="patientFlagsList?.patientFlagsList" :pagination="false">
            <template #flagName="{record}">
                <Flags :data="record" :flag="record.flagColor" />
            </template>
          <template #action="{record}">
            <a-tooltip placement="right">
              <template #title>
                <span>{{$t('global.delete')}}</span>
              </template>
              <a class="icons" @click="deleteFlag(record.id, 1);actionTrack(patientUdid,313,'patient')">
                <DeleteOutlined />
              </a>
            </a-tooltip>
          </template>
          </a-table>
          <Loader/>
        </a-col>
      </a-row>
      <PatientFlagsModal v-model:visible="flagsModalVisible" :categoryName="categoryName" :categoryId="categoryId" :patientId="patientUdid" @closeModal="handleOk($event)" :flagsId="flagsId" title="delete" />
    </a-modal>
</template>
  <script>
  import {
    computed,
    defineComponent,
    onMounted,
    defineAsyncComponent,
    ref,
    watchEffect
  } from "vue";
  import { useStore } from "vuex";
  import {
    DeleteOutlined,
  } from "@ant-design/icons-vue";
  import { warningSwal,actionTrack,arrayToObjact } from "@/commonMethods/commonMethod";
  import { messages } from "@/config/messages";
  import Loader from "@/components/loader/Loader"
  export default defineComponent({
    components: {
      PatientFlagsModal: defineAsyncComponent(() =>
      import("@/components/modals/PatientFlagsModal")
    ),
     DeleteOutlined,
     Flags: defineAsyncComponent(() =>
      import("@/components/common/flags/Flags")
    ),
     Loader,
 
    },
    props:{
        title:String,
        patientUdid:String,
        categoryId:Number,  
        categoryName:String 
    },
    setup(props, {emit}) {
      const store = useStore();
      const flagsModalVisible = ref()
      const flagsId = ref()
      onMounted(()=>{
        store.dispatch("patientFlagsList", {patientUdid:props.patientUdid,catId:props.categoryId})
      })

      const patientFlagsList = computed(() => {
        return store.state.flags
      })

      watchEffect(()=>{
        // Checking flag list if list is empty then will close the modal after last element delete. 
        if(patientFlagsList?.value?.length==0){
                emit('closeModal', {
                show: false,
              })
            }
      })
  
      const flagColumns = [
        {
          title: "Status",
          dataIndex: "flagName",
          slots:{
            customRender:'flagName'
          }
        },
        {
          title: "Created At",
          dataIndex: "createdAt",
        },
        {
          title: "Reason",
          dataIndex: "flagReason",
        },
        {
          title: "Action",
          dataIndex: "action",
          className:'criticalNoteAction',
          slots: {
            customRender: "action",
          },
        },
      ];
        
      const handleOk = (value) => {
        flagsModalVisible.value = value.value?value.value:false

      }
      const deleteFlag = (id) =>{
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
            flagsModalVisible.value = true
            flagsId.value = id
          // store.dispatch('deleteFlag', {id:props.patientUdid,flagId:id}).then((resp)=>{
          //   if(resp==true){
          //     store.dispatch("patientFlagsList", props.patientUdid)
          //   }
          // })
        }
    });
      
    }
  
      const closeModal = () => {
        emit('closeModal', {
          show: false,
         
        })
      }

      return {
        handleOk,
        flagsId,
        flagsModalVisible,
        closeModal,
        arrayToObjact,
        screensPermissions: store.getters.screensPermissions,
        actionTrack,
        patientFlagsList,
        flagColumns,
        deleteFlag,
      };
    },
  });
  </script>
  <style lang="scss" scoped>
  .ant-popover {
      width: 60%;
      left: 24px !important;
    }
    .criticalNote { width: 50%; }
    td.criticalNote {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis !important;
      margin: 0 auto;
    }
    th.criticalNoteAction, td.criticalNoteAction { text-align: center !important; }
  
  span.anticon.anticon-undo {
    font-size: 20px !important;
  }
  </style>