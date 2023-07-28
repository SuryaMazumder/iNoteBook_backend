const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { query, validationResult, body } = require("express-validator");

//get api for fetching all notes
router.get("/getAllNotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user: req.id });
  res.send(notes);
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

//Updating notes
router.put(
  "/updateNotes/:id",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be 5 characters").isLength({
      min: 5,
    }),
    body("tag", "Enter a valid tag").isLength({ min: 2 }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    //creating a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Notes.findById({ _id: req.params.id });
    if (!note) {
      return res.status(401).send("Not found");
    }
    if (note.user.toString() !== req.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(note);
  }
);

//deleting Notes
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  let note = await Notes.findById({ _id: req.params.id });
  if (!note) {
    return res.status(401).send("Not found");
  }
  if (note.user.toString() !== req.id) {
    return res.status(401).send("Not Allowed");
  }
  try {
    note = await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Note Deleted!",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ errors: "Failed to delete" });
  }
});
module.exports = router;
