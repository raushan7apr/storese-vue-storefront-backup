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
          <div class="col-md-4 col-xs-4">
            <div>
              <logo width="auto" height="132px" />
            </div>
          </div>
          <!--<div class="col-xs-2 visible-xs">
            <wishlist-icon class="p15 icon pointer" />
          </div>-->
          <div class="col-md-2 col-xs-2 end-xs">
            <div class="row cart-icon">
              <!--<search-icon style="display: none;" class="p15 icon hidden-xs pointer" />-->
              <!--<wishlist-icon class="p15 icon hidden-xs pointer" />
              <compare-icon class="p15 icon hidden-xs pointer" />-->
              <div class="col-md-8">
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
          <div class="col-xs-1 end-xs mobile-search-icon">
            <search-icon class="p15 bg-f04d24cf icon pointer" />
          </div>
          <div class="col-xs-1 end-xs ml10">
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
                <a class="cursor_pointer" @click="categoryRedirect(category)">
                  {{ category.name }}
                </a>
              </li>
            </ul>
            <ul v-else id="second-list">
              <li v-for="(category, index) in secondCategories" :key="index">
                <a class="cursor_pointer" @click="categoryRedirect(category)">
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-1">
            <img @click="navBarCategoryToggle" class="dot-icon" width="27" src="https://www.svgrepo.com/show/124304/three-dots.svg">
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
        if (category.include_in_menu === 1 || category.include_in_menu === true) {
          return category.product_count > 0 || category.children_count > 0
        }
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
    },
    categoryRedirect(category) {
      if (this.$ga) {
        this.$ga.event('Category_Viewed', 'click', JSON.stringify(this.gaData(category)));
      }
      this.$router.push(this.categoryLink(category));
    },
    gaData(category) {
      return {
        category_name: category.name,
        source: "DropDown"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

.cursor_pointer {
  cursor: pointer;
}
.search-and-category .col-md-1 {
      border-right: 1px solid #f2f2f2;
    max-width: 70px;
    display: inline-block;
    max-height: 50px;
    margin-right: 20px;
}
.dot-icon {
      margin: 0 auto;
    padding-top: 24%;
    vertical-align: middle;
    margin-bottom: 0px;
    -ms-flex-pack: center;
    justify-content: center;
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
.mobile-search-icon {
  margin-left: -20px;
}
.bg-f04d24cf {
  color: #4d4d4d;
  font-weight: 600;
}

.minicart-count {
        font-size: 9px;
    background-color: #f04d24;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-left: -49px;
    border-radius: 100%;
    margin-top: 9px;
}

@media (max-width: 45em) {
  .minicart-count {
        background: #f36f51;
    color: #fff;
    position: absolute;
    right: 6px;
    top: 36px;
    padding: 2px;
    width: 12px;
    line-height: 13px;
    height: 13px;
    text-align: center;
    vertical-align: middle;
    display: inline-block;
    border-radius: 100%;
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
      padding: 8px 60px 16px 0px;
    }
  }
}
.cart-icon {
  margin-top: 30px;
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
  max-height: 48px;
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
  z-index: 4;
  background-color: #f04d24cf;
}

header {
  height: 130px;
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
  opacity:1;
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
  height: 69px;
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
  // border-right: 1px solid rgb(242, 242, 242);
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

.search-and-category {
  max-height: 50px;
    box-shadow: 0px 0px 10px #d7d7d7!important;
    margin: 0px 0;
    margin-top:0px;
}
.categories-bar a {
    font: 500 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
    color: #343e5c;
  }
  .categories-bar a:hover {
    color:#f04e23;
  }
 .categories-bar a.underline:after, a:not(.no-underline):hover:after {
   background:#f04e23;
   top:-18.4px;
   bottom:unset;
   height:4px;
   transition: all .6s ease-in-out;
   }
</style>
