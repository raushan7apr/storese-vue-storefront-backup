<template>
  <section class="container bg-d1d1d1 w-100 my30">
    <div class="row">
      <div
        class="col-xs-4 col-sm-4 col-md-4"
        v-for="(category, index) in visibleCategories"
        :key="index"
      >
        <router-link :to="categoryLink(category)">
          <div class="offer offer-product border-box flex">
            <img v-if="category.image" v-bind:src="category.image" class="m10 offer-product-image">
            <img v-else src="/assets/placeholder.svg" class="m10 offer-product-image" style="opacity: 0.4">
            <div class="category-name m0 h1">
              {{ category.name }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'

export default {
  name: 'HomeCategories',
  props: {
    singleBanner: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [SidebarMenu],
  computed: {
    visibleCategories () {
      return this.categories.filter(category => {
        if (category.image) {
          category.image = 'https://preprod-admin.storese.in/pub/media/catalog/category/' + category.image;
        }
        return category.product_count > 0 || category.children_count > 0
      })
    }
  },
  methods: {
    categoryLink (category) {
      return formatCategoryLink(category)
    }
  }
}
</script>

<style lang="scss" scoped>
  .category-name {
    padding-top: 0px;
    font-size: 12px;
    color: #f04e23;
    font-weight: bold;
    margin-right: 5px;
    margin-left: 5px;
    // font-size: 16px;
    // color: #232d5f;
    // font-weight: bold;
    @media (max-width: 767px) {
      height: 16px;
    }
  }

  .bg-d1d1d1 {
    background-color: rgb(242, 242, 242);
  }

  .card {
    background-color: #e6e6e6;
    margin: 5px;
  }
  .offer-container {
    &:last-child {
      padding-bottom: 0;
    }
  }
  .offer {
    height: 735px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1;
    transition: 0.3s all;
    background-color: #fff;
    margin: 8px -5px;
    box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.08);
    border-radius: 3px;

    &:hover {
      opacity: 0.9;
    }

    @media (max-width: 767px) {
      height: 200px;
    }

    .title {
      text-align: center;
      margin-top: 0.5rem;
      @media (max-width: 767px) {
        background-color: rgba(255,255,255,0.4);
        padding: 0.5rem;
        line-height: 2.4rem;
      }
    }

    .subtitle {
      font-family: 'Roboto', sans-serif;
      @media (max-width: 767px) {
        background-color: rgba(255,255,255,0.4);
        padding: 0.5rem;
      }
    }
  }
  .offer-small {
    height: 360px;

    @media (max-width: 767px) {
      height: 200px;
    }
  }
  .offer-product-image {
    height: 132px;
    width: 132px;
    @media (max-width: 767px) {
    height: 115px;
    width: 115px;
    }
  }
  .offer-product {
    height: 180px;
    background-position: 50% 20%;

    @media (max-width: 767px) {
      height: 168px;
    }
  }
  .title {
    @media (max-width: 767px) {
      font-size: 36px;
    }
  }
  .subtitle {
    @media (max-width: 767px) {
      font-size: 18px;
    }
  }
</style>
