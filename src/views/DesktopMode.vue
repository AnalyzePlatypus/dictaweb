<template>
  <div>
    <h1>Desktop Mode</h1>

    <section v-if="!connectionState === 'connected'">
      <h2>Connecting...</h2>
    </section>


    <section v-else-if="connectionState === 'connected' && !phoneConnected">
      <h3>Connection code</h3>
      <h2>{{channel_id}}</h2>
      <p>Open <code>dictaweb.io</code> on your phone</p>
    </section>

    <section  v-else-if="connectionState === 'connected' && phoneConnected">
      <h2>Connected</h2>
      <p>Type on your phone to see results</p>
      <form>
        <div>
          <label for="question-1" :style="selectedField === 0 ? 'font-weight: bold;' : ''">Question 1</label>
          <input id="question-1" type="text" v-model="textFields[0]">
        </div>

         <div>
          <label for="question-1" :style="selectedField === 1 ? 'font-weight: bold;' : ''">Question 2</label>
          <input id="question-1" type="text" v-model="textFields[1]">
        </div>

         <div>
          <label for="question-1" :style="selectedField === 2 ? 'font-weight: bold;' : ''">Question 3</label>
          <input id="question-1" type="text" v-model="textFields[2]">
        </div>
      </form>
    </section>


     <section>
      <div v-if="connectionState === 'connected'">✅ Server Connected</div>
      <div v-else>❌ Server Disconnected</div>
    </section>

    <section>
      <div v-if="phoneConnected">✅ Phone Connected</div>
      <div v-else>❌ Phone Disconnected</div>
    </section>
  </div>
</template>

<script>

import Vue from "vue";
import getRandomInt from "@/utils/getRandomInt.js";

const MIN_CHANNEL_ID = 111111;
const MAX_CHANNEL_ID = 999999;

const STATUS = {
  BOOT: "BOOT",
  SETUP: "SETUP",
  WAITING_FOR_MIC_CONNECTION: "WAITING_FOR_MIC_CONNECTION",
  MIC_CONNECTED: "MIC_CONNECTED",
  MIC_DISCONNECTED: "MIC_DISCONNECTED",
}

export default {
  name: 'DesktopMode',
  data() {
    return {
      STATUS,
      status: STATUS.BOOT,
      channel_id: undefined,
      scratchMessages: [],
      phoneConnected: false,
      selectedField: 1,
      maxFields: 2,
      textFields: [
        "",
        "",
        ""
      ]
    };
  },
  async mounted() {
    if(this.status = STATUS.BOOT) {
      await this.$store.dispatch("pusher/init", "desktop");
      this.channel_id = getRandomInt(MIN_CHANNEL_ID, MAX_CHANNEL_ID);
      this.$store.dispatch("pusher/subscribe", {
        channel_id: this.fullChannelId, 
        onSuccess: () => {}, 
        onFailure: (e) => {
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
        eventName: "client-message",
        callback: this.handleMessage
      });

       this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "client-next-field",
        callback: this.handleNextField
      });

       this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "client-previous-field",
        callback: this.handlePreviousField
      });
    }
  },
  methods: {
    handleMemberAdded() {
      this.phoneConnected = true;
    },
    handleMemberRemoved() {
      this.phoneConnected = false;
    },
    handleMessage(message) {
      Vue.set(this.textFields, this.selectedField, message)
      this.scratchMessages.push(message)
    },
    handleNextField() {
      this.selectedField += 1;
      if(this.selectedField > this.maxFields) this.selectedField = 0;
    },
    handlePreviousField() {
      this.selectedField -= 1;
      if(this.selectedField < 0) this.selectedField = this.maxFields;
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