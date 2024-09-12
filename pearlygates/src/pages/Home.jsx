import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div>
                <button onClick={() => {navigate("/projects");}}>Our Projects</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => {navigate("/test");}}>Test Database</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => {navigate("/about");}}>About Us</button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => {navigate("/logs");}}>Meeting Logs</button>
            </div>
        </div>
    )
}

export default Home;
