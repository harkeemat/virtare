<template>
  <a-modal width="95%" title="Time Logs Detail" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table class="sortIconTable" rowKey="id"  :columns="timeLogColumns" :data-source="timeLogsList" :scroll="{ x: 900 }" :pagination="false" >
        </a-table>
        <Loader/>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import {
  computed,
  defineComponent,
} from "vue";
import {
  // DeleteOutlined,
  // EditOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import {warningSwal} from "@/commonMethods/commonMethod"
import { messages } from '@/config/messages';
import { useRoute } from "vue-router";
import Loader from "../loader/Loader"

export default defineComponent({
  components: {
    Loader,
    // DeleteOutlined,
    // EditOutlined,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const patientId = route.params.udid;
    
    const timeLogColumns = [
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        /* slots: {
          customRender: 'category'
        } */
      },
      {
        title: "Logged By",
        dataIndex: "loggedBy",
        key: "loggedBy",
      },
      {
        title: "Performed By",
        dataIndex: "performedBy",
        key: "performedBy",
        sorter: {
          compare: (a, b) => a.performedBy - b.performedBy,
          multiple: 3,
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        sorter: {
          compare: (a, b) => a.date - b.date,
          multiple: 2,
        },
      },
      {
        title: "Time Amount",
        dataIndex: "timeAmount",
        key: "timeAmount",
        sorter: {
          compare: (a, b) => a.timeAmount - b.timeAmount,
          multiple: 2,
        },
      },
      {
        title: "CPT Code",
        dataIndex: "cptCode",
        key: "cptCode",
        sorter: {
          compare: (a, b) => a.cptCode - b.cptCode,
          multiple: 2,
        },
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        sorter: {
          compare: (a, b) => a.note - b.note,
          multiple: 2,
        },
      },
      /* {
        title: "Action",
        dataIndex: "action",
        slots: {
          customRender: "action",
        },
      }, */
    ];

    const timeLogsList =  computed(() => {
      return store.state.timeLogs.timeLogsList
    })

    const deleteTimeLog = (timeLogId) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteTimeLog', {patientId, timeLogId}).then(() => {
            store.dispatch('timeLogsList', {
              id: route.params.udid
            });
            store.dispatch('latestTimeLog', route.params.udid)
          });
        }
      })
    }

    // const editTimeLog = (udid) => {
    //   store.dispatch('timeLogDetails', udid)
    //   const timeLogDetails = computed(() => {
    //     return store.state.timeLogs.timeLogDetails;
    //   })
    //   emit('editTimeLog', timeLogDetails)
    // }

    return {
      timeLogColumns,
      timeLogsList,
      deleteTimeLog,
      // editTimeLog,
    };
  },
});
</script>
