import React, { useState } from 'react'
import LoadingBarContext from '../contexts/LoadingBarContext'
import LoadingBar from "react-top-loading-bar";

export default function LoadingBarProvider(props) {
    // State to store the loading progress bar animation
    const [progress, setProgress] = useState(1);

    const value = { progress, setProgress };
    return (<LoadingBarContext value={value}>
        {/* Render the actual loading bar */}
        <LoadingBar
            color="red"
            height={"3px"}
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
        />
        {props.children}
    </LoadingBarContext>
    )
}
