'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../lib/api'
import styles from '../../styles/ProfilePage.module.css'

export default function ProfilePage() {
  const [user, setUser]         = useState(null)
  const [bookings, setBookings] = useState([])
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [msg, setMsg]           = useState('')

  useEffect(() => {
    API.get('/users/me')
      .then(res => setUser(res.data.user))
      .catch(() => setError('Unable to load profile'))
  }, [])

  useEffect(() => {
    API.get('/bookings')
      .then(res => setBookings(res.data.bookings))
      .catch(() => setError('Unable to load bookings'))
  }, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError(''); setMsg('')
  }

  const handlePassword = async e => {
    e.preventDefault()
    if (form.newPassword !== form.confirmNewPassword) {
      return setError('Passwords do not match')
    }
    try {
      const { data } = await API.put('/users/me/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      setMsg(data.message)
      setForm({ currentPassword:'', newPassword:'', confirmNewPassword:'' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password')
    }
  }

  if (error) return <p className={`${styles.message} ${styles.error}`}>{error}</p>
  if (!user) return <p className={styles.message}>Loading profile…</p>

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Profile</h2>

      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <div className={styles.value}>{user.name}</div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <div className={styles.value}>{user.email}</div>
      </div>

      <h3 className={styles.subheading}>Your Bookings</h3>
      {bookings.length === 0 ? (
        <p className={styles.message}>You have no bookings yet.</p>
      ) : (
        <ul className={styles.bookingList}>
          {bookings.map(b => (
            <li key={b._id} className={styles.bookingItem}>
              <div>
                <strong>{b.room.title}</strong>
                <div>
                  {new Date(b.checkIn).toLocaleDateString()} –{' '}
                  {new Date(b.checkOut).toLocaleDateString()}
                </div>
                <div>Total: ${b.total.toLocaleString()}</div>
              </div>
              {b.paid ? (
                <span className={styles.paidBadge}>Paid ✔️</span>
              ) : (
                <Link
                  href={`/payments?bookingId=${b._id}`}
                  className={styles.payLink}
                >
                  Pay now
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3 className={styles.subheading}>Change Password</h3>
      {msg && <p className={`${styles.message} ${styles.success}`}>{msg}</p>}
      <form onSubmit={handlePassword} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Current Password</label>
          <input
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>New Password</label>
          <input
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirm New Password</label>
          <input
            name="confirmNewPassword"
            type="password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Update Password
        </button>
      </form>
    </div>
  )
}
