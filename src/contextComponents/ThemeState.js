import { useState } from 'react';
import ThemeContext from '../contexts/ThemeContext'

export default function ThemeProvider(props) {
    // State to manage the theme
    const [theme, setTheme] = useState('light');

    // Function to toggle the theme
    const toggleTheme = (theme) => {
        if (theme === "light") {
            setTheme("dark");
            // Set the document body style
            document.body.style.backgroundColor = "#343a40"
            document.body.style.color = "white";
        }
        else if (theme === "dark") {
            setTheme("light");
            // Set the document body style
            document.body.style.backgroundColor = "#fefee3"
            document.body.style.color = "black";
        }
    }
    // Create a context value to be provided
    const value = { theme: theme, toggleTheme: toggleTheme };

    return <ThemeContext value={value}> {props.children} </ThemeContext>
}