
<template>
  <a-layout-content>
      <div class="common-bg">
          <a-row>
              <div class="commonTags">
                  <a-tag v-if="route.query.filter" closable @close="remove('filter')">{{escalationType ? getName(route.query.filter):''}}</a-tag>
                  <a-tag v-if="route.query.toDate && route.query.fromDate" closable @close="remove('date')">
                      {{timeStampFormate(route.query.fromDate,globalDateFormat) }} To {{timeStampFormate(route.query.toDate,globalDateFormat)}}
                  </a-tag>
              </div>
          </a-row>
          <a-row>
              <a-col :span="12">
                  <h2 class="pageTittle">
                    {{ $t('alerts.alert') }}
                  </h2>
              </a-col>
              <a-col :span="12" v-if="arrayToObjact(screensPermissions, 403)">
                  <div class="text-right">
                      <!-- <a-button @click="showEscalationModal" type="primary">{{'Add Escalation'}}</a-button> -->
                      <ShowModalButton @click="showEscalationModal"  :buttonText="$t('alerts.alert')" />
                  </div>
              </a-col>
              <a-col :span="12">
                  <SearchField endPoint="escalation" />
              </a-col>
              <a-col :span="12">
                    <div class="text-right mb-24" >
                        <ExportToExcel  @click="exportExcel('escalation_report',filtterDates)" v-if="arrayToObjact(screensPermissions, 333)" />
                    </div>
                </a-col>
              <a-col :span="24" style="padding-top:20px">
                  <EscaltionTable :columnData="escalation.columnData" :escalationList="escalation.escalation" @showEscalationData="showEscalationData($event)" />
              </a-col>
          </a-row>
          <EscaltionViewModal v-model:visible="escaltionViewModal" v-if="escaltionViewModal" @saveViewModal="saveViewModal($event)" :patientId="patientId"/>
          <EscaltionModal v-model:visible="escaltionModal" v-if="escaltionModal" @saveModal="saveModal($event)" :isEdit="isEdit" />
      </div>
      <Loader />
  </a-layout-content>
  <Loader />
</template>
<script>
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import {
  globalDateFormat,
  timeStampFormate,
  arrayToObjact,
  exportExcel
} from "@/commonMethods/commonMethod";
import EscaltionTable from "@/components/common/tables/EscalationTable";
import EscaltionViewModal from "@/components/escalations/EscalationViewModal";
import Loader from "@/components/loader/TableLoader";
import EscaltionModal from "@/components/escalations/EscalationModal";
import SearchField from "@/components/common/input/SearchField";
import { useRoute, useRouter } from "vue-router";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
export default {
  components: {
    ShowModalButton,
    EscaltionTable,
    EscaltionModal,
    Loader,
    EscaltionViewModal,
    SearchField,
    ExportToExcel
  },

  setup() {
    const store = useStore();
    const escaltionViewModal = ref(false);
    const button = ref(2);
    const route = useRoute();
    const router = useRouter();
    const escaltionModal = ref(false);
    const isEdit = ref();
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    });

    onMounted(() => {
      store.commit("dateFilter", "");
      // store.dispatch("escalation")
      if (route.query.filter || route.query.fromDate) {
        let filter = route.query.filter ? route.query.filter : "";
        let date =
          route.query.fromDate && route.query.toDate
            ? "&fromDate=" +
              route.query.fromDate +
              "&toDate=" +
              route.query.toDate
            : "&fromDate=&toDate=";
        store.dispatch("escalation", "?filter=" + filter + date);
      } else {
        store.dispatch("escalation");
      }

      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    const showEscalationModal = () => {
      store.commit("resetEscalationCounter");
      store.state.escalations.addBasicEscalation = null;
      escaltionModal.value = true;
      isEdit.value = null;
      store.state.patients.patientDetails =null
    };

    const saveModal = (value) => {
      escaltionModal.value = value;
    };
    const saveViewModal = (value) => {
      escaltionViewModal.value = value;
    };
    const patientId = ref()
    const showEscalationData = (data) => {
      if (data.type == "view") {
        escaltionViewModal.value = data.value;
        isEdit.value = data.id;
        patientId.value = data.patientId
      } else {
        escaltionModal.value = data.value;
        isEdit.value = data.id;
        patientId.value = data.patientId
      }
    };
    const escalation = computed(() => {
      return store.state.escalations;
    });
    onUnmounted(() => {
      store.commit("filter", "");
      // store.commit("dataFilter", "");
      store.commit("dateFilter", "");
    });

    watchEffect(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    function remove(event) {
      if (event == "filter") {
        if (route.query.fromDate && route.query.toDate) {
          store.dispatch(
            "escalation",
            "?fromDate=" +
              route.query.fromDate +
              "&toDate=" +
              route.query.toDate
          );
          setTimeout(() => {
            router.replace({
              query: {
                fromDate: route.query.fromDate,
                toDate: route.query.toDate,
              },
            });
          }, 1000);
        } else {
          router.replace({
            query: {},
          });
          store.dispatch("escalation");
        }
      } else {
        if (route.query.filter) {
          router.replace({
            query: {
              filter: route.query.filter,
            },
          });
          store.dispatch("escalation", "?filter=" + route.query.filter);
        } else {
          router.replace({
            query: {},
          });
          store.dispatch("escalation");
        }
      }
    }
    const escalationType = store.getters.escalationType;
    function getName(name) {
      let idToName = escalationType.value.find((data) => data.id == name);
      return idToName ? idToName.name : "";
    }

    return {
      exportExcel,
      saveViewModal,
      isEdit,
      button,
      escalation,
      escaltionViewModal,
      showEscalationData,
      saveModal,
      escaltionModal,
      showEscalationModal,
      globalDateFormat,
      patientDetails,
      size: ref("large"),
      route,
      remove,
      timeStampFormate,
      getName,
      arrayToObjact,
      escalationType,
      screensPermissions: store.getters.screensPermissions,
      patientId
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
