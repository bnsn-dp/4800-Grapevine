import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import GetSidebar from '../functions/display';

function Home() {
  const navigate = useNavigate();

  // Adding Search Bar Component
  const [searchTerm, setSearchTerm] = useState('');
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState([]);
  const [showPostBox, setShowPostBox] = useState(false);

  // State to hold user data
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '' });

  useEffect(() => {
    // Retrieve the user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // If user data exists in localStorage, set it to state
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const createPost = () => {
    setShowPostBox(true);
  };

  const confirmPost = () => {
    if (postText.trim() !== '') {
      setPosts([...posts, postText]);
      setPostText('');
      setShowPostBox(false);
    }
  };

  const cancelPost = () => {
    setPostText('');
    setShowPostBox(false);
  };

  return (
    <div className="App">

      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>

      <div className="App-content">
        <GetSidebar />
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
          
          <button className="create-post-button" onClick={createPost}>+</button>

          {showPostBox && (
            <div className="post-container">
              <textarea 
                value={postText} 
                onChange={(e) => setPostText(e.target.value)} 
                placeholder="Share your thoughts" 
                className="post-textbox" 
              />
              <button className="confirm-button" onClick={confirmPost}>Confirm</button>
              <button className="confirm-button" onClick={cancelPost}>Cancel</button>
            </div>
          )}
        </main>

        <div className="App-posts">
          <h2>Posts</h2>
          {posts.map((post, index) => (
            <div key={index} className="post">
              <p>{post}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;