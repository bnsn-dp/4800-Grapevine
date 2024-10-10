import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetSidebar from '../functions/display';

function Messages() {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setChat] = useState([]);

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

  const handleSendMessage = () => {
    if (userMessage.trim() == '') return; // Checks for empty message
    const newMessage = { id: Date.now(), sender: "You", text: userMessage };
    setChat([...conversation, newMessage]); 
    setUserMessage(''); //Clear
  };

  return (
    <div>
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>
      <div className="App-content">
        <GetSidebar />

        {/* Chat List */}
        <div className="Messages-list-container">
          <h2 className="Messages-list-title">Chats</h2>
          <div className="Messages-list">
            <ul>
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="message-item"
                  onClick={() => {
                    setSelectedMessage(message);
                    setChat([{ sender: message.sender, text: message.text }]);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{message.sender}</strong>
                  <p>{getMessagePreview(message.text)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Section */}
        {selectedMessage && (
          <div className="Chat-section">
            <h2>{selectedMessage.sender}</h2>
            <div className="Chat-chat">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${msg.sender === 'You' ? 'user-message' : 'sender-message'}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>


            <div className="Chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Messages;
