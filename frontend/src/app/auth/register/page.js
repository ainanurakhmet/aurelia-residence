'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../lib/api'
import styles from '../../../styles/LoginPage.module.css'


export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Имя обязательно';
    }
    if (!form.email.trim()) {
      errs.email = 'Email обязателен';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Неверный формат email';
    }

    const pwd = form.password;
    if (!pwd) {
      errs.password = 'Пароль обязателен';
    } else {
      if (pwd.length < 8) {
        errs.password = 'Минимум 8 символов';
      } else if (!/[0-9]/.test(pwd)) {
        errs.password = 'Должна быть хотя бы одна цифра';
      } else if (!/[A-Z]/.test(pwd)) {
        errs.password = 'Должна быть хотя бы одна заглавная буква';
      }
    }

    if (form.confirmPassword !== form.password) {
      errs.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      localStorage.setItem('accessToken', data.token);
      router.push('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Ошибка регистрации';
      setErrors({ form: msg });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        {errors.form && <p className={styles.error}>{errors.form}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>
        <p className={styles.switch}>
          Already have an account?{' '}
          <a href="/auth/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}
