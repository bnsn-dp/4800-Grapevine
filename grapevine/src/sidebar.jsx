import React from 'react';
import { useNavigate } from 'react-router-dom';

function getSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="App-sidebar">
      <nav>
        <ul>
          <h2 className="Sidebar-title">The Winery</h2>

          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/profile"); }}>
              <img src="/icons/Communities.png" alt="Community Icon" className="nav-icons" />
              Communities
            </a>
          </li>
          <li>
            <a href="#">
              <img src="/icons/Settings.png" alt="Setting Icon" className="nav-icons" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default getSidebar;
