<template>
  <a-modal width="90%" title="Document Detail" centered>
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <a-table  rowKey="id" class="sortIconTable"
          
          :columns="documentsColumns"
          :data-source="patientDocuments"
          :scroll="{ x: 900 }"
          :pagination="false">
          <template #tags="{record}">
            <div v-for="tag in record.tags.data" :key="tag.id">
              <span class="tags">{{ tag.tag }}</span>
            </div>
          </template>
          <template #action="{record}" v-if="arrayToObjact(screensPermissions,318)">
            <a class="icons"><DeleteOutlined @click="deleteDocument(record.id)" /></a>
          </template>
          <template #document="{record}">
            <a :href="record.document" download>
              <FileOutlined />
            </a>
          </template>
        </a-table>
        <Loader />
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { computed, defineComponent, watchEffect, reactive } from "vue";
import Loader from "@/components/loader/Loader";
import {
  FileOutlined,
  DeleteOutlined,
  // EditOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import {warningSwal,arrayToObjact} from "@/commonMethods/commonMethod"
import { messages } from '@/config/messages';
// import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Loader,
    FileOutlined,
    DeleteOutlined,
    // EditOutlined,
  },
  props: {
    patientDetails: {
      type: Array
    }
  },
  setup(props, {emit}) {
    const store = useStore();
    // const route = useRoute();
    const patientId = reactive(props.patientDetails.id);
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
          customRender: "document"
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
      {
        title: "Action",
        dataIndex: "action",
        className: "doc-actions",
        slots: {
          customRender: "action",
        },
      },
    ];
    watchEffect(() => {
      store.dispatch('patientDocuments', patientId)
    })
    const patientDocuments = computed(() => {
      return store.state.patients.patientDocuments;
    })

    const deleteDocument = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          const data = {
            id: patientId,
            documentId: id,
          }
          store.dispatch('deleteDocument', data).then(() => {
            store.dispatch('patientDocuments', patientId)
            if(patientDocuments.value.length <= 1) {
              emit('closeModal', {
                modal: 'documentDetails',
                value: false
              });
            }
            store.dispatch('latestDocument', patientId)
            store.dispatch('patientTimeline', {
              id: patientId,
              type: ''
            });
          })
        }
      })
    }

    return {
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      documentsColumns,
      patientDocuments,
      deleteDocument,
    };
  },
});
</script>

<style>
  .doc-name { width: 200px; }
  .patient-document { width: 400px; }
  th.doc-type, td.doc-type { width: 200px; text-align: center !important; }
  th.doc-tags, td.doc-tags { width: 200px; text-align: center !important; }
  .doc-actions { width: 80px; }
</style>
