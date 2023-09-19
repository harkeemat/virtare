<template>
  <a-modal v-model:visible="visible" width="500px" title="View Referral" centered @ok="handleOk" @cancel="onCloseModal()">
   <a-row :gutter="24">
        <a-col :sm="24" :xs="24">
            <div class="form-group">
                <div class="calendarDropdown notificationModal">
                    <div class="itemWrapper">
                        <div class="leftWrapper">Name</div>
                        <div class="rightWrapper">{{referralDetail.name}}</div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Email</div>
                        <div class="rightWrapper">
                            {{referralDetail.email}}
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Phone Number</div>
                        <div class="rightWrapper">
                            {{referralDetail.phoneNumber}}
                        </div>
                    </div>
                    <!-- <div class="itemWrapper">
                        <div class="leftWrapper">Designation</div>
                        <div class="rightWrapper">
                            {{referralDetail.designation}}
                        </div>
                    </div> -->
                    <div class="itemWrapper">
                        <div class="leftWrapper">Fax</div>
                        <div class="rightWrapper">
                            {{referralDetail.fax}}
                        </div>
                    </div>
                    

                </div>

            </div>
        </a-col>
       
    </a-row>
    
    <Loader />
  </a-modal>
</template>
<script>
import { defineComponent} from "vue";
import Loader from '@/components/loader/Loader.vue';
export default defineComponent({
  components: {
   Loader
  },
  props: {
    referralDetail:{
      type:Array
    }
  },
  setup() {
   

    return {
      
    };
  },
});
</script>
