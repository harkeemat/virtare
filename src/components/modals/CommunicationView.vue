<template>
  <a-modal width="50%" title="Call Details" :footer="false" centered>
		<CallsTable />
	</a-modal>
</template>

<script>
import CallsTable from "@/components/communications/tables/CallsTable";

export default {
  components: {
    CallsTable
  }
}
</script>