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
    <div class='c-details__upper'>
      <h3 class='c-episode-card__title'>EP {{ zeroPad(episode) }} | {{ title }}</h3>
      <div class='c-episode-card__meta'>
        <span class='c-pub-date'>
          Published on: {{ formattedPubDate }}
        </span>
        <span class='c-duration'>
          Duration: {{ formattedDuration }}
        </span>
      </div>

      <div class='c-episode-card__play-button'>
        <PlayButton />
      </div>
    </div>

    <ul class='c-details__tags'>
      <li v-for="(tag, index) in sortedTags"
        :key="index"
        class='c-tag'>
        {{ tag }}
      </li>
    </ul>

    <div class='c-episode-card__lower'></div>
  </div>
</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Episode } from '@/types'
import { formatPubDate, formatDuration } from '@/helpers'
import PlayButton from '@/components/Playbutton.vue'

interface ComponentPros {
  tag?: string,
  episodeDetails: Episode
}

const { tag = 'div', episodeDetails } = defineProps<ComponentPros>()
const {
  episode, title, permalink,
  file, filetype, duration, pubDate, 
  tags = [], coverImage = ''
} = episodeDetails

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

</script>

<style scope lang="scss">
@use '@/styles/variables' as *;

.c-episode-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  column-gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid $grey_3;

  @include from($episode-card-narrow) {
    padding: 1.25rem;
    column-gap: 1rem;
  }

  @include from($tablet) {
    padding: 1.75rem;
    column-gap: 1.5rem;
  }
}

.c-episode-card__cover {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border-radius: $radius-large;
  background-color: $grey_3;
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
    width: 100%;
    height: auto;
  }
}

.c-episode-card__details {
  display: block;
  width: 100%;

  .c-details__upper {
    position: relative;
    display: block;
    flex-grow: 1;
    padding-right: 4.5rem;

    @include until($episode-card-narrow) {
      padding-right: 3rem;
    }
  }

  .c-details__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem 0;
  }
}

.c-episode-card__title {
  font-size: $font-lg;
  font-weight: 900;
  color: $text_black;
  width: auto;
  cursor: pointer;
  margin-bottom: 0.25rem;

  &:hover {
    text-decoration: underline;
  }

  @include from(581px) {
    font-size: $font-heading-5;
  }

  @include from($tablet) {
    font-size: $font-heading-4;
    margin-bottom: 0.5rem;
  }
}

.c-episode-card__meta {
  display: flex;
  flex-direction: column;

  .c-pub-date,
  .c-duration {
    font-size: $font-sm;
    color: $grey_1;

    @include from($tablet) {
      font-size: $font-md;
    }
  }
}

.c-episode-card__play-button {
  position: absolute;
  top: 0;
  right: 0;
}

.c-tag {
  display: inline-block;
  font-size: 0.625rem;
  color: $text_white;
  background-color: $dark_navy;
  padding: 0.2em 0.875em;
  border-radius: 10rem;

  @include from($episode-card-narrow) {
    font-size: 0.7rem;
  }
}
</style>