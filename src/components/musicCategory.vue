<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { igPosts } from '@/assets/data/igPosts'

const route = useRoute()
const router = useRouter()
const types = ['ALL', 'Singles', 'EP', 'Album']
const currentType = computed(() => route.query.type || 'ALL')
const visibleCount = ref(6)

const filteredPosts = computed(() => {
  const posts = currentType.value === 'ALL'
    ? igPosts
    : igPosts.filter(post => post.type === currentType.value)

  // 날짜순 정렬 (최신순)
  return posts.slice().sort((a, b) => {
    return new Date(b.releases) - new Date(a.releases)
  })
})

// 보여질 포스트 (visibleCount 만큼만)
const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value))

function setType(type) {
  router.push({ query: { ...route.query, type } })
  // 타입이 바뀌면 다시 처음 6개만 보여주기
  visibleCount.value = 6
}
let isLoading = false

// 스크롤 이벤트 핸들러
function onScroll() {
  const scrollPosition = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 100  // 바닥에서 100px 위쯤 도달 시

  if (scrollPosition >= threshold && !isLoading) {
    if (visibleCount.value < filteredPosts.value.length) {
      isLoading = true
      loadMoreGradually()
      setTimeout(() => {
        isLoading = false
      }, 3 * 200 + 100) // 3개 다 로딩하는데 걸리는 시간 + 여유
    }
  }
}
function loadMoreGradually() {
  const total = filteredPosts.value.length
  let count = 0

  function addOne() {
    if (visibleCount.value < total && count < 3) {
      visibleCount.value++
      count++
      setTimeout(addOne, 200) // 0.2초 간격으로 1개씩 추가
    }
  }

  addOne()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
<template>
  <div class="pad-top100">
    <div class="type-tabs">
      <button
        v-for="type in types"
        :key="type"
        :class="{ active: currentType === type }"
        @click="setType(type)">
        {{ type }}
      </button>
    </div>
    <h2>{{ currentType }} 목록</h2>
    <ul class="l-container">
    <div v-for="post in filteredPosts" :key="post.id"  class="b-game-card" 
    data-aos="fade-up"
    data-aos-duration="1000">
      <router-link to="#" class="b-game-card__cover">
        <template v-if="post.tracks && post.tracks.length" >
          <img :src="post.image" alt="" class="b-game-card__cover" />
          <h3>{{ post.album }}</h3>
          <p>발매일: {{ post.releases }}<br/>레이블: {{ post.recolabel }}</p>
          <ul style="margin-left: 1rem;">
            <li v-for="(track, index) in post.tracks" :key="index">
              <div>
                <strong>{{ track.caption }}</strong><br/>
                DJ: {{ track.djname }}<br/>
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <img :src="post.image" alt="" class="b-game-card__cover" />
          <div>
            <strong>{{ post.caption }}</strong> ({{ post.type }})<br/>
            DJ: {{ post.djname }}<br/>
            발매일: {{ post.releases }}<br/>
            장르: {{ post.tag }}<br/>
            <a v-if="post.link" :href="post.link" target="_blank">듣기</a>
          </div>
        </template>
      </router-link>
    </div>
  </ul>
  </div>
</template>

<style lang="scss">
  .pad-top100 {padding-top: 100px; }
  .type-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  $c_0: #000000;
  $c_1: #353540;

  .l-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    grid-gap: 30px;
    width: 100%;
    padding: 30px;
    @media screen and (max-width: 760px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
  }

  .b-game-card {
    position: relative;
    z-index: 1;
    width: 500px;
    height: 500px;
    perspective: 1000px;
    
    &__cover {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-size: cover;
      perspective-origin: 50% 50%;
      transform-style: preserve-3d;
      transform-origin: left center;
      will-change: transform;
      transform: skewX(.001deg);
      transition: transform .35s ease-in-out;

      &::after {
        display: block;
        content: '';
        position: absolute;
        z-index: 100;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(226deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0.2) 42%, rgba(255,255,255,0) 60%);
        transform: translateY(-20%) translateX(0%);
        will-change: transform;
        transition: transform .65s cubic-bezier(0.18, 0.9, 0.58, 1);
      }
    }
    
    &:hover &__cover {
      transform: rotateY(-10deg) translateY(-6px);
      &::after {
        transform: translateY(0%) translateX(-1%);
      }
      
    }
    
    // Shadows
    
    &::before {
      display: block;
      content: '';
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      background: rgba($c_0, 0.5);
      box-shadow: 0 6px 12px 12px rgba($c_0, 0.4);
      will-change: opacity;
      transform-origin: top center;
      transform: skewX(.001deg);
      transition: transform .35s ease-in-out, opacity .5s ease-in-out;
    }
    
    &:hover::before {
      opacity: 0.6;
      transform: rotateX(7deg) translateY(-6px) scale(1.05);
    }
  }
</style>