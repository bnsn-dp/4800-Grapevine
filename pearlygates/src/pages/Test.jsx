import React from "react";
import { useNavigate } from "react-router-dom";

function Test() {

    const navigate = useNavigate()

    return (
        <>
        <div>
            <h1>Pearly Gates LLC Test Server</h1>
            <button onClick={() => {navigate("/");}}>Return Home</button>
        </div>
        <div>
            ------
        </div>
        <div>
            <button>Click to Display Data</button>
        </div>
        </>
    )
}

export default Test
