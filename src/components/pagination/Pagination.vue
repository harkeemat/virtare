<template>
    <div class="commonPagination" v-if="meta?.total > meta?.per_page">
        <a-pagination v-model:current="current" :total="meta?.total" :showSizeChanger="false" :defaultPageSize="meta?.per_page"
            @change="paginationCall" />
    </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
const props  = defineProps(['meta','commit','endpoint','params','loader','entity'])

        const store = useStore()
        const current = ref(1)
        watchEffect(()=>{
            props.meta?.current_page ? current.value = props.meta.current_page : ''
        })
        const paginationCall = () => {
            let endParam = '?page=' + current.value
            //Check filetrs 
            if (props?.params) {
                //check filter first latter
                let firstWord = props?.params?.charAt(0)
                if (firstWord == '?' || firstWord == '&') {
                    //if first latter is ? or & then remove first latter and add auto &
                    endParam = '?page=' + current.value + '&' + props?.params.slice(1)
                } else {
                    //if first latter without ? or & then add &
                    endParam = '?page=' + current.value + '&' + props?.params.slice(1)
                }
            }
            let pageNum = props?.entity == 'vitalsList' ? `&page=${current.value}` :  `?page=${current.value}`
            store.commit('vitals/endParams', pageNum)

            store.dispatch('commonAction', { 'method': 'get', 'endPoint': props?.endpoint + endParam +store.getters.orderTable.value?.data+store.getters.searchTable.value, 'loader': props?.loader, "commit": props?.commit })
        }
</script>