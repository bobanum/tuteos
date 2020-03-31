<template>
  <li :id="id" :data-video="video">
    <div v-html="title"></div>
    <ol>
      <li v-for="(instruction,i) in instructions" :key="i">
        <div v-html="instruction"></div>
      </li>
    </ol>
    <slot></slot>
  </li>
</template>

<style lang="scss">
ol.sections {
  margin: 0;
  padding: 0;
  padding-left: 1.5em;
  ol {
    list-style-type: lower-alpha;
    padding-left: 1.25em;
  }
}
</style>

<script>
// @ is an alias to /src

export default {
  name: 'Laravel',
  data() {
    return {
    }
  },
  props: {
    section: {}
  },
  created() {
    for (let prop in this.section) {
      this[prop] = this.section[prop];
    }
  },
  computed: {
    
  }
}
</script>
