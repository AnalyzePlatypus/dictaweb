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

$color-success: hsl(123, 49, 56);
$color-success__hover: rgb(75, 172, 80);

h1,h2,h3,h4,h5,h6,p {
  margin: 0px 0px 4px 0px;
}

.button {
  font-size: 1rem;
  background: lighten($color-primary, 50%);

  color: hsl(240, 94, 23);
  border: 1px solid hsl(240, 24, 83);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.315);
  text-decoration: none;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  
  padding: 12px 16px  11px 16px;
  border-radius: 4px;
  
  &:not([disabled='disabled']):hover {
    background: lighten($color-primary, 36%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.315);
  }

  &[disabled='disabled'] {
    color: lightgray;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.115);
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
    border-color: hsl(123, 49, 46);
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

  &.danger {
    background: hsl(10, 70, 56);
    border-color:  hsl(10, 70, 36);
    color: white;

    &:hover {
      background: hsl(10, 70, 46);
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