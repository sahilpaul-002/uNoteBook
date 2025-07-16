import React, {useContext, useEffect, useState} from 'react';
import NoteContext from '../contexts/NoteContext';
import DisableButtonContext from '../contexts/DisableButtonContext';
import AlertContext from '../contexts/AlertContext';

export default function AddNote() {
    // Destructing context values passed from the parent
    const {addNote, editNote} = useContext(NoteContext)
    const {disableButton, setDisableButton} = useContext(DisableButtonContext);
    const { showAlert } = useContext(AlertContext);

    // State to manage the note
    const [note, setNote] = useState({
        title: "", 
        description: "",
        tags: ""
    });

    // Function to handle on change event
    const handleOnChange = (e) => {
      setNote(prev => ({
        ...prev, 
        [e.target.name]: e.target.value
      }))
    };

    // Function to handle on click event for adding note
    const handleOnAddClick = (e) => {
      // Prevent the default action of reloading the page
      e.preventDefault();

      addNote(note.title, note.description, note.tags);
      
      setNote({
        title: "", 
        description: "",
        tags: ""
      })
    };

    // UseEffect to manage the form population during edit note
    useEffect(() => {
      if(disableButton.editNote!==null) {
        setNote({
          title: disableButton.editNote.title, 
          description: disableButton.editNote.description,
          tags: disableButton.editNote.tags
        })
      };
    },[disableButton.editNote])

    // Function to handle on click event for editing note
    const handleOnEditClick = (e) => {
      // Prevent the default action of reloading the page
      e.preventDefault();

      editNote(disableButton.editNote._id, note.title, note.description, note.tags);

      showAlert("Note edited successfully !", "success");// Display alert message
      
      setNote({
        title: "", 
        description: "",
        tags: ""
      })

      setDisableButton({
        addButton: false,
        editButton: true,
        editNote: null
      })
    }

  return (
    <div className="container mt-2 mb-5">
        <h1>Add Your Note</h1>
        {/*   Form   */}
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" name="title" placeholder="Enter notes title" value={note.title} aria-describedby="titleHelp" minLength={3} required onChange={handleOnChange}/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name="description" placeholder="Enter notes description" value={note.description} minLength={5} required onChange={handleOnChange}/>
          </div>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input type="text" className="form-control" id="tags" name="tags" placeholder="Enter notes tags" value={note.tags} onChange={handleOnChange}/>
          </div>
          <button type="submit" className="btn btn-outline-success" disabled={disableButton.addButton || note.title.length<3 || note.description.length<5 ? true : false} onClick={handleOnAddClick}>Add Note</button>
          <button type="submit" className="btn btn-outline-success mx-3" disabled={disableButton.editButton || note.title.length<3 || note.description.length<5 ? true : false} onClick={handleOnEditClick}>Edit Note</button>
        </form>
      </div>
  )
}
