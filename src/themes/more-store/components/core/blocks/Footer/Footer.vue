<template>
  <footer :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }">
    <!-- <newsletter class=" flex brdr-bottom-1 brdr-cl-secondary" v-if="!isCheckoutPage" /> -->
    <div
      class="footer-links pt10 pb60 bg-cl-secondary"
      v-if="!isCheckoutPage"
    >
      <div class="container-fluid">
        <div class="row m0 between-md">
          <div
            class="row m0 col-xs-12 between-md between-xs"
          >
            <div class="start-md footer_info">
              <div class="mt15">
                <router-link class="cl-secondary" :to="localizedRoute('/terms-and-condition')" exact>
                  {{ $t('Terms and Conditions') }}
                </router-link>
              </div>
              <div class="mt15">
                <a class="cl-secondary" href="tel:8108138000">
                  {{ $t('Call Us 8108138000') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="container-fluid" v-if="!isCheckoutPage">
      <div class="row middle-xs px15 bottom-links">
        <div class="col-xs-5 col-sm-3 cl-tertiary">
          <language-switcher v-if="multistoreEnabled" />
        </div>
        <div class="col-xs col-sm-9 end-xs">
          <ul class="pl0 links" data-testid="bottomLinks">
            <li class="footer__version-info">
              {{ getVersionInfo }}
            </li>
            <li class="inline-flex">
              <router-link
                class="cl-tertiary mr10 underline"
                to="/legal"
                exact
              >
                {{ $t('Legal notice') }}
              </router-link>
            </li>
            <li class="inline-flex">
              <router-link
                class="cl-tertiary underline"
                to="/privacy"
                exact
              >
                {{ $t('Privacy policy') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div> -->
   
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import CurrentPage from 'theme/mixins/currentPage'
import LanguageSwitcher from '../../LanguageSwitcher.vue'
import Newsletter from 'theme/components/core/blocks/Footer/Newsletter'
import BackToTop from 'theme/components/core/BackToTop'
import { getPathForStaticPage } from 'theme/helpers'
import config from 'config'

export default {
  mixins: [CurrentPage],
  name: 'MainFooter',
  methods: {
    goToAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    getLinkFor (path) {
      return localizedRoute(getPathForStaticPage(path))
    }
  },
  computed: {
    ...mapGetters({
      isLogged: 'user/isLoggedIn'
    }),
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`
    }
  },
  components: {
    Newsletter,
    LanguageSwitcher,
    BackToTop
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-secondary: color(secondary);

.icon {
  transition: 0.3s all;
}

.social-icon {
  width: 40px;
  height: 40px;
  &:hover,
  &:focus,
  &:active {
    .icon {
      fill: $color-secondary;
    }
  }
}
.links {
  list-style-type: none;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}

.bottom-links {
  @media (max-width: 767px) {
    padding: 0;
  }
}

.footer__version-info {
  display: flex;
  color: $color-secondary;
  font-size: 0.7rem;
  @media (min-width: 768px) {
    margin-right: 1rem;
    font-size: 0.8rem;
  }
}

.underline {
  &:hover {
    color: $color-secondary;
    &:after {
      background-color: $color-secondary;
    }
  }
}
.legal-entity-link {
  text-align: center;
  @media (min-width: 768px) {
    display: none;
  }
}

.privacy-policy-link {
  text-align: right;
  @media (min-width: 768px) {
    display: none;
  }
}

@media (max-width: 595px) {
  .no-mobile {
    display: none;
  }

  .social {
    margin-top: 0;
  }

  .footer-links {
    padding-bottom: 0px;
  }
}
footer {
  background:#4d4d4d;
}

.footer_info {
  display:flex;
  justify-content:space-between;
  width: 100%;
  padding-bottom: 16px;
}

.footer-links {
  background:#4d4d4d;
}
 .footer-links a {
   color:#fff;
 }
.bottomLinks li {
color: #828282;
}
.bottomLinks li  a {
  color: #808184;
}
a.store-locale {
      color: #808184;
}
.footer__version-info[data-v-00152f92] {
      margin-top: 3px;
}
</style>
