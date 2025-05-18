<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div id="app">
    <section class="wrap">
      <Header></Header>
      <router-view />
      <Footer></Footer>
    </section>
  </div>
</template>

<style scoped>
  .wrap {
    position: relative; 
  }
</style>
