<template>
  <div>
    <header class="thank-you-title hide-mobile bg-cl-secondary pt20">
      <div class="container pb15">
        <breadcrumbs
          :with-homepage="true"
          :routes="[]"
          :active-route="this.$t('Order confirmation')"
        />
      </div>
    </header>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="col-md-12 order-confirmation justify-content-center align-self-center">
            <img src="/assets/thank-you-tick.png" height="66">
            <div class="thank-you-text mt5"> THANK YOU</div>
            <div class="thank-you-text"> for shopping from More Megastore</div>
          </div>
          <p class="order-number" v-if="OnlineOnly && lastOrderConfirmation.orderNumber" >
            ORDER ID #{{ lastOrderConfirmation.orderNumber }}
          </p>
          <p class="order-receipt">
            A copy of receipt sent to {{ checkoutPersonalEmailAddress }}
          </p>
        </div>
      </div>
      {{ myOrder }}
      <div class="row center-md">
        <div class="col-md-12 start-md mobile-bg-f7f7f7">
          <p class="sub-title">
            Delivering to
          </p>
        </div>
        <div class="col-md-12 start-md">
          <p class="delivery-details">
            <b>Address : </b><span v-if="shipping.apartmentNumber">{{ shipping.apartmentNumber }},</span> 
            <span v-if="shipping.streetAddress">{{ shipping.streetAddress }},</span>
            <span v-if="shipping.city">{{ shipping.city }},</span> 
            <span v-if="shipping.state">{{ shipping.state }},</span> 
            <span v-if="shipping.zipCode">{{ shipping.zipCode }}</span>
          </p>
          <p class="delivery-details">{{ shipping.firstName }} {{ shipping.lastName }} | {{ shipping.phoneNumber }}</p>
          <!--<p>
            <span>{{ getCountryName() }}</span>
          </p>-->
        </div>
      </div>
      <div class="row center-md">
        <div class="col-md-12 start-md mobile-bg-f7f7f7">
          <p class="sub-title">
            Purchased Items
          </p>
        </div>
        <div class="col-md-12 start-md">
          <product v-for="product in myOrderProducts" :key="product.server_item_id || product.id" :product="product" class="hide-mobile" />
          <product-mobile v-for="product in myOrderProducts" :key="product.server_item_id || product.id" :product="product" class="hide-desktop" />
        </div>

        <div class="col-md-12 start-md mobile-bg-f7f7f7">
          <p class="sub-title">
            Cart Details
          </p>
        </div>

        <div v-if="myOrderProducts && myOrderProducts.length" class="col-md-12 start-md cart-details-container">
          <div class="row cart-content">
            <div v-if="myOrderProducts.length == 1" class="col-md-8 col-xs-8 start-md content">
              Cart Amount | {{ amountSaved[2] }} Item
              <span v-if="amountSaved[0]" class="saved-amount"> <span class="pipe-char">|</span> Saved &#x20b9;{{ amountSaved[0] }}</span>
            </div>
            <div v-else class="col-md-8 col-xs-8 start-md content">
              Cart Amount | {{ amountSaved[2] }} Items
              <span v-if="amountSaved[0]" class="saved-amount"> <span class="pipe-char">|</span> Saved &#x20b9;{{ amountSaved[0] }}</span>
            </div>
            <div class="pl20 col-md-3 col-xs-4 end-xs center-md content">
              {{ amountSaved[1] | price(storeView) }}
            </div>
          </div>

          <div class="row cart-content">
            <div class="col-md-8 col-xs-6 start-md content">
              Shipping Charge
            </div>
            <div v-if="shippingMethods[0].amount && shippingMethods[0].amount!==0" class="pl20 col-md-3 col-xs-6 end-xs center-md content">
              {{ shippingMethods[0].amount | price(storeView) }}
            </div>
            <div v-else class="pl20 col-md-3 col-xs-6 end-xs center-md content">
              Free
            </div>
          </div>
          <div class="row">
            <div class="col-md-8 col-xs-6 start-md content weight-700 font-color-E86026">
              Grand total
            </div>
            <div class="pl20 col-md-3 col-xs-6 end-xs center-md content weight-700 font-color-E86026">
              {{ amountSaved[1] + shippingMethods[0].amount | price(storeView) }}
            </div>
          </div>
        </div>
      </div>
      <div class="row continue-shopping">
        <button-outline
          color="dark"
          @click.native="$router.push(localizedRoute('/'))"
          class="continue-shopping-button"
        >
          {{ $t('Continue shopping') }}
        </button-outline>
      </div>
    </div>
    <!--<div class="thank-you-content align-justify py40 pl20">
      <div class="container">
        <div class="row">
          <div class="col-md-6 pl20 pr20">
            <h3 v-if="OnlineOnly">
              {{ $t('Your purchase') }}
            </h3>
            <p v-if="OnlineOnly" v-html="this.$t('You have successfuly placed the order. You can check status of your order by using our <b>delivery status</b> feature. You will receive an order confirmation e-mail with details of your order and a link to track its progress.')" />
            <p v-if="OnlineOnly && lastOrderConfirmation.orderNumber" v-html="this.$t('The OrderNumber is {id}', { id: lastOrderConfirmation.orderNumber })" />

            <h4 v-if="OfflineOnly">
              {{ $t('You are offline') }}
            </h4>
            <p v-if="OfflineOnly && !isNotificationSupported">
              {{ $t('To finish the order just come back to our store while online. Your order will be sent to the server as soon as you come back here while online and then confirmed regarding the stock quantities of selected items') }}
            </p>
            <p v-if="OfflineOnly && isNotificationSupported && !isPermissionGranted">
              {{ $t("You can allow us to remind you about the order via push notification after coming back online. You'll only need to click on it to confirm.") }}
            </p>
            <p v-if="OfflineOnly && isNotificationSupported && !isPermissionGranted">
              {{ $t(`Or if you will stay on "Order confirmation" page, the order will be placed automatically without confirmation, once the internet connection will be back.`) }}
            </p>
            <p v-if="OfflineOnly && isNotificationSupported && isPermissionGranted">
              <strong>{{ $t('You will receive Push notification after coming back online. You can confirm the order by clicking on it') }}</strong>
            </p>
            <p v-if="!isPermissionGranted && isNotificationSupported">
              <button-outline color="dark" @click.native="requestNotificationPermission()">
                {{ $t('Allow notification about the order') }}
              </button-outline>
            </p>
            <p>
              <button-outline
                color="dark"
                @click.native="$router.push('/')"
              >
                {{ $t('Return to shopping') }}
              </button-outline>
            </p>
            <div id="thank-you-extensions" />
          </div>
          <div class="col-md-6 bg-cl-secondary thank-you-improvment">
            <h3>
              {{ $t('What we can improve?') }}
            </h3>
            <p class="mb25">
              {{ $t('Your feedback is important for us. Let us know what we could improve.') }}
            </p>
            <form @submit.prevent="sendFeedback">
              <base-textarea
                class="mb25"
                type="text"
                name="body"
                v-model="feedback"
                :placeholder="$t('Type your opinion')"
                :autofocus="true"
              />
              <button-outline color="dark">
                {{ $t('Give a feedback') }}
              </button-outline>
            </form>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Product from './Product'
import ProductMobile from './ProductMobile'
import Composite from '@vue-storefront/core/mixins/composite'
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
import VueOfflineMixin from 'vue-offline/mixin'
import { EmailForm } from '@vue-storefront/core/modules/mailer/components/EmailForm'
import { isServer } from '@vue-storefront/core/helpers'
import config from 'config'
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { MailerModule } from '@vue-storefront/core/modules/mailer'
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping'
import Checkout from '@vue-storefront/core/pages/Checkout'

export default {
  name: 'ThankYouPage',
  mixins: [Composite, VueOfflineMixin, EmailForm, PersonalDetails, CartSummary, Shipping],
  beforeCreate () {
    registerModule(MailerModule)
  },
  data () {
    return {
      feedback: ''
    }
  },
  computed: {
    ...mapGetters({
      isThankYouPage: 'checkout/isThankYouPage',
      totalQuantity: 'cart/getItemsTotalQuantity',
      totals: 'cart/getTotals',
    }),
    storeView () {
      return currentStoreView()
    },
    lastOrderConfirmation () {
      return this.$store.state.order.last_order_confirmation ? this.$store.state.order.last_order_confirmation.confirmation : {}
    },
    isNotificationSupported () {
      if (isServer || !('Notification' in window)) return false
      return 'Notification' in window
    },
    isPermissionGranted () {
      if (isServer || !('Notification' in window)) return false
      return Notification.permission === 'granted'
    },
    checkoutPersonalEmailAddress () {
      return this.$store.state.checkout.personalDetails.emailAddress
    },
    mailerElements () {
      return config.mailer.contactAddress
    },
    amountSaved () {
      let amountSaved = 0;
      let total = 0;
      let itemQuantity = 0;
      for(let product of this.myOrderProducts) {
        amountSaved = amountSaved + (product.original_price - product.price)*product.qty
        total = total + product.price*product.qty
        itemQuantity = itemQuantity + product.qty
      }
      const cartInfo = [amountSaved, total, itemQuantity]
      return cartInfo
    },
    myOrderProducts () {
      return this.$store.state.order.last_order_confirmation.order.products;
    }
  },
  methods: {
    requestNotificationPermission () {
      if (isServer) return false
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission()
      }
    },
    sendFeedback () {
      this.sendEmail(
        {
          sourceAddress: this.checkoutPersonalEmailAddress,
          targetAddress: this.mailerElements,
          subject: this.$t('What we can improve?'),
          emailText: this.feedback
        },
        this.onSuccess,
        this.onFailure
      )
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message,
        action1: { label: this.$t('OK') }
      })
      if (this.mailerElements.sendConfirmation) {
        this.sendEmail(
          {
            sourceAddress: this.mailerElements,
            targetAddress: this.checkoutPersonalEmailAddress,
            subject: this.$t('Confirmation of receival'),
            emailText: this.$t(`Dear customer,\n\nWe have received your letter.\nThank you for your feedback!`),
            confirmation: true
          }
        )
      }
    },
    onFailure (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message,
        action1: { label: this.$t('OK') }
      })
    }
  },
  watch: {
    isThankYouPage: function () {
      this.$store.dispatch('cart/clear', { sync: false }, { root: true });
    }
  },
  destroyed () {
    this.$store.dispatch('checkout/setThankYouPage', false)
  },
  components: {
    BaseTextarea,
    Breadcrumbs,
    ButtonOutline,
    Product,
    ProductMobile
  }
}
</script>

<style lang="scss">
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

  .mobile-bg-f7f7f7 {
    @media (max-width: 767px) {
      background-color: #f7f7f7;
    }
  }

  .font-color-E86026 {
    color: #E86026;
  }

  .thank-you-text {
    @media (max-width: 767px) {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0px;
      color: #4D4D4D;
      opacity: 1;
    }
  }
  .cart-details-container {
    margin-bottom: 50px;
  }
  .delivery-details {
    @media (max-width: 767px) {
      font-size: 14px;
      color: #58595B;
      opacity: 1;
    }
  }

  .cart-content {
    @media (max-width: 767px) {
      font-size: 14px;
      color: #58595B;
      opacity: 1;
    }
  }

  .continue-shopping-button {
    border-radius: 5px;
    background-color: #f04d24cf;
    border: 1px solid #f04d24cf;
    color: #fff;
    @media (max-width: 767px) {
      color: #fff;
      opacity: 1;
      width: 100%;
      text-transform: uppercase;
      background-color: #EC6D34;
      font-size: 14px;
    }
    font-family: 'Nunito', sans-serif !important;
  }

  .sub-title {
    font-weight: 600;
    font-size: 18px;
    color: #f04d24cf;
    @media (max-width: 767px) {
      color: #58595B;
      margin: 12px 0px 6px 0px;
      font-size: 14px;
      background-color: #f7f7f7;
    }
  }

  .continue-shopping {
    @media (max-width: 767px) {
      background-color: #EC6D34;
      position: fixed;
      bottom: 0;
      display: block;
      width: 100%;
      z-index: 2;
    }
  }

  .content {
    margin: 12px 0;
  }

  .saved-amount {
    color: #35BC6C;
  }

  .order-confirmation {
    font-size: 28px;
    text-align: center;
    margin: 12px 0px;
  }
  .order-number {
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    margin: 0 0 3px 0;
    letter-spacing: 0px;
    color: #4D4D4D;
    opacity: 1;
  }
  .order-receipt {
    text-align: center;
    font-size: 12px;
    letter-spacing: 0px;
    color: #4D4D4D;
    opacity: 1;
    margin-top: 0;
  }
  .thank-you-content {
    padding-left: 0;

    p {
      line-height: 25px
    }

    @media (min-width: 64em) {
      h4 {
        font-size: 24px;
      }
    }
  }
  .thank-you-improvment {
    padding: 0 20px 15px;

    @media (min-width: 64em) {
      padding: 0 40px 10px;
    }

    textarea {
      min-height: 100px;
    }
  }
</style>
