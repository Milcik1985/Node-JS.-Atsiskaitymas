import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, primary: true},
  userName: { type: String, required: true, min: 3 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bought_tickets: { type: Array },
  money_balance: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
