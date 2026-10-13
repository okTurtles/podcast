<template>
  <div class="c-paginator-container">
    <button class="c-paginator-button is-prev" @click.stop="toPrevious">
      <i class="icon-chevron-left"></i>
    </button>
    <ul class="c-paginator-list">
      <a v-for="page in pages"
        :key="page"
        :class="['c-paginator-num', { 'is-active': page === currentPage }]"
        @click.stop="goToPage(page)">
        {{ page }}
      </a>
    </ul>
    <button class="c-paginator-button is-next" @click.stop="toNext">
      <i class="icon-chevron-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  totalPages: number
}>()

const currentPage = defineModel<number>('currentPage', { required: true })
const pages = computed(() => {
  const start = 1 + Math.floor(currentPage.value / 5)
  const end = Math.min(start + 4, props.totalPages)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

// methods
const toPrevious = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const toNext = () => {
  if (currentPage.value < props.totalPages) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
  }
}
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

      &.is-active {
        color: $dark_green;
        font-weight: 600;
      }
    }
  }
}
</style>
