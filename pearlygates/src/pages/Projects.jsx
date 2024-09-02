import React from "react";
import { useNavigate } from "react-router-dom";

function Projects() {

    const navigate = useNavigate()
    
    return (
        <>
        <div>
        <h1>Our Current Projects</h1>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default Projects
