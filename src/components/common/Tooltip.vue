<template>
        <a-tooltip>
            <template #title>
                <span>{{text}}</span>
            </template>
            <InfoCircleOutlined class="infoIcon"/>
        </a-tooltip>
</template>
    
    <script>
    import { InfoCircleOutlined } from "@ant-design/icons-vue";
    export default {
        name: 'Tool Tip',
        components: {
            InfoCircleOutlined
        },
        props:{
            text:String,
        }
       
    }
    </script>
    <style>
    
    </style>