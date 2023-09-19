<template>
  <a-tab-pane :key="1" :tab="tab">
    <PopulateWaitingRoomTable  :colomnsRecord="columns" :dataRecord="dataSource" :pagination="false" />
  </a-tab-pane>
</template>

<script>
// import { useRouter } from "vue-router";
import { reactive } from "vue"
import PopulateWaitingRoomTable from "@/components/communications/tables/PopulateWaitingRoomTable";
export default {
  props: {
    
    tab: {
      type: String,
      required: true
    },
    column: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    
  },
  components: {
    PopulateWaitingRoomTable,
  },

  setup(props) {
    
    const columns=reactive(props.column)
    const dataSource= reactive(props.data)
    // const router = useRouter();

    return {
      columns,
      
      dataSource,
    }
  },
}
</script>