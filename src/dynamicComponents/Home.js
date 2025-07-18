import React, { useEffect, useContext } from 'react'
import Notes from './Notes'
import AddNote from './AddNote'
import DisableButtonStateProvider from '../contextComponents/DisableButtonsState';
import { useNavigate } from "react-router";
import AlertContext from '../contexts/AlertContext';
import LoadingBarContext from '../contexts/LoadingBarContext';

export default function Home() {
  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // Destructing context values passed from the parent
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

  //UseEffect to check if the user is authenticated
  useEffect(() => {
    if (localStorage.getItem("loginToken") === null) {
      showAlert("Please log in to access the app", "danger");// Display alert
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DisableButtonStateProvider>
        <AddNote />

        <hr />

        <Notes />
      </DisableButtonStateProvider>
    </div>
  )
}
