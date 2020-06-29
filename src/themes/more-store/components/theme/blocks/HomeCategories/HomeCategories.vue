<template>
  <section class="container bg-d1d1d1 w-100 my30">
    <div class="row">
      <div
        class="col-xs-4 col-sm-4 col-md-4"
        v-for="(category, index) in visibleCategories"
        :key="index"
      >
        <div @click="categoryRedirect(category)" class="offer offer-product border-box flex">
          <img v-if="category.thumbnail" v-bind:src="category.thumbnail" class="mb10 offer-product-image">
          <img v-else src="/assets/placeholder.svg" class="mb10 offer-product-image" style="opacity: 0.4">
          <div class="category-name m0 h1">
            {{ category.name }}
          </div>
        </div>
      </div>
    </div>
      <div
        class=""
        v-for="(category, index) in ChildrenCategory"
        :key="index"
      >
        <img v-if="category.image" v-bind:src="category.image" class="mb10 category-banner">
       
         <img v-else src="/assets/placeholder.svg" class="mb10 category-banner" style="opacity: 0.4">
        
        <div class="row product_bottom">
        <div
          class="col-xs-4 col-sm-4 col-md-4"
          v-for="(children_category, index) in category.children_data"
          :key="index"
        >
          <div @click="categoryRedirect(children_category)" class="offer offer-product border-box flex">
            <img v-if="children_category.thumbnail" v-bind:src="children_category.thumbnail" class="mb10 offer-product-image">
            <img v-else src="/assets/placeholder.svg" class="mb10 offer-product-image" style="opacity: 0.4">
            <div class="category-name m0 h1">
              {{ children_category.name }}
            </div>
          </div>
        </div>
        <!-- <div @click="categoryRedirect(category)" class="offer offer-product border-box flex">
          <img v-if="category.image" v-bind:src="category.image" class="m10 offer-product-image">
          <img v-else src="/assets/place_holder_2.png" class="m10 offer-product-image" style="opacity: 0.4">
          <div class="category-name m0 h1">
            {{ category.name }}
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu';
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import staticUrl from 'theme/resource/static-url.json'

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
        if (category.image && category.image.indexOf('http') === -1) {
          category.image = staticUrl.path[0].image_url + category.image;
        }
        if (category.thumbnail && category.thumbnail.indexOf('http') === -1) {
          category.thumbnail = staticUrl.path[0].image_url + category.thumbnail;
        }
        return category.product_count > 0 && category.children_count === 0 && category.include_in_menu === 0
      })
    },
    ChildrenCategory () {
      return this.categories.filter(category => {
        if (category.image && category.image.indexOf('http') === -1) {
          category.image = staticUrl.path[0].image_url + category.image;
        }
        if (category.thumbnail && category.thumbnail.indexOf('http') === -1) {
          category.thumbnail = staticUrl.path[0].image_url + category.thumbnail;
        }
        if(category.children_count>0){
          category.children_data.forEach(function(item){
              item.thumbnail = staticUrl.path[0].image_url + item.thumbnail;
          });
        }
        return category.product_count > 0 && category.children_count > 0 && ( category.include_in_menu === 0  || category.include_in_menu === false )
      })
    }
  },
  methods: {
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
        source: "Home Page"
      }
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
  .mb10 {
    margin-bottom:10px;
  }
  .product_bottom {
      margin-bottom:25px;
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
    cursor: pointer;

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
      font-family: Helvetica;
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
    object-fit: cover;
    height: 132px;
    width: 132px;
    @media (max-width: 767px) {
    height: 115px;
    width: 115px;
    object-fit: cover;
    }
  }
  .category-banner {
    // height: 300px;
     max-width: 100%;
    @media (max-width: 767px) {
    // height: 115px;
    // width: 115px;
    }
  }
  .offer-product {
    padding:15px;
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
