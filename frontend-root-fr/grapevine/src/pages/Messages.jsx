import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetSidebar from '../functions/display';

function Messages() {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);


  const messages = [
    { id: 1, sender: "Damian", text: "Mayela is the BEST teammate ever, projects are so much fun with her!" },
    { id: 2, sender: "Ryan", text: "I despise little freshmen who run around my dorm, those kids can ROT!!!!" },
    { id: 3, sender: "Benson", text: "I'm such a super chill CEO, don't you agree? BTW I'm signing your check tmr." },
    { id: 4, sender: "Nick", text: "Live Laugh Love Albertsons!! " },
    { id: 5, sender: "Canaan", text: "Hi guys, sorry I can't make it to class today :(" },
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
        <GetSidebar />
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