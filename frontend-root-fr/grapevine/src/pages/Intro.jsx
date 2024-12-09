import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Intro = () => {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleGoBackClick = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };

  return (
    <div className="Intro-content">
      <header className="App-header">
        <h1 className="App-title">Grapevine!</h1>
      </header>
        <div className="Intro-cushion">
          <button className="Intro-buttons" onClick={() => {navigate("/login");}}>Log In</button>
          <button className="Intro-buttons" onClick={() => {navigate("/signup");}}>Sign Up</button>
        </div>
    </div>
  );
};

export default Intro;