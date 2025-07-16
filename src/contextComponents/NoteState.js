import React, { useState } from 'react'
import NoteContext from '../contexts/NoteContext'

export default function NoteProvider(props) {
  const HOST = "http://localhost:5000";
  const notesInitial = [];

  // State to manage the notes
  const [notes, setNotes] = useState(notesInitial)

  //---------------------------------------------------------- GET ALL NOTES ----------------------------------------------------------\\
  // Function to add a note
  const getAllNotes = async () => {
    // Logic to fetch all notes
    const response = await fetch(`${HOST}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("loginToken")
      }
    });
    const json = await response.json();

    setNotes(json);
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- ADD NOTE ----------------------------------------------------------\\
  // Function to add a note
  const addNote = async (title, description, tags) => {
    // Logic to add data to the database
    const response = await fetch(`${HOST}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("loginToken")
      },
      body: JSON.stringify({title, description, tags})
    });
    const json = await response.json();

    setNotes(prevNotes => [...prevNotes, json]);
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\


  //---------------------------------------------------------- DELETE NOTE ----------------------------------------------------------\\
  // Function to delete a note
  const deleteNote = async (id) => {
    // Logic to delete data from database
    const response = await fetch(`${HOST}/api/notes/deletenote/${id}`, {
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
  const editNote = async (id, title, description, tags) => {
    // Logic to update the server side data in database
    const response = await fetch(`${HOST}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem("loginToken")
      },
      body: JSON.stringify({title, description, tags})
    });
    const json = await response.json();
    console.log(json)

    // Logic to update the client side data
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

    setNotes(updatedNotes);
  }
  //---------------------------------------------------------- ************ ----------------------------------------------------------\\

  const value = { notes, setNotes, getAllNotes, addNote, deleteNote, editNote };

  return <NoteContext value={value}>{props.children}</NoteContext>
}
