import React, { useContext } from 'react'
import ThemeContext from '../contexts/ThemeContext';

export default function Footer() {
    // Destructing context values passed from the parent
    const { theme }  = useContext(ThemeContext);
    
    return (
        <div className={`card mt-5 pt-2 ${theme==="light"?"bg-warning-subtle":"bg-black"}`} style={{...(theme==="light"?{color: "black"}:{color: "white"})}}>
            <div className="card-header text-center fw-bold">
                Organize. Focus. Achieve.
            </div>
            <div className="card-body">
                <figure className="text-center">
                    <blockquote className="blockquote">
                        <p>"Your thoughts, plans, and ideas — all in one place. Stay productive with uNoteBook."</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        Brought to you by <cite title="NewsScope Team">uNoteBook Team</cite>
                    </figcaption>
                </figure>
            </div>
        </div>
    )
}