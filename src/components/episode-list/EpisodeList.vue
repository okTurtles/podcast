<template>
  <div>
    <ul>
      <li v-for="episode in episodes" :key="episode.frontmatter.permalink">
        EP {{ episode.frontmatter.episode }}. - {{ episode.frontmatter.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAllEpisodes } from '@/helpers'

const episodes = ref(getAllEpisodes())
</script>
