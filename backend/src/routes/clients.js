import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import {
  listClients,
  createClient,
  deleteClient
} from '../controllers/clientController.js'

const router = express.Router()

router.use(auth, (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' })
  next()
})

router.get('/', listClients)
router.post('/', createClient)
router.delete('/:id', deleteClient)

export default router
