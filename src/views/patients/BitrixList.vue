<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="18">
        <a-typography-title :level="2" class="common-heading">Patients</a-typography-title>
        <a-typography-text class="common-tag-line caption">{{ bitrix.patients.length }} Searched
          patients</a-typography-text>
      </a-col>

      <a-col :span="6" class="text-right">

      </a-col>

      <a-col :span="24">
        <EmptyTable :text="$t('global.bitrixTable')" v-if="bitrix.patients.length == 0" />
        <a-table class="common-table" :dataSource="bitrix.patients" :columns="columns" :pagination="false"
          :scroll="{ y: 'calc(100vh - 360px)' }"
          :customRow="({ id }) => ({ onclick() { dispatch('fillForm',id) } })" :loading="bitrix.isFetching"
          v-else>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'flag'">
              <span class="patient-status" :style="'background-color:' + record?.color">
                <svg width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.38384 4.052H1.62384V2.54H0.231844V1.82H1.62384V0.308H2.38384V1.82H3.77584V2.54H2.38384V4.052Z"
                    fill="white" />
                </svg>
                <span class="check-mark">
                  <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.37634 3.5L0 2.07021L0.5 1.5L1.37634 2.5L3.5 0.5L4 0.774468L1.37634 3.5Z" fill="white" />
                  </svg>
                </span>
              </span>
            </template>
          </template>
        </a-table>
      </a-col>

    </a-row>
  </div>

  <a-drawer placement="right" :closable="false" :visible="bitrix.visible" width="60%">
    <PatientForm @hideDrawer=" commit('visible',false)" v-if="bitrix.visible" />
  </a-drawer>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import EmptyTable from '../../components/administration/clients/EmptyTable.vue';
import { useRouter } from 'vue-router';
import PatientForm from '../../components/patients/patientsList/modals/PatientForm.vue';

const { state, dispatch,commit } = useStore();
const { bitrix } = state;
const { push } = useRouter();

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'DOB',
    dataIndex: 'dob',
    key: 'dob',
  }
]

onMounted(() => {
  /** redirect router if bitrix state is empty  */
  if (bitrix.patients.length == 0)
    push({ name: 'PatientsList' })

});

onUnmounted(() => {
  commit('visible',false);
});

</script>

<style lang="scss" scoped>
.common-table {
  margin-top: 60px;
}
</style>
