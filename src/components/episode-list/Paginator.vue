<template>
  <div class="c-paginator-container">
    <button class="c-paginator-button is-prev" @click.stop="toPrevious">
      <i class="icon-chevron-left"></i>
    </button>
    <ul class="c-paginator-list">
      <!-- TODO: Figure out why a tags here don't get focused by keyboard navigation -->
      <a v-for="page in pages"
        :key="page"
        :class="['c-paginator-num', { 'is-active': page === currentPage }]"
        @click.stop="goToPage(page)">
        <span class="num-text">{{ page }}</span>
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
const emit = defineEmits<{
  (e: 'page-change'): void
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
    emit('page-change')
  }
}

const toNext = () => {
  if (currentPage.value < props.totalPages) {
    currentPage.value++
    emit('page-change')
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page
    emit('page-change')
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

@mixin paginator-btn-common {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: $radius;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  font-size: $font-sm;
  line-height: 1;

  @include from($mobile) {
    width: 2.25rem;
    height: 2.25rem;
  }
}

.c-paginator-container {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 0.75rem;

  .c-paginator-button {
    @include paginator-btn-common;
    position: relative;
    background-color: $navy;
    border-color: $navy;
    color: $text_white;

    &:hover,
    &:focus {
      background-color: $grey_4;
      color: $navy;
    }

    i {
      display: inline-block;
      line-height: inherit;
      font-size: inherit;
      transform: translateY(1px);
    }
  }

  .c-paginator-list {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.25rem;

    .c-paginator-num {
      @include paginator-btn-common;
      border-color: rgba(0, 0, 0, 0);
      color: $navy;
      transition: border-color 120ms ease-in-out;
      font-weight: 400;

      .num-text {
        display: inline-block;
        transform: translateY(1px);
      }

      &:hover,
      &:focus {
        text-decoration: underline;
      }

      &.is-active {
        border-color: $navy;
      }
    }
  }
}
</style>
