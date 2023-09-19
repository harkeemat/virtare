<template>
  <a-button type="primary" @click="showModal(true)">
    <template #icon><CommentOutlined /></template>
    {{ $t('communications.conversation') }}
  </a-button>

  <!-- Modal -->
  <CommunicationsModal v-model:visible="visible"  @is-visible="showModal" :isManual="true" :htmlHandler="false" :patientId="patientId" />
</template>

<script>
// import CommunicationsModal from "@/components/modals/CommunicationsModal";
import { defineComponent, ref,defineAsyncComponent } from "vue";
import {
  CommentOutlined
} from "@ant-design/icons-vue";
export default defineComponent({
  props:{
    patientId:{
      type:Object
    }
  },
  components: {
    CommentOutlined,
    CommunicationsModal:defineAsyncComponent(()=>import("@/components/modals/CommunicationsModal")),
  },
  setup() {
    const visible = ref(false);
    const showModal = (e) => {
      visible.value = e;
    };
    return {
      visible,
      showModal,
      
    }
  }
})
</script>