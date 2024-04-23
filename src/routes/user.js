import express from "express";
import {
  SIGN_UP,
  LOG_IN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USERS_BY_ID_WITH_TICKETS,
} from "../controllers/user.js";
import authUser from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/users", SIGN_UP);
userRouter.post("/users/login", LOG_IN);
userRouter.post("/getNewJwtToken", GET_NEW_JWT_TOKEN); /*neveikia*/
userRouter.get("/users/all", authUser, GET_ALL_USERS);
userRouter.get("/users/:userId", authUser, GET_USER_BY_ID);
userRouter.get(
  "/uses/:userId/bought_tickets",
  authUser,
  GET_USERS_BY_ID_WITH_TICKETS
); /*neveikia*/

export default userRouter;
