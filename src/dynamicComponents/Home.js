import React, { useEffect, useContext } from 'react'
import Notes from './Notes'
import AddNote from './AddNote'
import DisableButtonStateProvider from '../contextComponents/DisableButtonsState';
import { useNavigate } from "react-router";
import AlertContext from '../contexts/AlertContext';

export default function Home() {
  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // Destructing context values passed from the parent
  const { showAlert } = useContext(AlertContext);

  //UseEffect to check if the user is authenticated
  useEffect(() => {
    if (localStorage.getItem("loginToken") === null) {
      showAlert("Please log in to access the app", "danger");// Display alert
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

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
