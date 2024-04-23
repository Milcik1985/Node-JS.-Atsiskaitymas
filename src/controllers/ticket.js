import ticketSchema from "../models/ticket.js";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";

const ADD_TICKET = async (req, res) => {
  try {
    const ticket = new ticketSchema({
      ticketId: uuidv4(),
      title: req.body.title,
      ticket_price: req.body.ticket_price,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url,
    });

    const response = await ticket.save();

    return res
      .status(200)
      .json({ status: "Ticket is added", response: response });
  } catch (err) {
    console.log("Handled error:", err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const GET_TICKET_BY_ID = async (req, res) => {
  try {
    const ticket = await ticketSchema.findOne({
      ticketId: req.params.ticketId,
    });
    console.log("Found ticket:", ticket);

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ ticket: ticket });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.userId);

    const { ticketId } = req.body;
    console.log("Ticket ID from request body:", ticketId);
    const userId = req.userId;

    console.log("User ID for querying:", userId);

    const user = await User.findOne({ userId: userId });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const ticket = await ticketSchema.findOne({ ticketId: ticketId });
    console.log("Found ticket:", ticket);

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (user.money_balance < ticket.ticket_price) {
      console.log("Insufficient cash balance");
      return res.status(400).json({ message: "Insufficient cash balance" });
    }

    user.money_balance -= ticket.ticket_price;
    user.bought_tickets.push({
      title: ticket.title,
      ticket_price: ticket.ticket_price,
      from_location: ticket.from_location,
      to_location: ticket.to_location,
      to_location_photo_url: ticket.to_location_photo_url
    });

    await user.save();

    console.log("Ticket purchased successfully");
    return res.status(200).json({ message: "Ticket purchased successfully", ticket: ticket });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error occurred while processing the ticket purchase",
    });
  }
};

export { ADD_TICKET, BUY_TICKET, GET_TICKET_BY_ID };
