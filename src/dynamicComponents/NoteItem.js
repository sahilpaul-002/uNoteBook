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
    const { getAllNotes, deleteNote } = useContext(NoteContext)
    const { setDisableButton } = useContext(DisableButtonContext);
    const { showAlert } = useContext(AlertContext);

    //---------------------------------- Logic to load all the user notes on page landing ----------------------------------\\

    // UseEffect to load all the notes on page landing
    useEffect(() => {
        if (localStorage.getItem("loginToken") !== null) {
            const fetchNotes = async () => {
                let response = null;
                try {
                    response = await getAllNotes();
                    if (!response.success) {
                        console.log(response); // Capture response errors
                        return;
                    }
                }
                catch (error) {
                    console.error("Error fetching notes:", error.message); // Capture other than response errors
                }
            };

            fetchNotes(); // call the async function
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
        pending: {},
        inProgress: {},
        complete: {}
    })

    // Function to handle the on click event on for pending status
    const handleOnClickedP = (noteId) => {
        // Change the state based on the criteria
        const {pending, inProgress, complete} = taskStatus;
        if (Object.keys(pending).length===0) {
            setTaskStatus(prev => ({
                // ...prev,
                inProgress: Object.fromEntries(Object.entries(inProgress).filter(([id]) => id !== noteId)),
                complete: Object.fromEntries(Object.entries(complete).filter(([id]) => id !== noteId)),
                pending: {[noteId]: true}
            }));
        }
        else if (Object.keys(pending).length!==0 && !(noteId in pending)) {
            setTaskStatus(prev => ({
                // ...prev,
                inProgress: Object.fromEntries(Object.entries(inProgress).filter(([id]) => id !== noteId)),
                complete: Object.fromEntries(Object.entries(complete).filter(([id]) => id !== noteId)),
                pending: {...pending, [noteId]: true}
            }));
        }
        else {
            setTaskStatus(prev => ({
                ...prev,
                pending: Object.fromEntries(Object.entries(pending).filter(([id]) => id !== noteId))
            }));
        }
    }
    // Function to handle the on click event on for in-progress status
    const handleOnClickedIP = (noteId) => {
        // Change the state based on the criteria
        const {pending, inProgress, complete} = taskStatus;
        if (Object.keys(inProgress).length===0) {
            setTaskStatus(prev => ({
                // ...prev,
                pending: Object.fromEntries(Object.entries(pending).filter(([id]) => id !== noteId)),
                complete: Object.fromEntries(Object.entries(complete).filter(([id]) => id !== noteId)),
                inProgress: {[noteId]: true}
            }));
        }
        else if (Object.keys(inProgress).length!==0 && !(noteId in inProgress)) {
            setTaskStatus(prev => ({
                // ...prev,
                pending: Object.fromEntries(Object.entries(pending).filter(([id]) => id !== noteId)),
                complete: Object.fromEntries(Object.entries(complete).filter(([id]) => id !== noteId)),
                inProgress: {...inProgress, [noteId]: true}
            }));
        }
        else {
            setTaskStatus(prev => ({
                ...prev,
                inProgress: Object.fromEntries(Object.entries(inProgress).filter(([id]) => id !== noteId))
            }));
        }
    }
    // 
    const handleOnClickedC = (noteId) => {
        // Change the state based on the criteria
        const {pending, inProgress, complete} = taskStatus;
        if (Object.keys(complete).length===0) {
            setTaskStatus(prev => ({
                // ...prev,
                pending: Object.fromEntries(Object.entries(pending).filter(([id]) => id !== noteId)),
                inProgress: Object.fromEntries(Object.entries(inProgress).filter(([id]) => id !== noteId)),
                complete: {[noteId]: true}
            }));
        }
        else if (Object.keys(complete).length!==0 && !(noteId in complete)) {
            setTaskStatus(prev => ({
                // ...prev,
                pending: Object.fromEntries(Object.entries(pending).filter(([id]) => id !== noteId)),
                inProgress: Object.fromEntries(Object.entries(inProgress).filter(([id]) => id !== noteId)),
                complete: {...complete, [noteId]: true}
            }));
        }
        else {
            setTaskStatus(prev => ({
                ...prev,
                complete: Object.fromEntries(Object.entries(complete).filter(([id]) => id !== noteId))
            }));
        }
    }
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
                                <div className="d-flex justify-content-end align-items-center" style={{cursor: "pointer"}}>
                                    <span className={`badge ${note._id in taskStatus.pending?"text-bg-danger":"text-bg-secondary"} mx-1`} id={`note:${note._id}`} onClick={() => {handleOnClickedP(note._id)}} >Pending</span>
                                    <span className={`badge ${note._id in taskStatus.inProgress?"text-bg-warning":"text-bg-secondary"} mx-1`} onClick={() => {handleOnClickedIP(note._id)}} >In Progress</span>
                                    <span className={`badge ${note._id in taskStatus.complete?"text-bg-success":"text-bg-secondary"} mx-1`} onClick={() => {handleOnClickedC(note._id)}} >complete</span>
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
