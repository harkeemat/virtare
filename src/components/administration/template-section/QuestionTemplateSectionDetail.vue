<template>
<div class="common-bg">
    <div class="questionnaireMain">
        <!-- <a-row :gutter="24">
            <a-col :span="24">
                <h2 class="pageTittle">

                    {{ templateDetailsList ? templateDetailsList.sectionName : ''}}
                    <div class="commonBtn">
                        <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal2(true)">Search Question</a-button>
                        <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal({show:true,id:''})">Add Question
                            <PlusOutlined />
                        </a-button>
                        <router-link to="/template-section" class="b-inline ml-10">
                            <a-button class="btn primaryBtn">Back</a-button>
                        </router-link>
                    </div>
                </h2>
            </a-col> -->
            <a-row :gutter="24">
            <a-col :span="24" >
                <h2 class="pageTittle">

                    <span class="title">{{ templateDetailsList ? templateDetailsList.sectionName : ''}}</span>
                    <div class="commonBtn">
                        <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal2(true)">Search Question</a-button>
                        <!-- <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal2(true)">Search Section</a-button> -->
                        
                        <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal({show:true,id:''})">Add Question
                            <PlusOutlined />
                        </a-button>
                        <router-link to="/template-section" class="b-inline ml-10">
                            <a-button class="btn primaryBtn">Back</a-button>
                        </router-link>
                    </div>
                </h2>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="24" v-if="templateDetailsList">
               
                <Question v-if="templateDetailsList" :question="templateDetailsList" :edit="false" temOrSection="section" type="multipale"/>

            </a-col>
            
        </a-row>

    </div>
    <!--modals-->
    <AddQuestionnaire v-model:visible="visible2" @is-visible="showModal($event)" :templateId="udid" temOrSection="section" :name="templateDetailsList ? templateDetailsList.sectionName : ''" />
    <EditQuestionnaire v-model:visible="visible3" />
    <SearchQuestion v-if="visible1" v-model:visible="visible1" :templaterecord="templateDetailsList" @is-visible-exist="showModal2($event)" temOrSection="section"  />
    <!---->
</div>
<TableLoader />
</template>

<script>
  import { defineComponent, ref,onMounted,onUnmounted } from "vue"
  import { PlusOutlined } from "@ant-design/icons-vue"
  import AddQuestionnaire from "@/components/administration/questionnaire-bank/modals/AddQuestionnaire"
  import EditQuestionnaire from "@/components/modals/EditQuestionnaire"
  import SearchQuestion from "@/components/administration/questionnaire-template/modals/SearchQuestion"
  import Question from "@/components/administration/questionnaire-bank/common/Question"
  import TableLoader from "@/components/loader/TableLoader"
  import { useStore  } from "vuex"
  import { useRoute  } from 'vue-router'
export default defineComponent({
    name: "Question Section Details",
    components: {

        AddQuestionnaire,
        EditQuestionnaire,
        SearchQuestion,
        PlusOutlined,
        Question,
        TableLoader
    },
    setup() {
        const store = useStore()
        const route = useRoute()
        const udid = route.params.udid

        const visible2 = ref(false)
        const id = ref("");
        const showModal = (e) => {
            visible2.value = e.show;
            id.value = e.id;

        }
        const visible3 = ref(false)
        const showModal1 = () => {
            visible3.value = true
        };
        const visible1 = ref(false)
        const showModal2 = (e) => {
            store.dispatch("questionnaireList")
            visible1.value = e;
        };

        onMounted(() => {
            store.dispatch("templateSectionDetailsList", udid)
            //store.dispatch("templateDetailsList", udid)
            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
        })

        onUnmounted(() => {
            store.dispatch("searchTable", '&search=')
            store.dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
        })
        return {

            visible2,
            showModal,
            visible3,
            showModal1,
            visible1,
            showModal2,
            udid,
            templateDetailsList: store.getters.sectionDetailsList,
            value: ref(1),
            value2: ref(1)
        };
    },
});
</script>

<style lang="scss" scoped>
.healthTemplateBox {
    padding: 15px;
    border-radius: 5px;
    border: 1px solid #e3e3e3;
    margin: 0 0 20px;

    h4 {
        margin: 0 0 10px;
    }
}
.pageTittle {
    display: flex;
    align-items: center;
    span.title {
        display: inline-block;
        width: 40%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .commonBtn {
        position: initial;
        width: 60%;
        display: inline-flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
        .ant-btn {
            display: inline-flex;
            .anticon {
                margin-top: 1px;
            }
        }
    }
}
</style>
