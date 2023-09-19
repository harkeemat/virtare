<template>
<a-row class="mb-24" :gutter="24" >
    <a-col :xl="6" :sm="8" :xs="12" v-for="status in tasks.taskStatus" :key="status.id">
        <FilterCard :filterCount="CompletedTasksFilterCount" :count="status.total ? status.total : 0" :color="status.color" class="blockLists five" :heading="status.text" @click="linkOpen(status.text)"/>
    </a-col>
</a-row>
<a-row :gutter="24" >
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="Task Priority" class="common-card grapCardWrap">
            <IncompleteTasksFilter />
            <ApexChart type="bar" :height="250" v-if="tasks.taskPriority" :options="tasks.taskPriority.optionPriority" :series="tasks.taskPriority.seriesPriority" :linkTo="arrayToObjact(screensPermissions,113)?'Tasks':''" listView="list" @click="updateRecords"/>
        </a-card>
    </a-col>
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="Team Member" class="common-card grapCardWrap">
            <TeamMemberFilter />
            <ApexChart type="bar" :height="250" v-if="tasks.taskTeamMember" :options="tasks.taskTeamMember.optionTeamMember" :series="tasks.taskTeamMember.seriesTeamMember" />
        </a-card>
    </a-col>
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="Task Completion" class="common-card grapCardWrap">
            <ApexChart type="area" v-if="tasks.completionOptions" :height="275" :options="tasks.completionOptions" :series="tasks.completionSeries" :linkTo="arrayToObjact(screensPermissions,113)?'Tasks':''" listView="list" @click="updateRecords" :data="taskComplete"/>
        </a-card>
    </a-col>
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="All Tasks" class="common-card grapCardWrap">
            <AllTasksFilter />
            <ApexChart type="pie" v-if="tasks.completedAllTask" :height="275" :options="tasks.completedAllTask" :series="tasks.incompleteAllTask" :linkTo="arrayToObjact(screensPermissions,113)?'Tasks':''" listView="list" @click="updateRecords"/>
        </a-card>
    </a-col>
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="Category View" class="common-card grapCardWrap">
            <CategoryViewFilter />
            <ApexChart type="pie" v-if="tasks.taskCategory.premium" :height="275" :options="tasks.taskCategory.premium" :series="tasks.taskCategory.business" :linkTo="arrayToObjact(screensPermissions,113)?'Tasks':''" listView="list" @click="updateRecords"/>
        </a-card>
    </a-col>
    <a-col :xl="8" :sm="12" :xs="24">
        <a-card title="Completion Rate" class="common-card grapCardWrap completionRate">
            <div>
                <h4>{{ tasks.completeTaskRate }}%</h4>
                <p>Sum of Completion Rate</p>
            </div>
        </a-card>
    </a-col>
</a-row>
<Loader />
</template>

<script>
import {
    ref,
    watchEffect,
    computed
} from "vue";
import FilterCard from "@/components/common/cards/FilterCard";
import ApexChart from "@/components/common/charts/ApexChart";
import IncompleteTasksFilter from "@/components/tasks/chartFilters/IncompleteTasks";
import TeamMemberFilter from "@/components/tasks/chartFilters/TeamMember";
import AllTasksFilter from "@/components/tasks/chartFilters/AllTasks";
import CategoryViewFilter from "@/components/tasks/chartFilters/CategoryView";
import Loader from "@/components/loader/Loader";
import {
    useStore
} from "vuex";
import {
    arrayToObjact
} from "@/commonMethods/commonMethod";
import {  useRoute, useRouter } from 'vue-router';
export default {
    components: {
        FilterCard,
        ApexChart,
        IncompleteTasksFilter,
        TeamMemberFilter,
        AllTasksFilter,
        CategoryViewFilter,
        Loader
    },
    setup() {
        const store = useStore();
        const toggle = ref(true);
        const router = useRouter()
        
        function clickHandler() {
            toggle.value = false;
        }

        function clickHandler2() {
            toggle.value = false;
        }

        watchEffect(() => {
            store.dispatch("allTaskStatus");
            store.dispatch("taskStatus");
            store.dispatch("taskPriority");
            store.dispatch("taskTeamMember");
            store.dispatch("taskCategory");
            store.dispatch("completeTaskRate");
        });

        const CompletedTasksFilterCount = [{
                key: 0,
                text: "Urgent",
                link: "http://www.alipay.com/",
            },
            {
                key: 1,
                text: "2nd Menu Item",
                link: "http://www.taobao.com/",
            },
        ];

        const tasks = computed(() => {
            return store.state.tasks;
        });

        function linkOpen(name) {
            store.dispatch("tasksList", '?filter=' + name)
            router.replace({
                query: {
                    view: 'list',
                    filter:name
                }
            });
        }
        const route = useRoute()
    const updateRecords =() =>{
        setTimeout(()=>{

        
if (route.query.filter || route.query.fromDate) {
                
                let filter = route.query.filter ? route.query.filter : ''
                

                let date = store.getters.otherFilters.value ? store.getters.otherFilters.value : route.query.fromDate && route.query.toDate ? "&fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate : "&fromDate=&toDate="
                store.dispatch("tasksList", "?filter=" + filter + date + store.getters.orderTable.value.data);
            } else {

                store.dispatch("tasksList")
            }
            },100)
    }
        return {
            screensPermissions: store.getters.screensPermissions,
            arrayToObjact,
            tasks,
            clickHandler,
            clickHandler2,
            toggle,
            CompletedTasksFilterCount,
            linkOpen,
            updateRecords,
            taskComplete:store.getters.taskComplete
        };
    },
};
</script>
