// src/app/rooms/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import API from '../../../lib/api'
import styles from '../../../styles/RoomDetailPage.module.css'

export default function RoomDetailPage() {
  const router   = useRouter()
  const { id }   = useParams()
  const path     = usePathname()
  const [room, setRoom]   = useState(null)
  const [user, setUser]   = useState(null)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')



  useEffect(() => {
    API.get(`/rooms/${id}`)
      .then(res => setRoom(res.data.room))
      .catch(() => setError('Failed to load room'))
  }, [id, path])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      API.get('/users/me')
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null))
    }
  }, [path])

  const handleDelete = async () => {
    if (!confirm('Delete this room?')) return
    try {
      await API.delete(`/rooms/${id}`)
      router.push('/rooms')
    } catch {
      alert('Failed to delete room')
    }
  }

  useEffect(() => {
    if (!id) return
    API.get('/reviews', { params: { roomId: id } })
      .then(r => setReviews(r.data.reviews))
      .catch(() => {})
  }, [id])


 const submitReview = async e => {
    e.preventDefault()
    try {
      const { data } = await API.post('/reviews', {
        roomId: id,
        rating: Number(rating),
        comment
      })
      setReviews([data.review, ...reviews])
      setComment('')
      setRating(5)
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось отправить отзыв')
    }
  }

  if (error)   return <p className={styles.error}>{error}</p>
  if (!room)   return <p className={styles.loading}>Loading…</p>

  const isAdmin = ['admin','superadmin'].includes(user?.role)

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{room.title}</h1>
      <p className={styles.description}>{room.description}</p>

      <div className={styles.meta}>
        <span>Price: ${room.price}</span>
        <span>Capacity: {room.capacity} guest</span>
      </div>

      <div className={styles.imageGallery}>
        {room.images.map(url => (
          <Image
            key={url}
            src={url}
            alt={room.title}
            width={240}
            height={160}
            unoptimized
            className={styles.image}
          />
        ))}
      </div>

      {isAdmin && (
        <div className={styles.actions}>
          <Link href={`/rooms/${id}/edit`} className={`${styles.button} ${styles.editButton}`}>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={`${styles.button} ${styles.deleteButton}`}
          >
            Delete
          </button>
        </div>
      )}

      <Link href="/rooms" className={styles.backLink}>
        ← Back to List
      </Link>


      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Reviews</h2>

        <form onSubmit={submitReview} className={styles.reviewForm}>
          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.field}>
            Ratings
            <select
              value={rating}
              onChange={e => setRating(e.target.value)}
              className={styles.select}
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            Comment
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className={styles.textarea}
              placeholder="Your review"
            />
          </label>

          <button type="submit" className={styles.submitBtn}>
            Send
          </button>
        </form>

        <ul className={styles.reviewList}>
          {reviews.map(r => (
            <li key={r._id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <strong>{r.user.name}</strong>
                <span className={styles.stars}>{'★'.repeat(r.rating)}</span>
                <time className={styles.date}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className={styles.comment}>{r.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )

  
}
