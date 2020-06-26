<template>
  <div id="category" class="category">
    <header class="bg-cl-secondary header-class pl20">
      <div class="container-fluid">
        <breadcrumbs />
      </div>
    </header>
    <img v-if="getCategoryBanner" v-bind:src="getCategoryBanner" class="m10 category-image-banner">
    <div class="container-fluid pb60 bgd1d1d1 product-list-container">
      <div class="row m0">
        <div class="col-md-2 start-xs category-filters">
          <sidebar :filters="getAvailableFilters" @changeFilter="changeFilter" />
        </div>
        <div class="col-xs-12 col-md-10 border-box products-list">
          <div class="row middle-sm item-sort-by-container">
            <div class="col-sm-9 pl20 col-xs-4 category-title">
              {{ $t('{count} items', { count: getCategoryProductsTotal }) }}
            </div>
            <!--<div class="sorting col-sm-2">
              <label class="mr10">{{ $t('Columns') }}:</label>
              <columns @change-column="columnChange" />
            </div>-->
            <div class="sorting col-sm-3 end-xs">
              Sort By
              <sort-by
                :has-label="true"
                @change="changeFilter"
                :value="getCurrentSearchQuery.sort"
              />
            </div>

            <div class="container pr30 col-xs-8">
              <div class="row m0 product-filter-container">
                <button
                  class="col-xs-5 mr15 mobile-filters-button"
                  @click="toggleFilters"
                >
                  {{ $t('Filter') }}
                </button>
                <div class="mobile-sorting col-xs-6">
                  <sort-by
                    @change="changeFilter"
                    :value="getCurrentSearchQuery.sort"
                  />
                </div>
              </div>
            </div>
        </div>
        <div v-show="mobileFilters">
          <sidebar class="mobile-filters-body" :filters="getAvailableFilters" @changeFilter="changeFilter" />
        </div>
          <!--<p class="col-xs-12 end-md m0 pb20 cl-secondary">
            {{ $t('{count} items', { count: getCategoryProductsTotal }) }}
          </p>-->
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>{{ $t('Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!') }}</p>
          </div>
          <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
            <product-listing :columns="defaultColumn" :products="getCategoryProducts" />
          </lazy-hydrate>
          <product-listing v-else :columns="defaultColumn" :products="getCategoryProducts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import Sidebar from '../components/core/blocks/Category/Sidebar.vue'
import ProductListing from '../components/core/ProductListing.vue'
import Breadcrumbs from '../components/core/Breadcrumbs.vue'
import SortBy from '../components/core/SortBy.vue'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import config from 'config'
import Columns from '../components/core/Columns.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll'
import rootStore from '@vue-storefront/core/store';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'

const THEME_PAGE_SIZE = 50

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const currentCategory = cachedCategory && !forceLoad ? cachedCategory : await store.dispatch('category-next/loadCategory', { filters })
    const pageSize = store.getters['url/isBackRoute'] ? store.getters['url/getCurrentRoute'].categoryPageSize : THEME_PAGE_SIZE
    await store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize })
    const breadCrumbsLoader = store.dispatch('category-next/loadCategoryBreadcrumbs', { category: currentCategory, currentRouteName: currentCategory.name, omitCurrent: true })

    if (isServer) await breadCrumbsLoader
    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    Logger.error('Problem with setting Category initial data!', 'category', e)()
  }
}

export default {
  components: {
    LazyHydrate,
    ButtonFull,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    SortBy,
    Columns
  },
  mixins: [onBottomScroll],
  data () {
    return {
      mobileFilters: false,
      defaultColumn: 3,
      loadingProducts: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    getCategoryBanner () {
      if (this.getCurrentCategory.image){
      return('https://preprod-admin.storese.in/pub/media/catalog/category/' + this.getCurrentCategory.image)
      }
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add('category')
    await composeInitialPageState(store, route)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true)
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }) // await here is because we must wait for the hydration
        vm.loading = false
      })
    } else { // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true
        vm.$store.dispatch('category-next/cacheProducts', { route: to })
        vm.loading = false
      })
    }
  },
  methods: {
    toggleFilters () {
      this.mobileFilters = !this.mobileFilters
    },
    // closeFilters () {
    //   this.mobileFilters = false
    // },
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [filterVariant])
    },
    columnChange (column) {
      this.defaultColumn = column
    },
    async onBottomScroll () {
      if (this.loadingProducts) return
      this.loadingProducts = true
      try {
        await this.$store.dispatch('category-next/loadMoreCategoryProducts')
      } catch (e) {
        Logger.error('Problem with fetching more products', 'category', e)()
      } finally {
        this.loadingProducts = false
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView()
    const { meta_title, meta_description, name, slug } = this.getCurrentCategory
    const meta = meta_description ? [
      { vmid: 'description', name: 'description', content: htmlDecode(meta_description) }
    ] : []
    /* const categoryLocaliedLink = localizedRoute({
      name: 'category-amp',
      params: { slug }
    }, storeView.storeCode)
    const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href */

    return {
      // link: [ { rel: 'amphtml', href: ampCategoryLink } ],
      title: htmlDecode(meta_title || name),
      meta
    }
  }
}
</script>

<style lang="scss" scoped>

  .bgd1d1d1 {
    background-color: rgb(242, 242, 242);
  }

  .category {
    // margin-top: 12px;
    background-color: rgb(242, 242, 242);
  }
  .item-sort-by-container {
    background-color: #fff;
    margin:36px 0px -8px;
    box-shadow: 2px 2px 5px 1px #e1e1e1;
    // -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
    // -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  }
  .category-image-banner {
    width: 100%;
    height: auto;
  }
  @media (max-width: 770px) {
  .category-image-banner {
    margin: 0px;
  }
   .item-sort-by-container {
    //  background-color: transparent;
     margin:20px -8px 3px;
     border-radius: 3px;
   }
   .product-filter-container {
     margin-bottom: 20px;
   }
  }
  .btn {
    &__filter {
      min-width: 100px;
    }
  }
  .divider {
    width: calc(100vw - 8px);
    bottom: 20px;
    left: -36px;
  }
  .category-filters {
    width: 242px;
  }

  .mobile-filters {
    display: none;
    overflow: auto;
  }

  .mobile-filters-button {
    display: none;
  }

  .mobile-sorting {
    display: none;
  }

  .category-title {
    line-height: 65px;
  }

  .product-list-container {
    margin-top: -10px;
  }
  .sorting {
    label {
      margin-right: 10px;
    }
  }
  .header-class {
    padding-top: 20px;
    padding-bottom: 0px;
  }

  @media (min-width: 770px){
    .product-list-container {
      margin-top: -30px;
    }
  }
  @media (max-width: 64em) {
    .products-list {
      max-width: 530px;
    }
  }

  @media (max-width: 770px) {
    .header-class {
      padding-top: 8px;
      padding-bottom: 2px;
    }
    .container-fluid {
      padding-right: 0px;
      padding-left: 0px;
    }
    .category-title {
      margin: 28px 0 27px 0;
      font-size: 14px;
      line-height: 1px;
    }

    .products-list {
      width: 100%;
      max-width: none;
    }

    .mobile-filters {
      display: block;
    }

    .mobile-filters-button {
      display: block;
      height: 35px;
      background: #fff;
      color: #828282;
      border: 1px solid #bdbdbd;
      margin-top: 10px;
      margin-bottom: -10px;
    }

    .sorting {
      display: none;
    }

    .mobile-sorting {
      display: block;    
      margin-top: 10px;
      margin-bottom: -10px;
    }

    .category-filters {
      display: none;
    }

    .product-listing {
      justify-content: center;
    }

    .mobile-filters {
      position: fixed;
      background-color: #F2F2F2;
      z-index: 5;
      padding: 0 40px;
      left: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      box-sizing: border-box;
    }

    .mobile-filters-body {
      // margin-top: 50px;
    }
  }

  .close-container {
    left: 0;
  }

  .close {
    margin-left: auto;
  }
</style>
<style lang="scss">
.product-image {
  max-height: unset !important;
}
</style>
