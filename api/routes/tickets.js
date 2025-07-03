const express = require('express');
const Joi = require('joi');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const router = express.Router();

// Validation schema
const ticketSchema = Joi.object({
  userid: Joi.string().required(),
  eventid: Joi.string().required(),
  ticketDetails: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    eventname: Joi.string().required(),
    eventdate: Joi.date().required(),
    eventtime: Joi.string().required(),
    ticketprice: Joi.number().min(0).required(),
    qr: Joi.string().required(),
  }).required(),
  count: Joi.number().min(0),
});

// Create Ticket (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { error } = ticketSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const newTicket = new Ticket(req.body);
    await newTicket.save();
    res.status(201).json({ ticket: newTicket });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get all tickets (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      Ticket.find().skip(skip).limit(limit),
      Ticket.countDocuments()
    ]);
    res.status(200).json({ tickets, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get tickets by user
router.get('/user/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ userid: req.params.userId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user tickets' });
  }
});

// Delete ticket (protected)
router.delete('/:ticketId', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router; 