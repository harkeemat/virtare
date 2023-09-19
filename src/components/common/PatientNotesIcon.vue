<template>
  <a-col :span="8">
    <div class="moreAction" @click="showData">
      <div class="moreActionImg blueBgColor">
        <EditOutlined />
      </div>
      <p  :class="isBold == true ? 'bold' : ''">Note(s)</p>
    </div>
  </a-col>
</template>

<script>
import { reactive } from 'vue-demi';
import { useStore } from 'vuex';
import { EditOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    EditOutlined,
  },
  props: {
    isBold: {
      type: Boolean
    },
    patientId: {
      type: Boolean
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const patientUdid = reactive(props.patientId)
    const showData = () => {
      store.dispatch("notesList", patientUdid);
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