import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import GetSidebar from '../functions/display';

function Profile() {
  const navigate = useNavigate();

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


  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(user.bio);

  const handleEditBio = () => {
    if (isEditing) {
      setUser({ ...user, bio: newBio });
    }
    setIsEditing(!isEditing);
  };

  const handleBioChange = (e) => setNewBio(e.target.value);

  return (
    <div>
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>
      <div className="App-content">
        <GetSidebar />  
        <div className="ProfilePage-details">
          <div className="ProfilePage-header">
            <img src="/SmiskiPFP.png" alt={`Mayela's profile`} className="ProfilePage-pic" />
            <div className="ProfilePage-text">
              <h1>{`${user.first_name}`}</h1>
              <h2>@{user.username}</h2>
            </div>
          </div>

          <div className="Profile-bio">
            <div className="Bio-header">
              <h2>Bio</h2>
            </div>

            <div className="Bio-content" onClick={handleEditBio} style={{ cursor: 'pointer' }}>
              {isEditing ? (
                <textarea value={newBio} onChange={handleBioChange} />
              ) : (
                <p>{user.bio}</p>
              )}
              {isEditing && (
                <button className="Bio-buttons" onClick={handleEditBio}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;