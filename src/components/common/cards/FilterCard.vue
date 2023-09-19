<template>
  <div :class="className" v-bind:style="{ backgroundColor:color }">
    <h4>{{ heading }}</h4>
    <div class="filter">
      <a-dropdown :trigger="['click']">
        <!-- <a class="ant-dropdown-link" @click.prevent>
          <FilterOutlined /> {{$t('global.filter')}}
        </a> -->
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="data in filterCount" :key="data.key">
              <a :href="data.link">{{ data.text }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <h5>{{ count }}</h5>
    <p>{{$t('global.taskCount')}}</p>
  </div>
</template>

<script>
// import {
//   FilterOutlined,
// } from "@ant-design/icons-vue";
export default {
  components: {
    // FilterOutlined,
  },
  props: {
    filterCount: {
      type: Array
    },
    count: {
      type: String
    },
    className: {
      type: String
    },
    heading: {
      type: String
    },
    color:{
      type:String
    }
  },
  setup() {
    return {

    }
  }
}
</script>