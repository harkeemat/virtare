<template >
  <a-layout-content>
    <div class="common-bg">
      <a-row :gutter="20">
        <a-col :span="24">
          <h2 class="pageTittle">Mail Dashboard

            <div class="filter">
                <button class="btn active" >
                    <span class="btn-content">Last 30 min</span>
                </button>
                <button class="btn">
                    <span class="btn-content">Last 1 hour</span>
                </button>
                <button class="btn">
                    <span class="btn-content">Last 12 hour</span>
                </button>
                <button class="btn">
                    <span class="btn-content">Last 1 Week</span>
                </button>
            </div>
          </h2>
        </a-col>

        <a-col :span="3">
          <div class="topBox" style="background-color: rgb(119, 119, 119)">
            <h5 style="color: #fff">273</h5>
            <p style="color: #fff">Emails this period</p>
          </div>
        </a-col>
        <a-col :span="3">
          <div class="topBox" style="background-color: rgb(247, 112, 41)">
            <h5 style="color: #fff">373</h5>
            <p style="color: #fff">Contacts</p>
          </div>
        </a-col>
        <a-col :span="3">
          <div class="topBox" style="background-color: rgb(38, 125, 255)">
            <h5 style="color: #fff; font-size: 15px">No campaign sent yet</h5>
            <p style="color: #fff">Create a campaign</p>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="20" style="margin: 10px 0">
        <a-col :span="24">
          <a-space style="justify-content: flex-end; width: 100%">
            <a-select
              ref="select"
              v-model:value="value1"
              style="width: 300px"
              @focus="focus"
              @change="handleChange"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              mode="tags"
              placeholder="Any Status"
            >
              <a-select-option value="Any">Any Status</a-select-option>
              <a-select-option value="Delivered"> Delivered</a-select-option>
              <a-select-option value="Blocked"> Blocked</a-select-option>
              <a-select-option value="Hard-bounce">
                Hard-bounce</a-select-option
              >
              <a-select-option value="Soft-bounce">
                Soft-bounce</a-select-option
              >
              <a-select-option value="Retrying"> Retrying</a-select-option>
            </a-select>
          </a-space>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12">
          <h3 style="margin: 0 0 10px">
            Last messages sent
            <sub style="font-family: OpenSans-Regular"
              >updated on November 8th 2022 at 10:03 AM</sub
            >
          </h3>
          <a-table
            :pagination="false"
            :dataSource="dataSource"
            :columns="columns"
          />
        </a-col>
        <a-col :span="12">
          <h3 style="margin: 0 0 10px">Real time message events</h3>
          <img src="@/assets/images/dashboard-graph.png" style="width: 100%" />
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const focus = () => {
      console.log("focus");
    };
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
  
    return {
      focus,
      handleChange,
      value1: ref(),
      dataSource: [
        {
          key: "1",
          status: "Delivered",
          contact: "mick@yopmail.com",
          subject: "Create New Account",
          date: "11/08/2022 06:23 AM",
        },
        {
          key: "2",
          status: "Opened",
          contact: "sunilkwins@gmail.com",
          subject: "Create New Account",
          date: "11/07/2022 11:25 AM",
        },
      ],
      columns: [
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "Contact",
          dataIndex: "contact",
          key: "contact",
        },
        {
          title: "Subject",
          dataIndex: "subject",
          key: "subject",
        },
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
      ],
    };
  },
});
</script>