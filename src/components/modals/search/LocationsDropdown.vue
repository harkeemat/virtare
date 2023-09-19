<template>
  <a-select
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    :value="value"
    :placeholder="placeholder ? placeholder : 'Location'"
    :options="locationData"
    @change="handleLocationChange"
    :show-search="true"
    size="large">
  </a-select>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
export default defineComponent({
  components: {},
  props: {
    value: String,
    placeholder: String,
    dropdownList: Array,
  },

  setup(props, context) {
    // const locations = ref(props.dropdownList);
    // const locationData = ref(props.dropdownList);
    const locations = reactive(props.dropdownList);
    const locationData = locations ? ref(locations) : ref([]);

    const handleLocationChange = (index, location) => {
      console.log(index)
      /* const selectedLocationData = {
        id: location.id,
        value: location.id,
        name: location.name,
        label: location.name,
        entityType: location.entityType,
      } */
      context.emit("handleLocationChange", location);
      locationData.value = location
    };

    return {
      handleLocationChange,
      locationData,
    };
  },
});
</script>
