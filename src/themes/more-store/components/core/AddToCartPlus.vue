<template>
  <div class="add-to-cart-button pr15 pb10" v-if="cartQuantity(product, productsInCart) == 0" @click="addToCart(product, cartQuantity(product, productsInCart))" :disabled="isProductDisabled" data-testid="addToCart">
    Add
  </div>
  <div v-else @click="addToCart(product, cartQuantity(product, productsInCart))" :disabled="isProductDisabled" data-testid="addToCart">
    +
  </div>
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
    async addToCart (product, currentQuantity) {
      const res = await this.$store.dispatch('stock/check', {
        product: product,
        qty: product.qty
      })
      let maxQuantity = res.isManageStock ? res.qty : 0
      if (currentQuantity < maxQuantity) {
        try {
          const diffLog = await this.$store.dispatch('cart/addItem', { productToAdd: product })
          if (this.$ga && currentQuantity === 0) {
            this.$ga.event('Add_To_Cart', 'click', JSON.stringify(this.gaData(product)));
          }
          if(this.$ga && currentQuantity > 0) {
            let gaData = this.gaData(product)
            gaData.new_quantity = currentQuantity + 1;
            gaData.old_quantity = currentQuantity;
            this.$ga.event('Change_Quantity', 'click', JSON.stringify(gaData));
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
    width: 100%;
    color: #fff;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    // margin: 4px 2px;
    border-radius: 5px;
    padding-bottom: 5px;
  }

</style>
