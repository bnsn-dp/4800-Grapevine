import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate()
  // Adding Search Bar Component
  const[searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="App">

      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>

      <div className="App-content">
      <aside className="App-sidebar">
      <nav>
        <ul>
          <h2 className="Sidebar-title">The Winery</h2>

          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>
              <img src="/icons/Home.png" alt="Home Icon" className="nav-icons" />
              Home
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/messages"); }}>
              <img src="/icons/Chat.png" alt="Chat Icon" className="nav-icons" />
              Messages
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/Communities"); }}>
              <img src="/icons/Communities.png" alt="Community Icon" className="nav-icons" />
              Communities
            </a>
          </li>
          <li>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <img src="/icons/Settings.png" alt="Setting Icon" className="nav-icons" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
      
      <a href="#" onClick={(e) => { e.preventDefault(); navigate("/profile"); }} className="user-info">
        <img src="/SmiskiPFP.png" alt="Profile Picture" className="profile-pic"/>
        <p className="user-name">Mayela</p>
          <p className="username">@mayela101</p>
      </a>

      </aside>
        <main className="App-main">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <p>Welcome to Grapevine!</p>
        </main>
      </div>
    </div>
  );
}

export default Home;