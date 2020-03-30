<template>
	<div class="menu-item">
        <a :href="playlist.href">{{playlist.title}}</a>
        <a v-if="playlist.yt" class="playlist" :href="'https://www.youtube.com/watch?v='+playlist.yt+'&amp;list='+playlist.list+''" title="Playlist Youtube" target="_blank">
            <svg><use :href="'/images/icons.svg#playlist'" /></svg>

            <!-- <img alt="Playlist Youtube" title="Playlist Youtube" src="https://bobanum.github.io/tuteos/src/images/logoplaylist.svg"> -->
        </a>
	</div>
</template>

<style lang="scss">
    div.menu-item {
        svg {
            fill: hsl(var(--hue), 100%, 20%);
            width: 1.5em;
            height: 1.5em;
        }
    }
</style>
<script>
export default {
    data() {
        return {
        }
    },
    props: {
        "playlist": {},
    },
    components: {
    },
}
</script>