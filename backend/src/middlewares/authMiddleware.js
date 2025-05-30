import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'
dotenv.config()
export default async function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({message:'Unauthenticated'})
  const token = header.split(' ')[1]
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(401).json({message:'Unauthenticated'})
    req.user = user
    next()
  } catch {
    res.status(401).json({message:'Unauthenticated'})
  }
}
