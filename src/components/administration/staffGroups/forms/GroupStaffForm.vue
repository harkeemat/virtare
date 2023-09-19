<template>
  <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,37,'id','name'),'name','udid')" ref="formRef" :model="addStaffToGroupForm" layout="vertical" @finish="submitForm">
    <!-- <a-row class="validationMessage" :gutter="24">
      <a-col :span="24">
        <span>Required group composition role count:</span><br/>
      </a-col>
      <a-col :span="24" v-for="composition in groupCompositions" :key="composition.id">
        {{ composition.designationName }} - {{ composition.count }}
      </a-col>
    </a-row> -->
    <!-- <a-row :gutter="24" v-if="groupCompositions?.length > 0">
      <a-col class="validation validationMessage" :span="24">
        <span>Required Group Composition role count : </span>
        <span v-for="(composition, index) in groupCompositions" :key="composition.id">{{ composition.count }}&nbsp;{{ composition.designationName }}<span v-if="index < (groupCompositions.length-1)">, </span></span>
      </a-col>
    </a-row> -->
    <a-row :gutter="24" v-if="groupCompositions?.length > 0">
      <a-col :sm="24" class="alertMessage">
        <Alert :text="'Required Group Composition role count : '+compositionAlertInfo" type="info" :closable="false" :isPin="false" />
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col class="validation validationMessage" :span="24">
        <span>Please add Group Composition first</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="21">
        <div class="form-group">
          <a-form-item :label="$t('global.staff')" name="staff" :rules="[{ required: true, message: $t('global.staff')+' '+$t('global.validation') }]">
            <StaffDropDown mode="multiple" v-model:value="addStaffToGroupForm.staff" @handleStaffChange="handleStaffChange($event)" placeholder="Search by Name, Designation" :targetRecords="groupStaffList" :dropdownList="dropdownList" :disabled="groupCompositions?.length > 0 ? false : true" />
            <ErrorMessage v-if="errorMsg != null" :name="errorMsg.staff ? errorMsg.staff[0] : ''" />
          </a-form-item>
        </div>
      </a-col>
      <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,37,'id','name'),'name','udid')"> </FormBaseComponents>

      <a-col :span="3">
        <div class="form-group">
          <div class="text-right mt-28">
            <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.save')}}</a-button>
          </div>
        </div>
      </a-col>
      
      <a-col :span="24" style="padding: 10px">
        <ErrorMessage v-if="errorMsg" :name="errorMsg ? errorMsg : ''" />
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
  watchEffect,
	defineComponent,
	onMounted,
	onUnmounted
} from "vue";
import { useStore } from 'vuex';
import Services from "@/services/serviceMethod";
import {arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import Alert from "@/components/common/Alert/Alert";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    StaffDropDown: defineAsyncComponent(()=>import("@/components/modals/search/StaffDropdownSearch")),
    ErrorMessage: defineAsyncComponent(()=>import("@/components/common/messages/ErrorMessage")),
    Alert,
    FormBaseComponents
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

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    const groupCompositions = computed(() => {
      return store.state.staffGroups.groupCompositions
    })

    const compositionAlertInfo = computed(() => {
      return store.state.staffGroups.compositionAlertInfo
    })

    const groupStaffList = computed(() => {
      return store.state.staffGroups.groupStaffList
    })

    const dropdownList = computed(() => {
      return store.state.staffGroups.dropdownList
    })

    const errorMsg = computed(() => {
      return store.state.staffGroups.errorMsg
    })

    onMounted(() => {
      store.commit('selectedProvider', {
        id: groupDetails.value.providerId
      })
      store.commit('selectedLocation', {
        id: groupDetails.value.providerLocation,
        entityType: groupDetails.value.entityType,
      })
    })

    onUnmounted(() => {
      store.commit('selectedProvider', "")
      store.commit('selectedLocation', "")
    })

    watchEffect(() => {
      if(props.isEdit) {
        groupId.value = groupDetails.value ? groupDetails.value.udid : null
      }
      else {
        groupId.value = createGroup.value ? createGroup.value.udid : null
      }
      store.dispatch('groupStaffList', groupId.value)
    })

    const addStaffToGroupForm = reactive({
      staff: [],
    })
    const form = reactive({ ...addStaffToGroupForm })

		const handleStaffChange = (val) => {
			addStaffToGroupForm.staff = val;
      store.commit('errorMsg', null)
		};
    const staffData = ref([]);

    const submitForm = () => {
      const data = {
        groupId: groupId.value,
        data: addStaffToGroupForm
      }
      store.dispatch('addStaffToGroup', data).then(() => {
        store.dispatch('groupStaffList', groupId.value).then(() => {
          Services.singleDropdownSearch("", (d) => (staffData.value = d), groupStaffList.value, "staff");
        })
        formRef.value.resetFields();
        Object.assign(addStaffToGroupForm, form)
        store.dispatch('groupsList')
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
      addStaffToGroupForm,
      handleStaffChange,
      closeModal,
      groupId,
      groupStaffList,
      dropdownList,
      errorMsg,
      groupCompositions,
      compositionAlertInfo,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
    };
  },
});
</script>

<style>
.validationMessage {
  padding: 20px;
  color: #d60707;
}
.alertMessage {
  margin: 20px 0px;
}
</style>