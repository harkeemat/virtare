<template>
    <div class="common-wrapper" v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [543])">

        <a-row :gutter="16">
            <a-col :span="12">
                <a-typography-title :level="2" class="common-heading">{{ $t('global.processBilling') }}</a-typography-title>
                <a-typography-text class="common-tag-line caption">
                    {{ $t('global.processBillingText') }}
                </a-typography-text>
            </a-col>
            <a-col :span="12" class="text-right">
                <a-dropdown-button @click="handleButtonClick" class="primary-dropdown">
                    Actions
                    <template #overlay>
                        <a-menu @click="handleMenuClick" class="actionDropdown">
                            <a-menu-item key="1" :class="activeTab == 1 ? 'active' : ''">
                                Processed Billing
                            </a-menu-item>
                            <a-menu-item key="2" :class="activeTab == 2 ? 'active' : ''">
                                Process Billing
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <template #icon>
                        <CaretDownOutlined />
                    </template>
                </a-dropdown-button>
            </a-col>
            <a-col :span="24" v-if="activeTab == 2">
                <ProcessForm v-if="activeTab == 2" />
            </a-col>
            <a-col :span="24">
          <!-- <SearchField  v-if="activeTab == 1"
           commit="PROCESS_BILLING_LIST"
           endPoint="list/billingReport"
           loader="loadingTableStatus"
          /> -->
          <SpecialistsTable />
          <BillingTable v-if="activeTab == 1" />
        </a-col>
            <!-- <a-col :span="24">
                <BillingTable v-if="activeTab == 1" />
            </a-col> -->
        </a-row>
    </div>
</template>
  
<script setup>
import { onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
//import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BillingTable from "@/components/billing/NewBillingTable";
import { rolesPermissionFind } from '@/commonMethods/commonMethod';
import Button from "@/components/button/Button.vue";
import ProcessForm from "@/components/billing/ProcessForm"
import { CaretDownOutlined } from "@ant-design/icons-vue";
// import SearchField from "@/components/common/input/SearchField";
const { dispatch, commit,state } = useStore();
const activeTab = ref(1)
onMounted(() => {
    dispatch("orderTable", {
        data: "&orderField=&orderBy=",
    });
    dispatch("searchTable", "&search=");
    commit("billingFilterDate", { fromDate: '', toDate: '' })
    //store.dispatch("billingList");
});
const labelCol = { span: 24 }
onUnmounted(() => {
    commit("billingFilterDate", { fromDate: '', toDate: '' })
    commit("otherFilters", '')
});
const handleMenuClick = (event) => {
    activeTab.value = event?.key
}
//const screensPermissions = store.getters.screensPermissions
</script>
    
<style lang="scss" scoped>
.common-form {
    margin: 43px 0 59px;
}

.search-input {
    margin: 60px 0 15px;
    width: 500px !important;
}
</style>