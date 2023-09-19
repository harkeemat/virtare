<template>
<a-layout-content> 
    <div class="common-bg">
        <a-row>
           
            <a-col :span="12">
                <SearchField endPoint="user/questionnaire/template" :otherParam="'&rentityType='+entityType+'&referenceId='+userId+'&status=complete'" class="mb-24" loader="questionnaireLoadingStatus" commit="questionnaireResponse"/>
            </a-col>
            <a-col :span="24">
                <QuestionnaireFormTable :viewShow="false"/>
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
   props: {
       
        entityType: Number,
        userId: String,
    },
  setup(props) {
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

    const handleChange2 = () => {
   
    };
    onMounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.dispatch("questionnaireResponse","?entityType=" + props.entityType + '&referenceId='+props.userId+'&status=complete');
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


