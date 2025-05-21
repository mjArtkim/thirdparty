<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import TextPlugin from 'gsap/TextPlugin'
import { Observer } from 'gsap/Observer';
import { useRoute } from 'vue-router';
gsap.registerPlugin(TextPlugin);
const route = useRoute();

// Plugin 등록
if (!gsap.core.globals().Observer) gsap.registerPlugin(Observer);

const sections = ref([]);
const count = ref(null);
let animating = false;
let currentIndex = 0;

const slides = [
  {
    heading: 'AOBUT',
    img: '/src/assets/img/about1.png',
    mytext: 'YES, YES, YES',
    mytext2: 'My Name Is THIRD PARTY',
  },
  {
    heading: 'TOGETHER',
    img: '/src/assets/img/about2.png',
    mytext: ''
  },
  {
    heading: 'JONNIE&HARRY',
    img: '/src/assets/img/about3.png',
    mytext: ''
  },
  {
    heading: 'PARTY',
    img: '/src/assets/img/about4.png',
    mytext: ''
  }
];

const overlayImages = [
  {
    img: '/src/assets/img/about5.png',
    mytext3: 'YES, YES, YES',
  },
  {
    img: '/src/assets/img/about6.png',
    mytext3: 'YES, YES, YES',
  },
  {
    img:   '/src/assets/img/about7.png',
    mytext3: 'YES, YES, YES',
  },
  {
    img: '/src/assets/img/about8.png',
    mytext3: 'YES, YES, YES',
  },
];

const wrap = gsap.utils.wrap(0, slides.length);

onMounted(() => {
  const allSections = sections.value;
  const images = gsap.utils.toArray('.image').reverse();
  const slideImages = gsap.utils.toArray('.slide__img');
  const outerWrappers = gsap.utils.toArray('.slide__outer');
  const innerWrappers = gsap.utils.toArray('.slide__inner');

  gsap.set(outerWrappers, { xPercent: 100 });
  gsap.set(innerWrappers, { xPercent: -100 });
  gsap.set('.slide:nth-of-type(1) .slide__outer', { xPercent: 0 });
  gsap.set('.slide:nth-of-type(1) .slide__inner', { xPercent: 0 });

  function gotoSection(index, direction) {
    animating = true;
    index = wrap(index);

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'expo.inOut' },
      onComplete: () => (animating = false)
    });

    const currentSection = allSections[currentIndex];
    const heading = currentSection.querySelector('.slide__heading');
    const nextSection = allSections[index];
    const nextHeading = nextSection.querySelector('.slide__heading');

    gsap.set([allSections, images], { zIndex: 0, autoAlpha: 0 });
    gsap.set([allSections[currentIndex], images[index]], { zIndex: 1, autoAlpha: 1 });
    gsap.set([allSections[index], images[currentIndex]], { zIndex: 2, autoAlpha: 1 });

    tl.set(count.value, { text: index + 1 }, 0.32)
      .fromTo(outerWrappers[index], { xPercent: 100 * direction }, { xPercent: 0 }, 0)
      .fromTo(innerWrappers[index], { xPercent: -100 * direction }, { xPercent: 0 }, 0)
      .to(heading, { '--width': 800, xPercent: 30 * direction }, 0)
      .fromTo(
        nextHeading,
        { '--width': 800, xPercent: -30 * direction },
        { '--width': 200, xPercent: 0 },
        0
      )
      .fromTo(
        images[index],
        { xPercent: 125 * direction, scaleX: 1.5, scaleY: 1.3 },
        { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
        0
      )
      .fromTo(
        images[currentIndex],
        { xPercent: 0, scaleX: 1, scaleY: 1 },
        { xPercent: -125 * direction, scaleX: 1.5, scaleY: 1.3 },
        0
      )
      .fromTo(slideImages[index], { scale: 2 }, { scale: 1 }, 0)
      .timeScale(0.8);

    currentIndex = index;
  }

  Observer.create({
    type: 'wheel,touch,pointer',
    preventDefault: true,
    wheelSpeed: -1,
    onUp: () => {
      if (animating) return;
      gotoSection(currentIndex + 1, 1);
    },
    onDown: () => {
      if (animating) return;
      gotoSection(currentIndex - 1, -1);
    },
    tolerance: 10
  });

  document.addEventListener('keydown', (e) => {
    if ((e.code === 'ArrowUp' || e.code === 'ArrowLeft') && !animating) {
      gotoSection(currentIndex - 1, -1);
    }
    if (
      ['ArrowDown', 'ArrowRight', 'Space', 'Enter'].includes(e.code) &&
      !animating
    ) {
      gotoSection(currentIndex + 1, 1);
    }
  });
});
</script>

<template>
  <div class="h100vh">
    <section
      v-for="(slide, index) in slides"
      :key="index"
      class="slide"
      ref="sections"
    >
      <div class="slide__outer">
        <div class="slide__inner">
          <div class="slide__content">
            <div class="slide__container">
              <h2 class="slide__heading">{{ slide.heading }}</h2>
              <div class="slide__innertxt">{{ slide.mytext }}</div>
              <div class="slide__innertxt2">{{ slide.mytext2 }}</div>
              <figure class="slide__img-cont">
                <img class="slide__img" :src="slide.img" alt="" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="overlay" 
    v-for="(img, index) in overlayImages"
    :key="index">
      <div class="overlay__content">
        <figure class="overlay__img-cont">
          <img
            class="image"
            :src="img.img"
          />
        </figure>
      </div>
    </section>
  </div>
</template>


<style lang="scss" scoped>
::-webkit-scrollbar {display: none;}

.slide {
  height: 100%;
  width: 100%;
  top: 0;
  position: fixed;
  visibility: hidden;

  &__outer,
  &__inner {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
  }

  &__container {
    position: relative;
    max-width: 1600px;
    width: 100vw;
    margin: 100px auto 0;
    height: calc(100vh - 100px);
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    padding: 0 1rem;
  }

  &__heading {
    --width: 200;
    display: block;
    text-align: left;
    font-size: clamp(2rem, 12vw, 12rem);
    font-weight: 900;
    font-variation-settings: "wdth" var(--width);
    margin: 0;
    padding: 0;
    color: #f2f1fc;
    z-index: 99;
    mix-blend-mode: difference;
    grid-area: 1 / 1 / 2 / 8;
    align-self: end;
    margin-bottom: 30px;
  }

  &__innertxt{
    position: absolute;
    width: 45%;
    top: 10px;
    right: 0;
    z-index: 99;
    font-size: clamp(1rem, 2.5vw, 2.5rem);
  }
  &__innertxt2{
    position: absolute;
    width: 45%;
    top: 60px;
    right: 0;
    z-index: 99;
    font-size: clamp(1rem, 2.5vw, 2.5rem);
  }
  &__img-cont {
    margin-top: 4rem;
    grid-area: 2 / 1 / 7 / 8;

    img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }
  }
    figure {
    margin: 0;
    overflow: hidden;
  }
}

.slide:nth-of-type(1) {
  visibility: visible;
  .slide__content {
    background-color: #000000;
  }
}

.slide:nth-of-type(2) {
  .slide__content {
    background-color: #10407a;
  }
}

.slide:nth-of-type(3) {
  .slide__content {
    background-color: #09023c;
  }
}

.slide:nth-of-type(4) {
  .slide__content {
    background-color: #40100D;
  }
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
    figure {
    margin: 0;
    overflow: hidden;
  }
  &__content {
    max-width: 1400px;
    width: 100vw;
    margin: 0 auto;
    padding: 0 1rem;
    height: calc(100vh - 120px);
    margin-bottom: 10vh;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  &__img-cont {
    position: relative;
    overflow: hidden;
    margin: 0;
    grid-area: 4 / 3 / 9 / 11;

    img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 25% 25%;
    }
  }

}

@media screen and (min-width: 900px) {
  .overlay__content,
  .slide__container {
    padding: 0 3rem;
    margin-top: 10vh;
    height: 80vh;
  }

  .overlay__img-cont {
    grid-area: 5 / 4 / 10 / 11;
  }

  .overlay__count {
    grid-area: 3 / 10 / 4 / 11;
  }

  .slide__img-cont {
    margin-top: 0;
    grid-area: 3 / 2 / 8 / 7;
  }

  .slide__heading {
    grid-area: 1 / 1 / 4 / 10;
  }
}

</style>