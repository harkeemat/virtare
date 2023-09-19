<template>
<a-modal width="400px" class="modalH-auto" title="Add Widgets" :footer="true" centered @ok="handleOk">
    <a-form ref="formRef" :model="widgets" layout="vertical" @finish="SubmitRecord" @finishFailed="SubmitRecord">
      <a-col :span="24">
        <div class="selectWidgets" v-for="widget,index in widgetListing" :key="index">
            <a-checkbox class="outerCheckbox" v-model:checked="widgets.checkAll[index]" :indeterminate="indeterminate" @change="onCheckAllChange($event,index)">
                {{widget.name}}
            </a-checkbox>
            <a-checkbox-group v-model:value="widgets.checkedList[index]" class="innerCheckbox">
                <a-checkbox v-for="widgetName in widget.widget" :key="widgetName.id" :value="widgetName.id">{{widgetName.title}}</a-checkbox>
            </a-checkbox-group>
        </div>
      </a-col>
        <a-col :span="24">
            <FormButtons @onCancel="closeModal" :submitButton="$t('global.save')" />
        </a-col>
    </a-form>
</a-modal>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, watchEffect } from "vue";
import FormButtons from "@/components/common/button/FormButtons";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    list1: Array,
    list2: Array,
    align: Boolean,
    tasksColumns: Array,
    escalationColumn: Array

  },
  components: {
    FormButtons,
  },
  setup(props, { emit }) {
    const store = useStore()
    const visible = ref();
    const handleOk = () => {
      visible.value = true;
    };

    const widgets = reactive({
      checkedList: [
      ],
      indeterminate: true,
      checkAll: [

      ],
    });
    const allwidgetdashboard = store.getters.widgetRecords
    const widgetListing = store.getters.widgetName

    const handleCancel = () => {
      visible.value = false;
    };
    onMounted(() => {
      store.dispatch("getUserSetting", { config: 'business Dashboard' }).then(() => {
        allwidgetdashboard.value.map((item) => {
          if (item.config == "clinic Dashboard") { 
            widgets.checkedList[0] = []
            let setting = JSON.parse(item.setting)

            for (let i = setting.widget.length - 1; i >= 0; i--) {
              widgets.checkedList[0].push(setting.widget[i].id)
            }
            
          }
          if (item.config == "business Dashboard") {
            widgets.checkedList[1] = []
            let setting = JSON.parse(item.setting)

            for (let i = setting.widget.length - 1; i >= 0; i--) {
              widgets.checkedList[1].push(setting.widget[i].id)
            }

          }
        })
      })
    });


    const SubmitRecord = () => {

      let clinicDashboard = []
      let businessDashboard = []
      widgetListing.value.map((item, index) => {

        for (let i = widgets.checkedList[index]?.length - 1; i >= 0; i--) {
          if (index == 0) {
            let objectResult = item.widget.find(
              (record) => record.id == widgets.checkedList[index][i]
            );
            if (objectResult) {
              clinicDashboard.push(objectResult);
            }

          }
          else {
            let objectResult = item.widget.find(
              (record) => record.id == widgets.checkedList[index][i]
            );
            if (objectResult) {
              businessDashboard.push(objectResult);
            }

          }
        }
      })


      let ClinicSetting = {
        config: "clinic Dashboard",
        setting: JSON.stringify({
          patientsCounter: true,
          widget: clinicDashboard,
          tableColumn: {
            escalation: props.escalationColumn,
            task: props.tasksColumns
          }
        }),
      }
      let businessSetting = {
        config: "business Dashboard",
        setting: JSON.stringify({
          widget: businessDashboard,
        }),
      }
     
      store.dispatch("userSetting", ClinicSetting)
      store.dispatch("userSetting", businessSetting)

      emit("saveModal", {
        show: false,
        clinic: clinicDashboard,
        business: businessDashboard
      });
      closeModal()
    };
    watchEffect(() => {
      let clinicCountLength = widgetListing.value[0]?.widget.length
      let businessCountLength = widgetListing.value[1]?.widget.length
      if (widgets.checkedList.length) {
        clinicCountLength == widgets.checkedList[0].length ? widgets.checkAll[0] = true : widgets.checkAll[0] = false

      }
      if (widgets.checkedList.length > 1) {
        businessCountLength == widgets.checkedList[1].length ? widgets.checkAll[1] = true : widgets.checkAll[1] = false
      }
    })

    const onCheckAllChange = (e, index) => {

      let array = [];
      if (e.target.checked) {
        widgetListing.value[index]?.widget.map((item) => {
          array.push(item.id);
        })
      } else {
        array = []
      }

      Object.assign(widgets, {

        indeterminate: false,
      });
      widgets.checkedList[index] = array
    };
    const closeModal = () => {
      widgets.checkedList = [];
      widgets.checkAll = []
      emit("saveModal", {
        show: false,
        clinic: '',
        business: ''
      });
  
    };
    return {
      handleOk,
      handleCancel,
      widgets,
      SubmitRecord,
      closeModal,
      onCheckAllChange,
      widgetListing
    };
  },
});
</script>
<style lang="scss" scoped>
.selectWidgets {
  .ant-checkbox-group {
    width: 100%;
    &.innerCheckbox {
      padding: 10px 0 10px 20px;
      .ant-checkbox-wrapper {
        width: 100%;
        margin: 5px 0;
      }
    }
   
  }
  .outerCheckbox {
      border-bottom: 1px solid #e3e3e3;
      font-size: 15px;
      font-family: "OpenSans-Semibold";
      width: 100%;
      padding: 0 3px 10px;
      margin: 0;
    }
}
</style>
  



