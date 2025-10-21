<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '@/firebase.js'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
onAuthStateChanged(auth, (u) => {
  user.value = u
})

const tours = ref([])
const toursCollection = collection(db, 'tours')

const newTour = ref({
  title: '',
  date: '',
  set: '',
  city: '',
  country: '',
  ticket: ''
})

const fetchTours = async () => {
  const q = query(toursCollection, orderBy('date', 'desc'))
  const snapshot = await getDocs(q) 
  tours.value = snapshot.docs.map(doc => ({ id: doc.id, isEditing: false, ...doc.data() }))
}
onMounted(fetchTours)

const addTour = async () => {
  if (!newTour.value.title) return alert('Enter Title!')
  await addDoc(toursCollection, newTour.value)
  newTour.value = { title: '', date: '', set: '', city: '', country: '', ticket: '' }
  fetchTours()
}

const saveTour = async (tour) => {
  const updated = {
    title: tour.title,
    date: tour.date,
    set: tour.set,
    city: tour.city,
    country: tour.country,
    ticket: tour.ticket
  }
  await updateDoc(doc(db, 'tours', tour.id), updated)
  tour.isEditing = false
}
// 삭제
const deleteTourItem = async (id) => {
  if (confirm('Are you sure delete?')) {
    await deleteDoc(doc(db, 'tours', id))
    fetchTours()
  }
}
</script>

<template>
  <section class="admin">
    <h2>Admin Page</h2>
    <div v-if="!user">
      <p>Available after login.</p>
    </div>
    <div v-else class="admin__box">
      <div class="admin__input">
        <h3>Tour ADD</h3>
        <div class="admin__enter">
          <input v-model="newTour.title" placeholder="Title" />
          <input v-model="newTour.date" placeholder="Date (YYYY-MM-DD)" />
          <input v-model="newTour.set" placeholder="Set" />
          <input v-model="newTour.city" placeholder="City" />
          <input v-model="newTour.country" placeholder="Country" />
          <input v-model="newTour.ticket" placeholder="Ticket URL" />
        </div>
        <button @click="addTour">ADD</button>
      </div>
      <h3 class="admin__listtit">Tour List</h3>
      <ul class="admin__list">
        <li v-for="t in tours" :key="t.id">
          <div class="admin__tit">
            <div>
              <div v-if="!t.isEditing">{{ t.title }}</div>
              <input v-else v-model="t.title" />
            </div>
            <div>
              <div v-if="!t.isEditing">{{ t.set }}</div>
              <input v-else v-model="t.set" />
            </div>
          </div>
          <div class="admin__tit">
            <span v-if="!t.isEditing">{{ t.city }} / {{ t.country }} ({{ t.date }})</span>
            <div v-else>
              <input v-model="t.city" placeholder="City" />
              <input v-model="t.country" placeholder="Country" />
              <input v-model="t.date" placeholder="Date (YYYY-MM-DD)" />
            </div>
          </div>
          <div v-if="t.ticket && !t.isEditing">
            <a :href="t.ticket" target="_blank">View Ticket</a>
          </div>
          <div v-else-if="t.isEditing">
            <input v-model="t.ticket" placeholder="Ticket URL" />
          </div>
          <div class="admin__btn">
            <button v-if="!t.isEditing" @click="t.isEditing = true">Edit</button>
            <button v-else @click="saveTour(t)">Save</button>
            <button @click="deleteTourItem(t.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss">
.admin {
  position: relative;
  padding: 100px 30px 30px;
  height: 100%;
  h2{
    font-size: 30px;
    font-weight: 800;
    padding-bottom: 30px;
  }
  &__input{
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 30px;
    h3 {
      font-size: 24px;
      font-weight: 600;
      padding-bottom: 10px;
    }
    button {
      margin: 20px 0 10px;
      background-color: #2563eb;
      color: #fff;
      border: 0;
      font-size: 20px;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background: #4f46e5;
      }
    }
  }
  &__enter {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    input {
      font-size: 16px;
      padding: 5px 10px;
    }
  }
  &__listtit{
    font-size: 24px;
    font-weight: 600;
    padding-bottom: 10px;
  }
  &__list {
    padding: 10px;
    li {
      border-top: 1px solid #ddd;
      margin: 5px 0;
      padding: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
  &__tit {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
}

</style>