<template>
    <a class="tool" :href="tool.href" target="_blank" :title="tool.title">
        <span>{{tool.title}}</span>
        <img :alt="tool.title" :src="tool.icon"/>
    </a>
</template>

<style lang="scss">
a.tool {
    display: grid;
    align-items: center;
    justify-items: center;
    padding: .25em;
    &:not(.show-title) {
        span {
            display: none;
        }
    }
    a {
        color: inherit;
        text-decoration: inherit;
    }
    img {
        height: 1em;
        max-width: 1em;
    }
}
</style>

<script>
export default {
    data() {
        return {
            data: 0,
        }
    },
    props: {
        "tool": {},
    },
    components: {
    },
}
</script>