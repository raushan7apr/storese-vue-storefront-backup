<template>
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
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ProductMobile from './ProductMobile'

  export default {
    components: {
      ProductMobile
    },
    data () {
      return {
        products: []
      }
    },
    computed: {
      ...mapGetters({
        productsInCart: 'cart/getCartItems'
      }),
    },
    created () {
      this.$bus.$on('product_out_of_stock', this.filterProducts)
    },
    beforeDestroy () {
      this.$bus.$on('product_out_of_stock', this.filterProducts)
    },
    methods: {
      filterProducts (items) {
        console.log('*****itsmodaltime')
        console.log(this.productsInCart, this.products)
        for (let i = 0; i < this.productsInCart.length; i++) {
          console.log(this.productsInCart[i])
          for (let j = 0; j < items.length; j++) {
            console.log(items[j])
            if (this.productsInCart[i].sku === items[j].sku) {
              console.log(this.productsInCart[i].sku)
              this.products.push(this.productsInCart[i])
            }
          }
        }
      },
      goBack () {
        this.$bus.$emit('close_modal')
      },
      removeItems () {
        // Iterate through items, remove them, call cartCreation again.
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~theme/css/animations/transitions";
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
  }
  .clearcart-header-title {
    padding: 0px 20px;
    line-height: 58px;
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
  .pay {
    background-color: #E86026;
  }

  .amount-saved {
    display: inline-block;
    justify-content: center;
    text-align: center;
    background-color: #E86026;
    color: #FFFFFF;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 4px;
    margin-right: -2px;
    margin-top: 17px;
  }

  .saved-amount {
    color: #35BC6C;
  }

  .rupee-sign {
    font-size: 10px;
  }

  .hide-mobile {
    @media (max-width: 767px) {
      display: none;
    }
  }

  .hide-desktop {
    @media (min-width: 768px) {
      display: none;
    }
  }

  .cart-total {
    @media (max-width: 767px) {
      position: static;
    }
  }

  .helvetica {
    font-family: Helvetica;
  }
  .close {
    i {
      opacity: 0.6;
    }
    &:hover,
    &:focus {
      i {
        opacity: 1;
      }
    }
  }
  @media (min-width: 767px) {
    .cart-item-title {
      position: absolute;
    }
    .back-icon {
      padding-top: 28px;
      padding-bottom: 20px;
    }
  }
  .mt0 {
    @media (max-width: 767px) {
      margin-top: 0;
    }
  }

  .clearcart {
    &-col {
      display: flex;
      align-self: center;
    }
  }

  .products {
    // padding-right: 40px;
    @media (max-width: 767px) {
      // padding: 30px 15px;
    }
  }
  .microcart {
    background: #fff;
  }
  .actions {
    box-shadow: 2px 2px 5px 1px #e1e1e1;
    -moz-box-shadow: 2px 2px 5px 1px #e1e1e1;
    -webkit-box-shadow: 2px 2px 5px 1px #e1e1e1;
    background-color: #fff;
    margin-left: 0px;
    margin-right: 0px;
    border-radius: 3px 3px 0 0;
    @media (max-width: 767px) {
      padding: 0 15px;
      box-shadow: none;
      border-bottom: 1px solid #D0D2D3;
    }
    .link {
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
        // padding: 20px 70px;
        &.checkout {
          margin-top: 55px;
          padding: 0;
        }
      }
    }
  }
  .actions-footer {
    background-color: #fff;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom:30px;
    border-radius: 3px 3px 0 0;
    @media (max-width: 767px) {
      padding: 0 15px;
    }
    .link {
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
        // padding: 20px 70px;
        &.checkout {
          margin-top: 55px;
          padding: 0;
        }
      }
    }
  }
  .cart-button {
    background-color: #fff;
    border-color: #f04d24cf;
    color: #f04d24cf;
    padding: 15px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 5px
  }
    .buttons-container {
        text-align: center
    }
  .payment-button {
    background-color: #E86026;
    border-color: #E86026;
    color: #fff;
    padding: 16px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
  }

  .checkout-button {
    background-color: #f04d24cf;
    border-color: #f04d24cf;
    color: #fff;
    padding: 15px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 5px;
    border: 2px solid #f04d24cf;
  }
  .summary {
    @media (max-width: 767px) {
      padding:  0 15px;
      font-size: 12px;
    }
  }

  .summary-heading {
    @media (max-width: 767px) {
      font-size: 18px;
    }
  }

  .total-price-label {
    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  .total-price-value {
    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  .delete-button {
    vertical-align: middle;
  }

  .coupon-wrapper {
    display: flex;

    .button-outline {
      text-transform: inherit;
      width: 50%;
    }

    .coupon-input {
      margin-right: 20px;
      width: 100%;
    }
  }

  .text {
    color: #4D4D4D;
    letter-spacing: 0px;
    font-size: 18px;
    display: inline-block;
    margin-left: 12px;
  }
  .count {
    color: #E86026;
    font-size: 18px;
    font-weight: 600;
  }
  .overlay {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 0;
    height: 100%;
    background:rgba(0, 0, 0, 0.4);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
