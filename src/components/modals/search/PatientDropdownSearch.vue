<template>
  <a-select
  :getPopupContainer="triggerNode => triggerNode.parentNode"
    ref="select"
    class="escalationPatient"
    :listHeight="listHeight?listHeight:150"
    :mode="mode"
    :value="value"
    @input="updateValue"
    style="width: 100%"
    :show-search="true"
    :placeholder="placeholder?placeholder:'Please Select'"
    :show-arrow="true"
    :filter-option="false"
    :not-found-content="loadingStatus ? undefined : null"
    :options="patientData"
    @search="handlePatientSearch"
    @focus="handlePatientSearch"
    @change="handlePatientChange"
    size="large"
  >
  <!-- <a-select-option v-for="(pt,i) in patientData" :key="i"  :label="pt.label">
      <img v-if="pt.profilePhoto" :src="pt.profilePhoto" alt="image" />
      <img v-else src="@/assets/images/userAvatar.png" alt="image" />
      &nbsp;&nbsp;{{pt.label}}
  </a-select-option> -->
  <template #option="{ value: value, label, profilePhoto }">
        <!-- <span role="img" :aria-label="value">{{ profilePhoto }}</span> -->
        <img v-if="profilePhoto" :src="profilePhoto" alt="image" :aria-label="value"/>
      <img v-else src="@/assets/images/userAvatar.png" alt="image" />
        &nbsp;&nbsp;{{label}}
      </template>
      <template #tagRender="{ value: val, label, closable, onClose, option }">
        <a-tag :closable="closable" style="margin-right: 3px" @close="onClose">
          {{ label }}&nbsp;&nbsp;
          <span role="img" :aria-label="val">{{ option.icon }}</span>
        </a-tag>
      </template>
    <template v-if="loadingStatus" #notFoundContent>
      <a-spin size="small" />
      <p>Data not found!</p>
    </template>
  </a-select>
</template>

<script>
import { defineComponent, watchEffect, onMounted,ref } from "vue";
import { useStore } from "vuex";
import Services from "@/services/serviceMethod";
export default defineComponent({
  components: {},
  props: {
    value: String,
    mode: String,
    close: Boolean,
    editDataPatient:Array,
    placeholder:String,
    listHeight:Number,
    targetRecords:Array,
  },

  setup(props, context) {
    const store = useStore();
    const patientData = ref()
    
   

    const updateValue = (event) => {
      context.emit("update:modelValue", event.target.value);
    };
    watchEffect(() => {
      if (props.close) {
        Services.singleDropdownSearch(
          "",
          (d) => (patientData.value = d),
          // null,
          props.targetRecords,
          "patient"
        );
        store.commit("checkChangeInput", false);
      }
       props.editDataPatient?patientData.value = props.editDataPatient:patientData.value
    });
    onMounted(() => { 
      // Services.singleDropdownSearch(
      //   "",
      //   (d) => (patientData.value = d),
      //   // null,
      //   props.targetRecords,
      //   "patient"
      // );
    });

    const handlePatientSearch = (val) => {
      store.commit("dropdownLoadingStatus", true);
      patientData.value = [];
      const value = val.target ? val.target.value : val
      Services.singleDropdownSearch(
        value,
        (d) => (patientData.value = d),
        // null,
        props.targetRecords,
        "patient"
      );
    };

    const handlePatientChange = (val) => {
      // Services.singleDropdownSearch( val, (d) => (patientData.value = d), props.targetRecords, "patient" );
      context.emit("handlePatientChange", val);
    };

    return {
      loadingStatus: store.getters.dropdownLoadingStatus,
      handlePatientChange,
      handlePatientSearch,
      patientData,
      updateValue,
    };
  },
});
</script>

<style lang="scss">
.escalationPatient {
  .ant-select-dropdown {
    .ant-select-item-option-content {
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
}
</style>