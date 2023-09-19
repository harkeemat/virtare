<template>
    <div  class="validation">
      {{name}}
    </div>
</template>

<script>
export default {
  name:'ErrorMessage',
  props: {
    name: {
      type: String,
      required: true
    },
    
  },
}
</script>
<style>
.validation{
    color: red;
}
</style>