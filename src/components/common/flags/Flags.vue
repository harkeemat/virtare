<template>
  <a-tooltip placement="right">
    <template v-if="data && data?.name" #title>{{ data?.name }}</template>
    <template v-else-if="data && data?.flagName" #title>{{ data?.flagName }}</template>
    <template v-else-if="data && data?.flag" #title>{{ data?.flag }}</template>
    <!-- <span class="box" v-bind:style="{ backgroundColor: flag }" /> -->
    <span class="box" v-bind:style="data?.isBlackFlag ? { 'border': '2px solid #000000', 'padding': '4px', backgroundColor: flag} : { backgroundColor: flag }" />
  </a-tooltip>
</template>

<script>
export default {
  props: {
    flag: {
      type: String,
      required: true
    },
    data: {
      type: String,
      
    },
  },
}
</script>