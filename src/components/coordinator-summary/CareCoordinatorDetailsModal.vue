
<template>
<a-modal max-width="1140px" width="40%" title="Care-Coordinator Details" centered :footer="false" :maskClosable="false" @cancel="handleOk" >
<a-row :gutter="24">
    <a-col :sm="24" :xs="24">
        <div class="patientInfo">
            <div class="patientImg">
                <!-- <img src="@/assets/images/userAvatar.png" alt="image" /> -->
                <img v-if="getstaffSummary?.profilePhoto" :src="getstaffSummary?.profilePhoto" alt="avatar" class="ant-upload-text" />
                <img v-else src="@/assets/images/userAvatar.png" alt="image" />
                <div class="info" v-if="getstaffSummary">
                    <h2> 
                      <!-- {{getstaffSummary.fullName}} -->
                       <router-link @click="handleOk" :to="{ name: 'CoordinatorSummary', params: { udid: getstaffSummary.id } }">{{ getstaffSummary.fullName }}</router-link>
                    </h2>
                    <!-- <p>Designation : {{getstaffSummary.designation}}</p> -->
                    <p class="overflow-wrap" :title="getstaffSummary?.email"><a :href="`mailto:${getstaffSummary?.email}`">
                            <MailOutlined /> {{ getstaffSummary?.email?getstaffSummary?.email:'' }}</a>
                    </p>
                    <p>
                        <!-- <a v-if="getstaffSummary.extension" :href="`tel:${getstaffSummary.phoneNumber+getstaffSummary.extension}`">
                            <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }} {{getstaffSummary?.extension?'('+getstaffSummary.extension+')':''}}
                        </span>
                        <span v-else :href="`tel:${getstaffSummary.phoneNumber}`">
                            <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }}
                        </a> -->
                        <span v-if="getstaffSummary.extension" >
                            <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }} {{getstaffSummary?.extension?'('+getstaffSummary.extension+')':''}}
                        </span>
                        <span v-else >
                            <PhoneOutlined :rotate="90" /> {{ getstaffSummary.phoneNumber }}
                        </span>
                    </p>
                </div>

            </div>
            <div class="pat-profile" v-if="getstaffSummary">
                <div class="pat-profile-inner">
                    <div class="thumb-head">Gender</div>
                    <div class="thumb-desc">{{getstaffSummary.gender}}</div>
                </div>
                <div class="pat-profile-inner">
                    <div class="thumb-head">Specialization</div>
                    <div class="thumb-desc">{{getstaffSummary.specialization}}</div>
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
                    <div class="thumb-head">Network</div>
                    <div class="thumb-desc">{{getstaffSummary.network}}</div>
                </div>
                <div class="pat-profile-inner">
                    <div class="thumb-head">Status</div>
                    <div class="thumb-desc">{{getstaffSummary?getstaffSummary.isActive==true?'Active':'Inactive':''}}</div>
                </div>
            </div>
        </div>
    </a-col>
    </a-row>
    <TableLoader/>
</a-modal>

</template>
<script>

import {
  computed,
  defineComponent,
} from "vue";
import {
  // DeleteOutlined,
  
  MailOutlined,
  PhoneOutlined,
  // KeyOutlined
} from "@ant-design/icons-vue";
import TableLoader from "@/components/loader/TableLoader.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    MailOutlined,
    PhoneOutlined,
    TableLoader
  },
  setup() {
    const store = useStore();
    const getstaffSummary = computed(() => {
      return store.state.careCoordinatorSummary.staffSummary;
    });

    function handleOk(){
      store.commit('closeStaffDetailsModal')
    }

    return {
      handleOk,
      getstaffSummary
    };
  },
});
</script>

<style lang="scss" scoped>
.patientImg {
  padding: 15px!important;
  background-color: #daeedb!important;
}
.resetPass {
  position: absolute;
  padding-left: 10px;
  top: 13px;
  z-index: 1;
}

.editIcon {
  position: absolute;
  right: 10px;
  top: 13px;
  z-index: 1;

  span {
    svg {
      font-size: 22px;
    }
  }
}

</style>
