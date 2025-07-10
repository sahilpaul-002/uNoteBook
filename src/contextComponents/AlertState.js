import React, { useState, useEffect } from 'react'
import AlertContext from '../contexts/AlertContext';

export default function AlertProvider(props) {
    // State to manage the alert
    const [alert, setAlert] = useState(null);

    // Function to display alert
    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        });
    };

    // Function to dismiss alert
    const dismissAlert = () => {
        setAlert(null);
    }

    // Auto dismiss alert display logic in useEffect
    useEffect(() => {
        if (alert !== null) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 4000);

            // CLeanup timeout alert changes or component unmounts
            return () => clearTimeout(timer);
        };
    }, [alert]);

    const value = { alert: alert, showAlert: showAlert, dismissAlert: dismissAlert }

    return <AlertContext value={value}>{props.children}</AlertContext>
}
