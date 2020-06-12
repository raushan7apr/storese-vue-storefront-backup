<template>
  <section class="container my30 px15">
    <div class="row">
      <div
        class="col-xs-12 col-sm-6 col-md-3 card"
        v-for="(category, index) in visibleCategories"
        :key="index"
      >
        <router-link :to="categoryLink(category)">
          <div class="offer offer-product border-box p5 flex">
            <h2 class="title m0 h1">
              {{ category.name }}
            </h2>
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

    &:hover {
      opacity: 0.9;
    }

    @media (max-width: 767px) {
      height: 200px;
    }

    .title {
      text-align: center;
      margin-top: 2rem;
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
  .offer-product {
    height: 330px;
    background-position: 50% 20%;

    @media (max-width: 767px) {
      height: 330px;
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
