<template>
    <a-layout-content>
      <Profile />
    </a-layout-content>
</template>
  <script>
  import Profile from "@/components/coordinator-summary/Profile";
  export default {
    name: "Profile",
    components: {
      Profile,
    },
    setup() {
      return {
      }
    }
  }
  </script>