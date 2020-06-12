<template>
  <button
    type="button"
    class="relative bg-cl-transparent brdr-none inline-flex"
    @click="openMicrocart"
    data-testid="openMicrocart"
    :aria-label="$t('Open microcart')"
  >
    <i class="material-icons">shopping_cart</i>
    <span class="cart-amount border-box center-xs middle-xs weight-600">&#8377;0.00</span>
    <span
      class="minicart-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
    >
      {{ totalQuantity }}
    </span>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MicrocartIcon from '@vue-storefront/core/compatibility/components/blocks/Header/MicrocartIcon'
import { syncCartWhenLocalStorageChange } from '@vue-storefront/core/modules/cart/helpers'

export default {
  mounted () {
    syncCartWhenLocalStorageChange.addEventListener()
    this.$once('hook:beforeDestroy', () => {
      syncCartWhenLocalStorageChange.removeEventListener()
    })
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    })
  }
}
</script>

<style scoped>
  .minicart-count {
    top: 30px;
    left: 130px;
    min-width: 30px;
    min-height: 30px;
    border-radius: 36px;
    font-size: 20px;
    color: #000;
    font-weight: 500;
  }

  .cart {
    font-size: 36px;
    color: #a8aeba;
  }

  .cart-amount {
    float: right;
    display: block;
    padding-top: 8px;
    font-size: 22px;
    color: #a8aeba;
    font-weight: 600;
  }
</style>
