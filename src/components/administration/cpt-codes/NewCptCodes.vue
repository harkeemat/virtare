<template>
    <div class="common-wrapper">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-typography-title :level="2" class="common-heading">CPT Codes</a-typography-title>
                <a-typography-text class="common-tag-line caption">
                    {{ $t('global.cptCodeText') }}
                </a-typography-text>
            </a-col>
            <a-col :span="24" v-if="rolesPermissionFind(screensPermissions,[487])">
                <CptCodesTable @is-visible="editModal($event)" />
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import CptCodesTable from "@/components/administration/cpt-codes/tables/CptCodesTable";
import { onMounted } from 'vue-demi';
import { useStore } from 'vuex';
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
const store = useStore()
const screensPermissions =  store.getters.screensPermissions

onMounted(() => {
    store.dispatch('cptCodesList')
})

</script>

