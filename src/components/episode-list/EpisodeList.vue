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

    <div v-if="showPagination" class="c-toolbar-container">
      <Paginator class="c-episode-paginator"
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        @page-change="onPageChange" />

      <span class="c-page-info">
        <span class="c-page-num">{{ currentPage }}</span>
        <span class="c-page-of">of</span>
        <span class="c-page-num">{{ totalPages }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import EpisodeCard from './EpisodeCard.vue'
import Paginator from './Paginator.vue'
import { getAllEpisodes } from '@/helpers'

interface ComponentProps {
  listTitle?: string,
  hideEpisodeTags?: boolean,
  episodeList?: Array<any>,
  paginationCount?: number
}

const { episodeList, listTitle, paginationCount = 0 } = defineProps<ComponentProps>()

const episodes = Array.isArray(episodeList) ? episodeList : await getAllEpisodes()
const totalEpisodeLen = episodes.length
const showPagination = paginationCount > 0 && totalEpisodeLen > paginationCount
const totalPages = Math.ceil(totalEpisodeLen / paginationCount)

const containerRef = useTemplateRef<HTMLDivElement>('ep-container')

// pagination-related state
const currentPage = ref<number>(1)
const pageStart = computed(() => 1 + (currentPage.value - 1) * paginationCount)
const pageEnd = computed(() => Math.min(pageStart.value + paginationCount - 1, totalEpisodeLen))
const episodesToShow = computed(() => episodes.slice(pageStart.value - 1, pageEnd.value))

// methods
const onPageChange = () => {
  containerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scope lang="scss">
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

.c-toolbar-container {
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

    i {
      font-size: 0.85em;
      transform: translateY(0.5px);
    }

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
