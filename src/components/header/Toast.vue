<template>
<div class="l-toast c-toast-container">
  <div v-for="item in $toastItems" :key="item.id"
    class="c-toast-item">
    <i :class="['icon-' + item.icon, 'c-toast-item-icon']"></i>

    <div class="c-toast-item-content" v-html="item.content" />

    <button class="c-toast-item-close-btn"
      type="button"
      @click.stop="removeToastItem(item.id)">
      <i class="icon-times"></i>
    </button>
  </div>
</div>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { toastItems, removeToastItem } from '@/store/toast'

const $toastItems = useStore(toastItems)
</script>

<style lang="scss" scoped>
@use "@/styles/_variables" as *;

.c-toast-container {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  max-width: calc(100% - 2rem);
  justify-content: flex-start;
  align-items: center;
}

.c-toast-item {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  column-gap: 0.5rem;
  padding: 0.75rem;
  background-color: $dark_navy;
  border-radius: $radius-large;
  color: $text_white;
  width: 100vw;
  max-width: 20.75rem;
  box-shadow: $drop-shadow_medium;
  opacity: 0;
  animation: display-toast 250ms ease-out forwards;

  &-icon,
  &-close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.325rem;
    height: 1.325rem;
    font-size: 0.625rem;
    border-radius: 50%;
    box-shadow: $drop-shadow_shallow;
    flex-shrink: 0;
  }

  &-icon {
    background-color: $green;
    color: $dark_navy;
  }

  &-close-btn {
    background-color : $grey_3;
    color: $dark_navy;

    &:hover,
    &:focus {
      background-color: $background_white;
    }

    i {
      transform: translateY(1px);
    }
  }

  &-content {
    position: relative;
    flex-grow: 1;
    font-size: 0.825rem;
    user-select: none;
    line-height: 1.5;
    color: $background_light_grey_2;
    margin-top: 1px;

    @include from ($tablet) {
      font-size: $font-sm;
    }
  }
}

@keyframes display-toast {
  0% { opacity: 0; }
  100% { opacity: 100%; }
}
</style>
