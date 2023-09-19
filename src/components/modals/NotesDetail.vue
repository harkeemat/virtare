<template>
  <a-modal width="80%" title="Notes Detail" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <div class="text-right mb-24">
        </div>
        <a-table class="sortIconTable" rowKey="id"  :columns="notesColumns" :data-source="notesList" :pagination="false">
          <template #priority="{ record }">
            <span>{{record.flag}}</span>
          </template>
          <template #type="{ record }">
            <span>{{record.type=="patientFlag" ? "Patient Status" : record.type}}</span>
          </template>
          <template #addedBy="{record}">  
            <span v-if="record.addedByType=='staff'">
              <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.addedById  }}" >{{record.addedBy}}</router-link> 
              <a @click="showStaffModal(record.addedById)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
            </span>
            <span v-else>
              <router-link :to="{ name: 'PatientSummary', params: { udid:record.addedById }}" >{{record.addedBy}}</router-link> 
              <a @click="showPatientModal(record.addedById)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
            </span>
        </template>
        </a-table>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { computed, defineComponent, watchEffect } from "vue";
import { useStore } from "vuex";
// import Flags from "@/components/common/flags/Flags";
import { useRoute } from "vue-router";
import {
  actionTrack,
  showPatientModal,
  showStaffModal
} from '@/commonMethods/commonMethod';
import { InfoCircleOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    // Flags,
    InfoCircleOutlined
  },
  props:{
    Id:String
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();

    watchEffect(() => {
      if(props.Id){
      store.dispatch('notesList', props.Id);
      }
      else if(route.name == "PatientSummary") {
        store.dispatch('notesList', route.params.udid);
      }
    })

    const notesList = computed(() => {
      return store.state.notes.notesList
    })

    const notesColumns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        className: "note-date",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        className: "note-category",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        className: "note-type",
        slots: {
          customRender: "type",
        },
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        className: "note-text",
        ellipsis: true,
      },
      {
        title: "Added By",
        dataIndex: "addedBy",
        key: "addedBy",
        slots: {
          customRender: "addedBy",
        },
      },
      {
        title: "Priority",
        dataIndex: "color",
        key: "color",
        slots: {
          customRender: "priority",
        },
        className: "note-flag",
      },
    ];

    function showModal(){
      // console.log(object);
    }

    return {
      showStaffModal,
      showPatientModal,
      showModal,
      paramsId:route.params.udid,
      actionTrack,
      notesList,
      notesColumns,
    };
  },
});
</script>