<template>
  <div class="home">
    <h1>Laravel</h1>
    <ol class="sections" :start="from">
      <sec v-for="section in sections.slice(from, to+1)" :key="section.id" :section="section"></sec>
    </ol>
  </div>
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
  },
  props: {
  },
  created() {
  },
  mounted() {
    console.log(this.debut, this.fin)
    Promise.all([
      this.$axios.get("/example/cours1.html"),
      this.$axios.get("/example/cours2.html"),
      this.$axios.get("/example/cours2.5.html"),
      this.$axios.get("/example/cours3.html"),
    ]).then( responses => {
      var sections = [];
      var parser = new DOMParser();
      responses.forEach(response => {
        var doc = parser.parseFromString(response.data, "text/html");
        sections.push(...Array.from(doc.querySelector("#app .body > ol").children))
      });
      // sections are 1 indexed
      this.from = parseInt(this.$route.params.from);
      this.to = parseInt(this.$route.params.to);
      
      this.sections = []
      sections.forEach((section, i) => {
        var obj = {};
        obj.id = section.getAttribute("id");
        obj.video = section.getAttribute("data-video");
        obj.title = section.removeChild(section.firstElementChild).innerHTML;
        var instructions = Array.from(section.firstElementChild.children);
        obj.instructions = instructions.map(instruction => instruction.innerHTML);
        this.sections[i] = obj
      })
    }
    );
  }
}
</script>
