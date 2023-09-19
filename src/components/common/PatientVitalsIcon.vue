<template>
  <a-col :span="8">
    <div class="moreAction" @click="showData">
      <div class="moreActionImg redBgColor">
        <img src="@/assets/images/wave.svg" />
      </div>
      <p  :class="isBold == true ? 'bold' : ''">Vital(s)</p>
    </div>
  </a-col>
</template>

<script>
// import { reactive } from 'vue-demi';
// import { useStore } from 'vuex';
export default {
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
    // var patientUdid = reactive(props.patientId)
    const showData = () => {
      // store.dispatch("patientVitals", {
      //   patientId: patientUdid,
      //   deviceType: 99,
      //   filter: "",
      // });
      // store.dispatch("patientVitals", {
      //   patientId: patientUdid,
      //   deviceType: 100,
      //   filter: "",
      // });
      // store.dispatch("patientVitals", {
      //   patientId: patientUdid,
      //   deviceType: 101,
      //   filter: "",
      // });
      emit('onClick')
    };

    return {
      showData,
    }
  }
}
</script>

<style scoped>
.anticon-calendar, .anticon-pushpin, .anticon-phone {
  color: #ffffff;
  font-size: 16px !important;
  position: relative !important;
  top: -2px !important;
}
</style>