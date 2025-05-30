'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import styles from '../../../styles/AdminReviews.module.css'

export default function AdminReviewsPage() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError]     = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/')
      return
    }

    API.get('/users/me')
      .then(res => {
        if (res.data.user.role !== 'admin') {
          router.push('/')
        } else {
          setUser(res.data.user)
        }
      })
      .catch(() => {
        router.push('/')
      })
  }, [router])

  useEffect(() => {
    if (!user) return

    API.get('/reviews')
      .then(res => setReviews(res.data.reviews))
      .catch(() => setError('Не удалось загрузить отзывы'))
  }, [user])

  const handleDelete = async id => {
    if (!confirm('Удалить этот отзыв?')) return
    try {
      await API.delete(`/reviews/${id}`)
      setReviews(r => r.filter(x => x._id !== id))
    } catch {
      alert('Ошибка при удалении')
    }
  }

  if (error) return <p className={styles.error}>{error}</p>
  if (!user) return <p className={styles.error}>Loading…</p>

  return (
    <main className={styles.container}>
      <h1>Manage Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map(r => (
            <li key={r._id} className={styles.item}>
              <div>
                <strong>{r.user.name}</strong> — {r.rating}★
                <p className={styles.comment}>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(r._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
