import { createRouter, createWebHistory } from 'vue-router';
import MainPageView from '@/components/MainPage.vue';
import MusicCategoryView from '@/components/musicCategory.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;