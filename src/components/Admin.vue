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

const isTBAValue = (value) => {
  if (!value) return true
  if (typeof value === 'string' && value.trim().toUpperCase() === 'TBA') return true
  return false
}

const normalizeAdminDate = (value) => {
  const isTBA = isTBAValue(value)
  return { isTBA, date: isTBA ? '' : value }
}

const newTour = ref({
  title: '',
  date: '',
  set: '',
  city: '',
  country: '',
  ticket: ''
})
const newTourTBA = ref(false)

const fetchTours = async () => {
  const q = query(toursCollection, orderBy('date', 'desc'))
  const snapshot = await getDocs(q) 
  tours.value = snapshot.docs.map(doc => {
    const data = doc.data()
    const { isTBA, date } = normalizeAdminDate(data.date)
    return { id: doc.id, isEditing: false, isTBA, ...data, date }
  })
}
onMounted(fetchTours)

const setNewTourTBA = (checked) => {
  newTourTBA.value = checked
  if (checked) newTour.value.date = ''
}

const setTourTBA = (tour, checked) => {
  tour.isTBA = checked
  if (checked) {
    tour._prevDate = tour.date
    tour.date = ''
  } else if (!tour.date && tour._prevDate) {
    tour.date = tour._prevDate
  }
}

const addTour = async () => {
  if (!newTour.value.title) return alert('Enter Title!')
  const payload = {
    ...newTour.value,
    date: newTourTBA.value ? '' : newTour.value.date
  }
  await addDoc(toursCollection, payload)
  newTour.value = { title: '', date: '', set: '', city: '', country: '', ticket: '' }
  newTourTBA.value = false
  fetchTours()
}

const saveTour = async (tour) => {
  const updated = {
    title: tour.title,
    date: tour.isTBA ? '' : tour.date,
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
          <div class="admin__date">
            <input v-model="newTour.date" placeholder="Date (YYYY-MM-DD)" :disabled="newTourTBA" />
            <label class="admin__tba">
              <input type="checkbox" :checked="newTourTBA" @change="setNewTourTBA($event.target.checked)" />
              TBA
            </label>
          </div>
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
            <div class="admin__inner">
              <div v-if="!t.isEditing">{{ t.title }}</div>
              <input v-else v-model="t.title" />
            </div>
            <div class="admin__inner">
              <div v-if="!t.isEditing">{{ t.set }}</div>
              <input v-else v-model="t.set" />
            </div>
            <div class="admin__inner">
              <div v-if="!t.isEditing" class="admin-flex">
                <div>{{ t.city }}</div>
                <div>{{ t.country }} ({{ t.isTBA ? 'TBA' : t.date }})</div>
              </div>
              <div v-else class="admin-flex">
                <div><input v-model="t.city" placeholder="City" /></div>
                <div><input v-model="t.country" placeholder="Country" /></div>
                <div class="admin__date">
                  <input v-model="t.date" placeholder="Date (YYYY-MM-DD)" :disabled="t.isTBA" />
                  <label class="admin__tba">
                    <input type="checkbox" :checked="t.isTBA" @change="setTourTBA(t, $event.target.checked)" />
                    TBA
                  </label>
                </div>
              </div>
            </div>
            <div class="admin__inner">
              <div v-if="t.ticket && !t.isEditing">
                <a :href="t.ticket" target="_blank">View Ticket</a>
              </div>
              <div v-else-if="t.isEditing">
                <input v-model="t.ticket" placeholder="Ticket URL" />
              </div>
            </div>
          </div>
          <div class="admin__btn">
            <button v-if="!t.isEditing" @click="t.isEditing = true" class="ad-btne">Edit</button>
            <button v-else @click="saveTour(t)" class="ad-btns">Save</button>
            <button @click="deleteTourItem(t.id)" class="ad-btnd">Delete</button>
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
    width: 100%;
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
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    input {
      font-size: 16px;
      padding: 5px 10px;
    }
  }
  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    input {
      flex: 1;
    }
  }
  &__tba {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    white-space: nowrap;
    input {
      width: auto;
      height: auto;
      padding: 0;
      margin: 0;
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
      padding: 15px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
  &__tit {
    display: flex;
    align-items: center;
    font-size: 16px;
    gap: 10px;
  }
  &__inner {
    input {
      font-size: 16px;
      border: none;
      border-radius: 5px;
      padding: 3px 5px;
    }
    .admin__tba {
      input {
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        border: none;
        border-radius: 0;
      }
    }
    .admin-flex{
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  &__btn {
    display: flex;
    align-items: center;
    gap: 10px;
    button {
      font-size: 16px;
      padding: 3px 5px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
    }
    .ad-btne {
      background-color: #076400;
      color: #ddd;
      &:hover{
        background-color: #21901a;
      }
    }
    .ad-btns {
      background-color: #2563eb;
      color: #ddd;
      &:hover{
        background: #4f46e5;
      }
    }
    .ad-btnd {
      background: #ef4444;
      color: #ddd;
      &:hover{
        background: #dc2626;
      }
    }
  }
}

@media (max-width: 960px){
  .admin{
    &__enter {
      display: grid;
      grid-template-columns: 1fr;
    }
    &__list {
      li {
        width: 100%;
        align-items: flex-start;
        flex-direction: column;
      }
    }
    &__tit {
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
    }
    &__inner {
      width: 100%;
      input {
        width: 100%;
      }
      .admin-flex{
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        div {
          width: 100%;
        }
      }
    }
    &__btn {
      width: 100%;
      margin-top: 5px;
      justify-content: end;
    }
  }
}

</style>
