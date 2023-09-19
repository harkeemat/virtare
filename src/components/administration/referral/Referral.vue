<template>
<div class="common-bg">
    <a-row>
        <a-col :span="12">
            <h2 class="pageTittle">
                Referrals
            </h2>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="12" v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [409])">
            <SearchField endPoint="referral" />
        </a-col>
        <a-col :span="24">
            <ReferralTable />
        </a-col>
    </a-row>
</div>
</template>
<script setup>
import ReferralTable from "@/components/administration/referral/table/ReferralTable";
import { onUnmounted, onMounted} from "vue";
import SearchField from "@/components/common/input/SearchField";
import { rolesPermissionFind} from "@/commonMethods/commonMethod";

import {
    useStore
} from "vuex"
import { useRoute } from 'vue-router';
        const {state ,dispatch,commit} = useStore()
        onMounted(() => {
            dispatch("searchTable", '&search=')
            dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
        })
        onUnmounted(() => {
            dispatch("searchTable", '&search=')
            dispatch('orderTable', {
                data: '&orderField=&orderBy='
            })
            commit("filter", '')
            commit("dateFilter", '')
        })
            
</script>
<style lang="scss" scoped>
.search-input {
  margin: 60px 0 15px;
  width: 500px !important;
}
</style>