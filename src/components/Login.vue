<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase.js'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

// 관리자 계정 리스트
const admins = [
  'mjtwins1@naver.com'
]

const router = useRouter()

// 상태 변수
const email = ref('')
const password = ref('')
const user = ref(null)

// 로그인 상태 실시간 감지
onAuthStateChanged(auth, (u) => {
  user.value = u
})

// 로그인 실행
const handleLogin = async () => {
  try {
    // 허용된 관리자 이메일인지 확인
    if (!admins.includes(email.value)) {
      alert('권한이 없는 계정입니다.')
      return
    }

    // Firebase 로그인
    await signInWithEmailAndPassword(auth, email.value, password.value)
    alert('로그인 성공!')
    router.push('/admin')

  } catch (err) {
    console.error(err)
    if (err.code === 'auth/wrong-password') alert('비밀번호가 올바르지 않습니다.')
    else if (err.code === 'auth/user-not-found') alert('계정이 존재하지 않습니다.')
    else alert('로그인 오류: ' + err.message)
  }
}

// 로그아웃
const handleLogout = async () => {
  await signOut(auth)
  alert('로그아웃 완료!')
  email.value = ''
  password.value = ''
}
</script>

<template>
  <section class="login">
    <h2>관리자 로그인</h2>

    <!-- 로그인 상태 -->
    <div v-if="user" class="login-status">
      <p><strong>{{ user.email }}</strong> 님이 로그인 중입니다.</p>
      <button class="logout-btn" @click="handleLogout">로그아웃</button>
      <router-link to="/admin" class="admin-link">→ 관리자 페이지로 이동</router-link>
    </div>

    <!-- 로그인 폼 -->
    <div v-else class="login-form">
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="이메일 입력" required autocomplete="username" />
        <input v-model="password" type="password" placeholder="비밀번호 입력" required autocomplete="current-password" />
        <button type="submit">로그인</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
}

.login h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-form button:hover {
  background: #4338ca;
}

.switch-mode {
  margin-top: 15px;
  font-size: 14px;
}

.switch-mode a {
  color: #4f46e5;
  cursor: pointer;
  font-weight: 600;
}

.login-status p {
  margin-bottom: 15px;
}

.logout-btn {
  background: #ef4444;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
}

.logout-btn:hover {
  background: #dc2626;
}

.admin-link {
  display: block;
  margin-top: 8px;
  color: #2563eb;
  text-decoration: underline;
  font-size: 14px;
}
</style>