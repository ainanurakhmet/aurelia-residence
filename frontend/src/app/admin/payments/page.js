'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import styles from '../../../styles/AdminPayments.module.css'

export default function AdminPaymentsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [data, setData] = useState({
    totalEarned: 0,
    payments: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return router.push('/')
    API.get('/users/me')
      .then(res => {
        const role = res.data.user.role
        if (!['admin','superadmin'].includes(role)) {
          router.push('/')
        } else {
          setUser(res.data.user)
        }
      })
      .catch(() => router.push('/'))
  }, [router])

  useEffect(() => {
    if (!user) return
    API.get('/admin/payments/earnings')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load earnings'))
  }, [user])

  if (error) return <p className={styles.error}>{error}</p>
  if (!user) return <p className={styles.message}>Loading…</p>

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Earnings Report</h1>

      <div className={styles.summary}>
        <span>Total Earned:</span>
        <span className={styles.amount}>
          ${data.totalEarned.toFixed(2)}
        </span>
      </div>

      {data.payments.length === 0
        ? <p className={styles.message}>No paid bookings yet.</p>
        : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.user.name}<br/>
                    <small>{p.user.email}</small>
                  </td>
                  <td>{p.room.title}</td>
                  <td>${p.amount.toFixed(2)}</td>
                  <td>{new Date(p.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </main>
  )
}
