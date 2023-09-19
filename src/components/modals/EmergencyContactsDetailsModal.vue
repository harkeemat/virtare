<template>
  <a-modal width="98%" title="Emergency Contacts" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table class="sortIconTable"
          rowKey="id"
          :columns="emergencyContactsColumns"
          :data-source="emergencyContactsList"
          :scroll="{ x: 1100 }"
          :pagination="false"
        >
          <template #contactTime="{ record }">
            <template
              v-for="contactTime in record.contactTime"
              :key="contactTime.id"
            >
              <p v-if="contactTime == '16'">Morning</p>
              <p v-if="contactTime == '17'">Afternoon</p>
              <p v-if="contactTime == '18'">Evening</p>
            </template>
          </template>

          <template #contactType="{ record }">
            <template
              v-for="contactType in record.contactType"
              :key="contactType.id"
            >
              <p v-if="contactType == '13'">Email</p>
              <p v-if="contactType == '14'">Phone</p>
              <p v-if="contactType == '15'">Text</p>
            </template>
          </template>
          <template #action="{ record }">
            <a class="icons" v-if="arrayToObjact(screensPermissions,309)"
              ><EditOutlined @click="editEmergencyContact(record.id); actionTrack(paramsId,309,'patient')"
            /></a>
            <a class="icons" v-if="arrayToObjact(screensPermissions,310)"
              ><DeleteOutlined @click="deleteEmergencyContact(record.id); actionTrack(paramsId,310,'patient')"
            /></a>
          </template>
        </a-table>
        <Loader />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import // computed,
// reactive
"vue-demi";
import { useStore } from "vuex";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { warningSwal, actionTrack,arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import Loader from "@/components/loader/Loader.vue";
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

    const emergencyContactsList = computed(() => {
      return store.state.patients.emergencyContactsList
    })

    const emergencyContactsColumns = [
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
      // {
      //   title: "Is Primary",
      //   dataIndex: "isPrimary",
      //   key: "isPrimary",
      //   /* slots: {
			// 		customRender: "isPrimary"
			// 	}, */
      // },
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

    // const globalCode = computed(() => {
    //   return store.state.common;
    // });

    const editEmergencyContact = (value) => {
      store
        .dispatch("emergencyContactDetails", {
          patientUdid: patientUdid,
          contactUdid: value,
        })
        .then(() => {
          emit("isEmergencyContactEdit");
        });
    };

    const deleteEmergencyContact = (value) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store
            .dispatch("deleteEmergencyContact", {
              patientUdid: patientUdid,
              contactUdid: value,
            })
            .then(() => {
              if (route.name == "PatientSummary") {
                store.dispatch("emergencyContactsList", patientUdid);
              }
              if(emergencyContactsList.value.length <= 1) {
                emit("closeModal", {
                  modal: 'emergencyContactsList',
                  value: false
                });
              }
            });
        }
      });
    };

    // const contactTypes = globalCode.value.pmOfcontact.globalCode

    return {
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      actionTrack,
      paramsId:route.params.udid,
      emergencyContactsColumns,
      emergencyContactsList,
      editEmergencyContact,
      deleteEmergencyContact,
    };
  },
};
</script>