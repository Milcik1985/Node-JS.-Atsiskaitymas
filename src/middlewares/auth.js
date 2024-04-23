import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("token:", token);

  if (!token) {
    return res.status(404).json({ message: "User is not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "User is not authorized" });
    }

    console.log("Decoded token:", decoded);

    req.userId = decoded.userId;
    return next();
  });
};

export default authUser;
