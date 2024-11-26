import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import AxiosInstance from '../Axios';
import '../App.css';
import GetSidebar from '../functions/display';

function Communities() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [userCommunities, setUserCommunities] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [communityStatus, setCommunityStatus] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      fetchCurrentUserID();
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchCurrentUserID = async () => {
    try {
      const currentUsername = JSON.parse(localStorage.getItem('user')).username;
      const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
      if (response.data.length > 0) {
        setCurrentUserID(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  const fetchCommunities = async (userid) => {
    try {
      const response = await AxiosInstance.get(`/api/communities?user=${userid}`); // Update endpoint
      setUserCommunities(response.data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  useEffect(() => {
    if (currentUserID) {
      fetchCommunities(currentUserID);
    }
  }, [currentUserID]);

  const leaveCommunity = async (community) => {
    try {
      await AxiosInstance.post('/api/leave-community', { // Adjust endpoint
        user: currentUserID,
        community: community.id,
      });
      setCommunityStatus(`You have left ${community.name}.`);
      fetchCommunities(currentUserID);
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleAddCommunity = () => {
    navigate('/add-community'); // Navigate to the Add Community page
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
    
        <div className="Communities-body">
          <h2>Communities</h2>
          {userCommunities.length > 0 ? (
            userCommunities.map((community) => (
              <div key={community.id}>
                <h3>{community.name}</h3>
                <button onClick={() => leaveCommunity(community)}>Leave</button>
              </div>
            ))
          ) : (
            <p>[current communities' posts here]</p>
          )}
        </div>

        {communityStatus && <p>{communityStatus}</p>}

      </main>

      <aside className="Comm-sidebar">
      <h2>Your Communities</h2>
      <button onClick={handleAddCommunity} className="add-community-button">
        Add Community
      </button>
      <ul className="community-list">
        {userCommunities.map((community) => (
          <li key={community.id}>{community.name}</li>
        ))}
      </ul>
    </aside>
      </div>


    </div>
  );
}

export default Communities;
