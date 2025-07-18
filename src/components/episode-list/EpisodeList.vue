<template>
  <ul class="c-episode-list">
    <EpisodeCard v-for="episode in episodes"
      tag="li"
      :key="episode.frontmatter.permalink"
      :episode-details="episode.frontmatter" />
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAllEpisodes } from '@/helpers'
import EpisodeCard from './EpisodeCard.vue'

const episodes = ref(getAllEpisodes())
</script>

<style scope lang="scss">
@use '@/styles/variables' as *;

.c-episode-list {
  position: relative;
  display: block;
  list-style: none;
  max-width: 48rem;
  margin: 4rem auto;
  padding: 0;
  border: 1px solid $grey_3;

  @include until($episode-card-narrow) {
    width: calc(100% + 2rem);
    margin-left: -1rem;
  }
}
</style>
