<template>
  <div class="product align-center w-100 pb20" v-observe-visibility="visibilityChanged">
    <!-- <div class="product__icons">
      <AddToWishlist :product="product">
        <div
          class="product__icon"
          :class="{'product__icon--active': isOnWishlist }"
          :title="isOnWishlist ? $t('Remove') : $t('Add to favorite') "
        >
          <i class="material-icons">{{ favoriteIcon }}</i>
        </div>
      </AddToWishlist>
      <AddToCompare :product="product">
        <div
          class="product__icon"
          :class="{'product__icon--active':isOnCompare } "
          :title="isOnCompare ? $t('Remove from compare') : $t('Add to compare')"
        >
          <i class="material-icons">compare</i>
        </div>
      </AddToCompare>
    </div> -->
    <div
      class="block no-underline product-link cursor-pointer"
      @click="productRedirect(productLink, product)"
      data-testid="productLink"
    >

      <div
        class="product-cover sideBar"
        :class="[{ sale: labelsActive && isOnSale }, { new: labelsActive && isNew }]"
      >
        <product-image
          class="product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </div>
      <div class="product-details-container mainContent">
        <p class="product-name mb5 cl-accent mt10" v-if="!onlyImage">
          {{ product.name | htmlDecode }}
          <br />
        </p>
        <div class="price">
          <span
            class="price-special price lh30 cl-accent weight-700"
            v-if="product.special_price && parseFloat(product.special_price) > 0 && !onlyImage"
          >{{ product.price_incl_tax | price(storeView) }}</span>
          <span
            class="price-special lh30 cl-secondary price"
            v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0 && !onlyImage"
          >{{ product.price_incl_tax | price(storeView) }}</span>
          <span
            class="price-original price mr5 lh30 cl-secondary"
            v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0 && !onlyImage"
          >{{ product.original_price_incl_tax | price(storeView) }}</span>
        </div>
      </div>
    </div>
    <div class="price-mobile ml5 mt5">
      <span
        class="price-special price-mobile lh30 cl-accent weight-700"
        v-if="product.special_price && parseFloat(product.special_price) > 0 && !onlyImage"
      >{{ product.price_incl_tax | price(storeView) }}</span>
      <span
        class="price-special lh30 cl-secondary price-mobile"
        v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0 && !onlyImage"
      >{{ product.price_incl_tax | price(storeView) }}</span>
      <span
        class="price-original price-mobile mr5 lh30 cl-secondary"
        v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0 && !onlyImage"
      >{{ product.original_price_incl_tax | price(storeView) }}</span>
    </div>
    <button class="qty-container">

      <div class="add-to-cart add-button" v-if="cartQuantity(product, productsInCart) === 0">
        <div class="column-100 cursor-pointer increase">
          <add-to-cart-plus
            :product="product"
          >
          </add-to-cart-plus>
        </div>
      </div>
      <div class="add-to-cart" v-else>
        <div @click="updateProductQty(product, productsInCart)" class="column cursor-pointer decrease">
          -
        </div>
        <div class="column qty">
          {{ cartQuantity(product, productsInCart) }}
        </div>
        <div class="column cursor-pointer increase">
          <add-to-cart-plus
            :product="product"
          >
          </add-to-cart-plus>
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import rootStore from '@vue-storefront/core/store'
import { Product } from '@vue-storefront/core/modules/checkout/components/Product'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts'
import config from 'config'
import ProductImage from './ProductImage'
import AddToCart from 'theme/components/core/AddToCart.vue'
import AddToCartPlus from 'theme/components/core/AddToCartPlus.vue'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import AddToCompare from 'theme/components/core/blocks/Compare/AddToCompare'
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare, Product],
  components: {
    AddToCart,
    AddToCartPlus,
    ProductImage,
    AddToWishlist,
    AddToCompare
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    }),
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      }
    },
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    cartQuantity (product, cart) {
      let cartItem = this.cartItem(product, cart);
      if (cartItem) {
        return cartItem.qty;
      } else {
        return 0;
      }
    },
    cartItem (product, cart) {
      let cartItem = cart.find(item => item.name === product.name);
      return cartItem;
    },
    updateProductQty (product, productsInCart) {
      this.updateQuantity(product, productsInCart);
    },
    updateQuantity (product, productsInCart) {
      let cartItem = this.cartItem(product, productsInCart);
      let qty = 0;
      if (cartItem.qty) {
        qty = cartItem.qty;
      }
      if (qty === 1) {
        if (this.$ga) {
          this.$ga.event('Remove_From_Cart', 'click', JSON.stringify(this.gaData(product)));
        }
        this.$store.dispatch('cart/removeItem', { product: cartItem })
      } else if (qty > 1) {
        let gaData = this.gaData(product)
        gaData.new_quantity = qty - 1;
        gaData.old_quantity = qty;
        if (this.$ga) {
          this.$ga.event('Change_Quantity', 'click', JSON.stringify(gaData));
        }
        qty = qty - 1;
        this.$store.dispatch('cart/updateQuantity', { product: cartItem, qty: qty });
      }
    },
    gaData(product) {
      return {
        product_name: product.name,
        product_sku: product.sku,
        product_price: product.original_price_incl_tax,
        offer_price: product.special_price,
      }
    },
    onProductPriceUpdate (product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product)
      }
    },
    visibilityChanged (isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku]
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku)
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }) // store it in the cache
        }
      }
    },
    productRedirect (productLink, product) {
      if (this.$ga) {
        this.$ga.event('Product_Page', 'click', JSON.stringify(this.gaData(product)));
      }
      this.$router.push(productLink);
    },
    gaData(product) {
      return {
        product_name: product.name,
        source: "Home Page"
      }
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);

.qty-container {
//   -moz-user-select: none;
//   -webkit-user-select: none; 
//   -ms-user-select:none; 
//   user-select:none;
//   -o-user-select:none;
//   display: flex;
//   justify-content: center;
//   // border-top: 1px solid #e1e1e1;
//   margin-top: 8px;
    border: none;
    text-transform: uppercase;
    background-color: #fff;
}
#category .add-to-cart {
    margin-right: 10px;
}

#category .add-button {
    margin-right: 10px;
}

.add-to-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 25px;
  border: 1px solid #f04d24cf;
  border-radius: 30px;
  margin-top: 8px;
  // box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.2), 0 5px 6px 0 rgba(0, 0, 0, 0.19);
}
.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 25px;
  border: 1px solid #f04d24cf;
  background: #fff;
  border-radius: 30px;
  margin-top: 8px;
  // box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.2), 0 5px 6px 0 rgba(0, 0, 0, 0.19);
}
.add-to-cart > .decrease {
  font-size: 20px;
  font-weight: 600;
  padding-left: 6px;
  padding-top: 0px;
  margin-bottom: 4px;
  cursor: pointer;
  color: #f57151;
}

.add-to-cart > .qty {
  font-size: 12px;
  font-weight: 600;
  padding: 0px 8px 0px 8px;
  color: #4d4d4d;
}

.add-to-cart > .increase {
  font-size: 20px;
  font-weight: 600;
  padding-right: 6px;
  margin-bottom: 0px;
  cursor: pointer;
  color: #f57151;
}

.product {
  position: relative;
  box-shadow: 2px 2px 5px 1px #e1e1e1;
  -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
  -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
  background-color: #fff;
  @media (max-width: 767px) {
    padding-bottom: 10px;
  }
  &__icons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-top: 10px;
  }
  &__icon {
    padding-top: 10px;
    opacity: 0;
    z-index: 2;
    transition: 0.3s opacity $motion-main;
    @media (max-width: 767px) {
      opacity: 1;
    }
    &--active {
      opacity: 1;
    }
  }
  &:hover {
    .product__icon {
      opacity: 1;
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}

.product-name {
  // font: 500 14px/1.35 Helvetica;
  font-weight: 500;
  font-size: 16px;
}

.price {
  color: #f04d24cf;
  // font: 600 18px/1.35 Helvetica;
  font-size: 18px;
  font-weight: 600;
}

.product-details-container {
    // min-height: 120px;
  }

.price-original {
  text-decoration: line-through;
}

%label {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: $border-secondary;
  text-transform: uppercase;
  color: $color-white;
  font-size: 12px;
}
@media (min-width: 767px) {
  .price-mobile {
    display: none;
  }
  .product-details-container {
    min-height: 90px;
  }
  .price-original {
    color: #4d4d4d;
    // font: 300 14px/1.35 Helvetica;
    font-size: 14px;
    font-weight: 300;
  }
}
@media (max-width: 767px) {
  .product-name {
    // font: 500 14px/1.35 Helvetica;
    font-weight: 500;
    font-size: 16px;
    text-align:left;
  }
  .product-link {
    // height:100%;
  }
  .product-cover__thumb {
    // left: -20%;
  }
  .product-cover {
    width:30%;
    flex-basis: 50%;
    max-width: 50%;
    display:block;
    float:left;
  }
  .price {
    display: none;
  }
  .price-mobile {
    float: left;
    // margin-top: 5px;
    color: #4d4d4d;
    // font: 300 14px/1.35 Helvetica;
    font-size: 14px;
    font-weight: 300;
    line-height: 6px;
    position: relative;
    bottom: -6px;
  }
  .price-special {
    color: #f04d24cf;
    padding-right: 8px;
    font-weight: 600;
  }
  .product-details-container {
    display:block;
    float:left;
    flex-basis: 50%;
    width: 67%;
    padding-right: 3%;
    min-height: 60px;
  }
  .qty-container {
    float: right;
    // margin-top: -10px;
    // margin-right: 10px;
    z-index: 2;
    position: relative;
    bottom: 0px;
  }
}
.column {
  float: left;
  width: 33.33%;
  color: #aaaaaa;
  text-align: center;
  height: 36px;
  line-height: 36px;
}
.column-100 {
  float: left;
  width: 100%;
  color: #aaaaaa;
  text-align: center;
}
.product-cover {
  overflow: hidden;

  &__thumb {
    padding-bottom: calc(143.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      padding-bottom: 60%;
      // padding-bottom: calc(300% / (276.5 / 115));
    }
    opacity: 0.8;
    will-change: opacity, transform;
    transition: 0.3s opacity $motion-main, 0.3s transform $motion-main;
  }

  @media screen and (min-width: 768px) {
    &:hover {
      .product-cover__thumb {
        opacity: 1;
        transform: scale(1.1);
      }
      &.sale::after,
      &.new::after {
        opacity: 0.8;
        display: none;
      }
    }
  }

  &.sale {
    &::after {
      @extend %label;
      content: 'Sale';
      display: none;
    }
  }
  &.new {
    &::after {
      @extend %label;
      content: 'New';
      display: none;
    }
  }
}
</style>
