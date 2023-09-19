<template>
  <a-modal width="800px" title="Send Message" centered :footer="false">
    <a-row :gutter="24">
      <a-col :sm="24" :xs="24">
        <div class="form-group">
          <label>Patient</label>

          <a-select
            v-model:value="value"
            :getPopupContainer="triggerNode => triggerNode.parentNode"
            show-search
            placeholder="Select Patient"
            style="width: 100%"
            :options="options"
            size="large"
          >
          </a-select>
        </div>
      </a-col>
      <a-col :sm="24" :xs="24">
        <div class="form-group">
          <label>Message</label>
          <a-textarea
            v-model:value="value2"
            placeholder="Message"
            :auto-size="{ minRows: 2 }"
          />
        </div>
      </a-col>
      <a-col :sm="24" :xs="24">
        <div class="text-right">
            <a-button class="blueBtn">Send Message</a-button>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const options = ref([
      {
        value: "Steve Smith",
        label: "Steve Smith",
      },
      {
        value: "Jane Doe",
        label: "Jane Doe",
      },
      {
        value: "Henry Joseph",
        label: "Henry Joseph",
      },
      {
        value: "Carol Liam",
        label: "Carol Liam",
      },
      {
        value: "Brett William",
        label: "Brett William",
      },
    ]);

    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    return {
      size: ref("large"),
      value: ref(undefined),
      filterOption,
      options,
    };
  },
};
</script>
