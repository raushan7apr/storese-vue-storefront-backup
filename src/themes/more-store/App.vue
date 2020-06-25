<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CartService } from '@vue-storefront/core/data-resolver'
const DefaultLayout = () => import(/* webpackChunkName: "vsf-layout-default" */ './layouts/Default')
const EmptyLayout = () => import(/* webpackChunkName: "vsf-layout-empty" */ './layouts/Empty')
const MinimalLayout = () => import(/* webpackChunkName: "vsf-layout-minimal" */ './layouts/Minimal')

export default {
  data () {
    return {
      ordersData: []
    }
  },
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    }),
    layout () {
      return `${(this.$route.meta.layout || 'default')}-layout`
    }
  },
  components: {
    DefaultLayout,
    EmptyLayout,
    MinimalLayout
  },
  created () {
    CartService.getShippingInfo().then((response) => {
      // store zipcodes and regions in session
      sessionStorage.setItem('regions', JSON.stringify(response.result.regions))
      sessionStorage.setItem('zipcodes', response.result.zipcodes)
      // loop through shipping methods and add
      for (let i = 0; i < response.result.shipping_methods.length; i++) {
        if (response.result.shipping_methods[i].method_code === 'flatrate') {
          let method = {
            method_title: response.result.shipping_methods[i].method_title,
            method_code: response.result.shipping_methods[i].method_code,
            carrier_code: response.result.shipping_methods[i].carrier_code,
            amount: response.result.shipping_methods[i].amount,
            price_incl_tax: response.result.shipping_methods[i].price_incl_tax,
            default: true,
            offline: true
          }
          this.$store.dispatch('checkout/addShippingMethod', method, { root: true })
        } else {
          let method = {
            method_title: 'Free shipping',
            method_code: 'freeshipping',
            carrier_code: 'freeshipping',
            amount: 0,
            price_incl_tax: 0,
            default: true,
            offline: true
          }
          this.$store.dispatch('checkout/addShippingMethod', method, { root: true })
        }
      }
    })
  }
}
</script>
