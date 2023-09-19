<template>
  <a-col :span="8">
    <div class="moreAction" @click="showData">
      <div class="moreActionImg brightRedBgColor">
        <PushpinOutlined/>
      </div>
      <p :class="isBold == true ? 'bold' : ''">Add Pin</p>
    </div>
  </a-col>
</template>

<script>
import { PushpinOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    PushpinOutlined,
  },
  props: {
    isBold: {
      type: Boolean
    },
  },
  setup(props, { emit }) {
    const showData = () => {
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