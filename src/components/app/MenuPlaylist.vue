<template>
	<div class="menu-item">
        <router-link :to="{name:'LaravelFromTo', params:playlist.params}">{{playlist.title}}</router-link>
        <a v-if="playlist.yt" class="playlist" :href="'https://www.youtube.com/watch?v='+playlist.yt+'&amp;list='+playlist.list+''" title="Playlist Youtube" target="_blank">
            <svg><use :href="'/images/icons.svg#playlist'" /></svg>
        </a>
	</div>
</template>

<style lang="scss">
    div.menu-item {
        svg {
            fill: hsl(var(--hue), var(--sat), 20%);
            width: 1.5em;
            height: 1.5em;
            &>:hover {
                fill: red;
            }
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