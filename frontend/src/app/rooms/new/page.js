'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UploadButton } from '../../../utils/uploadthing'
import API from '../../../lib/api'
import styles from '../../../styles/NewRoomPage.module.css'

export default function NewRoomPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    capacity: '',
    images: []
  })
  const [error, setError] = useState('')

  const onUploadComplete = (files) => {
    const urls = files.map(f => f.ufsUrl)
    setForm(f => ({ ...f, images: urls }))
  }

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/rooms', {
        title:       form.title,
        description: form.description,
        price:       Number(form.price),
        capacity:    Number(form.capacity),
        images:      form.images
      })
      router.push('/rooms')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>Create Room</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={onChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={onChange}
            required
          />
        </div>

        <div className={styles.uploadSection}>
          <label>Room Photos</label>
          <UploadButton
            endpoint="roomsUploader"
            onClientUploadComplete={onUploadComplete}
            onUploadError={() => setError('Upload error')}
          />
          <div className={styles.previewList}>
            {form.images.map(url => (
              <Image
                key={url}
                src={url}
                alt="Room photo"
                width={100}
                height={100}
                unoptimized
              />
            ))}
          </div>
        </div>

        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </main>
  )
}
