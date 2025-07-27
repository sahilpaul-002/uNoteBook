import React, { useEffect, useContext, useState } from 'react'
import Notes from './Notes'
import AddNote from './AddNote'
import NoteContext from '../contexts/NoteContext';
import DisableButtonStateProvider from '../contextComponents/DisableButtonsState';
import { useNavigate } from "react-router";
import AlertContext from '../contexts/AlertContext';
import LoadingBarContext from '../contexts/LoadingBarContext';
import ResponseInContext from '../contexts/ResponseInContext';

export default function Home() {
  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // Destructing context values passed from the parent
  const { getAllNotes } = useContext(NoteContext)
  const { showAlert } = useContext(AlertContext);
  const { progress, setProgress } = useContext(LoadingBarContext)

  //------------------------------------- Logic to show the loading by managing the state -------------------------------------\\

  // UseEffect to manage the progress state of the loading bar
  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setProgress(prev => prev + 50)
    }
  }, [progress, setProgress])
  //-----------------------------------------------------****************-----------------------------------------------------\\


  //---------------------------------- Logic to load all the user notes if user authenticated ----------------------------------\\
  
  // State to check  API response delivered
  const [responseIn, setResponseIn] = useState(false) 
  //UseEffect to check if the user is authenticated and load all user notes
  useEffect(() => {
    if (localStorage.getItem("loginToken") === null) {
      showAlert("Please log in to access the app", "danger");// Display alert
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
    else if (localStorage.getItem("loginToken") !== null) {
      const fetchNotes = async () => {
        let response = null;
        try {
          // response = await getAllNotes();
          setTimeout(async () => {
            response = await getAllNotes();
            if (!response.success) {
              console.error(response); // Capture response errors
              setResponseIn(prev => !prev); // Set the state for checking API response delivered
              return;
            }
            setResponseIn(prev => !prev); // Set the state for checking API response delivered
          }, 500)
        }
        catch (error) {
          console.error("Error fetching notes:", error.message); // Capture other than response errors
          setResponseIn(prev => !prev); // Set the state for checking API response delivered
        }
      };

      fetchNotes(); // call the async function
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //---------------------------------------------------- ******** ----------------------------------------------------\\

  return (
    <div>
      <DisableButtonStateProvider>
        <AddNote />

        <hr />
        <ResponseInContext value={{responseIn, setResponseIn}}>
        <Notes />
        </ ResponseInContext>
      </DisableButtonStateProvider>
    </div>
  )
}
