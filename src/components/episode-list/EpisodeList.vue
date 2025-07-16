<template>
  <div>
    <ul>
      <li v-for="episode in episodes" :key="episode.slug">
        {{ episode.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const episodes = ref([
  {
    title: 'Episode 1',
    slug: 'episode-1',
    description: 'This is the first episode',
    date: '2025-01-01',
  },
  {
    title: 'Episode 2',
    slug: 'episode-2',
    description: 'This is the second episode',
    date: '2025-01-02',
  },
  {
    title: 'Episode 3',
    slug: 'episode-3',
    description: 'This is the third episode',
    date: '2025-01-03',
  },
])
</script>
