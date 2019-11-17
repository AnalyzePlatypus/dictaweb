<template>
  <div class='container'>
    <router-link :to="{name: 'desktop'}">Desktop</router-link>
    <router-link :to="{name: 'mobile'}">Mobile</router-link>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  data() {
    return {};
  },
  methods: {
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
</style>