<template>
<a-card v-if="title" class="common-card">
    <template #title>
        {{ title }}
    </template>
    <apexchart :type="type" :height="height" :options="option" :series="seriesData" @click="clickHandler4"></apexchart>
    <template #extra v-if="show">
        <a class="ant-dropdown-link" @click="eventClick({event:'remove'})">
            <CloseOutlined style="font-size:19px;cursor: pointer;" />
        </a>
    </template>
</a-card>
<apexchart v-else :type="type" :height="height" :options="option" :series="seriesData" @click="clickHandler4">
</apexchart>
</template>
<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { CloseOutlined } from '@ant-design/icons-vue';
import {  reactive, watchEffect } from 'vue-demi';
export default {
    components: {
        CloseOutlined,
    },
    props: {
        data: {
            type: Array,
        },
        linkTo: {
            type: String,
        },
        title: {
            type: String,
        },
        type: {
            type: String,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
        series: {
            type: Array,
            required: true,
        },
        listView: {
            type: String,
        },
        show:Boolean,
        dateTimeLineId:Number,
    },

    setup(props,{emit}) {
        const router = useRouter();
        const store = useStore();
        const option=reactive(props.options)
        const seriesData = reactive(props.series)
        const chartValue = reactive({
            chartType:'',
            bar:[]
        })
        watchEffect(()=>{
            chartValue.chartType = props.type
        })
        function clickHandler4(event, chartContext, config) {
            store.commit("staffSummary", null);
            let filter = "";
            if (props.linkTo) {
                if (
                    props.type == "bar" &&
                    config.globals.labels[config.dataPointIndex] != undefined
                ) {
                    if (props.data) {
                        
                        filter = props.data[config.dataPointIndex].id;
                        //store.commit("filter", props.data[config.dataPointIndex].id)
                    } else {
                        filter = config.globals.labels[config.dataPointIndex];
                        //store.commit("filter", config.globals.labels[config.dataPointIndex])
                    }
                    if (props.listView) {
                        router.push({
                            name: props.linkTo,
                            query: {
                                view: props.listView,
                                fromDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.fromDate
                                    : "",
                                toDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.toDate
                                    : "",
                                filter: config.globals.lastXAxis.ids
                                    ? config.globals.lastXAxis.ids[config.dataPointIndex]
                                    : filter,
                                    timelineId:props.dateTimeLineId
                            },
                        });
                    } else {
                        router.push({
                            name: props.linkTo,
                            query: {
                                fromDate: store.getters.dateFilter.value.fromDate,
                                toDate: store.getters.dateFilter.value.toDate,
                                filter: filter,
                                timelineId:props.dateTimeLineId
                            },
                        });
                    }
                } else if (props.type == "area") {
                    if (props.data) {
                        

                        router.push({
                            name: props.linkTo,
                            query: {
                                view: props.listView ? props.listView : "",
                                fromDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.fromDate
                                    : props.data[config.globals.labels[config.dataPointIndex] - 1]
                                        ? props.data[config.globals.labels[config.dataPointIndex] - 1]
                                            .from
                                        : "",
                                toDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.toDate
                                    : props.data[config.globals.labels[config.dataPointIndex] - 1]
                                        ? props.data[config.globals.labels[config.dataPointIndex] - 1]
                                            .today
                                        : "",
                                filter: config.globals.seriesNames[config.seriesIndex],
                                timelineId:props.dateTimeLineId
                            },
                        });
                    } else {
                        router.push({
                            name: props.linkTo,
                            query: {
                                view: props.listView ? props.listView : "",
                                fromDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.fromDate
                                    : "",
                                toDate: store.getters.dateFilter.value
                                    ? store.getters.dateFilter.value.toDate
                                    : "",
                                filter: config.globals.seriesNames[config.seriesIndex],
                                timelineId:props.dateTimeLineId
                            },
                        });
                    }

                   
                } else if (props.type == "pie") {
                    if (props.listView) {
                        config.globals.selectedDataPoints.map((item) => {
                            router.push({
                                name: props.linkTo,
                                query: {
                                    view: props.listView,
                                    fromDate: store.getters.dateFilter.value
                                        ? store.getters.dateFilter.value.fromDate
                                        : "",
                                    toDate: store.getters.dateFilter.value
                                        ? store.getters.dateFilter.value.toDate
                                        : "",
                                    filter: config.globals.labels[item],
                                    timelineId:props.dateTimeLineId
                                },
                            });
                        });
                    } else {
                        config.globals.selectedDataPoints.map((item) => {
                            router.push({
                                name: props.linkTo,
                                query: {
                                    fromDate: store.getters.dateFilter.value
                                        ? store.getters.dateFilter.value.fromDate
                                        : "",
                                    toDate: store.getters.dateFilter.value
                                        ? store.getters.dateFilter.value.toDate
                                        : "",
                                    filter: config.globals.labels[item],
                                    timelineId:props.dateTimeLineId
                                },
                            });
                        });
                    }
                }
            } 
        }
        const eventClick =(event) =>{
              emit("actionClick",event)
        }
        const chartValueGet = () =>{
            eventClick({event:"charttype",value:chartValue.chartType})
        }
        const barRecord = () =>{
            eventClick({event:"barRecord",value:chartValue.bar})
        }
        return {
            clickHandler4,
            eventClick,
            chartValueGet,
            chartValue,
            barRecord,
            option,
            seriesData
            
        };
    },
};
</script>
