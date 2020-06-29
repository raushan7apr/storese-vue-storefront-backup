<template>
  <div class="base-input-number">
    <!-- <label class="base-input-number__label cl-primary flex" :for="getInputId">{{ name }}</label> -->
   <div class="add-to-cart">
        <div class="decrease" @click="decrement" >
          -
        </div>
        <div class="qty">
          {{ inputValue }}
        </div>
        <div class="increase" @click="increment">
          +
        </div>
      </div>
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
  border-color: #f04d24cf;
  border-width: 4px;
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

.add-to-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 108px;
  height: 36px;
  border: 4px solid #f36e4d;
  border-radius: 15px;
  // margin-top: 8px;
  box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.2), 0 5px 6px 0 rgba(0, 0, 0, 0.19);
}
.add-to-cart > .decrease {
  font-size: 24px;
  font-weight: 900;
  padding-right: 12px;
  padding-top: 4px;
  margin-bottom: 4px;
  width: 33.33%;
  cursor: pointer;
}

.add-to-cart > .qty {
  font-size: 16px;
  font-weight: 900;
  padding: 0px 8px 0px 8px;
  color: #aaaaaa;
}

.add-to-cart > .increase {
  font-size: 24px;
  font-weight: 900;
  padding-left: 12px;
  margin-bottom: 2px;
  width: 33.33%;
  cursor: pointer;
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
