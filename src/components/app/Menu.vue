<template>
	<nav id="main" class="menu">
        <ul>
            <li>
                <menu-item :item="{href:'index.html', title:'Complet', icon:'https://bobanum.github.io/tuteos/src/images/btn_complet.svg'}" />
            </li>
            <li v-for="(playlist, i) in playlists" :key="i">
                <menu-playlist :playlist="playlist"/>
            </li>    
        </ul>
	</nav>
</template>

<style lang="scss">
nav.menu {
    font-size: smaller;
    a {
        color: inherit;
        text-decoration: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    img {
        max-height: 1em;
    }
    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5em,1fr));
        & > li {
            padding: .25em;
            background-color: rgba(0,0,0,.1);
            display: grid;
        }
    }
}
</style>

<script>
import MenuItem from "./MenuItem";
import MenuPlaylist from "./MenuPlaylist";
export default {
    data() {
        return {
            playlists: [
                {params:{from:1, to:9}, title:"Laravel 1", yt:"sZ8crC_QQKU", list:"PLR5YZQKvy9U2-I1e6m0pNPLQS07p-X0xg"},
                {params:{from:10, to:22}, title:"Laravel 2", yt:"ZpOq9oimnpM", list:"PLR5YZQKvy9U1hb1uK_tIc_zEhV8PyEFLp"},
                {params:{from:23, to:26}, title:"Laravel 2.5", yt:"iYUwe99a8Xc", list:"PLR5YZQKvy9U2u-AjvxN4sznkBlHxRXjXE"},
                {params:{from:27, to:36}, title:"Laravel 3", yt:"7EEGVGmQlew", list:"PLR5YZQKvy9U3AHVDbsk1clZwAhMyzS090"},
            ]
        }
    },
    props: {

    },
    components: {
        MenuItem,
        MenuPlaylist,
    },
}
</script>