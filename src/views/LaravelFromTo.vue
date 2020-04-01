<template>
  <laravel class="home" @load="load">
    <ol class="sections" :start="from">
      <sec v-for="section in sections.slice(from, to+1)" :key="section.id" :section="section"></sec>
    </ol>
  </laravel>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Laravel',
  data() {
    return {
      from: 1,
      to: 1,
      sections: [],
    }
  },
  components: {
    "sec": require('@/components/app/Section').default,
    "laravel": require('@/views/Laravel').default,
  },
  props: {
  },
  created() {
  },
  mounted() {
    // sections are 1 indexed
    this.from = parseInt(this.$route.params.from);
    this.to = parseInt(this.$route.params.to);
    
  },
  methods: {
    load(sections) {
      this.sections = sections;
    }
  }
}
</script>
