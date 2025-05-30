import User from '../models/User.js'
import bcrypt from 'bcrypt'

export async function listClients(req, res) {
  try {
    const clients = await User.find({ role: 'guest' }).sort('-createdAt')
    res.json({ clients })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function createClient(req, res) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Required fields missing' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already taken' })
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const client = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'guest'
    })
    res.status(201).json({ client })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteClient(req, res) {
  try {
    const client = await User.findById(req.params.id)
    if (!client) return res.status(404).json({ message: 'Not found' })
    await client.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
