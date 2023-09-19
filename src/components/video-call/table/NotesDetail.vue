<template>
<div :class="showRecord==true? 'notesDetailBg show':'notesDetailBg'">
    <div class="notesDetail 23">
        <div class="notesHeader">
            <h4>Notes Detail</h4>
            <CloseOutlined @click="closeModal" />
        </div>
        <div class="notesBody">
            <div class="form-group">
                <div class="calendarDropdown notificationModal">
                    <div class="itemWrapper">
                        <div class="leftWrapper">Added By</div>
                        <!-- <router-link target="_blank" :to="{ name: 'CoordinatorSummary', params: { udid: detailsNotes.addedById}}">
                          <div class="rightWrapper">{{ detailsNotes.addedBy }}</div>
                        </router-link> -->
                        <a v-if="detailsNotes.addedByType == 'staff'" @click="showStaffModal(detailsNotes.addedById)">{{ detailsNotes.addedBy }}</a>
                        <a v-else @click="showPatientModal(detailsNotes.addedById)">{{ detailsNotes.addedBy }}</a>

                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Date</div>
                        <div class="rightWrapper">
                            {{ detailsNotes.date}}
                        </div>
                    </div>
                    <!-- <div class="itemWrapper">
                        <div class="leftWrapper">Specialization</div>
                        <div class="rightWrapper">
                            {{detailsNotes.specialization}}
                        </div>
                    </div> -->
                    <div class="itemWrapper">
                        <div class="leftWrapper">Category</div>
                        <div class="rightWrapper">
                            {{detailsNotes.category}}
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Type</div>
                        <div class="rightWrapper">
                            {{detailsNotes.type}}
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Priority</div>
                        <div class="rightWrapper">
                          <!-- <span class="box" :title="detailsNotes.flag" :style="{ 'background-color': detailsNotes.color }"></span> -->
                          <span>{{detailsNotes.flag}}</span>
                        </div>
                    </div>
                    <div class="itemWrapper">
                        <div class="leftWrapper">Note</div>
                        <div class="rightWrapper">{{ detailsNotes.note }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Loader v-if="!showRecord" />
</div>

<a-row :gutter="24">
    <a-col :sm="24" :xs="24">
        <a-button @click="showNoteModal" type="primary">{{'Add Note'}}</a-button>
        <a-table class="sortIconTable" :scroll="{ y: 250 }" rowKey="id" :columns="notesColumns" :data-source="notesList" :pagination="false">
            <template #flags="{ record }">
              <!-- <Flags :flag="record.color" :data="record" /> -->
              <span>{{record.flag}}</span>
            </template>
            <template #action="{record}">
              <a-tooltip placement="right">
                <template #title>View</template>
                <a class="icons"><EyeTwoTone @click="view(record.id)" /></a>
              </a-tooltip>
            </template>
        </a-table>
        <Loader v-if="!isCommunication" />
    </a-col>
</a-row>
<div :class="addNoteVisible==true? 'notesDetailBg addNotes show':'notesDetailBg addNotes'">
  <!-- <AddNotesModal v-model:visible="addNoteVisible" @closeModal="closeModal($event)" :pId="pId" /> -->
  <AddNotesModal v-if="addNoteVisible"  @closeModal="closeModal($event)" :pId="patientId ? patientId : pId"/>
</div>
</template>

<script>
import { 
  computed,
  defineComponent,
  watchEffect,
  ref,
  defineAsyncComponent,
} from "vue";
import { useStore } from "vuex";
// import Flags from "@/components/common/flags/Flags";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader";
import { EyeTwoTone, CloseOutlined } from "@ant-design/icons-vue";
import { actionTrack,showPatientModal,showStaffModal } from "@/commonMethods/commonMethod";

export default defineComponent({
  components: {
    // Flags,
    EyeTwoTone,
    CloseOutlined,
    Loader,
    AddNotesModal: defineAsyncComponent(() =>
      import("@/components/video-call/modal/AddNote")
    ),
  },
  props: {
    pId: String,
    isCommunication: Boolean,
    patientId: Number,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const showRecord = ref("false");
    const detailsNotes = ref("");
    const addNoteVisible = ref();

    watchEffect(() => {
      if (props.pId) {
        store.dispatch("notesList", props.pId);
      }
      else if (route.name == "PatientSummary") {
        store.dispatch("notesList", route.params.udid);
      }
    });

    const notesList = computed(() => {
      return store.state.notes.notesList;
    });
    const view = (id) => {
      store.commit('loadingStatus', true)
      detailsNotes.value = notesList.value.find((item) => item.id == id);
      setTimeout(() => {
        showRecord.value = true;
        store.commit('loadingStatus', false)
      }, 1000);
    };
    const notesColumns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        className: "note-date",
      },
      {
        title: "Priority",
        dataIndex: "color",
        key: "color",
        slots: {
          customRender: "flags",
        },
        className: "note-flag",
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
        className: "note-text",
        ellipsis: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        className: "type-text",
        ellipsis: true,
      },

      {
        title: "Detail",
        dataIndex: "action",
        className: "doc-actions",
        slots: {
          customRender: "action",
        },
      },
    ];

    const showNoteModal = () => {
      addNoteVisible.value = true;
    };

    function closeModal(value) {
      showRecord.value = false;
      addNoteVisible.value = value;
    }


    return {
      showPatientModal,
      showStaffModal,
      showNoteModal,
      addNoteVisible,
      paramsId: route.params.udid,
      actionTrack,
      notesList,
      notesColumns,
      view,
      showRecord,
      detailsNotes,
      closeModal,
    };
  },
});
</script>
