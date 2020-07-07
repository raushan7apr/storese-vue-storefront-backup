<template>
  <div v-if="validations">
    <span
      v-for="(validation, index) in validations"
      :key="index"
      v-if="validation.condition"
      class="block cl-error h6 my5 msg-text"
      data-testid="errorMessage"
    >
      {{ validation.text }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    validations: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style scoped>
.msg-text{
  float: left;
}
</style>
