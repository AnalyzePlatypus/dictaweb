<template>
  <div class="flex-vert align-center">
     <h1 class="text-center"  style="padding: 32px 0px 24px 0px; ">Dictaphone</h1>


    <section class="card" style="max-width: 300px;" v-if="connectionState == 'not_initialized'">
      <form @submit="connect">
        <h2>Enter Connection Code</h2>
        <div class="flex-vert align-center">
          <input 
            type="tel" 
            autocomplete="off" 
            class="text-input-narrow" 
            @input="connect"
            v-model="channel_id">
        </div>
        <p class="text-center">Open <code>dictaweb.netlify.com</code> on your desktop</p>
      </form>
    </section>

    <section v-if="connectionState == 'connecting'">
      <h2>Connecting...</h2>
    </section>

    <section v-else-if="connectionState == 'connected'" class="mobile-mode-container card">
      
      <h2 style="text-align:left;">{{fields[selectedFieldId].label}}</h2>

      <section>
        <h4 v-if="showSentBanner" class="sent-banner"><bold>Sent!</bold></h4>

        <textarea class="mobile-textarea" rows="6" placeholder="Start typing..." v-model="model[selectedFieldId]" @change="send" ></textarea>
      </section>

      <section class="flex-horiz">
        <button @click="previous" class="button-wide button">‹ Previous</button>
        <button @click="next" class="button-wide button">Next ›</button>
      </section>
    </section>

    
   

    <!-- <div v-else>
      {{connectionState}} to {{channel_id}}
    </div> -->

    <!-- <section>
      <div v-if="connectionState === 'connected'">✅ Desktop Connected</div>
      <div v-else>❌ Server Disconnected</div>
    </section> -->

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

import Vue from 'vue';
import AppleDetectBrowser from "@/utils/AppleDetectBrowser.js";
import fields from "@/utils/fields.js";
import {nextNumberWithWrapping, previousNumberWithWrapping} from "@/utils/nextNumberWithWrapping.js";

const CHANNEL_ID_LENGTH = 6;

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
      showSentBanner: false,
      selectedFieldId: 0,
      fields,
      model: {}
    };
  },
  mounted() {
    this.deviceDetails = AppleDetectBrowser();
    this.model = Array.from({length: this.fields.length});
  },
  methods: {
    async connect() {
      if(!this.channelIdReadyToSubmit) return;

      await this.$store.dispatch("pusher/init", 'mic');
      this.$store.dispatch("pusher/subscribe", {
        channel_id: this.fullChannelId, 
        onSuccess() {
          console.log(`Connected to ${this.fullChannelId}`);
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

       this.$store.dispatch("pusher/bind", {
        channel_id: this.fullChannelId,
        eventName: "client-field-text-edited",
        callback: this.handleFieldTextEdited
      });

    },
    handleMemberAdded() {
      this.desktopConnected = true;
    },
    handleMemberRemoved() {
      this.desktopConnected = false;
    },
    handleFieldChanged(event) {      
      this.selectedFieldId = event.fieldId;
    },
    handleFieldTextEdited(event) {
      this.selectedFieldId = event.fieldId;
      Vue.set(this.model, event.fieldId, event.text);
    },
 
    send() {
      this.$store.dispatch("pusher/trigger", {
          channel_id: this.fullChannelId,
          eventName: "client-field-text-edited",
          data: {
            text: this.model[this.selectedFieldId],
            fieldId: this.selectedFieldId
          }
       });
       this.showSentBanner = true;
       setTimeout(()=>{
         this.showSentBanner = false
       }, 1000)
    },

    previous() {
      this.selectedFieldId = previousNumberWithWrapping(this.selectedFieldId, this.fields.length - 1);
      this.syncSelectedField();
    },
    next() {
      this.selectedFieldId = nextNumberWithWrapping(this.selectedFieldId, this.fields.length - 1);
      this.syncSelectedField();
    },
    syncSelectedField() {
       this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-select-field",
        data: {fieldId: this.selectedFieldId }
       });
    }
  },
  computed: {
    fullChannelId() {
      return `presence-${this.channel_id}`;
    },
    channelIdReadyToSubmit() {
      return this.channel_id && this.channel_id.length >= CHANNEL_ID_LENGTH;
    },
    connectionState() {
      return this.$store.getters['pusher/connectionState'];
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>

$flash-success-timing: cubic-bezier(0.075, 0.82, 0.165, 1);


.button-wide {
  // padding: 4px 22px;
  width: 100%;
  &:first-of-type {
    margin-right: 8px;
  }
  &:last-of-type {
    margin-left: 8px;
  }
}

.button-primary {
  background: rgb(75, 75, 250);
  color: white;
}

.sent-banner {
  color: green;
  background: rgba(0, 128, 0, 0.239);
  padding: 6px 6px 3px 6px;
  margin: 0px;
  margin-bottom: 8px;
}

.text-input-narrow {
  font-size: 2.2rem;
  // width: 150px;
  text-align: center;
}

.card {
  background: white;
  height: fit-content;
  
  width: 95%;
  margin: 4px 16px;
  
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 4px 12px rgba(37, 37, 117, 0.322);
  transition: all 1s $flash-success-timing;
}

.text-center {
  text-align: center;
}
</style>