<template>
    <a class="menu-item with-icon" :href="item.href" target="_blank">
        <span>{{item.title}}</span>
        <img v-if="item.icon" :alt="item.title" :src="item.icon"/>
    </a>
</template>

<style lang="scss">
</style>

<script>
export default {
    data() {
        return {
            data: 0,
        }
    },
    props: {
        "item": {},
    },
    components: {
    },
}
</script>