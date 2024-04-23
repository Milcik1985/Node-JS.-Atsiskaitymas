import express from "express";
import {
  BUY_TICKET,
  ADD_TICKET,
  GET_TICKET_BY_ID,
} from "../controllers/ticket.js";
import ticketValidationSchema from "../validationSchema/ticket.js";
import validData from "../middlewares/validation.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/tickets",
  authUser,
  validData(ticketValidationSchema),
  ADD_TICKET
);
router.post("/tickets/buy", authUser, BUY_TICKET);

router.get("/tickets/:ticketId", authUser, GET_TICKET_BY_ID);

export default router;
