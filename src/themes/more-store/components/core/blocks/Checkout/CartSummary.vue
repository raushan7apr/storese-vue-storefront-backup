<template>
  <div class="w-100 pb20" v-observe-visibility="visibilityChanged">
    <div class="order-summary align-center brdr-bottom-1 brdr-cl-primary pb60">
      <div class="row summary-header-container" @click="show=!show">
        <div class="col-xs-11 col-sm-9 col-md-11">
          <div class="row">
            <div class="col-xs-12 col-md-5">
              <h3 class="cl-accent summary-title">
                {{ $t('Order Summary') }}
              </h3>
            </div>
            <div class="col-xs-12 col-md-7 pr30">
              <div class="lh30 mt25 flex end-lg summary-title">
                <span class="pr5">
                  View Items
                </span>
                <i class="material-icons cl-tertiary">arrow_circle_down</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <collapse v-if="show">
        <product v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" />
      </collapse>
      <hr />
      <div v-if="productsInCart && productsInCart.length" class="checkout pt10 serif cl-accent">
        <div v-for="(segment, index) in totals" :key="index" class="row pt15 pb20 pl30 pr55 " v-if="segment.code !== 'grand_total' && segment.code !== 'tax'">
          <div class="col-xs cl-accent">
            <div v-if="segment.code === 'shipping'">
              Shipping Fee
            </div>
            <div v-if="segment.code !== 'shipping'">
              {{ segment.title }}
            </div>
          </div>
          <div v-if="segment.value != null" class="col-xs align-right cl-accent h4">
            {{ segment.value | price(storeView) }}
          </div>
        </div>

        <div class="row pt20 pb20 pl30 pr55 weight-400 h3" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total' && segment.code !== 'tax'">
          <div class="col-xs">
            <div v-if="segment.code === 'shipping'">
              Shipping Fee
            </div>
            <div v-if="segment.code !== 'shipping'">
              {{ segment.title }}
            </div>
          </div>
          <div class="col-xs align-right">
            {{ segment.value | price(storeView) }}
          </div>
        </div>
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
  .summary-title {
    color: #fff;
    @media (max-width: 767px) {
      margin-left: 0;
    }
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
}
</style>
