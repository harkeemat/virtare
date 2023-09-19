<template>
  <a-table  class="sortIconTable"
    rowKey="id"
    :columns="colomnsRecord"
    :data-source="dataRecord"
    :pagination="pagination">
    <template #patient="{record}" v-if="arrayToObjact(screensPermissions,63)">
      <router-link :to="{ name: 'PatientSummary', params: { udid: record.patientUdid } }">
        {{ record.patient.length>15?record.patient.substring(0,15)+'...':record.patient }}
      </router-link>
      <a @click="showPatientModal( record.patientUdid)" v-if="arrayToObjact(screensPermissions, 65)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
      <span v-else>{{record.patient}}</span>
    </template>
    <template #patient="{record}" v-else>
      <span>
        {{ record.patient }}
      </span>
    </template>
    <template #action="{record}" v-if="arrayToObjact(screensPermissions,107)">
      <a-button @click="videoCall(record.conferenceId)" type="primary">
        <template #icon><VideoCameraOutlined /></template>
        {{$t('communications.start')}}
      </a-button>
    </template>
  </a-table>
</template>

<script>
import {enCodeStringVideoURL,arrayToObjact,showPatientModal} from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { InfoCircleOutlined,VideoCameraOutlined } from "@ant-design/icons-vue";
export default {
  components:{
    InfoCircleOutlined,
    VideoCameraOutlined
  },
props:["colomnsRecord","dataRecord","pagination"],
  setup() {
    const store =useStore()
    const router = useRouter();
    function videoCall(conferenceId) {
      if(conferenceId){
        store.commit("conferenceId", conferenceId);
        // store.dispatch("getVideoDetails",conferenceId)
      }
      if (conferenceId) {
        router.push({ name: 'videoCall', params: { id: enCodeStringVideoURL(conferenceId) } })
      }
    }
    return {
      showPatientModal,
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      videoCall,
     enCodeStringVideoURL
    }
  }
}
</script>