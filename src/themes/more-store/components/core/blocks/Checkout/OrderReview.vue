<template>
  <div class="order-review">
    <div :class="{'row pl20 checkout-step-header' : isActive }" class="row pl20 checkout-step-header-inactive">
      <!-- <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{ 'bg-cl-th-accent' : isActive || isFilled, 'bg-cl-tertiary' : !isFilled && !isActive }"
        >
          {{ (isVirtualCart ? 3 : 4) }}
        </div>
      </div> -->
      <div class="col-xs-11 col-sm-9 col-md-11 mt20">
        <div class="row mb15">
          <div class="col-md-12" :class="{ 'cl-bg-tertiary' : !isFilled && !isActive }">
            <h3 class="m0 mb5 helvetica">
              {{ $t('Review order') }}
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20 pr20" v-show="isActive">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div id="checkout-order-review-additional-container">
          <div id="checkout-order-review-additional">
&nbsp;
          </div>
        </div>
        <div class="row mb15 mt20">
          <div class="col-xs-12">
            <p class="h4 helvetica">
              {{ $t('Please check if all data are correct') }}
            </p>
            <div class="row">
              <div class="cartsummary-wrapper">
                <cart-summary />
              </div>
              <base-checkbox
                class="col-xs-11 col-sm-12 col-md-8 p15 mb35 ml10 helvetica"
                id="acceptTermsCheckbox"
                @blur="$v.orderReview.terms.$touch()"
                v-model="orderReview.terms"
                :validations="[{
                  condition: !$v.orderReview.terms.sameAs && $v.orderReview.terms.$error,
                  text: $t('Field is required')
                }]"
              >
                {{ $t('I agree to') }}
                <span
                  class="link pointer"
                  @click.prevent="$bus.$emit('modal-toggle', 'modal-terms')"
                >
                  {{ $t('Terms and conditions') }}
                </span>
              </base-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-show="isActive">
      <div class="hidden-xs col-sm-2 col-md-1" />
      <div class="col-xs-12 col-sm-9 col-md-11 mb30">
        <div class="row">
          <div class="col-xs-12 col-md-8 px20">
            <slot name="placeOrderButton">
              <button-full
                @click.native="placeOrder"
                data-testid="orderReviewSubmit"
                class="submit-details place-order-btn no-outline button-full block w-100 px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white helvetica fs-medium mt20 router-link-active no-underline pointer align-center border-box"
                :disabled="$v.orderReview.$invalid"
              >
                {{ $t('Place the order') }}
              </button-full>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <modal name="modal-terms">
      <p slot="header">
        {{ $t('Terms and conditions') }}
      </p>
      <div slot="content helvetica">
        <p>
          This website ("website") is operated by Luma Inc., which includes Luma stores, and Luma Private Sales. This privacy policy only covers information collected at this website, and does not cover any information collected offline by Luma. All Luma websites are covered by this privacy policy.
        </p>
        <h2>
          Luma Security
        </h2>
        <p>
          Personal information provided on the website and online credit card transactions are transmitted through a secure server. We are committed to handling your personal information with high standards of information security. We take appropriate physical, electronic, and administrative steps to maintain the security and accuracy of personally identifiable information we collect, including limiting the number of people who have physical access to our database servers, as well as employing electronic security systems and password protections that guard against unauthorized access.
        </p>
        <h2>
          Luma Privacy Policy
        </h2>
        <p>
          To help us achieve our goal of providing the highest quality products and services, we use information from our interactions with you and other customers, as well as from other parties. Because we respect your privacy, we have implemented procedures to ensure that your personal information is handled in a safe, secure, and responsible manner. We have posted this privacy policy in order to explain our information collection practices and the choices you have about the way information is collected and used.
        </p>
        <p>
          As we continue to develop the Luma website and take advantage of advances in technology to improve the services we offer, this privacy policy likely will change. We therefore encourage you to refer to this policy on an ongoing basis so that you understand our current privacy policy.
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { sameAs } from 'vuelidate/lib/validators'
import Composite from '@vue-storefront/core/mixins/composite'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonFull from 'theme/components/theme/ButtonFull'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'
import Modal from 'theme/components/core/Modal'
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { registerModule } from '@vue-storefront/core/lib/modules'

export default {
  components: {
    BaseCheckbox,
    ButtonFull,
    CartSummary,
    Modal
  },
  mixins: [OrderReview, Composite],
  validations: {
    orderReview: {
      terms: {
        sameAs: sameAs(() => true)
      }
    }
  },
  beforeCreate () {
    registerModule(OrderModule)
  },
  methods: {
    onSuccess () {
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .link {
    text-decoration: underline;
  }

  .cartsummary-wrapper {
    @media (min-width: 767px) {
      display: none;
    }
  }
  checkout-order-review-additional {
    background: #fff;
  }

.helvetica {
  font-family: Helvetica;
}
.checkout-step-header-inactive {
   box-shadow: 2px 2px 5px 1px #e1e1e1;
  -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
  -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  background-color: #fff;
  color: #000;
  margin-left: 0px;
  margin-right: 0px;
  border-radius: 3px 3px 0 0;
}
.submit-details {
  background: #fff;
  border-color: #f04d24cf;
  border-width: 3px;
  color: #f04d24cf;
  border-radius: 8px;
  border-style: solid;
}
.submit-details:hover {
  background: #f04d24cf;
  border-color: #f36e4d;
  color: #fff;
}
.order-review {
box-shadow: 2px 2px 5px 1px #e1e1e1;
-moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
-webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
background-color: #fff;
margin-top:10px;
border-radius: 0 0 3px 3px;
}
.checkout-step-header {
  box-shadow: 2px 2px 5px 1px #e1e1e1;
  -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
  -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  background-color: #f04d24cf;
  color: #fff;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom:30px;
  border-radius: 3px 3px 0 0;
}
</style>
