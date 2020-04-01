<template>
  <div class="instruction-menu" tabindex="0" @blur="$emit('blur', result)">
    <span class="trigger"><svg><use :href="'/images/icons.svg#'+((difficultecourante === 0) ? '' : difficultes[difficultecourante])" title="" /></svg></span>
    <div>
      <ul>
        <li 
          v-for="(difficulte, j) in difficultes" 
          :key="j"
        >
          <label>
            <input type="radio" :name="'difficulte['+section.id+']['+i+']'" :id="'difficulte_'+section.id+'_'+section.i+'_'+j" :value="j" v-model="difficultecourante"/>
            <svg :title="labels[j]"><use :href="'/images/icons.svg#'+difficulte+''" /></svg>
            <span>Aucun</span>
          </label>
        </li>
      </ul>
      <div class="question">
        <input type="text" :name="'question['+section.id+']'" id="'question['+section.id+']'" v-model="remarques" placeholder="Remarques">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .instruction-menu {
    position: absolute;
    margin-left: -2.5em;
    // margin-top: 1.5em;
    & > div {
      background-color: white;
      box-shadow: .1em .1em .2em #0008;
      padding: 0.25em;
      margin-top: 1.25em;
    }
    //z-index: 100;
    svg {
      width: 1em;
      height: 1em;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      position: relative;
      display: flex;
      span {
        display: none;
      }
    }
    &>.trigger {
      background-color: hsla(var(--hue), var(--sat), 50%, .1);
      border-radius: 50%;
      position: absolute;
      // margin-top: -1.5em;
      width: 1em;
      height: 1em;
      &:hover {
        background-color: hsla(var(--hue), var(--sat), 50%, 1)      
      }
    }
    &:focus-within {
      z-index: 100;
    }
    &:focus-within > .trigger {
        background-color: hsla(var(--hue), var(--sat), 50%, 1)      
    }
    &:not(:focus-within) > .trigger ~ * {
      display: none;
    }
    input[type=radio] {
      display:none;
    }
    :checked ~ * {
      fill: red;
    }
}
</style>

<script>
// @ is an alias to /src

export default {
  name: 'Laravel',
  data() {
    return {
      labels: ["Aucun...", "Facile", "Moyen", "Difficile", ],
      difficultes: ["nothing", "beginner", "intermediate", "expert", ],
      difficultecourante: 0,
      remarques: "",
    }
  },
  props: {
    instruction: {},
    i: {},
  },
  created() {
  },
  computed: {
    section() {
      return this.$parent.section;
    },
    result() {
      return {
        difficulte: this.difficultecourante,
        remarques: this.remarques,
      }
    }
  },
  methods: {
  },
}
</script>
