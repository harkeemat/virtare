<template>
    <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle">
                    Questionnaire Template Section
                    <div class="commonBtn">
                        <a-button class="btn primaryBtn" @click="showModal({show:true,id:''})">Create New Section</a-button>
                    </div>
                </h2>
            </a-col>
            <a-col :span="12">
                <SearchField endPoint="questionnaireSection" class="mb-24" />
            </a-col>
            <a-col :span="24">
                <SectionTable @edit="showModal($event)" />

            </a-col>
        </a-row>
    </div>
<!--modals-->
<CreateSection v-model:visible="visible2" :update="update" @is-visible="showModal($event)" v-if="visible2"/>
<!---->
</template>
<script>
import CreateSection from "@/components/administration/template-section/modals/CreateSection";
import SectionTable from "@/components/administration/template-section/SectionTable";
import { ref, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
export default {
  
  components: {
    CreateSection,
    SectionTable,
    SearchField,
  },
  setup() {
    const store = useStore();
    const checked = ref([false]);
    const visible2 = ref(false);
    const update = ref("");
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
      store.dispatch("questionnaireTemplateSectionList");
    });

    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
      store.state.patients.errorMsg = "";
      store.state.common.successMsg = "";
    });

    return {
      checked,
      visible2,
      showModal,
      templatEdit,
      handleChange2,
      update,
    };
  },
};
</script>


