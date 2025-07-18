import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../contexts/AlertContext';
import ThemeContext from '../contexts/ThemeContext';
import LoadingBarContext from '../contexts/LoadingBarContext';

export default function UserDetails() {
    const HOST = "http://localhost:5000";

    // Destructing context values passed from the parent
    const { showAlert } = useContext(AlertContext);
    const { theme } = useContext(ThemeContext);
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
    const [userDetails, setUserDetails] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })


    //------------------------------------- Logic to handle onChange event for form placeholders -------------------------------------\\  

    // Functioon to manage the onChnage event for the form
    const handleOnChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    //-----------------------------------------------------****************-----------------------------------------------------\\


    //------------------------------------- Logic to handle state for enabling submit button -------------------------------------\\ 

    // State to manage the disabled button
    const [disabledButton, setDisabledButton] = useState(true);

    //UseEffect to manage the disable button state
    useEffect(() => {
        if (userDetails.userName.trim() !== "" && userDetails.email.trim() !== "" && userDetails.password.trim() !== "" && userDetails.email.includes("@") && userDetails.password.trim() >= 4 && userDetails.password === userDetails.confirmPassword) {
            setDisabledButton(false)
        }
        else {
            setDisabledButton(true)
        }
    }, [userDetails.email, userDetails.password, userDetails]);

    // State to store when edit is clicked
    const [editClicked, setEditClicked] = useState(false);

    // Function to manage the click event on the edit button
    const handleOnClickEdit = () => {
        setEditClicked(prev => (!prev));
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
            <form > {/* onSubmit={handleOnSubmit} */}
                <div className="mb-4">
                    <label htmlFor="name" className="form-label">User name</label>
                    <input type="name" className="form-control" id="name" name="name" aria-describedby="nameHelp" placeholder="Enter your user name" value={userDetails.userName} disabled={editClicked ? false : true} required onChange={handleOnChange} />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder={`Enter your email ${animationText.emailText}`} value={userDetails.email} disabled={editClicked ? false : true} required onChange={handleOnChange} />
                </div>
                {editClicked ?
                    <>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name='password' placeholder={`Enter your password ${animationText.passwordText}`} value={userDetails.password} disabled={editClicked ? false : true} minLength={4} required onChange={handleOnChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" name='confirmPassword' placeholder={`Re-enter your password ${animationText.passwordText}`} value={userDetails.confirmPassword} disabled={editClicked ? false : true} minLength={4} required onChange={handleOnChange} />
                        </div>
                    </> :
                    <></>
                }
                <button type="button" className={`btn ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"} my-2 me-2`} disabled={editClicked ? true : false} onClick={handleOnClickEdit}>Edit <i className="fa-solid fa-user-pen"></i></button>
                <button type="submit" className="btn btn-outline-danger my-2 ms-2" disabled={editClicked && userDetails.password.length > 3 ? false : true}>Update</button> {/* disabled={disabledButton} */}
            </form>
        </div>
    )
}
