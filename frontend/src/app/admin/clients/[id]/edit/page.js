'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import API from '../../../../../lib/api';
import styles from '../../../../../styles/Clients.module.css';

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ name:'', email:'', phone:'' });
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/clients/${id}`)
      .then(res => setForm(res.data.client))
      .catch(() => setError('Failed to load'));
  }, [id]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.put(`/clients/${id}`, form);
      router.push('/admin/clients');
    } catch {
      setError('Failed to save');
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Edit Client</h1>
      {error && <p className={styles.messageError}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <button type="submit" className={styles.saveBtn}>Save</button>
      </form>
    </main>
  );
}
