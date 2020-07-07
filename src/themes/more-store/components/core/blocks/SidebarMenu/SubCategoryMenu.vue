<template>
    <li  class="sidebar-element sub-element brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary">
    <div v-if="children" class="no-underline col-xs" @click.stop.prevent="toggleShow">
      <span v-if="showMenu" class="bullets-container  active-color">
          &#8226;
      </span>
      <span class="bullets-container" v-else>
          &#8226;
      </span>
      {{title}}
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" :class="{'rotate-90' : showMenu}" class="dropdown-menu" viewBox="0 4 24 24">
        <path fill="none" d="M0 0h24v24H0V0z"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
    </div>
    <ul class="py8 no-underline col-xs" :class="this.class" v-show="showMenu">
      <li
        class="sidebar-sub-element brdr-bottom-1 brdr-cl-bg-secondary bg-cl-primary flex"
        :key="link.slug"
        v-for="link in children"
      >
        <router-link
            class="py8 no-underline col-xs"
            :to="categoryLink(link)"
            >
            {{ link.name }}
        </router-link>
      </li>
    </ul>
 </li>
</template>
<script>
import { mapState } from 'vuex'
import SubBtn from './SubBtn.vue'
import i18n from '@vue-storefront/i18n'
import config from 'config'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'

export default {
  name: 'SubCategoryMenu',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: [String, Number],
      required: true
    },
    height: {
      type: [String, Number],
      required: true
    },
    categoryLinks: {
      type: null,
      required: false,
      default: false
    },
    parentSlug: {
      type: String,
      required: false,
      default: ''
    },
    parentPath: {
      type: String,
      required: false,
      default: ''
    },
    myAccountLinks: {
      type: null,
      required: false,
      default: false
    }
    },
  data() {
    return {
      showMenu: false
    };
  },
  computed: {
    children () {
      if (this.categoryLinks && this.categoryLinks.length > 0 && this.categoryLinks[0].name) { 
        return this.categoryLinks
      } 
    },
    hasChildren () {
      return this.children && this.children.length
    },
    class() {
      return this.showMenu ? this.height : "h-0";
    }
  },
  methods: {
    toggleShow() {
      this.showMenu = !this.showMenu;
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    }
  },

}
</script>
<style scoped>
.bullets-container {
  font-size: 17px;
}
.sidebar-element {
    color: #000;
    font-size: 14px;
}
.active-color {
    color: #f04d24cf
}
.dropdown-menu {
    float: right;
    transition: 300ms;
}
svg.rotate-90 {
    transform: rotate(90deg);
}
</style>
