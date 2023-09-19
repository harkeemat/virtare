<template>
<div>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="12" >
                    <h2 class="pageTittle"> 
                        Escalation Details
                    </h2>
                </a-col>
                <a-col :span="12" v-if="arrayToObjact(screensPermissions, 403)">
                    <div class="text-right">
                        <!-- <a-button @click="showEscalationModal" type="primary">{{'Add Escalation'}}</a-button> -->
                        <ShowModalButton @click="showEscalationModal" :buttonText="'Escalation'" />
                    </div>
                </a-col>
                <a-col :span="12" v-if="arrayToObjact(screensPermissions, 404)">
                        <SearchField :endPoint="'escalation'" :otherParam="'&referenceId='+patientId+'&entityType=patient'" />
                </a-col>
                <a-col :span="24" style="padding-top:20px" v-if="arrayToObjact(screensPermissions, 404)">
                    <EscaltionTable :otherParam="'&referenceId='+patientId+'&entityType=patient'" :patientId="patientId" :columnData="column" :escalation="escalation.escalation"  @showEscalationData="showEscalationData($event)"/>
                </a-col>
                <!-- stepper -->
                <a-col :span="24">
                   <EscaltionModal v-model:visible="escaltionModal" v-if="escaltionModal" @saveModal="saveModal($event)" :isEdit="isEdit"/>
                </a-col>
            </a-row>
             <EscaltionViewModal v-model:visible="escaltionViewModal"/>
        </div>
       <Loader/>
     
    </a-layout-content>
</div>
</template>

<script>
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { globalDateFormat,arrayToObjact } from "@/commonMethods/commonMethod";
import EscaltionTable from "@/components/common/tables/EscalationTable"
// import EscaltionViewModal from "../escalations/EscalationViewModal"
import EscaltionViewModal from "@/components/escalations/EscalationViewModal";
import EscaltionModal from "@/components/escalations/EscalationModal"
import Loader from "@/components/loader/Loader";
import SearchField from "@/components/common/input/SearchField";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
const column =  [
{
  title: "Type",
  dataIndex: "escalationType",
  sorter: true,
  slots: {
      customRender: "escalationType",
  },
},
{
title: "Date",
dataIndex: "createdAt",
sorter: true,
},
{
  title: "Created By",
  dataIndex: "assignedBy",
  sorter: true,
  slots:{
      customRender: "assignedBy",
  },
  },
{
title: "Send To",
dataIndex: "assignedTo",
sorter: true,
slots:{
    customRender: "escalationAssignedTo",
},
},
{
  title: "Reason",
  dataIndex: "reason",
  sorter: true,
  slots: {
      customRender: "reason",
  },
},
{
  title: "Status",
  dataIndex: "status",
  sorter: true,
  slots: {
      customRender: "status",
  },
},

{
  title: "Action Taken",
  dataIndex: "takenAction",
  sorter: true,
  slots: {
      customRender: "takenAction",
  },
},

{
  title: "Loop Closed",
  dataIndex: "closeLoop",
  slots: {
      customRender: "closeLoop",
  },
},

{
    title: "Esc. Report",
    dataIndex: "action",
    slots: {
        customRender: "action",
    },
    
},
]

export default {
  components: {
    EscaltionTable,
    EscaltionModal,
    Loader,
    EscaltionViewModal,
    SearchField,
    ShowModalButton
  },
  props:{
      patientId:String
  },
  setup(props) {
    const store = useStore();
    const escaltionViewModal = ref(false)
    const escalationDetails = reactive({
      scalationType: "",
      description: "",
      flag: "",
      dueDate: "",
      staffId: [],
    });
    const escaltionModal = ref(false)
    const isEdit = ref()
    const addNoteForm = reactive({
      notes: [],
    });
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });

    watchEffect(()=>{
        if(props.patientId){    
            store.dispatch('escalation', {referenceId:props.patientId,entityType:'patient'})
        }
        store.dispatch("searchTable", "&search=");
        store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    })

  onMounted(()=>{
    store.state.escalations.escalation = ''
     if (store.getters.filter.value) {
        store.dispatch(
          "escalation",
          "?filter=" +
            store.getters.filter.value +
            "&fromDate=" +
            store.getters.dateFilter.value.fromDate +
            "&toDate=" +
            store.getters.dateFilter.value.toDate,{referenceId:props.patientId,entityType:'patient'}
        );
      } else {
        store.commit("dateFilter", "");
        store.dispatch("escalation",{referenceId:props.patientId,entityType:'patient'});
      }

      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
  })
    
    const showEscalationModal=()=>{

        store.commit('resetEscalationCounter')
        store.state.escalations.addBasicEscalation=null
        escaltionModal.value =true
        isEdit.value = null
    }
    
    const handleStaffChange = (val) => {
      escalationDetails.staffId = val;
    };

    const saveModal = (value) =>{
      escaltionModal.value = value
    }

    const showEscalationData =(data)=>{
      if(data.type=='view'){
        escaltionViewModal.value = data.value
      }else{
         escaltionModal.value = data.value
         isEdit.value = data.id
      }
    }

    const escalation = computed(() => {
      return store.state.escalations;
    });

    const screensPermissions = computed(()=>{
      return store.state.screenPermissions.screensPermissions
    })
    onUnmounted(()=>{
       store.state.escalations.escalation = ''
    })
    return {
      column,
      isEdit,
      arrayToObjact,
      escalation,
      escaltionViewModal,
      showEscalationData,
      saveModal,
      escaltionModal,
      showEscalationModal,
      handleStaffChange,
      addNoteForm,
      globalDateFormat,
      escalationDetails,
      patientDetails,
      size: ref("large"),
      screensPermissions
    };
  },
};
</script>

<style lang="scss">
.dangerValue {
  padding: 5px;
  background-color: #f03131f3;
  color: #fff;
}
</style>
