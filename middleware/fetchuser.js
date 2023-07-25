const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next) => {
  //get user from jwt token and sending to next api

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "Please authenticate using valid token" });
  }
  try {
    const data = await jwt.verify(token, JWT_SECRET);
    req.id = data.id;

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using valid token" });
  }
};
module.exports = fetchUser;
