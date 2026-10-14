<template>
  <div class="c-paginator-container">
    <button class="c-paginator-button is-prev"
      @click.stop="toPrevious"
      type="button"
      aria-label="Previous page"
      :disabled="currentPage === 1">
      <i class="icon-chevron-left"></i>
    </button>
    <ul class="c-paginator-list">
      <li v-for="page in pages" :key="page">
        <button type="button"
          :class="['c-paginator-num', { 'is-active': page === currentPage }]"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click.stop="goToPage(page)">
          <span class="num-text">{{ page }}</span>
        </button>
      </li>
    </ul>
    <button class="c-paginator-button is-next"
      @click.stop="toNext"
      type="button"
      aria-label="Next page"
      :disabled="currentPage === totalPages">
      <i class="icon-chevron-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPaginationRange } from './pagination-utils'
const props = defineProps<{
  totalPages: number
}>()

const currentPage = defineModel<number>('currentPage', { required: true })
const pages = computed(() => {
  return getPaginationRange(currentPage.value, props.totalPages)
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
    position: relative;
    background-color: $navy;
    border-color: $navy;
    color: $text_white;
    @include paginator-btn-common;

    &:hover,
    &:focus {
      background-color: $background_light_grey;
      color: $navy;
    }

    &:disabled {
      background-color: $grey_3;
      border-color: $grey_3;
      color: $grey_1;
      opacity: 0.75;
      pointer-events: none;
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
    column-gap: 0.375rem;
    list-style: none;

    .c-paginator-num {
      padding: 0;
      border-color: rgba(0, 0, 0, 0);
      color: $navy;
      font-weight: 400;
      @include paginator-btn-common;

      .num-text {
        display: inline-block;
        transform: translateY(1px);
      }

      &:hover,
      &:focus {
        text-decoration: underline;
      }

      &.is-active {
        background-color: $background_light_grey;
        border-color: $navy;
        text-decoration: underline;
      }
    }
  }
}
</style>
