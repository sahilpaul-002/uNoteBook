import React, { useState, useEffect, useContext } from 'react'
import { innerCardStyle } from "../Style";
import { bodyCardStyle } from "../Style";
import ThemeContext from '../contexts/ThemeContext';
import LoadingBarContext from '../contexts/LoadingBarContext';

export default function About() {

    // Destructing context values passed from the parent
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

    const aboutInfo = [
        {
            title: "📝 Personal Notes with Authentication",
            description: "A secure note-keeping app where users can sign up, log in, and manage their notes after authentication."
        },
        {
            title: "👤 User Profile Management",
            description: "Includes a user details page where users can view and edit their personal information like name and email."
        },
        {
            title: "➕ Add, Edit, and Delete Notes",
            description: "Users can create new notes, edit existing ones, or delete notes with ease."
        },
        {
            title: "🔖 Status Tracking for Notes",
            description: "Each note can be marked as Pending, In Progress, or Complete, allowing better organization."
        },
        {
            title: "📊 Drag-and-Drop Status Board",
            description: "A dedicated page displays notes in columns based on their status, where users can change the note status via simple drag-and-drop."
        }
    ];


    // State to track expansion of all cards at once
    const [expandAll, setExpandAll] = useState(false);

    // State for individual cards
    const [expandedCards, setExpandedCards] = useState(
        Object.fromEntries(aboutInfo.map((_, index) => [`card${index}`, false]))
    );

    // Toggle all cards
    const handleExpandAll = () => {
        const newExpandState = !expandAll;
        const updatedStates = Object.fromEntries(
            aboutInfo.map((_, index) => [`card${index}`, newExpandState])
        );
        setExpandAll(newExpandState);
        // setExpandAll(prev => !prev);
        setExpandedCards(updatedStates);
    };

    // Toggle individual cards
    const handleExpandCard = (cardKey) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardKey]: !prev[cardKey]
        }));
    };

    //Logic for smooth transition of expanding / collapsing of the cards
    const btnStyleCheck = () => {
        if (expandAll && (Object.values(expandedCards).every(Boolean) === false)) {
            return "btn btn-warning";
        }
        else if (expandAll || (Object.values(expandedCards).every(Boolean))) {
            return "btn btn-success";
        }
        else if (expandAll === false || (Object.values(expandedCards).every(Boolean) === false)) {
            return "btn btn-warning";
        }
    }
    //Logic for text of the button on expanding / collapsing of the cards
    const btnTextCheck = () => {
        if (expandAll === true && (Object.values(expandedCards).every(Boolean) === false)) {
            return "Expand All";
        }
        else if (expandAll || (Object.values(expandedCards).every(Boolean))) {
            return "Collapse All";
        }
        else if (expandAll === false || (Object.values(expandedCards).every(Boolean) === false)) {
            return "Expand All";
        }
    }

    // Change of state of expandAll in effect of the respective conditions
    useEffect(() => {
        const allExpanded = Object.values(expandedCards).every(Boolean);
        setExpandAll(allExpanded);
    }, [expandedCards]);

    return (
        <div className={`container mt-5 py-4 px-5 rounded ${theme === "light" ? "bg-warning-subtle" : "bg-dark"}`}>
            <h2 className="my-3">About Us</h2>
            <div className="accordion" id="accordionExample">

                {/* Cards */}
                {aboutInfo.map((item, index) => {
                    const cardKey = `card${index}`;
                    return (
                        <div key={cardKey} className="card my-1" style={innerCardStyle(theme)}>
                            <div className="card-header">
                                <h2 className="mb-1">
                                    <button
                                        className="btn btn-light"
                                        type="button"
                                        onClick={() => handleExpandCard(cardKey)}
                                        style={innerCardStyle(theme)}
                                    >
                                        {item.title}
                                    </button>
                                </h2>
                            </div>
                            {expandedCards[cardKey] && (
                                <div className="collapse show" style={bodyCardStyle(theme)}>
                                    <div className="card-body">
                                        {item.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Expand All Button */}
            <div className="container my-3">
                <button
                    type="button"
                    // className={expandAll || (expandedCards.card1 && expandedCards.card2 && expandedCards.card3) ? "btn btn-success" : "btn btn-warning"}
                    className={btnStyleCheck()}
                    onClick={handleExpandAll} >
                    {/* {expandAll || (expandedCards.card1 && expandedCards.card2 && expandedCards.card3) ? "Collapse All" : "Expand All"} */}
                    {btnTextCheck()}
                </button>
            </div>
        </div>
    );
}