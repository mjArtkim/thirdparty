import { createRouter, createWebHistory } from 'vue-router';
import MainPageView from '@/components/MainPage.vue';
import MusicCategoryView from '@/components/musicCategory.vue';
import TourPageView from '@/components/TourPage.vue';
import AboutPageView from '@/components/AboutPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPageView,
  },
  {
    path: '/musiccategory',
    name: 'musiccategory',
    component: MusicCategoryView,
  },
  {
    path: '/tourpage',
    name: 'tourpage',
    component: TourPageView,
  },
  {
    path: '/aboutpage',
    name: 'aboutpage',
    component: AboutPageView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;