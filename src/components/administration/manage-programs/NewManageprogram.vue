<template>
    <div class="common-wrapper">
        <a-row :gutter="16">
            <a-col :span="24">
                <a-typography-title :level="2" class="common-heading">Programs</a-typography-title>
                <a-typography-text class="common-tag-line caption">
                    {{ $t('global.programText') }}
                </a-typography-text>
            </a-col>
            <a-col :span="24" v-if="rolesPermissionFind(screensPermissions, [488])">
                <ProgramTable @is-edit="showEdit($event)"> </ProgramTable>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import ProgramTable from "@/components/administration/manage-programs/ProgramTable";
import { useStore } from 'vuex';
import { onMounted } from 'vue-demi';
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
const store = useStore()
onMounted(() => {

})
const screensPermissions = store.getters.screensPermissions
</script>

<style lang="scss" scoped>
.common-table {
    margin: 60px 0 0;
}
</style>