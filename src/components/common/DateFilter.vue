<template>
<div class="filter" v-if="timeLineCustomButton && Buttons" >
    <label v-for="item in timeLineCustomButton" :key="item?.globalCodeId">
    <a-button  @click="showButton(item?.globalCodeId)" :class="Buttons?.globalCodeId== item?.globalCodeId ? 'active' : ''" v-if="!arrayToObjectData(hideArray,item?.globalCode,'name')"> {{item?.globalCode}}</a-button>
    </label>
</div>
</template>
<script>
import { useStore } from 'vuex'
import { arrayToObjectData } from "@/commonMethods/commonMethod";
export default {
    props: {
        Buttons: {
            type: Object,
            required: true
        },
        hideMonth:{
            type:String
        },
        hideYear:{
            type:String
        },
        hideCustom:{
            type:String
        },
        hideArray:Array,
        timeline:Array,
        buttonCommit:String,
        custom: Boolean,
        commit: String,
    },
    setup(props, {
        emit
    }) {
        const store = useStore()
        function showButton(id) {
                store.dispatch("timeLine", {
                    id: id,
                    commit: props.commit
                }).then((resp) => {
                    if(resp==true){
                        emit("clickButtons", id)
                    }
                })
        }
        return {
            showButton,
            timeLineCustomButton:store.getters.filterDateDataGet,
            arrayToObjectData
        }
    }
}
</script>
