<template>
  <button
    type="button"
    :aria-label="$t('Open search panel')"
    class="bg-cl-transparent brdr-none inline-flex"
    @click="toggleSearchpanel"
    data-testid="openSearchPanel"
  >
  <img src="/assets/search-icon.png" style="width:30px;"/>
    <!-- <i class="material-icons">search</i> -->
  </button>
</template>

<script>
import SearchIcon from '@vue-storefront/core/compatibility/components/blocks/Header/SearchIcon'

export default {
  mixins: [SearchIcon]
}
</script>
