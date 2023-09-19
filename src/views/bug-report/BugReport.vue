<template>
  <BugReport />
</template>
<script>
import BugReport from "@/components/bug-report/BugReport";
export default {
  components: {
    BugReport
  },
  setup() {
  },
};
</script>
<style lang="scss" scoped>
.form-group {
  &.bugCategory {
    .ant-radio-wrapper {
      display: inline-block;
      margin: 0;
      font-family: "poppins";
    }
  }
}
.uploadDocument {
  margin: 15px 0 0;
  .item {
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 50px 10px 10px;
    position: relative;
    color: #1890ff;
    margin: 0 0 10px;
    &:last-child {
      margin: 0;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .close {
      position: absolute;
      right: 15px;
      cursor: pointer;
      color: #000;
      font-size: 16px;
    }
  }
}
</style>