<template>
  <div id="mobile-checkout helvetica">
    <section class="multi_step_form" v-show="!isThankYouPage">  
    
        <div id="msform"> 
          <ul id="progressbar">
            <li  @click="changeStepShipping" class="active">Shipping</li>  
            <li :class="{'active' : step_visible }">Review & Pay</li> 
          </ul>
        </div>
        <div class="product-in-cart" @click="showProducts">
          <span class="order-items">Order Summary | {{ displayItem }} {{totalQuantity}} 
            <i class="material-icons show-items-arrow"> keyboard_arrow_down </i> 
          </span> 
          <span class="order-total"> {{ totals[0].value | price(storeView) }}</span>
        </div>
        <div v-if="visibleProducts" class="col-md-12 start-md">
          <product-mobile v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" class="hide-desktop" />
        </div>
        <div id="msform"> 
        <div v-if="!step_visible">
            <div class="row mt20">
                <div class="hidden-xs col-sm-2 col-md-1" />
                    <div class="col-xs-12 col-sm-9 col-md-10">
                        <div class="row">
                          <h5 class="col-xs-12 shipping-header-text">
                            {{ $t('Shipping Address') }}
                          </h5>
                          <div class="row px20">
                            <base-input-mobile
                                class="col-xs-6 col-md-6"
                                type="text"
                                :autofocus="true"
                                name="first-name"
                                :placeholder="$t('First name *')"
                                v-model.trim="shipping.firstName"
                                @blur="$v.shipping.firstName.$touch()"
                                autocomplete="given-name"
                                :validations="[
                                {
                                    condition: $v.shipping.firstName.$error && !$v.shipping.firstName.required,
                                    text: $t('Field is required')
                                }
                                ]"
                            />

                            <base-input-mobile
                              class="col-xs-6 col-md-6"
                              type="text"
                              name="last-name"
                              :placeholder="$t('Last name *')"
                              v-model.trim="shipping.lastName"
                              @blur="$v.shipping.lastName.$touch()"
                              autocomplete="family-name"
                              :validations="[{
                                condition: $v.shipping.lastName.$error && !$v.shipping.lastName.required,
                                text: $t('Field is required')
                              }]"
                            />

                            <base-input-mobile
                              class="col-xs-12"
                              type="email"
                              name="email-address"
                              :placeholder="$t('Email address *')"
                              v-model="shipping.emailAddress"
                              @blur="$v.shipping.emailAddress.$touch()"
                              autocomplete="email"
                              :validations="[
                                {
                                  condition: $v.shipping.emailAddress.$error && !$v.shipping.emailAddress.required,
                                  text: $t('Field is required')
                                },
                                {
                                  condition: !$v.shipping.emailAddress.email && $v.shipping.emailAddress.$error,
                                  text: $t('Please provide valid e-mail address.')
                                }
                              ]"
                            />
                            <base-input-mobile
                              class="col-xs-12"
                              type="text"
                              name="street-address"
                              :placeholder="$t('Street name *')"
                              v-model.trim="shipping.streetAddress"
                              @blur="$v.shipping.streetAddress.$touch()"
                              autocomplete="address-line1"
                              :validations="[{
                                condition: $v.shipping.streetAddress.$error && !$v.shipping.streetAddress.required,
                                text: $t('Field is required')
                              }]"
                            />
                            <base-input-mobile
                                class="col-xs-12"
                                type="text"
                                name="apartment-number"
                                :placeholder="$t('House/Apartment number *')"
                                v-model.trim="shipping.apartmentNumber"
                                @blur="$v.shipping.apartmentNumber.$touch()"
                                autocomplete="address-line2"
                                :validations="[{
                                  condition: $v.shipping.apartmentNumber.$error && !$v.shipping.apartmentNumber.required,
                                  text: $t('Field is required')
                                }]"
                              />

                            <base-input-mobile
                              class="col-xs-12 col-sm-6"
                              type="text"
                              name="city"
                              :placeholder="$t('City *')"
                              v-model.trim="shipping.city"
                              @blur="$v.shipping.city.$touch()"
                              autocomplete="address-level2"
                              :validations="[
                                {
                                  condition: $v.shipping.city.$error && !$v.shipping.city.required,
                                  text: $t('Field is required')
                                },
                                {
                                  condition: $v.shipping.city.$error && $v.shipping.city.required,
                                  text: $t('Please provide valid city name')
                                }
                              ]"
                            />

                            <base-select-mobile
                              class="col-xs-6 col-sm-6"
                              name="State" 
                              :options="stateOptions"
                              :selected="shipping.region_id"
                              :placeholder="$t('State / Region *')"
                              :validations="[
                                {
                                  condition: $v.shipping.region_id.$error && !$v.shipping.region_id.required,
                                  text: $t('Field is required')
                                }
                              ]"
                              v-model="shipping.region_id"
                              autocomplete="region-name"
                              @blur="$v.shipping.region_id.$touch()"
                              @change.native="$v.shipping.region_id.$touch(); changeRegion();"
                            />

                            <base-select-mobile
                              class="col-xs-6 col-sm-6"
                              name="Country"
                              :options="countryOptions"
                              :selected="getCountry"
                              placeholder="Country"
                              :validations="[
                                {
                                  condition: $v.shipping.country.$error && !$v.shipping.country.required,
                                  text: $t('Field is required')
                                }
                              ]"
                              v-model="shipping.country"
                              autocomplete="country-name"
                              @blur="$v.shipping.country.$touch()"
                            />
                            <base-input-mobile
                              class="col-xs-12 col-sm-6"
                              type="text"
                              name="zip-code"
                              :placeholder="$t('Zip-code *')"
                              v-model.trim="shipping.zipCode"
                              @blur="$v.shipping.zipCode.$touch()"
                              autocomplete="postal-code"
                              :validations="[
                                {
                                  condition: $v.shipping.zipCode.$error && !$v.shipping.zipCode.required,
                                  text: $t('Field is required')
                                },
                                {
                                  condition: !$v.shipping.zipCode.minLength,
                                  text: $t('Name must have at least 3 letters.')
                                },
                                {
                                  condition: !zipCodeOptions,
                                  text: $t('Invalid zip-code.')
                                }
                              ]"
                            />


                            <base-input-mobile
                              class="col-xs-12"
                              type="number"
                              name="phone-number"
                              :placeholder="$t('Phone Number *')"
                              @blur="$v.shipping.phoneNumber.$touch()"
                              :validations="[
                                {
                                  condition: $v.shipping.phoneNumber.$error && !$v.shipping.phoneNumber.required,
                                  text: $t('Field is required')
                                },
                                {
                                  condition: !$v.shipping.phoneNumber.minLength,
                                  text: $t('Phone number must be 10 digits')
                                },
                                {
                                  condition: !$v.shipping.phoneNumber.maxLength,
                                  text: $t('Phone number must be 10 digits')
                                }
                              ]"
                              v-model.trim="shipping.phoneNumber"
                              autocomplete="tel"
                            />
                          </div>
                          <h5 class="col-xs-12 shipping-method-header-text">
                            {{ $t('Shipping method') }}
                          </h5>
                          <div v-for="(method, index) in shippingMethods" :key="index" class="col-md-12 shipping-radio shipping-header-description">
                            <input
                              type="radio"
                              :id="'radio_id' + index"
                              class="radio-input"
                              :value="method.method_code"
                              name="shipping-method"
                              v-model="shipping.shippingMethod"
                              @change="$v.shipping.shippingMethod.$touch(); changeShippingMethod();"
                            >
                            <label :for="'radio_id' + index" class="radioStyled">
                              <span class="shipping-title"> {{ method.method_title }} </span>
                              <span class="shipping-amount"> {{ method.amount | price(storeView) }} </span>
                              <span class="checkmark" />
                            </label>
                          </div>
                          <span class="validation-error" v-if="$v.shipping.shippingMethod.$error && !$v.shipping.shippingMethod.required">
                            {{ $t('Field is required') }}
                          </span>
                        </div>
                      </div>
                     </div>
        <!-- <shipping class="line relative ml5 mr5" :is-active="activeSection.shipping" v-if="!isVirtualCart" /> -->
                    </div>
                    <div  v-if="step_visible">
                      <div class="payment-method">

                        <div class="col-xs-12 payment-method-header-text">
                          <h5>
                            {{ $t('Payment Method') }}
                          </h5>
                        </div>
                        <div v-for="(method, index) in paymentMethods" :key="index" class="col-md-12 payment-radio">
                          <div class="radio-container">
                          <input
                            type="radio"
                            :id="'radio_id' + index"
                            :value="method.code"
                            class="radioBoxStyle"
                            name="payment-method"
                            checked
                            v-model="payment.paymentMethod"
                            @change="$v.payment.paymentMethod.$touch(); changePaymentMethod();"
                          />
                          <label :for="'radio_id' + index" class="radioStyled"> {{ method.title ? method.title : method.name }}
                            <span class="checkmark" />
                          </label>
                          </div>
                          <!-- <hr class="payment-rule-style"/> -->
                        </div>
                      </div>
                      <div class="shipping-address-verify">
                        <div class="col-xs-12 shipping-address-header-text">
                          <h5>
                            {{ $t('Shipping Address') }}
                          </h5>
                        </div>
                        <div class="shipping-address">
                          <span class="user-name">
                            {{personalDetails.firstName}} {{personalDetails.lastName}}, <br />
                          </span>
                          <span class="user-address">
                          {{shipping.apartmentNumber}}, {{shipping.streetAddress}},<br />
                          {{shipping.zipCode}} | {{shipping.state}} {{getState}} | {{shipping.country}},<br />
                          {{personalDetails.emailAddress}} | {{shipping.phoneNumber}}<br />
                          </span>
                        </div>
                      <span class="validation-error" v-if="!$v.payment.paymentMethod.required">{{ $t('Field is required') }}</span>
                      <!-- <base-checkbox
                          class="col-xs-11 col-sm-12 col-md-8 p15 mb35 ml10 helvetica hidden"
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
                        </base-checkbox> -->
                    </div>
                  </div>
                  <div class="place-order">
                    <button :disabled="$v.shipping.$invalid || !zipCodeOptions" v-if="!step_visible" @click="changeStep" class="checkout-button place-order-button">Next</button>
                    <button  :disabled="$v.payment.$invalid" 
                    v-else class="checkout-button place-order-button" @click="checkoutStep2">Place Order | 
                      <span v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total' && segment.code !== 'tax'">
                        {{ totals[0].value + shippingMethods[0].amount | price(storeView) }}
                      </span>
                    </button>
                  </div>
                    <!-- <button @click.native="sendDataToCheckout" class="checkout-button">Next</button> -->
                </div>  
              </section> 
              <thank-you-page style="background-color: #fff" :is-active="isThankYouPage" v-show="isThankYouPage" />
          <!-- End Multi step form -->   
              <!-- <div class="container-fluid">
                <div class="row" v-show="!isThankYouPage">
                  <div class="col-sm-7 col-xs-12 pb70">
                    <div class="checkout-title py5 px20">
                      <h1 class="helvetica">
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
              <thank-you-page style="background-color: #fff" v-show="isThankYouPage" /> -->
  </div>
</template>

<script>
import Checkout from '@vue-storefront/core/pages/Checkout'
import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators'
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators'
import Composite from '@vue-storefront/core/mixins/composite'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import BaseSelectMobile from 'theme/components/core/blocks/Form/BaseSelectMobile'
import { mapGetters } from 'vuex';
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary'
import ProductMobile from './ProductMobile'

import {PersonalDetails} from '@vue-storefront/core/modules/checkout/components/PersonalDetails'
import {Shipping} from '@vue-storefront/core/modules/checkout/components/Shipping';
import {Payment} from '@vue-storefront/core/modules/checkout/components/Payment'
import {OrderReview} from '@vue-storefront/core/modules/checkout/components/OrderReview'
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import BaseInputMobile from 'theme/components/core/blocks/Form/BaseInputMobile'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
// import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
export default {
  name: 'MobileCheckout',
  data () {
    return {
      step_visible: false,
      visibleProducts: false,
      selectedValue: 'Country'
    }
  },
  components: {
    CartSummary,
    ThankYouPage,
    BaseInputMobile,
    BaseSelectMobile,
    BaseCheckbox,
    ProductMobile
  },
  mixins: [Payment,PersonalDetails,OrderReview,Shipping,CartSummary,Composite],
  beforeCreate () {
    registerModule(OrderModule)
  },
  validations: {
    personalDetails: {
      firstName: {
        required,
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      }
    },
    password: {
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      sameAs: sameAs(() => true)
    },
    shipping: {
      country: {
        required
      },
      region_id: {
        required
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      apartmentNumber: {
        required,
        unicodeAlphaNum
      },
      firstName: {
        required,
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      },
      shippingMethod: {
        required
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      phoneNumber: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      city: {
        required,
        unicodeAlpha
      }
    },
    payment: {
          paymentMethod: {
            required
          }
        }
    // orderReview: {
    //   terms: {
    //     sameAs: sameAs(() => true)
    //   }
    // }
  },
  computed: {
    ...mapGetters({
        isThankYouPage: 'checkout/isThankYouPage',
        totalQuantity: 'cart/getItemsTotalQuantity',
        totals: 'cart/getTotals',
    }),
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    },
    stateOptions () {
      return JSON.parse(sessionStorage.getItem('regions')).map((item) => {
        return {
          value: item.id.toString(),
          label: item.name
        }
      })
    },
    getState() {
      return (JSON.parse(sessionStorage.getItem('regions')).map((item) => {
        console.log(this.shipping.region_id)
        if(item.id === this.shipping.region_id)
          return (item.name)
      }))[0]
    },
    storeView () {
      return currentStoreView()
    },
    zipCodeOptions () {
      for (let i = 0; i < sessionStorage.getItem('zipcodes').split(',').length; i++) {
        if (sessionStorage.getItem('zipcodes').split(',')[i] === this.shipping.zipCode) {
          return true
        }
      }
      if (this.shipping.zipCode=='')
        return true
      return false
      // return this.shipping_info.zipcodes.includes(this.shipping.zipCode) && this.shipping.zipCode.length === 6
    },
    displayItem () {
      if(this.totalQuantity > 1) {
        return "Items";
      } else {
        return "Item";
      }
    },
    getCountry() {
      this.shipping.country = this.countryOptions[0].value
      return(this.countryOptions[0].value)
    },
  },
  beforeCreate () {
    registerModule(OrderModule)
  },
  mounted () {
    this.shipping.region_id = ''
    this.$store.commit('ui/setMicrocart', false)
    this.$store.commit('ui/setSidebar', false)
  },
  
  methods: {
      
    showProducts () {
      this.visibleProducts = !this.visibleProducts
    },
    checkoutStep2 () {
      this.sendShippingDataToCheckout()
      this.payment.apartmentNumber = this.shipping.apartmentNumber
      this.payment.city = this.shipping.city
      this.payment.country = this.shipping.country
      this.payment.firstName = this.shipping.firstName
      this.payment.lastName = this.shipping.lastName
      this.payment.phoneNumber = this.shipping.phoneNumber
      this.payment.region_id = this.shipping.region_id
      this.payment.shippingCarrier = this.shipping.shippingCarrier
      this.payment.shippingMethod = this.shipping.shippingMethod
      this.payment.state = this.shipping.state
      this.payment.streetAddress = this.shipping.streetAddress
      this.payment.zipCode = this.shipping.zipCode
      this.sendPaymentDataToCheckout()
      this.orderReview.terms = true
      this.placeOrder()
    },
    changeStepShipping () {
      this.step_visible = false
    },
    changeStep () {
      this.personalDetails.firstName = this.shipping.firstName
      this.personalDetails.lastName = this.shipping.lastName
      this.personalDetails.emailAddress = this.shipping.emailAddress
      this.sendPersonalDataToCheckout()
      this.step_visible = !this.step_visible
    },
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
/*font Variables*/ 
$roboto: 'Roboto', sans-serif; 
/*Color Variables*/ 
$bc: #f04d24cf;
$heding: #405867; 
$pfont: #5f6771;

// Mixins
@mixin transition($property: all, $duration: 300ms, $animate: linear, $delay:0s){
    transition: $property $duration $animate $delay; 
}  

// Placeholder Mixins
@mixin placeholder {
    &.placeholder { @content; }
    &:-moz-placeholder { @content; }
    &::-moz-placeholder { @content; }
    &::-webkit-input-placeholder { @content; }
}

// Font family link
@import url('https://fonts.googleapis.com/css?family=Roboto:300i,400,400i,500,700,900');
.shipping-method-header-text {
    text-align: left;
    margin: 0px;
    background: #f6f9fb;
    height: 43px;
    padding-left: 24px;
    padding-top: 14px;
    color: #58595B;
}
.payment-method-header-text {
    background: #f6f9fb;
    height: 40px;
    margin: -2px 0px -7px;
    padding: 0px 16px;
    color: #58595B;
}
.payment-method-header-text h5 {
  color: #4D4D4D;
  font-size:13.4px;
}
.shipping-address-verify {
  background: #f6f9fb;
  text-align: left;
  margin-bottom: 50px;
}
.user-name {
  font-weight: 300;
  font-weight: 500;
  color: #58595B;
  line-height: 44px;
  font-size:17px;
}
.user-address {
  color: #58595B;
  font-size: 14px;

}
.show-items-arrow {
  position: absolute;
  line-height: 43px;
  padding-left: 10px;
}
button:disabled,
button[disabled]{
  background-color: #cccccc;
  color: #fff;
}
.shipping-address {
     padding: 2px 25px 13px;
    background: #fff;
    margin-bottom: 106px;
}
.shipping-radio input[type="radio"] {
	display: none;
}
.shipping-radio label {
	position: relative;
	// display: inline-block;
	padding: 3px 3px 3px 20px;
	cursor: pointer;
}
.shipping-radio label::before,
.shipping-radio label::after {
	position: absolute;
	content: '';
	top: 50%;
	border-radius: 100%;
	-webkit-transition: all .2s;
	transition: all .2s;
}
.shipping-radio label::before {
	left: 0;
	width: 14px;
	height: 14px;
	margin-top: -8px;
	background: #f3f3f3;
	border: 1px solid #ccc;
}
.shipping-radio label:hover::before {
	background: #fff;
}
// .payment-rule-style {
//     color: #f6f9fb;
//     border-color: #f6f9fb;
// }
// .payment-rule-style:last-child {
//   display: none;
// }
.radio-container {
  height: 0px;
  margin-top: 0px;
  padding: 6px 20px 0px;
  margin-bottom: 28px;
}
.shipping-address-header-text {
  padding: 1px 16px 0px;
  color: #58595B;
}
.shipping-radio label::after {
	opacity: 0;
	left: 4px;
	width: 8px;
	height: 8px;
	margin-top: -4px;
	background: #f04d24cf;
	-webkit-transform: scale(2);
	transform: scale(2);
}
.shipping-radio input[type="radio"]:checked + label::before {
	background: #fff;
	border: 1px solid #f04d24cf;
}
.shipping-radio input[type="radio"]:checked + label::after {
	opacity: 1;
	-webkit-transform: scale(1);
	transform: scale(1);
}
.shipping-header-text {
  text-align: left;
  margin: 0px 0px 10px;
  background: #f6f9fb;
  height: 30px;
  padding-left: 24px;
  text-align: left;
  margin: -5px 0px 10px;
  color: #58595B;
}
.shipping-address-header-text h5 {
    margin-bottom: 15px;
}

.shipping-title {
  text-align: left;
}
.shipping-amount {
    float: right;
}
.shipping-header-description {
  text-align: left;
  padding: 10px 25px;
  margin-bottom: 50px;
}

.payment-method {
  text-align: left;
  // padding: 0px 15px 15px;
}
.payment-radio {
  padding-top: 12px;
  padding-bottom: 12px;
  background: #fff;
  border-bottom: 1px solid #c4c5c5;
}
.payment-radio input[type="radio"] {
	display: none;
}
.payment-radio label {
	position: relative;
	// display: inline-block;
	padding: 3px 3px 3px 20px;
	cursor: pointer;
  color: #4D4D4D;
    font-size: 15px;
}
.payment-radio label::before,
.payment-radio label::after {
	position: absolute;
	content: '';
	top: 50%;
	border-radius: 100%;
	-webkit-transition: all .2s;
	transition: all .2s;
}
.payment-radio label::before {
	left: 0;
	width: 14px;
	height: 14px;
	margin-top: -8px;
	background: #f3f3f3;
	border: 1px solid #ccc;
}
.payment-radio label:hover::before {
	background: #fff;
}
.payment-radio label::after {
	opacity: 0;
	left: 4px;
	width: 8px;
	height: 8px;
	margin-top: -4px;
	background: #f04d24cf;
	-webkit-transform: scale(2);
	transform: scale(2);
}
.payment-radio input[type="radio"]:checked + label::before {
	background: #fff;
	border: 1px solid #f04d24cf;
}
.payment-radio input[type="radio"]:checked + label::after {
	opacity: 1;
	-webkit-transform: scale(1);
	transform: scale(1);
}
.product-in-cart {
  background: #fff;
  height: 40px;
  line-height: 45px;
  padding: 0px 15px 2px 15px;
}
.order-items {
  text-align: left;
  font-weight: 600;
}
.place-order-button {
  color: #fff;
  opacity: 1;
  width: 100%;
  text-transform: uppercase;
  background-color: #EC6D34;
  font-size: 14px;
}
.place-order {
  background-color: #EC6D34;
  position: fixed;
  bottom: 0;
  display: block;
  width: 100%;
  z-index: 2;
}
.order-total {
  float: right;
  color: #f04d24cf;
}
.shipping-header-description {
    text-align: left;
}
.radio-input {
    height: 12px;
}
.multi_step_form{
    background: #f6f9fb;
    display: block;
    overflow: hidden;
    #msform {
        text-align: center;
        position: relative;
        margin: 0 auto;
        background: #ffffff;
        z-index: 1;
        
        #progressbar {
            margin-bottom: 15px;
            overflow: hidden;  
            box-shadow: 2px 2px 5px 1px #e1e1e1;
            -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
            -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
            /* background-color: #f04d24cf; */
            color: #fff;
            margin-left: 10px;
            margin-right: 10px;
            border-radius: 14px;
            padding-top: 15px;
            padding-bottom: 10px;
            li {
                list-style-type: none;
                color: #99a2a8;
                font-size: 9px;
                // width: calc(100%/2);
                float: left;
                width: 45%;
                text-transform:uppercase;
                position: relative;
                font: 500 13px/1 $roboto;
                &:nth-child(2){
                    float: right;
                    width: 55%;
                    &:before{
                        content: "\e876";
                    }
                }
                &:before {
                    content: "\e876";
                    font: normal normal normal 20px/30px 'Material Icons';
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    display: block; 
                    background: #eaf0f4;
                    border-radius: 50%;
                    margin: 0 auto 10px auto;
                } 
                &:after {
                    content: '';
                    width: 100%;
                    height: 1px;
                    color:#f04d24cf;
                    background: #eaf0f4;
                    position: absolute;
                    left: -50%;
                    top: 12px;
                    z-index: -1; 
                } 
                &:last-child{
                    &:after{
                        width: 150%;
                    }
                }
                &.active{
                    color: $bc;
                    &:before, &:after{
                        background: $bc;
                        color: white;
                    }
                }
            }
        } 
    } 
}
  .checkout-button {
    background-color: #E86026;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    width: 100%;
    cursor: pointer;
  }
  .helvetica {
    font-family: Helvetica;
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
        display: none;

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
      }
    }
  }
</style>
