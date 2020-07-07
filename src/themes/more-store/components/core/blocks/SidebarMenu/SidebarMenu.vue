<template>
  <div class="sidebar-menu fixed mw-100 bg-cl-secondary">
    <div class="row brdr-bottom-1 brdr-cl-bg-secondary">
      <div
        v-if="submenu.depth"
        class="col-xs bg-cl-primary"
      >
        <sub-btn type="back" class="bg-cl-transparent brdr-none" />
      </div>
      <div class="col-xs bg-cl-primary d-flex menu-header">
        <div class="w-100 inline-flex bg-cl-transparent brdr-none p0 p15">
           {{ $t('Categories') }}
        </div>
        <div
          type="button"
          :aria-label="$t('Close')"
          class="w-100 inline-flex end-xs bg-cl-transparent brdr-none p0 close-btn"
          @click="closeMenu"
        >
          <i class="material-icons p15">highlight_off</i>
        </div>
      </div>
    </div>
    <div class="sidebar-menu__container row" ref="container">
      <div class="col-xs-12 h4 nunito">
        <ul class="p0 m0 relative sidebar-menu__list" :style="mainListStyles">
          <!-- <li
            @click="closeMenu"
            class="sidebar-element-home brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary"
          >
            <router-link
              class="block px25 8 cl-accent no-underline"
              :to="localizedRoute('/')"
              exact
            >
              {{ $t('Home') }}
            </router-link>
          </li> -->
         <li @click="closeMenu" :key="category.slug" v-for="category in visibleCategories">
          <div v-if="category.children_count > 0">
          <sub-category-menu 
            :category-links="category.children_data"
            :id="category.id"
            :parent-slug="category.slug"
            :parent-path="category.url_path"
            :title="category.name" height="h-24"/>
          </div>
          <div class="sidebar-element brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary" v-else >
            <router-link
                class="py8 cl-accent no-underline col-xs"
                :to="categoryLink(category)"
              >
              <span class="bullets-container">&#8226; </span>
              <span class="category-name-container">
                {{ category.name }}
             </span>
            </router-link>
          </div>
        </li>
          <!-- <li
            class="sidebar-element brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary flex"
            :key="category.slug"
            @click="closeMenu"
            v-for="category in visibleCategories"
          >
            <div
              v-if="isCurrentMenuShowed"
              class="subcategory-item"
            >
              <sub-btn
                v-if="category.children_count > 0"
                class="bg-cl-transparent brdr-none fs-medium helvetica"
                :id="category.id"
                :name="category.name"
              />
              <router-link
                v-else
                class="px25 py8 cl-accent no-underline col-xs"
                :to="categoryLink(category)"
              >
                {{ category.name }}
              </router-link>
            </div>
            <sub-category
              :category-links="category.children_data"
              :id="category.id"
              :parent-slug="category.slug"
              :parent-path="category.url_path"
            />
          </li> -->
          <!-- <li
            v-if="isCurrentMenuShowed"
            @click="closeMenu"
            class="bg-cl-secondary"
          >
            <router-link
              class="block px25 py8 brdr-bottom-1 brdr-cl-secondary cl-accent no-underline fs-medium-small"
              :to="localizedRoute('/sale')"
              exact
            >
              {{ $t('Sale') }}
            </router-link>
          </li>
          <li
            v-if="isCurrentMenuShowed"
            @click="closeMenu"
            class="bg-cl-secondary"
          >
            <router-link
              class="block px25 py8 brdr-bottom-1 brdr-cl-secondary cl-accent no-underline fs-medium-small"
              :to="localizedRoute('/magazine')"
              exact
            >
              {{ $t('Magazine') }}
            </router-link>
          </li>
          <li
            v-if="compareIsActive && isCurrentMenuShowed"
            @click="closeMenu"
            class="bg-cl-secondary"
          >
            <router-link
              class="block px25 py8 brdr-bottom-1 brdr-cl-secondary cl-accent no-underline fs-medium-small"
              :to="localizedRoute('/compare')"
              exact
            >
              {{ $t('Compare products') }}
            </router-link>
          </li>
          <li
            @click="login"
            class="brdr-bottom-1 brdr-cl-secondary bg-cl-secondary flex"
          >
            <sub-btn
              v-if="currentUser"
              id="my-account-links"
              :is-category="false"
              :name="$t('My account')"
              class="bg-cl-transparent brdr-none fs-medium-small"
            />
            <sub-category
              v-if="currentUser"
              :my-account-links="myAccountLinks"
              id="my-account-links"
              @click.native="closeMenu"
            />
            <a
              v-if="!currentUser && isCurrentMenuShowed"
              href="#"
              @click.prevent="closeMenu"
              class="block w-100 px25 py8 cl-accent no-underline fs-medium-small"
            >
              {{ $t('My account') }}
            </a>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import i18n from '@vue-storefront/i18n'
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu'
import SubBtn from 'theme/components/core/blocks/SidebarMenu/SubBtn'
import SubCategory from 'theme/components/core/blocks/SidebarMenu/SubCategory'
import SubCategoryMenu from 'theme/components/core/blocks/SidebarMenu/SubCategoryMenu'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
  components: {
    SubCategory,
    SubCategoryMenu,
    SubBtn
  },
  mixins: [SidebarMenu],
  data () {
    return {
      myAccountLinks: [
        {
          id: 1,
          name: i18n.t('My profile'),
          url: '/my-account'
        },
        {
          id: 2,
          name: i18n.t('My shipping details'),
          url: '/my-account/shipping-details'
        },
        {
          id: 3,
          name: i18n.t('My newsletter'),
          url: '/my-account/newsletter'
        },
        {
          id: 4,
          name: i18n.t('My orders'),
          url: '/my-account/orders'
        },
        {
          id: 5,
          name: i18n.t('My loyalty card'),
          url: '#'
        },
        {
          id: 6,
          name: i18n.t('My product reviews'),
          url: '#'
        }
      ],
      componentLoaded: false
    }
  },
  computed: {
    mainListStyles () {
      return this.submenu.depth ? `transform: translateX(${this.submenu.depth * 100}%)` : false
    },
    ...mapState({
      submenu: state => state.ui.submenu,
      currentUser: state => state.user.current
    }),
    getSubmenu () {
      return this.submenu
    },
    visibleCategories () {
      return this.categories.filter(category => {
        category.open = false;
        return (category.product_count > 0 || category.children_count > 0) && ( category.include_in_menu === 1  || category.include_in_menu === true )
      })
    },
    isCurrentMenuShowed () {
      return !this.getSubmenu || !this.getSubmenu.depth
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true;
      disableBodyScroll(this.$refs.container)
    })
  },
  destroyed () {
    clearAllBodyScrollLocks()
  },
  methods: {
    login () {
      if (!this.currentUser && this.isCurrentMenuShowed) {
        this.$nextTick(() => {
          this.$store.commit('ui/setAuthElem', 'login')
          this.$bus.$emit('modal-show', 'modal-signup')
          this.$router.push({ name: 'my-account' })
        })
      }
    },
    openSubMenu (category) {

      category.open=true
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$bg-secondary: color(secondary, $colors-background);
$color-gainsboro: color(gainsboro);
$color-matterhorn: color(matterhorn);
$color-mine-shaft: color(mine-shaft);

.helvetica {
  font-family: Helvetica;
}
.nunito {
  font-family: 'Nunito', sans-serif !important;
}
.sidebar-element {
  padding: 15px 0px 15px 15px;
}
.sidebar-element-home  {
  padding: 15px 0px;
}
.menu-header {
  background: #f04d24cf;
  color: #fff;
  font-weight: 500;
  font-size: 24px;
}
.bullets-container {
  font-size: 17px;
}
.category-name-container {

}
.sidebar-menu {
  background: #fff;
  height: 100%;
  width: 90%;
  overflow: hidden;
  .d-flex {
    display:flex;
  }

  @media (max-width: 767px) {
    width: 90%;
  }

  &__container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100% - 55px);
  }

  &__list {
    transition: transform $duration-main $motion-main;
  }

  ul {
    list-style-type: none;
  }

  li {
    &:hover,
    &:focus {
      // background-color: $color-gainsboro;
    }
    &.bg-cl-primary {
      &:hover,
      &:focus {
        // background-color: $bg-secondary;
      }
    }
    a {
      color: #000;
      font-size: 14px;
    }
  }

  // .subcategory-item {
  //   display: flex;
  //   width: 100%;
  // }

  button {
    color: #000;a {
      color: #000;
    }
  }

  .close-btn {
    i {
      color: $color-gainsboro;
    }
    &:hover,
    &:focus {
      i {
        color: $color-matterhorn;
      }
    }
  }

}
</style>
