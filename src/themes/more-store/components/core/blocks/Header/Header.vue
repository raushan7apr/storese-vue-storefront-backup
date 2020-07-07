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
        <!-- <div class="row between-xs" v-if="!isCheckoutPage || isThankYouPage"> -->
        <div class="row between-xs">
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
              <div class="col-md-8" @click="openMicrocart">
                <microcart-icon class="p15 icon pointer" v-if="!isCheckoutPage"/>
              </div>
              <div class="col-md-1" >
                <span
                  class="minicart-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
                  v-if="!isCheckoutPage"
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
            <div v-if="isCheckoutPage">
              <router-link
                :to="localizedRoute('/')"
                class="cl-tertiary links"
              >
               <i class="material-icons left-icon">arrow_back</i>
              </router-link>
            </div>
            <div v-else-if="!isCategoryPage">
              <hamburger-icon class="p15 bg-f04d24cf icon" />
            </div>
            <div v-else>
              <i class="material-icons left-icon" @click="$router.go(-1)">arrow_back</i>
            </div>
          </div>
          <div v-if="isCheckoutPage && !isThankYouPage" class="col-xs-8 start-xs checkout-name-container">
            <div class="checkout-name-header">
              Checkout
            </div>
          </div>
          <div v-else-if="isCategoryPage && !isProductPage" class="col-xs-8 start-xs category-name-container">
            <div class="category-name-header">
              {{ currentCategoryName }}
            </div>
          </div>
          <div v-else class="col-xs-7 center-xs logo">
            <div>
              <logo width="auto" height="60px" />
            </div>
          </div>
          <div class="col-xs-1 end-xs mobile-search-icon" >
            <search-icon class="p15 bg-f04d24cf icon pointer" v-if="!isCheckoutPage"/>
          </div>
          <div class="col-xs-1 end-xs ml10" >
            <microcart-icon class="pt15 bg-f04d24cf icon pointer" v-if="!isCheckoutPage"/>
          </div>
          <div v-if="!isCheckoutPage"  @click="openMicrocart" class="col-xs-1 end-xs ml10 item-count-icon" >
            <span
              class="minicart-count"
              v-if="!isCheckoutPage"
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
    <template v-if="showOutofStock">
      <div class="overlay-wrap"></div>
      <div class="microcartClear">
        <div
          class="microcart-clear-container cl-accent relative"
          :class="[products.length ? 'bg-cl-secondary' : 'bg-cl-primary']"
          data-testid="microcart"
        >     
          <div class="clearcart-header">
            <span class="clearcart-header-title">
              <img src="/assets/error-icon.png" class="error-image" style="width: 30px;">
              <span class="error-msg">Following Products are not in stock</span>
            </span>
          </div>
          <div class="items-container">
            <div v-if="products.length" class="col-md-12 start-md product-container">
              <product-mobile v-for="product in products" :key="product.server_item_id || product.id" :product="product" />
            </div>
          </div>
          <div class="remove-item-msg">Remove Item to Continue</div>
          <div class="buttons-container">
            <button class="back-button" @click="goBack">BACK</button>
            <button class="remove-item-button" @click="removeItems">REMOVE</button>
          </div>
        </div>
      </div>
    </template>
    <loading
      :active.sync="checkoutLoading"
      :is-full-page="true"
      background-color="#ffffff"
      :opacity="0.5"
      color="orange"
    ></loading>
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
import { Breadcrumbs } from '@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts'
import ProductMobile from '../Microcart/ProductMobile'
// Loader
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

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
    WishlistIcon,
    ProductMobile,
    Loading
  },
  mixins: [CurrentPage, SidebarMenu, Breadcrumbs],
  data () {
    return {
      displayList: true,
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54,
      checkoutLoading: false,
      showOutofStock: false,
      products: [],
      cartItems: []
    }
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity',
      productsInCart: 'cart/getCartItems'
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
    },
    currentCategoryName () {
      let category = this.$route.params.slug.split("-").join(" ").replace(/[0-9]/g,'')
      return category
    }
  },
  created () {
    this.$bus.$on('load_checkout', this.loadCheckout)
    this.$bus.$on('go_ahead_checkout', this.offCheckout)
    this.$bus.$on('product_out_of_stock', this.loadProducts)
  },
  beforeDestroy () {
    this.$bus.$off('load_checkout', this.loadCheckout)
    this.$bus.$off('go_ahead_checkout', this.offCheckout)
    this.$bus.$off('product_out_of_stock', this.loadProducts)
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
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    }),
    loadCheckout () {
      this.checkoutLoading = true
    },
    loadProducts (items) {
      this.products = []
      this.showOutofStock = true
      this.cartItems = this.productsInCart.map(obj => Object.assign({}, obj))
      for (let i = 0; i < this.cartItems.length; i++) {
        for (let j = 0; j < items.length; j++) {
          if (this.cartItems[i].sku === items[j].sku) {
            this.cartItems[i]['og_qty'] = this.cartItems[i].qty
            this.cartItems[i].qty = items[j].remove_qty
            this.products.push(this.cartItems[i])
          }
        }
      }
      this.checkoutLoading = false
    },
    removeItems () {
      this.checkoutLoading = true
      for (let i = 0; i < this.products.length; i++) {
        this.products[i]
        this.$store.dispatch('cart/updateQuantity', { product: this.products[i], qty: this.products[i].og_qty - this.products[i].qty });
      }
      this.$store.dispatch('cart/creation')
      this.products = []
      this.showOutofStock = false
    },
    goBack () {
      this.showOutofStock = false
    },
    offCheckout () {
      this.checkoutLoading = false
    },
    navBarCategoryToggle () {
      this.displayList = !this.displayList;
    },
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    hasScrolled () {
      this.scrollTop = window.scrollY
      if (
        this.scrollTop > this.lastScrollTop &
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
.items-container {
    height: 200px;
    overflow-y: scroll;
  }
  .product-container {
      padding: 0px;
  }
  .clearcart-header {
    background: #ec6c34;
    color: #fff;
    height: 60px;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .clearcart-header-title {
    padding: 0px 20px;
    line-height: 58px;
  }
  .logo {
    margin-left: 18px;    
  }
  .minimum-order {
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #f7f7f7;
  }
  .minimum-order-text {
    color: red;
    font-size: 12px;
  }
  .clear-cart {
    justify-content: center;
    text-align: right;
    padding-top: 22px;
    font-size: 12px;
    color: #a6a8ab;
  }
  .buttons-container {
      text-align: center
  }
  .mt2 {
    @media (max-width: 767px) {
      margin-top: 2px;
    }
  }
  .microcart-clear-container {
      border-radius: 10px;
  }
  .back {
    background-color: #F7F7F7;
  }
  .item-count-icon {
    margin-left: -10px;
  }
  .error-image {
    width: 30px;
    padding: 12px 0px;
    float: left;
  }
  .error-msg {
    margin-left: 6px;
    float: left;
    font-weight: 600;

  }
  .remove-item-msg {
    text-align: center;
    color: #E86026;
    font-weight: 600;
    margin: 25px 0px;
  }
  @media (max-width:767px){
    .remove-item-msg {
        text-align: center;
        color: #E86026;
        font-weight: 600;
        margin: 16px 0px;;
    }
  }
    .back-button {
        display: inline-block;
        color: #E86026;
        background-color: #F7F7F7;
        opacity: 1;
        padding: 13px 24px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        border: solid;
        border-color: #E86026;
        width: 140px;
        margin-right: 10px;
    }
    .remove-item-button {
        display: inline-block;
        color: #F7F7F7;
        background-color: #E86026;
        opacity: 1;
        padding: 16px 24px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        border: none;
        width: 140px;
        margin-left: 10px;
    }
.checkout-name-header {
  font-size: 18px;
  padding-top: 18px;
  color: #4D4D4D;
}

.category-name-header {
  text-transform: capitalize;
  font-size: 16px;
  color: #4D4D4D;
}

.checkout-name-container {
  margin-left: -20px;
}

.category-name-container {
  margin-left: -20px;
  display: flex;
  align-items: center;
}

.category-name {
  float: left;
  font-size: 16px;
  padding-top: 22px;
  margin-left: -14px;
}
.left-icon {
  width: 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4d4d4d;
}
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
    margin-left: -20px
}
.bg-f04d24cf {
  color: #4d4d4d;
  font-weight: 600;
}
.overlay-wrap {
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height:100%;
  background-color: #000;
  z-index:998;
  opacity:0.4;
  filter: alpha(opacity = 50)
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
 @media (max-width: 767px) {
    .microcartClear {
    width: 350px;
    height: 380px;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -190px;
    margin-left: -175px;
    z-index: 1000;
    border-radius: 10px;
  }
    }
  @media (min-width: 767px) {
    .microcartClear {
     width: 500px;
    height: 400px;
    background-color: #fff; 
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -250px;
    z-index: 1000;
    border-radius: 10px;
  }
  }
@media (max-width: 45em) {
  .minicart-count {
    background: #f36f51;
    color: #fff;
    // position: absolute;
    // right: 16px;
    // top: 36px;
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
  // font: 400 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
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
  // font-style: 400 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
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
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
  }
}

.search-and-category {
  max-height: 50px;
    box-shadow: 0px 0px 10px #d7d7d7!important;
    margin: 0px 0;
    margin-top:0px;
}
.categories-bar a {
    // font: 500 12px/1.35 Rajdhani, Helvetica Neue, Verdana, Arial, sans-serif;
    color: #343e5c;
    font-size: 12px;
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
