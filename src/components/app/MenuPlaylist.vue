<template>
	<div class="menu-item">
        <a :href="playlist.href">{{playlist.title}}</a>
        <a v-if="playlist.yt" class="playlist" :href="'https://www.youtube.com/watch?v='+playlist.yt+'&amp;list='+playlist.list+''" title="Playlist Youtube" target="_blank">
            <img alt="Playlist Youtube" title="Playlist Youtube" src="https://bobanum.github.io/tuteos/src/images/logoplaylist.svg">
        </a>
	</div>
</template>

<style lang="scss">
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