<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
const route = useRoute()
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute === 'aboutpage') {
      document.body.style.overflow = 'aboutpage'
    } else {
      document.body.style.overflow = 'auto'
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="app">
    <section class="wrap">
      <Header></Header>
      <router-view />
      <Footer v-if="route.name !== 'aboutpage'" ></Footer>
    </section>
  </div>
</template>

<style scoped>
  .wrap {
    position: relative; 
  }
</style>
