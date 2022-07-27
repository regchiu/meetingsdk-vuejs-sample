<template>
  <div id="app">
    <HelloWorld />
    <!-- <HelloWorldNew /> -->
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
// import HelloWorldNew from './components/HelloWorldNew.vue'

export default {
  name: "App",
  components: {
    HelloWorld,
    // HelloWorldNew
  },
};
</script>

<style>
#app {
  width: 70%;
  margin: auto;
}
#zmmtg-root {
  display: none;
}
</style>
