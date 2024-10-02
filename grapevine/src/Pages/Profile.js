import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: 'Mayela',
    username: 'mayela101',
    bio: 'DAMIAN IS THE GOAT (bc Mayela would totally say this)',
    friends: ['Damian', 'Benson', 'Nick', 'Canaan', 'Ryan']
  });

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

        <div className="ProfilePage-details">
          <div className="ProfilePage-header">
            <img src="/SmiskiPFP.png" alt={`Mayela's profile`} className="ProfilePage-pic" />
            <div className="ProfilePage-text">
              <h1>{user.name}</h1>
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
