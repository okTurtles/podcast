<template>
  <div class="c-ep-list-section-wrapper">
    <h2 v-if="listTitle" class="c-ep-section-title">{{ listTitle }}</h2>

    <div class="c-toolbar-container">
      <div class="c-total-num">
        <i class="icon-list"></i>
        <span>{{ episodes.length }} items</span>
      </div>
    </div>

    <ul class="c-episode-list">
      <EpisodeCard v-for="episode in episodes"
        tag="li"
        :key="episode.frontmatter.permalink"
        :episode-details="episode.details"
        :hide-episode-tags="hideEpisodeTags" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAllEpisodes } from '@/helpers'
import EpisodeCard from './EpisodeCard.vue'

interface ComponentProps {
  listTitle?: string,
  hideEpisodeTags?: boolean,
  episodeList?: Array<any>
}

const props = defineProps<ComponentProps>()

const episodes = ref(Array.isArray(props.episodeList) ? props.episodeList : await getAllEpisodes())
</script>

<style scope lang="scss">
@use '@/styles/variables' as *;

.c-ep-list-section-wrapper {
  position: relative;
  width: 100%;
  display: block;
}

.c-ep-section-title {
  position: relative;
  font-size: $font-lg;
  font-weight: 600;
  margin-bottom: 2rem;

	@include from($tablet) {
		font-size: $font-heading-5;
	}
}

.c-toolbar-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;

  .c-total-num {
    display: inline-flex;
    align-items: center;
    font-size: $font-xs;
    font-weight: 700;
    column-gap: 0.325rem;
    color: $grey_2;

    i {
      font-size: 0.85em;
      transform: translateY(0.5px);
    }
  }

  @include from($tablet) {
    margin-bottom: 1rem;

    .c-total-num {
      font-size: $font-sm;
    }
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
