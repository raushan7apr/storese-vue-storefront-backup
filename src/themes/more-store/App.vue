<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="fullPage"
      background-color="#f04d24"
      :opacity="1"
    >
      <slot default>
        <logo width="auto" height="256px" />
      </slot>
    </loading>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CartService } from '@vue-storefront/core/data-resolver'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config'
import Logo from 'theme/components/core/Logo'
const DefaultLayout = () => import(/* webpackChunkName: "vsf-layout-default" */ './layouts/Default')
const EmptyLayout = () => import(/* webpackChunkName: "vsf-layout-empty" */ './layouts/Empty')
const MinimalLayout = () => import(/* webpackChunkName: "vsf-layout-minimal" */ './layouts/Minimal')

// Loader
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data () {
    const storeView = currentStoreView()
    return {
      ordersData: [],
      isLoading: true,
      fullPage: true,
      defaultTitle: storeView.seo.defaultTitle ? storeView.seo.defaultTitle : config.seo.defaultTitle
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
    MinimalLayout,
    Loading,
    Logo
  },
  created () {
    CartService.getShippingInfo().then((response) => {
      // store zipcodes and regions in session
      sessionStorage.setItem('regions', JSON.stringify(response.result.regions))
      sessionStorage.setItem('zipcodes', response.result.zipcodes)
      // loop through shipping methods and add
      let method = {
        method_title: 'Free shipping',
        method_code: 'freeshipping',
        carrier_code: 'freeshipping',
        amount: 0,
        price_incl_tax: 0,
        default: true,
        offline: true
      }
      for (let i = 0; i < response.result.shipping_methods.length; i++) {
        if (response.result.shipping_methods[i].method_code === 'flatrate') {
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
      this.$store.dispatch('checkout/addShippingMethod', method, { root: true })
    })
  },
  mounted () {
    document.onreadystatechange = () => { 
      if (document.readyState == "complete") { 
          this.isLoading = false
      } 
    }
  }
}
</script>
