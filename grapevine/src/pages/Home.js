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

              <li><a href="#"onClick={(e) => {e.preventDefault(); navigate("/");}}>
                <img src="/icons/Home.png" alt="Home Icon" class="nav-icons"></img>
                Home
                </a></li>
              <li><a href="#"onClick={(e) => {e.preventDefault(); navigate("/messages");}}>
                <img src="/icons/Chat.png" alt="Chat Icon" class="nav-icons"></img>
                Messages
                </a></li>
                <li><a href="#"onClick={(e) => {e.preventDefault(); navigate("/profile");}}>
                <img src="/icons/Communities.png" alt="Community Icon" class="nav-icons"></img>
                Communities
                </a></li>
              <li><a href="#">
                <img src="/icons/Settings.png" alt="Setting Icon" class="nav-icons"></img>
                Settings
                </a></li>
            </ul>
          </nav>
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