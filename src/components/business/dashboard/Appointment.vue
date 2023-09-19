
<template>
<a-col :sm="12" :xs="24">
    <a-card :title="title" class="common-card">
        <a-table class="sortIconTable" rowKey="id" :columns="column" :data-source="data" :scroll="{ y:187 }" :pagination="false">
            <template #patientName="{text, record}" v-if="arrayToObjact(screensPermissions,63)">
                <router-link :to="'/patients-summary/'+record.patient_id">{{ text }}</router-link>
            </template>
             <template #patientName="{text}" v-else>
                <span>{{ text }}</span>
            </template>
            <template #staff="{record}" v-if="arrayToObjact(screensPermissions,38)">
                <router-link :to="'/coordinator-summary/'+record.staff_id">{{record.staff}}</router-link>
            </template>
            <template #staff="{record}" v-else>
                <span>{{record.staff}}</span>
            </template>
        </a-table>
    </a-card>
</a-col>
</template>
<script>
import { reactive } from "vue";
import {arrayToObjact} from "@/commonMethods/commonMethod"
export default {
  props: {
    appointment: {
      type: Array,
    },
    columns: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const data = reactive(props.appointment);
    const column = reactive(props.columns);
    return {
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      data,
      column,
    };
  },
};
</script>

<style>
.common-card {
  min-height: 335px !important;
}
</style>
