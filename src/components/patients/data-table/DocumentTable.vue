<template>
  <a-table class="sortIconTable" rowKey="id" :columns="documentColumns" :data-source="documentsData" :pagination="false" :scroll="{ x: 900 }">
    <template #tags="text">
      <span v-for="tag,i in text.text.data" :key="tag.id">
        <p>{{i==0?' ':', '}}{{ tag.tag }}</p>
      </span>
    </template>
    <template #document="{record}">
      <a :href="record.document" download>
        <DownloadOutlined />
      </a>
    </template>
    <template #action="text">
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions, 84)">
        <template #title>
          <span>{{$t('global.edit')}}</span>
        </template>
        <a class="icons" @click="editDocument(text.record.id);actionTrack(Id,318,'patient')">
          <EditOutlined />
        </a>
      </a-tooltip>
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions, 84)">
        <template #title>
          <span>{{$t('global.delete')}}</span>
        </template>
        <a class="icons" @click="deleteDocument(text.record.id);actionTrack(Id,318,'patient')">
          <DeleteOutlined />
        </a>
      </a-tooltip>
    </template>
  </a-table>
</template>

<script>
import { computed } from "vue";
import { EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { warningSwal,actionTrack,arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
export default {
  components: {
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
  },
  props: {
    Id: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRoute();
    const route = useRoute()

    const documentDetails = computed(() => {
      return store.state.patients.documentDetails
    })

    const editDocument = (id) => {
      store.commit('errorMsg', null)
      store.dispatch('documentDetails', {
        patientUdid: props.Id ? props.Id : route.params.udid,
        documentUdid: id
      }).then(() => {
        emit('onEditDocument', documentDetails.value)
      })
    }

    function deleteDocument(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          emit("deleteDoc")
          store.dispatch("deleteDocument", {
            id: props.Id ? props.Id : router.params.udid,
            documentId: id,
          });
          setTimeout(() => {
            store.dispatch(
              "documents",
              props.Id ? props.Id : router.params.udid
            );
          }, 2000);
        }
      });
    }
    const documentsData = computed(() => {
      return store.state.patients.documents;
    });

    const documentColumns = computed(() => {
      return store.state.patients.documentColumns;
    });
    return {
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      actionTrack,
      paramsId:router.params.udid,
      documentColumns,
      documentsData,
      editDocument,
      deleteDocument,
    };
  },
};
</script>
