import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetSidebar from '../functions/display';
import AxiosInstance from '../Axios';  // Assuming AxiosInstance is your configured Axios
import '../App.css';
function Profile() {
  const navigate = useNavigate();

  // State to hold user data
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '' });
  const [friends, setFriends] = useState([]);  // State to hold the list of friends
  const [searchUsername, setSearchUsername] = useState('');  // Username being searched for
  const [searchResult, setSearchResult] = useState(null);  // Search result for adding a friend
  const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);  // Dialog state
  const [friendStatus, setFriendStatus] = useState('');  // Status message in the dialog
  const [currentUserID, setCurrentUserID] = useState(null); // Store the current user's ID
  const [isRemoveFriendDialogOpen, setIsRemoveFriendDialogOpen] = useState(false);  // Remove Friend Dialog state

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


  // Fetch the current profile's friends from the database
const fetchFriends = async (userid) => {
  try {
    // Make a GET request to fetch friends via user ID
    const response = await AxiosInstance.get(`api/get_friends_list/?userid=${userid}`);

    // Set the friends list based on the response, which should contain first and last names
    setFriends(response.data);
  } catch (error) {
    console.error('Error fetching friends list:', error);
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

  // Use a separate useEffect to watch for changes to currentUserID and call fetchFriends only when currentUserID is available
  useEffect(() => {
    if (currentUserID) {
      fetchFriends(currentUserID);  // Fetch friends after the currentUserID is set
    }
  }, [currentUserID]);
  // Handle searching for a friend by username
  const handleSearchUser = async () => {
    try {
      const response = await AxiosInstance.get(`users/?username=${searchUsername}`);
      if (response.data.length > 0) {
        const foundUser = response.data[0];
        checkFriendshipStatus(foundUser);
      } else {
        setFriendStatus('User not found');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching for user:', error);
    }
  };

  // Check if the found user is already a friend
  const checkFriendshipStatus = async (foundUser) => {
    try {
      const response = await AxiosInstance.get(`api/check_friendship_status/?userid=${currentUserID}&friendee=${foundUser.id}`);
      if (response.data.status == 'friend' && isRemoveFriendDialogOpen == false) {
        setFriendStatus(`${foundUser.username} is already your friend.`);
      } else {
        setFriendStatus('');
        setSearchResult(foundUser);  // User can be added as a friend
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  // Handle adding a friend
  const handleAddFriend = async () => {
    fetchCurrentUserID();
    if (searchResult) {
      try {
      const fidResponse = await AxiosInstance.get('api/getfriends/');
      const f_id = fidResponse.data.genString;
        await AxiosInstance.post(`/api/add_friend/`, {
          fid: f_id,
          user: currentUserID,
          friendee: searchResult.id,
        });
        setFriendStatus(`${searchResult.username} has been added as your friend.`);
        fetchFriends(currentUserID);  // Refresh the friends list
        setSearchUsername('');
        setSearchResult(null);
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    }
  };

// Handle removing a friend
  const handleRemoveFriend = async () => {
    fetchCurrentUserID();
    if (searchResult) {
      try {
        await AxiosInstance.post(`/api/remove_friend/`, {
          user: currentUserID,
          friendee: searchResult.id,
        });
        setFriendStatus(`${searchResult.username} has been removed from your friends.`);
        setSearchUsername('');
        fetchFriends(currentUserID);  // Refresh the friends list
        setSearchResult(null);
      } catch (error) {
        console.error('Error removing friend:', error);
      }
    }
  };

  // Toggles the add friend dialog and closes remove friend dialog if it's open
  const openAddFriendDialog = () => {
    setIsFriendDialogOpen(true);
    setIsRemoveFriendDialogOpen(false);  // Close remove friend dialog if open
    setSearchUsername('');  // Clear the search input
    setFriendStatus('');  // Clear status message
    setSearchResult(null);  // Clear search results
  };

  // Toggles the remove friend dialog and closes add friend dialog if it's open
  const openRemoveFriendDialog = () => {
    setIsRemoveFriendDialogOpen(true);
    setIsFriendDialogOpen(false);  // Close add friend dialog if open
    setSearchUsername('');  // Clear the search input
    setFriendStatus('');  // Clear status message
    setSearchResult(null);  // Clear search results
  };

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

        {/* Profile Details */}
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

            {/* Friends List Section */}
            <div className="Profile-friends">
              <div className="Friends-header">
                <h2>Friends</h2>
                {/* Add Friend button */}
                <button onClick={openAddFriendDialog} className="Add-friend-button">
                  Add Friends
                </button>
                {/* Remove Friend button */}
                <button onClick={openRemoveFriendDialog} className="Remove-friend-button">
                  Remove Friends
                </button>
              </div>

              {/* Scrollable Friends List */}
              <div className="Friends-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
                {friends.length > 0 ? (
                  <ul>
                    {friends.map((friend) => (
                      <li key={friend.id}>{friend.first_name} {friend.last_name} @{friend.username}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No friends found.</p>
                )}
              </div>
            </div>

            {/* Dialog for Adding Friends */}
            {isFriendDialogOpen && (
              <div className="FriendDialog">
                <h3>Search to add a friend by username</h3>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
                <button onClick={handleSearchUser}>Search</button>
                {friendStatus && <p>{friendStatus}</p>}
                {searchResult && (
                  <div>
                    <p>User found: {searchResult.username}</p>
                    <button onClick={handleAddFriend}>Add as Friend</button>
                  </div>
                )}
                <button onClick={() => setIsFriendDialogOpen(false)} className="close-button">Close</button>
              </div>
            )}

            {/* Dialog for Removing Friends */}
            {isRemoveFriendDialogOpen && (
              <div className="FriendDialog">
                <h3>Search for a friend to remove by username</h3>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
                <button onClick={handleSearchUser}>Search</button>
                {friendStatus && <p>{friendStatus}</p>}
                {searchResult && (
                  <div>
                    <p>Remove user: {searchResult.username}?</p>
                    <button onClick={handleRemoveFriend}>Remove Friend</button>
                  </div>
                )}
                <button onClick={() => setIsRemoveFriendDialogOpen(false)} className="close-button">Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;