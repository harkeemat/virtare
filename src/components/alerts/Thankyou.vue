<template>
  <!-- <img src="@/assets/images/thankyou.png" alt="image" /> -->
  <h1>Thank you for your response.</h1>
  <!-- <h4>{{ props.message }}</h4> -->
</template>

<script setup>
  const props = defineProps(['message'])
</script>

<style lang="scss" scoped>
 h4,h1{
  text-align: center;
  font-size: 40px;
 }
</style>
