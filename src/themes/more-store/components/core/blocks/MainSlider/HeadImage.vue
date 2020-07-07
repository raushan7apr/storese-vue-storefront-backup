<template>
  <section class="head-image w-100 cl-white">
    <div class="container w-100 h-100 cl-black">
      <main-slider />
    </div>
  </section>
</template>

<script>
// import ButtonOutline from 'theme/components/theme/ButtonOutline'
import MainSlider from 'theme/components/core/blocks/MainSlider/MainSlider';
import { mapGetters } from 'vuex'

export default {
  components: {
    // ButtonOutline
    MainSlider
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      currentImage: 'promoted/getHeadImage'
    })
  }
}
</script>

<style lang="scss" scoped>
.head-image {
  .head-image-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 15%;

    .title {
      font-size: 3.4rem;
      margin-bottom: 0;
    }

    .subtitle {
      font-size: 0.8rem;
      max-width: 340px;
      font-family: Helvetica;
      line-height: 1.2rem;
    }
  }
}

.head-image {
  /*height: 640px;*/
  margin-top: 20px;
}
.container {
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
}
.row {
  height: 640px;
}
@media (max-width: 75em) {
  .head-image {
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
  .head-image {
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
  .head-image {
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
   section.head-image {
    height: 150px;
  }
}
@media(max-width:422px) {
  section.head-image {
  height:130px;
  }
}
</style>
