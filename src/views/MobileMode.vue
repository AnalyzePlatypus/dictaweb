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
      <p>Type to send text to your desktop</p>

      <section> 
        <input type="text" v-model="message">
        <button @click="send">Send</button>
      </section>

      <section>
        <button @click="previous">‹ Previous</button>
        <button @click="next">Next ›</button>
      </section>
    </section>

    
    <div v-if="!channel_id">
      Ready to connect
    </div>

    <div v-else>
      {{connectionState}} to {{channel_id}}
    </div>

    <section>
      <div v-if="connectionState === 'connected'">✅ Server Connected</div>
      <div v-else>❌ Server Disconnected</div>
    </section>

    <!-- <section>
      <div v-if="desktopConnected">✅ Desktop Connected</div>
      <div v-else>❌ Desktop Disconnected</div>
    </section> -->
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
      deviceDetails: "",
      desktopConnected: false
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
        eventName: "pusher:member_added",
        callback: this.handleMemberAdded
      });

      this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "pusher:member_removed",
        callback: this.handleMemberRemoved
      });

    },
    handleMemberAdded() {
      this.desktopConnected = true;
    },
    handleMemberRemoved() {
      this.dsktopConnected = false;
    },

    send() {
       this.$store.dispatch("pusher/trigger", {
          channel_id: this.fullChannelId,
          eventName: "client-message",
          data: this.message
       });
    },
    previous() {
      this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-previous-field",
        data: {}
       });
    },
    next() {
      this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-next-field",
        data: {}
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