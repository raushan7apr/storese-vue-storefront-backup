<template>
  <div class="header">
    <div class="nav-wrap">
      <location-input />
    </div>
    <header
      class="w-100 brdr-bottom-1 bg-cl-primary brdr-cl-secondary"
      :class="{ 'is-visible': navVisible }"
    >
      <div class="container-fluid large-screen">
        <div class="row between-xs" v-if="!isCheckoutPage || isThankYouPage">
          <div class="col-md-4 col-xs-2 middle-xs" style="display: none;">
            <div>
              <hamburger-icon class="p15 icon bg-cl-secondary pointer" />
            </div>
          </div>
          <div class="col-xs-2 visible-xs">
            <search-icon class="p15 icon pointer" />
          </div>
          <div class="col-md-4 col-xs-4 pt25">
            <div>
              <logo width="auto" height="132px" />
            </div>
          </div>
          <!--<div class="col-xs-2 visible-xs">
            <wishlist-icon class="p15 icon pointer" />
          </div>-->
          <div class="col-md-2 col-xs-2 end-xs">
            <div class="row">
              <!--<search-icon style="display: none;" class="p15 icon hidden-xs pointer" />-->
              <!--<wishlist-icon class="p15 icon hidden-xs pointer" />
              <compare-icon class="p15 icon hidden-xs pointer" />-->
              <div class="col-md-4">
                <microcart-icon class="p15 icon pointer" />
              </div>
              <div class="col-md-1">
                <span
                  class="minicart-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
                >
                  {{ totalQuantity }}
                </span>
              </div>
              <div class="col-md-7">
                <account-icon class="p15 icon hidden-xs pointer" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="row between-xs middle-xs px15 py5" v-if="isCheckoutPage && !isThankYouPage">
          <div class="col-xs-5 col-md-3 middle-xs">
            <div>
              <router-link
                :to="localizedRoute('/')"
                class="cl-tertiary links"
              >
                {{ $t('Return to shopping') }}
              </router-link>
            </div>
          </div>
          <div class="col-xs-2 col-md-6 center-xs">
            <logo width="auto" height="41px" />
          </div>
          <div class="col-xs-5 col-md-3 end-xs">
            <div>
              <a
                v-if="!currentUser"
                href="#"
                @click.prevent="gotoAccount"
                class="cl-tertiary links"
              >{{ $t('Login to your account') }}</a>
              <span v-else>{{ $t('You are logged in as {firstname}', currentUser) }}</span>
            </div>
          </div>
        </div> -->
      </div>
      <div class="container-fluid mobile-screen">
        <div class="row">
          <div class="col-xs-2 start-xs">
            <div>
              <hamburger-icon class="p15 bg-f04d24cf icon" />
            </div>
          </div>
          <div class="col-xs-8 center-xs">
            <div>
              <logo width="auto" height="60px" />
            </div>
          </div>
          <div class="col-xs-1 end-xs">
            <search-icon class="p15 bg-f04d24cf icon pointer" />
          </div>
          <div class="col-xs-1 end-xs">
            <microcart-icon class="pt15 bg-f04d24cf icon pointer" />
            <span
              class="minicart-count"
            >
              {{ totalQuantity }}
            </span>
          </div>
        </div>
      </div>
      <div class="container-fluid search-and-category">
        <div class="row" v-if="!isCheckoutPage || isThankYouPage">
          <div class="col-md-8 col-xs-4 categories-bar">
            <ul v-if="displayList" id="first-list">
              <li v-for="(category, index) in firstCategories" :key="index">
                <router-link :to="categoryLink(category)">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
            <ul v-else id="second-list">
              <li v-for="(category, index) in secondCategories" :key="index">
                <router-link :to="categoryLink(category)">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="col-md-1">
            <img @click="navBarCategoryToggle" class="dot-icon" width="36" src="https://www.svgrepo.com/show/124304/three-dots.svg">
          </div>
          <div class="col-md-3 col-xs-2">
            <div class="search-input-group">
              <search-panel />
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="header-placeholder" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'
import AccountIcon from 'theme/components/core/blocks/Header/AccountIcon'
import CompareIcon from 'theme/components/core/blocks/Header/CompareIcon'
import HamburgerIcon from 'theme/components/core/blocks/Header/HamburgerIcon'
import Logo from 'theme/components/core/Logo'
import MicrocartIcon from 'theme/components/core/blocks/Header/MicrocartIcon'
import SearchIcon from 'theme/components/core/blocks/Header/SearchIcon'
import WishlistIcon from 'theme/components/core/blocks/Header/WishlistIcon'
import LocationInput from 'src/modules/location/components/Location';
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import SearchPanel from '../SearchPanel/SearchPanel';
import { configureProducts } from '@vue-storefront/core/modules/catalog/helpers/configure'

export default {
  name: 'Header',
  components: {
    SearchPanel,
    LocationInput,
    AccountIcon,
    CompareIcon,
    HamburgerIcon,
    Logo,
    MicrocartIcon,
    SearchIcon,
    WishlistIcon
  },
  mixins: [CurrentPage, SidebarMenu],
  data () {
    return {
      displayList: true,
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54
    }
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    }),
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    isThankYouPage () {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false
    },
    firstCategories () {
      return this.visibleCategories.slice(0, 4);
    },
    secondCategories () {
      let categories = this.visibleCategories;
      return categories.slice(4, categories.length);
    },
    visibleCategories () {
      return this.categories.filter(category => {
        return category.product_count > 0 || category.children_count > 0
      })
    }
  },
  beforeMount () {
    window.addEventListener(
      'scroll',
      () => {
        this.isScrolling = true
      },
      { passive: true }
    )

    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled()
        this.isScrolling = false
      }
    }, 250)
  },
  methods: {
    navBarCategoryToggle () {
      this.displayList = !this.displayList;
    },
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    hasScrolled () {
      this.scrollTop = window.scrollY
      if (
        this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight
      ) {
        this.navVisible = false
      } else {
        this.navVisible = true
      }
      this.lastScrollTop = this.scrollTop
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

.dot-icon {
  margin: 20% auto;
  display: block;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.large-screen {
  @media (max-width: 767px) {
    display: none;
  }
}

.mobile-screen {
  display: none;
  @media (max-width: 767px) {
    display: block;
  }
}

.bg-f04d24cf {
  color: #f04d24cf;
  font-weight: 600;
}

.minicart-count {
    font-size: 12px;
    background-color: #a8aeba;
    color: #000;
    padding: 0 5px;
    vertical-align: top;
    margin-left: -30px;
    padding-left: 9px;
    padding-right: 9px;
    -webkit-border-radius: 9px;
    -moz-border-radius: 9px;
    border-radius: 9px;
    margin-top:10px;
}

@media (max-width: 45em) {
  .minicart-count {
    font-size: 12px;
    background: #f04d24cf;
    color: #fff;
    padding: 0 5px;
    vertical-align: top;
    margin-left: 5px;
    padding-left: 9px;
    padding-right: 9px;
    -webkit-border-radius: 9px;
    -moz-border-radius: 9px;
    border-radius: 9px;
  }
}
.categories-bar {
  ul {
    display:flex;
    list-style:none;
    text-transform: uppercase;
    margin-block-start: 0.5rem;
    margin-block-end: 0.5rem;
    li {
      padding: 15px 60px 16px 0px;
    }
  }
}

.search-input-group {
  display: flex;
  font: 400 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
}

.search-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.search-panel-input {
  width: 100%;
  height: 60px;
  padding-bottom: 0;
  padding-top: 0;
  border: none;
  outline: 0;
  font-size: 16px;
  font-style: 400 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
}

.no-results {
  top: 80px;
  width: 100%;
}

i {
  opacity: 0.6;
}

.nav-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: #fff;
  font-weight: 600;
  // z-index: 999;
  background-color: #f04d24cf;
}

header {
  height: 158px;
  //top: -55px;
  z-index: 3;
  transition: top 0.2s ease-in-out;
  &.is-visible {
    top: 0;
  }
  @media (max-width: 767px) {
    height: 60px;
  }
}
.icon {
  opacity: 0.6;
  &:hover,
  &:focus {
    color: #30794a;
    opacity: 1;
  }
}
.right-icons {
  //for edge
  float: right;
}
.header-placeholder {
  height: 54px;
  @media (max-width: 767px) {
    height: 0px;
  }
}
.links {
  text-decoration: underline;
}
.search-and-category {
  background-color: #fff;
  margin-top: -2px;
  @media (max-width: 767px) {
    display: none;
  }
}

.categories-bar {
  border-right: 1px solid rgb(242, 242, 242);
}
@media (max-width: 767px) {
  .row.middle-xs {
    margin: 0 -15px;

    &.py5 {
      margin: 0;
    }
  }
  .col-xs-2:first-of-type {
    padding-left: 0;
  }
  .col-xs-2:last-of-type {
    padding-right: 0;
  }
  a,
  span {
    font-size: 12px;
  }
}
</style>
