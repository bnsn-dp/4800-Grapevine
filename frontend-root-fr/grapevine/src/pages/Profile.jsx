import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetSidebar from '../functions/display';
import GetPosts from '../functions/postFunctions';
import GetFriends from '../functions/Friends'; // Import the new GetFriends component
import AxiosInstance from '../Axios';
import '../App.css';
import '../Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '', bio: '' });
  const [currentUserID, setCurrentUserID] = useState(null);
  const [newBio, setNewBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchCurrentUserID = async () => {
    try {
      const currentUsername = JSON.parse(localStorage.getItem('user')).username;
      const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
      if (response.data.length > 0) {
        const userData = response.data[0];
        setUser((prevUser) => ({
          ...prevUser,
          bio: userData.bio,
          first_name: userData.firstname,
          last_name: userData.lastname,
          username: userData.username,
        }));
        setCurrentUserID(userData.id);
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchCurrentUserID();
    }
  }, []);

  useEffect(() => {
    if (user.bio) setNewBio(user.bio);
  }, [user.bio]);

  const handleBioChange = (e) => setNewBio(e.target.value);

  const handleSaveBio = async () => {
    try {
      await AxiosInstance.patch(`/users/${currentUserID}/`, { bio: newBio });
      setUser((prevUser) => ({ ...prevUser, bio: newBio }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>
      <div className="App-content">
        <GetSidebar />

        <div className="ProfilePage-details">
          <div className="ProfilePage-header">
            <img src="/SmiskiPFP.png" alt={`${user.first_name}'s profile`} className="ProfilePage-pic" />
            <div className="ProfilePage-text">
              <h1>{`${user.first_name}`}</h1>
              <h2>@{user.username}</h2>
            </div>
          </div>

          <div className="Profile-bio">
            <div className="Bio-header">
              <h2>Bio</h2>
              <button onClick={isEditing ? handleSaveBio : () => setIsEditing(true)} className="Bio-buttons">
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="Bio-content">
              {isEditing ? (
                <textarea
                  value={newBio}
                  onChange={handleBioChange}
                  maxLength={120}
                  placeholder="Enter your bio"
                />
              ) : (
                <p className="bio-text">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Use the new GetFriends component here */}
          <GetFriends userID={currentUserID} />

          {/* Display the PostsSection component below the Friends section */}
          <div className="profile-posts-container">
            <GetPosts userID={currentUserID} type="user" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
