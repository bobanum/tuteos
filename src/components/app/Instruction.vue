<template>
  <li :class="'instruction instruction_'+i">
    <instruction-menu class="menu" tabindex="0" @blur="blur"></instruction-menu>
    <div v-html="instruction"></div>
    <slot></slot>
  </li>
</template>

<style lang="scss">
li.instruction {
  padding-bottom: .25em;
  border-bottom: 1px solid #ccc;
  margin-bottom: .25em;
  
  & > .menu {
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
  components: {
    "instruction-menu": require("@/components/app/InstructionMenu").default,
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
    }
  },
  methods: {
    blur(result) {
      console.log(result);
      return result;
    }
  },
}
</script>
