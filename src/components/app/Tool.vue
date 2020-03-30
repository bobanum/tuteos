<template>
    <a class="tool" :href="tool.href" target="_blank" :title="tool.title">
        <span>{{tool.title}}</span>
        <svg><use :href="'/images/icons.svg#'+tool.icon" /></svg>
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
    svg {
        height: 1em;
        width: 1em;
        &:hover, &:active {
            fill: hsl(300, 50%, 65%);
        }
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