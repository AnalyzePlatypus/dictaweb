<template>
  <div class="full-height">
    

    <section v-if="!connectionState === 'connected'">
      <h2>Connecting...</h2>
    </section>


    <section v-else-if="connectionState === 'connected' && !phoneConnected">
      <h3>Connection code</h3>
      <h2>{{channel_id}}</h2>
      <p>Open <code>dictaweb.netlify.com</code> on your phone</p>
    </section>

    <main class="main-container">
      <section  v-if="connectionState === 'connected'">
        <form class="form" @submit.prevent>
          <div>
            <div class="form-header">
              <h1 class="form-title">Case Form</h1>
              <div v-if="phoneConnected">
                <p>Type on your phone to see results</p>
              </div>
            </div>

            <div 
              v-for="(field, idx) of fields"
              :key="idx"
              class="form-group"  
              :class="[selectedFieldId === idx ? 'selected-field' : '', flashFieldIds.includes(idx) ? 'flash-success' : '']"
              @click="changeFocus(idx)">
              <label :for="'field' + idx">{{field.label}}</label>

              <input
                v-if="field.rows === 1"
                :id="'field' + idx" 
                :type="field.type" 
                v-model="model[idx]"
                @change="fieldTextEdited(idx)">

              <textarea
                v-else
                :id="'field' + idx" 
                :type="field.type"
                :rows="field.rows" 
                v-model="model[idx]"
                @change="fieldTextEdited(idx)">
              </textarea>
            </div>
          </div>

          
          <div class="button-bar flex-horiz justify-between">
            <button class="button">Clear form</button>

            <button class="button success">Generate PDF</button>
          </div>
        </form>
      </section>

      <aside class="status-card">
        <section>
          <div v-if="connectionState === 'connected'">✅ Server Connected</div>
          <div v-else>❌ Server Disconnected</div>
        </section>

        <section>
          <div v-if="phoneConnected">✅ Phone Connected</div>
          <div v-else>❌ Phone Disconnected</div>
        </section>

        <router-link :to="{name: 'mobile'}">Change to Remote mode ›</router-link>
      </aside>
    </main>
  </div>
</template>

<script>

import Vue from "vue";
import getRandomInt from "@/utils/getRandomInt.js";
import fields from "@/utils/fields.js";
import {nextNumberWithWrapping, previousNumberWithWrapping} from "@/utils/nextNumberWithWrapping.js";

const MIN_CHANNEL_ID = 111111;
const MAX_CHANNEL_ID = 999999;



export default {
  name: 'DesktopMode',
  data() {
    return {
      channel_id: undefined,
      scratchMessages: [],
      phoneConnected: false,
      selectedFieldId: 0,
      fields,
      model: {},
      flashFieldIds: [] 
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
        eventName: "client-field-text-edited",
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
    handleMessage(event) {      
      Vue.set(this.model, event.fieldId, event.text);
      this.flashFieldIds = this.flashFieldIds.filter(id => id != event.fieldId);
      this.flashFieldIds.push(event.fieldId);
      setTimeout(()=>{
        this.flashFieldIds = this.flashFieldIds.filter(id => id != event.fieldId);
      }, 1000)
    },
    handleNextField() {
      this.selectedFieldId = nextNumberWithWrapping(this.selectedFieldId, this.fields.length - 1)
    },
    handlePreviousField() {
      this.selectedFieldId = previousNumberWithWrapping(this.selectedFieldId, this.fields.length - 1)
    },
    changeFocus(fieldId) {
      this.selectedFieldId = fieldId;
      this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-select-field",
        data: {
          fieldId: this.selectedFieldId
        }
       });
    },
    fieldTextEdited(fieldId) {
      this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-field-text-edited",
        data: {
          text: this.model[fieldId],
          fieldId: fieldId
        }
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
  },
  watch: {
    selectedFieldId(oldField, newField) {
       this.$store.dispatch("pusher/trigger", {
        channel_id: this.fullChannelId,
        eventName: "client-field-changed",
        data: {
          fieldId: this.selectedFieldId
        }
       });
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>

$color-primary: rgb(75, 75, 250);
$color-primary__hover: rgb(62, 62, 255);

$color-success: rgb(88, 199, 93);
$color-success__hover: rgb(88, 199, 103);

$flash-success-duration: 4s;
$flash-success-timing: cubic-bezier(0.075, 0.82, 0.165, 1);

.full-height {
  height: 100%;;
}

.main-container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.status-card {
  background: white;
  height: fit-content;
  min-width: 200px;
  margin: 20% 100px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 4px 12px rgba(37, 37, 117, 0.322);
}

.form {
  min-width: 500px;
  background: white;
  padding-bottom: 16px;
  margin-left: 15%;
  height: 100%;
  box-shadow: 0px 4px 12px rgba(37, 37, 117, 0.322);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-header {
  margin: 0px 16px;
}

h1 {
  font-size: 2rem;
  margin: 0px;
  padding-top: 32px;
}

label {
  font-size: 1rem;
  font-weight: bold;
  color: rgb(27, 27, 27);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 0px 0px 1px 2px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 16px 8px 16px;
  width: 100%;

}

.form-group:nth-of-type(2) {
  padding-top: 0px;
}


.selected-field {
  label {
    color: $color-primary;
  }

  input, textarea {
    border-color: $color-primary;
  }
}

.button-bar {
  margin:  4px 16px 4px 16px;
}

.flash-success {
  animation: flash-success__background $flash-success-duration $flash-success-timing;
  
  label {
    animation: flash-success__label $flash-success-duration $flash-success-timing;
  }

  input, textarea {
    animation: flash-success__inputs $flash-success-duration $flash-success-timing;
  }
}

@keyframes flash-success__background {
  0% {
    background: lighten($color-success, 30%);
  }
  100% {
    background: transparent;
  }
}

@keyframes flash-success__inputs {
  0% {
   border-color: $color-success;
   background: lighten($color-success, 20%);
  }
  100% {
    
  }
}

@keyframes flash-success__label {
  0% {
    color: darken($color-success, 10%);
  }
  100% {
    
  }
}

</style>