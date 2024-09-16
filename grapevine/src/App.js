import React, { useState } from 'react';
import './App.css';


function App() {


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

              <li><a href="#">Home</a></li>
              <li><a href="#">Messages</a></li>
              <li><a href="#">Communities</a></li>
              <li><a href="#">Settings</a></li>

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

export default App;
