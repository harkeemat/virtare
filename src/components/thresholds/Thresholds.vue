<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">
            {{ $t("thresholds.generalParameters") }}
            <div class="commonBtn" v-if="arrayToObjact(screensPermissions,329)">
              <!-- <a-button type="primary" @click="showModal(true)">{{
                $t("thresholds.addNewParameters")
                }}</a-button> -->
                <ShowModalButton @click="showModal(true)" :buttonText="$t('thresholds.addNewParameters')" />
            </div>
          </h2>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <SearchField  endPoint="generalParameterGroup"/>
        </a-col>
        <a-col :span="12" >
          <div class="text-right mb-24">
            <ExportToExcel  @click="exportExcel('generalParameter_report','?fromDate=&toDate='+search)" v-if="arrayToObjact(screensPermissions,335)"/>
          </div>
        </a-col>
        <ThresholdsTable  @is-edit="showEdit($event)"></ThresholdsTable>
        <TableLoader />
      </a-row>
    </div>
  </a-layout-content>
  <Thresholds v-if="threshodsId" v-model:visible="Thresholds" @is-visible="isEdit($event)" :threshodId="threshodsId" />
  <Thresholds v-else v-model:visible="Thresholds" @is-visible="isEdit($event)" />
</template>
<script>
  import { ref, watchEffect,onUnmounted } from "vue";
  import Thresholds from "@/components/modals/Thresholds";
  import ThresholdsTable from "./ThresholdsTable";
  import { useStore } from "vuex";
  import TableLoader from "@/components/loader/TableLoader";
  import SearchField from "@/components/common/input/SearchField";
  import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
  import { exportExcel,arrayToObjact } from "@/commonMethods/commonMethod";
  import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
  export default {
    components: {
      ShowModalButton,
      ThresholdsTable,
      Thresholds,
      TableLoader,
      SearchField,
      ExportToExcel
    },

    setup() {
      const store = useStore();
      const threshodsId = ref()
      watchEffect(() => {
        
        store.dispatch("generalParameterList");
        store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
      });
      
      function nullId (){
        threshodsId.value=''
      }
      const handleChange = (value) => {
        console.log(`selected ${value}`);
      };
      const checked = ref([false]);

      const Thresholds = ref(false);
      const showModal = (e) => {
        threshodsId.value=null
        Thresholds.value = e;
      };
      const isEdit = (e) => {
        Thresholds.value = e;
      };
      const showEdit = (e) =>{
      threshodsId.value=e.id
        Thresholds.value = e.check;
      }
      const options = ref([
        {
          value: "Group One",
          label: "Group One",
        },
        {
          value: "Blood Glucose",
          label: "Blood Glucose",
        },
        {
          value: "Systolic BP",
          label: "Systolic BP",
        },
        {
          value: "Weight",
          label: "Weight",
        },
        {
          value: "Spo2",
          label: "Spo2",
        },
        {
          value: "Pulse (BP Cuff)",
          label: "Pulse (BP Cuff)",
        },
        {
          value: "Group Three",
          label: "Group Three",
        },
      ]);
      onUnmounted(()=>{
        store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
        })
        
      return {
        screensPermissions:store.getters.screensPermissions,
        arrayToObjact,
        exportExcel,
        checked,
        Thresholds,
        showModal,
        value: ref([]),
        handleChange,
        options,
        size: ref([]),
        threshodsId,
        showEdit,
        nullId,
        isEdit,
        search: store.getters.searchTable,
      };
    },
  };
</script>
<style lang="scss"></style>