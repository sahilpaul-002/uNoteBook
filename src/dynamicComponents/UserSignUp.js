import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../contexts/AlertContext';

export default function UserSignUp() {
  const HOST = "http://localhost:5000";

  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // Destructing context values passed from the parent
  const { showAlert } = useContext(AlertContext);

  // State to manage the user details
  const [userSDetails, setuserSDetails] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Functioon to manage the onChnage event for the form
  const handleOnChange = (e) => {
    setuserSDetails({ ...userSDetails, [e.target.name]: e.target.value })
  }

  // State ot manage the disabled button
  const [disabledButton, setDisabledButton] = useState(true);

  //UseEffect to manage the disable button state
  useEffect(() => {
    if (userSDetails.email.trim()!=="" && userSDetails.password.trim()!=="" && userSDetails.email.includes("@") && userSDetails.password.trim()>=4 && userSDetails.password===userSDetails.confirmPassword) {
      setDisabledButton(false)
    }
    else {
      setDisabledButton(true)
    }
  }, [userSDetails.email, userSDetails.password, userSDetails]);

  // Function to handle on form submit
  const handleOnSubmit = async (e) => {
    // Prevent the default functionality of reloading the page upon submit
    e.preventDefault();

    const { userName, email, password } = userSDetails;

    // Logic to get user logged in
    const response = await fetch(`${HOST}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userName, email, password })
    });
    const json = await response.json();
    // console.log(json);
    // Check response is a success
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('signupToken', json.authToken);
      // console.log(localStorage)
      navigate("/login");// After successfull signup and token storing redirect the user to the login page
      showAlert("Sign up successful", "success"); // Display alert
    }
    else {
      showAlert("Unable to login", "danger"); // Display alert
    }

    setuserSDetails({
      userName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setDisabledButton(prev => (!prev));
  }

  return (
    <div className="container p-4 border border-secondary" style={{ maxWidth: "30rem", }}>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="form-label">User name</label>
          <input type="userName" className="form-control" id="userName" name="userName" aria-describedby="userNameHelp" placeholder='Enter your user name' value={userSDetails.userName} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder='Enter your email' value={userSDetails.email} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' placeholder='Enter your password' value={userSDetails.password} minLength={4} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="confirmPassword" name='confirmPassword' placeholder='Enter your password' value={userSDetails.confirmPassword} required onChange={handleOnChange} />
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
