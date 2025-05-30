'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import { UploadButton } from '../../../../utils/uploadthing'
import API from '../../../../lib/api'
import Link from 'next/link'
import styles from '../../../../styles/EditRoomPage.module.css'

export default function EditRoomPage() {
  const router = useRouter()
  const { id } = useParams()
  const path   = usePathname()

  const [form, setForm] = useState({
    title:'', description:'', price:'', capacity:'', images:[]
  })
  const [error, setError] = useState('')

  useEffect(() => {
    API.get(`/rooms/${id}`)
      .then(res => {
        const r = res.data.room
        setForm({
          title:       r.title,
          description: r.description,
          price:       r.price,
          capacity:    r.capacity,
          images:      r.images || []
        })
      })
      .catch(() => setError('Не удалось загрузить данные'))
  }, [id, path])

  const onUploadComplete = (files) => {
    const newUrls = files.map(f => f.url) 
    setForm(f => ({ ...f, images: [...f.images, ...newUrls] }))
  }

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/rooms/${id}`, {
        title:       form.title,
        description: form.description,
        price:       Number(form.price),
        capacity:    Number(form.capacity),
        images:      form.images
      })
      router.push(`/rooms/${id}`)
    } catch {
      setError('Ошибка сохранения')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Room</h2>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.preview}>
          {form.images.map((url) => (
            <Image
              key={url}
              src={url}
              alt="Room photo"
              width={100}
              height={100}
              className={styles.previewImage}
              unoptimized
            />
          ))}
        </div>

        <div className={styles.uploadBtn}>
          <UploadButton
            endpoint="roomsUploader"
            onClientUploadComplete={onUploadComplete}
            onUploadError={() => setError('Upload failed')}
          />
        </div>

        <form onSubmit={onSubmit}>
          {['title','description','price','capacity'].map(field => (
            <div key={field} className={styles.formGroup}>
              <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === 'description' ? (
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className={styles.textarea}
                />
              ) : (
                <input
                  name={field}
                  type={field === 'price' || field === 'capacity' ? 'number' : 'text'}
                  value={form[field]}
                  onChange={onChange}
                  className={styles.input}
                  required
                />
              )}
            </div>
          ))}

          <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.save}`}>
              Save
            </button>
            <button type="button" onClick={() => router.push(`/rooms/${id}`)} className={`${styles.btn} ${styles.cancel}`}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
