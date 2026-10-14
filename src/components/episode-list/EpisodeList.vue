<template>
  <div ref="ep-container" class="c-ep-list-section-wrapper">
    <h2 v-if="listTitle" class="c-ep-section-title">{{ listTitle }}</h2>

    <ul class="c-episode-list">
      <EpisodeCard v-for="episode in episodesToShow"
        tag="li"
        :key="episode.frontmatter.permalink"
        :episode-details="episode.details"
        :hide-episode-tags="hideEpisodeTags" />
    </ul>

    <div v-if="showPagination" class="c-pagination-container">
      <Paginator v-model:current-page="currentPage" :total-pages="totalPages" />

      <span class="c-page-info">
        <span class="c-page-num">{{ currentPage }}</span>
        <span>of</span>
        <span class="c-page-num">{{ totalPages }}</span>
        <span>pages</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, watch } from 'vue'
import { EPISODE_NUM_PER_PAGE } from './pagination-utils'
import EpisodeCard from './EpisodeCard.vue'
import Paginator from './Paginator.vue'
import { getAllEpisodes } from '@/helpers'

interface ComponentProps {
  listTitle?: string,
  hideEpisodeTags?: boolean,
  episodeList?: Array<any>
}

const { episodeList, listTitle } = defineProps<ComponentProps>()

const episodes = Array.isArray(episodeList) ? episodeList : await getAllEpisodes()
const totalEpisodes = episodes.length
const showPagination = EPISODE_NUM_PER_PAGE > 0 && totalEpisodes > EPISODE_NUM_PER_PAGE
const totalPages = Math.ceil(totalEpisodes / EPISODE_NUM_PER_PAGE)

const containerRef = useTemplateRef<HTMLDivElement>('ep-container')

// pagination-related state
const currentPage = ref<number>(1)

const episodesToShow = computed(() => {
  const start = (currentPage.value - 1) * EPISODE_NUM_PER_PAGE
  return episodes.slice(start, start + EPISODE_NUM_PER_PAGE)
})

watch(currentPage, () => {
  containerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.c-ep-list-section-wrapper {
  position: relative;
  width: 100%;
  display: block;
  scroll-margin-top: 1.5rem;
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

.c-pagination-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;

  .c-page-info {
    display: inline-flex;
    align-items: center;
    font-size: $font-sm;
    column-gap: 0.325rem;
    color: $grey_0;
    margin-top: 1.25rem;

    .c-page-num {
      font-weight: 600;
    }
  }

  @include from($mobile) {
    margin-top: 4rem;
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
