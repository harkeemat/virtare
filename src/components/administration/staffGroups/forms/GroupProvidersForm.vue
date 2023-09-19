<template>
  <a-form ref="formRef" :model="addProviderToGroupForm" layout="vertical" @finish="submitForm">
    <a-row :gutter="24">

      <a-col :span="21">
        <div class="form-group">
          <a-form-item :label="$t('global.provider')" name="provider" :rules="[{ required: true, message: $t('global.provider')+' '+$t('global.validation') }]">
            <ProvidersDropdownSearch mode="multiple" v-model:value="addProviderToGroupForm.provider" @handleProviderChange="handleProviderChange($event)" :placeholder="$t('staffGroups.searchProvidersPlaceholder')" :targetRecords="groupProvidersList" :dropdownList="dropdownList" />
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
    ProvidersDropdownSearch: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdownSearch")),
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

    const addProviderToGroupForm = reactive({
      provider: [],
    })
    const form = reactive({ ...addProviderToGroupForm })

		const handleProviderChange = (val) => {
			addProviderToGroupForm.provider = val;
		};

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    const groupProvidersList = computed(() => {
      return store.state.staffGroups.groupProvidersList
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
    const providerData = ref([]);

    const submitForm = () => {
      const data = {
        id: groupId.value,
        data: addProviderToGroupForm
      }
      store.dispatch('addProviderToGroup', data).then(() => {
        formRef.value.resetFields();
        Object.assign(addProviderToGroupForm, form)
        store.dispatch('groupsList')
        store.dispatch('groupProvidersList', groupId.value).then(() => {
          Services.singleDropdownSearch("", (d) => (providerData.value = d), groupProvidersList.value, "provider");
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
      addProviderToGroupForm,
      handleProviderChange,
      closeModal,
      groupProvidersList,
      dropdownList,
    };
  },
};
</script>