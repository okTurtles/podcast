<template>
<div :class='["c-buttons-container", classes]'>
  <button id="share-btn" class="button" type="button"
    @click.stop="copyOrShareSiteUrl">
    <i class="icon-share-alt pre-icon"></i>
    <span class="button-text">
      {{ isInEpisodePage ? 'Share this episode' : 'Share' }}
    </span>
  </button>

  <a class="button is-secondary" target="_blank" href="/rss.xml">
    <i class="icon-rss pre-icon"></i>
    <span class="button-text">RSS</span>
  </a>
</div>
</template>

<script lang="ts" setup>
import { SITE_URL } from '@/constants'
import { addToastItem } from '@/store/toast'
import { randomHexString } from '@/helpers'

interface ComponentProps {
  classes?: string,
  variant?: string
}

const { variant, classes = '' } = defineProps<ComponentProps>()
const isInEpisodePage = variant === 'episode'

const copyOrShareSiteUrl = () => {
  const episodeNumber = document.body.dataset.episode
  const isCopyingEpisodeUrl = Boolean(episodeNumber)
  const url = episodeNumber ? new URL(`/episodes/${episodeNumber}`, SITE_URL).toString() : SITE_URL
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

  if (isTouchDevice && navigator.share) {
    navigator.share({
      title: isCopyingEpisodeUrl ? `okTurtles Podcast Episode ${episodeNumber}.` : 'okTurtles Podcast',
      url
    }).catch((error) => console.error('navigator.share failed with:', error))

    return
  }

  navigator.clipboard.writeText(url)
  addToastItem({
    id: randomHexString(16),
    content: isCopyingEpisodeUrl
      ? 'Episode URL copied to clipboard!'
      : 'Site URL copied to clipboard!'
  })
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

.c-buttons-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  margin-top: 2rem;
  padding: 0 1rem;

  .button {
    flex-grow: 1;
  }

  @include from ($mobile) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  @include from ($tablet) {
    justify-content: flex-start;
    padding: 0;

    .button {
      min-width: 11.25rem;
      flex-grow: 0;
    }
  }

  @include from ($desktop) {
    .button {
      min-width: 13.75rem;
    }
  }
}
</style>
