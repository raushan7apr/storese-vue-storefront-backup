 
<template>
  <div id="checkout">
    <div class="checkout-page-mobile">
      <!-- <img data-v-8b7e55fa="" src="/assets/loader.gif" class="loader"> -->
      <mobile-checkout :is-active="true"/>
    </div>
    <div class="checkout-page">
      <div class="container-fluid">
        <div class="row" v-show="!isThankYouPage">
          <div class="col-sm-7 col-xs-12 pb70">
            <div class="checkout-title py5 px20">
              <h1>
                {{ $t('Checkout') }}
              </h1>
            </div>
            <personal-details
              class="line relative ml5 mr5"
              :is-active="activeSection.personalDetails"
              :focused-field="focusedField"
            />
            <shipping class="line relative ml5 mr5" :is-active="activeSection.shipping" v-if="!isVirtualCart" />
            <payment class="line relative ml5 mr5" :is-active="activeSection.payment" />
            <order-review class="line relative ml5 mr5" :is-active="activeSection.orderReview" />
            <div id="custom-steps" />
          </div>
          <div class="hidden-xs col-sm-5">
            <cart-summary />
          </div>
        </div>
      </div>
      <thank-you-page style="background-color: #fff" v-show="isThankYouPage" />
    </div>
  </div>
</template>

<script>
import Checkout from '@vue-storefront/core/pages/Checkout'
import MobileCheckout from 'theme/components/core/blocks/Checkout/MobileCheckout'
import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetails'
import Shipping from 'theme/components/core/blocks/Checkout/Shipping'
import Payment from 'theme/components/core/blocks/Checkout/Payment'
import OrderReview from 'theme/components/core/blocks/Checkout/OrderReview'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { CartService } from '@vue-storefront/core/data-resolver'

export default {
  components: {
    PersonalDetails,
    MobileCheckout,
    Shipping,
    Payment,
    OrderReview,
    CartSummary,
    ThankYouPage
  },
  data () {
    return {
      // regionFlag: false
    }
  },
  mixins: [Checkout],
  beforeCreate () {
    registerModule(OrderModule)
  },
  async created () {
    // let method = {
    //   method_title: 'Free shipping',
    //   method_code: 'freeshipping',
    //   carrier_code: 'freeshipping',
    //   amount: 0,
    //   price_incl_tax: 0,
    //   default: true,
    //   offline: true
    // }
    // try {
    //   const response = await CartService.getShippingInfo()
    //     //{ 0 => FreeShipping, 1 => TableRate, 2 => Flatrate }
    //     let shippingMethodFinal = 1;
    //     if (!response.result.hasOwnProperty('message')) {
    //       // store zipcodes and regions in session
    //       console.log(response);
    //       sessionStorage.setItem('regions', JSON.stringify(response.result.regions))
    //       sessionStorage.setItem('zipcodes', response.result.zipcodes)

    //       let delivery_charges = {}
    //       for(let shipping_method of response.result.shipping_methods) {
    //         if(shipping_method.carrier_code === 'tablerate') {
    //           shippingMethodFinal = 1;
    //           delivery_charges[shipping_method.order_subtotal] = shipping_method
    //         }
    //       }
    //       sessionStorage.setItem('delivery_charges', JSON.stringify(delivery_charges))
    //       // loop through shipping methods and add
    //       for (let i = 0; i < response.result.shipping_methods.length; i++) {
    //         if (response.result.shipping_methods[i].method_code === 'flatrate') {
    //           shippingMethodFinal = 2;
    //           method = {
    //             method_title: response.result.shipping_methods[i].method_title,
    //             method_code: response.result.shipping_methods[i].method_code,
    //             carrier_code: response.result.shipping_methods[i].carrier_code,
    //             amount: response.result.shipping_methods[i].amount,
    //             price_incl_tax: response.result.shipping_methods[i].price_incl_tax,
    //             default: true,
    //             offline: true
    //           }
    //         }
    //       }
    //     }
    //     if (shippingMethodFinal !== 1) {
    //       this.$store.dispatch('checkout/addShippingMethod', method, { root: true })
    //     }
    //     this.regionFlag = true
    //     console.log(sessionStorage.getItem('regions'))
    // } catch (error) {
    //   console.log(error)
    // }
  },
  mounted () {
    this.$store.commit('ui/setMicrocart', false)
    this.$store.commit('ui/setSidebar', false)
  },
  methods: {
    notifyEmptyCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Shopping cart is empty. Please add some products before entering Checkout'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyOutStock (chp) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: chp.name + this.$t(' is out of stock!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNotAvailable () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Some of the ordered products are not available!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyStockCheck () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Stock check in progress, please wait while available stock quantities are checked'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~theme/css/base/text';
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $bg-secondary: color(secondary, $colors-background);
  $color-tertiary: color(tertiary);
  $color-secondary: color(secondary);
  $color-error: color(error);
  $color-white: color(white);
  $color-black: color(black);
  .helvetica {
    font-family: Helvetica;
  }
  h1 {
    font-family: 'Nunito', sans-serif !important;
  }
  #checkout {
    background: #f7f7f7;
    .number-circle {
      width: 35px;
      height: 35px;
      @media (max-width: 768px) {
        width: 25px;
        height: 25px;
        line-height: 25px;
      }
    }
    .radioStyled {
      display: block;
      position: relative;
      padding-left: 25px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 14px;
      line-height: 30px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }
      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        border: 1px solid $bg-secondary;
        &:after {
          content: "";
          position: absolute;
          display: none;
          top: 3px;
          left: 3px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: $color-secondary;
        }
      }
      input:checked ~ .checkmark:after {
        display: block;
      }
    }
  }
  .line {
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 37px;
      z-index: -1;
      width: 1px;
      height: 100%;
      background-color: $bg-secondary;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  .checkout-title {
    @media (max-width: 767px) {
      // background-color: $bg-secondary;
      margin-bottom: 25px;
      h1 {
        font-size: 36px;
        font-family: 'Nunito', sans-serif !important;
      }
    }
  }
  @media (min-width: 768px) {
    .checkout-page-mobile {
      display: none;
    }
    .checkout-page {
      display: block;
    }
  }
  @media (max-width: 768px) {
    .checkout-page {
      display: none;
    }
    .checkout-page-mobile {
      display: block;
    }
    #checkout {
      padding-top: 100px;
    }
  }
  .loader {
    width: 100px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -50px;
  }

</style>