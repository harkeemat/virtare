<template>
  <a-table class="sortIconTable" rowKey="id" :pagination="false" :columns="columnData?columnData:staffs.staffContactColms" :data-source="staffs.staffContactList" >
    <template #action="text" >
      <a-tooltip placement="bottom" @click="editContact(text.record.id)" v-if="arrayToObjact(screensPermissions,48)">
        <template #title>
          <span>{{$t('global.edit')}}</span>
        </template>
        <a class="icons">
          <EditOutlined />
        </a>
      </a-tooltip>
      <a-tooltip placement="bottom" @click="deleteContact(text.record.id)" v-if="arrayToObjact(screensPermissions,49)">
        <template #title>
          <span>{{$t('global.delete')}}</span>
        </template>
        <a class="icons">
          <DeleteOutlined />
        </a>
      </a-tooltip>
    </template>
  </a-table>
  <EditContactModal v-if="contactFormVisible" v-model:visible="contactFormVisible" :paramId="paramId" :isContactEdit="isEditContact" @closeModal="handleOk" />
</template>

<script>
import { computed, onMounted, ref } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  //   PlusOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { warningSwal,arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import EditContactModal from "@/components/modals/EditContactModal";
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    EditContactModal,
  },
  props: {
    Id: String,
    columnData:Array
  },
  setup(props,{emit}) {
    const store = useStore();
    const router = useRoute();
    const route = useRoute()
    const contactFormVisible = ref(false)
    const isEditContact = ref(false)
    const paramId = route.params.udid
    onMounted(()=>{
      store.dispatch("staffContactList", router.params.udid);
    })
    function deleteContact(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteContact", {
            id: props.Id ? props.Id : router.params.udid,
            contactId: id,
          });
          setTimeout(() => {
            store.dispatch(
              "staffContactList",
              props.Id ? props.Id : router.params.udid
            );
          }, 2000);
        }
      });
    }

    const editContact = (contactId) => {
      emit("editFormOpen")
      store.dispatch("contactDetails", {
        id: props.Id ? props.Id : router.params.udid,
        contactId: contactId,
      });
      contactFormVisible.value = true
      isEditContact.value = true
    }

    const staffs = computed(() => {
      return store.state.careCoordinator;
    });

    const handleOk = (value) => {
      contactFormVisible.value = true
      if(value) {
        warningSwal(messages.modalWarning).then((response) => {
        if (response == true) {
          contactFormVisible.value = false
          store.commit('checkChangeInput', false)
        }
        else {
          contactFormVisible.value = true
        }
        });
      }
      else {
        contactFormVisible.value = false;
      }
      isEditContact.value = false
    }
    
    return {
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      staffs,
      deleteContact,
      editContact,
      contactFormVisible,
      isEditContact,
      paramId,
      handleOk,
    };
  },
};
</script>
