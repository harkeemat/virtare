<template>
  <a-tree
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    
    
    :tree-data="treeData"
  >
    <template #title="{ title, key }">
      <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
      <template v-else>{{ title }}</template>
    </template>
  </a-tree>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
const treeData = [{
  title: 'parent 1',
  key: '0-0',
  children: [{
    title: 'parent 1-0',
    key: '0-075676-0',
    disabled: true,
    children: [{
      title: 'leaf',
      key: '0676-0-0',
      disableCheckbox: true,
    }, {
      title: 'leaf',
      key: '0-0-0-1',
    }],
  }, {
    title: 'No',
    key: '0-0-1',
    children: [{
      key: 'No',
      title: 'sss',
      children: [{
      key: 'Yes',
      title: 'es',
    }],
    }],
  }],
}];
export default defineComponent({
  setup() {
    const expandedKeys = ref(['0-0-0', '0-0-1']);
    const selectedKeys = ref(['0-0-0', '0-0-1']);
    const checkedKeys = ref(['0-0-0', '0-0-1']);
    watch(expandedKeys, () => {
      console.log('expandedKeys', expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys);
    });
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys);
    });
    return {
      treeData,
      expandedKeys,
      selectedKeys,
      checkedKeys,
    };
  },

});
</script>