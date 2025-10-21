<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '@/firebase.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

// 관리자 로그인 상태
const user = ref(null)
onAuthStateChanged(auth, (u) => {
  user.value = u
})

// Firestore tours 컬렉션
const tours = ref([])
const toursCollection = collection(db, 'tours')

// 새 투어 입력값
const newTour = ref({
  title: '',
  date: '',
  set: '',
  city: '',
  country: '',
  ticket: ''
})

// Firestore에서 데이터 불러오기
const fetchTours = async () => {
  const snapshot = await getDocs(toursCollection)
  tours.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
onMounted(fetchTours)

// 추가
const addTour = async () => {
  if (!newTour.value.title) return alert('제목을 입력하세요!')
  await addDoc(toursCollection, newTour.value)
  newTour.value = { title: '', date: '', set: '', city: '', country: '', ticket: '' }
  fetchTours()
}

// 수정 (모든 필드)
const editTour = async (tour) => {
  const updated = {
    title: prompt('새 제목 입력', tour.title) || tour.title,
    date: prompt('새 날짜 입력', tour.date) || tour.date,
    set: prompt('새 세트 입력', tour.set) || tour.set,
    city: prompt('새 도시 입력', tour.city) || tour.city,
    country: prompt('새 국가 입력', tour.country) || tour.country,
    ticket: prompt('새 티켓 URL 입력', tour.ticket) || tour.ticket
  }
  await updateDoc(doc(db, 'tours', tour.id), updated)
  fetchTours()
}

// 삭제
const deleteTourItem = async (id) => {
  if (confirm('정말 삭제하시겠어요?')) {
    await deleteDoc(doc(db, 'tours', id))
    fetchTours()
  }
}
</script>

<template>
  <section class="admin">
    <h2>Admin Page</h2>

    <div v-if="!user">
      <p>로그인 후 이용 가능합니다.</p>
    </div>

    <div v-else>
      <!-- 투어 추가 폼 -->
      <h3>투어 추가</h3>
      <input v-model="newTour.title" placeholder="Title" />
      <input v-model="newTour.date" placeholder="Date (YYYY-MM-DD)" />
      <input v-model="newTour.set" placeholder="Set" />
      <input v-model="newTour.city" placeholder="City" />
      <input v-model="newTour.country" placeholder="Country" />
      <input v-model="newTour.ticket" placeholder="Ticket URL" />
      <button @click="addTour">추가</button>

      <!-- 투어 목록 -->
      <h3>투어 목록</h3>
      <ul>
        <li v-for="t in tours" :key="t.id">
          <strong>{{ t.title }}</strong> - {{ t.set }}<br />
          {{ t.city }} / {{ t.country }} ({{ t.date }})<br />
          <a v-if="t.ticket" :href="t.ticket" target="_blank">티켓보기</a><br />
          <button @click="editTour(t)">수정</button>
          <button @click="deleteTourItem(t.id)">삭제</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.admin {
  padding: 100px 0;
}
input {
  margin: 5px;
  padding: 5px;
}
button {
  margin-left: 5px;
}
</style>