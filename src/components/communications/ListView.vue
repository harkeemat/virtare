<template>
  <a-row>
    <div class="commonTags">
      <a-tag v-if="route.query.filter" closable @close="remove('filter')">{{ staffSummary ? staffSummary.fullName : route.query.filter }}</a-tag>
      <a-tag v-if="route.query.toDate && route.query.fromDate" closable @close="remove('date')">
        {{ timeStampFormate(route.query.fromDate, globalDateFormat) }} To {{ timeStampFormate(route.query.toDate, globalDateFormat) }}
      </a-tag>
      <!-- <a-tag v-if="route.query.toDate && route.query.fromDate" closable @close="remove('date')"></a-tag> -->
    </div>
  </a-row>
  <a-row>
    <a-col :span="12" >
      <SearchField endPoint="communication"/>
    </a-col>
    <a-col :span="12" >
      <div class="text-right mb-24">
        <ExportToExcel  @click="exportExcel('communication_report')" v-if="arrayToObjact(screensPermissions,110)"/>
      </div>
    </a-col>
    <a-col :span="24">
      <ListViewTable  /> 
    </a-col>
  </a-row>
</template>

<script>
import { watchEffect ,onUnmounted, computed} from 'vue';
import { useStore } from "vuex"
import SearchField from "@/components/common/input/SearchField";
import ListViewTable from "@/components/communications/tables/ListViewTable";
import { arrayToObjact, exportExcel, timeStampFormate, globalDateFormat } from "@/commonMethods/commonMethod"
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    SearchField,
    ListViewTable,
    ExportToExcel
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    watchEffect(() => {
      if(route.name == "Communications") {
        if(route.query.filter) {
          if(route.query.filter != 'Completed' || route.query.filter != 'In Queue' || route.query.filter != 'App Message' || route.query.filter != 'App Call' || route.query.filter != 'Email') {
            store.dispatch("staffSummary", route.query.filter);
          }
          store.dispatch('communicationsList', "?filter="+route.query.filter+'&fromDate='+route.query.fromDate+'&toDate='+route.query.toDate)
        }
        else if(!route.query.filter && route.query.fromDate && route.query.toDate) {
          store.dispatch('communicationsList', '?fromDate='+route.query.fromDate+'&toDate='+route.query.toDate)
        }
        else if(!route.query.filter && !route.query.fromDate && !route.query.toDate) {
          store.dispatch('communicationsList')
        }
        store.dispatch("searchTable", '&search=')
        store.dispatch('orderTable', {
          data: '&orderField=&orderBy='
        })
      }
    })

    const staffSummary = computed(() => {
        return store.state.careCoordinatorSummary.staffSummary;
    });
   
    const searchData = (value) => {
      store.getters.communicationRecord.communicationsList=""
      store.dispatch('searchCommunications', value)
    };
    
    onUnmounted(()=>{
      store.dispatch("searchTable", '&search=')
      store.dispatch('orderTable', {
        data: '&orderField=&orderBy='
      })
    })

    function remove(event) {
      if (event == "filter") {
        if (route.query.fromDate && route.query.toDate) {
          router.replace({
            query: {
              view: 'list',
              toDate: route.query.toDate,
              fromDate: route.query.fromDate,
            }
          }).then(()=>{
            store.dispatch("communicationsList", "?fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate)
          })
        }
        else {
          router.replace({
            query: {
              view: 'list',
            }
          }).then(()=>{
            store.dispatch("communicationsList")
          })
        }
      }
      else if(event == 'date') {
        store.commit("dateFilter", null)
        if (route.query.filter) {
          router.replace({
            query: {
              view: 'list',
              filter: route.query.filter,
            }
          }).then(() => {
            store.dispatch("communicationsList", "?filter=" + route.query.filter)
          })
        }
        else {
          router.replace({
            query: {
              view: 'list',
            }
          }).then(() => {
            store.dispatch("communicationsList")
          })
        }
      }
      else {
        if(route.query.filter && (route.query.filter != 'Completed' || route.query.filter != 'In Queue' || route.query.filter != 'App Message' || route.query.filter != 'App Call' || route.query.filter != 'Email')) {
          store.dispatch("communicationsList", "?filter=" + route.query.filter)
          setTimeout(() => {
            router.replace({
              query: {
                view: 'list',
                filter: route.query.filter,
              }
            }, 5000)
          })
        }
        else {
          router.replace({
            query: {
              view: 'list',
            }
          })
          store.dispatch("communicationsList")
        }
      }

    }

    return {
     screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      exportExcel,
      searchData,
      
      onChange: () => {
       
      },
      route,
      remove,
      staffSummary,
      timeStampFormate,
      globalDateFormat,
    };
  },
};
</script>

<style lang="scss">
@media (max-width: 1199px) {
  .communications {
    padding: 0px 0 60px;
    .addtaskButton {
      left: 0;
      right: auto;
      top: 50px;
    }
  }
}
</style>