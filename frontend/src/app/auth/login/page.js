'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'
import styles from '../../../styles/LoginPage.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await API.post('/auth/login', form)
      localStorage.setItem('accessToken', data.token)
      router.push('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Sign In</h1>

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          Sign In
        </button>

         <p className={styles.switch}>
         Don’t have an account?{' '}
         <a href="/auth/register" className={styles.link}>
           Sign Up
         </a>
       </p>
      </form>
    </main>
  )
}
