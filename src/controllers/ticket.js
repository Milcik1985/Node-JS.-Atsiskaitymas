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

// const BUY_TICKET = async (req, res) => {
//   try {
//     const user = req.user;
//     const ticketId = req.body.ticketId;

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const ticket = await ticketSchema.findById(ticketId);
//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }

//     const ticketPrice = ticket.ticket_price;

//     if (parseInt(user.money_balance) < ticketPrice) {
//       return res.status(400).json({ message: "Insufficient cash balance" });
//     }
//     user.bought_tickets.push(ticketId);

//     user.money_balance -= ticketPrice;

//     await user.save();

//     return res.status(200).json({ message: "Ticket succesfully bought" });
//   } catch (err) {
//     console.log("Handled error:", err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
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
  console.log("Request body:", req.body);

  const { ticketId } = req.body;

  console.log("User ID from token:", req.userId);

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ticket = await ticketSchema.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticketPrice = ticket.ticket_price;
    if (parseInt(user.money_balance, 10) < ticketPrice) {
      return res.status(400).json({ message: "Insufficient cash balance" });
    }

    user.bought_tickets.push(ticketId);
    user.money_balance -= ticketPrice;

    await user.save();
    return res.status(200).json({ message: "Ticket successfully bought" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message:
        "Internal server error occurred while processing the ticket purchase",
    });
  }
};

export { ADD_TICKET, BUY_TICKET, GET_TICKET_BY_ID };
