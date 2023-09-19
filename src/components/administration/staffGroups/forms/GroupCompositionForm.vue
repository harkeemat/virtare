<template>
  <a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,36,'id','name'),'name','udid')" :model="groupCompositionForm" layout="vertical" @finish="submitForm" autocomplete="off" style="margin-top:20px" >

      <a-row :gutter="24" v-for="(user, index) in groupCompositionForm.staffMembers" :key="user.id">
        <a-col :span="11">
          <div class="form-group">
            <a-form-item label="Role" :name="['staffMembers', index, 'designation']" :rules="[{ required: true, message: 'Designation'+' '+$t('global.validation') }]">
              <RoleDropDown v-model:value="user.designation" @handleRoleChange="handleGlobalChange($event,'groupCompositionForm.designation', user)" @change="checkChangeInput()" placeholder="Select Role" />
              <!-- <GlobalCodeDropDown :listHeight="100" v-model:value="user.designation" :dataId="17" @handleGlobalChange="handleGlobalChange($event,'groupCompositionForm.designation', user); checkChangeInput('designation', $event);" placeholder="Select Role" /> -->
              <ErrorMessage v-if="errorMsg && !groupCompositionForm.designation" :name="errorMsg.designation ? errorMsg.designation[0] : ''" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="11">
          <div class="form-group">
            <a-form-item label="Count" :name="['staffMembers', index, 'count']" :rules="[{ required: true, message: 'Role'+' '+$t('global.validation') }]">
              <a-input v-model:value="user.count" size="large" placeholder="Enter Count" />
            </a-form-item>  
          </div>
        </a-col>

        <a-col :span="2">
          <span class="roundBtn"><PlusCircleOutlined @click="addFields" /></span>
          <span class="roundBtn"><DeleteOutlined v-if="groupCompositionForm.staffMembers.length > 1" @click="removeFields(user)" /></span>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <div class="form-group">
            <a-form-item label="Patient Count" name="patientCount" :rules="[{ required: true, message: 'Patient Count'+' '+$t('global.validation') }]">
              <a-input v-model:value="groupCompositionForm.patientCount" size="large" placeholder="Enter Count" />
            </a-form-item>
          </div>
        </a-col>
      </a-row>
      <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,36,'id','name'),'name','udid')"> </FormBaseComponents>

      <a-row :gutter="24">
        <ErrorMessage v-if="errorMsg" :name="errorMsg ? errorMsg : ''" />
      </a-row>
      
      <a-row :gutter="24">
        <a-button type="submit" html-type="submit">{{$t('global.save')}}</a-button>
      </a-row>


  </a-form>
  <Loader />
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onMounted,
  reactive,
} from 'vue-demi';
import { useStore } from 'vuex';
import {
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import {
 arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import Loader from "@/components/loader/Loader";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import RoleDropDown from "@/components/modals/search/RoleDropdownSearch.vue"

export default defineComponent({
  props: {
    isEdit: {
      type: Boolean
    },
    groupID: {
      type: Number
    },
    compositionId: {
      type: Number
    },
  },
  components: {
    RoleDropDown,
    // GlobalCodeDropDown: defineAsyncComponent(()=>import("@/components/modals/search/GlobalCodeSearch.vue")),
    ErrorMessage: defineAsyncComponent(()=>import("@/components/common/messages/ErrorMessage")),
    PlusCircleOutlined,
    DeleteOutlined,
    Loader,
    FormBaseComponents
  },
  setup(props, { emit }) {
    const store = useStore()
    const title = props.isEdit ? 'Edit Group' : 'Create Group'

    const errorMsg = computed(() => {
      return store.state.staffGroups.errorMsg
    })

    const groupCompositionDetails = computed(() => {
      return store.state.staffGroups.groupCompositionDetails
    })

    const groupCompositionForm = reactive({
      staffMembers: [],
      patientCount: ""
    })

    onMounted(() => {
      if(groupCompositionDetails.value != null && groupCompositionDetails.value.length > 0) {
        groupCompositionDetails.value.map(item => {
          groupCompositionForm.staffMembers = item.composition
          groupCompositionForm.patientCount = item.patientCount
        })
      }
      else {
        groupCompositionForm.staffMembers.push({
          designation: '',
          count: '',
        });
      }
    })

    const submitForm = () => {
      let data = {
        composition: groupCompositionForm.staffMembers,
        patientCount: Number(groupCompositionForm.patientCount),
      }
      store.dispatch('addGroupComposition', {
        groupId: props.groupID,
        data: data
      })
    }

    const closeModal = () => {
      emit('closeModal')
    }

    const checkChangeInput = () => {
      store.commit('checkChangeInput', true)
      store.commit('errorMsg', null)
    }

    const handleGlobalChange = (data, type, item) => {
      let index = groupCompositionForm.staffMembers.indexOf(item);
      if (type == "groupCompositionForm.designation") {
        groupCompositionForm.staffMembers[index].designation = data;
      }
    }
    
    const addFields = () => {
      groupCompositionForm.staffMembers.push({
        designation: '',
        count: '',
      });
    }

    const removeFields = item => {
      let index = groupCompositionForm.staffMembers.indexOf(item);

      if (index !== -1) {
        groupCompositionForm.staffMembers.splice(index, 1);
      }
    };

    return {
      title,
      addFields,
      removeFields,
      closeModal,
      groupCompositionForm,
      submitForm,
      errorMsg,
      checkChangeInput,
      handleGlobalChange,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
    };
  },
});
</script>

<style>
.roundBtn .anticon {
  font-size: 25px;
  margin-right: 10px;
  height: 40px;
  color: #1D8FFB;
  position: relative;
  top: 8px;
}
.roundBtn .anticon-delete {
  color: #dc3545;
}
</style>