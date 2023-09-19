
<template>
  <a-table class="common-table" v-if="careCoordinatorSummary.staffRoles?.length > 0" :dataSource="careCoordinatorSummary.staffRoles" :columns="careCoordinatorSummary.staffRolesColumns" :pagination="false" :customRow="customRow" @change="tableSorting">
  </a-table> 
  <div v-else>
    <EmptyTable :text="$t('global.rolesTable')" />
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  // defineProps
} from "vue";
import {
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
// import { warningSwal } from "@/commonMethods/commonMethod";
// import { messages } from "@/config/messages";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";

/* const props = defineProps({
  Id: String,
}) */

const store = useStore();
const router = useRoute();

const careCoordinatorSummary = computed(() => {
  return store.state.careCoordinatorSummary;
});


onMounted(() => {
  store.dispatch("staffRoles", router.params.udid);
})

/* function deleteRole(id) {
  warningSwal(messages.deleteWarning).then((response) => {
    if (response == true) {
      store.dispatch("deleteStaffRole", {
        id: props.Id ? props.Id : router.params.udid,
        roleID: id,
      }).then(() => {
        store.dispatch("roleList", props.Id ? props.Id : router.params.udid);
        store.dispatch("staffSummary", router.params.udid);
      })
    }
  });
} */
</script>
