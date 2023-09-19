<template>
    <a-form class="common-form" ref="formRef" :label-col="{ span: 24 }" :wrapper-col="wrapperCol" @finish="submitForm" :model="reviewVitalsForm">
        <div class="drawerBody">
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-typography-title :level="2" class="common-heading">{{ store.state.careCoordinator.staffDetail?.fullName }}</a-typography-title>
                </a-col>

                <a-col :span="24">
                    <div class="staffDetailView">
                        <a-row :gutter="[48, 16]">
                            <a-col :span="12">
                                <a-form-item label="Email">
                                    <InputFields :value="store.state.careCoordinator.staffDetail?.email" style="width: 100%" disabled />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Phone Number">
                                    <InputFields :value="store.state.careCoordinator.staffDetail?.phoneNumber" style="width: 100%" disabled />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Clients">
                                    <InputFields :value="store.state.careCoordinator.staffDetail?.client" style="width: 100%" disabled />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="Status">
                                    <InputFields value="Active" style="width: 100%" disabled />
                                </a-form-item>
                            </a-col>
                            <!-- <a-col :span="12">
                                <a-form-item label="Appointments">
                                    <InputFields value="14" style="width: 100%; color: blue; cursor: pointer" disabled />
                                </a-form-item>
                            </a-col> -->
                            <!-- <a-col :span="12">
                                <a-form-item label="Patients" @click="patientsCall">
                                    <InputFields value="40" style="width: 100%; color: blue; cursor: pointer" disabled />
                                </a-form-item>
                            </a-col> -->
                        </a-row>
                        <br />

                        <!-- Patient(s) -->
                        <a-row :gutter="[48, 16]">
                            <a-col :span="4">
                                <a-typography-text class="label">Number of Patients<span>:</span></a-typography-text>
                            </a-col>
                            <a-col :span="20" v-if="store.state.careCoordinator.staffDetail?.patientCount > 0" @click="patientsCall">
                                <a-typography-link>{{ store.state.careCoordinator.staffDetail?.patientCount }}</a-typography-link>
                            </a-col>
                            <a-col :span="20" v-else>
                                <a-typography-text>{{ store.state.careCoordinator.staffDetail?.patientCount }}</a-typography-text>
                            </a-col>
                        </a-row>
                        <br />

                        <!-- Role(s) -->
                        <a-row :gutter="[48, 16]">
                            <a-col :span="24">
                                <a-form-item label="Role(s)" v-if="store.state.common?.rolesDropDown?.length > 0">
                                    <div class="filterBy" v-if="authUser?.user?.udid !=props?.staffId">
                                        <a-dropdown-button :trigger="['click']" :getPopupContainer="triggerNode => triggerNode.parentNode">
                                            Assign role
                                            <template #overlay>
                                                <a-menu class="filterMenu">
                                                    <a-checkbox-group v-model:value="roles" @change="handleChange">
                                                        <a-checkbox class="custom-checkbox" v-for="role in store.state.common?.rolesDropDown" :key="role.udid" :value="role.name" :disabled="store.state.careCoordinator.staffDetail?.roleId==role.udid ? true : false">{{ role.name }}</a-checkbox>
                                                    </a-checkbox-group>
                                                </a-menu>
                                            </template>
                                            <template #icon>
                                                <CaretDownOutlined />
                                            </template>
                                        </a-dropdown-button>
                                        <a-tag v-for="role, index in roles" :key="index" @close="handleClose(role)" :closable="rolesByName!=role ? true : false">
                                            {{ role }}
                                        </a-tag>
                                    </div>
                                <div class="filterBy" v-else> 
                                    <a-tag  :closable="false" v-for="role, index in roles" :key="index" @close="handleClose(role)">
                                        {{ role }}
                                    </a-tag>
                                </div>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="drawerFooter" :class="isEdit && rolesPermissionFind(screensPermissions, [304]) ? `justifyBet` : ``">
            <a-space>
                <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
            </a-space>
        </div>
    </a-form>
    <Loader v-if="store.state.careCoordinator.staffLoading" />
</template>

<script setup>
import Button from "@/components/button/Button.vue";
import InputFields from "@/components/form-fields/InputFields.vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import Loader from "@/components/patients/Loader"
import { rolesPermissionFind } from "@/commonMethods/commonMethod"
import { useRouter } from "vue-router";
const emit = defineEmits(["onClose"])
const props = defineProps(["staffId"])
const router= useRouter()
const store = useStore()
const onClose = () => {
    emit("onClose", false);
}
let authUser = JSON.parse(localStorage.getItem("auth"));
const roles = ref([])
const handleClose = removedTag => {
    const tags = roles.value.filter(tag => tag !== removedTag);
    roles.value = tags;
    roleModification()
};
const handleChange = () => {
    roleModification()
};
const roleModification = async() => {
    let record = []
    store.state.common?.rolesDropDown.map((item) => {
        if (roles.value.includes(item.name)) {
            record.push(item)
        }
    })
    try {
    await store.dispatch("addRoleStaff", { staffId: props?.staffId, data: { roles: record } })
    store.dispatch("staffs")
    }catch(error){
        console.log(error)
    }
}
//set name Primary  role name for disable tags
const rolesByName = ref('')
onMounted(async () => {
    store.dispatch("rolesDropDown")
    try {
        await store.dispatch("staffDetail", props?.staffId)
        store.state.careCoordinator.staffDetail?.role?.map((item) => {
            roles.value.push(item.name)
            if(item.udid==store.state.careCoordinator.staffDetail?.roleId){
                rolesByName.value = item.name
            }
        })
    } catch (error) {
        console.log(error)
    }
})
onUnmounted(() => {
    store.state.careCoordinator.staffDetail = null
})
//Open patients listing page with staff name and id
const patientsCall = () =>{
    router.push({
                            name: 'PatientsList',
                            query: {
                                name: store.state.careCoordinator.staffDetail?.fullName,
                                staffId:store.state.careCoordinator.staffDetail?.udid
                            }
                            })
}
</script>
  
<style>
.filterBy .ant-dropdown.ant-dropdown-placement-topLeft,
.filterBy .ant-dropdown.ant-dropdown-placement-bottomLeft {
    min-width: fit-content !important;
    left: 1px !important;
    top: 50px !important;
}
</style>