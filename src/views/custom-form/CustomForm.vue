<template>
  <a-layout-content>
      <div class="common-bg">
          <a-row :gutter="20">
              <a-col :span="12">
                  <h2 class="pageTittle">Custom Form</h2>
              </a-col>
              <a-col :span="12" style="text-align: right">
                  <a-button type="primary" @click="addForm">
                      <template #icon>
                          <PlusOutlined />
                      </template>Add
                  </a-button>
              </a-col>
          </a-row>
          <a-row>
              <a-col :span="12" class=" mb-24">
                  <SearchField endPoint="" v-if="arrayToObjact(screensPermissions,40)" />
              </a-col>
              <a-col :span="12">
                  <div class="text-right mb-24">
                      <ExportToExcel disabled @click="exportExcel('careCoordinator_report','?fromDate=&toDate=')" v-if="arrayToObjact(screensPermissions,41)" />
                  </div>
              </a-col>
              <a-col :span="24">
                  <!-- Import custom form table here -->
                  <CustomForm />
                  <!-- <TableLoader /> -->
              </a-col>
          </a-row>
          <ModalForm v-model:visible="visible" @saveModal="saveModal($event)" />
      </div>
  </a-layout-content>
  </template>
  
<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref,onMounted } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import { arrayToObjact, exportExcel } from "@/commonMethods/commonMethod";
import ModalForm from "./ModalFormType.vue";
import CustomForm from "./tables/CustomFromTable.vue";
export default defineComponent({
  components: {
    PlusOutlined,
    ModalForm,
    CustomForm,
    SearchField,
    ExportToExcel,
  },
  setup() {
    const store = useStore();
    const visible = ref(false);
    const addForm = () => {
      visible.value = true;
    };
    onMounted(()=>{
      store.dispatch('customForms')
    })
    return {
      visible,
      addForm,
      arrayToObjact,
      exportExcel,
      screensPermissions: store.getters.screensPermissions,
    };
  },
});
</script>
