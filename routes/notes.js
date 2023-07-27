const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { query, validationResult, body } = require("express-validator");

//get api for fetching all notes
router.get("/getAllNotes", fetchUser, async (req, res) => {
  const notes = Notes.find({ user: req.id });
  res.status(200).json(notes);
});

//post api for creating a new notes
router.post(
  "/addNotes",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.id,
      });
      const saveNote = await note.save();
      res.status(200).json(saveNote);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ errors: "Internal server error" });
    }
  }
);

module.exports = router;
