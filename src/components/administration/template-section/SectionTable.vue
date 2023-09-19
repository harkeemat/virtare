<template>
<a-table class="sortIconTable" rowKey="id" :columns="columns" :data-source="data" :scroll="{ x: 900 }" @change="handleTableChange" :pagination=false>
    <template #question="text">
        <router-link to="question-template-detail">{{
                            text.text
                          }}</router-link>
    </template>
    <template #actions="{record}">
        <a-tooltip placement="bottom">
            <template #title>
                <span>Setting</span>
            </template>
            <a class="icons">
            <router-link :to="{ name: 'QuestionSectionDetail', params: { udid:record.id?record.id:'eyrer8758458958495'  }}">
                    <SettingTwoTone /></router-link></a>
        </a-tooltip>
        <a-tooltip placement="bottom">
            <template #title>
                <span>Edit</span>
            </template>
            <a class="icons" @click="editModal(record.id)">
                <EditOutlined /></a>
        </a-tooltip>
        <!-- <a-tooltip placement="bottom">
            <template #title>
                <span>Clone</span>
            </template>
            <a class="icons">
                <CopyOutlined /></a>
        </a-tooltip> -->
        <!-- <a-tooltip placement="bottom">
            <template #title>
                <span>Delete</span>
            </template>
            <a class="icons" @click="deleteModal(record.id)">
                <DeleteOutlined /></a>
        </a-tooltip> -->
    </template>
    <template #active="key">
        <a-switch v-model:checked="checked[key.record.key]" />
    </template>
</a-table>
<Loader/>
</template>
<script>
import {SettingTwoTone,EditOutlined} from "@ant-design/icons-vue"
import {useStore} from "vuex"
import Loader from "@/components/loader/Loader"
import {messages} from "@/config/messages";
import {warningSwal} from "@/commonMethods/commonMethod";
import { onMounted } from "vue"
const columns = [{
        title: "Section Name",
        dataIndex: "sectionName",

        slots: {
            customRender: "sectionName",
        },
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
        //DeleteOutlined,
        EditOutlined,
        //CopyOutlined,
        Loader,
        SettingTwoTone
    },
    props: {},
    setup(props, {
        emit
    }) {
        const store = useStore();
        const editModal = (id) => {
            store.dispatch('templateSectionDetailsList',id)
            emit("edit",{show:true,id:id});
        };
        const data = store.getters.questionnaireSection
        const meta = store.getters.questionnaireSectionMeta 
        let record = []
        let scroller = ""
        onMounted(() => {
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2
                if (currentScroll >= maxScroll) {
                    let current_page = meta.value.current_page + 1
                    if (current_page <= meta.value.total_pages) {
                        scroller = maxScroll;
                        meta.value = ""
                        record = data.value
                        store.dispatch("questionnaireTemplateSectionList", "?page=" + current_page + store.getters.searchTable.value +
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
            data.value = record;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50)
        }

        function deleteModal(id){
              warningSwal(messages.deleteWarning).then((response) => {
                if (response == true) {
                    var index = data.value.findIndex(function (o) {
                        return o.id === id;
                    })
                   store.dispatch('deleteQuestionnaireTemplate',id)
                    data.value.splice(index, 1)
                }
            })
            
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
                    "questionnaireTemplateList",
                    "?page=" + store.getters.searchTable.value + orderParam
                );
            } else {
                store.dispatch("orderTable", {
                    data: "&orderField=&orderBy=",
                });
                store.dispatch(
                    "questionnaireTemplateList",
                    "?page=" +
                    store.getters.searchTable.value +
                    store.getters.orderTable.value.data
                )
            }
        }
        return {
            columns,
            data,
            editModal,
            deleteModal,
            handleTableChange,
        };
    },
};
</script>
