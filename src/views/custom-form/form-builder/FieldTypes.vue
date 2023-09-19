<template>
        <div :class="className" v-if="fieldTypes=='text'">
            <FontColorsOutlined />
            <span> {{fieldName}} Input</span>
        </div>
        <div :class="className" v-if="fieldTypes=='number'">
            <FieldBinaryOutlined />
            <span> {{fieldName}} Input</span>
        </div>
        <div :class="className" v-if="fieldTypes=='email'">
            <MailOutlined />
            <span> Email Address</span>
        </div>
        <div :class="className" v-if="fieldTypes=='phone'">
            <PhoneOutlined />
            <span> Phone Number</span>
        </div>
        <div :class="className" v-if="fieldTypes=='textarea'">
            <AlignLeftOutlined />
            <span> Textarea</span>
        </div>
        <div :class="className" v-if="fieldTypes=='checkbox'">
            <CheckSquareOutlined />
            <span> Checkbox</span>
        </div>
        <div :class="className" v-if="fieldTypes=='radio'">
            <CheckCircleOutlined />
            <span> Radio</span>
        </div>
        <div :class="className" v-if="fieldTypes=='date'">
            <FieldTimeOutlined />
            <span> Date/Time</span>
        </div>
        <div :class="className" v-if="fieldTypes=='file'">
            <FileOutlined />
            <span>File Input</span>
        </div>
        <div :class="className" v-if="fieldTypes=='image'">
            <CloudUploadOutlined />
            <span>Image Upload </span>
        </div>
        <div :class="className" v-if="fieldTypes=='button'">
            <GoldOutlined />
            <span> Button</span>
        </div>
</template>
<script>
import {
    FontColorsOutlined,
    FieldBinaryOutlined,
    MailOutlined,
    PhoneOutlined,
    AlignLeftOutlined,
    CheckSquareOutlined,
    CheckCircleOutlined,
    GoldOutlined,
    FileOutlined,
    FieldTimeOutlined,
    CloudUploadOutlined
} from "@ant-design/icons-vue";
export default {
    props:{
        fieldTypes:String,
        fieldName:String,
        className:String
    },
    components: {
        FontColorsOutlined,
        FieldBinaryOutlined,
        MailOutlined,
        PhoneOutlined,
        AlignLeftOutlined,
        CheckSquareOutlined,
        CheckCircleOutlined,
        GoldOutlined,
        FileOutlined,
        FieldTimeOutlined,
        CloudUploadOutlined
    },

}
</script>

<style lang="scss" scoped>
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
 
</style>
