import React from "react";
import { useNavigate } from "react-router-dom";

function Messages() {

    const navigate = useNavigate()

    return (
        <>
        <div style={{ color: "black", fontSize: "20px" }}>
        <h1 style={{ color: "gold" }}> Messages</h1>
        </div>
        <div>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default Messages
