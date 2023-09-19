<template>
<a-modal width="45%" title="Task Details" centered :footer="false" :maskClosable="false" zIndex=1060>
    <a-row :gutter="24">
        <a-col :sm="24" :xs="24">
            <div class="form-group">
                <div class="calendarDropdown notificationModal" v-if="tasks">
                    <div class="itemWrapper">
                        <div class="leftWrapper">Task Name</div>
                        <div class="rightWrapper">{{tasks.title}}</div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Task Category</div>
                        <div class="rightWrapper">
                        <span v-for="(category,index) in tasks.category" :key="category.id">
                            {{index == 0 ? category.taskCategory : ', ' +category.taskCategory}}
                        </span>
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Priority</div>
                        <div class="rightWrapper">
                            {{tasks.priorityName}}
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Task Status</div>
                        <div class="rightWrapper">
                            {{tasks.taskStatusName}}
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Assigned By</div>
                        <div class="rightWrapper">
                            {{tasks.assignedBy}}
                        </div>
                    </div>
                    <!-- <div class="itemWrapper">
                        <div class="leftWrapper">Assigned Name</div>
                        <div class="rightWrapper" v-if="tasks.entityType=='staff'">
                           
                           <span v-for="(assignedName,index) in tasks.assignedName" :key="index">
                            <router-link :to="{ name: 'CoordinatorSummary', params: { udid:tasks.assignedTo[index]  }}">{{index == 0 ? assignedName : ', ' +assignedName}}</router-link>
                        </span>
                        </div>
                        <div class="rightWrapper" v-else>
                          <span v-for="(assignedName,index) in tasks.assignedName" :key="index">
                            <router-link :to="{ name: 'PatientSummary', params: { udid:tasks.assignedTo[index]  }}">{{index == 0 ? assignedName : ', ' +assignedName}}</router-link>
                        </span>
                        </div>
                    </div> -->
                    <!-- <div class="itemWrapper">
                        <div class="leftWrapper">Start Date</div>
                        <div class="rightWrapper">{{tasks.dateStart}}</div>
                    </div> -->
                     <div class="itemWrapper">
                        <div class="leftWrapper">Due Date</div>
                        <div class="rightWrapper">{{tasks.dateDue}}</div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Description</div>
                        <div class="rightWrapper">{{tasks.description}}</div>
                    </div>
                </div>
            </div>
        </a-col>
    </a-row>
    <Loader />
</a-modal>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex";
//import { dateAndTimeFormate } from "@/commonMethods/commonMethod";

import Loader from '@/components/loader/Loader.vue';
// import RejectAppointment from './RejectAppointment.vue';
import {  defineComponent } from "vue-demi";
export default defineComponent({
  name:"AppintmentDetails",
  components: {
    Loader,
   
  },
  setup() {

    const store = useStore();

   
   
    const tasks = computed(() => {
      return store.state.tasks.editTask;
    });

    
    

    return {
    
      tasks

    };
  },
});
</script>
<style lang="scss" scoped>
.notificationModal {
  width: 100%!important;
  .itemWrapper {
    align-items: flex-start!important;
    .leftWrapper {
      padding: 0 10px 0 0;
      width: 35%;
      
    }
    .rightWrapper {
      padding: 0 0 0 10px;
      width: 65%;
      text-align: right;
    }
  }
}

</style>