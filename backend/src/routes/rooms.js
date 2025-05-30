import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import multer from 'multer'
import path from 'path'
import {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

router.get('/', listRooms)
router.get('/:id', getRoom)
router.post('/', auth, createRoom)
router.put('/:id', auth, updateRoom)
router.delete('/:id', auth, deleteRoom)

router.post(
  '/:id/upload',
  auth,
  upload.array('images', 5),
  async (req, res) => {
    const roomId = req.params.id
    const Room = (await import('../models/Room.js')).default
    const room = await Room.findById(roomId)
    if (!room) return res.status(404).json({ message: 'Room not found' })
    if (room.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const urls = req.files.map(f => `/uploads/${path.basename(f.path)}`)
    room.images = room.images.concat(urls)
    await room.save()
    res.json({ images: room.images })
  }
)

export default router
