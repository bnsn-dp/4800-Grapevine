import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h1>Pearly Gates LLC</h1>
            <div style={{ padding: '10px', margin: '10px' }}>
            HOME PAGE
            </div>
            <div>
                <button onClick={() => {navigate("/projects");}}>Our Projects</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => {navigate("/test");}}>Test Database</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => {navigate("/about");}}>About Us</button>
            </div>
        </div>
    )
}

export default Home;
