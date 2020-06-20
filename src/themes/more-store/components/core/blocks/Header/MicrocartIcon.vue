<template>
  <button
    type="button"
    class="bg-cl-transparent brdr-none inline-flex"
    @click="openMicrocart"
    data-testid="openMicrocart"
    :aria-label="$t('Open microcart')"
  >
    <i class="material-icons cart-icon">shopping_cart</i>
    <!-- <span v-if="totalQuantity" class="cart-amount border-box center-xs middle-xs weight-600">&#8377;{{ totals[0].value }}.00</span> -->
    <!-- <span v-else class="cart-amount border-box center-xs middle-xs weight-600">&#8377;0.00</span> -->
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
      totalQuantity: 'cart/getItemsTotalQuantity',
      totals: 'cart/getTotals'
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
  .cart-icon {
    font-size: 34px;
    color: #a8aeba;
  }
  @media (max-width: 45em) {
  .cart-icon {
    font-size: 24px;
    color: #f04d24cf;
    }
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
