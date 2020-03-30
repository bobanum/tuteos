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


:root {
  --hue: 200;
  font-size: 12pt;
  font-family: 'Josefin Sans', sans-serif;
}
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0;
  background-color: hsl(var(--hue), 100%, 35%);
  color:white;
}
h1,h2,h3,h4,h5,h6 {
  margin: 0;
  line-height: .9em;
}
#app {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  & > header, & > footer {
    background-color: hsl(var(--hue), 100%, 0%);
    color: white;
    padding: .5em;
  }
  & > header {
    order: -100;
    h1 {
      font-size: 1.5em;
    }
    h2 {
      font-size: 1.3em;
    }
    img {
      width: 2in;
      display: block;
      margin: 0 auto;
    }
  }
  &>footer {
    order: 100;
  }
  &>nav {
    order: -10;
  }
  & > .body {
    padding: 1em;
  }
}


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