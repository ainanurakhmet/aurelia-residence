import Room from '../models/Room.js'

function isAdmin(user) {
  return user.role === 'admin' || user.role === 'superadmin'
}

export async function listRooms(req, res) {
  try {
    const rooms = await Room.find().sort('-createdAt')
    res.json({ rooms })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function getRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ message: 'Not found' })
    res.json({ room })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function createRoom(req, res) {
  try {
    const { title, description, price, capacity, images } = req.body
    if (!title || price == null || capacity == null) {
      return res.status(400).json({ message: 'Required fields missing' })
    }
    const room = await Room.create({
      title,
      description,
      price,
      capacity,
      images: images || [],
      createdBy: req.user.id
    })
    res.status(201).json({ room })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function updateRoom(req, res) {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ message: 'Not found' })
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const { title, description, price, capacity, images } = req.body
    room.title = title ?? room.title
    room.description = description ?? room.description
    room.price = price ?? room.price
    room.capacity = capacity ?? room.capacity
    room.images = images ?? room.images
    await room.save()
    res.json({ room })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteRoom(req, res) {
  try {
    const room = await Room.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        ...(isAdmin(req.user) ? [{}] : [])
      ]
    })
    if (!room) {
      return res.status(403).json({ message: 'Forbidden or not found' })
    }
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}


