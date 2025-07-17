import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router'
import ThemeContext from '../contexts/ThemeContext';
import AlertContext from '../contexts/AlertContext';
import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate(); //Instantiate the useNavigate hook from react router

  // Destructing context values passed from the parent
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showAlert } = useContext(AlertContext);

  // State for collapsed navbar (mobile version)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to change the state for collapsed navbar
  const collapsedNavbar = () => {
    setIsCollapsed(!isCollapsed);
  }

  // State to manage the on click event of the theme button
  const [themeButtonClicked, setThemeButtonClicked] = useState(false);

  const handleOnCLickThemeButton = () => {
    setThemeButtonClicked(prev => (!prev));
  }

  // UseEffect to handle the theme alert on change of theme state
  useEffect(() => {
    if (themeButtonClicked) {
      if (theme === "light") {
        showAlert("Light mode on !", "success");
      }
      else if (theme === "dark") {
        showAlert("Dark mode on !", "success");
      }

      setThemeButtonClicked(prev => (!prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme,themeButtonClicked]);

  // Get the current url location
  let location = useLocation();

  // Function to manage click event on log out
  const handleOnLogOut = () => {
    localStorage.removeItem("loginToken");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  }

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${theme === "light" ? "bg-warning-subtle" : "bg-black"} fixed-top`} data-bs-theme={theme === "light" ? "light" : "dark"} style={{ ...(theme === "light" ? { backgroundColor: "#e3f2fd", boxShadow: "0 10px 50px rgba(90, 90, 90, 0.6)" } : { boxShadow: "0 10px 50px rgba(0, 0, 0, 0.6)" }) }}>
        <div className="container-fluid">
          <img src={theme === "light" ? "/Images/BrandLogoBlack.png" : "/Images/BrandLogoWhite.png"} alt="Brand Logo" height="40" />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={collapsedNavbar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""} ${isCollapsed?"":"ms-3"}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>

            {/*   User details / Login / Sign up   */}
            {localStorage.getItem("loginToken") !== null ?
              <>
              {/*   User Details Page   */}
                <Link className={`${theme==="light"?"link-dark":"link-light"} link-opacity-50-hover link-underline-opacity-0 ${isCollapsed ? "float-start my-2 mx-2" : "ms-4 me-2"}`} aria-current="page" to="/user">
                  <i className="fa-solid fa-circle-user fa-2x"></i>
                </Link>
                <Link className={`${theme==="light"?"link-dark":"link-light"} link-opacity-50-hover link-underline-opacity-0 ${isCollapsed ? "float-start my-2 mx-2" : "ms-2 me-4"}`} aria-current="page" onClick={handleOnLogOut}>Log Out</Link> 
              </>    :
              <>
                <Link className={`${theme==="light"?location.pathname === "/signup"?"link-dark":"link-secondary":location.pathname === "/signup"?"link-light":"link-secondary"} link-opacity-50-hover link-underline-opacity-0 ${isCollapsed ? "float-start my-2 mx-2" : "ms-4 me-1"}`} aria-current="page" to="/signup">Sign Up</Link>
                <Link className={`${theme==="light"?location.pathname === "/login"?"link-dark":"link-secondary":location.pathname === "/login"?"link-light":"link-secondary"} link-opacity-50-hover link-underline-opacity-0 ${isCollapsed ? "float-start my-2 mx-2" : "ms-1 me-4"}`} aria-current="page" to="/login">Log In</Link>          
              </>
            }

            {/*   Theme toggle button   */}
            <div className={`form-check form-switch ${theme === "light" ? "form-check-reverse" : ""} ${isCollapsed ? "float-start my-2 mx-2" : "ms-1 me-2"}`}>
              <input className="form-check-input" type="checkbox" role="switch"
                id={`${theme === "light" ? "switchCheckReverse" : "switchCheckChecked"}`} onClick={() => { toggleTheme(theme); handleOnCLickThemeButton()}} />
              <label className="form-check-label" htmlFor={`${theme === "light" ? "switchCheckReverse" : "switchCheckChecked"}`}>
                {theme === "light" ? <i className="fa-regular fa-sun"></i> : <i className="fa-regular fa-moon"></i>}</label>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
