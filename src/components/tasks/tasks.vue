<template>
<a-layout-content>
    <div class="common-bg">
        <div class="tasks">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">
                        {{$t('tasks.tasks')}}
                        <div class="addtaskButton" v-if="arrayToObjact(screensPermissions,113)">
                            <!-- <Button :name="buttonName" @click="showModal({id:'',value:true})" /> -->
                            <ShowModalButton @click="showModal({id:'',value:true})" :buttonText="$t('tasks.addNewTask')" />
                        </div>
                        <div class="filter">
                            <button class="btn dashboardView" :class="toggle ? 'active' : ''" @click="toggleButton('dashboard')">
                                <span class="btn-content">{{$t('tasks.dashboardView')}}</span>
                            </button>
                            <button class="btn listView" :class="!toggle ? 'active' : ''" @click="toggleButton('list')">
                                <span class="btn-content">{{$t('global.listView')}}</span>
                            </button>
                        </div>
                    </h2>
                </a-col>
            </a-row>
            <!-- Dashboard View -->
            <div class="dashboard-view" v-show="toggle && dashboardView">
                <TasksDashboardView v-if="arrayToObjact(screensPermissions,109) && toggle && dashboardView" />
            </div>
            <!-- List View -->
            <div class="list-view" v-show="!toggle && listView">
                <TasksListView @isEdit="showModal($event)" v-if="listView" />
            </div>
        </div>
    </div>
</a-layout-content>
<TasksModal v-model:visible="visible" @saveTaskModal="handleOk($event)" :taskId="taskID" />
</template>
<script>
import TasksModal from "@/components/modals/TasksModal";
import { ref,computed, watchEffect, onMounted, onUnmounted, defineAsyncComponent } from "vue";
// import Button from "@/components/common/button/Button";
// import TasksDashboardView from "@/components/tasks/TasksDashboardView";
import TasksListView from "@/components/tasks/TasksListView";
import {useStore} from "vuex"
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
import { arrayToObjact } from "@/commonMethods/commonMethod";
import { useRoute, useRouter } from 'vue-router';
export default {
    components: {
        ShowModalButton,
        TasksModal,
        // Button,
        TasksDashboardView:defineAsyncComponent(()=>import('@/components/tasks/TasksDashboardView')),
        TasksListView,

    },
    setup() {
        const store = useStore();
        const router = useRouter()
        const route = useRoute()
        const toggle = ref(true);
        const visible = ref(false);
        const dashboardView = ref(true)
        const listView = ref(false)
        const taskID = ref(false);

        const showModal = (task) => {
            if (task.id) {
                store.dispatch('editTask', task.id)
                taskID.value = task.id.id
                visible.value = task.check;
            } else {
                taskID.value = false
                visible.value = true;
            }
        };
        const handleOk = (value) => {
            visible.value = value;

        };
        onMounted(()=>{
            store.state.tasks.task = ''
        })
        watchEffect(() => {

            if (route.query.view == 'list') {
                dashboardView.value = false
                listView.value = true
                toggle.value = false
            } else if (route.query.view == 'dashboard') {
                dashboardView.value = true
                listView.value = false
                toggle.value = true
                
            }
        })

        function toggleButton(val) {
            store.commit('taskRoute', val)
            localStorage.setItem('taskRoute', val)
            store.commit('loadingStatus', true)
            if (val == 'list') {
                router.replace({
                    query: {
                        view: 'list'
                    }
                });
                dashboardView.value = false
                listView.value = true
                toggle.value = false
            } else if (val == 'dashboard') {
                router.replace({
                    query: {
                        view: 'dashboard'
                    }
                });
                dashboardView.value = true
                listView.value = false
                toggle.value = true
            }

            setTimeout(() => {
                // toggle.value=!toggle.value
                store.commit('loadingStatus', false)
            }, 1000)
        }
        const tasks = computed(() => {
            return store.state.tasks
        })
        onUnmounted(()=>{
            store.state.tasks.task = ''
        })
        return {
            screensPermissions: store.getters.screensPermissions,
            tasks,
            arrayToObjact,
            toggleButton,
            taskID,
            toggle,
            visible,
            showModal,
            handleOk,
            dashboardView,
            listView,
        };
    },
};
</script>
