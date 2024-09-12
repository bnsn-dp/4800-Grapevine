import React from "react";
import { useNavigate } from "react-router-dom";

function Logs() {

    const navigate = useNavigate()
    
    return (
        <>
        <div>
        <h1 style={{ color: "gold" }}>SCRUM Logs</h1>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default Logs
