<template>
  <div class="w-100 pb20 cart-summary" v-observe-visibility="visibilityChanged">
    <div class="order-summary align-center brdr-cl-primary">
      <div class="row summary-header-container" @click="show=!show">
        <div class="col-xs-11 col-sm-9 col-md-11 mt20">
          <div class="row mb15">
            <div class="col-xs-12 col-md-5">
              <h3 class="m0 mb5 summary-title">
                {{ $t('Order Summary') }}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div v-if="productsInCart && productsInCart.length" class="checkout pt10 serif cl-accent">
        <div v-for="(segment, index) in totals" :key="index" class="row" v-if="segment.code !== 'grand_total' && segment.code !== 'tax'">
          <div v-if="segment.title!='Cash on delivery'" class="col-xs-6 pt15 pb20 pl30 pr55 cl-accent align-left">
            <div v-if="segment.code === 'shipping'">
              Shipping Fee
            </div>
            <div v-if="segment.code !== 'shipping' && segment.title!='Cash on delivery'">
              {{ segment.title }}
            </div>
          </div>
          <div v-if="segment.value != null && segment.title!='Cash on delivery'" class="col-xs-6 pt15 pb20 pl30 pr55 align-right cl-accent h4">
            {{ segment.value | price(storeView) }}
          </div>
        </div>

        <div class="row pt10 pb20 pl20 pr45 weight-400 h3" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total' && segment.code !== 'tax'">
          <div class="col-xs-6 align-left">
            <div v-if="segment.code === 'shipping'">
              Shipping Fee
            </div>
            <div v-if="segment.code !== 'shipping' && segment.title!='Cash on delivery'">
              {{ segment.title }}
            </div>
          </div>
          <div class="col-xs-6 align-right">
            {{ segment.value | price(storeView) }}
          </div>
        </div>
      <!-- <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{ 'bg-cl-th-accent' : isActive || isFilled, 'bg-cl-tertiary' : !isFilled && !isActive }"
        >
          2
        </div>
      </div> -->
        <div class="row summary-header-container" @click="show=!show">
          <div class="col-xs-11 col-sm-9 col-md-11 mt20">
            <div class="row mb15">
              <div class="col-xs-12 col-md-6">
                <h3 class="m0 mb5 summary-title">
                  {{ $t('View Items in Cart') }}
                </h3>
              </div>
              <div class="col-xs-12 col-md-6 mt10">
                <i class="material-icons summary-title cursor-pointer" v-if="show">arrow_circle_down</i>
                <i class="material-icons summary-title cursor-pointer" v-else>arrow_circle_up</i>
              </div>
            </div>
          </div>
        </div>
        <collapse v-if="show">
          <product v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" />
        </collapse>
      </div>
    </div>
    <!-- <div class="py50 px25">
      <h4 class="h3 m0">
        {{ $t('Safety') }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nullam sed tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 class="h3 mb0" v-if="!isVirtualCart">
        {{ $t('Shipping') }}
      </h4>
      <p class="cl-tertiary lh20" v-if="!isVirtualCart">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nullam sed tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 class="h3 mb0">
        {{ $t('Returns') }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nullam sed tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
    </div> -->
  </div>
</template>

<script>
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import Product from './Product'

export default {
  data () {
    return {
      show: false
    }
  },
  components: {
    Product
  },
  computed: {
    storeView () {
      return currentStoreView()
    }
  },
  mixins: [CartSummary]
}
</script>

<style lang="scss" scoped>
  .pr45 {
    padding-right: 45px;
  }

  .summary-title {
    color: #fff;
    @media (max-width: 767px) {
      margin-left: 0;
    }
  }
  .view-cart-items-title {
    color: #000;
    @media (max-width: 767px) {
      margin-left: 0;
    }
  }
  .cart-summary{
    margin-top: 118px
  }
.summary-header-container {
  box-shadow: 2px 2px 5px 1px #e1e1e1;
  -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
  -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  background-color: #f04d24cf;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom:30px;
  border-radius: 3px 3px 0 0;
}
.order-summary {
  position: relative;
  box-shadow: 2px 2px 5px 1px #e1e1e1;
  -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
  -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  background-color: #fff;
  margin-top:20px;
  border-radius: 0 0 3px 3px;
  margin-right: 30px;
  margin-left: 10px;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
