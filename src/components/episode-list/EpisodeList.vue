<template>
  <div class="c-ep-list-section-wrapper">
    <h2 v-if="listTitle" class="c-ep-section-title">{{ listTitle }}</h2>

    <div class="c-toolbar-container">
      <Paginator v-if="showPagination"
        class="c-episode-paginator"
        :current-page="currentPage"
        :total-pages="totalPages" />

      <div class="c-total-num">
        <i class="icon-list"></i>
        <span>{{ epCount }}</span>
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
import { ref, computed } from 'vue'
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

// pagination-related state
const currentPage = ref<number>(1)
const epCount = computed(() => {
  const start = 1 + (currentPage.value - 1) * paginationCount
  const end = Math.min(start + paginationCount - 1, totalEpisodeLen)
  return `${start} - ${end} of ${totalEpisodeLen} items`
})
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
  justify-content: flex-end;
  column-gap: 1rem;
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
