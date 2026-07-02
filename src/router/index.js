import { createRouter, createWebHistory } from 'vue-router';

const adminEmails = ['mjtwins1@naver.com']

const MainPageView = () => import('@/components/MainPage.vue')
const MusicCategoryView = () => import('@/components/musicCategory.vue')
const TourPageView = () => import('@/components/TourPage.vue')
const AboutPageView = () => import('@/components/AboutPage.vue')
const NotFoundView = () => import('@/components/unit/NotFound.vue')
const Login = () => import('@/components/Login.vue')
const Admin = () => import('@/components/Admin.vue')

async function getCurrentUser() {
  const [{ auth }, { onAuthStateChanged }] = await Promise.all([
    import('@/firebase.js'),
    import('firebase/auth')
  ])

  if (auth.currentUser) return auth.currentUser

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

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
    component: Admin
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
    getCurrentUser().then((user) => {
      if (user && adminEmails.includes(user.email)) return next()

      alert(user ? '권한이 없는 계정입니다.' : '관리자 페이지는 로그인 후 접근 가능합니다.')
      next({ name: 'Login' })
    })
  } else {
    next()
  }
})

export default router;
