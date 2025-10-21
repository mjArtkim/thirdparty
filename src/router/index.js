import { createRouter, createWebHistory } from 'vue-router';
import MainPageView from '@/components/MainPage.vue';
import MusicCategoryView from '@/components/musicCategory.vue';
import TourPageView from '@/components/TourPage.vue';
import AboutPageView from '@/components/AboutPage.vue';
import NotFoundView from '@/components/unit/NotFound.vue';
import Login from '@/components/Login.vue'
import Admin from '@/components/Admin.vue'
import { auth } from '@/firebase.js' 
import { onAuthStateChanged } from 'firebase/auth'

const adminEmails = ['mjtwins1@naver.com']

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
  // 404 Page Require last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', 
    name: 'Admin', 
    component: Admin,
    beforeEnter: (to, from, next) => {
      const user = auth.currentUser
      if (user && adminEmails.includes(user.email)) {
        next()
      } else {
        alert('권한이 없는 계정입니다.')
        next('/login') // 로그인 페이지로 이동
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Admin') {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert('관리자 페이지는 로그인 후 접근 가능합니다.')
        next({ name: 'Login' })
      } else if (!adminEmails.includes(user.email)) {
        alert('권한이 없는 계정입니다.')
        next({ name: 'Login' })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router;