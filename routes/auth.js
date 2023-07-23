const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { query, validationResult, body } = require("express-validator");

router.get("/", (req, res) => {
  console.log(res);
});

router.post(
  "/save",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be atleast 1 alphanumeric and min length 5")
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: "Email already exists!" });
      }
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });

      res.json(user);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ errors: "Unexpected error Occured" });
    }
  }
);

module.exports = router;
