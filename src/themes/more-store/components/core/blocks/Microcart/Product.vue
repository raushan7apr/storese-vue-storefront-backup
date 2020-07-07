<template>
  <li class="row py10 bg-cl-white list-item" :class="{ 'relative': editMode }">
    <!--<div class="mx10 w-100 py10 mb15 edit-mode flex between-xs middle-xs" v-if="editMode">
      Edit mode
      <button class="brdr-none bg-cl-transparent" @click="closeEditMode">
        <span class="cl-accent">
          <i class="material-icons cl-accent mr5">
            close
          </i>
        </span>
      </button>
    </div>-->
    <div class="blend col-xs-4">
      <div>
        <product-image :image="image" />
      </div>
    </div>
    <div class="col-xs-8 flex flex-wrap">
      <div class="flex flex-nowrap details pr5">
        <div class="flex w-100 flex-wrap between-xs">
          <div class="full-width">
            <router-link
              class="helvetica h5 name"
              :to="productLink"
              data-testid="productLink"
              @click.native="$store.commit('ui/setMicrocart', false)"
            >
              {{ product.name | htmlDecode }}
            </router-link>
            <!-- <div class="h6 cl-bg-tertiary pt5 sku" data-testid="productSku">
              {{ product.sku }}
            </div> -->
            <div class="h6 cl-bg-tertiary pt5 options" v-if="isTotalsActive">
              <div v-for="opt in product.totals.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-html="opt.value" />
              </div>
            </div>
            <div class="h6 cl-bg-tertiary pt5 options" v-else-if="!editMode && product.options">
              <div v-for="opt in product.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-html="opt.value" />
              </div>
            </div>
            <div class="h6 pt5 cl-error" v-if="hasProductErrors">
              {{ product.errors | formatProductMessages }}
            </div>
            <!-- <div class="h6 pt5 cl-success" v-if="hasProductInfo && !hasProductErrors">
              {{ product.info | formatProductMessages }}
            </div> -->

            {{ product.totals }}
            <div class="flex mr10 align-left start-xs between-sm prices">
              <div class="prices" v-if="!displayItemDiscounts || !isOnline">
                <span class="h4 helvetica cl-error price-special" v-if="product.special_price">
                  {{ product.price_incl_tax * product.qty | price(storeView) }}
                </span>
                <span class="h6 helvetica price-original" v-if="product.special_price">
                  {{ product.original_price_incl_tax * product.qty | price(storeView) }}
                </span>
                <span class="h4 helvetica price-regular" v-else data-testid="productPrice">
                  {{ (product.original_price_incl_tax ? product.original_price_incl_tax : product.price_incl_tax) * product.qty | price(storeView) }}
                </span>
              </div>
              <div class="prices" v-else-if="isOnline && product.totals">
                <span class="h5 helvetica cl-error price-special" v-if="product.totals.discount_amount">
                  {{ product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount | price(storeView) }}
                </span>
                <span class="h6 helvetica price-original" v-if="product.totals.discount_amount">
                  {{ product.totals.row_total_incl_tax | price(storeView) }}
                </span>
                <span class="h4 helvetica price-regular" v-if="!product.totals.discount_amount">
                  {{ product.totals.row_total_incl_tax | price(storeView) }}
                </span>
              </div>
              <div class="prices" v-else>
                <span class="h5 helvetica price-regular">
                  {{ (product.regular_price || product.price_incl_tax) * product.qty | price(storeView) }}
                </span>
                <span class="h5 helvetica price-original" v-if="product.price != product.original_price">
                  {{ (product.original_price || product.price_incl_tax) * product.qty | price(storeView) }}
                </span>
              </div>
            </div>
            <div class="flex mr10 align-right product-qty end-xs between-sm ">
              <product-quantity
                class="h5 cl-accent lh25 qty"
                :value="productQty"
                :max-quantity="maxQuantity"
                :loading="isStockInfoLoading"
                :is-simple-or-configurable="isSimpleOrConfigurable"
                @input="updateProductQty"
                @error="handleQuantityError"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="w-100 pb15 flex flex-wrap bottom-xs" v-if="editMode">
        <div class="ml0 flex flex-wrap filters" v-if="productsAreReconfigurable">
          <div class="h5 pt5 w-100" v-for="(option, index) in product.configurable_options" :key="index">
            <div class="h6 cl-bg-tertiary mr10">
              {{ option.label }}:
            </div>
            <div class="flex flex-wrap pt5" v-if="option.label == 'Color' && editMode">
              <color-selector
                v-for="filter in getAvailableFilters[option.attribute_code]"
                v-if="isOptionAvailable(filter)"
                :key="filter.id"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
            <div class="flex flex-wrap pt5" v-else-if="option.label == 'Size' && editMode">
              <size-selector
                class="mr10 mb10"
                v-for="filter in getAvailableFilters[option.attribute_code]"
                v-if="isOptionAvailable(filter)"
                :key="filter.id"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
          </div>
        </div>
        <button-full
          class="update-button mb10 mr10"
          @click.native="updateProductVariant"
          :disabled="isUpdateCartDisabled"
        >
          {{ $t('Update item') }}
        </button-full>
      </div>
      <!--<div class="w-100 flex middle-xs actions" v-if="!editMode">
        <edit-button class="mx5" @click="openEditMode" v-if="productsAreReconfigurable && !editMode" />
        <remove-button class="mx5" @click="removeItem" />
      </div>-->
    </div>
  </li>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'

import ProductQuantity from 'theme/components/core/ProductQuantity.vue'
import ProductImage from 'theme/components/core/ProductImage'
import ColorSelector from 'theme/components/core/ColorSelector.vue'
import SizeSelector from 'theme/components/core/SizeSelector.vue'
import RemoveButton from './RemoveButton'
import EditButton from './EditButton'
import { onlineHelper } from '@vue-storefront/core/helpers'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import { getThumbnailForProduct, getProductConfiguration } from '@vue-storefront/core/modules/cart/helpers'
import ButtonFull from 'theme/components/theme/ButtonFull'
import EditMode from './EditMode'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'

export default {
  data () {
    return {
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    RemoveButton,
    ProductImage,
    ColorSelector,
    SizeSelector,
    EditButton,
    ButtonFull,
    ProductQuantity
  },
  mixins: [Product, ProductOption, EditMode],
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    }),
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0
    },
    hasProductErrors () {
      const errors = this.product.errors || {}
      const errorsValuesExists = Object.keys(errors).filter(errorKey => errors[errorKey]).length > 0
      return errorsValuesExists
    },
    isTotalsActive () {
      return this.isOnline && !this.editMode && this.product.totals && this.product.totals.options
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    productsAreReconfigurable () {
      return config.cart.productsAreReconfigurable && this.product.type_id === 'configurable' && this.isOnline
    },
    displayItemDiscounts () {
      return config.cart.displayItemDiscounts
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
    configuration () {
      return getProductConfiguration(this.product)
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    editMode () {
      return this.getEditingProductId === this.product.id
    },
    productQty () {
      return this.editMode ? this.getEditingQty : this.product.qty
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(this.product.type_id)
    },
    isUpdateCartDisabled () {
      return this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    updateProductVariant () {
      this.updateVariant()
      this.closeEditMode()
    },
    async updateProductQty (qty) {
      if (this.editMode) {
        await this.editModeSetQty(qty)
        return
      }

      await this.updateQuantity(qty)
    },
    removeFromCart () {
      this.$store.dispatch('cart/removeItem', { product: this.product })
    },
    async updateQuantity (quantity) {
      if (quantity === 0) {
        await this.removeFromCart()
        if (this.$ga) {
          this.$ga.event('Remove_From_Cart', 'click', JSON.stringify(this.gaData(this.product)));
        }
        return
      }
      const productMaxQuantity = await this.getQuantity(this.product)
      if (productMaxQuantity && quantity <= productMaxQuantity) {
        try {
          let currentQty = this.productQty
          await this.$store.dispatch('cart/updateQuantity', { product: this.product, qty: quantity })
          if (quantity > currentQty) {
            this.notifyUser(notifications.createNotification({ type: 'success', message: 'Product has been added to the Cart!!' }))
          }
          if(this.$ga) {
            let gaData = this.gaData(this.product)
            gaData.new_quantity = quantity;
            gaData.old_quantity = currentQty;
            this.$ga.event('Change_Quantity', 'click', JSON.stringify(gaData));
          }
        } catch (message) {
          this.notifyUser(notifications.createNotification({ type: 'error', message }))
        }
      } else {
        if (this.$ga) {
          let gaData = {
            product_name: this.product.name
          }
          this.$ga.event('Out_of_Stock', 'click', JSON.stringify(gaData));
        }
        this.notifyUser(notifications.outOfStock());
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
    async getQuantity (product) {
      if (this.isStockInfoLoading) return // stock info is already loading
      this.isStockInfoLoading = true
      try {
        const validProduct = product || this.product
        const res = await this.$store.dispatch('stock/check', {
          product: validProduct,
          qty: this.productQty
        })
        return res.qty
      } finally {
        this.isStockInfoLoading = false
      }
    },
    handleQuantityError (error) {
      this.quantityError = error
    },
    async changeEditModeFilter (filter) {
      const editedProduct = this.getEditedProduct(filter)
      const maxQuantity = await this.getQuantity(editedProduct)
      if (!maxQuantity) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'The product is out of stock and cannot be added to the cart!'
          ),
          action1: { label: this.$t('OK') }
        })
      } else if (maxQuantity < this.productQty) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Only {maxQuantity} products of this type are available!', { maxQuantity }),
          action1: { label: this.$t('OK') }
        })
      } else {
        this.maxQuantity = maxQuantity
        this.editModeSetFilters(filter)
      }
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, { root: true })
    },
  },
  watch: {
    isOnline: {
      async handler (isOnline) {
        if (isOnline) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      }
    },
    isMicrocartOpen: {
      async handler (isOpen) {
        if (isOpen) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
  .helvetica {
    font-family: Helvetica;
  }
  .blend {
    flex: 0 0 150px;
  }

  .list-item {
    border-bottom: 1px solid #D0D2D3;
  }

  .image {
    mix-blend-mode: multiply;
    vertical-align: top;
    width: 150px;
    @media (max-width: 767px) {
      width: 100px;
    }
  }

  .full-width {
    width: 100%;
  }

  .details {
    flex: 1 1 auto;
    display: flex;
    flex-flow: row wrap;
  }

  .name {
    color: #4D4D4D;
    opacity: 1;
    @media (max-width: 767px) {
      font-size: 14px;
    }
  }

  .options, .sku {
    @media (max-width: 767px) {
      font-size: 10px;
    }
  }

  .qty {
    // padding-right: 25px;

    @media (max-width: 767px) {
      font-size: 12px;
    }
  }

  .actions {
    margin: 0 -5px;
  }

  .prices {
    color: #f04d24cf;
    flex-direction: column;
    margin-top: 10px;
    @media (max-width: 767px) {
      padding: 0;
      font-size: 12px;
    }
  }

  .price-special {
    @media (max-width: 767px) {
      font-size: 14px;
    }
  }

  .price-original {
    text-decoration: line-through;
    color: #6D6E71;
    display: inline-block;
    margin-left: 6px;
    font-size: 12px;
  }

  input {
    width: 30px;
  }

  .flex-nowrap {
    flex-wrap: nowrap;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }
  .product-qty {
    margin-top: -35px;
    float: right;
    @media (max-width: 767px) {
    margin-top: -35px;
    }
  }
  .edit-mode {
    border-bottom: 1px solid color(white-smoke);
  }

  .filters {
    flex: 1 1 200px;
  }

  .update-button {
    font-size: 14px;
    min-width: 150px;
    width: 150px;
    padding: 10px;
  }
</style>
