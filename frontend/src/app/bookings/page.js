'use client'

import { useEffect, useState } from 'react'
import API from '../../lib/api'
import styles from '../../styles/BookingsPage.module.css'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    API.get('/bookings')
      .then(res => setBookings(res.data.bookings))
      .catch(() => setBookings([]))
  }, [])

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Bookings</h1>
      {bookings.length === 0 && <p>You have no bookings yet.</p>}
      <ul className={styles.list}>
        {bookings.map(b => (
          <li key={b._id} className={styles.card}>
            <div>
              <strong>{b.room.title}</strong><br/>
              {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}<br/>
              Total: ${b.total.toLocaleString()}
            </div>
            {b.paid
              ? <span className={styles.paid}>Paid</span>
              : (
                <Link href={`/payments/checkout?bookingId=${b._id}`} className={styles.payButton}>
                  Pay Now
                </Link>
              )
            }
          </li>
        ))}
      </ul>
    </main>
  )
}
