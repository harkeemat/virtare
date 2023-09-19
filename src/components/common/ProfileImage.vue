<template>
<div v-bind:class="patientSection">
    <div class="patientSectionInner">
        <div v-bind:class="patientImg">
            <div class="patientImgInner">
                <div class="image-section" v-if="hideEditIcon == false">
                    <img v-if="isPicuteLoading" class="picture-loader" src="@/assets/images/loader.gif" />
                    <img v-if="patientDetails.profilePhoto && !isPicuteLoading" class="ant-upload-text" :src="patientDetails.profilePhoto" alt="image" />
                    <img v-else-if="imageUrl && !isPicuteLoading" :src="imageUrl" alt="avatar" class="ant-upload-text" />
                    <img v-else-if="!isPicuteLoading" src="@/assets/images/userAvatar.png" alt="image" />
                </div>

                <div class="button-section" v-if="hideEditIcon == false">
                    <a-upload :show-upload-list="false" @change="handleChange">
                        <div class="button-details">
                            <a class="edit-button" v-if="isLeft == true">
                                <span class="edit-icon">
                                    <EditOutlined />
                                </span>
                                <span class="edit-text"> Change Image </span>
                            </a>
                        </div>
                    </a-upload>
                </div>
            </div>
            <div class="image-section" v-if="hideEditIcon == true">
                <img v-if="patientDetails.profilePhoto" class="ant-upload-text" :src="patientDetails.profilePhoto" alt="image" />
            </div>
        </div>

        <div v-bind:class="patientInfo">
            <div class="info">
                <span v-if="patientDetails.patientFullName">
                    <p v-if="isLeft == true">
                        Name: {{ patientDetails.patientFullName }}
                    </p>
                    <h2 v-else>
                      <!-- {{ patientDetails.patientFullName }} -->
                      <router-link @click="closeMdl()" :to="{ name: 'PatientSummary', params: { udid: patientDetails.id } }">{{ patientDetails.patientFullName }}</router-link>
                    </h2>
                </span>
                <p v-if="patientDetails?.nickName">
                    Nick Name : {{ patientDetails?.nickName }}
                </p>
                <p v-if="patientDetails.patientDob">
                    DOB : {{ showDate(patientDetails?.patientDob) }}
                </p>
                <p v-if="patientDetails.medicalRecordNumber">
                    MRN : {{ patientDetails.medicalRecordNumber }}
                </p>
                <p class="overflow-wrap" v-if="patientDetails.email != ''">
                    <a @click="actionTrack(paramsId, 321, 'patient')" v-if="arrayToObjact(screensPermissions, 321)" :href="`mailto:${patientDetails.email}`">
                        <MailOutlined /> {{ patientDetails?.email?patientDetails?.email:'' }}</a>
                </p>
                <p v-if="patientDetails.phoneNumber != ''">
                    <span @click="actionTrack(paramsId, 322, 'patient')" v-if="arrayToObjact(screensPermissions, 322)" >
                        <PhoneOutlined :rotate="90" />
                        {{ patientDetails.phoneNumber }}</span>
                </p>
                <p v-if="patientDetails.address">
                    <HomeOutlined />
                    <span class="address-text">{{ patientDetails.address }}</span>
                </p>
                <p class="roundBorder" v-if="patientDetails.isApp">
                  <span>SNF Patient</span>
                </p>
            </div>
        </div>

        <div :class="patientIcons" v-if="
                isLeft == true &&
                (arrayToObjact(screensPermissions, 63) ||
                  arrayToObjact(screensPermissions, 63))
              " >
            <a-tooltip placement="top">
                <template #title>
                    <span>Reset Password</span>
                </template>
                <a class="resetPass">
                    <KeyIcon  height=20 width=20 alt="Reset Password" @click="resetPasseord(patientDetails.id)" />
                </a>
            </a-tooltip>
            <a-tooltip placement="top" class="editIcon">
                <template #title>
                    <span>Edit</span>
                </template>
                <a>
                    <EditOutlined @click="
                editPatient({ udid: patientDetails.id, id: patientDetails.id });
                actionTrack(paramsId, 301, 'patient');
              " v-if="
                isLeft == true &&
                (arrayToObjact(screensPermissions, 63) ||
                  arrayToObjact(screensPermissions, 63))
              " />
                </a>
            </a-tooltip>
        </div>
    </div>
    <div class="buttonGroup" v-if="programsPatient && programsPatient.length > 0" v-bind:class="patientPrograms">
        <div class="patientPrograms" v-for="program in programsPatient" :key="program.id">
            <span class="programText" v-if="program.status=='Active'">
                {{ program.program.split(" - ")[0] }}
            </span>
        </div>
    </div>
    <!-- For location  -->
    <!-- <div class="buttonGroup"  v-bind:class="patientPrograms">
        <div class="patientPrograms">
            <span class="programText" @click="location()">
                {{ 'Chandigarh' }}
            </span>
        </div>
    </div> -->
</div>
<Location v-if="modalLocationVisible" v-model:visible="modalLocationVisible"  @closeModal="closeLocationModal"  />
<ImageCropper v-if="modalVisible" v-model:visible="modalVisible" :imageUrl="imageinCropper" @closeModal="closeImageModal" @crop="updateProfileImage" />
</template>
<script>
import { ref, defineAsyncComponent, computed, defineComponent } from "vue-demi";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  // KeyOutlined
} from "@ant-design/icons-vue";
import { actionTrack, arrayToObjact } from "@/commonMethods/commonMethod";
// import ResetPassword from "@/components/reset-password/modal/ResetPassword";
import { messages } from "@/config/messages";
import { warningSwal,showDate } from "@/commonMethods/commonMethod";
import KeyIcon from "@/components/common/KeyIcon";
import Location from "@/components/common/Locations.vue";
export default defineComponent({
  props: {
    isLeft: {
      type: Boolean,
    },
    hideEditIcon: Boolean,
    patientUdid: Number,
  },
  components: {
    // ResetPassword:defineAsyncComponent(()=>import("@/components/reset-password/modal/ResetPassword")),
    // KeyOutlined,
    KeyIcon,
    Location,
    MailOutlined,
    EditOutlined,
    PhoneOutlined,
    HomeOutlined,
    ImageCropper: defineAsyncComponent(() =>
      import("@/components/common/ImageCropper")
    ),
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const modalVisible = ref(false);
    const resetPasswordVisible = ref(false)
    const modalLocationVisible = ref(false)
    const patientId = props.patientUdid ? props.patientUdid : route.params.udid;

    const isPicuteLoading = computed(() => {
      return store.state.patients.isPicuteLoading;
    });

    const editPatient = ({ udid, id }) => {
      emit("onEditPatient", {
        udid,
        id,
      });
    };

    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });

    const programsPatient = computed(() => {
      return store.state.patients.program;
    });

    const imageinCropper = ref("");
    const imageUrl = ref("");
    const fileName = ref("");

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

    const updateProfileImage = (dataURL) => {
      var file = dataURLtoFile(dataURL, fileName.value);
      let formData = new FormData();
      formData.append("file", file);

      store
        .dispatch("updateProfileImage", {
          formData: formData,
          patientUdid: patientId,
        })
        .then(() => {
          store.dispatch("patientDetails", patientId).then(() => {
            imageUrl.value = patientDetails.value?.profilePhoto;
            
            store.commit("uploadFile", null);
            store.commit("errorMsg", null);
            store.commit("loadingStatus", false);
          });
          setTimeout(() => {
            store.commit("isPicuteLoading", false);
          }, 2500);
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

    const resetPasseord = (id) => {
      warningSwal(messages.resetPassword).then((response) => {
        if (response == true) {
          store.dispatch("passwordReset", {
            endPoint: "patient",
            id: id,
          });
        } else {
          // emit("saveModal", true);
        }
      });
    };

    const saveModal = (value) => {
      resetPasswordVisible.value = value;
    };

    const closeMdl = () =>{
      store.commit('closeStaffDetailsModal')
      store.commit('closePatientDetailsModal')
    }

    function location () {
      modalLocationVisible.value = true
    }
    function closeLocationModal (value) {
      modalLocationVisible.value = value
    }

    return {
      closeLocationModal,
      location,
      modalLocationVisible,
      closeMdl,
      saveModal,
      resetPasseord,
      resetPasswordVisible,
      screensPermissions: store.getters.screensPermissions,
      paramsId: patientId,
      imageinCropper,
      imageUrl,
      handleChange,
      modalVisible,
      updateProfileImage,
      closeImageModal,
      arrayToObjact,
      actionTrack,
      editPatient,
      patientDetails,
      isPicuteLoading,
      programsPatient,
      patientImg: props.isLeft ? "patientImg" : "",
      patientSection: props.isLeft ? "patientSection" : "sectionPatient",
      patientInfo: props.isLeft ? "patientInfo" : "",
      patientIcons: props.isLeft ? "patientIcons" : "iconsPatient",
      patientPrograms: props.isLeft ? "patientPrograms" : "",
      showDate
    };
  },
});
</script>

<style lang="scss" scoped>
.resetPass { 
  img {
    width: 20px;
    height: auto !important;
  }
}

span.anticon.anticon-plus {
  position: relative;
  top: -2px;
}

.button-details {
  position: relative !important;
  top: 0;
  text-align: center;
}

.patientSectionInner {
  display: flex;
}

span.edit-icon {
  position: relative;
  top: -1px;
  font-size: 12px;
}

.patientImg {
  border-bottom: none !important;
}

.patientInfo {
  padding: 20px 15px 0 0 !important;
}

.patientSection {
  margin: 0 !important;
  padding: 0 0 10px 0 !important;
  background-color: #daeedb;
}

.patientIcons, .iconsPatient {
  position: absolute;
  left: 15px;
  top: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  right: 15px;
}

.patientSection .patientSectionInner {
  display: flex;
}

.patientPrograms {
  padding: 10px 10px 0 0;
  text-align: right;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.programText {
  border: 1px solid #000;
  border-radius: 50px;
  padding: 7px 17px;
  margin-top: 5px;
  margin-left: 2px;
}

.image-section img {
  min-width: 80px;
  min-height: 80px;
  max-width: 80px;
  max-height: 80px;
}

.patientInfo .sectionPatient {
  display: flex;
  flex-direction: column;
}

.patientInfo .buttonGroup {
  display: flex;
  // margin-bottom: 20px;
  justify-content: flex-end;
}
.roundBorder {
  background-color: #d8f3f3;
  border: 1px solid #78e0e0;
  border-radius: 50px;
  width: fit-content;
  padding: 5px 15px;
  margin-top: 15px;
}
</style>
