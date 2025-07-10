import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router'
import ThemeContext from '../contexts/ThemeContext';
import AlertContext from '../contexts/AlertContext';

export default function Navbar() {
  // Destructing context values passed from the parent
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {showAlert} = useContext(AlertContext);

  // State for collapsed navbar (mobile version)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to change the state for collapsed navbar
  const collapsedNavbar = () => {
    setIsCollapsed(!isCollapsed);
  }

  // Function to handle the theme alert on click event
  const handleThemeAlert = () => {
    if(theme==="light")
    {
      showAlert("Light mode on !", "success");
    }
    else if(theme==="dark")
    {
      showAlert("Dark mode on !", "success");
    }
  }

  // Get the current url location
  let location = useLocation();

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${theme==="light"?"bg-warning-subtle":"bg-dark"} fixed-top`} data-bs-theme={theme === "light" ? "light" : "dark"} style={{ ...(theme === "light" ? {backgroundColor: "#e3f2fd", boxShadow: "0 10px 50px rgba(90, 90, 90, 0.6)" } : { boxShadow: "0 10px 50px rgba(167, 163, 163, 0.6)" }) }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">u-NoteBook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={collapsedNavbar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname==="/"?"active":""}`} aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname==="/about"?"active":""}`} to="/about">About</Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>

            {/*   Theme toggle button   */}
            <div className={`form-check form-switch ${theme === "light" ? "form-check-reverse" : ""} ${isCollapsed ? "float-start my-2" : "mx-2"}`}>
              <input className="form-check-input" type="checkbox" role="switch"
                id={`${theme === "light" ? "switchCheckReverse" : "switchCheckChecked"}`} onClick={() => { toggleTheme(theme); handleThemeAlert() }} />
              <label className="form-check-label" htmlFor={`${theme === "light" ? "switchCheckReverse" : "switchCheckChecked"}`}>
                {theme === "light" ? "Light" : "Dark"}</label>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
