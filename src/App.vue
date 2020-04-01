<template>
  <div id="app">
    <header>
      <toolbar style="float:right" :tools="tools"/>
      <img src="/images/logo_tuteos.svg" alt="">
      <h1>Un site Web avec Laravel</h1>
      <h2>Les étapes</h2>
    </header>
    <main-menu/>
    <footer><span>&copy; 2020 Cégep de Saint-Jérôme</span></footer>
    <div class="body">
      <router-view/>
    </div>
      
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap');
  @import "assets/tuteos.scss";


</style>


<script>
import MainMenu from '@/components/app/Menu';
export default {
    data() {
        return {
            tools: [
                {
                    href: "https://www.youtube.com/channel/UCFWzWuHnqYOlBN2lJhBIGNg", 
                    title: "Chaîne Youtube", 
                    icon: "youtube"
                }, {
                    href: "http://prof-tim.cstj.qc.ca/cours/web3", 
                    title: "Web3", 
                    icon: "web3"
                }, {
                    href: "https://github.com/web3cstj", 
                    title: "Github", 
                    icon: "github"
                },  
            ]
        }
    },
    props: {

    },
    components: {
        MainMenu,
        Toolbar: require("@/components/app/Toolbar").default,
    },
}
</script>