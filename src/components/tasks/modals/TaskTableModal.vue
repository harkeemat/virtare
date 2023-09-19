<template>
<a-modal max-width="1140px" width="90%" title="Task List" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <TaskTable  :tasksListColumns="tasksListColumns" :dataList="dataList" ></TaskTable>
</a-modal>
</template>

<script>
import TaskTable from "@/components/tasks/TaskTable";
import { computed } from 'vue';
import {useStore} from "vuex";
const tasksListColumns = [{
        title: 'Priority ',
        dataIndex: 'priority',
        sorter: true

    },
    {
        title: 'Due Date ',
        dataIndex: 'dueDate',
        sorter: true,
        slots: {
            customRender: 'dueDate'
        }
    },
    {
        title: 'Title',
        dataIndex: 'title',
        sorter: true,
        slots: {
            customRender: 'taskName'
        }
    },
    {
        title: 'Status ',
        dataIndex: 'taskStatus',
        sorter: true,
        slots: {
            customRender: 'status'
        }
    },

    {
        title: 'Category',
        dataIndex: 'category',
        sorter: true,
        slots: {
            customRender: 'category'
        }
    },
    {
        title: 'Assigned By',
        dataIndex: 'assignedBy',
        sorter: true,
        slots: {
            customRender: 'assignedBy'
        }
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        slots: {
            customRender: 'action'
        }
    }
];
export default {
    components: {
        TaskTable
    },

    setup() {
        const store = useStore()
        
        const dataList = computed(()=>{
            return store.state.tasks.showTaskModalData
        })
        return {
            dataList,
            tasksListColumns,
        }
    }
}
</script>

<style>

</style>
