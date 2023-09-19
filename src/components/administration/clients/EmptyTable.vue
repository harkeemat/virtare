<template>
  <div class="emptyTable">
    <img src="@/assets/images/empty-table-2.svg"/>
    <a-typography-title :level="2" class="common-heading">It's So Empty Here</a-typography-title>
    <a-typography-text class="common-tag-line caption">{{ text }}</a-typography-text>
</div>
</template>
<script >
export default {
  components: {

},
props:{
    text:String
},
  setup() {
    

   
    return {
     
      
    };
  },
};
</script>
