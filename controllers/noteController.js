const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Note = require('../models/Note');

//@desc - Get all notes
//@route - GET /notes
//@access Private
const getAllNotes = asyncHandler( async (req,res) => {
  const notes = await Note.find().select('-createdAt').select('-updatedAt').lean();
  if(!notes?.length) return res.status(400).json({ message: "No notes found" });
  res.json(notes);
});

//@desc - Create new note
//@route - POST /notes
//@access Private
const createNotes = asyncHandler( async (req,res) => {
  const { user, title, text, completed } = req.body;

  //confirm data
  if(!user || !title || !text ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check user
  const foundUser = await User.findById(user).exec();
  if(!foundUser) return res.status(400).json({ message: "User not found" });

  //check for duplicate notes
  const duplicate = await Note.findOne({ title }).lean().exec();
  if(duplicate) return res.status(409).json({ message: "Duplicate title" });

  //create new note
  const noteObj = { user, title, text, completed };
  const note = await Note.create(noteObj);
  if(note) res.status(201).json({ message: `Note '${title}' created` });
  else res.status(400).json({ message: "Invalid note data received" });
});

//@desc - Update note
//@route - PUT /notes
//@access Private
const updateNotes = asyncHandler( async (req,res) => {
  const { id, user, title, text } = req.body;

  //confirm datas
  if(!id || !user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find note
  const foundNote = await Note.findById(id).exec();
  if(!foundNote) return res.status(400).json({ message: "Note not found" });

  //check for duplicate
  const foundTitle = await Note.findOne({ title }).lean().exec();
  if(foundTitle && foundTitle?._id !== id) return res.status(409).json({ message: "Duplicate note" });

  //update note
  foundNote._id = id;
  foundNote.user = user;
  foundNote.title = title;
  foundNote.text = text;
  const updatedNote = await foundNote.save();
  res.json({ message: `${foundNote.title} updated` });
});

//@desc - Delete note
//@route - DELETE /notes
//@access Private
const deleteNotes = asyncHandler( async (req,res) => {
  const { id } = req.body;

  //check ID
  if(!id) return res.status(400).json({ message: "Note ID required" });

  //find Note
  const foundNote = await Note.findById(id).exec();
  if(!foundNote) return res.status(400).json({ message: "Note not found" });

  //delete note
  const result = await foundNote.deleteOne();
  console.log(result)
  const reply = `Note ${result.title} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNotes,
  updateNotes,
  deleteNotes
}