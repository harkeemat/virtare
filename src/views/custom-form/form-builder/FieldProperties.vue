<template>
<div class="formBuilderLeft properties">
    <div class="head">Properties</div>
    <div class="body">
        <a-form-item label="Label">
            <a-input v-model:value="value1" />
        </a-form-item>
        <a-form-item label="Placeholder">
            <a-input v-model:value="value2" />
        </a-form-item>
        <a-checkbox>Required</a-checkbox>
        <a-space style="margin: 15px 0 0">
            <a-button>Cancel</a-button>
            <a-button type="primary">Update</a-button>
        </a-space>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.formName {
  border: 0.5px solid transparent;
  &:hover {
    border: 0.5px solid #e3e3e3;
  }
  &:focus {
    border: 1px solid #40a9ff;
  }
}
.formBuilderLeft {
  background-color: #f9f9f9;
  height: 100%;
  .head {
    padding: 10px 15px;
    font-size: 18px;
    border-bottom: 1px solid #000;
  }
  .body {
    height: calc(100vh - 215px);
    overflow: auto;
    .item {
      padding: 10px 12px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      cursor: pointer;
      span {
        margin-left: 10px;
      }
    }
  }
  &.properties {
    .body {
      padding: 15px;
    }
  }
}
.formBuilderCenter {
  height: calc(100vh - 165px);
  border: 1px solid #d9d9d9;
  overflow: auto;
  padding: 20px;
  .dragDrop {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 100px;
      margin: 0 0 20px;
    }
  }
  .formWrapper {
    padding: 20px;
    .formGroup {
      margin: 0 0 15px;
      position: relative;
      &:hover {
        .actions {
          visibility: visible;
        }
      }
      label.formLabel {
        font-size: 16px;
        line-height: 35px;
        display: block;
      }
      .actions {
        position: absolute;
        right: 0;
        top: 10px;
        gap: 10px;
        align-items: center;
        display: flex;
        visibility: hidden;
        .anticon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }
  .sectionGroup {
    margin: 0 0 10px;
    &:hover {
      .head {
        .actions {
          visibility: visible;
        }
      }
    }
    .head {
      position: relative;
      span.title {
        background-color: #1890ff;
        border-radius: 5px 5px 0 0;
        padding: 5px 10px;
        color: #fff;
        display: inline-block;
      }
      .actions {
        position: absolute;
        right: 0;
        top: 5px;
        gap: 10px;
        align-items: center;
        display: flex;
        visibility: hidden;
        .anticon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
    .body {
      padding: 10px;
      border: 1px solid #e3e3e3;
      background-color: #f9f9f9;
    }
  }
}
</style>
