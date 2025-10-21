import { db } from '../firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import { igTours } from '../assets/data/igTours.js'

const uploadTours = async () => {
  const toursCollection = collection(db, 'tours')
  for (const tour of igTours) {
    await addDoc(toursCollection, {
      title: tour.title,
      date: tour.date,
      set: tour.set,
      city: tour.city,
      country: tour.country,
      ticket: tour.ticket
    })
  }
  console.log('모든 투어 업로드 완료!')
}

uploadTours()