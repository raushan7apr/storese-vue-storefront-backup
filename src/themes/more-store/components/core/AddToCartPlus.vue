<template>
  <span class="add-to-cart-button pr15 pb10" v-if="cartQuantity(product, productsInCart) == 0" @click="addToCart(product)" :disabled="isProductDisabled" data-testid="addToCart">
    Add
  </span>
  <span v-else @click="addToCart(product)" :disabled="isProductDisabled" data-testid="addToCart">
    +
  </span>
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
      let maxQuantity = res.isManageStock ? res.qty : null
      if (maxQuantity) {
        try {
          const diffLog = await this.$store.dispatch('cart/addItem', { productToAdd: product })
          diffLog.clientNotifications.forEach(notificationData => {
            this.notifyUser(notificationData)
          })
        } catch (message) {
          this.notifyUser(notifications.createNotification({ type: 'error', message }))
        }
      } else {
        this.notifyUser(notifications.outOfStock());
      }
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, { root: true })
    },
    cartQuantity (product, cart) {
      let cartItem = this.cartItem(product, cart);
      if (cartItem) {
        return cartItem.qty;
      } else {
        return 0;
      }
    },
    cartItem (product, cart) {
      let cartItem = cart.find(item => item.name === product.name);
      return cartItem;
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding',
      productsInCart: 'cart/getCartItems'
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
<style lang="scss" scoped>

  .add-to-cart-button {
    color: #fff;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 5px;
    padding-bottom: 5px;
  }

</style>
