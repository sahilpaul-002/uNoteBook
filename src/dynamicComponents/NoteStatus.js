import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from "react-router";
import AlertContext from '../contexts/AlertContext';
import LoadingBarContext from '../contexts/LoadingBarContext';
import NoteContext from '../contexts/NoteContext';
import Spinner from '../staticComponents/Spinner';

export default function NoteStatus() {
    const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

    // Destructing context values passed from the parent
    const { showAlert } = useContext(AlertContext);
    const { progress, setProgress } = useContext(LoadingBarContext)
    const { notes, setNotes, getAllNotes, editNoteStatus } = useContext(NoteContext);

    //------------------------------------- Logic to show the loading by managing the state -------------------------------------\\

    // UseEffect to manage the progress state of the loading bar
    useEffect(() => {
        if (progress > 0 && progress < 100) {
            setProgress(prev => prev + 50)
        }
    }, [progress, setProgress])
    //-----------------------------------------------------****************-----------------------------------------------------\\


    //---------------------------------- Logic to load all the user notes if user authenticated ----------------------------------\\

    //UseEffect to check if the user is authenticated and load all user notes
    useEffect(() => {
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (localStorage.getItem("loginToken") === null) {
            showAlert("Please log in to access the app", "danger");// Display alert

            setTimeout(() => {
                navigate("/login");
            }, 500);
        }
        else if (localStorage.getItem("loginToken") !== null && notes.length === 0) {
            const fetchNotes = async () => {
                let response = null;
                try {
                    response = await getAllNotes();
                    if (!response.success) {
                        console.error(response); // Capture response errors
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


    //------------------------------------- Logic to handle drag and drop -------------------------------------\\

    // State to manage the status columns
    // const [columns, setColumns] = useState({});
    const [columns, setColumns] = useState({ pending: [], inProgress: [], complete: [] });

    // State to check  API response delivered
    const [responseIn, setResponseIn] = useState(false);

    // UseEffect to populate column with the notes
    useEffect(() => {
        const newColumns = { pending: [], inProgress: [], complete: [] };

        notes.forEach((note) => {
            if (note.pending) {
                newColumns.pending.push({
                    id: note._id,
                    noteTitle: note.title,
                    noteDescription: note.description,
                    color: "danger",
                });
            } else if (note.inProgress) {
                newColumns.inProgress.push({
                    id: note._id,
                    noteTitle: note.title,
                    noteDescription: note.description,
                    color: "warning",
                });
            } else if (note.complete) {
                newColumns.complete.push({
                    id: note._id,
                    noteTitle: note.title,
                    noteDescription: note.description,
                    color: "success",
                });
            }
        });
        // Update state once done
        setColumns(newColumns);
        setTimeout(() => {
            setResponseIn(true);
        }, 2500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes]);

    // State to manage the information of the notes in the card that is being dragged
    const [draggingCard, setDraggingCard] = useState(null);

    // Function to handle drrag start
    const handleDragStart = (card, sourceCol) => {
        setDraggingCard({ ...card, sourceCol });
    };

    // State to check  API response delivered
    const [editApiCall, setEditApiCall] = useState(false)

    // Function to handle the drop
    const handleDrop = async (targetCol, itemId) => {
        if (!draggingCard) {
            return;
        }

        // Determine color based on the target column
        const newColor =
            targetCol === "pending" ? "danger" :
                targetCol === "inProgress" ? "warning" :
                    "success";
        // Update the columns
        setColumns((prev) => {
            const sourceList = [...prev[draggingCard.sourceCol]].filter(
                (c) => c.id !== draggingCard.id
            );
            const targetList = [...prev[targetCol], { ...draggingCard, color: newColor }];

            return {
                ...prev,
                [draggingCard.sourceCol]: sourceList,
                [targetCol]: targetList,
            };
        });
        // Update the notes
        setNotes(prevNotes =>
            prevNotes.map((note) => {
                if (note._id === itemId) {
                    const updatedNote = {
                        ...note,
                        [targetCol]: true
                    };
                    return updatedNote;
                }
                return note;
            })
        );
        try {
            setEditApiCall(true);// Change the state once API called
            let noteId = draggingCard.id;
            let updatedStatus = { pending: false, inProgress: false, complete: false };
            updatedStatus[targetCol] = true;
            const response = await editNoteStatus(noteId, updatedStatus);
            setEditApiCall(false);// Change the state once response is delivered
            // Check API response
            if (!response.success) {
                console.error(response); // Capture response errors
                showAlert("Unable to edit the note status due to server issue", "danger");// Display error alert message
                setNotes(response.notes) // Update back to the previous state os notes
                return;
            }
            showAlert("Status changed successfully !", "success");// Display success alert message
        } catch (e) {
            console.error("Error updating notes status:", e.message); // Capture other than response errors
            showAlert("Unable to edit the note status due to server issue", "danger");// Display error alert message
        }

        setDraggingCard(null);
    };
    //-----------------------------------------------------****************-----------------------------------------------------\\

    return (
        <>
            {
                responseIn ?
                    (
                        columns.pending.length !== 0 || columns.inProgress.length !== 0 || columns.complete.length !== 0 ?
                            (
                                <div className='position-relative'>
                                    <div
                                        className="row row-cols-1 row-cols-md-3 g-4 mb-3" style={{ marginTop: "1px", flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                                        {Object.entries(columns).map(([colId, items]) => (
                                            <div
                                                key={colId} className="col" style={{ flex: "0 0 auto", minWidth: "250px" }} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(colId, items.id)}>
                                                <div className="card h-100">
                                                    <ul className="list-group list-group-flush">
                                                        {items.map((item) => (
                                                            <li key={item.id} className="list-group-item" draggable onDragStart={() => handleDragStart(item, colId)}>
                                                                <div
                                                                    className={`card text-bg-${item.color} mb-3`} style={{ cursor: "grab" }}>
                                                                    <div className="card-header">{item.noteTitle}</div>
                                                                    <div className="card-body">
                                                                        <p className="card-text">{item.noteDescription}</p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {editApiCall && (
                                        <div
                                            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                            style={{
                                                backgroundColor: "rgba(255, 255, 255, 0.5)", // lighter overlay, lets cards show
                                                backdropFilter: "blur(3px)", // adds blur to what's behind
                                                zIndex: 10 // to keep spinner on top
                                            }}
                                        >
                                            <div className="spinner-border my-5" style={{ width: "3rem", height: "3rem" }} role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) :
                            (
                                <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                                    <h5>😢 Oops! No notes available. Please add some.</h5>
                                </div>
                            )
                    )
                    :
                    <Spinner />
            }
        </>

    );
}
