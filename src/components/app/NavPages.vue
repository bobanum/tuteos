<template>
    <div class="navpages">
        <a class="first" :href="1"><svg><use href="/images/icons.svg#first" /></svg> Premier</a>
        <a class="previous" :href="Math.max(1, current-1)"><svg><use href="/images/icons.svg#previous" /></svg>Précédent</a>
        <a class="next" :href="Math.min(max, current+1)">Suivant<svg><use href="/images/icons.svg#next" /></svg></a>
        <a class="last" :href="max">Dernier<svg><use href="/images/icons.svg#last" /></svg></a>
    </div>
</template>

<style lang="scss">
.navpages {
    display: grid;
    gap: .25em;
    border: 1px solid rgba(255,255,255,.3);
    padding: 0.25em;
    grid-template-columns: auto auto 1fr auto auto;
    font-size: smaller;
    fill: white;
    svg {
        width: 1em;
        height: 1em;
    }
    a {
        color: inherit;
        text-decoration: inherit;
        padding: 0.25em;
        display: flex;
        align-items: center;
        &.first {
            grid-column: 1;
        }
        &.previous {
            grid-column: 2;
        }
        &.next {
            grid-column: -2;
        }
        &.last {
            grid-column: -1;
        }
        &:hover {
            background-color: rgba(255,255,255,.2);
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
        max: {},
        current: {},
        display: {default:2},
    },
    components: {
    },
}
</script>