<template>
  <a-col :span="8" >
    <div class="moreAction" @click="showData">
      <div class="moreActionImg yellowBgColor">
        <FieldTimeOutlined />
      </div>
      <p :class="isBold == true ? 'bold' : ''">Timeline</p>
    </div>
  </a-col>
</template>

<script>
import {
  FieldTimeOutlined,
} from "@ant-design/icons-vue";
import { useStore } from 'vuex';
import { reactive } from 'vue-demi';
export default {
  components: {
    FieldTimeOutlined,
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
    const store = useStore()
    const patientUdid = reactive(props.patientId)
    const showData = () => {
      store.dispatch("patientTimeline", {
        id: patientUdid,
        type: "",
      });
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