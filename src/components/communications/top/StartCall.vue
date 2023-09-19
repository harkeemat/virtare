<template>
  <!-- <router-link to="video-call"> -->
    <a-button type="primary">
      <template #icon><VideoCameraOutlined /></template>
      {{ $t('communications.startCall') }}
    </a-button>
  <!-- </router-link> -->
</template>
<script>
import { defineComponent } from 'vue'
import {
  VideoCameraOutlined
} from "@ant-design/icons-vue";
export default defineComponent({
  components:{
    VideoCameraOutlined
  },
  setup() {
    
  },
})
</script>
