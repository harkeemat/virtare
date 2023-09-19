<template>
  <a-modal width="80%" :title="title" centered :footer="false">
     <a-table v-if="scoreData" rowKey="program" :columns="column" :data-source="scoreData" :scroll="{ x: 900 }"   :pagination=false>
   </a-table>
    <CommonLoader v-else/>
  </a-modal>
</template>
<script>
import { defineComponent } from "vue";
import CommonLoader from "@/components/loader/CommonLoader";
import { useStore } from "vuex";
 const column = [{
        title: "Name",
        dataIndex: "program",

    },
    {
        title: "Score",
        dataIndex: "score",
    },
    
];
export default defineComponent({
  components: {
    CommonLoader
   
  },
  props:{
    
    title:String
  },
 
  setup() {
   
 const store = useStore()
   

    

    
 

    return {
      scoreData: store.getters.scoreCount,
     column,
    };
  },
});
</script>