<template>
    <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle">Profile Setup</h2>
            </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :sm="7" :xs="24">
                <div class="patientInfo">
                    <a-tooltip placement="top" class="resetPass">
                        <template #title>
                            <span>Reset Password</span>
                        </template>
                        <a>
                            <KeyIcon height=23 width=23 alt="Reset Password" @click="resetPassword()" />
                        </a>
                    </a-tooltip>
                    <a-tooltip placement="top" class="editIcon">
                        <template #title>
                            <span>Edit</span>
                        </template>
                        <a>
                            <EditOutlined @click="editStaff()" v-if="arrayToObjact(screensPermissions,38)" />
                        </a>
                    </a-tooltip>
                    <div class="patientImg">
                        <!-- <img v-if="getstaffSummary.profilePhoto" :src="getstaffSummary.profilePhoto" alt="image"/> -->
                        <div>
                            <!-- <img src="@/assets/images/userAvatar.png" alt="image" /> -->
                            <img v-if="getstaffSummary?.profilePhoto" :src="getstaffSummary?.profilePhoto" alt="avatar" class="ant-upload-text" />
                            <img v-else src="@/assets/images/userAvatar.png" alt="image" />
                            <div class="button-section">
                                <a-upload :show-upload-list="false" @change="handleChange">
                                    <div class="button-details">
                                        <a class="edit-button">
                                            <span class="edit-icon">
                                                <EditOutlined />
                                            </span>
                                            <span class="edit-text"> Change Image </span>
                                        </a>
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                        <!-- <img src="../../assets/images/profile-4.jpg" alt="image" /> -->
                        <div class="info" v-if="getstaffSummary">
                            <p>Name: {{getstaffSummary?.fullName}}</p>
                            <p class="overflow-wrap" :title="getstaffSummary?.email"><a :href="`mailto:${getstaffSummary?.email}`">
                                    <MailOutlined /> {{ getstaffSummary?.email?getstaffSummary?.email:'' }}</a></p>
                            <p>
                                <!-- <a v-if="getstaffSummary.extension" :href="`tel:${getstaffSummary.phoneNumber+getstaffSummary.extension}`">
                                        <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }} {{getstaffSummary?.extension?'('+getstaffSummary.extension+')':''}}
                                    </a>
                                    <a v-else :href="`tel:${getstaffSummary.phoneNumber}`">
                                        <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }}
                                    </a> -->
                                <span v-if="getstaffSummary.extension">
                                    <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }} {{getstaffSummary?.extension?'('+getstaffSummary.extension+')':''}}
                                </span>
                                <span v-else>
                                    <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }}
                                </span>
                            </p>
                        </div>
    
                    </div>
    
                    <div class="pat-profile" v-if="getstaffSummary">
                        <!-- <div class="pat-profile-inner">
                            <div class="thumb-head">Level</div>
                            <div class="thumb-desc">{{getstaffSummary?getstaffSummary.level:''}}</div>
                        </div> -->
                        <div class="pat-profile-inner">
                          <div class="thumb-head">Provider(s)</div>
                          <div class="thumb-desc">{{ getstaffSummary.providerName != "" ? getstaffSummary.providerName : 'Virtare' }}</div>
                        </div>
                        <div class="pat-profile-inner">
                            <div class="thumb-head">Gender</div>
                            <div class="thumb-desc">{{getstaffSummary.gender}}</div>
                        </div>
                        <div class="pat-profile-inner">
                            <div class="thumb-head">Specialization</div>
                            <div class="thumb-desc">{{getstaffSummary.specialization}}</div>
                        </div>
                        <div class="pat-profile-inner">
                            <div class="thumb-head">Network</div>
                            <div class="thumb-desc">{{getstaffSummary.network}}</div>
                        </div>
                        <div class="pat-profile-inner" v-if="getstaffSummary?.role?.length>0">
                            <div class="thumb-head">Role</div>
                            <a-tooltip placement="bottom">
                              <template #title>
                                <span v-for="(role,i) in getstaffSummary?.role" :key="i">{{ i!=0? ", ":''}} {{  role?.name}} </span> 
                              </template>
                              <div class="thumb-desc"><span v-for="(role,i) in getstaffSummary?.role" :key="i">{{ i!=0? ", ":''}} {{  role?.name}} </span> </div>
                            </a-tooltip>
                        </div>
                        <div class="pat-profile-inner">
                            <div class="thumb-head">Status</div>
                            <div class="thumb-desc">{{getstaffSummary?getstaffSummary.isActive==true?'Active':'Inactive':''}}</div>
                        </div>
                        <div class="pat-profile-inner">
                            <div class="thumb-head">Group(s)</div>
                            <div class="thumb-desc">{{ getstaffSummary?.groupName? getstaffSummary?.groupName:'N/A' }}</div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :sm="17" :xs="24">
    
                <div class="summary-tabs">
                    <a-tabs v-model:activeKey="activeKey1">
                        <a-tab-pane key="1" tab="Appointments">
                            <!-- AppointmentTable Table -->
                            <AppointmentTable v-if="activeKey1=='1'" />
                            <!-- <Loader /> -->
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Patients">
                            <!-- PatientTable Table -->
                            <PatientTable v-if="activeKey1=='2'" />
                            <Loader />
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Availability">
                            <a-row :gutter="24" v-if="activeKey1=='3'">
                                <a-col :sm="24" :xs="24">
                                    <div class="common-btn mb-24">
                                        <a-button class="btn blackBtn" @click="showModalvailability" v-if="arrayToObjact(screensPermissions,51)">
                                            <PlusOutlined />
                                        </a-button>
                                    </div>
                                </a-col>
                                <a-col :span="24">
                                    <!--Availability Table -->
                                    <AvailabilityTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="4" tab="Emergency Contacts">
                            <a-row :gutter="24" v-if="activeKey1=='4'">
                                <a-col :span="24">
                                    <div class="common-btn mb-24" v-if="arrayToObjact(screensPermissions,47)">
                                        <a-button class="btn blackBtn" @click="showModalContact">
                                            <PlusOutlined />
                                        </a-button>
                                    </div>
                                </a-col>
                                <a-col :span="24">
                                    <!-- Contacts Table -->
                                    <ContactTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="5" tab="Roles" v-if="role.user.staff.id!=paramId">
                            <a-row :gutter="24" v-if="activeKey1=='5'">
                                <a-col :sm="24" :xs="24">
                                    <div class="common-btn mb-24">
                                        <a-button class="btn blackBtn" @click="showModalRole" v-if="arrayToObjact(screensPermissions,55)">
                                            <PlusOutlined />
                                        </a-button>
                                    </div>
                                </a-col>
                                <a-col :span="24">
                                    <!-- Roles Table -->
                                    <RoleTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="6" tab="Documents">
                            <a-col :sm="24" :xs="24" v-if="activeKey1=='6'">
                                <div class="common-btn mb-24">
                                    <a-button class="btn blackBtn" @click="showDocModal" v-if="arrayToObjact(screensPermissions,59)">
                                        <PlusOutlined />
                                    </a-button>
                                </div>
                            </a-col>
                            <a-row :gutter="24" v-if="activeKey1=='6'">
                                <a-col :sm="24" :xs="24">
                                    <!-- Documents Table -->
                                    <DocumentTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                         <!--Questionnaire assigned table -->
                        <!-- <a-tab-pane key="7" tab="Assigned Questionnaire">
                            <a-row :gutter="24" v-if="activeKey1=='7'">       
                                        <QuestionnaireTemplate   :entityType="246" @is-visible="emitFunction" :userId="paramId"/>
                            </a-row>
                        </a-tab-pane> -->
                        <!-- Questionnaire complete table -->
                           <!-- <a-tab-pane key="8" tab="Complete Questionnare">
                            <a-row :gutter="24" v-if="activeKey1=='8'">
                                        <QuestionnaireResult  :userId="paramId" :entityType="246" />
                            </a-row>
                        </a-tab-pane> -->
                        <!-- <a-tab-pane key="9" tab="Locations" v-if="role.user.staff.id!=paramId && (arrayToObjact(screensPermissions, 479) || arrayToObjact(screensPermissions, 480))">
                            <a-row :gutter="24" v-if="activeKey1=='9'">
                                <a-col :sm="24" :xs="24" v-if="arrayToObjact(screensPermissions, 480)">
                                    <div class="common-btn mb-24">
                                        <a-button class="btn blackBtn" @click="showAddLocationModal" v-if="arrayToObjact(screensPermissions, 55)">
                                          <PlusOutlined />
                                        </a-button>
                                    </div>
                                </a-col>
                                <a-col :sm="24" :xs="24" v-if="arrayToObjact(screensPermissions, 479)">
                                    <StaffLocationsTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane> -->
                        <!-- <a-tab-pane key="10" tab="Programs" v-if="role.user.staff.id!=paramId && (arrayToObjact(screensPermissions, 482) || arrayToObjact(screensPermissions, 483))">
                            <a-row :gutter="24" v-if="activeKey1=='10'">
                                <a-col :sm="24" :xs="24" v-if="arrayToObjact(screensPermissions, 483)">
                                    <div class="common-btn mb-24">
                                        <a-button class="btn blackBtn" @click="showAddProgramModal" v-if="arrayToObjact(screensPermissions, 55)">
                                            <PlusOutlined />
                                        </a-button>
                                    </div>
                                </a-col>
                                <a-col :sm="24" :xs="24" v-if="arrayToObjact(screensPermissions, 482)">
                                    <StaffProgramsTable />
                                    <Loader />
                                </a-col>
                            </a-row>
                        </a-tab-pane> -->
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
    </div>
    <ImageCropper v-if="modalVisible" v-model:visible="modalVisible" :imageUrl="imageinCropper" @closeModal="closeImageModal" @crop="updateStaffProfileImage" />
    <!--modals-->
    <a-modal width="50%" v-model:visible="visibleStaffDoc" title="Add Documents" :maskClosable="false" centered @cancel="staffDocCloseModal()" :footer="false">
        <StaffDocumentForm :clearData="clearData" ref="StaffDocumentForm" entity="staff" :paramId="paramId" @saveModal="staffDocCloseModal()" />
    </a-modal>
    <!---->
    <a-modal class="modalH-auto" width="40%" v-model:visible="visibleRole" title="Add Roles" :maskClosable="false" centered @cancel="roleCloseModal('visibleRole')" :footer="false">
        <RoleForm :clearData="clearData" :paramId="paramId" @saveModal="roleCloseModal()" />
    </a-modal>
    <!------>
    <a-modal class="modalH-auto" width="40%" v-model:visible="visibleAvailability" title="Add Availability" :maskClosable="false" centered @cancel="availabilityCloseModal()" :footer="false">
        <AvailabilityForm :clearData="clearData" :paramId="paramId" @saveModal="availabilityCloseModal()" />
    </a-modal>
    <!---->
    <a-modal width="60%" v-model:visible="visibleContact" title="Add Emergency Contact" :maskClosable="false" centered @cancel="contactCloseModal('visibleContact')" :footer="false">
        <ContactForm :clearData="clearData" :paramId="paramId" @saveModal="contactCloseModal()" />
    </a-modal>
    <AddStaffLocationsModal v-if="addStaffLocationModalVisible" v-model:visible="addStaffLocationModalVisible" @closeModal="closeModal($event)" />
    <AddStaffProgramsModal v-if="addStaffProgramModalVisible" v-model:visible="addStaffProgramModalVisible" />
    <!---->
    <ResetPassword v-model:visible="resetPasswordVisible" @saveModal="saveModal($event)" endPoint="staff" :id="paramId" />
    <PersonalInformation v-if="visibleEditStaff" v-model:visible="visibleEditStaff" @saveModal="editStaffCloseModal($event)" :staffType="342" />
    <TableLoader />
    </template>
    <script>
    import {
      ref,
      computed,
      watchEffect,
      onUnmounted,
      defineAsyncComponent,
      defineComponent,
      onMounted,
    } from "vue";
    import {
      // DeleteOutlined,
      EditOutlined,
      PlusOutlined,
      MailOutlined,
      PhoneOutlined,
      // KeyOutlined
    } from "@ant-design/icons-vue";
    import { useStore } from "vuex";
    import { useRoute } from "vue-router";
    
    import AppointmentTable from ".././care-coordinator/tables/AppointmentTable";
    import PatientTable from ".././care-coordinator/tables/PatientTable";
    import AvailabilityTable from ".././care-coordinator/tables/AvailabilityTable";
    import AvailabilityForm from ".././modals/forms/Availability";
    import ContactTable from ".././care-coordinator/tables/ContactTable";
    import ContactForm from ".././modals/forms/Contacts";
    import RoleTable from ".././care-coordinator/tables/RoleTable";
    import RoleForm from ".././modals/forms/Roles";
    import DocumentTable from ".././care-coordinator/tables/DocumentTable";
    // import StaffLocationsTable from "@/components/coordinator-summary/tables/StaffLocationsTable";
    // import StaffProgramsTable from "@/components/coordinator-summary/tables/StaffProgramsTable";
    import StaffDocumentForm from ".././modals/forms/StaffDocuments";
    import Loader from "../loader/Loader";
    import TableLoader from "../loader/TableLoader";
    // import QuestionnaireResult from "@/components/common/questionnaire/QuestionnaireResult";
    
    import { arrayToObjact } from "@/commonMethods/commonMethod";
    import PersonalInformation from ".././modals/forms/StaffPersonalInfo";
    import { warningSwal } from "@/commonMethods/commonMethod";
    import { messages } from "@/config/messages";
    import KeyIcon from "@/components/common/KeyIcon";
    // import ResetPassword from "@/components/reset-password/modal/ResetPassword";
    import AddStaffLocationsModal from "@/components/modals/AddStaffLocationsModal";
    import AddStaffProgramsModal from "@/components/modals/AddStaffProgramsModal";
    
    export default defineComponent({
      components: {
        ImageCropper: defineAsyncComponent(() =>
          import("@/components/common/ImageCropper")
        ),
        ResetPassword: defineAsyncComponent(() =>
          import("@/components/reset-password/modal/ResetPassword")
        ),
        // QuestionnaireTemplate: defineAsyncComponent(() =>
        //   import("@/components/common/questionnaire/Questionnaire")
        // ),
        // KeyOutlined,
        KeyIcon,
        // DeleteOutlined,
        EditOutlined,
        PlusOutlined,
        AppointmentTable,
        PatientTable,
        AvailabilityForm,
        AvailabilityTable,
        ContactTable,
        ContactForm,
        DocumentTable,
        // StaffLocationsTable,
        // StaffProgramsTable,
        StaffDocumentForm,
        RoleTable,
        RoleForm,
        Loader,
        PersonalInformation,
        MailOutlined,
        PhoneOutlined,
        TableLoader,
        // QuestionnaireResult,
        AddStaffLocationsModal,
        AddStaffProgramsModal,
      },
      setup(props, { emit }) {
        const store = useStore();
        const router = useRoute();
        const clearData = ref(false);
        const resetPasswordVisible = ref(false);
        const modalVisible = ref(false);
        const addStaffLocationModalVisible = ref(false);
        const addStaffProgramModalVisible = ref(false);
        const fileName = ref();
        const imageinCropper = ref();
        const role = JSON.parse(localStorage.getItem("auth"));
        onMounted(() => {
        //   store.dispatch("staffProviders", router.params.udid);
        //   store.dispatch("orderTable", {
        //     data: "&orderField=&orderBy=",
        //   });
        });
        watchEffect(() => {
          if (router.params.udid && router.name == "Profile") {
            store.dispatch("staffSummary", router.params.udid);
            store.dispatch("availabilityList", router.params.udid);
            store.dispatch("staffContactList", router.params.udid);
            store.dispatch("roleList", router.params.udid);
            store.dispatch("staffDocuments", router.params.udid);
            store.dispatch("staffSummaryAppointment", router.params.udid);
            store.dispatch("staffSummaryPatient", {
              id: router.params.udid,
              data: "?page=",
            });
            //store.dispatch("assignAllTemplates",'?referenceId='+router.params.udid+'&entityType='+props.entityType);
          }
        });
    
        const staffs = computed(() => {
          return store.state.careCoordinator;
        });
    
        const getstaffSummary = computed(() => {
          return store.state.careCoordinatorSummary.staffSummary;
        });
    
        const visibleStaffDoc = ref(false);
        const visibleRole = ref(false);
        const visibleAvailability = ref(false);
        const visibleContact = ref(false);
    
        const visibleEditStaff = ref(false);
        const editStaff = () => {
          store.commit("errorMsg", null);
          visibleEditStaff.value = true;
        };
    
        const editStaffCloseModal = (value) => {
          visibleEditStaff.value = value;
        };
    
        const staffDocCloseModal = () => {
          store.commit("errorMsg", null);
          visibleStaffDoc.value = true;
          if (checkChangedInput.value) {
            warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                visibleStaffDoc.value = false;
                store.commit("checkChangeInput", false);
                clearData.value = true;
              } else {
                visibleStaffDoc.value = true;
              }
            });
          } else {
            visibleStaffDoc.value = false;
          }
        };
    
        const roleCloseModal = () => {
          visibleRole.value = true;
          if (checkChangedInput.value) {
            warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                visibleRole.value = false;
                store.commit("checkChangeInput", false);
                clearData.value = true;
              } else {
                visibleRole.value = true;
              }
            });
          } else {
            visibleRole.value = false;
            store.dispatch("staffSummary", router.params.udid);
          }
        };
    
        const checkChangedInput = computed(() => {
          return store.state.common.checkChangeInput;
        });
    
        const availabilityCloseModal = () => {
          visibleAvailability.value = true;
          if (checkChangedInput.value) {
            warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                visibleAvailability.value = false;
                store.commit("checkChangeInput", false);
                clearData.value = true;
              } else {
                visibleAvailability.value = true;
              }
            });
          } else {
            visibleAvailability.value = false;
          }
        };
    
        const contactCloseModal = () => {
          visibleContact.value = true;
          if (checkChangedInput.value) {
            warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                visibleContact.value = false;
                store.commit("checkChangeInput", false);
                clearData.value = true;
              } else {
                visibleContact.value = true;
              }
            });
          } else {
            visibleContact.value = false;
          }
          store.commit("errorMsg", null);
        };
    
        const showDocModal = () => {
          store.commit("errorMsg", null);
          store.state.careCoordinator.documentStaffDetails = null;
          visibleStaffDoc.value = true;
          clearData.value = false;
          store.commit("clearStaffFormValidation", false);
        };
    
        const showModalRole = () => {
          store.commit("errorMsg", null);
          visibleRole.value = true;
          clearData.value = false;
          store.commit("clearStaffFormValidation", false);
        };
        const showModalvailability = () => {
          store.commit("errorMsg", null);
          visibleAvailability.value = true;
          clearData.value = false;
          store.commit("clearStaffFormValidation", false);
        };
        const showModalContact = () => {
          store.commit("errorMsg", null);
          visibleContact.value = true;
          clearData.value = false;
          store.commit("clearStaffFormValidation", false);
        };
    
        const handleOk = (e) => {
          console.log(e);
          visibleStaffDoc.value = false;
        };
    
        const checkFieldsData = computed(() => {
          return store.state.common.checkChangeInput;
        });
    
        function closeModal(value) {
          if (checkFieldsData.value) {
            warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                emit("saveModal", false);
                clearData.value = true;
                //   emit("reset")
                //   Object.assign();
                store.dispatch("allStaffList");
                store.commit("checkChangeInput", false);
                store.commit("clearStaffFormValidation", true);
                store.state.careCoordinator.addStaff = null;
              } else {
                emit("saveModal", true);
                if (value == "visibleAvailability") {
                  visibleAvailability.value = true;
                  clearData.value = false;
                } else if (value == "visibleContact") {
                  visibleContact.value = true;
                } else if (value == "visibleStaffDoc") {
                  visibleStaffDoc.value = true;
                } else {
                  visibleRole.value = true;
                }
              }
            });
          } else {
            store.commit("clearStaffFormValidation", true);
          }
        }
        onUnmounted(() => {
          store.state.questionnaireTemplate.questionnaireResponseDetails = null;
          store.state.questionnaireTemplate.detailsQuestionnaireTemplate = null;
          store.state.questionnaireTemplate.templateDetailsList = [];
          store.state.questionnaireTemplate.assignAllTemplates = [];
          store.commit("clearStaffFormValidation", false);
          store.dispatch("orderTable", {
            data: "&orderField=&orderBy=",
          });
        });
    
        const resetPassword = () => {
          resetPasswordVisible.value = true;
        };
    
        const saveModal = (value) => {
          resetPasswordVisible.value = value;
        };
        function emitRecords() {
          store.dispatch("assignAllTemplates", {
            id: router.params.udid,
            entityType: 246,
          });
        }
    
        const showAddLocationModal = () => {
          addStaffLocationModalVisible.value = true;
        };
    
        const showAddProgramModal = () => {
          addStaffProgramModalVisible.value = true;
        };
    
        function getBase64(img, callback) {
          const reader = new FileReader();
          reader.addEventListener("load", () => callback(reader.result));
          reader.readAsDataURL(img);
        }
    
        const handleChange = (info) => {
          store.commit("uploadFile", null);
          store.commit("errorMsg", null);
          fileName.value = info.file.name;
          getBase64(info.file.originFileObj, (base64Url) => {
            imageinCropper.value = base64Url;
          });
          modalVisible.value = true;
        };
    
        const updateStaffProfileImage = (dataURL) => {
          var file = dataURLtoFile(dataURL, fileName.value);
          let formData = new FormData();
          formData.append("file", file);
    
          store
            .dispatch("updateStaffProfileImage", {
              formData: formData,
              id: router.params.udid,
            })
            .then(() => {
              store.dispatch("staffSummary", router.params.udid);
            });
        };
    
        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
    
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {
            type: mime,
          });
        }
    
        const closeImageModal = () => {
          modalVisible.value = false;
        };
    
        return {
          closeImageModal,
          modalVisible,
          imageinCropper,
          fileName,
          updateStaffProfileImage,
          handleChange,
          showAddLocationModal,
          showAddProgramModal,
          addStaffLocationModalVisible,
          addStaffProgramModalVisible,
          resetPassword,
          resetPasswordVisible,
          saveModal,
          clearData,
          roleCloseModal,
          contactCloseModal,
          availabilityCloseModal,
          staffDocCloseModal,
          closeModal,
          editStaffCloseModal,
          editStaff,
          visibleEditStaff,
          screensPermissions: store.getters.screensPermissions,
          arrayToObjact,
          paramId: router.params.udid,
          staffs,
          getstaffSummary,
          activeKey: ref("1"),
          activeKey1: ref("1"),
          visibleStaffDoc,
          visibleRole,
          visibleAvailability,
          visibleContact,
          showDocModal,
          showModalRole,
          showModalvailability,
          showModalContact,
          handleOk,
          role,
          emitRecords,
        };
      },
    });
    </script>
    
    
    <style lang="scss" scoped>
    .resetPass {
      position: absolute;
      left: 10px;
      top: 13px;
      z-index: 1;
    }
    .editIcon {
      position: absolute;
      right: 10px;
      top: 13px;
      z-index: 1;
      span {
        font-size: 23px;
      }
    }
    .patientImg {
      background-color: #daeedb;
    }
    .noData {
        height: calc(100vh - 88px);
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    </style>
    