// import React from 'react'
import { createBrowserRouter } from "react-router";
import App from './App';
import Home from "./dynamicComponents/Home";
import UserSignUp from "./dynamicComponents/UserSignUp";
import UserLogin from "./dynamicComponents/UserLogin";
import About from "./staticComponents/About";
import UserDetails from "./dynamicComponents/UserDetails";
import NoteStatus from "./dynamicComponents/NoteStatus";

const router = createBrowserRouter([
    {
        path: "/", 
        Component: App, // App will be the layout component
        children: [
            {
                index: true, // This will render Home component at the root path "/"
                Component: Home
            },
            {
                path: "signup",
                Component: UserSignUp
            },
            {
                path: "login",
                Component: UserLogin
            },
            {
                path: "about", // This will render About component at "/about"
                Component: About
            },
            {
                path: "user",
                Component: UserDetails
            },
            {
                path: "notestatus",
                Component: NoteStatus
            }
        ]
    },
]);


export { router };