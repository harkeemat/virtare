<template>
  <a-table class="sortIconTable" :columns="columns" :data-source="groupProvidersList" >
    <template #name="{record}">
      <router-link :to="{ name: 'providerSummary', params: { id: record.id ? record.udid : 16  }}" target="_blank">{{ record.name }}</router-link>
    </template>
    <template #actions="{record}">
      <a class="icons" @click="deleteGroupProvider(record.udid)"> <DeleteOutlined /></a>
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
    const groupProvidersList = computed(() => {
      return store.state.staffGroups.groupProvidersList
    })

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        slots: {
          customRender: 'name'
        }
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

    const deleteGroupProvider = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteGroupProvider', {
            groupUdid: groupId.value,
            providerUdid: id,
          }).then(() => {
            store.dispatch('groupProvidersList', groupId.value)
            if(groupProvidersList.value.length <= 1) {
              emit('closeModal')
            }
          })
        }
      })
    }

    return {
      columns,
      groupProvidersList,
      deleteGroupProvider,
    }
  }
}
</script>