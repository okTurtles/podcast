<template>
  <div class="c-ep-list-section-wrapper">
    <div v-if="showToolbar" class="c-table-toolbar">
      <h2 v-if="listTitle" class="c-ep-section-title">{{ listTitle }}</h2>
    </div>

    <ul class="c-episode-list">
      <EpisodeCard v-for="episode in episodes"
        tag="li"
        :key="episode.frontmatter.permalink"
        :episode-details="episode.details" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllEpisodes } from '@/helpers'
import EpisodeCard from './EpisodeCard.vue'

interface ComponentProps {
  listTitle?: string,
  epList?: Array<any>
}

const props = defineProps<ComponentProps>()

const showToolbar = computed<boolean>(() => {
  return Boolean(props.listTitle)
})

const episodes = ref(Array.isArray(props.epList) ? props.epList : await getAllEpisodes())
</script>

<style scope lang="scss">
@use '@/styles/variables' as *;

.c-ep-list-section-wrapper {
  position: relative;
  width: 100%;
  display: block;
}

.c-table-toolbar {
  position: relative;
  margin-bottom: 2rem;
}

.c-ep-section-title {
  font-size: $font-lg;
  font-weight: 600;

	@include from($tablet) {
		font-size: $font-heading-5;
	}
}

.c-episode-list {
  position: relative;
  display: block;
  list-style: none;
  padding: 0;

  @include until($episode-card-narrow) {
    width: calc(100% + 2rem);
    margin-left: -1rem;
    border-bottom: 1px solid $grey_3;
  }
}
</style>
