import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Messages() {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);


  const messages = [
    { id: 1, sender: "John", text: "Hey, how's it going? I hope you had a great day!" },
    { id: 2, sender: "Alice", text: "Don't forget the meeting tomorrow at 10 AM in the conference room." },
    { id: 3, sender: "Bob", text: "Let's grab lunch at that new sushi place downtown tomorrow." },
    { id: 4, sender: "Bob", text: "Let's grab lunch at that new sushi place downtown tomorrow." },
    { id: 5, sender: "Bob", text: "Let's grab lunch at that new sushi place downtown tomorrow." },
  ];


  const getMessagePreview = (text) => {
    const maxLength = 40;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
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
            <img src="/SmiskiPFP.png" alt="Profile Picture" className="profile-pic" />
            <p className="user-name">Mayela</p>
            <p className="username">@mayela101</p>
          </a>
        </aside>

        <div className="Messages-list-container">
          <h2 className="Messages-list-title">Chats</h2>
          <div className="Messages-list">
            <ul>
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="message-item"
                  onClick={() => setSelectedMessage(message)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{message.sender}</strong>
                  <p>{getMessagePreview(message.text)}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Messages;