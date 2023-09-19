<template>
<a-layout-content> 
    <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle">
                   Questionnaire Response
                    
                </h2>
            </a-col>
            <a-col :span="12">
                <SearchField endPoint="user/questionnaire/template" otherParam="&rentityType=247" class="mb-24" loader="questionnaireLoadingStatus" commit="questionnaireResponse"/>
            </a-col>
            <a-col :span="24">
                <QuestionnaireFormTable  :viewShow="true"/>

            </a-col>
        </a-row>
    </div>
  </a-layout-content> 
<!--modals-->
<CreateTemplate v-model:visible="visible2" :update="update" @is-visible="showModal($event)" :cloneId="templateId"/>
<!---->
</template>
<script>
import CreateTemplate from "@/components/administration/questionnaire-template/modals/CreateTemplate";
import QuestionnaireFormTable from "@/components/questionnaireForm/QuestionnaireFormTable";
import { ref, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
export default {
  components: {
    CreateTemplate,
    QuestionnaireFormTable,
    SearchField,
  },
  setup() {
    const store = useStore();
    const checked = ref([false]);
    const visible2 = ref(false);
    const update = ref('');
    const showModal = (e) => {
      update.value = e.id;
      visible2.value = e.show;
    };
    const templatEdit = (e) => {
      update.value = e.id;
      visible2.value = e.show;
    };

    const handleChange2 = (value) => {
      console.log(`selected ${value}`);
    };
    onMounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.dispatch("questionnaireResponse","?entityType=");
    });

    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.state.patients.errorMsg = "";
      store.state.common.successMsg = "";
    });
    const templateId = ref('')
 const clone = (event) =>{
templateId.value = event
visible2.value = true;
 }
    return {
      checked,
      visible2,
      showModal,
      templatEdit,
      handleChange2,
      update,
      clone,
      templateId
    };
  },
};
</script>


