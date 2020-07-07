<template>
  <div class="sort-by">
    <select
      name="sortby"
      class="cl-secondary sort-by-select"
      v-model="sortby"
      @change="changeOrder"
      style="color: #000"
    >
      <option selected="selected" disabled value="" v-if="!hasLabel">
        {{ $t('Sort') }}
      </option>
      <option v-for="variant in sortingVariants" :value="variant" :key="variant.id">
        {{ $t(variant.label) }}
      </option>
    </select>
  </div>
</template>

<script>
import SortBy from '@vue-storefront/core/compatibility/components/SortBy'
import { products } from 'config'
export default {
  mixins: [SortBy],
  props: {
    hasLabel: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sortby: null
    }
  },
  watch: {
    value: {
      handler () {
        const defaultVariant = this.value && this.value.length ? this.value : products.defaultSortBy.attribute
        this.sortby = this.sortingVariants.find(variant => variant.id.includes(defaultVariant))
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '~theme/css/base/text';
    @import '~theme/css/variables/colors';
    @import '~theme/css/helpers/functions/color';
    $color-tertiary: color(tertiary);
    .sort-by {
        display: inline-flex;
        position: relative;
        border-bottom: 1px solid #f04d24cf;
        select {
            @extend .h4;
            font-size: 16px;
            border: none;
            width: 100%;
            border-radius: 0;
            background-color: transparent;
            margin-right: 0;
            &:focus {
                outline: none;
            }
            font-family: 'Nunito', sans-serif !important;
        }
        &__icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
    @media (max-width: 770px) {
      .sort-by {
        width: 75%;
      }
      .sort-by-select {
        height: 20px;
      }
    }
</style>
