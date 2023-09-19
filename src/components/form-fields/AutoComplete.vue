<template>
    <a-auto-complete :value="value" :options="options" style="width: 100%" :placeholder="placeholder" @select="onSelect"
        @search="onSearch" />
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    emits: ["onSelect"],
    props: {
        placeholder:String,
        record: Array
    },
    setup(props, { emit }) {
        const value = ref(undefined);
        const options = ref([]);
        const onSearch = searchText => {
            
            options.value = !searchText
                ? []
                : mockVal(searchText);
        };
        const onSelect = value => {
            emit('onSelect', value);
        };

        const mockVal = (str) => {
            var search = new RegExp(str, 'i'); // prepare a regex object
            let b = props?.record?.filter(item => search.test(item));
            return b?.length > 0 ? b.map((item) => {
                return { value: item }
            }) : []
        }
        return {
            value,
            options,
            onSearch,
            onSelect,
        };
    },
});
</script>