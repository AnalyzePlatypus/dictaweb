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

$color-primary: #3f3ffd;
$color-primary__hover: #3e3eff;

$color-success: rgb(88, 199, 93);
$color-success__hover: rgb(75, 172, 80);


.button {
  font-size: 1.2rem;
  color: darken($color-primary, 50%);
  background: lighten($color-primary, 50%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.315);
  border: 1px solid lightgray;
  text-decoration: none;
  color: $color-primary;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  
  padding: 12px 16px  10px 16px;
  border-radius: 4px;
  
  &:not([disabled='disabled']):hover {
    color: darken($color-primary, 20%);
    background: lighten($color-primary, 36%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.315);
  }

  &[disabled='disabled'] {
    color: lightgray;
  }

  &.primary {
    background: $color-primary;
    color: white;

    &:hover {
      background: $color-primary__hover;
      color: white;
    }

    &[disabled='disabled'] {
      background: lightgray;
      color: white;
    }
  }

   &.success {
    background: $color-success;
    color: white;

    &:hover {
      background: $color-success__hover;
      color: white;
    }

    &[disabled='disabled'] {
      background: lightgray;
      color: white;
    }
  }
}

.card-link {
  margin: 8px 4px;
  min-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }
}

</style>