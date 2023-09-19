<template>
<a-modal max-width="1140px" width="70%" title="ICD 10 code" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24" class="row">
        <a-col :sm="24" :xs="24" v-if="conditionsData.length>0">
            <ol type="1">
                <div v-for="condition in conditionsData" :key="condition.id">
                    <li> <strong> {{condition.code}} </strong> - {{condition.description}} </li>
                    <hr>
                </div>
            </ol>
        </a-col>
         <a-col :sm="24" :xs="24"  v-else>
         <div class="text-align"><h3>No Data!</h3></div>
         </a-col>
    </a-row>
</a-modal>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    conditionsData: Array,
  },
  components: {},
  setup() {
    const closeModal = () => {
      //
    };
    return {
      closeModal,
    };
  },
});
</script>

<style lang="css">
.text-align{
    text-align: center;
}
</style>
