import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import GetSidebar from '../functions/display';
import AxiosInstance from '../Axios'; // Assuming AxiosInstance is configured for API calls
import MyTextField from '../forms/MyTextField'; // Assuming MyTextField is your custom text field component

function Messages() {
  const { handleSubmit, control, reset } = useForm(); // Initialize react-hook-form
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [conversation, setChat] = useState([]);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [newChat, setNewChat] = useState([]); // Store the created chat rooms
  const [currentUserID, setCurrentUserID] = useState(null); // Store the current user's ID

  const chatContainerRef = useRef(null); // Reference to the chat container

  // Fetch the current user ID based on their username from localStorage
  const fetchCurrentUserID = async () => {
    try {
      const currentUsername = JSON.parse(localStorage.getItem('user')).username;
      const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
      if (response.data.length > 0) {
        const userId = response.data[0].id;
        setCurrentUserID(userId); // Set the current user's ID
        fetchUserChatRooms(userId); // Fetch the chat rooms for this user
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  // Fetch chat rooms where the current user is either user1 or user2
  const fetchUserChatRooms = async (userId) => {
    try {
      const response = await AxiosInstance.get(`api/get_user_chatrooms/?user_id=${userId}`);
      const chatRooms = response.data;

      // Loop through the chat rooms and get the correct receiver
      const updatedChats = await Promise.all(
        chatRooms.map(async (chatRoom) => {
          // Determine the other user (receiver) based on the current user's ID
          const receiverId = chatRoom.user1 === userId ? chatRoom.user2 : chatRoom.user1;

          // Fetch the receiver's user object from the Users table
          const receiverResponse = await AxiosInstance.get(`users/${receiverId}`);
          const receiverFirstName = receiverResponse.data.firstname;

          return {
            id: chatRoom.crid, // Use the chat room ID
            receiver: receiverFirstName,  // Set the receiver's first name
          };
        })
      );

      setNewChat(updatedChats); // Update the state with the new chat rooms

    } catch (error) {
      console.error('Error fetching user chat rooms:', error);
    }
  };

  // Fetch messages for the selected chat room
  const fetchMessagesForChatRoom = async (chatRoomId) => {
    try {
      const response = await AxiosInstance.get(`/api/get_messages/?crid=${chatRoomId}`);
      const sortedMessages = response.data.sort((a, b) => new Date(a.sent) - new Date(b.sent)); // Sort by sent date
      setChat(sortedMessages);

      // Scroll to the bottom after messages are loaded
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages for chat room:', error);
    }
  };

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchCurrentUserID(); // Fetch the current user's ID and chat rooms on component mount
  }, []);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Handle sending a new message
  const onSubmit = async (data) => {
    if (!data.message) return; // If no message entered, do nothing

    try {
      // Fetch message ID from the backend
      const messageIdResponse = await AxiosInstance.get('api/getmessageid/');
      const messageId = messageIdResponse.data.genString;

      // Post the new message to the backend
      await AxiosInstance.post('message/', {
        mid: messageId,
        crid: selectedMessage.id, // Use the selected chat room ID
        sender: currentUserID,
        description: data.message,
      });

      // After sending the message, fetch updated messages
      fetchMessagesForChatRoom(selectedMessage.id);
      reset(); // Reset the input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle refreshing the current chat room
  const handleRefresh = () => {
    if (selectedMessage) {
      fetchMessagesForChatRoom(selectedMessage.id); // Re-fetch messages for the current chat room
    }
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
          <div className="Chats-header" style={{ display: 'flex', alignItems: 'center' }}>
            <h2 className="Messages-list-title">Chats</h2>
            {/* Plus button for creating a new chat */}
            <button
              className="create-chat-button"
              onClick={() => setShowCreateChat(true)}
              style={{
                padding: '10px',
                fontSize: '20px',
                cursor: 'pointer',
                marginLeft: '10px',
                backgroundColor: '#DCF8C6',  // Light green background
              }}
            >
              +
            </button>
            {/* Refresh button for reloading chat rooms */}
            <button
              className="refresh-chat-button"
              onClick={() => fetchUserChatRooms(currentUserID)}
              style={{
                padding: '10px',
                fontSize: '20px',
                cursor: 'pointer',
                marginLeft: '10px',
                backgroundColor: '#DAB1DA',  // Light purple background
              }}
            >
              &#x21bb; {/* Refresh icon */}
            </button>
          </div>

          <div className="Messages-list">
            <ul>
              {/* Display the user's chat rooms fetched from the backend */}
              {newChat.map((chatRoom) => (
                <li
                  key={chatRoom.id}
                  className="message-item"
                  onClick={() => {
                    setSelectedMessage(chatRoom);
                    fetchMessagesForChatRoom(chatRoom.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{chatRoom.receiver}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Section */}
        {selectedMessage && (
          <div className="Chat-section">
            <h2>{selectedMessage.receiver}</h2>

            {/* Scrollable chat window */}
            <div className="Chat-chat" ref={chatContainerRef} style={{ overflowY: 'scroll', maxHeight: '400px' }}>
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${msg.sender === currentUserID ? 'user-message' : 'receiver-message'}`}
                  style={{
                    textAlign: msg.sender === currentUserID ? 'right' : 'left',
                    margin: '10px 0',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: msg.sender === currentUserID ? '#DCF8C6' : '#DAB1DA',
                  }}
                >
                  <p>{msg.description}</p>
                  <small>{new Date(msg.sent).toLocaleString()}</small>
                </div>
              ))}
            </div>

            {/* Input for sending a new message */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', alignItems: 'center' }}>
              {/* No Controller wrapping needed, MyTextField already has it */}
              <MyTextField
                label="Type a message..."
                name="message"
                control={control}
                placeholder="Type a message..."
                maxLength={512}
                multiline={true}
                rows={2}
                resize={false} // Disable resizing
              />
              <button
                type="submit"
                style={{
                  marginLeft: '10px',
                  padding: '10px',
                  backgroundColor: '#DCF8C6',  // Light green background
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                style={{
                  marginLeft: '10px',
                  padding: '10px',
                  backgroundColor: '#DAB1DA',  // Light purple background
                  cursor: 'pointer'
                }}
              >
                &#x21bb; {/* Refresh icon */}
              </button>
            </form>
          </div>
        )}

        {/* Modal for creating new chat room */}
        {showCreateChat && (
          <div className="Create-chat-modal">
            {!foundUser ? (
              <div>
                <h3>Create New Chat</h3>
                <input
                  type="text"
                  placeholder="Search for a username..."
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
                <button onClick={handleSearchUser}>Search</button>
              </div>
            ) : (
              <div>
                <p>User found: {foundUser.firstname} {foundUser.lastname}</p>
                <button onClick={handleCancelCreateChat}>Cancel</button>
                <button onClick={handleCreateChatRoom}>Create Chat Room</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
