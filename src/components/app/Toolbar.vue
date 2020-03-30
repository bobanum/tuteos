<template>
    <ul class="toolbar">
        <li v-for="(tool,i) in tools" :key="i">
            <tool :tool="tool"></tool>
        </li>
    </ul>
</template>

<style lang="scss">
.toolbar {
    --bgcolor: hsl(0,0%,0%);
    font-size: 5mm;
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: grid;
    gap: .25em;
    grid-template-columns: repeat(auto-fill, minmax(1.5em,2em));
    & > li {
        background-color: var(--bgcolor);
        display: grid;
        border-radius: .25em;
    }
    img {
        max-height: 1em;
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
        "tools": {}
    },
    components: {
        "tool": require("./Tool").default,
    },
}
</script>