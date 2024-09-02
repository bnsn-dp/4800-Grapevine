import React from "react";
import { useNavigate } from "react-router-dom";

function About() {

    const navigate = useNavigate()

    return (
        <>
        <div>
        <h1>Pearly Gates LLC About Page</h1>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default About
