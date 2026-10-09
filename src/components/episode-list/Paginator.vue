<template>
  <div class="c-paginator-container">
    <button class="c-paginator-button is-prev">Previous</button>
    <ul class="c-paginator-list">
      <li v-for="page in totalPages" :key="page"></li>
    </ul>
    <button class="c-paginator-butto is-next">Next</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.c-paginator-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
