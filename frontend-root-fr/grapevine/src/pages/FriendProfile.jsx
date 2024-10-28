import React, { useState, useEffect } from 'react';
import GetSidebar from '../functions/display';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../Axios';
import '../App.css';

function FriendProfile() {
  const { id } = useParams(); 
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '', bio: '' });
  const [loading, setLoading] = useState(true); 

  const fetchCurrentUserID = async () => {
    try {
      const currentUsername = JSON.parse(localStorage.getItem('user')).username;
      const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
      if (response.data.length > 0) {
        const userId = response.data[0].id;
        setCurrentUserID(userId); // Set the current user's ID
        }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };
  useEffect(() => {
    // Retrieve the user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // If user data exists in localStorage, set it to state
    if (storedUser) {
      setUser(storedUser);
      fetchCurrentUserID();  // Fetch user ID
    }
  }, []);
  const [newBio, setNewBio] = useState(user.bio);

  return (
    <div className="App">
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
              <div className="Bio-content">
              
              </div>
            </div>
          </div>


          </div>


          </div>
        </div>

  );
}

export default FriendProfile;
