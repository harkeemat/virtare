<template>
    <a-modal width="1100px" :maskClosable="false" centered v-model:visible="viewReport" title="Audit Time Log Change Report"  :footer="false" @cancel="closeModal()">
    
        <a-table class="sortIconTable"  :columns="columns" :data-source="modalData" :pagination="false">
            <template #createdBy="{record}">
                <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.createdById}}" >{{record.createdBy}}</router-link> -->
                <a v-if="arrayToObjact(screensPermissions,38)" @click="showStaffModal( record.createdById)" >{{ record.createdBy }}</a>
            <span v-else >{{record.staff}}</span>
            </template>
            <template #flag="{ record }">
            <span>{{record.flag}}</span>
            <!-- <a-tooltip placement="bottom">
               
                <a class="icons">
                    <Flags :flag="record.color" :data="record" /></a>
            </a-tooltip> -->
        </template>
         <template #note="{record}">
        <a-tooltip placement="bottom">
            <template #title>
                <span>{{ record.note }}</span>
            </template>
            <span>{{ record.note?.length>30?record.note.substring(0,30)+'...':record.note }}</span>
        </a-tooltip>
    </template>
        </a-table>
        <TableLoader />
    </a-modal>
</template>
<script>
import {
    onMounted,
} from "vue";
import {
    useStore
} from "vuex";

import TableLoader from "@/components/loader/TableLoader";
// import Flags from "@/components/common/flags/Flags";
import {
   showStaffModal,
   arrayToObjact,
} from "@/commonMethods/commonMethod";
export default {
    components: {
 
       
        TableLoader,
        // Flags
    
    },
    props:{
        id:{
            type:String
        }
    },

    setup(props) {
        const store = useStore();
       onMounted(()=>{
        store.dispatch("timeLogView", props.id);
       
       })
        const columns = store.getters.viuewTimeReportModal
       // const  modalData = store.getters.timeLogView.value
    //     const meta = store.getters.auditMetaLog
    //      let data = [];
    // let scroller = "";
    // onMounted(() => {
    //   var tableContent = document.querySelector(".ant-table-body");
    //   tableContent?.addEventListener("scroll", (event) => {
    //     let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    //     let currentScroll = event.target.scrollTop + 2;
    //     if (currentScroll >= maxScroll) {
    //       let current_page = meta.value.current_page + 1;

    //       if (current_page <= meta.value.total_pages) {
    //         scroller = maxScroll;
    //         data = modalData.value;
           

    //         store
    //           .dispatch(
    //             "timeLogView",
    //             "?page=" +
    //               current_page
    //           )
    //           .then(() => {
    //             loadMoredata();
    //           });
    //       }
    //     }
    //   });
    // });
    //     function loadMoredata() {
    //   const newData = modalData.value;

    //   newData.forEach((element) => {
    //     data.push(element);
    //   });
    //   modalData.value = data;
    //   var tableContent = document.querySelector(".ant-table-body");
    //   setTimeout(() => {
    //     tableContent.scrollTo(0, scroller);
    //   }, 50);
    // }
        function closeModal() {
			store.state.timeLogReport.timeLogView = ''
		}
        
        return { 
            showStaffModal,   
            arrayToObjact,   
            columns,
            closeModal,
            modalData:store.getters.timeLogView,
            screensPermissions: store.getters.screensPermissions,
            
        };
    },
};
</script>