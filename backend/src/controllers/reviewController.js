import Review from '../models/Review.js'

export async function listReviews(req, res) {
  const { roomId } = req.query
  const filter = roomId ? { room: roomId } : {}
  const reviews = await Review.find(filter)
    .sort('-createdAt')
    .populate('user', 'name')
  res.json({ reviews })
}

export async function createReview(req, res) {
  const { roomId, rating, comment } = req.body;
  if (!roomId || !rating) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const review = await Review.create({
    room:    roomId,
    user:    req.user.id,
    rating,
    comment: comment || ''
  });

  await review.populate('user', 'name');
  await review.populate('room', 'title');

  const io = req.app.get('io');
  io.emit('new-review', {
    roomId:    review.room._id.toString(),
    roomTitle: review.room.title,
    userName:  review.user.name,
    rating:    review.rating,
    comment:   review.comment,
  });

  res.status(201).json({ review });
}

export async function deleteReview(req, res) {
  const { id } = req.params
  const review = await Review.findById(id)
  if (!review) return res.status(404).json({ message: 'Not found' })
  if (!['admin','superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  await review.deleteOne()
  res.json({ message: 'Deleted' })
}
