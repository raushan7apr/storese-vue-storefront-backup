<template>
  <div class="sidebar">
    <h4 class="sidebar__header relative mt35 mb20 flex">
      <span class="sidebar__header__text nunito"> {{ $t('Filter') }} </span>
      <span
        class="weight-400 sidebar__header__clear sidebar__header__text pointer sans-serif flex lh25"
        @click="resetAllFilters"
        v-show="hasActiveFilters"
      >
        <i class="material-icons mr5 cancel-icon">
          cancel
        </i>
        {{ $t('Clear filters') }}
      </span>
    </h4>
    <div
      class="sidebar__elements"
      v-for="(filter, filterIndex) in availableFilters"
      :key="filterIndex"
    >
<!-- 
      <div v-if="filterIndex==='color'">
        <color-selector
          context="category"
          code="color"
          v-for="(color, index) in filter"
          :key="index"
          :variant="color"
          :selected-filters="getCurrentFilters"
          @change="$emit('changeFilter', $event)"
        />
      </div>
      <div v-else-if="filterIndex==='size'">
        <size-selector
          context="category"
          code="size"
          class="size-select mr10 mb10"
          v-for="(size, index) in sortById(filter)"
          :key="index"
          :variant="size"
          :selected-filters="getCurrentFilters"
          @change="$emit('changeFilter', $event)"
        />
      </div> -->
      <div v-if="filterIndex==='price'">
        <h5 class="nunito">
          {{ $t(filterIndex + '_filter') }}
        </h5>
        <price-selector
          context="category"
          class="price-select mb10 block"
          code="price"
          v-for="(price, index) in filter"
          :key="index"
          :id="price.id"
          :from="price.from"
          :to="price.to"
          :content="price.label"
          :variant="price"
          :selected-filters="getCurrentFilters"
          @change="$emit('changeFilter', $event)"
        />
      </div>
      <!-- <div v-else class="sidebar__inline-selecors">
        <generic-selector
          context="category"
          class="mr10 mb10 block"
          :code="filterIndex"
          v-for="(option, index) in filter"
          :key="index"
          :variant="option"
          :selected-filters="getCurrentFilters"
          @change="$emit('changeFilter', $event)"
        />
      </div> -->
    </div>
    <!-- add the custom controls to other available filters set in config.products.defaultFilters; must be numeric field in ES
    <div v-if="filters.erin_recommends && filters.erin_recommends.length">
      <h5>
        {{ $t('Erin recommends') }}
      </h5>
      <div
        class="size-select mr10 mb10"
        v-for="(er, index) in filters.erin_recommends"
        :key="index"
        :id="er.id"
        :label="er.label"
      >{{ er.label }}</div>
    </div>
    -->
  </div>
</template>

<script>
import ColorSelector from 'theme/components/core/ColorSelector'
import SizeSelector from 'theme/components/core/SizeSelector'
import PriceSelector from 'theme/components/core/PriceSelector'
import GenericSelector from 'theme/components/core/GenericSelector'
import pickBy from 'lodash-es/pickBy'

export default {
  components: {
    ColorSelector,
    SizeSelector,
    PriceSelector,
    GenericSelector
  },
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasActiveFilters () {
      return this.$store.getters['category-next/hasActiveFilters']
    },
    getCurrentFilters () {
      return this.$store.getters['category-next/getCurrentFilters']
    },
    availableFilters () {
      return pickBy(this.filters, (filter, filterType) => { return (filter.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(filterType)) })
    }
  },
  methods: {
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.helvetica {
  font-family: 'Helvetica';
}
.nunito {
  font-family: 'Nunito', sans-serif !important;
}
@media (min-width: 768px){
  .sidebar__header {
    margin-top: 35px;
  }
  .sidebar__header__text{
    margin: 20px 20px
  }
  .sidebar {
    background-color: #fff;
    box-shadow: 2px 2px 5px 1px #e1e1e1;
  }
}
@media (max-width:768px){
  .sidebar__header__text{
    margin: 12px 20px;
    text-transform: uppercase;
  }
  .sidebar {
    background-color: transparent;
    box-shadow: 0px;
  }
  .sidebar__header {
    display: none;
  }
}
.sidebar__header {
  color: #fff;
  background-color: #f04d24cf;
  font-weight: 100;
}
cancel-icon {
  color: #f04d24cf;
}
.sidebar__header__text{
  color: #fff;
  text-transform: uppercase;
  // font-family: 'Helvetica';
}
.sidebar__elements{
  padding-bottom: 1px;
  margin: 20px 20px;
  text-transform: uppercase;
  // font-family: 'Helvetica';
}
// .price-select {
//   border-color: #f04d24cf;
//   background-color: #f04d24cf;
// }
.sidebar {
  &__header {
    justify-content: space-between;
    min-height: 47px;
    box-shadow: 2px 2px 5px 1px #e1e1e1;
    border-radius: 3px;
    flex-wrap: wrap;
    &__clear {
      font-size: .8em;
      min-width: 102px;
      @media only screen and (min-width: 768px) and (max-width: 770px) {
        margin-top: 20px;
      }
    }
  }

  &__inline-selecors {
    display: flex;
  }
}
</style>
