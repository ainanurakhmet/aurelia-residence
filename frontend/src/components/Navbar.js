'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import API from '../lib/api'
import styles from '../styles/Navbar.module.css'
import { useSocket } from '../context/SocketContext'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const socket = useSocket()
  const [newBookingCount, setNewBookingCount] = useState(0)
  const [newReviewCount,  setNewReviewCount ] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      API.get('/users/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('accessToken')
          setUser(null)
        })
    } else {
      setUser(null)
    }
  }, [pathname])

    useEffect(() => {
    if (!socket) return
    socket.on('new-booking', () => {
      setNewBookingCount(c => c + 1)
    })
    socket.on('new-review', () => {
      setNewReviewCount(c => c + 1)
    })
    return () => {
      socket.off('new-booking')
      socket.off('new-review')
    }
  }, [socket])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    router.push('/')
  }

  const linkClass = (href) =>
    pathname === href
      ? `${styles.link} ${styles.linkActive}`
      : styles.link

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span>Aurelia</span><span className={styles.logoHighlight}>Residence</span>
        </Link>

        <div className={styles.links}>
          <Link href="/" className={linkClass('/')}>
            Home
          </Link>
          <Link href="/rooms" className={linkClass('/rooms')}>
            Rooms
          </Link>

          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <Link href="/rooms/new" className={linkClass('/rooms/new')}>
              Create Room
            </Link>
          )}

          {user?.role === 'superadmin' && (
            <Link href="/admin/users" className={linkClass('/admin/users')}>
              Users
            </Link>
          )}

          {user?.role === 'admin' && (
            <>
              <Link href="/admin/clients" className={linkClass('/admin/clients')}>
                Client Registration
              </Link>
              <Link href="/admin/payments" className={linkClass('/payments')}>
                Payments
              </Link>
              <Link href="/admin/bookings" className={linkClass('/bookings')}>
                Bookings
              </Link>
              <Link href="/admin/reviews" className={linkClass('/reviews')}>
                Reviews
              </Link>
            </>
          )}

          {user?.role === 'guest' && (
            <>

            </>
          )}
        </div>

        <div className={styles.profile}>
          {user ? (
            <>
              <Link href="/profile" className={linkClass('/profile')}>
                <span className={styles.userName}>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className={styles.button}>
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className={styles.button}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

       <Link href="/admin/bookings">
        Bookings {newBookingCount > 0 && <span className="badge">{newBookingCount}</span>}
      </Link>
      <Link href="/admin/reviews">
        Reviews  {newReviewCount  > 0 && <span className="badge">{newReviewCount}</span>}
      </Link>
    </nav>
  )
}
