
<template>
  <a-table class="common-table" v-if="careCoordinatorSummary.staffAppoitnments?.length > 0" :dataSource="careCoordinatorSummary.staffAppoitnments" :columns="careCoordinatorSummary.staffAppoitnmentsColumns" :pagination="false" :customRow="customRow" @change="tableSorting">
  </a-table>
  <div v-else>
    <EmptyTable :text="$t('global.appointmentTable')" />
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { computed, onMounted } from "vue"
import {
  useRoute,
  // useRouter
} from 'vue-router';
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";

const route = useRoute()
// const router = useRouter()
const store = useStore()

/* function customRow(record) {
  return {
    onClick: () => {
      router.push({
        name: "PatientDetails",
        params: { udid: record.patientUdid },
      });
    },
  };
} */

  const careCoordinatorSummary = computed(() => {
    return store.state.careCoordinatorSummary
  })
  
  let scroller = "";
  let data = []

  onMounted(() => {
    store.dispatch("staffAppoitnments", route.params.udid);

    var tableContent = document.querySelector(".ant-table-body");

    tableContent?.addEventListener("scroll", (event) => {

      let maxScroll = event.target.scrollHeight - event.target.clientHeight;
      let currentScroll = event.target.scrollTop + 2;
      if (currentScroll >= maxScroll) {
        // you're at the bottom of the page
        let current_page = careCoordinatorSummary.value.staffSummaryAppointmentMeta.value.current_page + 1;

        if (current_page <= careCoordinatorSummary.value.staffSummaryAppointmentMeta.value.total_pages) {
          scroller = maxScroll;
          store.state.careCoordinatorSummary.staffSummaryAppointmentMeta = "";

          data = careCoordinatorSummary.value.staffAppoitnments;
          //store.state.patients.patientList = ""

          store
            .dispatch(
              "staffAppoitnments", {
                id: route.params.udid, data:
                  "?page=" +
                  current_page +
                  store.getters.orderTable.value.data
            }
            )
            .then(() => {
              loadMoredata();
            });
        }
      }
    });
  });

  function loadMoredata() {
    const newData = careCoordinatorSummary.value.staffAppoitnments;
    newData.forEach((element) => {
      data.push(element);
    });
    careCoordinatorSummary.value.staffAppoitnments = data;
    var tableContent = document.querySelector(".ant-table-body");

    setTimeout(() => {
      tableContent.scrollTo(0, scroller);
    }, 50);
  }

</script>

<style>

</style>
