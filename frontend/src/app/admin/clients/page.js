'use client'
import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import styles from '../../../styles/Clients.module.css'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ name:'', email:'', password:'' })
  const [formErr, setFormErr] = useState('')

  useEffect(() => {
    API.get('/clients')
      .then(res => setClients(res.data.clients))
      .catch(() => setError('Failed to load clients'))
  }, [])

  
  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return
    try {
      await API.delete(`/clients/${id}`)
      setClients(clients.filter(c => c._id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormErr('')
  }
  const handleCreate = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      return setFormErr('All fields are required')
    }
    try {
      const { data } = await API.post('/clients', form)
      setClients([data.client, ...clients])
      setForm({ name:'', email:'', password:'' })
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Failed to create')
    }
  }

  return (
    <main className={styles.container}>
      <h1>Guest Users Management</h1>
      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.formSection}>
        <h2>Create New Guest</h2>
        {formErr && <p className={styles.error}>{formErr}</p>}
        <form onSubmit={handleCreate} className={styles.form}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Create</button>
        </form>
      </section>

      <section className={styles.listSection}>
        <h2>Existing Guests</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(c._id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}
