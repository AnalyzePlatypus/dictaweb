<template>
  <div>
     <h1>Mobile Mode</h1>

    <section v-if="connectionState == 'not_initialized'">
      <h2>Enter Connection Code</h2>
      <input type="text" v-model="channel_id">
      <button @click="connect">Connect</button>
      <p>Open <code>dictaweb.io</code> on your desktop</p>
    </section>

    <section v-if="connectionState == 'connecting'">
      <h2>Connecting...</h2>
    </section>

    <section  v-else-if="connectionState == 'connected'">
      <h2>Connected</h2>
      <p>Let's get started</p>

      <section> 
        <input type="text" v-model="message">
        <button @click="send">Send</button>
      </section>
    </section>

    {{ scratchMessages }}
    {{ deviceDetails.report }}


    <div v-if="!channel_id">
      Ready to connect
    </div>

    <div v-else>
      {{connectionState}} to {{channel_id}}
    </div>
  </div>
</template>

<script>

const STATUS = {
  WAITING_FOR_CODE: "WAITING_FOR_CODE",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
}

import AppleDetectBrowser from "@/utils/AppleDetectBrowser.js";


export default {
  name: 'MobileMode',
  data() {
    return {
      STATUS,
      channel_id: undefined,
      scratchMessages: {},
      message: "",
      deviceDetails: ""
    };
  },
  mounted() {
    this.deviceDetails = AppleDetectBrowser();
  },
  methods: {
    async connect() {
      await this.$store.dispatch("pusher/init", 'mic');
      this.$store.dispatch("pusher/subscribe", {
        channel_id: this.fullChannelId, 
        onSuccess() {
          console.log(`Connected to ${this.fullChannelId}`);
          this.scratchMessages.push(`Connected to ${this.fullChannelId}`);
        }, 
        onFailure(e) {
          console.error(e);
        }
      });
      this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "message",
        callback: this.handleMessage
      });
    },
    send() {
       this.$store.dispatch("pusher/trigger", {
          channel_id: this.fullChannelId,
          eventName: "client-message",
          data: this.message
       });
    }
  },
  computed: {
    fullChannelId() {
      return `presence-${this.channel_id}`;
    },
    connectionState() {
      return this.$store.getters['pusher/connectionState'];
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
</style>