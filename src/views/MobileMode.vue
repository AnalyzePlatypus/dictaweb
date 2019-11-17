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

    <section  v-else-if="connectionState == 'connected'" class="mobile-mode-container">
      <p>Type to send text to your desktop</p>

      <section>
        <h4 v-if="showSentBanner" class="sent-banner"><bold>Sent!</bold></h4>

        <textarea class="mobile-textarea" rows="4" placeholder="Start typing..." v-model="message" @change="send" ></textarea>

        <button @click="send" class="button-primary button-wide">Send</button>
      </section>

      <section class="flex-horiz">
        <button @click="previous" class="button-wide ">‹ Previous</button>
        <button @click="next" class="button-wide ">Next ›</button>
      </section>
    </section>

    
    <div v-if="!channel_id">
      Ready to connect
    </div>

    <!-- <div v-else>
      {{connectionState}} to {{channel_id}}
    </div> -->

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
      desktopConnected: false,
      showSentBanner: false
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

      this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "client-field-changed",
        callback: this.handleFieldChanged
      });

    },
    handleMemberAdded() {
      this.desktopConnected = true;
    },
    handleMemberRemoved() {
      this.desktopConnected = false;
    },
    handleFieldChanged(event) {

    },

    send() {
       this.$store.dispatch("pusher/trigger", {
          channel_id: this.fullChannelId,
          eventName: "client-message",
          data: this.message
       });
       this.message = "";
       this.showSentBanner = true;
       setTimeout(()=>{
         this.showSentBanner = false
       }, 1000)
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

.mobile-mode-container {
  margin: 4px;
}

input {
   border: 2px solid lightgray;
  border-radius: 4px;
  width: 100%;
  font-size: 1.2rem;
}

textarea {
  border: 2px solid lightgray;
  border-radius: 4px;
  width: 100%;
  font-size: 1.2rem;
}

button {
  font-size: 1.2rem;
  margin: 2px;
  border-radius: 4px;
  padding: 4px 12px;
}

.button-wide {
  padding: 4px 22px;
  width: 100%;
}

.button-primary {
  background: rgb(50, 50, 246);
  color: white;
}

.sent-banner {
  color: green;
  background: rgba(0, 128, 0, 0.239);
  padding: 6px 6px 3px 6px;
  margin: 0px;
  margin-bottom: 8px;
}
</style>