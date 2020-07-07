<template>
  <div
    class="microcart cl-accent relative"
    :class="[productsInCart.length ? 'bg-cl-secondary' : 'bg-cl-primary']"
    data-testid="microcart"
  > <img v-if="showLoader" data-v-8b7e55fa="" src="/assets/loader.gif" class="loader">
    <transition name="fade">
      <div v-if="isEditMode" class="overlay" @click="closeEditMode" />
    </transition>
    <div class="row bg-cl-primary px20 actions">
      <div class="first-sm">
        <div class="no-underline cl-secondary link">

          <button
            type="button"
            class="p0 brdr-none bg-cl-transparent close"
            @click="goBack"
            data-testid="closeMicrocart"
          >
            <i class="material-icons back-icon cl-accent mt2">
              arrow_back
            </i>
          </button>
          <span class="py20 cart-item-title">
            <strong class="text">{{ $t('Your Cart') }}</strong>
            <span v-if="totalQuantity > 1" class="count">{{ totalQuantity }} Items</span>
            <span v-else class="count">{{ totalQuantity }} Item</span>
          </span>
        </div>
      </div>

      <div @click="clearCart" class="col-xs end-xs clear-cart">
        Clear Cart
      </div>
      <!--<div class="col-xs end-xs hide-mobile">
        <clear-cart-button
        class="py30"
        v-if="productsInCart.length"
        @click.native="clearCart"
      />
      </div>-->
    </div>
    <!-- <div
      class="row py20 px40 middle-xs actions"
      v-if="productsInCart.length && !isCheckoutMode"
    >
      <div class="col-xs-12 col-sm first-sm">
        <router-link :to="localizedRoute('/')" class="no-underline cl-secondary link">
          <span @click="closeMicrocartExtend">
            {{ $t('Return to shopping') }}
          </span>
        </router-link>
      </div>
    </div> -->
    <!-- <div class="row middle-xs bg-cl-primary top-sm px40 actions">
      <div class="col-xs-12 col-sm">
        <h2
          v-if="productsInCart.length"
          class="cl-accent mt35 mb35"
        >
          {{ $t('Shopping cart') }}
        </h2>
      </div>
      <div class="col-xs-12 col-sm mt35 mb35 mt0 end-sm clearcart-col">
        <clear-cart-button
          v-if="productsInCart.length"
          @click.native="clearCart"
        />
      </div>
    </div> -->
    <div class="minimum-order">
      <span class="minimum-order-text" v-if="totals[0].value < minimumOrderAmount">*Minimum order amount is {{ minimumOrderAmount | price(storeView) }}</span>
    </div>
    <h4 v-if="!productsInCart.length" class="cl-accent ml30 nunito">
      {{ $t('Your shopping cart is empty.') }}
    </h4>
    <div v-if="!productsInCart.length" class="ml30" @click="closeMicrocartExtend(totals)">
      {{ $t("Don't hesitate and") }}
      <router-link :to="localizedRoute('/')">
        {{ $t('browse our catalog') }}
      </router-link>
      {{ $t('to find something beautiful for You!') }}
    </div>
    <ul v-if="productsInCart.length" class="bg-cl-primary m0 pl0 pr40 pb92 products">
      <product v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" />
    </ul>
    <div v-if="productsInCart.length" class="summary cl-accent">
      <!--<h3 class="m0 pb10 weight-400 summary-heading helvetica">
        {{ $t('Shopping summary') }}
      </h3>-->
      <!--<div v-for="(segment, index) in totals" :key="index" class="helvetica row py10" v-if="segment.code !== 'grand_total' && segment.code !== 'tax'">
        <div class="col-xs">
          <div v-if="segment.code === 'shipping'">
            Shipping Fee
          </div>
          <div v-else>
            {{ segment.title }}
          </div>
          <button v-if="appliedCoupon && segment.code === 'discount'" type="button" class="p0 brdr-none bg-cl-transparent close delete-button ml10" @click="clearCoupon">
            <i class="material-icons cl-accent">
              close
            </i>
          </button>
        </div>
        <div v-if="segment.value != null" class="col-xs align-right">
          {{ segment.value | price(storeView) }}
        </div>
      </div>-->
      <!-- <div class="row py20">
        <div v-if="OnlineOnly && !addCouponPressed" class="col-xs-12">
          <button
            class="p0 brdr-none serif fs-medium-small cl-accent bg-cl-transparent"
            type="button"
            @click="addDiscountCoupon"
          >
            {{ $t('Add a discount code') }}
          </button>
        </div>
        <div v-if="OnlineOnly && addCouponPressed" class="col-xs-12 pt30 coupon-wrapper">
          <div class="coupon-input">
            <label class="h6 cl-secondary">{{ $t('Discount code') }}</label>
            <base-input type="text" id="couponinput" :autofocus="true" v-model.trim="couponCode" @keyup.enter="setCoupon" />
          </div>
          <button-outline color="dark" :disabled="!couponCode" @click.native="setCoupon">
            {{ $t('Add discount code') }}
          </button-outline>
        </div>
      </div> -->

      <div class="row cart-total cart-mobile-sticky-bottom pt10 pb10 weight-600 middle-xs" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total'">
        <!--<div class="col-xs h4 total-price-label">
          {{ segment.title }}
        </div>-->
        <div class="col-xs-7 h4 total-price-label">
          Cart Total <!-- {{ productsInCart.length }} Item |-->  
          <span v-if="amountSaved" class="saved-amount"> <span class="cl-accent">|</span> Saved &#x20b9;{{ amountSaved }}</span>
        </div>
        <!--<div class="col-xs align-right h4 total-price-value">
          {{ segment.value | price(storeView) }}
        </div>-->
        <div class="col-xs-5 align-right h4 total-price-value">
          {{ totals[0].value | price(storeView) }}
        </div>
      </div>
      <div
      class="row middle-xs actions-footer hide-mobile"
      v-if="productsInCart.length && !isCheckoutMode"
      >
        <div class="col-xs-4 first-xs col-sm-4 first-sm p0" style="height:49.49px">
          <button
            type="button"
            class="back-button w-100"
            @click="goBack"
            data-testid="closeMicrocart"
          >
            {{ $t('BACK') }}
          </button>
        </div>
        <!-- <div class="col-xs-12 col-sm first-sm">
          <instant-checkout v-if="isInstantCheckoutRegistered" class="no-outline button-full block brdr-none px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white sans-serif fs-medium mt20" />
        </div> -->
        <div class="col-xs-8 end-xs col-sm-8 end-sm p0">
          <button-full class="payment-button w-100"
            @click.native="makePayment(totals)"
            :disabled="totals[0].value < minimumOrderAmount ? true : false"
          >
            {{ $t('Go to checkout') }}
          </button-full>
        </div>
      </div>

      <div
        class="row hide-desktop bottom-sticky-buttons"
        v-if="productsInCart.length && !isCheckoutMode"
      >
        <div class="col-xs-4 first-xs back col-sm-6 first-sm">
          <button
            type="button"
            class="back-button w-100"
            @click="goBack"
            data-testid="closeMicrocart"
          >
            BACK
          </button>
        </div>
        <!-- <div class="col-xs-12 col-sm first-sm">
          <instant-checkout v-if="isInstantCheckoutRegistered" class="no-outline button-full block brdr-none px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white sans-serif fs-medium mt20" />
        </div> -->
        <div class="col-xs-8 end-xs pay col-sm-6 end-sm">
          <button-full class="payment-button weight-700 w-100"
            @click.native="makePayment(totals)"
            :disabled="totals[0].value < minimumOrderAmount ? true : false"
          >
          CHECKOUT
          </button-full>
        </div>
      </div>
    </div>
    <div v-if="showLoader" class="overlay-wrapper">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { isModuleRegistered } from '@vue-storefront/core/lib/modules'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import VueOfflineMixin from 'vue-offline/mixin'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import InstantCheckout from 'src/modules/instant-checkout/components/InstantCheckout.vue'
import { registerModule } from '@vue-storefront/core/lib/modules'

// import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ClearCartButton from 'theme/components/core/blocks/Microcart/ClearCartButton'
import ButtonFull from 'theme/components/theme/ButtonFull'
// import ButtonOutline from 'theme/components/theme/ButtonOutline'
import Product from 'theme/components/core/blocks/Microcart/Product'
import EditMode from './EditMode'
import { InstantCheckoutModule } from 'src/modules/instant-checkout'
import config from 'config'
import { CartService } from '@vue-storefront/core/data-resolver'

export default {
  components: {
    Product,
    ClearCartButton,
    ButtonFull,
    // ButtonOutline,
    // BaseInput,
    InstantCheckout
  },
  mixins: [
    VueOfflineMixin,
    EditMode,
    onEscapePress
  ],
  data () {
    return {
      addCouponPressed: false,
      couponCode: '',
      componentLoaded: false,
      showLoader: false,
      isInstantCheckoutRegistered: isModuleRegistered('InstantCheckoutModule'),
      minimumOrderAmount: null
    }
  },
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  beforeCreate () {
    registerModule(InstantCheckoutModule)
  },
  created () {
    this.$bus.$on('go_ahead_checkout', this.goCheckout)
  },
  beforeDestroy () {
    this.$bus.$off('go_ahead_checkout', this.goCheckout)
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
    })
    this.getShippingMethods()
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      isOpen: 'cart/getIsMicroCartOpen',
      totalQuantity: 'cart/getItemsTotalQuantity'
    }),
    storeView () {
      return currentStoreView()
    },
    amountSaved() {
      let amountSaved = 0;
      for(let product of this.productsInCart) {
        amountSaved = amountSaved + (product.original_price - product.price)*product.qty
      }
      return amountSaved
    },
    minimumOrder () {
      return config.storeViews.minimumOrder
    }
  },
  methods: {
    ...mapActions({
      applyCoupon: 'cart/applyCoupon'
    }),
    async getShippingMethods() {
      let method = {
        method_title: 'Free shipping',
        method_code: 'freeshipping',
        carrier_code: 'freeshipping',
        amount: 0,
        price_incl_tax: 0,
        default: true,
        offline: true
      }
      try {
        const response = await CartService.getShippingInfo()
        let shippingMethodFinal = 1;
        if (!response.result.hasOwnProperty('message')) {
          this.minimumOrderAmount = response.result.min_order_amt
          // store zipcodes and regions in session
          console.log(response);
          sessionStorage.setItem('regions', JSON.stringify(response.result.regions))
          sessionStorage.setItem('zipcodes', response.result.zipcodes)

          let delivery_charges = {}
          for(let shipping_method of response.result.shipping_methods) {
            if(shipping_method.carrier_code === 'tablerate') {
              shippingMethodFinal = 1;
              delivery_charges[shipping_method.order_subtotal] = shipping_method
            }
          }
          sessionStorage.setItem('delivery_charges', JSON.stringify(delivery_charges))
          // loop through shipping methods and add
          for (let i = 0; i < response.result.shipping_methods.length; i++) {
            if (response.result.shipping_methods[i].method_code === 'flatrate') {
              shippingMethodFinal = 2;
              method = {
                method_title: response.result.shipping_methods[i].method_title,
                method_code: response.result.shipping_methods[i].method_code,
                carrier_code: response.result.shipping_methods[i].carrier_code,
                amount: response.result.shipping_methods[i].amount,
                price_incl_tax: response.result.shipping_methods[i].price_incl_tax,
                default: true,
                offline: true
              }
            }
          }
        }
        if (shippingMethodFinal !== 1) {
          this.$store.dispatch('checkout/addShippingMethod', method, { root: true })
        }
      }
      catch(err) {
        console.log(err)
      }
    },
    async makePayment(totals) {
      this.$store.dispatch('cart/creation')
      this.closeMicrocartExtend(totals)
    },
    addDiscountCoupon () {
      this.addCouponPressed = true
    },
    clearCoupon () {
      this.$store.dispatch('cart/removeCoupon')
      this.addCouponPressed = false
    },
    toggleMicrocart () {
      this.$store.dispatch('ui/toggleMicrocart')
    },
    async setCoupon () {
      const couponApplied = await this.applyCoupon(this.couponCode)
      this.addCouponPressed = false
      this.couponCode = ''
      if (!couponApplied) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: i18n.t("You've entered an incorrect coupon code. Please try again."),
          action1: { label: i18n.t('OK') }
        })
      }
    },
    closeMicrocartExtend (totals) {
      if (this.$ga && totals[1].value) {
        let gaData = {
          cart_amount: totals[1].value
        }
        this.$ga.event('Continue_Checkout', 'click', JSON.stringify(gaData));
        this.$ga.ecommerce.setAction('checkout', {
          'step': 4,
          'option': 'Checkout'
        })
        this.$ga.ecommerce.send('checkout')
      }
    },
    goBack () {
      this.$store.dispatch('ui/closeMicrocart')
      this.$store.commit('ui/setSidebar', false)
      this.addCouponPressed = false
    },
    goCheckout () {
      if (this.totals[0].value > this.minimumOrderAmount) {
        this.$store.dispatch('ui/closeMicrocart')
        this.$store.commit('ui/setSidebar', false)
        this.addCouponPressed = false
        this.$router.push(this.localizedRoute('/checkout'))
      }
    },
    onEscapePress () {
      this.$store.dispatch('ui/closeMicrocart')
    },
    clearCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Are you sure you would like to remove all the items from the shopping cart?'),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: { label: i18n.t('OK'),
          action: async () => {
            // We just need to clear cart on frontend and backend.
            // but cart token can be reused
            await this.$store.dispatch('cart/clear', { disconnect: false })
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~theme/css/animations/transitions";
  .nunito {
    font-family: 'Nunito', sans-serif !important;
  }
  .minimum-order {
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #f7f7f7;
  }
  .minimum-order-text {
    color: red;
    font-size: 12px;
  }
  .clear-cart {
    justify-content: center;
    text-align: right;
    padding-top: 25px;
    font-size: 12px;
    color: #a6a8ab;
  }
  .mt2 {
    @media (max-width: 767px) {
      margin-top: 2px;
    }
  }
  .overlay-wrapper {
    height: 100%;
    width: 100%;
    height: 100%;
    width: 100%;
    background: #000;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
    opacity: 0.5;

  }
  .loader {
    width: 100px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    z-index: 999;
  }

  .back {
    background-color: #F7F7F7;
  }

  .pay {
    background-color: #E86026;
  }

  .amount-saved {
    display: inline-block;
    justify-content: center;
    text-align: center;
    background-color: #E86026;
    color: #FFFFFF;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 4px;
    margin-right: -2px;
    margin-top: 17px;
  }

  .saved-amount {
    color: #35BC6C;
  }

  .rupee-sign {
    font-size: 10px;
  }

  .hide-mobile {
    @media (max-width: 767px) {
      display: none;
    }
  }

  .hide-desktop {
    @media (min-width: 768px) {
      display: none;
    }
  }

  .cart-total {
    @media (max-width: 767px) {
      position: static;
    }
    padding-left: 15px;
    padding-right: 15px; 
  }

  .helvetica {
    font-family: Helvetica;
  }
  .close {
    i {
      opacity: 0.6;
    }
    &:hover,
    &:focus {
      i {
        opacity: 1;
      }
    }
  }
  @media (min-width: 767px) {
    .cart-item-title {
      position: absolute;
    }
    .back-icon {
      padding-top: 28px;
      padding-bottom: 20px;
    }
  }
  .mt0 {
    @media (max-width: 767px) {
      margin-top: 0;
    }
  }

  .clearcart {
    &-col {
      display: flex;
      align-self: center;
    }
  }

  .products {
    // padding-right: 40px;
    @media (max-width: 767px) {
      // padding: 30px 15px;
    }
  }

  .pb92 {
    margin-bottom: 92px;
  }
  .bottom-sticky-buttons {
    position: fixed;
    width: 100%;
    bottom: 0;
    margin-left: 0;
  }
  .cart-mobile-sticky-bottom {
    @media (max-width: 767px) {
      position: fixed;
      width: 100%;
      bottom: 6%;
      background-color: #fff;
      padding-top: 12px;
      padding-bottom: 14px;
      margin-left: 0px;
      box-shadow: 0px -2px 8px #0000001F;
      opacity: 1;
    }
  }

  .microcart {
    background: #fff;
    height: 100%
  }
  .actions {
    box-shadow: 2px 2px 5px 1px #e1e1e1;
    -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
    -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
    background-color: #fff;
    margin-left: 0px;
    margin-right: 0px;
    border-radius: 3px 3px 0 0;
    @media (max-width: 767px) {
      padding: 0 15px;
      box-shadow: none;
      border-bottom: 1px solid #D0D2D3;
    }
    .link {
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
        // padding: 20px 70px;
        &.checkout {
          margin-top: 55px;
          padding: 0;
        }
      }
    }
  }
  .actions-footer {
    background-color: #fff;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom:30px;
    border-radius: 3px 3px 0 0;
    @media (max-width: 767px) {
      padding: 0 15px;
    }
    .link {
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
        // padding: 20px 70px;
        &.checkout {
          margin-top: 55px;
          padding: 0;
        }
      }
    }
  }
  .cart-button {
    background-color: #fff;
    border-color: #f04d24cf;
    color: #f04d24cf;
    padding: 15px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 5px
  }

  .back-button {
    display: inline-block;
    color: #E86026;
    background-color: #F7F7F7;
    opacity: 1;
    padding: 16px 24px;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    border: none;
    font-family: 'Nunito', sans-serif !important;
  }

  .payment-button {
    background-color: #E86026;
    border-color: #E86026;
    color: #fff;
    padding: 16px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    border-width: 0px;
  }

  .checkout-button {
    background-color: #f04d24cf;
    border-color: #f04d24cf;
    color: #fff;
    padding: 15px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 5px;
    border: 2px solid #f04d24cf;
  }
  .summary {
    @media (max-width: 767px) {
      // padding:  0 15px;
      font-size: 12px;
    }
    @media (min-width: 768px) {
      bottom: 0;
      width: 100%; 
    }
    // padding: 0;
  }

  .summary-heading {
    @media (max-width: 767px) {
      font-size: 18px;
    }
  }

  .total-price-label {
    @media (max-width: 767px) {
      font-size: 16px;
      padding-left: 0px;
    }
  }

  .total-price-value {
    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  .delete-button {
    vertical-align: middle;
  }

  .coupon-wrapper {
    display: flex;

    .button-outline {
      text-transform: inherit;
      width: 50%;
    }

    .coupon-input {
      margin-right: 20px;
      width: 100%;
    }
  }

  .text {
    color: #4D4D4D;
    letter-spacing: 0px;
    font-size: 18px;
    display: inline-block;
    margin-left: 12px;
  }
  .count {
    color: #E86026;
    font-size: 18px;
    font-weight: 600;
  }
  .overlay {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 0;
    height: 100%;
    background:rgba(0, 0, 0, 0.4);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>