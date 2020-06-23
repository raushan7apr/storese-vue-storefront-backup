<template>
  <div class="product-listing row m0 center-xs start-md">
    <div
      v-for="(product, key) in products"
      :key="product.id"
      class="col-sm-6 flex pd-8"
      :class="['col-md-' + 3/*(12/columns)%10*/, wide(product.sale, product.new, key)]"
    >
      <product-tile :product="product" />
    </div>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'
let lastHero = 0
export default {
  name: 'ProductListing',
  components: {
    ProductTile
  },
  props: {
    products: {
      type: null,
      required: true
    },
    columns: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    wide (isOnSale, isNew, index) {
      let deltaCondition = index > 0 && ((index - 1) - lastHero) % 2 === 0
      // last image always shouldn't be big, we also need to count from last promoted to check if it will look ok
      let isHero = ((isOnSale === '1' || isNew === '1') && deltaCondition) || (index === this.products.length - 1 && (index - lastHero) % 2 !== 0)
      if (isHero) {
        lastHero = index
      }
      return isHero ? 'col-xs-12' : 'col-xs-12'
    }
  }
}
</script>

<style scoped>
.product-listing{
  margin: 30px -16px 0px;
}
.pd-8 {
  padding-top: 8px;
  padding-bottom: 8px;
}
@media (max-width: 767px) {
  .pd-8 {
  padding-top: 0px;
  padding-bottom: 0px;
  }
}
</style>
