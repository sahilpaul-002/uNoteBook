import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../contexts/AlertContext';
import LoadingBarContext from '../contexts/LoadingBarContext';

export default function UserSignUp() {
  const HOST = "http://localhost:5000";

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


  // State to manage the user details
  const [userSDetails, setuserSDetails] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })


  //------------------------------------- Logic to handle onChange event for form placeholders -------------------------------------\\  

  // Functioon to manage the onChnage event for the form
  const handleOnChange = (e) => {
    setuserSDetails({ ...userSDetails, [e.target.name]: e.target.value })
  }
  //-----------------------------------------------------****************-----------------------------------------------------\\


  //----------------------------------------- Logic to handle state for enabling submit button -----------------------------------------\\ 

  // State ot manage the disabled button
  const [disabledButton, setDisabledButton] = useState(true);

  //UseEffect to manage the disable button state
  useEffect(() => {
    if (userSDetails.userName.trim() !== "" && userSDetails.email.trim() !== "" && userSDetails.email.includes("@") && userSDetails.password.trim() !== "" && userSDetails.password.length >= 4 && userSDetails.password === userSDetails.confirmPassword) {
      setDisabledButton(false)
    }
    else {
      setDisabledButton(true)
    }
  }, [userSDetails.email, userSDetails.password, userSDetails]);
  //-----------------------------------------------------****************-----------------------------------------------------\\


  //------------------------------------- Logic to handle submission of form  -------------------------------------\\

  // Function to handle on form submit
  const handleOnSubmit = async (e) => {
    // Prevent the default functionality of reloading the page upon submit
    e.preventDefault();

    try {
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
      // Check response is a success
      if (json.success) {
        // Save the auth token and redirect
        localStorage.setItem('signupToken', json.authToken);
        // console.log(localStorage)
        navigate("/login");// After successfull signup and token storing redirect the user to the login page
        showAlert("Sign up successful", "success"); // Display alert
      }
      else {
        showAlert("Unable to sign in", "danger"); // Display alert
        console.error({ Error: "Falied to sign in", Response: json })
      }
    }
    catch (e) {
      console.error("Error:", e.message); // Capture other than response errors
      showAlert("Unable to sign in", "danger");// Display error alert message
    }
    finally {
      setuserSDetails({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setDisabledButton(prev => (!prev));
    }
  }
  //-----------------------------------------------------****************-----------------------------------------------------\\


  //------------------------------------- Logic for text annimation for form placeholders -------------------------------------\\

  // State to to store the animated text for the form placeholders
  const [animationText, setanimationText] = useState({
    emailText: "",
    passwordText: ""
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
            }, 500);
          }
        }, interval);
      };
      startAnimation(); // start when component mounts
    }
    const emailText = "(must contain @ ....)";
    const passwordText = "(min 4 characters...)";
    animateText(emailText, "emailText", 200);
    animateText(passwordText, "passwordText", 200);
    // Optional cleanup
    return () => clearInterval(); // cleanup in case component unmounts
  }, []);
  //-----------------------------------------------------****************-----------------------------------------------------\\

  return (
    <div className="container p-4 border border-secondary" style={{ maxWidth: "30rem", }}>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="form-label">User name</label>
          <input type="userName" className="form-control" id="userName" name="userName" aria-describedby="userNameHelp" placeholder='Enter your user name' value={userSDetails.userName} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder={`Enter your email ${animationText.emailText}`} value={userSDetails.email} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' placeholder={`Enter your password ${animationText.passwordText}`} value={userSDetails.password} minLength={4} required onChange={handleOnChange} />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="confirmPassword" name='confirmPassword' placeholder={`Re-enter your password ${animationText.passwordText}`} value={userSDetails.confirmPassword} required onChange={handleOnChange} />
        </div>
        <button type="submit" className="btn btn-outline-danger my-2" disabled={disabledButton}>Submit</button>
      </form>
    </div>
  )
}
