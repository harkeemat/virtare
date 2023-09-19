<template>
  <a-modal width="70%" title="Add New Location" class="addLocations" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <LocationForm @closeLocationModal="closeModal()" :fromSummary="fromSummary" :fromTable="fromTable" />
  </a-modal>
</template>

<script>
import { defineComponent, ref } from "vue";
import LocationForm from "@/components/administration/providers/forms/LocationForm";

export default defineComponent({
  props: {
     fromSummary: {
      type: Boolean
     },
     fromTable: {
      type: Boolean
     },
  },
  components: {
    LocationForm,
  },
  setup(props, { emit }) {
    // Country Dropdown Start
    const showState = ref(false);
    const showCity = ref(false);
    const showChild = ref(false);
    const showChild1 = ref(false);
    const showChild2 = ref(false);
    const optionsCountry = ref([
      {
        value: "USA",
        label: "USA",
      },
      {
        value: "Canada",
        label: "Canada",
      },
    ]);

    const handleChangeCountry = () => {
      
    };

    const handleBlurCountry = () => {
      // console.log("blur");
    };

    const handleFocusCountry = () => {
      // console.log("focus");
    };

    const filterOptionCountry = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // Country Dropdown End

    // State Dropdown Start
    const optionsState = ref([
      {
        value: "New Jersey",
        label: "New Jersey",
      },
      {
        value: "Arizona",
        label: "Arizona",
      },
      {
        value: "Montana",
        label: "Montana",
      },
      {
        value: "Alberta",
        label: "Alberta",
      },
      {
        value: "British Columbia",
        label: "British Columbia",
      },
      {
        value: "Ontario",
        label: "Ontario",
      },
    ]);

    const handleChangeState = (value) => {
      console.log(`selected ${value}`);
    };

    const handleBlurState = () => {
      // console.log("blur");
    };

    const handleFocusState = () => {
      // console.log("focus");
    };

    const filterOptionState = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // State Dropdown End

    // City Dropdown Start
    const optionsCity = ref([
      {
        value: "Airdrie",
        label: "Airdrie",
      },
      {
        value: "Vancouver",
        label: "Vancouver",
      },
      {
        value: "Surrey",
        label: "Surrey",
      },
      {
        value: "Victoria",
        label: "Victoria",
      },
      {
        value: "New York",
        label: "New York",
      },
      {
        value: "Los Angeles",
        label: "Los Angeles",
      },
      {
        value: "Chicago",
        label: "Chicago",
      },
      {
        value: "San Diego",
        label: "San Diego",
      },
    ]);

    const handleChangeCity = (value) => {
      console.log(`selected ${value}`);
    };

    const handleBlurCity = () => {
      // console.log("blur");
    };

    const handleFocusCity = () => {
      // console.log("focus");
    };

    const filterOptionCity = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // City Dropdown End

    const focusType = () => {
      // console.log("focus");
    };

    const handleChangeType = (value) => {
      console.log(`selected ${value}`);
    };

    const addField = (value) => {
      if (value == "state") {
        showCity.value = true;
      } else if (value == "city") {
        showChild.value = true;
      } else if (value == "child") {
        showChild1.value = true;
      } else if (value == "child1") {
        showChild2.value = true;
      }
    };

    const closeModal = () => {
      emit('closeLocationModal')
    }

    return {
      showState,
      showCity,
      showChild,
      showChild1,
      showChild2,
      addField,
      focusType,
      handleChangeType,
      valueType1: ref(),
      valueBuilding1: ref(),
      valueType2: ref(),
      valueBuilding2: ref(),
      valueType3: ref(),
      valueBuilding3: ref(),
      // Country Dropdown Start
      valueCountry: ref(undefined),
      filterOptionCountry,
      handleBlurCountry,
      handleFocusCountry,
      handleChangeCountry,
      optionsCountry,
      // Country Dropdown End

      // State Dropdown Start
      valueState: ref(undefined),
      filterOptionState,
      handleBlurState,
      handleFocusState,
      handleChangeState,
      optionsState,
      // State Dropdown End

      // City Dropdown Start
      valueCity: ref(undefined),
      filterOptionCity,
      handleBlurCity,
      handleFocusCity,
      handleChangeCity,
      optionsCity,
      closeModal,
      // City Dropdown End
    };
  },
});
</script>