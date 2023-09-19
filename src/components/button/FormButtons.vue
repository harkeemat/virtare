<template>
  <div class="steps-action">
    <a-form-item >
      <a-button class="modal-button" @click="onCancel" >{{ $t('global.cancel') }}</a-button>
      <a-button class="modal-button" :disabled="disabled" type="primary" html-type="submit">{{ submitButton }}</a-button>
    </a-form-item>
  </div>
</template>

<script>
  export default {
    props:{
        submitButton:String,
        disabled:Boolean
    },
    setup(props, {emit}) {

      const onCancel = () => {
        emit("onCancel")
      }

      return {
        onCancel
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