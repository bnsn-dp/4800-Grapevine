import React from "react";
import { useNavigate } from "react-router-dom";

function About() {

    const navigate = useNavigate()

    return (
        <>
        <div style={{ color: "black", fontSize: "20px" }}>
        <h1 style={{ color: "gold" }}>About Us</h1>
        Here at the Pearly Gates, we want to give you guys heavenly services.<br /> 
        Starting out of a class where we hardly knew each other, we found our common goal to achieve our dreams, money! <br />
        When you work with us, its a life sealing contract.
        </div>
        <div>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        </>
    )
}

export default About
