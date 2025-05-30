import express from 'express'
import cors    from 'cors'
import dotenv  from 'dotenv'
import mongoose from 'mongoose'
import http    from 'http'
import { Server } from 'socket.io'
import { Server as IOServer } from 'socket.io'
import path    from 'path'
import 'dotenv/config'    

import authRoutes  from './routes/auth.js'
import userRoutes  from './routes/users.js'
import roomRoutes  from './routes/rooms.js'
import clientsRouter from './routes/clients.js'
import adminUsers from './routes/adminUsers.js'
import bookingsRouter from './routes/bookings.js'
import paymentsRouter from './routes/payments.js'
import reviewsRouter from './routes/reviews.js'
import adminBookings from './routes/adminBookings.js'
import adminPayments from './routes/adminPayments.js'

dotenv.config()

const app = express()

const server = http.createServer(app)
const io = new IOServer(server, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' }
})

app.set('io', io)

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/auth',  authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/clients', clientsRouter)
app.use('/api/admin/users', adminUsers)
app.use('/api/bookings', bookingsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/admin/bookings', adminBookings)
app.use('/api/admin/payments', adminPayments)

const httpServer = http.createServer(app)
new Server(httpServer).on('connection', s => console.log('Client connected', s.id))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

//const PORT = process.env.PORT || 5000
//httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))

server.listen(5000, () => {
  console.log('Server listening on port 5000')
})

//last chenges
