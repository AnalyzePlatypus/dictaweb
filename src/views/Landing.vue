<template>
  <div class='flex-vert align-center'>
    <h1>Select your platform</h1>
    <router-link :to="{name: 'desktop'}" class="button card-link">
      <img src="icons/desktop-solid.svg" alt="Desktop icon">
      Desktop 
    </router-link>

    <router-link :to="{name: 'mobile'}" class="button card-link">
      <img src="icons/mobile-alt-solid.svg" alt="Mobile icon">
      Phone </router-link>
  </div>
</template>

<script>

import AppleDetectBrowser from "@/utils/AppleDetectBrowser.js";

export default {
  name: 'Landing',
  data() {
    return {
      deviceDetails: ""
    };
  },
  mounted() {
    this.deviceDetails = AppleDetectBrowser();
    if(this.deviceDetails.isMac || this.deviceDetails.isWindows) this.$router.push({name: "desktop"});
    if(this.deviceDetails.isiOS || this.deviceDetails.isAndroid) this.$router.push({name: "mobile"});
  },
  methods: {
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>

</style>