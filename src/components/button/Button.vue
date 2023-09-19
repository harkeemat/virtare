<template>
    <a-button :class="classData" :type="type" @click="show" :loading="loading">{{ name }}</a-button>
</template>

<script>
export default {
  emits:['click'],
  props: {
    name: {
      type: String,
    },
    loading:Boolean,
    type:String,
    classData:String
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
