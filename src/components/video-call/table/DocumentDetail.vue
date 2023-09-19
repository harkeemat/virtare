<template>
  <a-row :gutter="24">
    <a-col :sm="24" :xs="24">
      <div class="documentsTab">
      <a-button @click="showDocumentModal" type="primary">{{ "Add Document" }}</a-button>
      <a-table class="sortIconTable"
        rowKey="id"
        :columns="documentsColumns"
        :data-source="patientDocuments"
        :pagination="false"
      >
        <template #tags="{ record }">
          <div v-for="tag in record.tags.data" :key="tag.id">
            <span class="tags">{{ tag.tag }}</span>
          </div>
        </template>
        <template
          #action="{ record }"
          v-if="arrayToObjact(screensPermissions, 318)"
        >
          <a class="icons"
            ><DeleteOutlined @click="deleteDocument(record.id)"
          /></a>
        </template>
        <template #document="{ record }">
          <a-tooltip placement="right">
            <template #title>View</template>
          <a :href="record.document" target="_blank"><FileOutlined /></a>
          </a-tooltip>
        </template>
      </a-table>
      <Loader v-if="!isCommunication" />
      </div>
    </a-col>
  </a-row>
  <div v-if="addDocument" :class="addDocument==true? 'notesDetailBg addNotes show':'notesDetailBg addNotes'">
    <div class="notesDetail 23">
      <div class="notesHeader">
        <h4>Add Documents</h4>
        <CloseOutlined @click="closeModal" />
      </div>
      <div class="notesBody">
        <Documents
          :paramId="paramsId"
          :idPatient="pId"
          entity="patient"
          @document="addDocumentsModal($event)"
        />
      </div>
    </div>
  </div>
  <!-- <a-modal width="50%" v-model:visible="addDocument" title="Add Documents" :maskClosable="false" centered  @cancel="closeModal()" :footer="false">
    <Documents  :paramId="paramsId" :idPatient="patientDetails.id"  entity="patient" @document="addDocumentsModal($event)" />
    </a-modal> -->
</template>
<script>
import {
  computed,
  defineComponent,
  watchEffect,
  reactive,
  defineAsyncComponent,
  ref,
} from "vue";
import Loader from "@/components/loader/Loader";
import {
  FileOutlined,
  DeleteOutlined,
  CloseOutlined,
  // EditOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { warningSwal, arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
// import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Loader,
    FileOutlined,
    DeleteOutlined,
    CloseOutlined,
    // EditOutlined,
    Documents: defineAsyncComponent(() =>
      import("@/components/modals/forms/Documents")
    ),
  },
  props: {
    patientId: {
      type: Array,
    },
    patientUdid: {
      type: Array,
    },
    isCommunication: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    // const route = useRoute();
    const pId = props.patientId ? reactive(props.patientId) : reactive(props.patientUdid);
    const addDocument = ref();
    const paramsId = ref();
    const documentsColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        className: "doc-name",
        sorter: {
          compare: (a, b) => a.name - b.name,
          multiple: 3,
        },
      },
      {
        title: "Document",
        dataIndex: "document",
        key: "document",
        className: "patient-document",
        slots: {
          customRender: "document",
        },
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        className: "doc-type",
        sorter: {
          compare: (a, b) => a.type - b.type,
          multiple: 3,
        },
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        className: "doc-tags",
        slots: {
          customRender: "tags",
        },
      },
    ];
    watchEffect(() => {
      if(pId) {
        store.dispatch("patientDocuments", pId);
      }
    });
    const patientDocuments = computed(() => {
      return store.state.patients.patientDocuments;
    });

    const deleteDocument = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          const data = {
            id: pId,
            documentId: id,
          };
          store.dispatch("deleteDocument", data).then(() => {
            store.dispatch("patientDocuments", pId);
            if (patientDocuments.value.length <= 1) {
              emit("closeModal", {
                modal: "documentDetails",
                value: false,
              });
            }
            store.dispatch("latestDocument", pId);
            store.dispatch("patientTimeline", {
              id: pId,
              type: "",
            });
          });
        }
      });
    };

    const showDocumentModal = () => {
      (addDocument.value = true), (paramsId.value = true);
    };
    function closeModal() {
      addDocument.value = false;
      paramsId.value = false;
    }

    function addDocumentsModal(value) {
      addDocument.value = value;
      paramsId.value = value;
    }
    return {
      addDocumentsModal,
      paramsId,
      closeModal,
      showDocumentModal,
      addDocument,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      documentsColumns,
      patientDocuments,
      deleteDocument,
      pId,
    };
  },
});
</script>

<style>
.doc-name {
  width: 200px;
}
.patient-document {
  width: 200px;
}
th.doc-type,
td.doc-type {
  width: 200px;
  /* text-align: center !important; */
}
th.doc-tags,
td.doc-tags {
  width: 400px;
  /* text-align: center !important; */
}
.doc-actions {
  width: 80px;
}
.documentsTab {
  min-height: 300px;
}
</style>
