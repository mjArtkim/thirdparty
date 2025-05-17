<script setup>
import { ref, computed, onMounted } from 'vue'

import { igPosts } from '@/assets/data/igPosts.js'

const posts = ref([])
onMounted(() => {
  posts.value = igPosts.slice().sort((a, b) => {
    return new Date(b.releases) - new Date(a.releases)
  })
})
const limitedPosts = computed(() => {
  return posts.value.slice(0, 6)
})
function goToLink(link) {
  window.open(link, '_blank') 
}
</script>

<template>
  <div>
    <ol class="ig-container"
      data-aos="fade-up"
      data-aos-duration="800"
      >
      <li class="ig-card" v-for="post in limitedPosts" :key="post.id">
        <div class="ig-img-con">
          <div class="ig-img">
            <img :src="post.image" alt="post image" />
          </div>
          <div class="ig-img-icon">
            <button class="ig-play" 
            :style="{ backgroundColor: post.color }"
            @click="goToLink(post.link)"
            >
            <span class="material-icons-outlined">play_circle_outline</span>
          </button>
          </div>
        </div>
        <div class="ig-content">
          <div class="ig-con-tit" :style="{ color: post.color }">{{ post.caption }}</div>
          <div class="ig-con-name">{{ post.djname }}</div>
        </div>
        <div class="ig-con-flex">
            <div class="ig-con-label">{{ post.recolabel }}</div>
            <div class="ig-con-txt">Released : {{ post.releases }}</div>
          </div>
        <!-- <div class="ig-tag">
          <span
            v-for="(tagItem, index) in post.tag ? post.tag.split(',') : []"
            :key="index"
            class="ig-item-tag"
          >
            {{ tagItem.trim() }}
          </span>
        </div> -->
      </li>
    </ol>
  </div>
</template>

<style>
.ig-card {
  width: 30em;
  height: 620px;
  padding: 15px;
  background: rgba( 255, 255, 255);
  border-radius: 20px;
  box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.8);
  transition: 0.3s;
  filter: brightness(1) saturate(1.2) contrast(0.85);
  transform: scale(1) translateZ(0);
}
.ig-card:hover {
  transform: scale(1.05) translateZ(0);
}
.ig-container:hover > .ig-card:not(:hover){
  filter: brightness(0.5) saturate(0.3) contrast(1.2) blur(3px)
}
.ig-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 70px;
  margin-top: 30px;
  padding: 0;
  width: 100%;
}
.ig-container li:nth-child(2n) {
  margin-top: 70px;
  margin-bottom: 20px;
}
.ig-img-con {
  position: relative;
  width: 100%;
}
.ig-img {
  display: flex;
  align-content: center;
  justify-content: center;
}
.ig-img img{
  width: 98%;
  border-radius: 20px;
}
.ig-img-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top-left-radius: 30%;
  border-bottom-right-radius: 10px;
}
.ig-play {
  position: relative;
  width: 80%;
  height: 80%;
  border-radius: 30%;
  border: 0;
  transition: 0.3s;
  cursor: pointer;
  color: #fff;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
}
.ig-play:hover {
  width: 90%;
  height: 90%;
  text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.5);
}
.ig-play:active {
  background-color: #000 !important;
}
.ig-play:after {
  position: absolute;
  top: 5px;
  right: 10px;
  content: "Move";
  clear: both;
  width: 50px;
  height: 24px;
  line-height: 22px;
  text-align: center;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: 0.3s;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.ig-img-icon::before{
  position: absolute;
  content: "";
  top: -15px;
  right: -6px;
  background: transparent;
  width: 2rem;
  height: 1.6rem;
  border-bottom-right-radius: 2em;
  border-right: 10px solid rgb(255, 255, 255);
  border-bottom: 10px solid rgb(255, 255, 255);
  transform: rotate(-4deg);
}
.ig-img-icon::after{
  position: absolute;
  content: "";
  bottom: -9.5px;
  left: -14px;
  background: transparent;
  width: 1.5rem;
  height: 1.5rem;
  border-bottom-right-radius: 2em;
  border-right: 10px solid rgb(255, 255, 255);
  border-bottom: 10px solid rgb(255, 255, 255);
  transform: rotate(-2deg);
}
.ig-play:hover span {
  font-size: 4em;
}
.ig-play:hover::after {
  opacity: 1;
  visibility: visible;
}
.ig-play span {
  font-size: 3.5em;
  transition: 0.3s;
}
.ig-content {
  padding: 10px 20px;

}
.ig-con-tit {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.5;
}
.ig-con-name {
  font-size: 18px;
  color: #333;
}
.ig-con-flex {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  color: #888;
}
/* 작은 모바일 (300px 이하) */
@media (max-width: 300px) {
  /* 스타일 정의 */
}

/* 모바일 (320px 이상) */
@media (max-width: 429px) {
  .ig-card {
    width: 250px;
    height: 430px;
  }
  .ig-container {
    grid-template-columns: 1fr;
    gap: 30px 0;
    margin-top: 20px;
  }
  .ig-container li:nth-child(2n) {
    margin-top: 0;
    margin-bottom: 0;
  }
  .ig-play span {
    font-size: 20px;
  }
  .ig-play:hover span {
    font-size: 26px;
  }
  .ig-img-icon::before{
    top: -12px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(-2deg);
  }
  .ig-img-icon::after{
    bottom: -9px;
    left: -13px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(3deg);
  }
  .ig-content {
    padding: 10px;
  }
  .ig-con-tit {
    font-size: 20px;
  }
  .ig-con-name {
    font-size: 16px;
  }
  .ig-con-flex {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
}

@media (min-width: 430px) and (max-width: 600px) {
  .ig-card {
    width: 300px;
    height: 450px;
  }
  .ig-container {
    grid-template-columns: 1fr;
    gap: 30px 0;
    margin-top: 20px;
  }
  .ig-container li:nth-child(2n) {
    margin-top: 0;
    margin-bottom: 0;
  }
  .ig-play span {
    font-size: 26px;
  }
  .ig-play:hover span {
    font-size: 30px;
  }
  .ig-img-icon::before{
    top: -13px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(-2deg);
  }
  .ig-img-icon::after{
    bottom: -8px;
    left: -13px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(3deg);
  }
  .ig-content {
    padding: 10px;
  }
  .ig-con-tit {
    font-size: 20px;
  }
  .ig-con-name {
    font-size: 16px;
  }
  .ig-con-flex {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
}

/* 중간 크기 태블릿 (768px 이하) */
@media (min-width: 601px) and (max-width: 768px) {
  .ig-card {
    width: 300px;
    height: 450px;
  }
  .ig-container {
    grid-template-columns: 1fr;
    gap: 30px 0;
    margin-top: 20px;
  }
  .ig-container li:nth-child(2n) {
    margin-top: 0;
    margin-bottom: 0;
  }
  .ig-play span {
    font-size: 26px;
  }
  .ig-play:hover span {
    font-size: 30px;
  }
  .ig-img-icon::before{
    top: -13px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(-2deg);
  }
  .ig-img-icon::after{
    bottom: -8px;
    left: -13px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(3deg);
  }
  .ig-content {
    padding: 10px;
  }
  .ig-con-tit {
    font-size: 20px;
  }
  .ig-con-name {
    font-size: 16px;
  }
  .ig-con-flex {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
}
@media (min-width: 769px) and (max-width: 1080px) {
  .ig-card {
    width: 300px;
    height: 450px;
  }
  .ig-container {
    grid-template-columns: 1fr 1fr;
    gap: 0 50px;
    margin-top: 20px;
  }
  .ig-container li:nth-child(2n) {
    margin-top: 50px;
    margin-bottom: 10px;
  }
  .ig-play span {
    font-size: 26px;
  }
  .ig-play:hover span {
    font-size: 30px;
  }
  .ig-img-icon::before{
    top: -13px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(-2deg);
  }
  .ig-img-icon::after{
    bottom: -8px;
    left: -13px;
    width: 20px;
    height: 20px;
    border-right: 8px solid rgb(255, 255, 255);
    border-bottom: 8px solid rgb(255, 255, 255);
    transform: rotate(3deg);
  }
  .ig-content {
    padding: 10px;
  }
  .ig-con-tit {
    font-size: 20px;
  }
  .ig-con-name {
    font-size: 16px;
  }
  .ig-con-flex {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
}
</style>