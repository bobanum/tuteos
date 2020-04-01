<template>
  <li :id="section.id" :data-video="section.video">
    <div v-html="section.title"></div>
    <ol>
      <li v-for="(instruction,i) in section.instructions" :key="i">
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
  & > li {
    margin-top: 1em;
  }
  ol {
    list-style-type: lower-alpha;
    padding-left: 1.25em;
    li {
      padding-bottom: .25em;
      border-bottom: 1px solid #ccc;
      margin-bottom: .25em;
    }
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
  },
  computed: {
    
  }
}
</script>
