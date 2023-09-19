<template>
  <a-col :span="8" >
    <div class="moreAction" @click="showData">
      <div class="moreActionImg purpleBgColor">
        <ScheduleOutlined />
      </div>
      <p :class="isBold == true ? 'bold' : ''">Appointment(s)</p>
    </div>
  </a-col>
</template>

<script>
import { reactive } from 'vue-demi';
import { useStore } from 'vuex';
import {
  ScheduleOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from 'vue-router';
export default {
  components: {
    ScheduleOutlined,
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
    const route = useRoute()
    const patientUdid = route.name == 'PatientSummary' ? route.params.udid : reactive(props.patientId)
    const showData = () => {
      store.dispatch('patientAppointmentsList', patientUdid)
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