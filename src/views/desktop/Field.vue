<template>
  <div class="form-group"  :class="dynamicClasses">
    <label :for="'fieldConfig' + fieldId">{{fieldConfig.label}}</label>

    <input
      v-if="fieldConfig.rows === 1"
      :id="'fieldConfig' + fieldId" 
      :type="fieldConfig.type" 
      v-model="model"
      @focus="$emit('changeFocus', fieldId)"
      @change="$emit('fieldTextEdited', fieldId)">

    <textarea
      v-else
      :id="'fieldConfig' + fieldId" 
      :type="fieldConfig.type"
      :rows="fieldConfig.rows" 
      v-model="model"
      @focus="$emit('changeFocus', fieldId)"
      @change="$emit('fieldTextEdited', fieldId)">
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    fieldId: {
      type: Number,
      required: true,
    },
    fieldConfig: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
    selectedFieldId: {
      type: Number,
      required: false,
    },
    flashFieldIds: {
      type: Array,
      required: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    dynamicClasses() {
      return [
        this.selectedFieldId === this.fieldId ? 'selected-field' : '', 
        this.flashFieldIds.includes(this.fieldId) ? 'flash-success' : ''
      ]
    }
  }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
</style>