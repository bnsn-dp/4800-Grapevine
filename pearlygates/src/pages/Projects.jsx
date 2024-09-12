import React from "react";
import { useNavigate } from "react-router-dom";

function Projects() {

    const navigate = useNavigate()
    
    return (
        <>
        <div style={{ color: "black", fontSize: "14px" }}>
        <h1 style={{ color: "gold" }}>Our Current Projects</h1>
        <button onClick={() => {navigate("/");}}>Grapevine</button> < br/>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default Projects
