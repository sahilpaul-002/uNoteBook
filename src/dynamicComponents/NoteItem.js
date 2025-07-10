import React, {useContext} from 'react';
import ThemeContext from '../contexts/ThemeContext';

export default function NoteItem(props) {
    // Destructuring props from the parent 
    const { notes } = props;

    // Destructing context values passed from the parent
    const { theme } = useContext(ThemeContext);

    return (
        <div>
            {notes.map((note, idx) => {
                return (
                    <div class={`card text-bg-${theme==="dark"?"dark":"light"} mb-3`} style={{ maxWidth: "100%" }}>
                        <div class="card-header">
                            <h5>Title: {note.title}</h5>
                        </div>
                        <div class="card-body" style={{backgroundColor: 'transparent'}}>
                            <p class="card-text">{note.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
