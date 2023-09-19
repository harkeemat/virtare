<template>
<div>

   
   
       
            <a-col :span="12">
                <SearchField endPoint="assign/questionnaire/template" class="mb-24" commit="assignAllTemplates" :otherParam="'&referenceId='+userId+'&entityType='+entityType"/>
            </a-col>
            <a-col :span="24">
                <QuestionnaireTemplateTable  @edit="showModal($event)" @clone="clone($event)" :entityType="entityType" @is-visible="emitRecords($event)" :userId="userId"/>

            </a-col>
        
    </div>

<!--modals-->

<!---->
</template>

<script>
import QuestionnaireTemplateTable from "@/components/common/questionnaire/QuestionnaireTable"
import { ref, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
//import PatientInfoTop from "@/components/patients/patientSummary/PatientInfoTop";
export default {
    components: {

        QuestionnaireTemplateTable,
        SearchField,
        //PatientInfoTop
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
        const templateId = ref('')
        const showModal = (e) => {
            update.value = e.id;
            visible2.value = e.show;
            templateId.value = ''
        };
        const templatEdit = (e) => {
            update.value = e.id;
            visible2.value = e.show;
        };

        const handleChange2 = () => {
           
        };
       
        onMounted(() => {
            store.state.questionnaireTemplate.assignAllTemplates = []
            store.dispatch("searchTable", "&search=");
            store.dispatch("orderTable", {
                data: "&orderField=&orderBy=",
            });
            store.dispatch("assignAllTemplates", 
                '?referenceId='+props.userId+'&entityType='+props.entityType
                
            );
        });

        onUnmounted(() => {
            store.state.questionnaireTemplate.assignAllTemplates = []
            store.state.questionnaireTemplate.detailsQuestionnaireTemplate = null
            store.state.questionnaireTemplate.templateDetailsList = []
            store.dispatch("searchTable", "&search=");
            store.dispatch("orderTable", {
                data: "&orderField=&orderBy=",
            });
            store.state.patients.errorMsg = "";
            store.state.common.successMsg = "";
        });

        const clone = (event) => {
            templateId.value = event
            visible2.value = true;
            update.value = ''
        }

        function emitRecords() {
            store.dispatch("assignAllTemplates", '?referenceId='+props.userId+'&entityType='+props.entityType);

        }
        return {
            checked,
            visible2,
            showModal,
            templatEdit,
            handleChange2,
            update,
            clone,
            templateId,
            emitRecords,
            
        };
    },
};
</script>
