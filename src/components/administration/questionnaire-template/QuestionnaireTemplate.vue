<template>
<div>
    <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle">
                    Questionnaire Template
                    <div class="commonBtn" v-if="arrayToObjact(screensPermissions, 425)">
                        <a-button type="primary"  @click="showModal({show:true,id:''})">Create New Template</a-button>
                    </div>
                </h2>
            </a-col>
            <a-col :span="12">
                <SearchField endPoint="questionnaireTemplate" class="mb-24" commit="questionnaire" loader="questionnaireLoadingStatus"/>
            </a-col>
            <a-col :span="24">
                <QuestionnaireTemplateTable @edit="showModal($event)" @clone="clone($event)" :colomns="columns" endPoint="questionnaireTemplateList" />

            </a-col>
        </a-row>
    </div>
</div>
<!--modals-->
<CreateTemplate v-model:visible="visible2" v-if="visible2" :update="update" @is-visible="showModal($event)" :cloneId="templateId"  :edit="edit"/>
<!---->
</template>

<script>
import CreateTemplate from "@/components/administration/questionnaire-template/modals/CreateTemplate";
import QuestionnaireTemplateTable from "@/components/administration/questionnaire-template/QuestionnaireTemplateTable";
import { ref, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
import { arrayToObjact} from "@/commonMethods/commonMethod";
const columns = [{
        title: "Template Name",
        dataIndex: "templateName",
        sorter: true,
        slots: {
            customRender: "templateName",
        },
    },
    {
        title: "Category Type",
        dataIndex: "templateType",
        sorter: true,
    },
     {
        title: "Template Type",
        dataIndex: "questionnaireType",
        sorter: true,
    },
    {
        title: "Actions",
        dataIndex: "actions",
        slots: {
            customRender: "actions",
        },
    },
];
export default {
    components: {
        CreateTemplate,
        QuestionnaireTemplateTable,
        SearchField,
    },
    setup() {
        const store = useStore();
        const checked = ref([false]);
        const visible2 = ref(false);
        const update = ref('');
        const templateId = ref('')
        const edit =ref(false)
        const showModal = (e) => {
            update.value = e.id;
            visible2.value = e.show;
            edit.value = e.id ? true : false
            templateId.value = ''
        };
        const templatEdit = (e) => {
             edit.value = true
            update.value = e.id;
           
            visible2.value = e.show;
        };

        
        onMounted(() => {
            store.dispatch("questionnaireTemplateList")
            store.dispatch("searchTable", "&search=");
            store.dispatch("orderTable", {
                data: "&orderField=&orderBy=",
            });
            
        });

        onUnmounted(() => {
            store.dispatch("searchTable", "&search=");
            store.dispatch("orderTable", {
                data: "&orderField=&orderBy=",
            });
            store.state.patients.errorMsg = "";
            store.state.common.successMsg = "";
        });

        const clone = (event) => {
            templateId.value = event
            edit.value = true
            visible2.value = true;
            update.value = ''
        }
        return {
            checked,
            visible2,
            showModal,
            templatEdit,
           
            update,
            clone,
            templateId,
            columns,
            edit,
            arrayToObjact,
            screensPermissions:store.getters.screensPermissions,
        };
    },
};
</script>
