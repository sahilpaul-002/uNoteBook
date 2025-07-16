import React, {useContext, useEffect} from 'react';
import ThemeContext from '../contexts/ThemeContext';
import NoteContext from '../contexts/NoteContext';
import DisableButtonContext from '../contexts/DisableButtonContext';
import AlertContext from '../contexts/AlertContext';

export default function NoteItem(props) {
    // Destructuring props from the parent 
    const { notes } = props;

    // Destructing context values passed from the parent
    const { theme } = useContext(ThemeContext);
    const {getAllNotes, deleteNote} = useContext(NoteContext)
    const {setDisableButton} = useContext(DisableButtonContext);
    const { showAlert } = useContext(AlertContext);

    // Function to set the state of disabled buttons
    const handleOnClick = (note) => {
        setDisableButton({
            addButton: true,
            editButton: false,
            editNote: note // Store the note to be edited
        });

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Function to manage event on delete
    const handleOnDelete = () => {
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        showAlert("Note deleted successfully !", "success");// Display alert message
    }

    // UseEffect to load all the notes on page landing
    useEffect(() => {
        if (localStorage.getItem("loginToken")!==null) {
            getAllNotes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div>
            {notes.length===0 ?
                <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <h5>😢 Oops! No notes available. Please add some.</h5>
                </div> :
                notes.map((note) => {
                return (
                    <div className={`card text-bg-${theme==="dark"?"dark":"light"} mb-3`} key={note._id} style={{ maxWidth: "100%" }}>
                        <div className="card-header">
                            <h5>Title: {note.title}</h5>
                        </div>
                        <div className="card-body" style={{backgroundColor: 'transparent'}}>
                            <p className="card-text">{note.description}</p>
                            <i className="fa-solid fa-file-pen mx-2" onClick={() => {handleOnClick(note)}}></i>
                            <i className="fa-solid fa-trash mx-2" onClick={() => {deleteNote(note._id); handleOnDelete()}}></i>
                        </div>
                    </div>
                )
            })
            } 
        </div>
    )
}
