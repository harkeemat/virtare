<template>
  <a-modal width="1000px" title="Pin Details" centered :maskClosable="false" @cancel="closeModal">
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table  class="sortIconTable" rowKey="id"  :columns="notesColumns" :data-source="criticalNotesList" :pagination="false">
          <template #criticalNote="{record}">
          <a-popover>
            <template #content>
              <p :ellipsis=true>{{record.criticalNote }}</p>
            </template>
            {{ record.criticalNote.length>150?record.criticalNote.substring(0,120)+'...':record.criticalNote }}
          </a-popover>
        </template>
        <template #action="{record}">
          <a-tooltip placement="right" v-if="arrayToObjact(screensPermissions,313)">
            <template #title>
              <span>{{$t('global.edit')}}</span>
            </template>
            <a class="icons" @click="editCriticalNote(record.id);actionTrack(paramsId,313,'patient')">
              <EditOutlined />
            </a>
          </a-tooltip>
          <a-tooltip placement="right" v-if="record.isRead == 0 && arrayToObjact(screensPermissions,313)">
            <template #title>
              <span>{{$t('global.delete')}}</span>
            </template>
            <a class="icons" @click="readUnreadCriticalNote(record.id, 1);actionTrack(paramsId,313,'patient')">
              <DeleteOutlined />
            </a>
          </a-tooltip>
          <a-tooltip placement="right" v-if="record.isRead == 1 && arrayToObjact(screensPermissions,313)">
            <template #title>
              <span>{{$t('global.restore')}}</span>
            </template>
            <a class="icons" @click="readUnreadCriticalNote(record.id, 0);actionTrack(paramsId,313,'patient')">
              <UndoOutlined />
            </a>
          </a-tooltip>
        </template>
        </a-table>
        <Loader/>
      </a-col>
    </a-row>
    <AddCriticalNote v-model:visible="criticalModalVisible" :criticalNoteId="criticalNoteId" @closeModal="handleOk" @saveModal="handleCriticalNote($event)" />
  </a-modal>
</template>
<script>
import {
  computed,
  defineComponent,
  watchEffect,
	ref
} from "vue";
import { useStore } from "vuex";
import {
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons-vue";
import { warningSwal,actionTrack,arrayToObjact } from "@/commonMethods/commonMethod";
import AddCriticalNote from "@/components/modals/CriticalNote";
import { messages } from "@/config/messages";
import {useRoute} from "vue-router"
import Loader from "@/components/loader/Loader"
export default defineComponent({
  components: {
   EditOutlined,
   DeleteOutlined,
   UndoOutlined,
   Loader,
   AddCriticalNote,
  },
  setup(props, {emit}) {
    const store = useStore();
    const route = useRoute();
    const criticalModalVisible = ref(false);
    const criticalNoteId = ref(null);

    watchEffect(() => {
      if(route.name == 'PatientSummary') {
        store.dispatch('criticalNotesList', route.params.udid);
      }
    })

    const criticalNotesList = computed(() => {
      return store.state.patients.criticalNotesList
    })

    const notesColumns = [
      {
        title: "Notes",
        dataIndex: "criticalNote",
        className:'criticalNote',
        slots:{
          customRender:'criticalNote'
        }
      },
      
      {
        title: "Action",
        dataIndex: "action",
        className:'criticalNoteAction',
        slots: {
          customRender: "action",
        },
      },
    ];

    function readUnreadCriticalNote(id, isRead) {
      const restoreWarning = isRead ? messages.deleteWarning : messages.restoreWarning
      warningSwal(restoreWarning).then((response) => {
        if (response == true) {
          store.dispatch('readUnreadCriticalNote', {
            patientUdid: route.params.udid,
            criticalNoteId: id,
            isRead: isRead,
          }).then(() => {
            store.dispatch('criticalNotesList', route.params.udid);
            store.dispatch('patientCriticalNotes', route.params.udid)
            if(route.params.udid) {
            store.dispatch('patientTimeline', {
              id:route.params.udid,
              type:store.state.patients.tabvalue.join(",")
            });
          }
          });
        }
      });
    }

    function editCriticalNote (id) {
      criticalNoteId.value = id
      store.dispatch('criticalNoteDetails', {
        patientUdid: route.params.udid,
        criticalNoteId: id,
      }).then(() => {
        criticalModalVisible.value = true
      })
    }

    const closeModal = () => {
      emit('closeModal', {
        modal: 'criticalNotesDetails',
        value: false
      })
    }

    const handleCriticalNote = (value) => {
      criticalModalVisible.value  =value
    }

    function handleOk() {
      criticalModalVisible.value = false
    }

    return {
      closeModal,
      handleCriticalNote,
      handleOk,
      criticalModalVisible,
      criticalNoteId,
      arrayToObjact,
      screensPermissions: store.getters.screensPermissions,
      actionTrack,
      paramsId:route.params.udid,
      readUnreadCriticalNote,
      criticalNotesList,
      notesColumns,
      editCriticalNote,
    };
  },
});
</script>
<style lang="scss" scoped>

.ant-popover {
    width: 60%;
    left: 24px !important;
  }
  .criticalNote { width: 50%; }
  td.criticalNote {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis !important;
    margin: 0 auto;
  }
  th.criticalNoteAction, td.criticalNoteAction { text-align: center !important; }

span.anticon.anticon-undo {
  font-size: 20px !important;
}
</style>