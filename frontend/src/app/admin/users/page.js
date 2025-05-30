'use client'
import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import styles from '../../../styles/AdminUsers.module.css'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'guest' })
  const [error, setError] = useState('')

  const fetchUsers = () => {
    API.get('/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(() => setError('Failed to load users'))
  }

  useEffect(fetchUsers, [])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleCreate = async e => {
    e.preventDefault()
    try {
      await API.post('/admin/users', form)
      setForm({ name:'', email:'', password:'', role:'guest' })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user')
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this user?')) return
    await API.delete(`/admin/users/${id}`)
    fetchUsers()
  }

  const handleRoleChange = (id, newRole) => {
    setUsers(us => us.map(u => u._id === id ? { ...u, role: newRole } : u))
  }

  const handleUpdate = async user => {
    try {
      await API.put(`/admin/users/${user._id}`, {
        name: user.name,
        email: user.email,
        role: user.role
      })
      fetchUsers()
    } catch {
      alert('Failed to update user')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Users</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleCreate}>
        <input className={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className={styles.input} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className={styles.input} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select className={styles.select} name="role" value={form.role} onChange={handleChange}>
          <option value="guest">Guest</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <button className={styles.button} type="submit">Create User</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td className={styles.td}>{u.name}</td>
              <td className={styles.td}>{u.email}</td>
              <td className={styles.td}>
                <select
                  className={styles.select}
                  value={u.role}
                  onChange={e => handleRoleChange(u._id, e.target.value)}
                >
                  <option value="guest">Guest</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </td>
              <td className={styles.td}>
                <button
                  className={styles.button}
                  onClick={() => handleUpdate(u)}
                >
                  Update
                </button>
                <button
                  className={`${styles.button} ${styles.delete}`}
                  onClick={() => handleDelete(u._id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
