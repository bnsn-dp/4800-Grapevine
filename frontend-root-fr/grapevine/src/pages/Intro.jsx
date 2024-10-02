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

      {!showLogin && !showSignUp ? (
        <div className="Intro-cushion">
          <button className="Intro-buttons" onClick={handleLoginClick}>Log In</button>
          <button className="Intro-buttons" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      ) : showLogin ? (
        <div className='container'>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button className="Intro-buttons" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Confirm</button>
          <button className="Intro-buttons" onClick={handleGoBackClick}>Go Back</button>
        </div>
      ) : (
        <div className='container'>
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="Intro-buttons" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Confirm</button>
          <button className="Intro-buttons" onClick={handleGoBackClick}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default Intro;