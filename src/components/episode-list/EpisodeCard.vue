<template>
<component :is='tag' class='c-episode-card'>
  <div class='c-episode-card__cover'>
    <img v-if="coverImage"
      class='c-episode-card__cover-image'
      :src='getCoverImagePath(coverImage)'
      :alt='title' />
    <img v-else
      class='c-episode-card__cover-default'
      src='/images/turtle.png'
      alt='Default cover' />
  </div>

  <div class='c-episode-card__details'>
    <h3 class='episode-title c-episode-card__title' @click.stop="navigateToEpisode(false)">EP {{ zeroPad(episode) }} | {{ title }}</h3>
    <div class='c-episode-card__meta'>
      <span class='c-pub-date'>
        <span class="c-card-label-common">Published on:</span> {{ formattedPubDate }}
      </span>
      <span class='c-duration'>
        <span class="c-card-label-common">Duration:</span> {{ formattedDuration }}
      </span>
    </div>

    <div class='c-episode-card__play-button'>
      <PlayButton @click="navigateToEpisode(true)" />
    </div>
  </div>

  <div class="c-ep-description-container" :class="{ 'is-expanded': isContentExpanded }">
    <span class="c-card-label-common">About this episode:</span>
    <div class="c-ep-description" :class="{ 'line-clamp-3': !isContentExpanded }" v-html="episodeDetails.epContent" />
    <button type="button" class="is-unstyled c-show-more-btn" @click="isContentExpanded = !isContentExpanded">
      <i :class="isContentExpanded ? 'icon-chevron-up' : 'icon-chevron-bottom'"></i>
      <span class="button-text">{{ isContentExpanded ? 'Show less' : 'Show more' }}</span>
    </button>
  </div>

  <div class='c-tags-container'>
    <span class="c-card-label-common">Tags:</span>

    <ul class='tags-list'>
      <li v-for="(tag, index) in sortedTags"
        :key="index"
        class='tag-item'>
        <a :href="getTagLink(tag)" class="tag-item-link">{{ tag }}</a>
      </li>
    </ul>
  </div>
</component>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Episode } from '@/types'
import { formatPubDate, formatDuration, whiteSpaceToUnderscore } from '@/helpers'
import PlayButton from '@/components/Playbutton.vue'

interface ComponentPros {
  tag?: string,
  episodeDetails: Episode
}

// local-state
const { tag = 'div', episodeDetails } = defineProps<ComponentPros>()
const {
  episode, title, permalink, duration, pubDate, 
  tags = [], coverImage = ''
} = episodeDetails
const isContentExpanded = ref(false)

// computed props
const formattedPubDate = computed<string>(() => formatPubDate(pubDate))
const formattedDuration = computed<string>(() => formatDuration(duration))
const sortedTags = computed<string[]>(() => tags.sort())

// methods
const getCoverImagePath = (fileName: string): string => {
  return `/images/episode-covers/${fileName}`
}
const zeroPad = (value: number): string => {
  return value.toString().padStart(2, '0')
}
const navigateToEpisode = (autoPlay: boolean = false): void => {
  window.location.href = window.location.origin + permalink
    + (autoPlay ? '?play=true' : '')
}
const getTagLink = (tag: string): string => {
  return `/tag/${whiteSpaceToUnderscore(tag)}`
}

</script>

<style scope lang="scss">
@use '@/styles/variables' as *;

.c-episode-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "c-cover c-details"
    "c-desc c-desc"
    "c-tags c-tags";
  column-gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid $grey_3;

  @include from($episode-card-narrow) {
    padding: 1.25rem;
    column-gap: 1rem;
    border: 1px solid $grey_3;
    box-shadow:
      rgba(50, 50, 93, 0.125) 0px 30px 60px -12px,
      rgba(0, 0, 0, 0.175) 0px 18px 36px -18px;

    &:not(:last-child) {
      margin-bottom: 2.5rem;
    }
  }

  @include from($tablet) {
    padding: 1.75rem;
    column-gap: 1.5rem;
    grid-template-areas:
      "c-cover c-details"
      "c-cover c-desc"
      "c-tags c-tags";
  }
}

.c-card-label-common {
  font-size: $font-xs;
  font-weight: 700;
  color: $dark_navy;

  @include from($episode-card-narrow) {
    font-size: $font-sm;
  }

  @include from($tablet) {
    font-size: 0.825rem;
  }
}

.c-episode-card__cover {
  grid-area: c-cover;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border-radius: $radius-large;
  background-color: $background_light_grey_2;
  border: 1px solid $grey_3;
  flex-shrink: 0;

  @include from($mobile) {
    width: 7.2rem;
    height: 7.2rem;
  }

  @include from($tablet) {
    width: 14rem;
    height: 14rem;
  }

  img {
    display: block;
    width: 100%;
    height: auto;

    &.c-episode-card__cover-default {
      width: 67.5%;
    }
  }
}

.c-episode-card__details {
  grid-area: c-details;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

  @include from($mobile) {
    justify-content: center;
  }

  @include from($tablet) {
    font-size: 0.825rem;
    justify-content: flex-start;
  }
}

.c-episode-card__title {
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
}

.c-episode-card__meta {
  display: flex;
  flex-direction: column;

  .c-pub-date,
  .c-duration {
    font-size: $font-xs;
    color: $grey_1;

    @include from($episode-card-narrow) {
      font-size: $font-sm;
    }

    @include from($tablet) {
      font-size: 0.825rem;
    }
  }
}

.c-episode-card__play-button {
  position: absolute;
  top: 0;
  right: 0;
}

.c-tags-container {
  grid-area: c-tags;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.c-ep-description-container {
  grid-area: c-desc;
  position: relative;
  display: block;
  width: 100%;
  margin-top: 1rem;
  font-size: $font-xs;
  line-height: 1.325;

  @include from($episode-card-narrow) {
    font-size: $font-sm;
  }

  &.is-expanded {
    margin-top: 1rem;
  }

  .c-ep-description:not(.line-clamp-3) {
    > p:not(:last-child) {
      margin-bottom: 0.75rem;
    }

    ul {
      list-style: disc;
      padding-left: 1rem;

      li:not(:last-child) {
        margin-bottom: 0.25rem;
      }
    }

    iframe {
      display: none !important;
    }
  }

  @include from($tablet) {
    margin-top: 0;
  }
}

.c-show-more-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: $font-xs;
  color: $green;
  cursor: pointer;
  margin-top: 0.25rem;

  @include from($episode-card-narrow) {
    font-size: 0.825rem;
  }

  &:hover,
  &:focus {
    color: $dark_green;
  
    .button-text {
      text-decoration: underline;
    }
  }

  i {
    font-size: 0.85em;
    transform: translateY(1px);
  }
}
</style>
