'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import API from '../../lib/api'
import styles from '../../styles/RoomsPage.module.css'

export default function RoomsPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState([])
  const [roomFilter, setRoomFilter] = useState('')
  const [capacityFilter, setCapacityFilter] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  useEffect(() => {
    API.get('/rooms')
      .then(res => setRooms(res.data.rooms))
      .catch(() => setRooms([]))
  }, [])

 const filtered = rooms.filter(r => {
    if (roomFilter && r._id !== roomFilter) return false
    if (capacityFilter && r.capacity < Number(capacityFilter)) return false
    if (priceMin && r.price < Number(priceMin)) return false
    if (priceMax && r.price > Number(priceMax)) return false
    return true
  })

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Available Rooms</h1>


      <div className={styles.filters}>
         <select
          value={roomFilter}
          onChange={e => setRoomFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">All Rooms</option>
          {rooms.map(r => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>

        <select
          value={capacityFilter}
          onChange={e => setCapacityFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">Any Capacity</option>
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4+ guests</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={e => setPriceMin(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={() => {
            setTypeFilter('')
            setCapacityFilter('')
            setPriceMin('')
            setPriceMax('')
          }}
          className={styles.clearBtn}
        >
          Clear
        </button>
      </div>

      <div className={styles.grid}>
        {filtered.map(room => (
          <div key={room._id} className={styles.card}>
            <Link href={`/rooms/${room._id}`} className={styles.imageWrapper}>
              {room.images?.[0] ? (
                <Image
                  src={room.images[0]}
                  alt={room.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </Link>
            <div className={styles.details}>
              <h3 className={styles.roomTitle}>{room.title}</h3>
              <p className={styles.roomType}>{room.type}</p>
              <div className={styles.meta}>
                <span className={styles.price}>${room.price.toLocaleString()}</span>
                <span className={styles.capacity}>
                  {room.capacity} guest{room.capacity > 1 ? 's' : ''}
                </span>
              </div>
              <button
                className={styles.button}
                onClick={() => router.push(`/book/${room._id}`)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className={styles.message}>No rooms match your filters.</p>
        )}
      </div>
    </main>
  )
}
