import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate()

    return (
        <>
        <div>
        <h1 style={{ color: "gold" }}>Communities</h1>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default Profile
