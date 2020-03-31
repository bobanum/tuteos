<template>
  <div class="home">
    <h1>Laraveldsdsdsdss</h1>
    <div><button>Précédent</button><button>Suivant</button></div>
    <ol>
      <section :section="section"/>
    </ol>
    <div v-if="n"><router-link :to="n-1">sections[]</router-link></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Laravel',
  data() {
    return {
      sections: [],
    }
  },
  components: {
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
      if (this.$route.params.n) {
        this.n = this.$route.params.n;
        sections = sections.slice(this.n - 1, this.n);
      } else if (this.$route.params.from) {
        this.from = this.$route.params.from;
        this.to = this.$route.params.to;
        sections = sections.slice(this.from - 1, this.to);
      } else {
        this.n = 1;
        sections = sections.slice(this.n - 1, this.n);
      }
      this.sections = {}
      sections.forEach(section => {
        var obj = {};
        obj.id = section.getAttribute("id");
        obj.video = section.getAttribute("data-video");
        obj.title = section.removeChild(section.firstElementChild).innerHTML;
        var instructions = Array.from(section.firstElementChild.children);
        obj.instructions = instructions.map(instruction => instruction.innerHTML);
        this.sections[obj.id] = obj
      })
    }
    );
  }
}
</script>
