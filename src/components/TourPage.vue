<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { igTours } from '@/assets/data/igTours.js'

const tours = ref([])
onMounted(() => {
  tours.value = igTours.slice().sort((a, b) => {
    return new Date(b.releases) - new Date(a.releases)
  })
})
</script>

<template>
  <section class="tour">
    <div>
      <div>Tour</div>
      <div>Tour</div>
    </div>
    <div>
      <ul v-for="tour in igTours" :key="tour.id" >
        <li>
          <ol>
            <li>
              <div>{{ tour.title }}</div>
            </li>
            <li>
              <div>{{ tour.city }} / {{ tour.country }}</div>
              <div>{{ tour.date }}</div>
            </li>
          </ol>
          <button>
            <a v-if="tour.ticket" :href="tour.ticket" target="_blank">Tickets</a>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>
<style>
.tour {
  display: grid;
  grid-template-columns: 50% 60%;
  padding-top: 100px;
}
</style>