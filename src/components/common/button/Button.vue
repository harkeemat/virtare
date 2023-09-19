<template>
  <div class="commonBtn">
    <a-button type="primary" @click="show">{{ name }}</a-button>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const show = () => {
      emit("click");
    };

    return {
      show,
    };
  },
};
</script>
