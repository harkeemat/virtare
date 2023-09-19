<template>
  <a-table class="sortIconTable" :columns="columns" :data-source="groupProgramsList" >
    <template #actions="{record}">
      <a class="icons" @click="deleteGroupProgram(record.udid)"> <DeleteOutlined /></a>
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
    const groupProgramsList = computed(() => {
      return store.state.staffGroups.groupProgramsList
    })

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
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

    const deleteGroupProgram = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteGroupProgram', {
            groupUdid: groupId.value,
            programUdid: id,
          }).then(() => {
            store.dispatch('groupProgramsList', groupId.value)
            if(groupProgramsList.value.length <= 1) {
              emit('closeModal')
            }
          })
        }
      })
    }

    return {
      columns,
      groupProgramsList,
      deleteGroupProgram,
    }
  }
}
</script>