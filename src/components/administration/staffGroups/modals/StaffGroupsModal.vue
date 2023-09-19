<template>
  <a-modal width="90%" :title="modalTitle" centered :footer="false"  :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24" ref="customScrollTop">
      <a-col :span="24" >
        <a-steps v-model:current="current" @change="scrollToTop($event)" >
          <a-step v-for="item in steps" :key="item.title" :title="item.title" ><span :id="item"></span></a-step>
        </a-steps>

        <!-- Group Form -->
        <div class="steps-content" v-if="steps[current].title == 'Group'">
          <CreateGroupForm :groupID="groupId" :isEdit="isEdit" />
        </div>

        <!-- Group Staff Form -->
        <div class="steps-content" v-if="steps[current].title == 'Staff'">
          <GroupStaffForm :groupID="groupId" :isEdit="isEdit" @closeModal="closeModal" />
          <GroupStaffTable :groupID="groupId" :isEdit="isEdit" />
          <div class="steps-action">
            <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
            <a-button v-if="current < steps.length - 1" @click="next" class="modal-button" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
              {{$t('global.save')}}
            </a-button>
          </div>
        </div>

        <!-- Group Programs Form -->
        <div class="steps-content" v-if="steps[current].title == 'Programs'">
          <GroupProgramsForm :groupID="groupId" :isEdit="isEdit" @closeModal="closeModal" />
          <GroupProgramsTable :groupID="groupId" :isEdit="isEdit" />
          <div class="steps-action">
            <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
            <a-button v-if="current < steps.length - 1" @click="next" class="modal-button" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
              {{$t('global.save')}}
            </a-button>
          </div>
        </div>

        <!-- Group Providers Form -->
        <div class="steps-content" v-if="steps[current].title == 'Providers'">
          <GroupProvidersForm :groupID="groupId" :isEdit="isEdit" @closeModal="closeModal" />
          <GroupProvidersTable :groupID="groupId" :isEdit="isEdit" />
          <div class="steps-action">
            <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
            <a-button v-if="current < steps.length - 1" @click="next" class="modal-button" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
              {{$t('global.save')}}
            </a-button>
          </div>
        </div>

        <!-- Group Permissions Form -->
        <div class="steps-content" v-if="steps[current].title == 'Permissions'">
          <GroupPermissionsForm :groupID="groupId" :isEdit="isEdit" @closeModal="closeModal" />
        </div>

      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  ref,
  watchEffect
} from 'vue-demi';
import { useStore } from 'vuex';
export default {
  components: {
    CreateGroupForm: defineAsyncComponent(()=>import("@/components/administration/staffGroups/forms/CreateGroupForm")),
    GroupStaffForm: defineAsyncComponent(()=>import("@/components/administration/staffGroups/forms/GroupStaffForm")),
    GroupStaffTable: defineAsyncComponent(()=>import("@/components/administration/staffGroups/tables/GroupStaffTable")),
    GroupProgramsForm: defineAsyncComponent(()=>import("@/components/administration/staffGroups/forms/GroupProgramsForm")),
    GroupProgramsTable: defineAsyncComponent(()=>import("@/components/administration/staffGroups/tables/GroupProgramsTable")),
    GroupProvidersForm: defineAsyncComponent(()=>import("@/components/administration/staffGroups/forms/GroupProvidersForm")),
    GroupProvidersTable: defineAsyncComponent(()=>import("@/components/administration/staffGroups/tables/GroupProvidersTable")),
    GroupPermissionsForm: defineAsyncComponent(()=>import("@/components/administration/staffGroups/forms/GroupPermissionsForm")),
  },
  props: {
    isEdit: {
      type: Boolean
    },
    // groupId: {
    //   type: Number
    // },
  },
  setup(props, { emit }) {
    const store = useStore()
    const customScrollTop = ref()
    const modalTitle = props.isEdit ? 'Edit Group' : 'Create New Group'
    const groupId = ref(null)

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    watchEffect(() => {
      store.commit('errorMsg', null)
      if(groupDetails.value) {
        groupId.value = groupDetails.value ? groupDetails.value.udid : null 
      }
      else if(createGroup.value) {
        groupId.value = createGroup.value.udid 
      }
      else {
        groupId.value = null  
      }
    })
    
    const current = computed({
      get: () =>
        store.state.staffGroups.counter,
      set: (value) => {
        if (createGroup.value || groupDetails.value) {
          store.state.staffGroups.counter = value;
        }
        else {
          store.commit('errorMsg', 'Please add the group name first.')
        }
      },
    })

    const next = () => {
      if(store.state.staffGroups.counter >= 1) {
        store.commit("counterPlus");
      }
    };
    const prev = () => {
      store.commit("counterMinus");
      // customScrollTop.value.scrollIntoView({behavior: 'smooth'});
    };

    function scrollToTop(){
      
    }

    const closeModal = () => {
      emit('closeModal')
      store.state.staffGroups.createGroup = null
      store.state.staffGroups.groupDetails = null
      store.state.staffGroups.groupStaffList = null
      // store.state.staffGroups.groupProgramsList = null
      store.state.staffGroups.groupProvidersList = null
      store.state.staffGroups.groupPermissions = null
      store.commit('errorMsg', null)
      store.commit("resetCounter")
    }

		const steps = [
			{
				title: "Group",
				key: "group",
				content: "First-content",
			},
			{
				title: "Staff",
				key: "staff",
				content: "Second-content",
			},
			{
				title: "Programs",
				key: "programs",
				content: "Third-content",
			},
			{
				title: "Providers",
				key: "providers",
				content: "Fourth-content",
			},
			{
				title: "Permissions",
				key: "permissions",
				content: "Fifth-content",
			},
		]

    return {
      modalTitle,
      steps,
      current,
      scrollToTop,
      next,
      prev,
      closeModal,
      groupId,
    }
  }
}
</script>