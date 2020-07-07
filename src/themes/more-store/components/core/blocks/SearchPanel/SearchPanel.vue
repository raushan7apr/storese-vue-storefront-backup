<template>
  <div class="searchpanel">
    <div>
      <div>
        <div class="search-input-group">
          <i class="material-icons left-icon" @click="closeSearch()">arrow_back</i>
          <input
            ref="search"
            id="search"
            v-model="search"
            @input="makeSearch"
            @blur="$v.search.$touch()"
            class="search-panel-input ml0 mr0"
            :placeholder="$t('Search')"
            type="search"
            @click="open = true"
          >
          <i class="material-icons search-icon">search</i>
        </div>
      </div>
    </div>
    <div v-if="open" class="product-listing-border">
      <div v-if="visibleProducts.length && categories.length > 1" class="categories">
        <category-panel :categories="categories" v-model="selectedCategoryIds" />
      </div>
      <div class="product-listing row">
        <product-list
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          @click.native="closeSearchpanel;"
        />
        <transition name="fade">
          <div
            v-if="getNoResultsMessage"
            class="no-results relative center-xs h4 col-md-12"
          >
            {{ $t(getNoResultsMessage) }}
          </div>
        </transition>
      </div>
      <div
        v-show="OnlineOnly"
        v-if="visibleProducts.length >= 18"
        class="buttons-set align-center py35 mt20 px40"
      >
        <button
          @click="seeMore" v-if="readMore"
          class="no-outline brdr-none py15 px20 bg-cl-mine-shaft :bg-cl-th-secondary cl-white fs-medium-small"
          type="button"
        >
          {{ $t('Load more') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SearchPanel from '@vue-storefront/core/compatibility/components/blocks/SearchPanel/SearchPanel'
import ProductList from 'theme/components/core/ProductList'
import VueOfflineMixin from 'vue-offline/mixin'
import CategoryPanel from 'theme/components/core/blocks/Category/CategoryPanel'
import { minLength } from 'vuelidate/lib/validators'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
  components: {
    ProductList,
    CategoryPanel
  },
  mixins: [SearchPanel, VueOfflineMixin],
  validations: {
    search: {
      minLength: minLength(3)
    }
  },
  data () {
    return {
      selectedCategoryIds: [],
      open: false
    }
  },
  beforeMount () {
    window.addEventListener('click', this.close);
  },
  beforeDestroy () {
    this.open = false
    window.removeEventListener('click', this.close);
  },
  methods: {
    closeSearch () {
      this.$store.commit('ui/setSearchpanel', false)
    },
    close (e) {
      if (!this.$el.contains(e.target)) {
        this.open = false;
        this.search = ''
      }
    }
  },
  computed: {
    visibleProducts () {
      const productList = this.products || []
      if (this.selectedCategoryIds.length) {
        return productList.filter(product => product.category_ids.some(categoryId => {
          return this.selectedCategoryIds.includes(categoryId)
        }))
      }
      if (this.$ga) {
        let gaData = {
          search_query: this.search,
          num_results: productList.length
        }
        this.$ga.event('Search_Event', 'input', JSON.stringify(gaData))
      }
      if (this.$ga && productList.length == 0) {
        let gaData = {
          product_name: this.search
        }
        this.$ga.event('Out_of_Stock', 'search', JSON.stringify(gaData));
      }
      return productList
    },
    categories () {
      return []
    },
    getNoResultsMessage () {
      let msg = ''
      if (!this.$v.search.minLength && this.emptyResults) {
        msg = 'Searched term should consist of at least 3 characters.'
      } else if (this.emptyResults) {
        msg = 'No results were found.'
      }
      return msg
    }
  },
  watch: {
    categories () {
      this.selectedCategoryIds = []
    }
  },
  mounted () {
    // add autofocus to search input field
    this.$refs.search.click()
    // disableBodyScroll(this.$el)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/grid";
@import "~theme/css/variables/typography";

@media (min-width: 767px) {
  .product-listing-border {
    border: 3px solid #bdbdbd;
    border-top: none;
    border-radius: 0px 0px 5px 5px;
    outline: none;
    margin: 0px;
    background: #fff;
  }
}

.search-input-group {
  border-bottom: 1px solid #d1d2d3;
}

.searchpanel {
  height: auto;
  width: 100%;
  top: 0;
  right: 0;
  z-index: 3;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #fff;

  .close-icon-row {
    display: flex;
    justify-content: flex-end;
  }

  .container {
    padding-left: 40px;
    padding-right: 40px;

    @media #{$media-xs} {
      padding-left: 30px;
      padding-right: 30px;
    }
  }

  .row {
    margin-left: - map-get($grid-gutter-widths, lg) / 2;
    margin-right: - map-get($grid-gutter-widths, lg) / 2;

    @media #{$media-xs} {
      margin-right: - map-get($grid-gutter-widths, xs) / 2;
      margin-left: - map-get($grid-gutter-widths, xs) / 2;
    }
  }

  .col-md-12 {
    padding-left: map-get($grid-gutter-widths, lg) / 2;
    padding-right: map-get($grid-gutter-widths, lg) / 2;

    @media #{$media-xs} {
      padding-left: map-get($grid-gutter-widths, xs) / 2;
      padding-right: map-get($grid-gutter-widths, xs) / 2;
    }
  }

  .product-listing {
    background: #fff;
    // padding-top: 30px;
    margin-left: 0px; 
    margin-right: 0px;
  }

  .product {
    box-sizing: border-box;
    /*width: 33.33%;*/
    padding-left: map-get($grid-gutter-widths, lg) / 2;
    padding-right: map-get($grid-gutter-widths, lg) / 2;

    @media #{$media-xs} {
      width: 100%;
      padding-left: map-get($grid-gutter-widths, xs) / 2;
      // padding-right: map-get($grid-gutter-widths, xs) * 3;
    }
  }

  .close-icon {
    padding: 18px 8px;
  }

  .search-input-group {
    display: flex;
    // border-bottom: 1px solid #bdbdbd;
  }

  .search-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 767px) {
    .left-icon {
      display: none;
    }
  }

  .search-panel-input {
    width: 100%;
    max-height: 50px;
    padding-bottom: 0;
    padding-top: 8px;
    border: none;
    outline: 0;
    font-size: 18px;
    // font-family: Helvetica;
    caret-color: #f57151;
    // font-family: "map-get($font-families, secondary)";
    font-family: 'Nunito', sans-serif !important;
    @media #{$media-xs} {
      font-size: 16px;
    }
  }

  .no-results {
    top: 80px;
    width: 100%;
  }

  i {
    opacity: 0.6;
  }

  i:hover {
    opacity: 1;
  }

  .close-button {
    background: #fff;
  }

  button {
    @media #{$media-xs} {
      width: 100%;
      margin-bottom: 15px;
    }
  }
 }
</style>
