<template>
  <a-modal width="98%" :title="$t('global.familyMembers')" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table class="sortIconTable"
          rowKey="id"
          :columns="familyMembersColumns"
          :data-source="familyMembersList"
          :scroll="{ x: 1100 }"
          :pagination="false" >
          <template #contactTime="{ record }">
            <template
              v-for="contactTime in record.contactTime"
              :key="contactTime.id" >
              <p v-if="contactTime == '16'">Morning</p>
              <p v-if="contactTime == '17'">Afternoon</p>
              <p v-if="contactTime == '18'">Evening</p>
            </template>
          </template>

          <template #contactType="{ record }">
            <template
              v-for="contactType in record.contactType"
              :key="contactType.id" >
              <p v-if="contactType == '13'">Email</p>
              <p v-if="contactType == '14'">Phone</p>
              <p v-if="contactType == '15'">Text</p>
            </template>
          </template>

          <template #action="{ record }">
            <a class="icons" v-if="arrayToObjact(screensPermissions,303)"><EditOutlined @click="editFamilyMember(record.id);actionTrack(paramsId,303,'patient')" /></a>
            <a class="icons" v-if="arrayToObjact(screensPermissions,304)" ><DeleteOutlined @click="deleteFamilyMember(record.id);actionTrack(paramsId,304,'patient')" /></a>
          </template>
        </a-table>
        <Loader />
      </a-col>
    </a-row>
    <AddFamilyMemberModal v-model:visible="addFamilyMembersVisible" :patientId="patientId" @closeModal="handleOk" :isFamilyMemberEdit="true" />
  </a-modal>
</template>

<script>
import { computed, reactive, ref } from "vue-demi";
import { useStore } from "vuex";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { warningSwal, actionTrack,arrayToObjact, } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import Loader from "@/components/loader/Loader.vue";
import { useRoute } from "vue-router";
import AddFamilyMemberModal from "@/components/modals/AddFamilyMemberModal";
export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    Loader,
    AddFamilyMemberModal,
  },
  props: {
    patientId: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientUdid = reactive(props.patientId);
    const addFamilyMembersVisible = ref(false)
    const familyMembersColumns = [
      {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        width: "9%",
      },
      {
        title: "Email Address",
        dataIndex: "email",
        key: "email",
        width: "10%",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        width: "7%",
      },
      {
        title: "Preferred Method of Contact",
        dataIndex: "contactType",
        key: "contactType",
        width: "12%",
        slots: {
          customRender: "contactType",
        },
      },
      {
        title: "Preferred time of day for contact",
        dataIndex: "contactTime",
        key: "contactTime",
        width: "12%",
        slots: {
          customRender: "contactTime",
        },
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
        width: "6%",
      },
      {
        title: "Relation",
        dataIndex: "relation",
        key: "relation",
        width: "6%",
      },
      {
        title: "Is Primary",
        dataIndex: "isPrimary",
        key: "isPrimary",
        width: "7%",
      },
      {
        title: "Action",
        dataIndex: "action",
        className: "doc-actions",
        slots: {
          customRender: "action",
        },
        width: "5%",
      },
    ];
    
    const familyMembersList = computed(() => {
      return store.state.patients.familyMembersList
    })

    const editFamilyMember = (value) => {
      store.dispatch("familyMemberDetails", {
        patientUdid: patientUdid,
        familyUdid: value,
      })
      .then(() => {
        addFamilyMembersVisible.value = true
      });
    };

    const deleteFamilyMember = (value) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteFamilyMember", {
            patientUdid: patientUdid,
            familyUdid: value,
          })
          .then(() => {
            if (route.name == "PatientSummary") {
              store.dispatch('patientDetails', patientUdid)
              store.dispatch("familyMembersList", patientUdid);
              if(familyMembersList.value.length <= 1) {
                emit('closeModal', {
                  modal: 'familyMembersList',
                  value: false
                })
              }
            }
          });
        }
      });
    };

    const handleOk = ({modal, value}) => {
      if(modal && value) {
        addFamilyMembersVisible.value = modal == 'addFamilyMember' ? value : false;
      }
      else {
        addFamilyMembersVisible.value = false;
      }
    }

    return {
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
      actionTrack,
      paramsId:route.params.udid,
      familyMembersColumns,
      familyMembersList,
      editFamilyMember,
      deleteFamilyMember,
      addFamilyMembersVisible,
      handleOk,
    };
  },
};
</script>