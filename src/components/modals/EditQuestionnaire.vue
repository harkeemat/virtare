<template>
    <a-modal width="100%" title="Cardiopulmonary Resuscitation (CPR)" centered>
      <template #footer>
        <a-button key="back" class="btn secondaryBtn" 
          >Cancel</a-button
        >
        <a-button key="submit" class="btn primaryBtn" 
          >Save</a-button
        >
      </template>
      <div class="questionnaireMain">
        <a-row :gutter="24">
          <a-col :sm="12" :xs="24">
            <div class="form-group">
              <label>Question</label>
              <a-input
                defaultValue="Cardiopulmonary Resuscitation (CPR)"
                placeholder="Enter Question"
                style="width: 100%"
                size="large"
              />
            </div>
          </a-col>
          <a-col :sm="12" :xs="24">
            <div class="form-group">
              <label>Type</label>
              <a-select
                ref="select"
                v-model="value1"
                style="width: 100%"
                size="large"
                @focus="focus"
                @change="handleChange"
                placeholder="Select Type"
                value="Yiminghe"
              >
                <a-select-option value="lucy">Single Choice</a-select-option>
                <a-select-option value="Yiminghe"
                  >Multiple Choice</a-select-option
                >
                <a-select-option value="Yiminghe1">Textbox</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="form-group">
              <label> Tags</label>
              <a-select
                ref="select"
                style="width: 100%"
                @focus="focus"
                @change="handleChange"
                mode="tags"
                size="large"
                placeholder="Select Tags"
                value="Tag1"
              >
                <a-select-option value="Tag1">Tag 1</a-select-option>
                <a-select-option value="Tag2">Tag 2</a-select-option>
                <a-select-option value="Tag3">Tag 3</a-select-option>
                <a-select-option value="Tag4">Tag 4</a-select-option>
                <a-select-option value="Tag5">Tag 5</a-select-option>
                <a-select-option value="Tag6">Tag 6</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :sm="24" class="mt-25">
            <a-row :gutter="16">
              <a-col :span="1">
                <a-checkbox class="singleChoiceEdit" v-model:checked="checked21">
                </a-checkbox>
              </a-col>
              <a-col :span="7">
                <div class="form-group">
                  <label>Label</label>
                  <a-input
                    defaultValue="Attempt Resuscitation/CPR"
                    placeholder="Label"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :sm="5" :xs="24">
                <div class="form-group">
                  <label>Program</label>
                  <a-select
                    ref="select"
                    style="width: 100%"
                    size="large"
                    @focus="focus"
                    @change="handleChange"
                    placeholder="Program  Type"
                    mode="multiple"
                    v-model:value="programs"
                  >
                    <a-select-option value="RPM">RPM</a-select-option>
                    <a-select-option value="TCM">TCM</a-select-option>
                    <a-select-option value="BHI">BHI</a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="3">
                <div class="form-group">
                  <label>RPM</label>
                  <a-input
                    value="4"
                    placeholder="RPM Score"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :span="3">
                <div class="form-group">
                  <label>TCM</label>
                  <a-input
                    defaultValue="2"
                    placeholder="TCM Score"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :span="3">
                <div class="form-group">
                  <label>BHI</label>
                  <a-input
                    defaultValue="1"
                    placeholder="BHI Score"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :span="2" class="text-right mt-28">
                <a-button type="primary" size="large" danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col :sm="24" class="mt-25">
            <a-row :gutter="16">
              <a-col :span="1">
                <a-checkbox class="singleChoiceEdit" v-model:checked="checked22">
                </a-checkbox>
              </a-col>
              <a-col :span="7">
                <div class="form-group">
                  <label>Label</label>
                  <a-input
                    defaultValue="Do Not Attempt Resuscitation/DNR"
                    placeholder="Label"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :sm="5" :xs="24">
                <div class="form-group">
                  <label>Program</label>
                  <a-select
                    ref="select"
                    v-model:value="programs1"
                    style="width: 100%"
                    size="large"
                    @focus="focus"
                    @change="handleChange"
                    placeholder="Program  Type"
                    mode="multiple"
                  >
                    <a-select-option value="RPM">RPM</a-select-option>
                    <a-select-option value="TCM">TCM</a-select-option>
                    <a-select-option value="Yiminghe">BHI</a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="3">
                <div class="form-group">
                  <label>RPM</label>
                  <a-input
                    defaultValue="4"
                    placeholder="RPM Score"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :span="3">
                <div class="form-group">
                  <label>TCM</label>
                  <a-input
                    defaultValue="2"
                    placeholder="TCM Score"
                    style="width: 100%"
                    size="large"
                  />
                </div>
              </a-col>
              <a-col :span="3"></a-col>
              <a-col :span="2" class="text-right mt-28">
                <a-button type="primary" size="large">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
                <a-button type="primary" size="large" class="ml-10" danger>
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </a-col>
  
          <a-col :sm="24" :xs="24" class="text-right mt-25">
            <a-button class="btn blueBtn">Save</a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </template>
  <script>
  import {  ref } from "vue";
  import {
    DeleteOutlined,
    PlusOutlined,
  } from "@ant-design/icons-vue";
  export default {
    components: {
      PlusOutlined,
      DeleteOutlined,
    },
    setup() {
      const activeKey = ref(["1"]);
      const toggle = ref(true);
      const programs = ref(["RPM", "TCM", "BHI"]);
      const programs1 = ref(["RPM", "TCM"]);
      return {
        value2: ref(),
        size: ref("large"),
        checked1: ref(false),
        checked2: ref(false),
        checked3: ref(false),
        checked4: ref(false),
        checked5: ref(false),
        checked6: ref(false),
        checked7: ref(false),
        checked8: ref(true),
        checked9: ref(false),
        checked10: ref(false),
        checked21: ref(false),
        checked22: ref(false),
        checked23: ref(false),
        activeKey,
        toggle,
        programs,
        programs1,
      };
    },
  };
  </script>