import React from "react";
import { useNavigate } from "react-router-dom";

function Messages() {

    const navigate = useNavigate()

    return (
        <>
        <div className="App-title">
        <p style={{ color: "gold" }}> Messages</p>
        </div>
        <div>
            <button className="Intro-buttons" onClick={() => {navigate("/home");}}>Return Home</button>
        </div>
        </>
    )
}

export default Messages
