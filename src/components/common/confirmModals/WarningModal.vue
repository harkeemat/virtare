<template>
  <a-modal wrapClassName="wrapClassName" :footer="null" :bodyStyle="{ height: '250px' }" :maskClosable="false" :title="props.title">
    <p><a-typography-text :level="4">{{ props.bodyText }}</a-typography-text></p>
    <div class="customFooter" >
      <a-button class="leaveBtn" type="danger" @click="leave">{{ props.cancelBtnText }}</a-button>
      <a-button class="saveBtn" type="primary" @click="save">{{ props.okBtnText }}</a-button>
    </div>
  </a-modal>
</template>

<script setup>

const props = defineProps(["title", "bodyText", "cancelBtnText", "okBtnText"])
const emit = defineEmits(["leavePage", "saveSession"])

const leave = () => {
  emit('leavePage')
}
const save = () => {
  emit('saveSession')
}
</script>

<style>
.wrapClassName {
  position: absolute;
  top: 25%;
}
.wrapClassName .customFooter {
  position: relative;
  bottom: -50px;
  text-align: center;
}
.wrapClassName .customFooter button.leaveBtn {
  position: relative;
  right: 5px;
}
.wrapClassName .customFooter button.saveBtn {
  position: relative;
  left: 5px;
}
.wrapClassName button.ant-btn {
  font-size: 15px;
}
.wrapClassName button.ant-btn.ant-btn-dangerous {
  right: 12px;
}
.wrapClassName .ant-modal-header {
  position: relative;
  top: 5px;
  padding: 10px 25px 12px 25px;
}
.wrapClassName .ant-modal-close {
  position: absolute;
  top: -5px;
  font-weight: bolder;
  color: #333333;
}
.wrapClassName .ant-modal-content {
  border-radius: 7px;
}
.wrapClassName .ant-modal-header .ant-modal-title {
  font-size: 22px !important;
  color: #F95932;
}
.wrapClassName .ant-modal-body {
  min-height: 180px !important;
  height: 180px !important;
}
.wrapClassName .ant-modal-body p {
  font-size: 20px !important;
  color: #000000;
  position: relative;
  top: 7px;
  text-align: center;
}
</style>