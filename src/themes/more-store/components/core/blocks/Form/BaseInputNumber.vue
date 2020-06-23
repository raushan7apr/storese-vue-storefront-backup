<template>
  <div class="base-input-number">
    <!-- <label class="base-input-number__label cl-primary flex" :for="getInputId">{{ name }}</label> -->
    <button @click="decrement" class="btn minus1">
      -
    </button>
    <input
      :id="getInputId"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      class="m0 no-outline base-input-number__input brdr-cl-primary bg-cl-transparent"
      :focus="autofocus"
      v-model="inputValue"
      @blur="$emit('blur', $event.target.value)"
    >
    <button @click="increment" class="btn add1">
      +
    </button>
    <ValidationMessages v-if="validations" :validations="validations" />
  </div>
</template>

<script>
import ValidationMessages from './ValidationMessages.vue'
export default {
  name: 'BaseInput',
  components: {
    ValidationMessages
  },
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Array,
      default: () => []
    },
    onlyPositive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    increment (e) {
      const value = this.inputValue;
      this.inputValue = value + 1;
    },
    decrement (e) {
      const value = this.inputValue;
      this.inputValue = value - 1;
    }
  },
  computed: {
    getInputId () {
      return `input_${this._uid}`
    },
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        if (!this.onlyPositive) {
          this.$emit('input', value)
        } else {
          const targetValue = parseInt(value, 10)
          if (!isNaN(targetValue)) {
            // this.$emit('input', targetValue !== 0 ? Math.abs(targetValue) : 1)
            this.$emit('input', Math.abs(targetValue))
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
.base-input-number{
   display:flex;
   width:70px;
}

/* it will support chrome and firefox */
.base-input-number input[type=number]::-webkit-inner-spin-button,
.base-input-number input[type=number]::-webkit-outer-spin-button{
   -webkit-appearance:none;
}

.base-input-number input,.base-input-number button{
   width:32px;
   padding:.5em;
   text-align:center;
  //  font-weight:900;
}

.base-input-number input{
   border-left:none;
   border-right:none;
}
.btn {
  color:#f04d24cf;
  border-color: #f04d24cf;
  border-radius: 5px;
  background-color: #fff;
}
.base-input-number {
  &__input {
    border-style: solid;
    border-width: 0 0 0 0;
    width: 32px;
    height: 1.4rem;
    line-height: 1.7rem;
    @media (min-width: 768px) {
      height: 1.4rem;
    }
  }

  &__label {
    font-size: 0.8rem;
    line-height: 1.2rem;
    @media (min-width: 768px) {
      font-size: 1rem;
      line-height: 1.4rem;
    }
  }
}
</style>
