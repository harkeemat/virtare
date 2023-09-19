<template>
  <a-form :id="
    arrayToObjectData(
      formData,
      arrayToObjectData(formTitleNames, 17, 'id', 'name'),
      'name',
      'udid'
    )
  " ref="formRef" :model="inventoryForm" name="basic" layout="vertical" @finish="submitForm" class="common-form">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Assign Device</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-form-item class="required" label="Patient" name="patientId" :rules="[
            {
              required: true,
              message: 'Patient' + ' ' + $t('global.validation'),
            },
          ]">
            <SelectBox v-model:value="inventoryForm.patientId" :globalCode="store.state.inventory.allPatientsNames"
              @change="inventoryChange" />
            <ErrorMessage v-if="errorMsg" :name="errorMsg ? errorMsg.message : ''" />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onCloseModal" name="Cancel" />
      <Button classData="primary-btn" html-type="submit" :name="'Save'" />
    </div>
  </a-form>
  <Loader />
</template>

<script>
import {
  defineComponent,
  reactive,
  computed,
  ref,
  onUnmounted,
  onMounted,
} from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { useStore } from "vuex";
import {

  arrayToObjectData,
  formTitleNames,
} from "@/commonMethods/commonMethod";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import Loader from "@/components/loader/Loader";
import Button from "@/components/button/Button.vue";
export default defineComponent({
  components: {
    ErrorMessage,
    Loader,
    SelectBox,
    Button,
  },
  props: {
    patientDetails: {
      type: Object,
    },
    inventoryScreen: {
      type: Boolean,
    },
    inventoryId: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    // const patientDetail = reactive(props.patientDetails);
    const inventoryForm = reactive({
      patientId: "",
    });
    const formRef = ref();
    const submitForm = () => {
      const data = {
        patientId: inventoryForm.patientId,
      }
      store.dispatch("assignInventoryToPatients", { id: props?.inventoryId, record: data }).then((resp) => {
        if (resp) {
          store.commit('patientTabsEnabled', true)
          store.dispatch("inventoriesList");
          emit("closeModal", {
            modal: "addInventory",
            value: false,
          });
        }
      });
    };
    const errorMsg = computed(() => {
      return store.state.inventory.inventoryError;
    });

    function onCloseModal() {

      emit("closeModal", {
        modal: "addInventory",
        value: false,
      });

    }

    onMounted(() => {
      store.dispatch('allPatientsNames')
    });

    onUnmounted(() => {
      store.state.inventory.inventoryError = null
    });
    const inventoryChange = () => {
      store.state.inventory.inventoryError = null
    }
    return {
      formRef,
      inventoryForm,
      submitForm,
      inventoryChange,
      errorMsg,
      onCloseModal,
      formData: store.getters.formTitle,
      arrayToObjectData,
      formTitleNames,
      store
    };
  },
});
</script>