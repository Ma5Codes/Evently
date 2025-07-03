const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  owner: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  organizedBy: { type: String, trim: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, trim: true },
  location: { type: String, trim: true },
  Participants: { type: Number, min: 0, default: 0 },
  Count: { type: Number, min: 0, default: 0 },
  Income: { type: Number, min: 0, default: 0 },
  ticketPrice: { type: Number, min: 0, default: 0 },
  Quantity: { type: Number, min: 0, default: 0 },
  image: { type: String, trim: true },
  likes: { type: Number, min: 0, default: 0 },
  Comment: [{ type: String, trim: true }],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event; 