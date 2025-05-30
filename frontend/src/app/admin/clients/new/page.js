'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../../lib/api';
import styles from '../../../../styles/Clients.module.css';

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', email:'', phone:'' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/clients', form);
      router.push('/admin/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>New Client</h1>
      {error && <p className={styles.messageError}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <button type="submit" className={styles.saveBtn}>Create</button>
      </form>
    </main>
  );
}
