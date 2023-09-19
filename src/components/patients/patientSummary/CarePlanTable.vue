<template>
  <a-table class="sortIconTable" rowKey="id" :columns="carePlanColumns" :data-source="carePlansList" :pagination="false" @change="onChange">
    <template #frequency="{record}">
      <span>{{ record.frequency }} / {{ record.frequencyType }}</span>
    </template>
    <template #actions="{record}">
      <a-tooltip placement="bottom">
        <template #title>
          <span>Delete</span>
        </template>
        <a class="icons"> <DeleteOutlined @click="deleteCarePlan(record.id)" /></a>
      </a-tooltip>
    </template>
  </a-table>
</template>

<script>
import {
  DeleteOutlined,
  // EditOutlined,
} from "@ant-design/icons-vue";
import { useStore } from 'vuex';
import { computed } from 'vue-demi';
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from '@/config/messages';
import { useRoute } from 'vue-router';
export default {
  components: {
    DeleteOutlined,
    // EditOutlined,
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const carePlansList = computed(() => {
      return store.state.carePlan.carePlansList
    })

    const deleteCarePlan = (carePlanId) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteCarePlan', {
            patientId: route.params.udid,
            carePlanId: carePlanId
          }).then(() => {
            store.dispatch('carePlansList', route.params.udid)
          })
        }
      })
    }

    const carePlanColumns = [
      {
        title: "Device",
        dataIndex: "deviceType",
      },
      {
        title: "Vital type",
        dataIndex: "vitalField",
      },
      {
        title: "Start date",
        dataIndex: "startDate",
      },
      {
        title: "End date",
        dataIndex: "endDate",
      },
      {
        title: "Frequency",
        dataIndex: "frequency",
        slots: {
          customRender: "frequency",
        }
      },
      {
        title: "High Value",
        dataIndex: "highValue",
      },
      {
        title: "Low Value",
        dataIndex: "lowValue",
      },
      {
        title: "Note",
        dataIndex: "note",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      },
    ];

    return {
      carePlanColumns,
      carePlansList,
      deleteCarePlan,
    }
  }
}
</script>