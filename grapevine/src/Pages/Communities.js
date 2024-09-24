import React from "react";
import { useNavigate } from "react-router-dom";

function Communities() {

    const navigate = useNavigate()

    return (
        <>
        <div>
        <h1 style={{ color: "gold" }}>Communities</h1>
            <button onClick={() => {navigate("/home");}}>Return Home</button>
        </div>
        </>
    )
}

export default Communities
