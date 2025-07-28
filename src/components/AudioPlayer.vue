<template>
<div class='audio-wrapper plyr_override is-audio'>
  <audio controls playsinline ref="audio-el">
    <source :src="src" :type="mimeType" />
  </audio>
</div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, onMounted } from 'vue'

interface ComponentProps {
  src: string,
  mimeType: string
}

const props = defineProps<ComponentProps>()

const audioEl = useTemplateRef<HTMLAudioElement>('audio-el')
const player = ref<any>(null)

// methods
const initPlayer = () => {
  const urlSearch = new URLSearchParams(window.location.search)
  const shouldAutoplay = urlSearch.has('play')

  // https://www.npmjs.com/package/plyr#options
  const opts = { debug: false, autoplay: shouldAutoplay }
  player.value = new Plyr(audioEl.value, opts)

  player.value.on('ready', () => {
    if (shouldAutoplay && !player.value.playing) {
      player.value.play()
    }
  })
}

onMounted(() => {
  initPlayer()
})

</script>
