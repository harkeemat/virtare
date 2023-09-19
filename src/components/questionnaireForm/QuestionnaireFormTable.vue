<template>
<a-table class="sortIconTable" rowKey="id" :columns="columns" :data-source="data" @change="handleTableChange" :scroll="{ y:tableYScroller }" :pagination=false>
    <template #templateName="text">
        <router-link :to="{ name: 'QuestionTemplateDetail', params: { udid:text.record.id?text.record.questionnaireTemplateId:'eyrer8758458958495'  }}">
            {{
                                text.text
                              }}</router-link>

    </template>
    <template #fillUpUser="text">
        <router-link v-if="text.record.entity=='Patient' && text.text" :to="{ name: 'PatientSummary', params: { udid:text.record.fillUpUserId?text.record.fillUpUserId:'eyrer8758458958495'  }}">
            {{ text.text  }}</router-link>
        <a v-if="text.record.entity=='Patient' && text.record.fillUpUserId" @click="showPatientModal(text.record.fillUpUserId)" class="nameInfoIcon">
            <InfoCircleOutlined /></a>
        <router-link v-if="text.record.entity=='Staff' && text.text" :to="{ name: 'CoordinatorSummary', params: { udid:text.record.fillUpUserId?text.record.fillUpUserId:'eyrer8758458958495'  }}">
            {{ text.text    }}</router-link>
        <a v-if="text.record.entity=='Staff' && text.record.fillUpUserId" @click="showStaffModal(text.record.fillUpUserId)" class="nameInfoIcon">
            <InfoCircleOutlined /></a>

    </template>
    <template #assignTo="text">

        <router-link v-if="text.record.assignToEntityType=='Patient' && text.text" :to="{ name: 'PatientSummary', params: { udid:text.record.assignToId?text.record.assignToId:'eyrer8758458958495'  }}">
            {{ text.text  }}</router-link>
        <a v-if="text.record.entity=='Patient'&& text.record.assignToId" @click="showPatientModal(text.record.assignToId)" class="nameInfoIcon">
            <InfoCircleOutlined /></a>
        <router-link v-if="text.record.assignToEntityType=='Staff' && text.text" :to="{ name: 'CoordinatorSummary', params: { udid:text.record.assignToId?text.record.assignToId:'eyrer8758458958495'  }}">
            {{ text.text    }}</router-link>
        <a v-if="text.record.entity=='Staff' && text.record.assignToId" @click="showStaffModal(text.record.assignToId)" class="nameInfoIcon">
            <InfoCircleOutlined /></a>

    </template>
    <template #score="{ record }">

        <a v-if="record.score"><span v-if="record?.score.length>0" @click="getResponse(record.score)">{{record?.score[0]?.program}} {{': '+ record?.score[0]?.score}} </span></a>
        <a v-else><span>N/A</span></a>
    </template>
    <template #actions="{record}">

        <!-- <a-tooltip placement="bottom">
                <template #title>
                    <span>Assign Section</span>
                </template>
                <a class="icons">
                 
                        <DiffTwoTone @click="assignSection(record.id)"/></a>
            </a-tooltip> -->
        <!-- <a-tooltip placement="bottom">
                <template #title>
                    <span>Setting</span>
                </template>
                <a class="icons">
                <router-link :to="{ name: 'QuestionTemplateDetail', params: { udid:record.id?record.id:'eyrer8758458958495'  }}">
                        <SettingTwoTone /></router-link></a>
            </a-tooltip> -->
        <!-- <a-tooltip placement="bottom">
                <template #title>
                    <span>Edit</span>
                </template>
                <a class="icons" >
                    <EditOutlined @click="editModal(record.id)"/></a>
            </a-tooltip> -->
        <!-- <a-tooltip placement="bottom">
                <template #title>
                    <span>Create Url</span>
                </template>
                <a class="icons">
                
                        <SendOutlined  @click="getResponse(record.id)"/></a>
            </a-tooltip> -->

        <a-tooltip placement="bottom" v-if="viewShow">
            <template #title>
                <span>Response View</span>
            </template>
            <a class="icons">
                <router-link :to="{ name: 'QuestionnaireResponse', params: { udid:record.clientQuestionnaireAssignId?record.clientQuestionnaireAssignId:'eyrer8758458958495'  }}">

                    <EyeTwoTone @click="userNameSet(record)" />
                </router-link>
            </a>
        </a-tooltip>
        <!-- <a-tooltip placement="bottom">
                <template #title>
                    <span>View Score</span>
                </template>
                <a class="icons" @click="getResponse(record.questionnaireTempleteId)">
                    
                    <FundViewOutlined  /></a>
            </a-tooltip> -->
    </template>
    <template #active="key">
        <a-switch v-model:checked="checked[key.record.key]" />
    </template>
</a-table>

<QuestionnaireLoader />

<Score v-model:visible="visibleModal" title="Response Score" />
</template>
<script>
import { EyeTwoTone, InfoCircleOutlined } from "@ant-design/icons-vue"
import { useStore } from "vuex"
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader"
//import CommonLoader from "@/components/loader/CommonLoader";
import Score from "@/components/questionnaireForm/modals/ScoreModal"
import { showPatientModal, showStaffModal,tableYScroller } from "@/commonMethods/commonMethod";
import { onMounted, ref } from "vue"
const columns2 = [{
    title: "Programs",
    dataIndex: "program",

},
{
    title: "Score",
    dataIndex: "score",
},

];
const columns = [{
    title: "Questionnaire Name",
    dataIndex: "templateName",

    slots: {
        customRender: "templateName",
    },
},
{
    title: "Assign To",
    dataIndex: "assignTo",
    slots: {
        customRender: "assignTo",
    },
},
{
    title: "Fiiled By",
    dataIndex: "fillUpUser",
    slots: {
        customRender: "fillUpUser",
    },
},
{
    title: "Status",
    dataIndex: "status",

},
{
    title: "Score",
    dataIndex: "templateName",
    slots: {
        customRender: "score",
    },
},

{
    title: "Filled Date",
    dataIndex: "createdAt",

},

{
    title: "Type",
    dataIndex: "templateType",
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
    emits: ["edit"],
    components: {
        EyeTwoTone,
        QuestionnaireLoader,
        // CommonLoader,
        InfoCircleOutlined,
        Score

    },
    props: {
        viewShow: Boolean
    },
    setup() {
        const store = useStore();

        const visible = ref(false)
        const data = store.getters.questionnaireResponse
        const meta = store.getters.questionnaireResponseMeta
        let record = []
        let scroller = ""
        onMounted(() => {

            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {

                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 1

                if (currentScroll >= maxScroll) {

                    let current_page = meta.value?.current_page + 1
                    if (current_page <= meta.value?.total_pages) {
                        scroller = maxScroll;
                        meta.value = ""
                        record = data.value
                        store.dispatch("questionnaireResponse", "?page=" + current_page + store.getters.searchTable.value +
                            store.getters.orderTable.value.data).then(() => {
                                loadMoredata()
                            });
                    }
                }
            });
        });

        function loadMoredata() {

            const newData = data.value
            newData.forEach((element) => {
                record.push(element)
            });
            store.state.questionnaireTemplate.questionnaireResponse = record
            //data.value = record;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent?.scrollTo(0, scroller);
            }, 50)
        }

        const handleTableChange = (pag, filters, sorter) => {
            if (sorter.order) {
                let order = sorter.order == "ascend" ? "ASC" : "DESC";
                let orderParam = "&orderField=" + sorter.field + "&orderBy=" + order;
                store.dispatch("orderTable", {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters,
                });
                store.dispatch(
                    "questionnaireResponse",
                    "?page=" + store.getters.searchTable.value + orderParam
                );
            } else {
                store.dispatch("orderTable", {
                    data: "&orderField=&orderBy=",
                });
                store.dispatch(
                    "questionnaireResponse",
                    "?page=" +
                    store.getters.searchTable.value +
                    store.getters.orderTable.value.data
                )
            }
        }
        const visibleModal = ref(false)
        const templateId = ref(false)
        const getResponse = (data) => {
            visibleModal.value = true
            store.commit("scoreCount", data)
        }

        const showSection = (e) => {

            visible.value = e.show
        }

        function userNameSet(e) {

            localStorage.setItem("responseusername", JSON.stringify(e.userName));

        }
        return {
            visibleModal,
            columns,
            data,
            getResponse,

            handleTableChange,
            visible,
            templateId,
            showSection,
            columns2,
            scoreData: store.getters.scoreCount,
            userNameSet,
            showPatientModal,
            showStaffModal,
            tableYScroller


        };
    },
};
</script>

