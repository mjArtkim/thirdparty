<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { igPosts } from '@/assets/data/igPosts'
import { nextTick } from 'vue'

const route = useRoute()
const router = useRouter()
const types = ['ALL', 'Singles', 'EP', 'Album']
const currentType = computed(() => route.query.type || 'ALL')
const visibleCount = ref(6)
const selectedAlbumId = ref(null)

function selectAlbum(id) {
  selectedAlbumId.value = id
}
function handleAfterEnter(id) {
  const el = document.getElementById(`album-${id}`)
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
function closeAlbum() {
  selectedAlbumId.value = null
}
const filteredPosts = computed(() => {
  const posts = currentType.value === 'ALL'
    ? igPosts
    : igPosts.filter(post => post.type === currentType.value)

  return posts.slice().sort((a, b) => {
    return new Date(b.releases) - new Date(a.releases)
  })
})

const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value))

function setType(type) {
  // router.push({ query: { ...route.query, type } })
  selectedAlbumId.value = null
  if (route.query.type === type) {
    // 같은 탭이면 강제로 리셋 효과
    visibleCount.value = 0
    nextTick(() => {
      visibleCount.value = igPosts.length
    })
  } else {
    router.push({ query: { ...route.query, type } })

    nextTick(() => {
      visibleCount.value = type === 'ALL' ? igPosts.length : 6
    })
  }
}
let isLoading = false

// 스크롤 이벤트 핸들러
function onScroll() {
  const scrollPosition = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 100  

  if (scrollPosition >= threshold && !isLoading) {
    if (visibleCount.value < filteredPosts.value.length) {
      isLoading = true
      loadMoreGradually()
      setTimeout(() => {
        isLoading = false
      }, 3 * 200 + 100) 
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
      setTimeout(addOne, 200) 
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
      <button v-for="type in types" :key="type"
        :class="['music-tab-btn', { active: currentType === type }]"

        @click="setType(type)">
        {{ type }}
      </button>
    </div>
    <div>
      <h2 class="current-type">
        {{ currentType }}
      </h2>
      <div v-for="post in filteredPosts" :key="post.id" class="album-continer">
        <transition name="fade-slide" @after-enter="handleAfterEnter(post.id)">
          <div v-if="selectedAlbumId === post.id"
              class="album-box"
              :style="{ backgroundColor: post.color }"
              :id="`album-${post.id}`"
              >
              <button @click="closeAlbum" class="close-album material-icons-round">close</button>
            <div>
              <div v-if="post.tracks && post.tracks.length" class="album-infor">
                <div class="infor-img"><img :src="post.image" alt="Album art"/></div>
                <ul class="album-contents">
                  <li class="alb-tit">{{ post.album }}</li>
                  <li>{{ post.releases }}</li>
                  <li>{{ post.recolabel }}</li>
                  <li class="alb-track">Track List</li>
                  <li class="track-inner">
                    <ol v-for="(track, index) in post.tracks" :key="index">
                      <li>{{ track.caption }}</li>
                      <li class="fz-14">{{ track.djname }}</li>
                    </ol>
                  </li>
                  <li class="alb-link">
                    <ol>
                      <li>
                        <a v-if="post.linkapple" :href="post.linkapple" target="_blank">
                          <i class="fa-brands fa-apple"></i>
                          Apple Music
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linkyoutube" :href="post.linkyoutube" target="_blank">
                          <i class="fa-brands fa-youtube"></i>
                          Youtube Music
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linkspotify" :href="post.linkspotify" target="_blank">
                          <i class="fa-brands fa-spotify"></i>
                          Spotify
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linksound" :href="post.linksound" target="_blank">
                          <i class="fa-brands fa-soundcloud"></i>
                          Sound Cloud
                        </a>
                      </li>
                    </ol>
                  </li> 
                </ul>
                
              </div>
              <div v-else class="album-infor">
                <img :src="post.image" alt="Album art" />
                <ul class="album-contents">
                  <li class="alb-tit">{{ post.caption }} </li>
                  <li class="alb-name">{{ post.djname }}<br/></li>
                  <li class="alb-rele">{{ post.releases }}<br/></li>
                  <li class="alb-tag">{{ post.tag }}<br/></li>
                  <li class="alb-link">
                    <ol>
                      <li>
                        <a v-if="post.linkapple" :href="post.linkapple" target="_blank">
                          <i class="fa-brands fa-apple"></i>
                          Apple Music
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linkyoutube" :href="post.linkyoutube" target="_blank">
                          <i class="fa-brands fa-youtube"></i>
                          Youtube Music
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linkspotify" :href="post.linkspotify" target="_blank">
                          <i class="fa-brands fa-spotify"></i>
                          Spotify
                        </a>
                      </li>
                      <li>
                        <a v-if="post.linksound" :href="post.linksound" target="_blank">
                          <i class="fa-brands fa-soundcloud"></i>
                          Sound Cloud
                        </a>
                      </li>
                    </ol>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="l-container">
        <div 
          v-for="post in filteredPosts"
          :key="post.id"
          class="b-game-card"
          data-aos="fade-up"
          data-aos-duration="1000"
          @click="selectAlbum(post.id)"
          >
          <div class="b-game-card__cover">
            <template v-if="post.tracks && post.tracks.length" >
              <img :src="post.image" alt="" class="b-game-card__cover" />
              <h3>{{ post.album }}</h3>
              <div>발매일: {{ post.releases }}</div>
            </template>
            <template v-else>
              <img :src="post.image" alt="" class="b-game-card__cover" />
              <div>
                <h3>{{ post.album }}</h3>
                <div>발매일: {{ post.releases }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .pad-top100 {padding: 100px 30px 0;
    min-height: 90vh;
    @media screen and (max-width: 406px) {
      max-width: 406px !important;
    }
  }
  .type-tabs {
    display: flex;
    margin-bottom: 20px;
    @media screen and (max-width: 768px) {
      gap: 10px;
    }
    @media screen and (min-width: 769px) {
      flex-direction: column;
      position: fixed;
      top: 45%;
      gap: 20px;
    }
  }
  .music-tab-btn {
    background-color: transparent;
    color: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 5px 0;
    cursor: pointer;
    &:hover { 
      background-color: rgba(255, 255, 255, 0.5);
      font-weight: bold;
    }
    &:active {
      background-color: rgba(255, 255, 255, 0.8);
      font-weight: bold;
    }
    &.active {
      font-weight: bold;
      background-color: rgba(255, 255, 255, 0.8);
      color: #353540;
    }
    @media screen and (max-width: 768px) {
      flex-grow: 1;
      padding: 10px 0;
      font-size: 16px;
    }
    @media screen and (min-width: 769px) {
      width: 80px;
      font-size: 18px;
    }
  }
  .current-type {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-top: 10px;
    padding: 10px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  $c_0: #000000;
  $c_1: #353540;

  .l-container {
    display: grid;
    justify-items: center;
    grid-gap: 30px;
    width: 100%;
    padding: 30px 30px 30px 100px;
    @media screen and (max-width: 616px) {
      padding: 0 0 20px 0;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    @media screen and (min-width: 617px)  and (max-width: 768px) {
      padding: 0;
      grid-template-columns: repeat(3, 1fr);
    }
    @media screen and (min-width: 769px)  and (max-width: 1500px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media screen and (min-width: 1501px) and (max-width: 1780px) {
      grid-template-columns: repeat(4, 1fr);
    }  
    @media screen and (min-width: 1781px) {
      grid-template-columns: repeat(auto-fill, minmax(20%, auto));
    }
  }
  .b-game-card {
    position: relative;
    z-index: 1;
    perspective: 1000px;
    --size: clamp(140px, 21vw, 340px);
    width: var(--size);
    height: var(--size);
    cursor: pointer;
    
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
  .fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.album-continer {
  width: 100%;
  margin-top: 30px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 768px) {

    }
  @media screen and (min-width: 769px) {
    padding-right: 30px;
    padding-left: 100px;
  }
}
.album-box {
  position: relative;
  border-radius: 5px;
  height: 100%;
  scroll-margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 768px) {
    padding: 20px;
    }
  @media screen and (min-width: 769px) {
    padding: 30px 40px;
  }
}
.close-album {
  position: absolute;
  border: none;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  transform: rotate(0);
  transition: ease-in-out 0.2s;
  &:hover {
    text-shadow: 1px 1px 4px rgba($color: #000000, $alpha: 0.5);
    color: #ddd;
    transform: rotate(90deg);
  }
  &:active {
    color: #353540;
  }
  @media screen and (max-width: 768px) {
    right: 5px;
    top: 5px;
    font-size: 36px;
  }
  @media screen and (min-width: 769px) {
    right: 30px;
    top: 30px;
    font-size: 3vw;
  }
}
.infor-img {
  height: 100%;
}
.album-infor {
  display: flex;
  img {
    border-radius: 5px;
    box-shadow: 0px 0px 6px rgba($color: #000000, $alpha: 0.5);
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding-top: 30px;
    img {
      width: 100%;
      }
    }
  @media screen and (min-width: 769px) {
    img {
      width: 28vw;
      min-width: 26vw;
    }
  }
}
.album-contents {
  display: grid;
  width: 100%;
  text-shadow: 1px 1px 3px rgba($color: #000000, $alpha: 0.5);
  @media screen and (max-width: 768px) {
    padding: 10px 0 0 0;
    gap: 10px 0;
    }
  @media screen and (min-width: 769px) {
    padding: 10px 0 0 30px;
  }
}
.alb-tit {
  font-weight: bold;
  @media screen and (max-width: 768px) {
    font-size: 5vw;
    }
  @media screen and (min-width: 769px) {
    font-size: 2vw;
  }
}
.alb-link {
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  margin-top: 20px;
  padding-top: 20px;
  
  ol {
    padding: 0;
    display: grid;
    gap: 10px 0;
    grid-template-columns: 1fr 1fr;
  }
  ol li a {
    &:hover {
      color: #aaa;
    }
    &:active {
      color: #353540;
    }
  }
  ol li a i {
    margin-right: 5px;
  }
}
.alb-track {
  font-size: 20px;
  font-weight: bold;
}
.track-inner{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
  ol {
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 5px;
  }
  @media screen and (max-width: 768px) {

    }
  @media screen and (min-width: 769px) {

  }
}

</style>