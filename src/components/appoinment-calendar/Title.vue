<template>
    <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">
           {{title}}
            <div class="commonBtn">
              <a-button type="primary" @click="click(toggle = !toggle)">{{
                toggle ? button.fullCalendarView : button.hideCalendarView 
              }}</a-button>
            </div>
          </h2>
        </a-col>
      </a-row>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    title: {
      type: String,
    },
    button: {
      type: Object,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const toggle = ref(props.isActive);
    function click(value) {
      emit("calenderToggle", value);
    }

    return {
      click,
      toggle,
    };
  },
};
</script>