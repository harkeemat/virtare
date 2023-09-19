<template>
  <a-table class="sortIconTable" :columns="columns" :data-source="groupStaffList" :pagination="false" >
    <template #fullName="{record}">
      <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.targetUdid  }}" target="_blank">{{ record.fullName }}</router-link>
    </template>
    <template #actions="{record}">
      <a class="icons" @click="deleteGroupStaff(record.udid)"> <DeleteOutlined /></a>
    </template>
  </a-table>
</template>

<script>
import {
  computed,
  watchEffect,
  ref,
} from "vue";
import {
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useStore } from 'vuex';
import {
  warningSwal,
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";

export default {
  components: {
    DeleteOutlined,
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
    const store = useStore()
    const groupId = ref(null)
    const groupStaffList = computed(() => {
      return store.state.staffGroups.groupStaffList
    })

    const columns = [
      {
        title: "Name",
        dataIndex: "fullName",
        slots: {
          customRender: 'fullName'
        }
      },
      {
        title: "Department",
        dataIndex: "department",
      },
      {
        title: "Tag",
        dataIndex: "tag",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      },
    ];

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    watchEffect(() => {
      if(createGroup.value != null) {
        groupId.value = props.groupID ? props.groupID : createGroup.value.udid;
      }
      else if(groupDetails.value != null) {
        groupId.value = props.groupID ? props.groupID : groupDetails.value.udid;
      }
    })

    const deleteGroupStaff = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteGroupStaff', {
            groupUdid: groupId.value,
            id: id,
          }).then(() => {
            store.dispatch('groupStaffList', groupId.value)
            if(groupStaffList.value.length <= 1) {
              emit('closeModal')
            }
          })
        }
      })
    }

    return {
      columns,
      groupStaffList,
      deleteGroupStaff,
    }
  }
}
</script>