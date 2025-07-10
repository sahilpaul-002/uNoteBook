import React, { useState } from 'react'
import NoteContext from '../contexts/NoteContext'

export default function NoteProvider(props) {
  const notesInitial = [
    {
      "_id": "6866221221e2d15123a23bb8",
      "user": "6865add3849375ea574ec430",
      "title": "This is a evening greeting",
      "description": "Hello how are you this evening",
      "tags": "General",
      "timeStamp": "2025-07-03T06:24:18.697Z",
      "__v": 0
    },
    {
      "_id": "6866250f5c4bdc2292e15436",
      "user": "6865add3849375ea574ec430",
      "title": "This is a morning greeting",
      "description": "Hello how are you this morning",
      "tags": "Communication",
      "timeStamp": "2025-07-03T06:37:03.198Z",
      "__v": 0
    },
    {
      "_id": "686625395c4bdc2292e15438",
      "user": "6865add3849375ea574ec430",
      "title": "Mern project",
      "description": "Need to complete the mern stack project",
      "tags": "Personal",
      "timeStamp": "2025-07-03T06:37:45.079Z",
      "__v": 0
    },
    {
      "_id": "686625ed5c4bdc2292e1543a",
      "user": "6865add3849375ea574ec430",
      "title": "General Note",
      "description": "This is general note",
      "tags": "General",
      "timeStamp": "2025-07-03T06:40:45.921Z",
      "__v": 0
    },
    {
      "_id": "6866288dfe7d6f864db3d0d0",
      "user": "6865add3849375ea574ec430",
      "title": "MernStack Development",
      "description": "I am currently learning mern stack development",
      "tags": "Coding",
      "timeStamp": "2025-07-03T06:51:57.932Z",
      "__v": 0
    }
  ]

  // State to manage the notes
  const [notes, setNotes] = useState(notesInitial)

  const value = {notes, setNotes};

  return <NoteContext value={value}>{props.children}</NoteContext>
}
