<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { db } from '@/firebase.js'
import { collection, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'vue-router'


const router = useRouter()
const today = new Date()
const currentTab = ref('upcoming')
const viewMode = ref('list')
const currentCalendarMonth = ref('')
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

today.setHours(0, 0, 0, 0)
const tours = ref([])
const isMobile = ref(window.innerWidth < 899)
const loading = ref(true)
let unsubscribeTours = null

function handleResize() {
  isMobile.value = window.innerWidth < 899
}

function normalizeToStartOfDay(date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

function parseDateString(rawDate) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return new Date(`${rawDate}T00:00:00`)
  }

  return new Date(rawDate)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  const toursCollection = collection(db, 'tours')
  unsubscribeTours = onSnapshot(toursCollection, (snapshot) => {
    tours.value = snapshot.docs.map(doc => {
      const data = doc.data()
      const { dateObj, dateDisplay, isTBA } = normalizeDate(data.date)
      return {
        id: doc.id,
        ...data,
        dateObj,
        dateDisplay,
        isTBA
      }
    })
    loading.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (unsubscribeTours) unsubscribeTours()
})

function normalizeDate(rawDate) {
  if (rawDate && typeof rawDate.toDate === 'function') {
    const parsed = normalizeToStartOfDay(rawDate.toDate())
    if (!Number.isNaN(parsed.getTime())) {
      return {
        dateObj: parsed,
        dateDisplay: parsed.toLocaleDateString('en-CA'),
        isTBA: false
      }
    }
  }

  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim()
    const parsed = trimmed ? parseDateString(trimmed) : null
    if (parsed && !Number.isNaN(parsed.getTime())) {
      const normalized = normalizeToStartOfDay(parsed)
      return {
        dateObj: normalized,
        dateDisplay: trimmed,
        isTBA: false
      }
    }
  }

  return { dateObj: null, dateDisplay: 'TBA', isTBA: true }
}

const sortedTours = computed(() => {
  if (currentTab.value === 'upcoming') {
    return tours.value
      .filter(tour => tour.isTBA || tour.dateObj >= today)
      .sort((a, b) => {
        if (a.isTBA && !b.isTBA) return 1
        if (!a.isTBA && b.isTBA) return -1
        if (a.isTBA && b.isTBA) return 0
        return a.dateObj - b.dateObj
      })
  } else {
    return tours.value
      .filter(tour => tour.dateObj && tour.dateObj < today)
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, 10)
  }
})

const currentTabText = computed(() => {
  return currentTab.value === 'upcoming' ? 'Upcoming' : 'Past'
})

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getDateKey(date) {
  return `${getMonthKey(date)}-${String(date.getDate()).padStart(2, '0')}`
}

function createMonthDate(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1)
}

const availableCalendarMonths = computed(() => {
  return [...new Set(
    sortedTours.value
      .filter(tour => tour.dateObj)
      .map(tour => getMonthKey(tour.dateObj))
  )].sort()
})

watch(currentTab, (tab) => {
  const months = availableCalendarMonths.value
  currentCalendarMonth.value = months.length
    ? (tab === 'past' ? months[months.length - 1] : months[0])
    : ''
}, { immediate: true })

watch(availableCalendarMonths, (months) => {
  if (!months.length) {
    currentCalendarMonth.value = ''
    return
  }

  if (!months.includes(currentCalendarMonth.value)) {
    currentCalendarMonth.value = currentTab.value === 'past'
      ? months[months.length - 1]
      : months[0]
  }
})

const currentCalendarMonthLabel = computed(() => {
  if (!currentCalendarMonth.value) return 'No Dates Yet'

  return createMonthDate(currentCalendarMonth.value).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const canGoPrevMonth = computed(() => {
  return availableCalendarMonths.value.indexOf(currentCalendarMonth.value) > 0
})

const canGoNextMonth = computed(() => {
  const currentIndex = availableCalendarMonths.value.indexOf(currentCalendarMonth.value)
  return currentIndex > -1 && currentIndex < availableCalendarMonths.value.length - 1
})

function changeCalendarMonth(direction) {
  const currentIndex = availableCalendarMonths.value.indexOf(currentCalendarMonth.value)
  if (currentIndex === -1) return

  const nextMonth = availableCalendarMonths.value[currentIndex + direction]
  if (nextMonth) currentCalendarMonth.value = nextMonth
}

const calendarDays = computed(() => {
  if (!currentCalendarMonth.value) return []

  const monthDate = createMonthDate(currentCalendarMonth.value)
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const toursByDay = new Map()
  const cells = []

  sortedTours.value
    .filter(tour => tour.dateObj && getMonthKey(tour.dateObj) === currentCalendarMonth.value)
    .forEach((tour) => {
      const dateKey = getDateKey(tour.dateObj)
      const currentTours = toursByDay.get(dateKey) || []
      currentTours.push(tour)
      toursByDay.set(dateKey, currentTours)
    })

  for (let index = 0; index < firstDay; index += 1) {
    cells.push({
      key: `empty-start-${index}`,
      isEmpty: true,
      dayNumber: null,
      tours: [],
      isToday: false
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    const dateKey = getDateKey(date)

    cells.push({
      key: dateKey,
      isEmpty: false,
      dayNumber: day,
      tours: toursByDay.get(dateKey) || [],
      isToday: dateKey === getDateKey(today)
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `empty-end-${cells.length}`,
      isEmpty: true,
      dayNumber: null,
      tours: [],
      isToday: false
    })
  }

  return cells
})

const calendarTbaTours = computed(() => {
  return sortedTours.value.filter(tour => tour.isTBA)
})
</script>

<template>
  <section class="tour">
    <div class="tour-left">
      <div class="tour-left-img1"></div>
      <div class="tour-left-txt1" data-aos="fade-up" data-aos-duration="500">TOUR</div>
      <div class="tour-left-txt2" data-aos="fade-up" data-aos-duration="1200">TOUR</div>
    </div>
    <div class="tour-right" >
      <ul class="tour-tap">
        <li class="tour-current">{{ currentTabText }}</li>
        <li class="tour-toggle-group">
          <div :class="{ active: currentTab === 'upcoming' }" @click="currentTab = 'upcoming'">Upcoming</div>
          <div :class="{ active: currentTab === 'past' }" @click="currentTab = 'past'">Past</div>
        </li>
        <li class="tour-view-toggle">
          <button type="button" :class="{ active: viewMode === 'list' }"  @click="viewMode = 'list'"><span class="material-icons-round">view_list</span></button>
          <button type="button" :class="{ active: viewMode === 'calendar' }" class="material-icons-round" @click="viewMode = 'calendar'"><span class="material-icons-round">calendar_month</span></button>
        </li>
      </ul>
      <div v-if="loading" class="loading-box" data-aos="fade-in">
        <div class="loading-spinner"></div>
        <p>Loading Tours...</p>
      </div>
      <template v-else>
        <template v-if="viewMode === 'list'">
          <template v-if="!isMobile">
            <ul 
              v-for="tour in sortedTours" 
              :key="tour.id" 
              class="tour-list" 
              data-aos="fade-up" 
              data-aos-anchor-placement="top-bottom"
              data-aos-duration="700"
              >
              <li class="tour-list-inner" >
                <ol>
                  <li class="tour-tit">
                    <div>{{ tour.title }}</div>
                    <div>{{ tour.set }}</div>
                  </li>
                  <li class="tour-londat">
                    <div>{{ tour.city }} / {{ tour.country }}</div>
                    <div>{{ tour.dateDisplay }}</div>
                  </li>
                </ol>
                <div class="tour-ticket">
                  <button v-if="currentTab === 'past'" class="end-btn" disabled>
                    END
                  </button>
                  <a v-else-if="tour.ticket" :href="tour.ticket" target="_blank" rel="noopener noreferrer">
                    <button class="ticket-btn">
                      Tickets
                    </button>
                  </a>
                  <button v-else class="end-btn" disabled>
                    Not Info
                  </button>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <ul v-for="tour in sortedTours" :key="tour.id" class="m-tour-list" 
              data-aos="fade-up" 
              data-aos-anchor-placement="top-bottom"
              data-aos-duration="700"
              >
              <li class="m-tour-list-inner">
                <ol>
                  <li class="m-tour-tit">
                    <div>{{ tour.title }}</div>
                    <div>{{ tour.set }}</div>
                  </li>
                  <li class="m-tour-londat">
                    <div class="fz-14">
                      <div>{{ tour.city }} / {{ tour.country }}</div>
                      <div>{{ tour.dateDisplay }}</div>
                    </div>
                    <div class="m-tour-ticket">
                      <button v-if="currentTab === 'past'" class="m-end-btn" disabled>
                        END
                      </button>
                      <a v-else-if="tour.ticket" :href="tour.ticket" target="_blank" rel="noopener noreferrer">
                        <button class="m-ticket-btn">
                          Tickets
                        </button>
                      </a>

                      <button v-else class="m-end-btn" disabled>
                        Not Info
                      </button>
                    </div>
                  </li>
                </ol>
              </li>
            </ul>
          </template>
        </template>
        <template v-else>
          <div
            class="tour-calendar"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-duration="700"
          >
            <div class="tour-calendar-toolbar">
              <button
                type="button"
                class="tour-calendar-nav"
                :disabled="!canGoPrevMonth"
                @click="changeCalendarMonth(-1)"
              >
                Prev
              </button>
              <div class="tour-calendar-month">{{ currentCalendarMonthLabel }}</div>
              <button
                type="button"
                class="tour-calendar-nav"
                :disabled="!canGoNextMonth"
                @click="changeCalendarMonth(1)"
              >
                Next
              </button>
            </div>

            <div v-if="currentCalendarMonth" class="tour-calendar-shell">
              <div class="tour-calendar-weekdays">
                <div v-for="day in weekDays" :key="day">{{ day }}</div>
              </div>

              <div class="tour-calendar-grid">
                <div
                  v-for="day in calendarDays"
                  :key="day.key"
                  class="tour-calendar-cell"
                  :class="{
                    'is-empty': day.isEmpty,
                    'has-tours': day.tours.length > 0,
                    'is-today': day.isToday
                  }"
                >
                  <template v-if="!day.isEmpty">
                    <div class="tour-calendar-date">{{ day.dayNumber }}</div>

                    <div v-if="day.tours.length" class="tour-calendar-events">
                      <article v-for="tour in day.tours" :key="tour.id" class="tour-calendar-event">
                        <div class="tour-calendar-event-title">{{ tour.title }}</div>
                        <div v-if="tour.set" class="tour-calendar-event-set">{{ tour.set }}</div>
                        <div class="tour-calendar-event-meta">{{ tour.city }} / {{ tour.country }}</div>
                        <div class="tour-calendar-event-action">
                          <span v-if="currentTab === 'past'" class="calendar-end-btn">END</span>
                          <a
                            v-else-if="tour.ticket"
                            :href="tour.ticket"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="calendar-ticket-btn"
                          >
                            Tickets
                          </a>
                          <span v-else class="calendar-end-btn">Not Info</span>
                        </div>
                      </article>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div v-else class="tour-calendar-empty">
              No dated tours available in this tab.
            </div>

            <div v-if="currentTab === 'upcoming' && calendarTbaTours.length" class="tour-calendar-tba">
              <div class="tour-calendar-section-title">TBA</div>
              <div class="tour-calendar-tba-list">
                <article v-for="tour in calendarTbaTours" :key="tour.id" class="tour-calendar-tba-item">
                  <div class="tour-calendar-event-title">{{ tour.title }}</div>
                  <div v-if="tour.set" class="tour-calendar-event-set">{{ tour.set }}</div>
                  <div class="tour-calendar-event-meta">{{ tour.city }} / {{ tour.country }}</div>
                  <div class="tour-calendar-event-action">
                    <a
                      v-if="tour.ticket"
                      :href="tour.ticket"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="calendar-ticket-btn"
                    >
                      Tickets
                    </a>
                    <span v-else class="calendar-end-btn">Not Info</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </template>
      </template>
      <div class="login-admin">
        <router-link to="/login">+</router-link>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.tour {
  width: 100%;
  @media screen and (max-width: 899px) {
    display: flex;
    flex-direction: column;
    padding: 100px 30px 0;
    margin-bottom: 100px;
    align-items: center;
  }
  @media screen and (min-width: 900px) and (max-width: 999px) {
    display: grid;
    grid-template-columns: 20% 80%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
  @media screen and (min-width: 1000px) and (max-width: 1199px) {
    display: grid;
    grid-template-columns: 30% 70%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
  @media screen and (min-width: 1200px) {
    display: grid;
    grid-template-columns: 40% 60%;
    padding-top: 100px;
    margin-bottom: 100px;
  }
}
.tour-left {
  position: relative;
  @media screen and (max-width: 899px) {
    width: 100%;
    padding-left: 20px;
  }
  @media screen and (min-width: 900px) and (max-width: 999px) {
    width: 100%;
    height: 100vh;
    padding-left: 20px;
  }
  @media screen and (min-width: 1000px)  {
    width: 100%;
    height: 100vh;
    padding-left: 70px;
  }
}
.tour-left-img1 {
  position: absolute;
  top: -130px;
  z-index: -1;
  background-image: url('/src/assets/img/tour.webp');
  background-size: 75%;
  background-repeat: no-repeat;
  @media screen and (max-width: 899px) {
    top: -30px;
    width: 100%;
    height: 100vh;
    left: 0px;
  }
  @media screen and (min-width: 900px) and (max-width: 1500px) {
    width: 70vw;
    height: 100vh;
    left: 50px;
    background-position: left;
  }
  @media screen and (min-width: 1501px)  {
    width: 40vw;
    background-position: right;
    height: 100vh;
  }
}
.tour-left-txt1, .tour-left-txt2 {
  position: absolute;
  font-weight: bold;
  -webkit-text-stroke-color: #eee;
  color: transparent;
  display: inline-block;
  @media screen and (max-width: 899px) { font-size: 20vw; -webkit-text-stroke-width: 2px;}
  @media screen and (min-width: 900px) and (max-width: 1400px) {font-size: 12vw;  -webkit-text-stroke-width: 1px;}
  @media screen and (min-width: 1401px) { font-size: 10vw;  -webkit-text-stroke-width: 1px;}
}
.tour-left-txt1 {
  z-index: -1;
  @media screen and (max-width: 899px) {top: -20px; right: 0;}
  @media screen and (min-width: 900px) {top: -50px; left: 2%;}
}
.tour-left-txt2 {
  z-index: -1;
  @media screen and (max-width: 899px) { 
    width: 100%;
    bottom: -108vh; 
    left: 0;
    background-image: url('/src/assets/img/tour_bg2.webp');
    background-size: 75%;
    background-repeat: no-repeat;
    background-position: top right;
    overflow: hidden !important;
  }
  @media screen and (min-width: 900px) { bottom: -50px; left: 15%;}
}
.tour-right {
  position: relative;
  padding: 30px;
  background-color: #222;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  @media screen and (max-width: 899px) {
    width: 90%;
    height: 100%;
    margin-top: 100px;
  }
  @media screen and (min-width: 900px)  {
    width: 90%;
    height: 100%;
    margin-top: 30px;
    @keyframes shimmer {
      0%, 100% {
        opacity: 0.1;
      }
      50% {
        opacity: 0.3;
      }
    }
  }
  
}
.tour-tap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0;
  li {
    display: flex;
    gap: 10px;
  }
}

.tour-view-toggle > button {
  cursor: pointer;
  border: 1px solid #eee;
  padding: 4px 10px;
  text-align: center;
  border-radius: 5px;
  background-color: transparent;
  color: #fff;
  font-size: 15px;
  @media screen and (max-width: 899px) {
    width: 90px;
  }
  @media screen and (min-width: 1400px)  {
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      font-weight: bold;
    }
  }
}

.tour-toggle-group > div{
  width: 100px;
  cursor: pointer;
  border: 1px solid #eee;
  padding: 5px 0;
  text-align: center;
  border-radius: 5px;
  background-color: transparent;
  color: #fff;
  font-size: 15px;
  @media screen and (max-width: 899px) {
    width: 90px;
  }
  @media screen and (min-width: 1400px)  {
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      font-weight: bold;
    }
  }
}

.tour-view-toggle > button {
  font-family: inherit;
}

.tour-toggle-group > .active,
.tour-view-toggle > .active {
  background-color: #fff;
  color: #000;
  font-weight: bold;
}
@media screen and (max-width: 899px) {
  .tour-tap > .tour-current {display: none;}
  .m-tour-list {display: block;}
  .tour-list{display: none;}
}
@media screen and (min-width: 900px)  {
  .m-tour-list {display: none !important;}
  .tour-list{display: block;}
}

.tour-current {
  font-weight: bold;
  font-size: 24px;
}

.tour-list {
  padding: 0;
}
.tour-list-inner {
  display: grid;
  align-items: center;
  border-top: 1px solid #eee; 
  border-bottom: 1px solid #ddd;
  ol {
    padding: 0;
  }
  grid-template-columns: 85% 15%;
  padding: 10px 30px;
}
.tour-tit { 
  display: flex;
  align-items: center;
  gap: 20px;
  div{
    font-weight: bold !important;
    padding-bottom: 10px;
    font-size: 18px;
  }
}
.tour-londat {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.tour-ticket {
  text-align: center;
}

.tour-calendar {
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  padding-top: 18px;
}

.tour-calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.tour-calendar-nav {
  min-width: 82px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  background: transparent;
  color: #fff;
  padding: 8px 14px;
  cursor: pointer;
}

.tour-calendar-nav:disabled {
  cursor: default;
  opacity: 0.35;
}

.tour-calendar-month {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
}

.tour-calendar-shell {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tour-calendar-weekdays,
.tour-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.tour-calendar-weekdays > div {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tour-calendar-cell {
  min-height: 150px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tour-calendar-cell.is-empty {
  background: transparent;
  border-style: dashed;
  opacity: 0.3;
}

.tour-calendar-cell.is-today {
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.tour-calendar-date {
  font-size: 18px;
  font-weight: bold;
}

.tour-calendar-events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tour-calendar-event,
.tour-calendar-tba-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 9px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
}

.tour-calendar-event-title {
  font-weight: bold;
  font-size: 13px;
  line-height: 1.35;
}

.tour-calendar-event-set {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.tour-calendar-event-meta {
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
}

.tour-calendar-event-action {
  margin-top: 4px;
}

.calendar-ticket-btn,
.calendar-end-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  text-decoration: none;
}

.calendar-ticket-btn {
  background-color: #fff;
  color: #000;
}

.calendar-end-btn {
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.45);
}

.tour-calendar-empty {
  padding: 40px 20px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.tour-calendar-tba {
  margin-top: 24px;
}

.tour-calendar-section-title {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: bold;
}

.tour-calendar-tba-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.end-btn {
  width: 100px;
  height: 38px;
  color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  cursor: default;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 16px;
  margin: 20px;
}
.ticket-btn {
  width: 100px;
  height: 38px;
  color: #000;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  outline: none;
  background-color: #fff;
  border: none;
  line-height: 30px;
  z-index: 1;
  font-size: 16px;
  margin: 20px;
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: #0d0d0d;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  a {
    position: relative;
  }
  @media screen and (min-width: 900px)  {
    &:active {
      top: 2px;
    }
    &:hover {
      color: #fff;
      &::after {
        left: 0;
        width: 100%;
      }
    }
  }
}

/*Mobile*/
.m-tour-list {
  padding: 0;
}
.m-tour-list-inner {
  padding: 10px 0px;
  border-top: 1px solid #eee; 
  border-bottom: 1px solid #ddd;
  ol {
    padding: 0;
  }
}
.m-tour-tit > div{
  font-weight: bold !important;
  padding-bottom: 10px;
  font-size: 16px;
}
.m-tour-londat {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.m-tour-ticket {
  text-align: center;
}
.m-end-btn {
  width: 80px;
  height: 38px;
  color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  cursor: default;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 13px;
  margin-left: 10px;
}
.m-ticket-btn {
  width: 80px;
  height: 38px;
  color: #000;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  outline: none;
  background-color: #fff;
  border: none;
  line-height: 30px;
  font-size: 13px;
    z-index: 1;
    margin-left: 10px;
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: #0d0d0d;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  a {
    position: relative;
  }
}
.login-admin {
  position: absolute;
  bottom: 0;
  right: 5px;
  a{color: #555555;}
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 700px;
  color: #666;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 899px) {
  .tour-calendar-toolbar {
    flex-wrap: wrap;
  }

  .tour-calendar-month {
    width: 100%;
    order: -1;
    font-size: 22px;
  }

  .tour-calendar-weekdays,
  .tour-calendar-grid {
    gap: 6px;
  }

  .tour-calendar-weekdays > div {
    font-size: 10px;
    letter-spacing: 0.04em;
  }

  .tour-calendar-cell {
    min-height: 96px;
    padding: 8px;
    gap: 8px;
  }

  .tour-calendar-date {
    font-size: 15px;
  }

  .tour-calendar-event,
  .tour-calendar-tba-item {
    padding: 7px;
  }

  .tour-calendar-event-title,
  .tour-calendar-event-set,
  .tour-calendar-event-meta,
  .calendar-ticket-btn,
  .calendar-end-btn {
    font-size: 11px;
  }

  .calendar-ticket-btn,
  .calendar-end-btn {
    width: 100%;
  }

  .tour-calendar-tba-list {
    grid-template-columns: 1fr;
  }
}
</style>
