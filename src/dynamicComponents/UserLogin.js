import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import AlertContext from '../contexts/AlertContext';

export default function UserLogin() {
  const HOST = "http://localhost:5000";

  // Destructing context values passed from the parent
  const {showAlert} = useContext(AlertContext);

  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // State to manage the user details
  const [userLDetails, setUserLDetails] = useState({
    email: "",
    password: ""
  })

  // Functioon to manage the onChnage event for the form
  const handleOnChange = (e) => {
    setUserLDetails({...userLDetails, [e.target.name]: e.target.value})
  }

  // State ot manage the disabled button
  const [disabledButton, setDisabledButton] = useState(true);

  //UseEffect to manage the disable button state
  useEffect(() => {
    if (userLDetails.email.trim()!=="" && userLDetails.password.trim()!=="" && userLDetails.email.includes("@")) {
      setDisabledButton(false)
    }
    else {
      setDisabledButton(true)
    }
  },[userLDetails.email, userLDetails.password, userLDetails]);

  // Function to handle on form submit
  const handleOnSubmit = async (e) => {
    // Prevent the default functionality of reloading the page upon submit
    e.preventDefault();
    console.log(userLDetails);
    // Logic to get user logged in
    const response = await fetch(`${HOST}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLDetails)
    });
    const json = await response.json();
    console.log(json);
    // Check response is a success
    if(json.success) {
      // Save the auth token and redirect
      localStorage.setItem('loginToken', json.authToken); 
      console.log(localStorage)
      navigate("/");// After successfull login and token storing redirect the user to the home page
      showAlert("Login successful", "success"); // Display alert
    }
    else {
      showAlert("Unable to login", "danger"); // Display alert
    }

    setUserLDetails({
      email: "",
      password: ""
    })
    setDisabledButton(prev => (!prev));
  }

  return (
    <div className="container p-4 border border-secondary" style={{maxWidth: "30rem", }}>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder='Enter your email' value={userLDetails.email} required onChange={handleOnChange} />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' placeholder='Enter your password' value={userLDetails.password} required onChange={handleOnChange}/>
        </div>
        <div className="mb-4 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" className="btn btn-outline-danger my-2" disabled={disabledButton}>Submit</button>
      </form>
    </div>
  )
}
