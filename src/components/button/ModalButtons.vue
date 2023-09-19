<template>
  <div class="steps-action">
    <a-form-item >
      <a-button v-if="!Id && !isReset && !isTimeLog" class="modal-button" @click="handleClear()" html-type="reset">{{$t('global.clear')}}</a-button>
      <a-button v-if="!Id && isReset && !isTimeLog" class="modal-button" @click="handleClear()">{{$t('global.clear')}}</a-button>
      <a-button v-if="Id" class="modal-button" @click="cancel" >Cancel</a-button>
      <a-button v-if="Id" class="modal-button" type="primary" html-type="submit" :disabled="disableButton">{{$t('global.update')}}</a-button>
      <a-button v-if="!Id && name!='communication'" class="modal-button" type="primary" html-type="submit" :disabled="disabled">{{$t('global.save')}}</a-button>
      
       <a-button v-if="name=='communication' && !Id" class="modal-button" type="primary" html-type="submit">{{$t('global.send')}}</a-button>
    </a-form-item>
  </div>
</template>

<script>
  export default {
    props:{
      Id:String,
      name:String,
      disabled:Boolean,
      isReset:Boolean,
      isTimeLog:Boolean,
      disableButton:Boolean
    },
    setup(props, {emit}) {
      const handleClear = () => {
        emit("is_click")
      }
      const cancel = () =>{
        emit("is_cancel",true)
      }
      return {
        handleClear,
        cancel
      }
    }
  }
</script>

<style scoped>
  .modal-button {
    margin: 5px;
    padding: 7px 15px 5px 15px;
    height: auto;
    width: 80px;
  }
  .steps-action {
    text-align: right;
  }
  .steps-action .ant-row {
    margin: 0;
  }
</style>