import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import NoteContext from '../contexts/NoteContext';
import DisableButtonContext from '../contexts/DisableButtonContext';
import AlertContext from '../contexts/AlertContext';

export default function NoteItem(props) {
    // Destructuring props from the parent 
    const { notes } = props;

    // Destructing context values passed from the parent
    const { theme } = useContext(ThemeContext);
    const { getAllNotes, deleteNote, editNoteStatus } = useContext(NoteContext)
    const { setDisableButton } = useContext(DisableButtonContext);
    const { showAlert } = useContext(AlertContext);

    //---------------------------------- Logic to load all the user notes on page landing ----------------------------------\\

    // UseEffect to load all the notes on page landing
    // useEffect(() => {
    //     if (localStorage.getItem("loginToken") !== null) {
    //         const fetchNotes = async () => {
    //             let response = null;
    //             try {
    //                 response = await getAllNotes();
    //                 if (!response.success) {
    //                     console.error(response); // Capture response errors
    //                     return;
    //                 }
    //             }
    //             catch (error) {
    //                 console.error("Error fetching notes:", error.message); // Capture other than response errors
    //             }
    //         };

    //         fetchNotes(); // call the async function
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    //---------------------------------------------------- ******** ----------------------------------------------------\\

    //----------------------------- Logic to handle on click event of the edit button -----------------------------\\

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
    //---------------------------------------------------- ******** ----------------------------------------------------\\


    //---------------------------------- Logic to handle the on click event of the delete button ----------------------------------\\

    // Function to manage event on delete
    const handleOnDelete = () => {
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        showAlert("Note deleted successfully !", "success");// Display alert message
    }
    //---------------------------------------------------- ******** ----------------------------------------------------\\


    //---------------------------------- Logic handle the on click event of status badges ----------------------------------\\

    // State to store the clicked action on task status
    const [taskStatus, setTaskStatus] = useState({
        noteId: null,
        pending: true,
        inProgress: false,
        complete: false
    })

    // Function to handle the on click event on for pending status
    const handleOnClickedP = (noteId) => {
        // Change the state based on the criteria
        setTaskStatus({
            noteId: noteId,
            pending: true,
            inProgress: false,
            complete: false
        })
    }

    // Function to handle the on click event on for in-progress status
    const handleOnClickedIP = (noteId) => {
        // Change the state based on the criteria
        setTaskStatus({
            noteId: noteId,
            pending: false,
            inProgress: true,
            complete: false
        })
    }

    // Function to handle the on click event on for complete status
    const handleOnClickedC = async (noteId) => {
        // Change the state based on the criteria
        setTaskStatus({
            noteId: noteId,
            pending: false,
            inProgress: false,
            complete: true
        });
    }

    //UseEffect to handle the UI change and database update on the status change
    useEffect(() => {
        const updateNoteStatus = async () => {
            // Destructure the statrs state
            const { noteId, pending, inProgress, complete } = taskStatus;

            if (noteId !== null) {
                let response = null;
                try {
                    response = await editNoteStatus(noteId, { pending, inProgress, complete });
                    // Check API response
                    if (!response.success) {
                        console.error(response); // Capture response errors
                        showAlert("Unable to edit the note due to server issue", "danger");// Display error alert message
                        return;
                    }
                    showAlert("Status changed successfully !", "success");// Display success alert message
                    // Scroll to the edited note of the page
                    setTimeout(() => {
                        const noteElement = document.getElementById(`note:${noteId}`);
                        if (noteElement) {
                            noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                } catch (e) {
                    console.error("Error updating notes status:", e.message); // Capture other than response errors
                    showAlert("Unable to edit the note due to server issue", "danger");// Display error alert message
                }
            }
        }
        updateNoteStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskStatus])
    //---------------------------------------------------- ******** ----------------------------------------------------\\

    return (
        <div>
            {notes.length === 0 ?
                <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <h5>😢 Oops! No notes available. Please add some.</h5>
                </div> :
                notes.map((note) => {
                    return (
                        <div className={`card text-bg-${theme === "dark" ? "dark" : "light"} mb-3`} id={`note:${note._id}`} key={note._id} style={{ maxWidth: "100%" }}>
                            <div className="card-header">
                                <h5>Title: {note.title}</h5>
                                <div className="d-flex justify-content-end align-items-center" style={{ cursor: "pointer" }}>
                                    <span className={`badge ${note.pending ? "text-bg-danger" : "text-bg-secondary"} mx-1`} id={`note:${note._id}`} onClick={() => { handleOnClickedP(note._id) }} >Pending</span>
                                    <span className={`badge ${note.inProgress ? "text-bg-warning" : "text-bg-secondary"} mx-1`} onClick={() => { handleOnClickedIP(note._id) }} >In Progress</span>
                                    <span className={`badge ${note.complete ? "text-bg-success" : "text-bg-secondary"} mx-1`} onClick={() => { handleOnClickedC(note._id) }} >complete</span>
                                </div>
                            </div>
                            <div className="card-body" style={{ backgroundColor: 'transparent' }}>
                                <p className="card-text">{note.description}</p>
                                <div>
                                    {note.tags.includes(",") ?
                                        note.tags.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0).map((tag, idx) => {
                                            return <span className="badge rounded-pill text-bg-secondary mb-2 me-1" key={idx}>{tag}</span>
                                        }) :
                                        <span className="badge rounded-pill text-bg-secondary mb-2">{note.tags}</span>
                                    }
                                </div>
                                <i className="fa-solid fa-file-pen mx-2" onClick={() => { handleOnClick(note) }}></i>
                                <i className="fa-solid fa-trash mx-2" onClick={() => { deleteNote(note._id); handleOnDelete() }}></i>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
