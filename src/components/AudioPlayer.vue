<template>
<div class='audio-wrapper plyr_override is-audio'>
  <audio controls ref="audio-el">
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
  const opts = {
    debug: false,
    autoplay: urlSearch.has('play')
  }
  player.value = new Plyr(audioEl.value, opts)
}

onMounted(() => {
  initPlayer()
})

</script>
