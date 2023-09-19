<template>
  <div style="display:none"></div>
</template>
<script>
import { useStore } from 'vuex';
import { onMounted, reactive } from "vue-demi";
import {
  arrayToObjectData,
} from "@/commonMethods/commonMethod";
export default {
  name: "Common Base Components",
  components: {},
  props: {
    text: String,
    formId: String,
  },
  setup(props) {
    const store = useStore()
    const dataId = reactive(props.formId)
    const formTitle = store.getters.tooltip
    onMounted(() => {
      setTimeout(() => {
        const form = document.getElementById(dataId);
        if (form) {
          
           let formToolTipArray =  arrayToObjectData(formTitle.value,dataId,'udid','formLable')
          Array.from(form.elements).forEach((input) => {
            let label = input?.closest(".form-group")?.querySelector("label");
            let description = arrayToObjectData(formToolTipArray,label?.textContent,'name','description')
            if(description && label){
                
                let html = '<span tabindex="-1" role="img" aria-label="info-circle" class="anticon anticon-info-circle infoIcon" title="'+description+'"><svg focusable="false" class="" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg></span>'
                
                label.innerHTML = label?.textContent + " "+ html
            }
          });
        }
      }, 1000);
    });
    return {
        arrayToObjectData
    };
  },
};
</script>