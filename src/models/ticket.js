import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  ticketId: { type: String, required: true },
  title: { type: String, required: true },
  ticket_price: { type: String, required: true },
  from_location: { type: String, required: true },
  to_location: { type: String, required: true },
  to_location_photo_url: { type: String, required: true },
});

export default mongoose.model("Ticket", ticketSchema);
