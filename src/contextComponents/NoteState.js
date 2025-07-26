import React, { useState } from 'react'
import NoteContext from '../contexts/NoteContext'

export default function NoteProvider(props) {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localAPI_BASE:5000";
  const notesInitial = [];

  // State to manage the notes
  const [notes, setNotes] = useState(notesInitial)

  //---------------------------------------------------------- GET ALL NOTES ----------------------------------------------------------\\
  // Function to add a note
  const getAllNotes = async () => {
    // Logic to fetch all notes
    try {
      const response = await fetch(`${API_BASE}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authToken": localStorage.getItem("loginToken")
        }
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error("Failed to fetch notes from server.");
      }
      setNotes(json.notes); //Change thse state of the notes
      return ({ success: true });
    }
    catch (e) {
      return ({ success: false, error: e.message });
    }
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- ADD NOTE ----------------------------------------------------------\\
  // Function to add a note
  const addNote = async (title, description, tags) => {
    // Logic to add data to the database
    try {
      let response = null;
      // Checks tags 
      if (tags === "") {
        response = await fetch(`${API_BASE}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authToken": localStorage.getItem("loginToken")
          },
          body: JSON.stringify({ title, description })
        });
      }
      else {
        response = await fetch(`${API_BASE}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authToken": localStorage.getItem("loginToken")
          },
          body: JSON.stringify({ title, description, tags })
        });
      }
      const json = await response.json();
      if (!json.success) {
        throw new Error("Failed to fetch notes from server.");
      }
      setNotes(prevNotes => [...prevNotes, json.note]); // Change the state of notes by adding the new note
      return ({ success: true });
    }
    catch (e) {
      console.log(`Error: ${e.message}`)
      return ({ success: false, error: e.message });
    }
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- DELETE NOTE ----------------------------------------------------------\\
  // Function to delete a note
  const deleteNote = async (id) => {
    // Logic to delete data from database
    const response = await fetch(`${API_BASE}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("loginToken")
      }
    });
    const json = await response.json();
    console.log(json);
    let newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- EDIT NOTE ----------------------------------------------------------\\
  // Function to edit a note
  const editNote = async (id, newTitle, newDescription, newTags) => {
    // Logic to update the server side data in database    
    try {
      let response = null;
      if (newTags === "") {
        response = await fetch(`${API_BASE}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authToken": localStorage.getItem("loginToken")
          },
          body: JSON.stringify({ title: newTitle, description: newDescription })
        });
      }
      else {
        response = await fetch(`${API_BASE}/api/notes/updatenote/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authToken": localStorage.getItem("loginToken")
          },
          body: JSON.stringify({ title: newTitle, description: newDescription, tags: newTags })
        });
      }
      const json = await response.json();
      if (!json.success) {
        throw new Error("Failed to fetch notes from server.");
      }
      // Logic to update the client side data
      const { title, description, tags } = json.editedNote;
      const updatedNotes = notes.map((note) => {
        if (note._id === id) {
          return {
            ...note, // copy existing fields (like user, timestamp, etc.)
            title,
            description,
            tags
          };
        }
        return note;
      });
      setNotes(updatedNotes); // Change the state of notes by editing the note
      return ({ success: true });
    }
    catch (e) {
      console.log(`Error: ${e.message}`)
      return ({ success: false, error: e.message });
    }
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- EDIT NOTE STATUS ----------------------------------------------------------\\
  // Function to edit a note
  const editNoteStatus = async (id, updatedFields) => {
    // Logic to update the server side data in database    
    try {
      let response = null;
      response = await fetch(`${API_BASE}/api/notes/updatenotestatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authToken": localStorage.getItem("loginToken")
        },
        body: JSON.stringify({ updatedFields })
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error("Failed to fetch notes from server.");
      }
      // Logic to update the client side data
      const { pending, inProgress, complete } = json.editedNote;
      const updatedNotes = notes.map((note) => {
        if (note._id === id) {
          return {
            ...note, // copy existing fields (like user, timestamp, etc.)
            pending,
            inProgress,
            complete
          };
        }
        return note;
      });
      setNotes(updatedNotes); // Change the state of notes by editing the note
      return ({ success: true });
    }
    catch (e) {
      console.log(`Error: ${e.message}`)
      return ({ success: false, error: e.message });
    }
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\

  const value = { notes, setNotes, getAllNotes, addNote, deleteNote, editNote, editNoteStatus };

  return <NoteContext value={value}>{props.children}</NoteContext>
}
