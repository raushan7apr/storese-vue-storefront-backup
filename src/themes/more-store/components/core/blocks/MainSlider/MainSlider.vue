<template>
  <section class="main-slider w-100 bg-cl-th-accent cl-white">
    <no-ssr>
      <carousel :per-page="1" pagination-active-color="#f04d24" pagination-color="#4d4d4d" v-bind:autoplay="true" v-bind:loop="true">
        <slide v-for="(slide, index) in slides" :key="index">
          <div class="container w-100" v-lazy:background-image="slide.image_url" v-link="slide.link" @click="$router.push(slide.link)">
            <div class="row middle-xs center-xs">
              <!--<div class="col-md-12 px10p">
                <p
                  class="subtitle mb0 serif uppercase h3 align-center"
                  data-testid="mainSliderSubtitle"
                >
                  {{ slide.subtitle }}
                </p>
                <h1 class="title mt0 mb30 align-center" data-testid="mainSliderTitle">
                  {{ slide.title }}
                </h1>
              </div>-->
            </div>
          </div>
        </slide>
      </carousel>
    </no-ssr>
  </section>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import sliderData from 'theme/resource/slider.json'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
import { CategoryService } from '@vue-storefront/core/data-resolver'

export default {
  name: 'CarouselSlide',
  data () {
    return {
      currentSlide: 1,
      slides: [],
      totalSlides: 1,
      sliderData: []
    }
  },
  components: {
    ButtonOutline,
    'Carousel': () => import(/* webpackChunkName: "vue-carousel" */ 'vue-carousel').then(Slider => Slider.Carousel),
    'Slide': () => import(/* webpackChunkName: "vue-carousel" */ 'vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR
  },
  methods: {
    updateSliderData (data) {
      if (data.code === 200) {
        this.slides = data.result.banner_items
        this.totalSlides = data.result.banner_items.length
      } else {
        this.slides = sliderData.slides
        this.totalSlides = sliderData.total
      }
    },
    async fetchHomepageBanners () {
      this.updateSliderData(await CategoryService.fetchBanners())
    }
  },
  mounted () {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % (this.totalSlides)
    }, 16000)
  },
  created () {
    this.fetchHomepageBanners()
  }
}
</script>
<style lang="scss">
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white: color(white);
.main-slider {
  .VueCarousel-pagination {
    position: absolute;
    bottom: -4px;
  }
  .VueCarousel-dot--active .VueCarousel-dot-inner {
    border: 2px solid $color-white;
    margin-top: -2px;
  }
  }
  .VueCarousel-dot--active .VueCarousel-dot-inner {
    border: 2px solid $color-white;
    margin-top: -2px;
  }
  
  .VueCarousel-pagination button.VueCarousel-dot {
    padding:6px 4px!important;
  }
</style>
<style scoped>

.VueCarousel {
  box-shadow: 1px 1px 10px #ccc;
  transform:translateY(-8px);
}
h1 {
  font-size: 72px;
}
.main-slider {
  cursor: pointer;
  height: 520px;
  background:#f7f7f7!important;
}
.container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.main-slider .container {
    max-height:520px;
  }
.row {
  height: 640px;
}
@media (max-width: 75em) {
  .main-slider {
    height: 400px;
  }
  .title {
    font-size: 50px;
  }
  .subtitle {
    font-size: 20px;
  }
  .row {
    height: 400px;
  }
}
@media (max-width: 64em) {
  .main-slider {
    height: 359px;
  }
  .container {
    background-position: left;
  }
  .title {
    font-size: 48px;
  }
  .subtitle {
    font-size: 18px;
  }
  .button {
    font-size: 16px;
  }
  .row {
    height: 359px;
  }
}
@media (max-width: 45em) {
  .main-slider {
    height: 200px;
  }
  .container {
    background-position: left;
  }
  .title {
    font-size: 24px;
  }
  .subtitle {
    font-size: 14px;
  }
  .button {
    font-size: 13px;
  }
  .row {
    height: 200px;
  }
}

@media(max-width:767px) {
  .main-slider {
    max-height:150px!important;
  }
  .main-slider .container {
    max-height:150px;
  }
}
@media(max-width:422px) {
  .main-slider {
    height:130px;
  }
  .main-slider .container {
    height:130px;
  }
}



</style>
