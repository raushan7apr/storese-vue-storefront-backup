<template>
  <div id="home">
    <head-image />
    <section class="container-fluid bg-d1d1d1 pb60 px15">
      <div class="row center-xs">
        <header class="col-md-12 start-xs">
          <div class="header-text">
            {{ $t('Shop by Category') }}
          </div>
        </header>
        <home-categories />
      </div>
    </section>
  </div>
</template>

<script>
// query constructor
import { isServer, onlineHelper } from '@vue-storefront/core/helpers'
import LazyHydrate from 'vue-lazy-hydration'

// Theme core components
import ProductListing from 'theme/components/core/ProductListing'
import HeadImage from 'theme/components/core/blocks/MainSlider/HeadImage'
// Theme local components
import Onboard from 'theme/components/theme/blocks/Home/Onboard'
import HomeCategories from 'theme/components/theme/blocks/HomeCategories/HomeCategories'
import TileLinks from 'theme/components/theme/blocks/TileLinks/TileLinks'
import { Logger } from '@vue-storefront/core/lib/logger'
import { mapGetters } from 'vuex'
import config from 'config'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'

export default {
  data () {
    return {
      loading: true
    }
  },
  components: {
    HeadImage,
    HomeCategories,
    Onboard,
    ProductListing,
    TileLinks
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('homepage', ['getEverythingNewCollection']),
    categories () {
      return this.getCategories
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.some(
        field => ['homepage', 'homepage.new_collection'].includes(field)
      )
    }
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule)
  },
  async beforeMount () {
    if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch('claims/check', { claimCode: 'onboardingAccepted' })
      if (!onboardingClaim) { // show onboarding info
        this.$bus.$emit('modal-toggle', 'modal-onboard')
        this.$store.dispatch('claims/set', { claimCode: 'onboardingAccepted', value: true })
      }
    }
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) this.$bus.$emit('modal-show', 'modal-signup')
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect')
      if (redirectObj) this.$router.push(redirectObj)
      localStorage.removeItem('redirect')
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
    if (context) context.output.cacheTags.add(`home`)
    Logger.info('Calling asyncData in Home Page (core)')()

    await Promise.all([
      store.dispatch('homepage/fetchNewCollection'),
      store.dispatch('promoted/updateHeadImage'),
      store.dispatch('promoted/updatePromotedOffers')
    ])
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) { // Loading products to cache on SSR render
      next(vm =>
        vm.$store.dispatch('homepage/fetchNewCollection').then(res => {
          vm.loading = false
        })
      )
    } else {
      next()
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  }
}
</script>

<style lang="scss" scoped>

  .header-text {
    font: 600 20px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
    color: #f04c24;
    margin-top: 30px;
    font-size: 28px;
    margin-bottom: -12px;
    text-transform: capitalize;
    @media (max-width: 767px) {
      margin-top: 20px;
      font-size: 20px;
    }
  }

  .bg-d1d1d1 {
    background-color: rgb(242, 242, 242);
  }

  .new-collection {
    @media (max-width: 767px) {
      padding-top: 0;
    }
  }
</style>
