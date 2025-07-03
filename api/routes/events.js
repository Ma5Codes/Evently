const express = require('express');
const Joi = require('joi');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Validation schemas
const eventSchema = Joi.object({
  owner: Joi.string().required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  organizedBy: Joi.string().allow(''),
  eventDate: Joi.date().required(),
  eventTime: Joi.string().allow(''),
  location: Joi.string().allow(''),
  ticketPrice: Joi.number().min(0),
  image: Joi.string().allow(''),
  likes: Joi.number().min(0),
  Comment: Joi.array().items(Joi.string()),
});

// Create Event (protected)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const eventData = req.body;
    eventData.image = req.file ? req.file.path : '';
    const { error } = eventSchema.validate(eventData);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save the event to MongoDB' });
  }
});

// Get Events (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      Event.find().skip(skip).limit(limit),
      Event.countDocuments()
    ]);
    res.status(200).json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events from MongoDB' });
  }
});

// Get Event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event from MongoDB' });
  }
});

// Like Event
router.post('/:eventId/like', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    event.likes += 1;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Event (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router; 