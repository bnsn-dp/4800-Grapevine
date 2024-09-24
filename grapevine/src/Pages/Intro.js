import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
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
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5', textAlign: 'center'
    }}>
      <header className="App-header">
        <h1 className="App-title">Grapevine!</h1>
      </header>

      {!showLogin && !showSignUp ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={handleLoginClick}>Log In</button>

          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={handleSignUpClick}>Sign Up</button>
        </div>
      ) : showLogin ? (
        <div>
          <input type="text" placeholder="Username" />
          <br /><br />
          <input type="password" placeholder="Password" />
          <br /><br />
          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Confirm</button>

          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={handleGoBackClick}>Go Back</button>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <br /><br />
          <input type="text" placeholder="Username" />
          <br /><br />
          <input type="email" placeholder="Email" />
          <br /><br />
          <input type="password" placeholder="Password" />
          <br /><br />
          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Confirm</button>

          <button style={{
            padding: '10px 20px', margin: '0 10px', backgroundColor: '#105624',
            color: '#FAF9F6', border: '1px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
          }} onClick={handleGoBackClick}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default IntroPage;
