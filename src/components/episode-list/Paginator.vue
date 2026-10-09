<template>
  <div class="c-paginator-container">
    <button class="c-paginator-button is-prev">
      <i class="icon-chevron-left"></i>
    </button>
    <ul class="c-paginator-list">
      <li v-for="page in totalPages"
        :key="page"
        :class="['c-paginator-num', { 'is-active': page === currentPage }]">
        {{ page }}
      </li>
    </ul>
    <button class="c-paginator-button is-next">
      <i class="icon-chevron-right"></i>
    </button>
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
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 0.5rem;

  .c-paginator-button {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  .c-paginator-list {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.5rem;

    .c-paginator-num {
      display: inline-flex;
      cursor: pointer;
    }
  }
}
</style>
