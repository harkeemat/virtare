<template>
<a-modal width="1000px" title="Patient Search" :maskClosable="false" @cancel="closeModal()" :footer="null">
    <a-form ref="formRef" autocomplete="off" :model="patientSearch" @finish="submitForm">
        <a-row :gutter="24">
            <a-col :sm="20" :xs="24">
                <a-form-item :label="$t('patient.patients')" name="search" :rules="[{ required: true, message: $t('patient.patients')+' '+$t('global.validation') }]">
                    <a-input v-model:value="patientSearch.search" placeholder="Search patients" size="large" />
                </a-form-item>
            </a-col>
            <a-col :sm="4" :xs="24">
                <a-button type="primary" size="large" html-type="submit">Search</a-button>
            </a-col>
        </a-row>
    </a-form>
    <a-row :span="24">
        <a-col :sm="24" :xs="24">
            <a-table class="sortIconTable" rowKey="id" :pagination="false" :columns="patientsData.patientSearchWithBitrixCols" :data-source="patientsData.patientSearchWithBitrix" :scroll="{ x: 900 }">
                <template #title="{record}" >
                    <span v-if="getBitrixFieldsName && record"> {{record[getBitrixFieldsName?.[0]?.bitrixId] + ' ' + record[getBitrixFieldsName?.[1]?.bitrixId]}} </span>
                </template>
                <template #action="text">
                        <a class="icons"  @click="fetchFromBitrix(text.record.ID)">
                          <span class="arrowIcon" > Fill </span> <arrow-right-outlined :style="{fontSize: '20px', color: '#08c'}"/>
                        </a>
                </template>
            </a-table>
        </a-col>
        <Loader />
    </a-row>
</a-modal>
</template>

<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader";
import {ArrowRightOutlined} from "@ant-design/icons-vue";
export default {
    components:{
        Loader,
        ArrowRightOutlined
    },
  setup(props,{emit}) {
    const store = useStore();
    const patientSearch = reactive({
      search: "",
    });

    function submitForm() {
        store.dispatch("getBitrixFieldsName").then(()=>{
 store.dispatch("patientSearchWithBitrix", patientSearch);
        })
     
      
    }
    const patientsData = computed(()=>{
        return store.state.patients
    })
    function fetchFromBitrix(id){
        store.dispatch('fetchFromBitrix',id)
        setTimeout(()=>{
        if(store.state.patients.fetchFromBitrixStatus!=null){
        emit('closeSearchPatient',false)
        emit('clearValidtion')
        closeModal()
        }
        },2000)
        
    }
    function closeModal(){
        patientSearch.search ='',
        store.state.patients.patientSearchWithBitrixCols =null,
        store.state.patients.patientSearchWithBitrix =null

    }
    return {
    closeModal,
    fetchFromBitrix,
    patientsData,
      submitForm,
      patientSearch,
      getBitrixFieldsName:store.getters.getBitrixFieldsName
    };
  },
};
</script>

<style>
.arrowIcon{
    font-size:18px
}
</style>
