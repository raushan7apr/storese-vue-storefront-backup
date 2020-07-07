<template>
  <div class="select-wrapper relative pb10">
    <select
      class="inputform"
      :name="name"
      :class="{
        'cl-tertiary' : options.length === 0,
        'empty': !selected
      }"
      :autocomplete="autocomplete"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @change="$emit('change', $event.target.value)"
      @input="$emit('input', $event.target.value)"
    >
      <option disabled selected v-if="!selected">{{name}}</option>
      <option
        v-for="(option, key) in options"
        :key="key"
        :value="option.value"
        v-bind="{selected: option.value === selected}"
      >
        {{ option.label }}
      </option>
    </select>
    <!-- <label>{{ placeholder }}</label> -->

    <ValidationMessagesMobile v-if="validations" :validations="validations" />
  </div>
</template>

<script>
import ValidationMessagesMobile from './ValidationMessagesMobile.vue'

export default {
  name: 'BaseSelectMobile',
  components: {
    ValidationMessagesMobile
  },
  props: {
    id: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    selected: {
      type: String,
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    autocomplete: {
      type: String,
      required: false,
      default: ''
    },
    validations: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  @import '~theme/css/base/text';
  $color-tertiary: color(tertiary);
  $color-black: color(black);
  $color-puerto-rico: color(puerto-rico);
  $color-hover: color(tertiary, $colors-background);
.inputform {
    border-radius: 3px;
    border-color: #a7a5a5;
    padding-left: 15px;
    border-width: 1px;
    border-style: solid;
    color: #000;
  }
.select-wrapper {
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 1rem;
    right: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 6px 0 6px;
    border-color: $color-tertiary transparent transparent transparent;
    pointer-events: none;
  }
  select {
    @extend .h6;
    // border: none;
    // border-bottom: 1px solid $color-tertiary;
    width: 100%;
    -moz-appearance: none;
    -webkit-appearance: none;
    // border-radius: 0;
    background-color: transparent;

    &:hover,
    &:focus {
      outline: none;
      border-color: #f04d24cf;
      // border-color: $color-puerto-rico;
    }

    &:disabled,
    &:disabled + label {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  label {
    color: #999;
    position: absolute;
    pointer-events: none;
    user-select: none;
    top: 10px;
    left: 8px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
  select:focus ~ label, select:not(.empty) ~ label {
    top: -10px;
    font-size: 14px;
    color: #f04d24cf;
    // color: $color-puerto-rico;
  }
}
</style>
