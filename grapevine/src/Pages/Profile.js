import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Profile() {

const navigate = useNavigate()

return (
    <>
    <div>
    <h1 style={{ color: "gold" }}>Profile Page</h1>
        <button onClick={() => {navigate("/home");}}>Return Home</button>
    </div>
    </>
)

}

export default Profile