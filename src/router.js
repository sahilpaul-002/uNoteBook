// import React from 'react'
import { createBrowserRouter } from "react-router";
import App from './App';
import Home from "./dynamicComponents/Home";
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
                path: "about", // This will render About component at "/about"
                Component: About
            }
        ]
    },
]);


export { router };