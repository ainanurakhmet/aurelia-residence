'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import API from '../../lib/api'

export default function PaymentsPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [error, setError] = useState(null)

  const handleCheckout = async () => {
    try {
      const { data } = await API.post('/payments/checkout', { bookingId })
      window.location.href = data.sessionUrl
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start payment')
    }
  }

  return (
    <div style={{ padding:'2rem', maxWidth: '400px', margin:'auto' }}>
      <h1>Booking Payment</h1>
      {!bookingId && (
        <p style={{ color:'red' }}>Booking ID is missing.</p>
      )}
      {error && <p style={{ color:'red' }}>{error}</p>}
      <button 
        onClick={handleCheckout}
        disabled={!bookingId}
        style={{
          padding:'0.75rem 1.5rem',
          background:'#0066ff',
          color:'white',
          border:'none',
          borderRadius:4,
          cursor: bookingId ? 'pointer' : 'not-allowed'
        }}
      >
        Proceed to Payment
      </button>
    </div>
  )
}
