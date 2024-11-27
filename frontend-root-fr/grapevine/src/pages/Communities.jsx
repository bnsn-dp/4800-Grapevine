import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../Axios';
import '../App.css';
import GetSidebar from '../functions/display';

function Communities() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [userCommunities, setUserCommunities] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [communityStatus, setCommunityStatus] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityPrivacy, setNewCommunityPrivacy] = useState('Public');

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
      const response = await AxiosInstance.get(`/api/communities?user=${userid}`);
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
      await AxiosInstance.post('/api/leave-community', {
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
    setShowAddPopup(true);
  };

  const handleCancel = () => {
    setShowAddPopup(false);
    setNewCommunityName('');
    setNewCommunityPrivacy('Public');
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();  // Prevent the default form submission
    try {
      const newCommunity = {
        name: newCommunityName,
        privacy: newCommunityPrivacy,
        user: currentUserID,
      };

      // Make the API call to create the community
      const response = await AxiosInstance.post('/api/create-community', newCommunity);
      const createdCommunity = response.data;

      // Add the newly created community to the list of user communities
      setUserCommunities([...userCommunities, createdCommunity]);

      // Close the pop-up
      setShowAddPopup(false);

      // Navigate to the new community page
      navigate(`/communities/${encodeURIComponent(newCommunityName)}`);
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleCommunityClick = (communityName) => {
    navigate(`/communities/${encodeURIComponent(communityName)}`);
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
                  <h3>
                    <button
                      onClick={() => handleCommunityClick(community.name)}
                      className="community-link"
                    >
                      {community.name}
                    </button>
                  </h3>
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
              <li key={community.id}>
                <button
                  onClick={() => handleCommunityClick(community.name)}
                  className="community-link"
                >
                  {community.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {showAddPopup && (
        <div className="post-modal">
          <form
            onSubmit={handleCreateCommunity}
            className="post-form"
          >
            <h3>Create New Community</h3>
            <input
              type="text"
              placeholder="Community Name"
              value={newCommunityName}
              onChange={(e) => setNewCommunityName(e.target.value)}
              maxLength={50}
              required
            />
            <div className="privacy-options">
              <label>
                <input
                  type="radio"
                  name="privacy"
                  value="Public"
                  checked={newCommunityPrivacy === 'Public'}
                  onChange={(e) => setNewCommunityPrivacy(e.target.value)}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  name="privacy"
                  value="Private"
                  checked={newCommunityPrivacy === 'Private'}
                  onChange={(e) => setNewCommunityPrivacy(e.target.value)}
                />
                Private
              </label>
            </div>
            <button type="submit" className="confirm-button">
              Create
            </button>
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Communities;