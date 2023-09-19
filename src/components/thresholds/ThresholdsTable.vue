<template>
<a-col :sm="24" :xs="24">
    <a-table rowKey="id" :columns="columns" :data-source="meta.vitalList" :pagination="false" @change="handleTableChange" :scroll="{ y:'calc(100vh - 290px)'}">
        <template #actions="text">
            <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,330)">
                <template #title>
                    <span>{{ $t("global.edit") }}</span>
                </template>
                <a class="icons" @click="editParameter(text.record)">
                    <EditOutlined />
                </a>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,331)">
                <template #title>
                    <span>{{ $t("global.delete") }}</span>
                </template>
                <a class="icons" @click="deleteParameter(text.record)">
                    <DeleteOutlined />
                </a>
            </a-tooltip>
        </template>
        <template #active="key" >
            <a-switch v-model:checked="checked[key.record.key]" :disabled="!arrayToObjact(screensPermissions,330)"/>
        </template>
    </a-table>
</a-col>
</template>

<script>
import {
    onMounted
} from "vue";
import {
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons-vue";
import {
    warningSwal,
    
    arrayToObjact,
    tableYScroller
} from "@/commonMethods/commonMethod";
import {
    messages
} from "@/config/messages";
import {
    useStore
} from "vuex";
export default {
    components: {
        DeleteOutlined,
        EditOutlined
    },
    props: {},
    setup(props, {
        emit
    }) {
        const store = useStore();

        const renderContent = ({
            text
        }) => {
            const obj = {
                children: text,
                props: {
                    colSpan: null,
                },
            };

            return obj;
        };

        function editParameter(getRecord) {
            store.dispatch("generalParameterEdit", getRecord.generalparameterId);
            emit("is-edit", {
                check: true,
                id: getRecord.generalparameterId,
            });
        }

        function deleteParameter(id) {
            warningSwal(messages.deleteWarning).then((response) => {
                if (response == true) {
                    store.dispatch("generalParameterDelete", id.id);
                    setTimeout(() => {
                        store.getters.vitalDataGetters.value.vitalList = "";
                        store.dispatch("generalParameterList");
                    }, 2000);
                }
            });
        }
        const columns = [{
                title: "General Parameters Group",
                dataIndex: "generalParameterGroup",
                sorter: true,
                width: '30%',
                customRender: ({
                    index
                }) => {
                    const obj = {
                        children: meta.vitalList[index].generalParameterGroup,
                        props: {},
                    };

                    obj.props.rowSpan = meta.vitalList[index].data;
                    return obj;
                },
            },
            {
                title: "Device Type",
                dataIndex: "deviceType",
                sorter: true,
                width: '25%',
                customRender: ({
                    index
                }) => {
                    const obj = {
                        children: meta.vitalList[index].deviceType,
                        props: {},
                    };

                    obj.props.rowSpan = meta.vitalList[index].data;
                    return obj;
                },
            },
            {
                title: "Type",
                dataIndex: "vitalFieldName",
                sorter: true,
                customRender: renderContent,
            },
            {
                title: "High Limit ",
                dataIndex: "highLimit",
align: 'right',
                customRender: renderContent,
            },
            {
                title: "Low Limit ",
                dataIndex: "lowLimit",
align: 'right',
                customRender: renderContent,
            },

            {
                title: "Actions",
                dataIndex: "actions",
                slots: {
                    customRender: "actions",
                },
            },
        ];

        const meta = store.getters.vitalDataGetters.value;
        let data = [];
        
        let scroller = "";
        onMounted(() => {
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2;
                if (currentScroll >= maxScroll) {
                    let current_page = meta.generalParameterMeta.current_page + 1;

                    if (current_page <= meta.generalParameterMeta.total_pages) {
                       scroller = maxScroll;
                        data = meta.vitalList;
                        store.state.thresholds.generalParameterMeta = "";
                        store.state.thresholds.vitalList = "";

                        store
                            .dispatch(
                                "generalParameterList",
                                "?page=" + current_page + store.getters.searchTable.value + store.getters.orderTable.value.data
                            )
                            .then(() => {
                                loadMoredata();
                            });
                    }
                }
            });
        });

        function loadMoredata() {
            const newData = meta.vitalList;
            newData.forEach((element) => {
                data.push(element);
            });
            meta.vitalList = data;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50);
            
        }
        const handleTableChange = (pag, filters, sorter) => {
            if (sorter.order) {
                let order = sorter.order == 'ascend' ? 'ASC' : 'DESC'
                let orderParam = '&orderField=' + sorter.field + '&orderBy=' + order
                store.dispatch('orderTable', {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters
                })
                store.dispatch("generalParameterList", "?page=" + store.getters.searchTable.value + orderParam)

            } else {
                store.dispatch('orderTable', {
                    data: '&orderField=&orderBy='
                })
                store.dispatch("generalParameterList", "?page=" + store.getters.searchTable.value + store.getters.orderTable.value.data)
            }
        }

        
        return {
            screensPermissions:store.getters.screensPermissions,
            arrayToObjact,
            deleteParameter,
            editParameter,
            meta,
            columns,
            tableYScroller,
            handleTableChange
        };
    },
};
</script>

<style>
.common-card {
    min-height: 335px !important;
}
</style>
