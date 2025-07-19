import express from 'express';
import mongoose from 'mongoose';
import fetchUserDetails from '../middleware/fetchUserDetails.js';
import { Note } from '../models/Notes.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ********************************************** Fetch all notes logic ********************************************** //
// Route 1 : Fetch all notes for a user using GET "/api/notes/fetchallnotes" - Login required
router.get('/fetchallnotes', fetchUserDetails, async (req, res) => {
    let success = false;
    try {
        // Check user is logged in
        if (!req.user) {
            throw new Error("User not logged in");
        }
        // Convert the user ID to a MongoDB ObjectId
        const userId = req.user.userId
        // Fetch notes for the user from the database
        const notes = await Note.find({ user: userId });
        res.json({success:true, notes:notes});
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
// ********************************************** ----------------------- ********************************************** //


// ********************************************** Add Notes Logic logic ********************************************** //
// Route 2 : Add notes for a user using GET "/api/notes/addnote" - Login required
router.post('/addnote', fetchUserDetails,
    [
        body('title', 'Valid title is required at least of 3 characters').isLength({ min: 3 }),
        body('description', 'Valid description is required atleast of 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        let success = false;
        try {
            // Fetch validation errors
            const validationErrors = validationResult(req);
            // Check user is logged in
            if (!req.user) {
                throw new Error("User not logged in");
            }
            // If there are validation errors, throw them
            if (!validationErrors.isEmpty()) {
                validationErrors.throw();
            }
            // If no errors, create a new note
            const note = await Note.create({
                user: req.user.userId,
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags
            })
            // Send the created note in the response
            res.json({success: true, note: note});

        } catch (e) {
            // If the validation errors is array
            if (e.array) {
                return res.json({ success: false, errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.json({ success: false, error: e.message });
        }

    });
// ********************************************** ----------------------- ********************************************** //


// ********************************************** Updates Notes Logic logic ********************************************** //
// Route 3 : Update an existing note for a user using PUT "/api/notes/updatenote/:id" - Login required
router.put('/updatenote/:id', fetchUserDetails,
    async (req, res) => {
        let success = false;
        try {
            // Destructure the request body
            const { title, description, tags } = req.body;
            // Check user is logged in
            if (!req.user) {
                throw new Error("User not logged in");
            }
            // Validate the note ID
            const noteId = req.params.id;
            const note = await Note.findById(noteId);
            if (!note) {
                return res.status(404).json({success:false, error: "Not found"});
            }
            // Check if the note belongs to the user
            if (note.user.toString() !== req.user.userId) {
                return res.status(401).json({success:false, error: "Not allowed to update this note"});
            }
            // Create a new note object with the updated values
            const updatedNote = {};
            if (title) {
                updatedNote.title = title;
            }
            if (description) {
                updatedNote.description = description;
            }
            if (tags) {
                updatedNote.tags = tags;
            }
            // Update the note in the database
            const updatedNoteData = await Note.findByIdAndUpdate(noteId, { $set: updatedNote }, { new: true });
            // Send the created note in the response
            res.json({success: true, editedNote: updatedNoteData});

        } catch (e) {
            // If the validation errors is array
            if (e.array) {
                return res.status(500).json({ success:false, errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.status(500).json({ success:false, error: e.message });
        }
    });
// ********************************************** ----------------------- ********************************************** //


// ********************************************** Delete Notes Logic logic ********************************************** //
// Route 4 : Delete  an existing note for a user using DELETE "/api/notes/deletenote/:id" - Login required
router.delete('/deletenote/:id', fetchUserDetails,
    async (req, res) => {
        try {
            // Check user is logged in
            if (!req.user) {
                throw new Error("User not logged in");
            }
            // Validate the note ID
            const noteId = req.params.id;
            const note = await Note.findById(noteId);
            if (!note) {
                return res.status(404).json({error: "Not found"});
            }
            // Check if the note belongs to the user
            if (note.user.toString() !== req.user.userId) {
                return res.status(401).json({error: "Not allowed to delete this note"});
            }
            // Delete the note in the database
            const deletedNote = await Note.findByIdAndDelete(noteId);
            // Send the created note in the response
            res.json({ success: "Note deleted successfully", note: deletedNote });

        } catch (e) {
            // If the validation errors is array
            if (e.array) {
                return res.status(500).json({ errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.status(500).json({ error: e.message });
        }

    });
// ********************************************** ----------------------- ********************************************** //


export { router };