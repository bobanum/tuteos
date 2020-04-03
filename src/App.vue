<template>
  <div id="app">
    <header>
      <toolbar style="float:right" :tools="tools"/>
      <div class="user" v-if="login">
        <div class="avatar"><a href="/login"><img :src="avatar_url" :alt="name"/><svg><use href="/images/icons.svg#exit"/></svg></a></div>
        <div class="login"><a :href="html_url" target="_blank">{{name}}</a></div>
      </div>
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
  #app > header {
    display: grid;
    grid-template-columns: min-content 1fr auto;
    grid-template-rows: auto auto auto;
    justify-items: center;
    align-items: center;
    text-align: center;
    .toolbar {
      grid-column: 3;
      grid-row: 1 / -1;
    }
    .user {
      grid-column: 1;
      grid-row: 1 / -1;
      // align-self: center;
      // justify-self: center;
      // text-align: center;
      .avatar {
        position: relative;
        svg {
          width: 50%;
          height: 70%;
          left: 25%;
          top: 15%;
          background-color: hsla(0, 0%, 100%, .7);
          fill: black;
          position: absolute;
        }
        &:not(:hover) svg {
          display:none;
        }
      }
      img {
        width: 3em;
        height: 3em;

      }
    }
    & > img {
      grid-row: 1;
    }
    & > h1 {
      grid-row: 2;
    }
    & > h2 {
      grid-row: 3;
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
    
    computed: {
      avatar_url() {
        return localStorage.avatar_url || "";
      },
      login() {
        return localStorage.login || "";
      },
      name() {
        return localStorage.name || "";
      },
      html_url() {
        return localStorage.html_url || "";
      },
    },

    components: {
        MainMenu,
        Toolbar: require("@/components/app/Toolbar").default,
    },
}
</script>