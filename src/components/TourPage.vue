<script setup>
import { ref, computed } from 'vue'
import { igTours } from '@/assets/data/igTours.js'

const today = new Date()
const currentTab = ref('upcoming')

const sortedTours = computed(() => {
  if (currentTab.value === 'upcoming') {
    return igTours
      .filter(tour => new Date(tour.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  } else {
    return igTours
      .filter(tour => new Date(tour.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date)) 
  }
})
const currentTabText = computed(() => {
  return currentTab.value === 'upcoming' ? 'Upcoming' : 'Past'
})
</script>

<template>
  <section class="tour">
    <div class="tour-left">
      <div class="tour-left-img1"></div>
      <div class="tour-left-txt1" data-aos="fade-up" data-aos-duration="500">TOUR</div>
      <div class="tour-left-txt2" data-aos="fade-up" data-aos-duration="1200">TOUR</div>
    </div>
    <div class="tour-right">
      <ul class="tour-tap">
        <li class="tour-current">{{ currentTabText }}</li>
        <li>
          <div :class="{ active: currentTab === 'upcoming' }" @click="currentTab = 'upcoming'">Upcoming</div>
          <div :class="{ active: currentTab === 'past' }" @click="currentTab = 'past'">Past</div>
        </li>
      </ul>
      <ul v-for="tour in sortedTours" :key="tour.id" class="tour-list" 
        data-aos="fade-up" 
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="700"
        >
        <li class="tour-list-inner" >
          <ol>
            <li class="tour-tit">
              <div>{{ tour.title }}</div>
            </li>
            <li class="tour-londat">
              <div>{{ tour.city }} / {{ tour.country }}</div>
              <div>{{ tour.date }}</div>
            </li>
          </ol>
          <div class="tour-ticket">
            <a v-if="tour.ticket && currentTab !== 'past'" :href="tour.ticket" target="_blank">
            <button class="ticket-btn">
              Tickets
            </button>
          </a>
          </div>
        </li>
      </ul>
      <ul v-for="tour in sortedTours" :key="tour.id" class="m-tour-list" 
        data-aos="fade-up" 
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="700"
        >
        <li class="m-tour-list-inner">
          <ol>
            <li class="m-tour-tit">
              <div>{{ tour.title }}</div>
            </li>
            <li class="m-tour-londat">
              <div class="fz-14">
                <div>{{ tour.city }} / {{ tour.country }}</div>
                <div>{{ tour.date }}</div>
              </div>
              <div class="m-tour-ticket">
                <a v-if="tour.ticket && currentTab !== 'past'" :href="tour.ticket" target="_blank">
                  <button class="m-ticket-btn">
                    Tickets
                  </button>
                </a>
              </div>
            </li>
          </ol>
        </li>
      </ul>
    </div>
  </section>
</template>
<style lang="scss">
.tour {
  width: 100%;
  @media screen and (max-width: 899px) {
    display: flex;
    flex-direction: column;
    padding: 100px 30px 0;
    margin-bottom: 100px;
    align-items: center;
  }
  @media screen and (min-width: 900px) and (max-width: 999px) {
    display: grid;
    grid-template-columns: 20% 80%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
  @media screen and (min-width: 1000px) and (max-width: 1199px) {
    display: grid;
    grid-template-columns: 30% 70%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
  @media screen and (min-width: 1200px) {
    display: grid;
    grid-template-columns: 40% 60%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
}
.tour-left {
  position: relative;
  @media screen and (max-width: 899px) {
    width: 100%;
    padding-left: 20px;
  }
  @media screen and (min-width: 900px) and (max-width: 999px) {
    width: 100%;
    height: 100vh;
    padding-left: 20px;
  }
  @media screen and (min-width: 1000px)  {
    width: 100%;
    height: 100vh;
    padding-left: 70px;
  }
}
.tour-left-img1 {
  position: absolute;
  top: -130px;
  z-index: -1;
  background-image: url('/src/assets/img/tour.png');
  background-size: 75%;
  background-repeat: no-repeat;
  @media screen and (max-width: 899px) {
    top: -30px;
    width: 100%;
    height: 100vh;
    left: 0px;
  }
  @media screen and (min-width: 900px) and (max-width: 1500px) {
    width: 70vw;
    height: 100vh;
    left: 50px;
    background-position: left;
  }
  @media screen and (min-width: 1501px)  {
    width: 40vw;
    background-position: right;
    height: 100vh;
  }
}
.tour-left-txt1, .tour-left-txt2 {
  position: absolute;
  font-weight: bold;
  -webkit-text-stroke-color: #eee;
  color: transparent;
  display: inline-block;
  @media screen and (max-width: 899px) { font-size: 20vw; -webkit-text-stroke-width: 2px;}
  @media screen and (min-width: 900px) and (max-width: 1400px) {font-size: 12vw;  -webkit-text-stroke-width: 1px;}
  @media screen and (min-width: 1401px) { font-size: 10vw;  -webkit-text-stroke-width: 1px;}
}
.tour-left-txt1 {
  z-index: -1;
  @media screen and (max-width: 899px) {top: -20px; right: 0;}
  @media screen and (min-width: 900px) {top: -50px; left: 2%;}
}
.tour-left-txt2 {
  z-index: -1;
  @media screen and (max-width: 899px) { 
    width: 100%;
    bottom: -108vh; 
    left: 0;
    background-image: url('/src/assets/img/tour_bg2.png');
    background-size: 75%;
    background-repeat: no-repeat;
    background-position: top right;
    overflow: hidden !important;
  }
  @media screen and (min-width: 900px) { bottom: -50px; left: 15%;}
}
.tour-right {
  position: relative;
  padding: 30px;
  background-color: #222;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  @media screen and (max-width: 899px) {
    width: 90%;
    height: 100%;
    margin-top: 100px;
  }
  @media screen and (min-width: 900px)  {
    width: 90%;
    height: 100%;
    margin-top: 30px;
    // &::after {
    // position: absolute;
    // bottom: 0px;
    // display: block;
    // content: 'UPCOMMING SHOW';
    // clear: both;
    // width: 80%;
    // opacity: 0.3;
    // right: 30px;
    // font-size: 4vw;
    // text-align: right;
    // animation: shimmer 2s ease-in-out infinite;
    // }
    @keyframes shimmer {
      0%, 100% {
        opacity: 0.1;
      }
      50% {
        opacity: 0.3;
      }
    }
  }
  
}
.tour-tap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0;
  li {
    display: flex;
    gap: 0 20px;
      div{
        width: 100px;
        cursor: pointer;
        border: 1px solid #eee;
        padding: 5px 0;
        text-align: center;
        border-radius: 5px;
        @media screen and (max-width: 899px) {
          width: 90px;
        }
        @media screen and (min-width: 1400px)  {
          &:hover {
          background-color: rgba(255, 255, 255, 0.5);
          font-weight: bold;
        }
        }
      }
    .active {
      background-color: #fff;
      color: #000;
      font-weight: bold;
    }
  }
}
@media screen and (max-width: 899px) {
  .tour-tap > .tour-current {display: none;}
  .m-tour-list {display: block;}
  .tour-list{display: none;}
}
@media screen and (min-width: 900px)  {
  .m-tour-list {display: none !important;}
  .tour-list{display: block;}
}

.tour-current {
  font-weight: bold;
  font-size: 24px;
}

.tour-list {
  padding: 0;
}
.tour-list-inner {
  display: grid;
  align-items: center;
  border-top: 1px solid #eee; 
  border-bottom: 1px solid #ddd;
  ol {
    padding: 0;
  }
  grid-template-columns: 85% 15%;
  padding: 10px 30px;
}
.tour-tit > div{
  font-weight: bold !important;
  padding-bottom: 10px;
  font-size: 18px;
}
.tour-londat {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.tour-ticket {
  text-align: center;
}

.ticket-btn {
  width: 100px;
  height: 38px;
  color: #000;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow:inset 2px 2px 2px 0px rgba(0, 0, 0, 0.3),
                    2px 2px 5px 0px rgba(255, 255, 255, 0.1),
                    2px 2px 5px 0px rgba(255, 255, 255, 0.1);
  outline: none;
  background-color: #fff;
  border: none;
  line-height: 30px;
  z-index: 1;
  font-size: 16px;
  margin: 20px;
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-image: linear-gradient(315deg, #6e6e6e 0%, #0d0d0d 74%);
    background-color: #f0ecfc;
    border-radius: 5px;
    box-shadow:
      inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1),
      4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  a {
    position: relative;
  }
  @media screen and (min-width: 900px)  {
    &:active {
      top: 2px;
    }
    &:hover {
      color: #fff;
      &::after {
        left: 0;
        width: 100%;
      }
    }
  }
}

/*Mobile*/
.m-tour-list {
  padding: 0;
}
.m-tour-list-inner {
  padding: 10px 0px;
  border-top: 1px solid #eee; 
  border-bottom: 1px solid #ddd;
  ol {
    padding: 0;
  }
}
.m-tour-tit > div{
  font-weight: bold !important;
  padding-bottom: 10px;
  font-size: 16px;
}
.m-tour-londat {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.m-tour-ticket {
  text-align: center;
}
.m-ticket-btn {
  width: 80px;
  height: 38px;
  color: #000;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow:inset 2px 2px 2px 0px rgba(0, 0, 0, 0.3),
                    2px 2px 5px 0px rgba(255, 255, 255, 0.1),
                    2px 2px 5px 0px rgba(255, 255, 255, 0.1);
  outline: none;
  background-color: #fff;
  border: none;
  line-height: 30px;
    z-index: 1;
    margin-left: 10px;
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-image: linear-gradient(315deg, #6e6e6e 0%, #0d0d0d 74%);
    background-color: #f0ecfc;
    border-radius: 5px;
    box-shadow:
      inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
      7px 7px 20px 0px rgba(0, 0, 0, 0.1),
      4px 4px 5px 0px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  a {
    position: relative;
  }
}
</style>