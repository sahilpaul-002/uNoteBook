import React, {useContext} from 'react'
import NoteContext from '../contexts/NoteContext'
import NoteItem from './NoteItem'

export default function Notes() {
    // Destructing context values passed from the parent
    const {notes, setNotes} = useContext(NoteContext)
    console.log(notes)
  return (
    <div className="container mt-5 mb-3">
        <h2>Your Notes :</h2>
        <NoteItem notes={notes}/>
    </div>
  )
}
