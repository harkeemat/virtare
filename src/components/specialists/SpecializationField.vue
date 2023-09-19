<template>
  <a-form-item
    :label="$t('global.specialization')"
    :name="['specialist', 'specializationId']"
    :rules="[{ required: false, message: $t('global.required') }]"
  >
    <a-input
      placeholder="Enter name"
      @change="(e) => emit('nameField', e.target.value)"
      v-if="showName"
    />
    <SelectBox
      v-else
      v-model:value="props.model"
      @focus="focus"
      :placeholderData="$t('global.specialization')"
      :globalCode="[{ id: 'add', name: 'Add New' }, ...specializations]"
      @change="change"
    />
  </a-form-item>
</template>

<script setup>
import SelectBox from "@/components/form-fields/SelectBox";
import InputFields from "@/components/form-fields/InputFields";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
const { getters } = useStore();
const specializations = computed(
  () => getters?.commonRecords.value?.specialization
);
const name = ref("");
const props = defineProps(["model"]);
const emit = defineEmits(["nameField",'onSpecializationId']);
const showName = ref(false);
const change = (name) => {
  showName.value = name === "add";
  if(name !== "add")
    emit('onSpecializationId',name)
};
onMounted(() => {});
</script>
