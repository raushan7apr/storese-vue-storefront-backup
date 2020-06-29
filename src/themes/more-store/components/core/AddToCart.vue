<template>
  <button-full @click.native="addToCart(product)" :disabled="isProductDisabled" data-testid="addToCart">
    {{ $t('Add to cart') }}
  </button-full>
</template>

<script>
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import focusClean from 'theme/components/theme/directives/focusClean'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'

export default {
  directives: { focusClean },
  components: { ButtonFull },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onAfterRemovedVariant () {
      this.$forceUpdate()
    },
    async addToCart (product) {
      const res = await this.$store.dispatch('stock/check', {
        product: product,
        qty: product.qty
      })
      if(maxQuantity > 0) {
        try {
          const diffLog = await this.$store.dispatch('cart/addItem', { productToAdd: product })
          if (this.$ga) {
            this.$ga.event('Add_To_Cart', 'click', JSON.stringify(this.gaData(product)));
          }
          diffLog.clientNotifications.forEach(notificationData => {
            this.notifyUser(notificationData)
          })
        } catch (message) {
          this.notifyUser(notifications.createNotification({ type: 'error', message }))
        }
      } else {
        if (this.$ga) {
          let gaData = {
            product_name: product.name
          }
          this.$ga.event('Out_of_Stock', 'click', JSON.stringify(gaData));
        }
        this.notifyUser(notifications.outOfStock());
      }
    },
    gaData(product) {
      return {
        product_name: product.name,
        product_sku: product.sku,
        product_price: product.original_price_incl_tax,
        offer_price: product.special_price,
      }
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, { root: true })
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding'
    }),
    isProductDisabled () {
      return this.disabled || formatProductMessages(this.product.errors) !== '' || this.isAddingToCart
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-removevariant', this.onAfterRemovedVariant)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-removevariant')
  }
}
</script>
