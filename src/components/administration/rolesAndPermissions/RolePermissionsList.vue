<template>
  <a-col :sm="16" :xs="24">
    <div class="description" v-for="module in  permittions.editRolesAndPermissions" :key="module.id">
      <h4>{{module.name}}</h4>
       <div v-for="screens in module.screen" :key="screens.id">
        <div v-for="screen in screens" :key="screen.id"><p>{{ screen.name }}</p>
         <div v-for="action in screen.action" :key="action.id"><div v-for="actions in action" :key="actions.id">{{actions.name}}</div></div>
        </div>
      </div> 
      <a-divider />
    </div>
  
  </a-col>
</template>

<script>
 import { useStore} from "vuex"
export default {
  setup() {
    const store = useStore()
    const permittions = store.getters.rolesAndPermissionsRecord.value
    return { 
      permittions
    }
  }
}
</script>