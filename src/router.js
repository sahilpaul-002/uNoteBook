// import React from 'react'
import { createBrowserRouter } from "react-router";
import App from './App';
import Home from "./dynamicComponents/Home";
import UserSignUp from "./staticComponents/UserSignUp";
import UserLogin from "./staticComponents/UserLogin";
import About from "./staticComponents/About";

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
            }
        ]
    },
]);


export { router };