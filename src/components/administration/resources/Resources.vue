<template>
<div class="common-bg">
    <a-row>
        <a-col :span="24">
            <h2 class="pageTittle">
                Resources
                <div class="commonBtn">
                    <a-button class="btn primaryBtn" @click="showModal('true')">Create New Resources</a-button>
                </div>
            </h2>
        </a-col>
        <a-col :span="12">
            <a-select v-model:value="value2" :size="size" mode="tags" style="width: 100%" placeholder="Search . . ." :options="searchoptions" @change="handleChange2">
            </a-select>
        </a-col>
        <a-col :span="24" class="mt-25">
            <ResourceTable />
        </a-col>
    </a-row>
</div>
<CreateResource v-model:visible="visible" />
</template>
<script>
import ResourceTable from "./ResourceTable"
import CreateResource from "@/components/modals/CreateResource";
import {
    ref
} from "vue";
export default {
    components: {
        ResourceTable,
        CreateResource
    },
    setup() {
        const visible = ref(false)
        const showModal = (e) => {
            visible.value = e
        }
        return {
            visible,

            showModal,
        };
    },
};
</script>
