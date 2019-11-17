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

    <section  v-else-if="connectionState === 'connected'">
      <form class="margin: 0 auto;">
        <div v-if="phoneConnected">
        <p>Type on your phone to see results</p>
      </div>
        <div class="form-group"  :class="selectedField === 0 ? 'selected-field' : ''">
          <label for="question-1">Name</label>
          <input id="question-1" type="text" v-model="textFields[0]">
        </div>

         <div class="form-group" :class="selectedField === 1 ? 'selected-field' : ''">
          <label for="question-1">Description</label>
          <textarea id="question-1" type="text" v-model="textFields[1]" rows="2"></textarea>
        </div>

         <div class="form-group" :class="selectedField === 2 ? 'selected-field' : ''">
          <label for="question-1">Impressions</label>
          <textarea id="question-1" type="text" v-model="textFields[2]" rows="5"></textarea>
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



export default {
  name: 'DesktopMode',
  data() {
    return {
      channel_id: undefined,
      scratchMessages: [],
      phoneConnected: false,
      selectedField: 0,
      maxFields: 2,
      textFields: [
        "",
        "",
        ""
      ]
    };
  },
  async mounted() {
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
  },
  watch: {
    selectedField(oldField, newField) {
       this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-field-changed",
        data: {}
       });
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>

label {
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(27, 27, 27);
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 500px;
  margin-top: 28px;
}

.selected-field {
  label {
    color: blue;
  }

  input, textarea {
    border-color: blue;
  }
}
</style>