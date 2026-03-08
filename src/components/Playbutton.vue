<template>
  <div class="play-button"
    :style="cssVarDeclarations"
    @click.stop="emit('click')"
    role="button"
    tabindex="0"
    @keydown.enter="emit('click')"
    @keydown.space="emit('click')"
  >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const {
  size = 60,
  sizeNarrow = 40,
  bgColor = 'var(--linear_green)',
  iconColor = 'var(--background_white)'
} = defineProps<{
  size?: number,
  sizeNarrow?: number,
  bgColor?: string,
  iconColor?: string
}>()

const cssVarDeclarations = computed(() => ({
  '--size': `${size}px`,
  '--size-narrow': `${sizeNarrow}px`,
  '--bg-color': bgColor,
  '--icon-color': iconColor
}))

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.play-button {
  position: relative;
  width: var(--size);
  height: var(--size);
  background: var(--bg-color);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: $drop-shadow_shallow;
  border: 1px solid rgba(0, 0, 0, 0);

  &:hover,
  &:focus {
    border-color: $navy;
  }

  &:active {
    transform: translateY(1px);
    border-color: none;
  }

  /* Play triangle */
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-40%, -50%);

    /* triangle size based on circle size */
    border-left: calc(var(--size) * 0.27) solid var(--icon-color);
    border-top: calc(var(--size) * 0.16) solid transparent;
    border-bottom: calc(var(--size) * 0.16) solid transparent;
    width: 0;
    height: 0;
  }
  
  @include until($tablet) {
    width: var(--size-narrow);
    height: var(--size-narrow);

    &::before {
      border-left-width: calc(var(--size-narrow) * 0.27);
      border-top-width: calc(var(--size-narrow) * 0.16);
      border-bottom-width: calc(var(--size-narrow) * 0.16);
    }
  }
}
</style>
