<template>
  <div class="filter">
    <a-dropdown :trigger="['click']">
      <a class="ant-dropdown-link" @click.prevent>
         {{$t('global.filter')}}
      </a>
      <!-- <FilterOutlined /> -->
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <div class="checkbox">
              <a-checkbox v-model:checked="checked10">Clinical</a-checkbox>
            </div>
          </a-menu-item>
          <a-menu-item>
            <div class="checkbox">
              <a-checkbox v-model:checked="checked11">Comm</a-checkbox>
            </div>
          </a-menu-item>
          <a-menu-item>
            <div class="checkbox">
              <a-checkbox v-model:checked="checked12">Admin</a-checkbox>
            </div>
          </a-menu-item>
          <a-menu-item>
            <div class="checkbox">
              <a-checkbox v-model:checked="checked13">Internal</a-checkbox>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script>
export default {
  setup() {
    
  },
}
</script>
