<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase.js'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const admins = [
  'mjtwins1@naver.com'
]

const router = useRouter()

const email = ref('')
const password = ref('')
const user = ref(null)

onAuthStateChanged(auth, (u) => {
  user.value = u
})


const handleLogin = async () => {
  try {
    if (!admins.includes(email.value)) {
      alert('Account does not have permission.')
      return
    }

    // Firebase 로그인
    await signInWithEmailAndPassword(auth, email.value, password.value)
    alert('Login successful!')
    router.push('/admin')

  } catch (err) {
    console.error(err)
    if (err.code === 'auth/wrong-password') alert('Incorrect password.')
    else if (err.code === 'auth/user-not-found') alert('Account does not exist.')
    else alert('Login error: ' + err.message)
  }
}

// 로그아웃
const handleLogout = async () => {
  await signOut(auth)
  alert('Logout successful!')
  email.value = ''
  password.value = ''
}
</script>

<template>
  <section class="login">
    <div class="login__box">
      <h2>ADMIN LOGIN</h2>
      <div v-if="user" class="login__status">
        <div class="login__txt">
          <div class="login__email">{{ user.email }}</div> 
          <div>is currently logged in.</div>
        </div>
        <div class="login__out">
          <router-link to="/admin" class="login__link">Move to ADMIN PAGE→</router-link>
          <button class="login__outbtn" @click="handleLogout">LOGOUT</button>
        </div>
      </div>
      <div v-else class="login__form">
        <form @submit.prevent="handleLogin">
          <input v-model="email" type="email" placeholder="email@example.com" required autocomplete="username" />
          <input v-model="password" type="password" placeholder="passward" required autocomplete="current-password" />
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login {
  height: 80vh;
  display: flex;
  align-items: center;

  &__box{
    max-width: 400px;
    margin: auto;
    padding: 30px;
    border-radius: 20px;
    border: 1px solid #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
    font-family: 'Pretendard', sans-serif;
    backdrop-filter: blur(3px) brightness(0.9) contrast(140%) saturate(200%);
    -webkit-backdrop-filter: blur(3px)  brightness(0.9) contrast(140%) saturate(200%);
    filter: brightness(1) saturate(1.2) contrast(0.85);
    transform: scale(1) translateZ(0);
    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 800;
    }
  }
  &__txt{
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
  &__email {
    font-weight: 700;
  }
  &__out {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  &__link{
    display: block;
    margin: 10px 0;
    background-color: #2563eb;
    font-size: 16px;
    border-radius: 5px;
    padding: 3px 10px;
    &:hover {
      background: #4f46e5;
    }
  }
  &__outbtn {
    background: #ef4444;
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    margin: 5px 0;
    &:hover{
      background: #dc2626;
    }
  }
  &__form {
    form{
      input{
        width: 100%;
        padding: 10px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
      }
      button {
        width: 100%;
        padding: 10px;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: #310071;
        }
      }
    }
  }
}
@media (max-width: 769px){
  .login{
    padding: 0 20px;
    &__box{
      padding: 30px 20px;
    }
  }
}

</style>