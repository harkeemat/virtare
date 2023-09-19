
<template>
<div class="physicians">
    <a-row :gutter="16">
        <a-col :span="24">
            <div class="phyInner">
                <h2>Care Coordinator</h2>
            </div>
        </a-col>
        <a-col :span="12" v-for="staff,index in staffList.getStaff" :key="index">
            <div class="phyInner">
                <img v-if="staff.profilePhoto" :size="50" :src="staff.profilePhoto" />
                <img v-else :size="50" src="@/assets/images/userAvatar.png" />
                <span class="checkIcon" @click="removeStaff(staff.id)">
                    <CloseOutlined />
                </span>
                <p>{{staff.fullName}}</p>
            </div>
        </a-col>
        <a-col :span="staffList?.getStaff?.length==0 ?  24: 12">
            <div class="phyInner" @click="showModal2({show:true,event:false})">
                <a-avatar :size="100" title="Care Coordinator"  style="background-color: #1890ff">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                </a-avatar>
            </div>
        </a-col>
    </a-row>

</div>
<AddPhysician v-model:visible="physicianModal" @ok="handleOk2" @add-staff="addStaff($event)" @is-visible="showModal2($event)" />
</template>
<script>
import { ref } from "vue";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons-vue";
import AddPhysician from "@/components/modals/AddPhysician";
import { useStore } from "vuex";

export default {
  components: {
    CloseOutlined,
    PlusOutlined,
    AddPhysician,
  },
  props: {
    physiciansId: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const physicianModal = ref(false);
    const showModal2 = (e) => {
      physicianModal.value = e.show;
      if(e.event){
        staffAdd();
      }
      
    };
    const handleOk2 = () => {
      physicianModal.value = false;
    };
    const staffList = store.getters.appointmentRecords.value;

    function staffAdd() {
      emit("staff-select");
    }

    function removeStaff(event) {
      let addStaff = "";
      let staff = JSON.parse(localStorage.getItem("staff")) || [];
      addStaff = staff.filter(function (el) {
        return el.id != event;
      });
      localStorage.setItem("staff", JSON.stringify(addStaff));
      store.dispatch("getStaffs");
      emit("staff-select");
    }
    return {
      removeStaff,
      staffList,
      showModal2,
      handleOk2,
      physicianModal,
    };
  },
};
</script>
