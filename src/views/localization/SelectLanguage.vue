<template>
<div>
    <select v-model="$i18n.locale" class="select">
        <option class="select" v-for="(lang, i) in langs" :key="`lang-${i}`" :value="lang">
            {{ lang }}
        </option>
    </select>
</div>
</template>
<script>
export default {
    name: 'SelectLanguage',
    data() {

        return {
            langs: ['English', 'Spanish']
        }
    }
}
</script>
<style lang="scss">
.select{
    padding: 5px;
}
</style>