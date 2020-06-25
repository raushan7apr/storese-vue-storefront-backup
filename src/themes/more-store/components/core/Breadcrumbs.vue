<template>
  <div class="breadcrumbs h6 cl-gray">
    <span v-for="link in paths" :key="link.route_link">
      <router-link :to="link.route_link">
        {{ link.name | htmlDecode }}
      </router-link> &nbsp; > &nbsp;
    </span>
    <span class="cl-mine-shaft">
      {{ current | htmlDecode }}
    </span>
  </div>
</template>

<script>
import { Breadcrumbs } from '@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts'

export default {
  mixins: [Breadcrumbs]
}
</script>
