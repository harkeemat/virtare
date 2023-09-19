<template>
  <a-col :span="8" >
    <div class="moreAction" @click="showData">
      <div class="moreActionImg green">
        <FilePdfOutlined />
      </div>
      <p :class="isBold == true ? 'bold' : ''">Document(s)</p>
    </div>
  </a-col>
</template>

<script>
// import { reactive } from 'vue-demi';
// import { useStore } from 'vuex';
import {
  FilePdfOutlined,
} from "@ant-design/icons-vue";
export default {
  components: {
    FilePdfOutlined,
  },
  props: {
    isBold: {
      type: Boolean
    },
    patientId: {
      type: Number
    },
  },
  setup(props, { emit }) {
    // const store = useStore()
    // const patientUdid = reactive(props.patientId)
    const showData = () => {
      // store.dispatch("patientDocuments", patientUdid);
      emit('onClick')
    };

    return {
      showData,
    }
  }
}
</script>

<style scoped>
.anticon {
  color: #ffffff;
  font-size: 20px !important;
  position: relative !important;
  top: -2px !important;
}
</style>