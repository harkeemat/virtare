<template>
<a-table class="sortIconTable" :columns="columns" :data-source="data" :scroll="{ x: 900 }" @change="onChange">
</a-table>
</template>
<script>
import {
    ref
} from "vue";

const columns = [{
        title: "Resource Name",
        dataIndex: "name",
        sorter: {
            compare: (a, b) => a.template - b.template,
            multiple: 3,
        },

    },
    {
        title: "Person Name",
        dataIndex: "personName",

    },
    {
        title: "Phone Number",
        dataIndex: "phoneNumber",

    },
    {
        title: "Address",
        dataIndex: "address",

    },

];
const data = [{
        key: "1",
        name: "",
        personName: "Roy",
        phoneNumber: "8888888888",
        address: "chandigarh"
    },
    {
        key: "2",
        name: "",
        personName: "Roy",
        phoneNumber: "8888888888",
        address: "chandigarh"
    },
    {
        key: "3",
        name: "",
        personName: "Roy",
        phoneNumber: "8888888888",
        address: "chandigarh"
    },
];
export default {
    components: {

    },
    setup() {

        return {
            columns,
            data,

            size: ref([]),
        };
    },
};
</script>
