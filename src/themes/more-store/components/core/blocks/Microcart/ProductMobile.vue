<template>
  <div class="row list-item">
      <div class="col-xs-3">
          <div class="blend">
            <product-image :image="image" style="padding-bottom: 100%" />
        </div>
      </div>
    <div class="col-xs-9">
      <div class="row">
        <div class="col-xs-9 col-md-9 pb15">
          <div class="mb15">
            <div class="helvetica product-name">
              {{ product.name | htmlDecode }}
            </div>
            <div class="pt5 product-sku">
              SKU: {{ product.sku }}
            </div>
          </div>
          <div>
            <div>

							<div class="color-f04d24cf" v-if="isOnline && product.totals">
								<span class="price-paid" v-if="product.totals.discount_amount">{{ product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount | price(storeView) }} </span>
								<span class="price-original h5 color-6D6E71" v-if="product.totals.discount_amount">{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
								<span v-if="!product.totals.discount_amount" class="price-paid">{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
							</div>
							<div class="color-f04d24cf" v-else>
								<span class="price-paid" v-if="product.special_price">{{ product.price_incl_tax * product.qty | price(storeView) }} </span>
								<span class="price-original h5 color-6D6E71" v-if="product.special_price">{{ product.original_price_incl_tax * product.qty | price(storeView) }}</span>
								<span v-if="!product.special_price" class="price-paid">{{ product.price_incl_tax * product.qty | price(storeView) }}</span>
							</div>
                
            </div>
          </div>
        </div>

        <div class="col-xs-3 end-xs col-md-3 helvetica">
          <span class="quantity">
							{{ $t('Qty') }}
							<span class="weight-700">
								{{ product.qty }}
							</span>
						</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Product } from '@vue-storefront/core/modules/checkout/components/Product'
import { onlineHelper } from '@vue-storefront/core/helpers'
import ProductImage from 'theme/components/core/ProductImage'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  computed: {
    storeView () {
      return currentStoreView()
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    }
  },
  mixins: [Product],
  components: {
    ProductImage
  }
}
</script>

<style scoped>
  .helvetica {
    font-family: Helvetica;
  }
  .price-original {
    text-decoration: line-through;
		display: inline-block;
		padding-left: 10px;
		font-size: 12px;
  }

	.price-paid{
		font-size: 14px;
		font-weight: 600;
	}

	.quantity{
		color: #EC6D34;
		font-size: 13px;
    display: block;			
    font-weight: 600;																																																																																																																																																																																																																																																																																																																																																																																																																																																				
	}

  .blend {
    flex: 0 0 121px;
  }

  .color-f04d24cf {
    color: #f04d24cf;
  }

	.color-6D6E71{
		color: #6D6E71;
	}
  
  .product-name {
    font-size: 13px;
    color: #4D4D4D;
    opacity: 1;
  }

  .product-sku {
    font-size: 12px;
    color: #969696;
    opacity: 1;
  }

	.list-item {
    width: 100%;
    background: #fff;
    margin-left: 0px;
		padding-left: 12px;
		padding-right: 12px;
		padding-top: 12px;
    padding-right: 12px;
    border-bottom: 1px solid #c5bfbf;
	}
</style>
