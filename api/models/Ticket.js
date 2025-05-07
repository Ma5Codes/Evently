   const mongoose = require("mongoose");

   const ticketSchema = new mongoose.Schema({
      userid: { type: String, required: true }, // Fixing 'require' to 'required'
      eventid: { type: String, required: true }, // Fixing 'require' to 'required'
      ticketDetails: {
         name: { type: String, required: true }, // Fixing 'require' to 'required'
         email: { type: String, required: true }, // Fixing 'require' to 'required'
         eventname: { type: String, required: true }, // Fixing 'require' to 'required'
         eventdate: { type: Date, required: true }, // Fixing 'require' to 'required'
         eventtime: { type: String, required: true }, // Fixing 'require' to 'required'
         ticketprice: { type: Number, required: true }, // Fixing 'require' to 'required'
         qr: { type: String, required: true }, // Fixing 'require' to 'required'
      },
      count: { type: Number, default: 0 },
   });
   

   const TicketModel = mongoose.model(`Ticket`, ticketSchema);
   module.exports = TicketModel;