import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const SIGN_UP = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;
    const userName = req.body.userName.toLowerCase();

    if (!email.includes("@")) {
      return res
        .status(400)
        .json({ message: "Wrong email. It must contain '@'" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have at least 6 characters" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userData = {
      userId: uuidv4(),
      userName: req.body.userName,
      email: email,
      password: hash,
      bought_tickets: [],
      money_balance: req.body.money_balance,
    };

    const newUser = new User(userData);
    const response = await newUser.save();
    console.log(response);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.log("Handled error:", err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const LOG_IN = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User data is wrong" });
    }

    const doesPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!doesPasswordMatch) {
      return res.status(500).json({ message: "User data is wrong" });
    }

    const jwt_token = jwt.sign(
      { userId: user._id, userName: user.userName, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const jwt_refresh_token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      jwt: jwt_token,
      jwt_refresh_token,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.log("Handled error:", err);
    return res
      .status(404)
      .json({ message: "Wrong email or password. Try again" });
  }
};

const GET_NEW_JWT_TOKEN = async (req, res) => {
  try {
    const { jwt_refresh_token } = req.body;

    jwt.verify(
      jwt_refresh_token,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          console.log("Error verifying JWT refresh token:", err);
          return res
            .status(400)
            .json({ message: "Session is over. User needs to log in again" });
        }

        const newJwtToken = jwt.sign(
          { userId: decoded.userId, email: decoded.email },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );
        return res
          .status(200)
          .json({ jwt_token: newJwtToken, jwt_refresh_token });
      }
    );
  } catch (err) {
    console.log("Handled error:", err);
    return res.status(400).json({ message: "Error occurred" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await User.find().sort({ userName: 1 });

    return res.status(200).json({ users: users });
  } catch (err) {
    console.log("Handled error:", err);
    return res.status(500).json({ message: "Error occured" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });

    return res.status(200).json({ user: user });
  } catch (err) {
    return res.status(404).json({ message: "There is no user with such id" });
  }
};

const GET_USERS_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userWithTickets = await User.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "boughtTickets",
        },
      },
    ]);
    if (!userWithTickets || userWithTickets.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: userWithTickets[0] });
  } catch (err) {
    console.log("Handled error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  SIGN_UP,
  LOG_IN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USERS_BY_ID_WITH_TICKETS,
};
