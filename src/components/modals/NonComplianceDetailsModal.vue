<template>
  <a-modal width="80%" title="Non Compliance Details" centered>
    <!-- {{nonComplianceDetails}} -->
    <a-table class="sortIconTable" rowKey="id" :columns="nonComplianceColumns" :data-source="nonComplianceDetails" :pagination="false">
      <template #flag="{record}">
        <Flags :flag="record.flag"/>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { computed } from 'vue-demi'
import { useStore } from 'vuex'
import Flags from "@/components/common/flags/Flags";

export default {
  components: {
    Flags
  },
  setup() {
    const store = useStore()
    
    const nonComplianceDetails = computed(() => {
      return store.state.patients.nonComplianceDetails
    })

    const nonComplianceColumns = [
      {
        title: "Device Type",
        dataIndex: "deviceType",
        key: "deviceType",
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Flag",
        dataIndex: "flag",
        key: "flag",
        className: "flag",
        slots: {
          customRender: "flag",
        },
      },
    ]

    return {
      nonComplianceColumns,
      nonComplianceDetails,
    }
  }
}
</script>