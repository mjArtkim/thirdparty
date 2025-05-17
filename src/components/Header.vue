<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

router.afterEach(() => {
  if (!isMenuMVisible.value) {
    activeMenu.value = ''
    isMusicMenuVisible.value = false
  }
})

const isScrolled = ref(false)
const isMenuVisible = ref(false)
const isMenuMVisible = ref(false)
const isMusicMenuVisible = ref(false)
const isMusicMenuMVisible = ref(false)
const isMenuOpen = ref(false)

const bgImage = ref('') 
const bgFade = ref(false)
const activeMenu = ref('')
const musicItems = [
  { name: 'ALL', link: '/musiccategory?type=ALL' },
  { name: 'Album', link: '/musiccategory?type=Album' },
  { name: 'Singles', link: '/musiccategory?type=Singles' },
  { name: 'EP', link: '/musiccategory?type=EP' },
];
const handleScroll = () => {
  if (window.scrollY > 50) { 
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
function toggleMenu() {
  isMenuVisible.value = !isMenuVisible.value;
  isMenuMVisible.value = !isMenuMVisible.value;
  isMenuOpen.value = !isMenuOpen.value
  logoImg.value = isMenuOpen.value
    ? new URL('@/assets/img/logo_item_active.png', import.meta.url).href
    : new URL('@/assets/img/logo_item.png', import.meta.url).href
}
const logoImg = ref(new URL('@/assets/img/logo_item.png', import.meta.url).href)
function toggleMusicMenu() {
  isMusicMenuMVisible.value = !isMusicMenuMVisible.value;
}
function handleMenuClick(menu) {
  if (activeMenu.value === menu) {
    activeMenu.value = ''
    if (menu === 'MUSIC') isMusicMenuVisible.value = false
  } else {
    // 다른 메뉴 클릭했을 때 해당 메뉴 활성화
    activeMenu.value = menu
    isMusicMenuVisible.value = menu === 'MUSIC'
  }
}

function setBackgroundImage(index) {
  bgFade.value = true;

  setTimeout(() => {
    bgImage.value = new URL(`../assets/img/depth2_bg${index}.png`, import.meta.url).href;
    bgFade.value = false;
  }, 250);
}
watch(isMusicMenuVisible, (visible) => {
  if (visible) {
    bgImage.value = new URL('../assets/img/depth2_bg0.png', import.meta.url).href;
  }
});
</script>

<template>
  <div class="hd-lists" :class="{ 'scrolled': isScrolled }">
    <router-link to="/" class="z-index-2"><img class="logo-img" src="@/assets/img/logo_item.png"> </router-link>
    <ul class="hd-list">
      <li class="hd-music">
        <a href="#"
          @click.prevent="handleMenuClick('MUSIC')"
          :class="{ active: activeMenu === 'MUSIC' }">
          MUSIC
        </a>
      </li>
      <li>
        <a href="#"
          @click.prevent="handleMenuClick('TOUR')"
          :class="{ active: activeMenu === 'TOUR' }">
          TOUR
        </a>
      </li>
      <li>
        <a href="https://www.thirdpartypresents.com"
          target="_blank"
          @click="handleMenuClick('SHOP')"
          :class="{ active: activeMenu === 'SHOP' }">
          SHOP
        </a>
      </li>
      <li>
        <a href="#"
          @click.prevent="handleMenuClick('ABOUT')"
          :class="{ active: activeMenu === 'ABOUT' }">
          ABOUT
        </a>
      </li>
      <li>
        <a href="https://www.thirdpartypresents.com/pages/contact"
          target="_blank"
          @click="handleMenuClick('CONTACT')"
          :class="{ active: activeMenu === 'CONTACT' }">
          CONTACT
        </a>
      </li>
    </ul>
    <transition name="fade">
      <div class="hsm-list" v-show="isMusicMenuVisible">
        <ol class="hsm-list-txt" id="s-gnb">
          <li class="bg-gnb-img" 
          :class="{ 'fade-out': bgFade }"
          :style="{ backgroundImage: `url('${bgImage}')` }"></li>
          <li class="pc-m-lists">
            <div class="music-lists" v-for="(item, index) in musicItems" :key="index"
                @mouseover="setBackgroundImage(index)" 
                @focusin="setBackgroundImage(index)">
              <router-link :to="item.link">{{ ['ALL', 'Albums', 'Singles', 'EP'][index] }}</router-link>
            </div>
          </li>
        </ol>
      </div>
    </transition>
  </div>
  <div class="hd-lists-m" :class="{ 'scrolled': isScrolled }">
    <transition name="fade">
      <img
        class="logo-img"
        :key="logoImg"
        :src="logoImg"
        @click="toggleMenu"
      />
    </transition>
    <div class="hd-list-m" :class="{ 'show': isMenuMVisible }">
      <ul class="hd-m-list">
        <li class="hd-home"><router-link to="/">HOME</router-link></li>
        <li class="hd-music" @click="toggleMusicMenu">
          <a href="#">MUSIC</a>
          <ol class="hsm-m-list"  :class="{ 'show': isMusicMenuMVisible }">
            <li v-for="(item, index) in musicItems" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
              <router-link :to="item.link">{{ item.name }}</router-link>
            </li>
          </ol>
        </li>
        <li class="hd-m-tour"><a href="#">TOUR</a></li>
        <li class="hd-m-tour"><a href="https://www.thirdpartypresents.com">SHOP</a></li>
        <li class="hd-m-tour"><a href="#">ABOUT</a></li>
        <li class="hd-m-tour"><a href="https://www.thirdpartypresents.com/pages/contact">CONTACT</a></li>
      </ul>
    </div>
  </div>
</template>

<style>

.hd-lists {
  position: fixed;
  top: 0;
  background-color: #0f0f0f;
  width: 100%;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}
.logo-img {
  height: 3vh;
  padding-left: 3vw;
}
.hd-list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  padding-right: 3vw;
  overflow: hidden;
  z-index: 1;
}

.hd-lists::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background-color: #eee;
  transform: translateX(-50%);
  transition: width 0.5s ease;
}

.hd-lists.scrolled::after {
  width: 100%;
}
.hd-list li a:hover {
  font-weight: bold; 
  transform: scale(1.05);
  color: #fff; 
}
.hd-list li > a {
  padding: 0 5px;
  width: 100px;
  font-size: 1.2em;
  margin: 0 0.3em;
  color: #eee;
  display: block;
  transition: font-weight 0.2s ease, transform 0.2s ease;
}
.hd-list li a:hover,
.hd-list li a.active {
  font-weight: bold;
  transform: scale(1.05);
  color: #fff;
}
.hsm-list {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  display: block;
}
.hsm-list-txt {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.pc-m-lists {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.music-lists {
  font-size: 1.5vw;
}
.music-lists a:hover {
  font-weight: bold;
}
.bg-gnb-img {
  background: url('@/assets/img/depth2_bg0.png') center;
  background-repeat: no-repeat;
  height: 100vh;
  margin-top: 40px;
  transition: opacity 0.5s ease;
  opacity: 1;
  border-radius: 50px;
}
.bg-gnb-img.fade-out {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
@media (min-width: 769px) {
  .hd-lists-m {display: none;}
}
/* 작은 모바일 (300px 이하) */
@media (max-width: 300px) {
  /* 스타일 정의 */
}

/* 모바일 (320px 이상) */
@media (min-width: 320px) {
  /* 스타일 정의 */
}

/* 작은 태블릿 (600px 이하) */
@media (max-width: 600px) {
  /* 스타일 정의 */
}

/* 중간 크기 태블릿 (768px 이하) */
@media (max-width: 768px) {
  .hd-lists {display: none;}
  .hd-lists-m {
    position: fixed;
    top: 0;
    background-color: #0f0f0f;
    width: 100%;
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: end;
    z-index: 10;
  }
  .hd-lists-m::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background-color: #eee;
    transform: translateX(-50%);
    transition: width 0.5s ease;
  }

  .hd-lists-m.scrolled::after {
    width: 100%;
  }
  .hd-lists-m img {
    position: absolute;
    margin-right: 20px;
    z-index: 999;
    cursor: pointer;
  }
  .hd-list-m {
    position: fixed;
    display: none;
    top: 0;
    width: 100%;
    height: 100vh;
    padding: 20px 30px;
    background-color: #0f0f0f;
    z-index: 1;
    transition:  pointer-events 0s 0.3s; 
  }
  .hd-list-m.show {
    display: block;
    pointer-events: auto;
  }
  .hd-m-list {
    margin-top: 40px;
    padding: 0;
  }
  .hd-music {
    font-size: 20px; 
    padding-bottom: 30px;
  }
  .hsm-m-list {
    display: none;
    pointer-events: none;
    font-size: 16px !important;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease, pointer-events 0s 0.3s; 
  }
  .hsm-m-list.show {
    display: block;
    transform: translateY(0);
    pointer-events: auto;
  }
  .hsm-m-list li.show {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .hsm-m-list li {
    padding: 5px 0px;  
    opacity: 0;
    transform: translateY(10px);
    animation: slideIn 0.3s forwards;
  }
  .hd-home {
    font-size: 20px;  
    padding-bottom: 30px;
  }
  .hd-m-tour {
    font-size: 20px;    
    padding-bottom: 30px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
  }
}
@media (min-width: 769px) and (max-width: 1500px) {
  .pc-m-lists {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .music-lists {
    padding: 40px 0;
    font-size: 2vw;
  }
  .bg-gnb-img {
    height: 100%;
  }
}
</style>