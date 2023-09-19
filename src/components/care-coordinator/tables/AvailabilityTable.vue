<template>
  <a-table class="sortIconTable" rowKey="id" :pagination="false" :columns="columnData?columnData:staffs.availabilityListColms" :data-source="staffs.availabilityList" >
    <template #action="text" v-if="hideAction" >
      <a-tooltip placement="bottom" @click="editAvailability(text.record.id)" v-if="arrayToObjact(screensPermissions,52)">
        <template #title>
          <span>{{$t('global.edit')}}</span>
        </template>
        <a class="icons">
          <EditOutlined />
        </a>
      </a-tooltip>
      <a-tooltip placement="bottom" @click="deleteAvailability(text.record.id)" v-if="arrayToObjact(screensPermissions,53)">
        <template #title>
          <span>{{$t('global.delete')}}</span>
        </template>
        <a class="icons">
          <DeleteOutlined />
        </a>
      </a-tooltip>
    </template>
  </a-table>
  <EditAvailabilityModal v-if="availabilityFormvisible" v-model:visible="availabilityFormvisible" :paramId="paramId" :isAvailabilityEdit="isEditAvailability" @closeModal="handleOk" />
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
import EditAvailabilityModal from "@/components/modals/EditAvailabilityModal";
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    EditAvailabilityModal,
  },
  props: {
    Id: String,
    columnData:Array
  },
  setup(props) {
    const store = useStore();
    const router = useRoute();
    const route = useRoute()
    const paramId = route.params.udid
    const availabilityFormvisible = ref(false)
    const isEditAvailability = ref(false)
    onMounted(()=>{
      store.dispatch("availabilityList", router.params.udid);
    })
    function deleteAvailability(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteAvailability", {
            id: props.Id ? props.Id : router.params.udid,
            availabilityID: id,
          });
          setTimeout(() => {
            store.dispatch(
              "availabilityList",
              props.Id ? props.Id : router.params.udid
            );
          }, 2000);
        }
      });
    }

    const editAvailability = (availabilityId) => {
      store.dispatch("availabilityDetails", {
        id: router.params.udid ? router.params.udid : props.Id,
        availabilityId: availabilityId,
      });
      availabilityFormvisible.value = true
      isEditAvailability.value = true
    }

    const staffs = computed(() => {
      return store.state.careCoordinator;
    });

    const handleOk = (value) => {
      if(value) {
        availabilityFormvisible.value = true
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            availabilityFormvisible.value = false
            store.commit('checkChangeInput', false)
          }
          else {
            availabilityFormvisible.value = true
          }
        });
      }
      else {
        availabilityFormvisible.value = false
      }
      isEditAvailability.value = false
    }
   
    return {
    screensPermissions:store.getters.screensPermissions,
     arrayToObjact,
      staffs,
      deleteAvailability,
      editAvailability,
      paramId,
      availabilityFormvisible,
      isEditAvailability,
      handleOk,
    };
  },
};
</script>
