<template>
  <a-form ref="formRef" :model="addProgramToGroupForm" layout="vertical" @finish="submitForm">
    <a-row :gutter="24">

      <a-col :span="21">
        <div class="form-group">
          <a-form-item :label="$t('global.program')" name="program" :rules="[{ required: true, message: $t('global.program')+' '+$t('global.validation') }]">
            <ProgramsDropdownSearch mode="multiple" v-model:value="addProgramToGroupForm.program" @handleProgramChange="handleProgramChange($event)" :placeholder="$t('staffGroups.searchProgramsPlaceholder')" :targetRecords="groupProgramsList" :dropdownList="dropdownList" />
          </a-form-item>
        </div>
      </a-col>

      <a-col :span="3">
        <div class="form-group">
          <div class="text-right mt-28">
            <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.save')}}</a-button>
          </div>
        </div>
      </a-col>
      
    </a-row>
  </a-form>

</template>

<script>
import { 
  reactive,
  ref,
  defineAsyncComponent,
  computed,
  watchEffect
} from "vue";
import { useStore } from 'vuex';
import Services from "@/services/serviceMethod";

export default {
  components: {
    ProgramsDropdownSearch: defineAsyncComponent(()=>import("@/components/modals/search/ProgramsDropdownSearch")),
  },
  props: {
    isEdit: {
      type: Boolean
    },
    groupID: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const formRef = ref()
    const store = useStore()
    const groupId = ref(null)

    const addProgramToGroupForm = reactive({
      program: [],
    })
    const form = reactive({ ...addProgramToGroupForm })

		const handleProgramChange = (val) => {
			addProgramToGroupForm.program = val;
		};

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    const groupProgramsList = computed(() => {
      return store.state.staffGroups.groupProgramsList
    })

    const dropdownList = computed(() => {
      return store.state.staffGroups.dropdownList
    })

    watchEffect(() => {
      if(props.isEdit) {
        groupId.value = groupDetails.value ? groupDetails.value.udid : null
      }
      else {
        groupId.value = createGroup.value ? createGroup.value.udid : null
      }
    })
    const programData = ref([]);

    const submitForm = () => {
      const data = {
        id: groupId.value,
        data: addProgramToGroupForm
      }
      store.dispatch('addProgramToGroup', data).then(() => {
        formRef.value.resetFields();
        Object.assign(addProgramToGroupForm, form)
        store.dispatch('groupsList')
        store.dispatch('groupProgramsList', groupId.value).then(() => {
          Services.singleDropdownSearch("", (d) => (programData.value = d), groupProgramsList.value, "program");
        })
      })
    }

    const closeModal = () => {
      emit('closeModal')
    }

    return {
      formRef,
      value: ref([]),
      checked: ref([]),
      submitForm,
      addProgramToGroupForm,
      handleProgramChange,
      closeModal,
      groupProgramsList,
      dropdownList,
    };
  },
};
</script>