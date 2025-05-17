<template>
  <div ref="cardRef" class="b-game-card" v-if="visible">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const visible = ref(false)
const cardRef = ref(null)

let observer

onMounted(async () => {
  await nextTick() // DOM이 완전히 렌더된 후에 observer 등록
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      visible.value = true
      observer.disconnect()
    }
  }, {
    rootMargin: '200px',
  })

  if (cardRef.value) observer.observe(cardRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>