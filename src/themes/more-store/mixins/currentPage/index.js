import { isServer } from '@vue-storefront/core/helpers'

export default {
  data () {
    return {
      productPageRoutes: [
        'product',
        'virtual-product',
        'bundle-product',
        'simple-product',
        'downloadable-product',
        'grouped-product',
        'configurable-product'
      ],
      isProductPage: false,
      isCheckoutPage: false,
      isCategoryPage: false
    }
  },
  watch: {
    '$route.name': function () {
      this.setCurrentPage()
    }
  },
  computed: {
    canGoBack () {
      return !this.isHistoryEmpty() && this.isProductPage
    }
  },
  created () {
    this.setCurrentPage()
  },
  methods: {
    setCurrentPage () {
      var routeName = (this.$route.name).split('-')
      this.isProductPage = !!this.$route.params.parentSku
      this.isCheckoutPage = routeName[routeName.length - 1] === 'checkout'
      this.isCategoryPage = !!this.$route.params.slug
    },
    // Check if history is empty
    isHistoryEmpty () {
      if (!isServer) {
        return window.history.length <= 1
      }

      return false
    }
  }
}
