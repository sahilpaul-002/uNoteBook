import React, {useContext} from 'react'
import NoteContext from '../contexts/NoteContext'
import NoteItem from './NoteItem'

export default function Notes() {
    // Destructing context values passed from the parent
    const {notes} = useContext(NoteContext)
    
  return (
    <div className="container mt-5 mb-3">
        <h2>Your Notes :</h2>
        {notes.length===0?
          <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <h5>😢 Oops! No notes available. Please add some.</h5>
          </div>:
          <NoteItem notes={notes}/>}
    </div>
  )
}
