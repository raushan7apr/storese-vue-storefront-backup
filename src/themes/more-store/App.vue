<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="fullPage"
      background-color="#f04d24"
      :opacity="1"
    >
      <slot default>
        <logo width="auto" :height="height" />
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
      height: '0px', 
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
  mounted () {
    if(screen.width<786){
      this.height = '128px';
    }
    else{
      this.height = '256px';
    }
    document.onreadystatechange = () => { 
      if (document.readyState == "complete") { 
          this.isLoading = false
      } 
    }
  }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap');

body {
  font-family: 'Nunito', sans-serif !important;
}

#app {
  font-family: 'Nunito', sans-serif !important;
}
</style>
