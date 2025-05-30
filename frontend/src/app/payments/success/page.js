import Link from 'next/link'


export default function PaymentSuccessPage() {
  return (
    <main style={{ padding:'2rem', textAlign:'center' }}>
      <h1>Thank you for your payment!</h1>
      <p>Your booking has been confirmed. We look forward to hosting you.</p>
      <Link href="/rooms">Browse more rooms</Link>
    </main>
  )
}
