<template>
  <div class="home">
    <h1>Login</h1>
    <div @click="connecter"><a href="https://github.com/login/oauth/authorize?client_id=a49b4169cd6217289afb">Se connecter avec Github</a></div>
    <slot></slot>
  </div>
</template>

<script>
// @ is an alias to /src
// import Tuteos from "@/tuteos.js"
export default {
  name: 'Login',
  data() {
    return {
      sections: [],
    }
  },
  components: {
  },
  props: {
  },
  created() {
    
  },
  mounted() {
  },
}
</script>
