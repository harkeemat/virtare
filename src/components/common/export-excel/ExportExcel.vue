<template>
  <a-button class="primary-btn">
    {{ buttonTitle ? buttonTitle : $t("global.exportToExcel") }}
    <template #icon><DownloadOutlined /></template>
  </a-button>
</template>

<script>
import { defineComponent } from "vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components:{
    DownloadOutlined
  },
  props: {
    buttonTitle: String
  },
  setup() {
    return {

    };
  },
});
</script>