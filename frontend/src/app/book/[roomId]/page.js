'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import API from '../../../lib/api'
import styles from '../../../styles/BookingPage.module.css'

export default function BookingPage() {
  const router     = useRouter()
  const { roomId } = useParams()

  const [room, setRoom]           = useState(null)
  const [checkIn, setCheckIn]     = useState('')
  const [checkOut, setCheckOut]   = useState('')
  const [available, setAvailable] = useState(null)
  const [price, setPrice]         = useState(0)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!roomId) return
    API.get(`/rooms/${roomId}`)
      .then(res => setRoom(res.data.room))
      .catch(() => setError('Failed to load room details'))
  }, [roomId])

  useEffect(() => {
    if (!checkIn || !checkOut || !room) {
      setAvailable(null)
      setPrice(0)
      return
    }
    const ci = new Date(checkIn)
    const co = new Date(checkOut)
    if (ci >= co) {
      setError('Check-out must be after check-in')
      setAvailable(false)
      return
    }
    setError('')
    API.get('/bookings/availability', { params: { roomId, checkIn, checkOut } })
      .then(res => setAvailable(res.data.available))
      .catch(() => setAvailable(false))

    const nights = (co - ci) / (1000 * 60 * 60 * 24)
    setPrice(nights * room.price)
  }, [checkIn, checkOut, room, roomId])

  const handleBook = async () => {
    if (!available) return
    setLoading(true)
    try {
      await API.post('/bookings', { roomId, checkIn, checkOut })
      router.push('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (error && !room) return <p className={styles.error}>{error}</p>
  if (!room)          return <p className={styles.loading}>Loading room…</p>

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{room.title}</h1>
        <p className={styles.location}>{room.description}</p>
      </header>

      <section className={styles.dates}>
        <label>
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
            className={styles.input}
          />
        </label>
        <label>
          Check-out
          <input
            type="date"
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            className={styles.input}
          />
        </label>
      </section>

      {available === true && (
        <div className={styles.summaryCard}>
          <p>
            <strong>{(Math.abs(
              (new Date(checkOut) - new Date(checkIn)) /
              (1000*60*60*24)
            ))}</strong> night(s) × <strong>${room.price}</strong> = 
            <span className={styles.totalPrice}> ${price.toLocaleString()}</span>
          </p>
        </div>
      )}
      {available === false && !error && (
        <p className={styles.unavailable}>
          Sorry, this room is not available for those dates.
        </p>
      )}
      {error && <p className={styles.error}>{error}</p>}

      <button
        onClick={handleBook}
        disabled={!available || loading}
        className={styles.button}
      >
        {loading ? 'Booking…' : 'Book Now'}
      </button>
    </main>
  )
}
