import User from '../models/User.js'
import bcrypt from 'bcrypt'

export async function listUsers(req, res) {
  try {
    const users = await User.find().sort('-createdAt')
    res.json({ users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Missing fields' })

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already taken' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role })
    res.status(201).json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function updateUser(req, res) {
  try {
    const { name, email, password, role } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (email && email !== user.email) {
      if (await User.findOne({ email }))
        return res.status(400).json({ message: 'Email already taken' })
      user.email = email
    }
    if (name) user.name = name
    if (role) user.role = role
    if (password) user.password = await bcrypt.hash(password, 10)

    await user.save()
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    await user.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
