<template>
<template  v-if="headingText">
    <div class="specHead">
<h2 class="pageTittle">
    {{headingText}}
</h2>
<div class="commonBtn">
    <a-button type="primary" @click="showModal" :isEdit="isEdit">
        {{buttonText}}
        <template #icon><PlusCircleOutlined style="fontSize: 16px;"/></template>
    </a-button>
</div>
</div>
</template>

<a-button v-else type="primary" @click="showModal" :isEdit="isEdit">
            {{buttonText}}
            <template #icon><PlusCircleOutlined style="fontSize: 16px;"/></template>
</a-button>
</template>
<script>
import { PlusCircleOutlined } from "@ant-design/icons-vue";
export default {
    name: "ShowModalButton",
    components:{
        PlusCircleOutlined
    },
    props: {
        headingText: {
            type: String,
            required: false,
        },
        buttonText: {
            type: String,
            required: false,
        },
        isEdit: Boolean,
        
    },
    setup(props, {
        emit
    }) {
        const showModal = () => {
            emit("isVisible", true);
        };
        return {
            showModal,
        };
    },
};
</script>
<style lang="scss" scoped>
.specHead {
  display: flex;
  justify-content: space-between;
}
</style>