'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import styles from '../../../styles/AdminBookings.module.css'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError]       = useState('')

  useEffect(() => {
    API.get('/admin/bookings')
      .then(res => setBookings(res.data.bookings))
      .catch(() => setError('Failed to load bookings'))
  }, [])

  const togglePaid = async (id) => {
    try {
      const { data } = await API.put(`/admin/bookings/${id}/toggle-paid`)
      setBookings(bs => bs.map(b => b._id === id ? data.booking : b))
    } catch {
      alert('Toggle failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete booking?')) return
    await API.delete(`/admin/bookings/${id}`)
    setBookings(bs => bs.filter(b => b._id !== id))
  }

  if (error) return <p className={styles.error}>{error}</p>
  if (!bookings.length) return <p className={styles.message}>No bookings.</p>

  return (
    <main className={styles.container}>
      <h1>All Bookings</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th><th>Room</th><th>Dates</th><th>Total</th><th>Paid</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.user.name} ({b.user.email})</td>
              <td>{b.room.title}</td>
              <td>{new Date(b.checkIn).toLocaleDateString()}–{new Date(b.checkOut).toLocaleDateString()}</td>
              <td>${b.total.toLocaleString()}</td>
              <td>{b.paid ? '✔️' : '❌'}</td>
              <td>
                <button onClick={()=>togglePaid(b._id)} className={styles.btn}>
                  {b.paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
                <button onClick={()=>remove(b._id)} className={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
