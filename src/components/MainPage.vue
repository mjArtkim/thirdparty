<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CanvasTrail from '@/components/effect/CanvasTrail.vue'
import MainIg from '@/components/unit/MainIg.vue'

const text = ref(' Progressive House Music  ')
const scrollEl = ref(null)
const backgroundSize = ref(150)

let isDragging = false
let startY = 0
let startScrollTop = 0

const handleScroll = () => {
  const scrollPosition = window.scrollY
  const maxScroll = 500
  let newSize = 180 - (scrollPosition / maxScroll) * 50
  if (newSize < 100) newSize = 100
  backgroundSize.value = newSize
}

// PC용 마우스 이벤트
const onMouseDown = (e) => {
  isDragging = true
  startY = e.clientY
  startScrollTop = scrollEl.value.scrollTop
  scrollEl.value.style.cursor = 'grabbing'
}
const onMouseMove = (e) => {
  if (!isDragging) return
  const deltaY = e.clientY - startY
  scrollEl.value.scrollTop = startScrollTop - deltaY
}
const onMouseUp = () => {
  isDragging = false
  scrollEl.value.style.cursor = 'grab'
}

// 모바일용 터치 이벤트
const onTouchStart = (e) => {
  isDragging = true
  startY = e.touches[0].clientY
  startScrollTop = scrollEl.value.scrollTop
}
const onTouchMove = (e) => {
  if (!isDragging) return
  const deltaY = e.touches[0].clientY - startY
  scrollEl.value.scrollTop = startScrollTop - deltaY
}
const onTouchEnd = () => {
  isDragging = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if (scrollEl.value) {
    scrollEl.value.addEventListener('mousedown', onMouseDown)
    scrollEl.value.addEventListener('touchstart', onTouchStart)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollEl.value) {
    scrollEl.value.removeEventListener('mousedown', onMouseDown)
    scrollEl.value.removeEventListener('touchstart', onTouchStart)
  }
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <div class="main-body">
    <div class="main-inner">
      <div class="main-bg">
          <CanvasTrail />
      </div>
      <h1 class="main-tit">THIRD PARTY</h1>
    </div>
    <div class="main-secound">
      <div class="marquee-content">
        <span v-for="n in 6" :key="n">{{ text }}</span>
      </div>
    </div>
    <div class="main-thr-container">
      <div class="three-center" ref="scrollEl">
        <MainIg />
      </div>
      <div class="main-three" :style="{ backgroundSize: backgroundSize + '%' }"></div>
    </div>
    <div class="main-secound">
      <div class="marquee-content">
        <span v-for="n in 6" :key="n">{{ text }}</span>
      </div>
    </div>
    <div class="main-4">
      <div class="main-4-tit">
        <div>THIRD</div>
        <img src="@/assets/img/logo_item.png">
        <div>PARTY</div>
      </div>
      <ul class="main-4-sub">
        <li>
          <div class="main-4-txt">We Always Love the Music</div>
          <div class="contact-container">
            <a href="https://www.thirdpartypresents.com/pages/contact" target="_blank" class="contact-btn">Contact Us</a>
          </div> 
        </li>
        <li class="third-bar-container" >
          <div class="thirdbar" 
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="500"
          >&nbsp;</div>
          <div class="thirdtext" 
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="800"
          >T H I R D</div>
          <div class="thirdbar"  
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="1100"
            >&nbsp;</div>
            <div class="thirdtext" 
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="1400"
          >P A R T Y</div>
          <div class="thirdbar"  
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="1700"
            >&nbsp;</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.main-body {
  min-height: 100vh;
  overflow: hidden;
}
.main-tit {
  font-size: 15vw;
  font-weight: bold;
  text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.9);
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #fff;
  cursor: default;
}
.main-bg {
  width: 100%;
  overflow: hidden;
  top: 0;
}
.main-inner {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  min-height: 100vh;
}
.main-secound {
  width: 100%;
  height:  12vh;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  cursor: default;
}

.marquee-content {
  font-size: clamp(2rem, 4vw, 5vw); 
  font-weight: bold;
  text-shadow: 0px 0px 25px rgba(0, 0, 0, 0.9);
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #eee;
  color: #0f0f0f;
  display: inline-block;
  animation: scroll-left 25s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.main-thr-container {
  position: relative;
  width: 100%;
  min-height: 120vh;
  overflow: hidden;
}
.main-three {
  position: sticky;
  top: 100px;
  width: 100%;
  margin-top: 5vh;
  height: 100vh;
  background-image: url('/src/assets/img/main_3_bg.png');
  background-size: 180%;
  background-repeat: no-repeat;
  background-position: top center;
  transition: background-size 0.5s ease-in-out;
  z-index: -1;
}
.three-center {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  transition: ease-in 0.5s;
  padding-right: 10px; 
  scroll-behavior: smooth;
  cursor: grab;
}
.three-center::-webkit-scrollbar{
  width: 8px;
  height: 8px;  
}
.three-center::-webkit-scrollbar-track {
  background-color: transparent;
}
.three-center::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.three-center::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}
.main-4 {
  height: 68vh;
  padding: 0 80px;
}
.main-4-tit {
  display: flex;
  align-items: center;
  font-size: 8vw;
}
.main-4-tit img {
  height: 8vh;
  padding: 0 30px;
}
.main-4-sub {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 40px;
}
.third-bar-container {
  align-self: end;
  justify-self: end;
  display: flex;
  flex-direction: column;
}
.thirdbar {
  width: 25vw;
  height: 25px;
  background-color: #fff;
  margin: 20px 0;
}
.main-4-txt {
  margin-top: 30px;
  margin-bottom: 50px;
  font-size: 1.5vw;
}
.contact-container {
  padding: 50px 0 20px;
}
.contact-btn {
  padding: 20px 40px;
  font-size: 20px;
  background-color: transparent;
  color: #eee;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
.contact-btn:hover {
  background-color: rgba( 255, 255, 255, 0.1 );
  font-weight: normal;
}
.contact-btn:active {
  background-color: rgba( 255, 255, 255, 0.5 );
}
.thirdtext {
  text-align: center;
  word-spacing: 4vw;
  font-size: 1.1vw;
  line-height: 0;
  margin: 10px 0;
}
/* 작은 모바일 (300px 이하) */
@media (max-width: 300px) {
  /* 스타일 정의 */
}


@media (max-width: 429px) {
  .main-three {
    background-image: url('/src/assets/img/main_bg_4.png');
    background-size: 180%;
  }
  .main-tit {
    font-size: 13vw;
  }
  .marquee-content {
    font-size: 13vw; 
  }
  .main-4 {
    height: 80vh;
    padding: 0 30px;
  }
  .main-4-tit {
    display: flex;
    align-items: center;
    font-size: 10vw;
  }
  .main-4-tit img {
    height: 3vh;
    padding: 0 20px;
  }
  .main-4-txt {
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 18px;
  }
  .contact-container {
    padding: 50px 0 20px;
  }
  .contact-btn {
    padding: 10px 20px;
    font-size: 18px;
    background-color: transparent;
    color: #eee;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .main-4-sub {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 40px;
    padding-left: 0;
  }
  .third-bar-container {
    align-self: stretch;
    justify-self: start;
    margin-top: 40px;
  }
  .thirdbar {
    width: 80vw;
  }
  .thirdtext {
    word-spacing: 10vw;
    font-size: 6vw;
  }
}


@media (min-width: 430px) and (max-width: 600px) {
  .main-three {
    background-image: url('/src/assets/img/main_bg_4.png');
    background-size: 180%;
  }
  .marquee-content {
    font-size: 13vw; 
  }
  .main-4 {
    height: 70vh;
    padding: 0 30px;
  }
  .main-4-tit {
    display: flex;
    align-items: center;
    font-size: 10vw;
  }
  .main-4-tit img {
    height: 3vh;
    padding: 0 20px;
  }
  .main-4-txt {
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 18px;
  }
  .contact-container {
    padding: 50px 0 20px;
  }
  .contact-btn {
    padding: 10px 20px;
    font-size: 18px;
    background-color: transparent;
    color: #eee;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .main-4-sub {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 40px;
    padding-left: 0;
  }
  .third-bar-container {
    align-self: center;
    justify-self: center;
    margin-top: 40px;
  }
  .thirdbar {
    width: 80vw;
  }
  .thirdtext {
    word-spacing: 10vw;
    font-size: 5vw;
  }
}

/* 중간 크기 태블릿 (768px 이하) */
@media (min-width: 601px) and  (max-width: 768px) {
  .main-three {
    background-image: url('/src/assets/img/main_bg_4.png');
    background-size: 180%;
  }
  .marquee-content {
    font-size: 7vw; 
  }
  .main-4 {
    height: 70vh;
    padding: 0 30px;
  }
  .main-4-tit {
    display: flex;
    align-items: center;
    font-size: 10vw;
  }
  .main-4-tit img {
    height: 3vh;
    padding: 0 20px;
  }
  .main-4-txt {
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 18px;
  }
  .contact-container {
    padding: 50px 0 20px;
  }
  .contact-btn {
    padding: 10px 20px;
    font-size: 18px;
    background-color: transparent;
    color: #eee;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
  }
  .main-4-sub {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 40px;
    padding-left: 0;
  }
  .third-bar-container {
    align-self: center;
    justify-self: center;
    margin-top: 40px;
  }
  .thirdbar {
    width: 80vw;
  }
  .thirdtext {
    word-spacing: 10vw;
    font-size: 5vw;
  }
}
@media (min-width: 769px) and (max-width: 1080px) {
  .marquee-content {
    font-size: 7vw; 
  }
  .thirdbar {
    width: 35vw;
  }
  .thirdtext {
    word-spacing: 5vw;
    font-size: 2vw;
  }
}
@media (min-width: 1081px) and (max-width: 1500px) {
  .marquee-content {
    font-size: 5.5vw; 
  }
  .thirdbar {
    width: 35vw;
  }
  .thirdtext {
    word-spacing: 6vw;
    font-size: 1.5vw;
  }
}
</style>

