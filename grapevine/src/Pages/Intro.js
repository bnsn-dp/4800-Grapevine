import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the LoginPage
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the SignUpPage
  };

  return (
    <div className="Intro-content">
      <header className="App-header">
        <h1 className="App-title">Grapevine!</h1>
      </header>
      <div className="Intro-cushion">
        <button className="Intro-buttons" onClick={handleLoginClick}>Log In</button>
        <button className="Intro-buttons" onClick={handleSignUpClick}>Sign Up</button>
      </div>
    </div>
  );
};

export default IntroPage;
