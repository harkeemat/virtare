<template>
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Specialist</a-typography-title>
        </a-col>
        <a-col :span="24">
            <div class="staffDetailView">
                <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
                <a-row :gutter="[15, 24]">
                    <a-col :span="6" v-if="store.state.specialists.specialistSummary?.name">
                        <a-typography-text class="label">Name <span>:</span></a-typography-text>
                    </a-col>
                    <a-col :span="18" v-if="store.state.specialists.specialistSummary?.name">
                        <a-typography-text>{{ store.state.specialists.specialistSummary?.name }}</a-typography-text>
                    </a-col>
                    <a-col :span="6" v-if="store.state.specialists.specialistSummary?.email">
                        <a-typography-text class="label">Email <span>:</span></a-typography-text>
                    </a-col>
                    <a-col :span="18" v-if="store.state.specialists.specialistSummary?.email">
                        <a-typography-text>{{ store.state.specialists.specialistSummary?.email }}</a-typography-text>
                    </a-col>
                    <a-col :span="6" v-if="store.state.specialists.specialistSummary?.phoneNumber">
                        <a-typography-text class="label">Phone Number <span>:</span></a-typography-text>
                    </a-col>
                    <a-col :span="18" v-if="store.state.specialists.specialistSummary?.phoneNumber">
                        <a-typography-text>{{ store.state.specialists.specialistSummary?.phoneNumber }}</a-typography-text>
                    </a-col>
                    <a-col :span="6" v-if="store.state.specialists.specialistSummary?.specialisation">
                        <a-typography-text class="label">Specialization <span>:</span></a-typography-text>
                    </a-col>
                    <a-col :span="18" v-if="store.state.specialists.specialistSummary?.specialisation">
                        <a-typography-text>{{ store.state.specialists.specialistSummary?.specialisation }}</a-typography-text>
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
    <Loader v-if="store.state.specialists.staffLoading" />
</template>

<script setup>
import Button from "@/components/button/Button.vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import { rolesPermissionFind } from "@/commonMethods/commonMethod"
import Loader from "@/components/patients/Loader"
const emit = defineEmits(["onClose"])
const props = defineProps(["specialistId"])
const store = useStore()
const onClose = () => {
    emit("onClose", false);
}
onMounted(async()=> {
    store.dispatch("rolesDropDown") 
    try{
     await store.dispatch("specialistSummary",props?.specialistId)
     roles.value = store.state.specialists.specialistSummary?.role
    }catch(error){
        console.log(error)
    }
})
onUnmounted(()=>{
    store.state.specialists.specialistSummary= null
})
</script>
  
  