import React, { useContext, useEffect, useState } from 'react';
import NoteContext from '../contexts/NoteContext';
import DisableButtonContext from '../contexts/DisableButtonContext';
import AlertContext from '../contexts/AlertContext';
import { capitalize } from '../Functions';

export default function AddNote() {
  // Destructing context values passed from the parent
  const { addNote, editNote } = useContext(NoteContext)
  const { disableButton, setDisableButton } = useContext(DisableButtonContext);
  const { showAlert } = useContext(AlertContext);

  // State to manage the note
  const [note, setNote] = useState({
    title: "",
    description: "",
    tags: ""
  });

  //--------------------------------------------- Logic to handle on change event of the form ---------------------------------------------\\

  // Function to handle on change event
  const handleOnChange = (e) => {
    setNote(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };
  //-------------------------------------------------------************-------------------------------------------------------\\


  // State to check  API response delivered
  const [addApiCall, setAddApiCall] = useState(false)
  // State to check  API response delivered
  const [editApiCall, setEditApiCall] = useState(false)


  //--------------------------------------------- Logic to handle clicking add button ---------------------------------------------\\

  // Function to handle on click event for adding note
  const handleOnAddClick = async (e) => {
    // Prevent the default action of reloading the page
    e.preventDefault();

    setAddApiCall(true);// Change the state once API called
    let response = null;
    try {
      response = await addNote(note.title, note.description, capitalize(note.tags));
      setAddApiCall(false);// Change the state once response is delivered
      // Check API response
      if (!response.success) {
        console.error(response); // Capture response errors
        showAlert("Unable to add the note due to server issue", "danger");// Display error alert message
        return;
      }
      showAlert("Note added successfully !", "success");// Display success alert message
      // Scroll to the top of the page
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error("Error fetching notes:", e.message); // Capture other than response errors
      showAlert("Unable to add the note due to server issue", "danger");// Display error alert message
    }
    finally {
      setNote({
        title: "",
        description: "",
        tags: ""
      })
    }
  };
  //-------------------------------------------------------************-------------------------------------------------------\\


  //--------------------------------------------- Logic to handle clicking edit button ---------------------------------------------\\

  // UseEffect to manage the form population during edit note
  useEffect(() => {
    if (disableButton.editNote !== null) {
      setNote({
        title: disableButton.editNote.title,
        description: disableButton.editNote.description,
        tags: disableButton.editNote.tags
      })
    };
  }, [disableButton.editNote])

  // Function to handle on click event for editing note
  const handleOnEditClick = async (e) => {
    // Prevent the default action of reloading the page
    e.preventDefault();

    setEditApiCall(true);// Change the state once API called
    let response = null;
    try {
      response = await editNote(disableButton.editNote._id, note.title, note.description, capitalize(note.tags));
      setEditApiCall(false);// Change the state once response is delivered
      // Check API response
      if (!response.success) {
        console.error(response); // Capture response errors
        showAlert("Unable to edit the note due to server issue", "danger");// Display error alert message
        return;
      }
      showAlert("Note edited successfully !", "success");// Display success alert message
      // Scroll to the edited note of the page
      setTimeout(() => {
        const noteElement = document.getElementById(`note:${disableButton.editNote._id}`);
        if (noteElement) {
          noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (e) {
      console.error("Error editing notes:", e.message); // Capture other than response errors
      showAlert("Unable to edit the note due to server issue", "danger");// Display error alert message
    }
    finally {
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
  };
  //-------------------------------------------------------************-------------------------------------------------------\\


  //------------------------------------- Logic for text annimation for form placeholders -------------------------------------\\

  // State to to store the animated text for the form placeholders
  const [animationText, setanimationText] = useState({
    titleText: "",
    descriptionText: ""
  });
  // UseEffect to manage the animation of the text in form placeholders
  useEffect(() => {
    // Function to animate the text string
    const animateText = (text, type, interval) => {
      let i = 0;              // Set counter to manage the setinterval
      let displayText = ""    // Set dummy text for smoother assignment of state variable
      // Set the setInterval to animate the text at equal intervals
      const startAnimation = () => {
        const intervalId = setInterval(() => {
          if (i < text.length) {
            if (text[i] !== undefined) {
              displayText += text[i];
              setanimationText(prev => ({ ...prev, [type]: displayText }));
            }
            // console.log(displayText);
            i++;
          } else {
            clearInterval(intervalId);
            setanimationText(prev => ({ ...prev, [type]: displayText }));  // Clear the text
            i = 0;                  // Reset counter
            displayText = "";       // Reset dummy text
            // Reset and restart after 1s
            setTimeout(() => {
              startAnimation();       // Restart animation
            }, 1000);
          }
        }, interval);
      };
      startAnimation(); // start when component mounts
    }
    const titleText = "(min 3 characters....)";
    const descriptionText = "(min 5 characters....)";
    animateText(titleText, "titleText", 200);
    animateText(descriptionText, "descriptionText", 200);
    // Optional cleanup
    return () => clearInterval(); // cleanup in case component unmounts
  }, []);
  //------------------------------------- ************************************* -------------------------------------||

  return (
    <div className="container mb-5">
      <div className="container mb-3">
        <h1 className='d-flex justify-content-center mb-0'><u>uNoteBook</u></h1>
        <p className='d-flex justify-content-center '>Personal Notes App On Your Finger Tips</p>
      </div>
      <h2>Add Your Note</h2>
      {/*   Form   */}
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name="title" placeholder={`Enter notes title ${animationText.titleText}`} value={note.title} aria-describedby="titleHelp" minLength={3} required onChange={handleOnChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" placeholder={`Enter notes description ${animationText.descriptionText}`} value={note.description} minLength={5} required onChange={handleOnChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input type="text" className="form-control" id="tags" name="tags" placeholder="Enter notes tags" value={note.tags} onChange={handleOnChange} />
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-outline-success d-flex align-items-center gap-2" disabled={disableButton.addButton || note.title.trim().length < 3 || note.description.trim().length < 5 ? true : false} onClick={handleOnAddClick}>
            Add Note
            {addApiCall && (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </button>
          <button type="submit" className="btn btn-outline-success d-flex align-items-center gap-2 mx-3" disabled={disableButton.editButton || note.title.trim().length < 3 || note.description.trim().length < 5 ? true : false} onClick={handleOnEditClick}>
            Edit Note
            {editApiCall && (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
