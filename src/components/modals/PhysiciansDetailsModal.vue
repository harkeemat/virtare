<template>
  <a-modal width="80%" :title="$t('global.physicians')" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table class="sortIconTable"
          rowKey="id"
          :columns="physiciansColumns"
          :data-source="physiciansList"
          :pagination="false"
        >
          <template #actions="{ record }">
            <a class="icons" v-if="arrayToObjact(screensPermissions,306)"
              ><EditOutlined @click="editPhysician(record.id);actionTrack(paramsId,306,'patient')"
            /></a>
            <a class="icons" v-if="arrayToObjact(screensPermissions,307)"
              ><DeleteOutlined @click="deletePhysician(record.id);actionTrack(paramsId,307,'patient')"
            /></a>
          </template>
        </a-table>
        <Loader />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import Loader from "@/components/loader/Loader.vue";
import { warningSwal, actionTrack,arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from 'vue-demi';
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    Loader,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientUdid = route.params.udid;

    const physiciansList = computed(() => {
      return store.state.patients.physiciansList
    })

    const physiciansColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Designation",
        dataIndex: "designation",
        key: "designation",
      },
      {
        title: "Email Address",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      },
    ];

    const editPhysician = (value) => {
      
      store
        .dispatch("physicianDetails", {
          patientUdid: patientUdid,
          physicianUdid: value,
        })
        .then(() => {
          emit("isPhysicianEdit");
        });
    };

    const deletePhysician = (value) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store
            .dispatch("deletePhysician", {
              patientUdid: patientUdid,
              physicianUdid: value,
            })
            .then(() => {
              if (route.name == "PatientSummary") {
                store.dispatch("physiciansList", patientUdid);
              }
              if(physiciansList.value.length <= 1) {
                emit('closeModal', {
                  modal: 'physiciansList',
                  value: false
                })
              }
            });
        }
      });
    };

    return {
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      actionTrack,
      paramsId:route.params.udid,
      physiciansColumns,
      physiciansList,
      editPhysician,
      deletePhysician,
    };
  },
};
</script>