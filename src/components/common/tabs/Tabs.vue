<template>
  <a-tab-pane :key="key" :tab="tab"></a-tab-pane>
</template>

<script>
export default {
  props: {
    key: {
      type: String,
      required: true
    },
    tab: {
      type: String,
      required: true
    },
  },
}
</script>