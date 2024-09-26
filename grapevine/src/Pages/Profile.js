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

  const handleBioChange = (e) => {setNewBio(e.target.value);};

  return (
    <div>
      <img src="/SmiskiPFP.png" alt={`Mayela's profile`} />
      <h1>{user.name}</h1>
      <h2>@{user.username}</h2>
      
      <div>
        <h2>Bio</h2>
        {isEditing ? (
          <textarea value={newBio} onChange={handleBioChange}/>
        ) : (
          <p>{user.bio}</p>
        )}
        <button className='Intro-buttons' onClick={handleEditBio}>
          {isEditing ? 'Save' : 'Edit Bio'}
        </button>
      </div>

      <div>
        <h2>Friends</h2>
        <ul>
          {user.friends.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
      </div>

      <button className='Intro-buttons' onClick={() => navigate("/home")}>
        Return Home
      </button>
    </div>
  );
}

export default Profile;