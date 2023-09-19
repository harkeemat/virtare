
<template>
    <a-skeleton  active v-if="skeleton" />
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
    name: 'Skeleton',
    setup() {
        const store = useStore();

        const skeleton = computed(() => {
            return store.state.patientsStore.skeleton;
        });

        return {
            skeleton
        }
    }
}
</script>

<style></style>