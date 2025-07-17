<template>

</template>

<script setup lang="ts">
interface ComponentPros {
  tag?: string
}

const { tag = 'div' } = defineProps<ComponentPros>()
</script>