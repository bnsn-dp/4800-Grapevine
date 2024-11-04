// // GetFriends.js
// import React, { useEffect, useState } from 'react';
// import AxiosInstance from '../Axios';
// import '../App.css'
//
// const GetFriends = ({ userID }) => {
//   const [friends, setFriends] = useState([]);
//   const [friendStatus, setFriendStatus] = useState('');
//   const [searchUsername, setSearchUsername] = useState('');
//   const [searchResult, setSearchResult] = useState(null);
//   const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);
//   const [isRemoveFriendDialogOpen, setIsRemoveFriendDialogOpen] = useState(false);
//
//   // Fetch friends list
//   const fetchFriends = async (userid) => {
//     try {
//       const response = await AxiosInstance.get(`api/get_friends_list/?userid=${userid}`);
//       setFriends(response.data);
//     } catch (error) {
//       console.error('Error fetching friends list:', error);
//     }
//   };
//
//   useEffect(() => {
//     if (userID) {
//       fetchFriends(userID);
//     }
//   }, [userID]);
//
//   const handleSearchUser = async () => {
//     try {
//       const response = await AxiosInstance.get(`users/?username=${searchUsername}`);
//       if (response.data.length > 0) {
//         setSearchResult(response.data[0]);
//         setFriendStatus('');
//       } else {
//         setFriendStatus('User not found');
//         setSearchResult(null);
//       }
//     } catch (error) {
//       console.error('Error searching for user:', error);
//     }
//   };
//
//   const handleAddFriend = async () => {
//     if (searchResult) {
//       try {
//         const fidResponse = await AxiosInstance.get('api/getfriends/');
//         const f_id = fidResponse.data.genString;
//         await AxiosInstance.post(`/api/add_friend/`, {
//           fid: f_id,
//           user: userID,
//           friendee: searchResult.id,
//         });
//         setFriendStatus(`${searchResult.username} has been added as your friend.`);
//         fetchFriends(userID); // Refresh the friends list
//         setSearchUsername('');
//         setSearchResult(null);
//       } catch (error) {
//         console.error('Error adding friend:', error);
//       }
//     }
//   };
//
//   const handleRemoveFriend = async () => {
//     if (searchResult) {
//       try {
//         await AxiosInstance.post(`/api/remove_friend/`, {
//           user: userID,
//           friendee: searchResult.id,
//         });
//         setFriendStatus(`${searchResult.username} has been removed from your friends.`);
//         fetchFriends(userID); // Refresh the friends list
//         setSearchUsername('');
//         setSearchResult(null);
//       } catch (error) {
//         console.error('Error removing friend:', error);
//       }
//     }
//   };
//
//   const openAddFriendDialog = () => {
//     setIsFriendDialogOpen(true);
//     setIsRemoveFriendDialogOpen(false);
//     setSearchUsername('');
//     setFriendStatus('');
//     setSearchResult(null);
//   };
//
//   const openRemoveFriendDialog = () => {
//     setIsRemoveFriendDialogOpen(true);
//     setIsFriendDialogOpen(false);
//     setSearchUsername('');
//     setFriendStatus('');
//     setSearchResult(null);
//   };
//
//   return (
//     <div className="Profile-friends">
//       <div className="Friends-header">
//         <h2>Friends</h2>
//         <button onClick={openAddFriendDialog} className="Add-friend-button">Add Friends</button>
//         <button onClick={openRemoveFriendDialog} className="Remove-friend-button">Remove Friends</button>
//       </div>
//
//       <div className="Friends-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
//         {friends.length > 0 ? (
//           <ul>
//             {friends.map((friend) => (
//               <li key={friend.id}>{friend.first_name} {friend.last_name} @{friend.username}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No friends found.</p>
//         )}
//       </div>
//
//       {/* Dialog for Adding Friends */}
//       {isFriendDialogOpen && (
//         <div className="FriendDialog">
//           <h3>Search to add a friend by username</h3>
//           <input
//             type="text"
//             placeholder="Enter username"
//             value={searchUsername}
//             onChange={(e) => setSearchUsername(e.target.value)}
//           />
//           <button onClick={handleSearchUser}>Search</button>
//           {friendStatus && <p>{friendStatus}</p>}
//           {searchResult && (
//             <div>
//               <p>User found: {searchResult.username}</p>
//               <button onClick={handleAddFriend}>Add as Friend</button>
//             </div>
//           )}
//           <button onClick={() => setIsFriendDialogOpen(false)} className="close-button">Close</button>
//         </div>
//       )}
//
//       {/* Dialog for Removing Friends */}
//       {isRemoveFriendDialogOpen && (
//         <div className="FriendDialog">
//           <h3>Search for a friend to remove by username</h3>
//           <input
//             type="text"
//             placeholder="Enter username"
//             value={searchUsername}
//             onChange={(e) => setSearchUsername(e.target.value)}
//           />
//           <button onClick={handleSearchUser}>Search</button>
//           {friendStatus && <p>{friendStatus}</p>}
//           {searchResult && (
//             <div>
//               <p>Remove user: {searchResult.username}?</p>
//               <button onClick={handleRemoveFriend}>Remove Friend</button>
//             </div>
//           )}
//           <button onClick={() => setIsRemoveFriendDialogOpen(false)} className="close-button">Close</button>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default GetFriends;

// src/functions/GetFriends.js

import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import '../App.css';
import { Link } from 'react-router-dom';

const GetFriends = ({ userID }) => {
  const [friends, setFriends] = useState([]);
  const [friendStatus, setFriendStatus] = useState('');
  const [isFriendDialogOpen, setIsFriendDialogOpen] = useState(false);
  const [isRemoveFriendDialogOpen, setIsRemoveFriendDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null); // To store the friend selected for removal
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);

  // Fetch the current user's ID from local storage or another source
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      fetchCurrentUserID(); // Set current user's ID
    }
  }, []);

  const fetchCurrentUserID = async () => {
    try {
      const currentUsername = JSON.parse(localStorage.getItem('user')).username;
      const response = await AxiosInstance.get(`users/?username=${currentUsername}`);
      if (response.data.length > 0) {
        setCurrentUserID(response.data[0].id); // Set current user's ID
      }
    } catch (error) {
      console.error('Error fetching current user ID:', error);
    }
  };

  // Fetch friends list
  const fetchFriends = async (userid) => {
    try {
      const response = await AxiosInstance.get(`api/get_friends_list/?userid=${userid}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchFriends(userID);
    }
  }, [userID]);

  const handleSearchUser = async () => {
    try {
      const response = await AxiosInstance.get(`users/?username=${searchUsername}`);
      if (response.data.length > 0) {
        setSearchResult(response.data[0]);
        setFriendStatus('');
      } else {
        setFriendStatus('User not found');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching for user:', error);
    }
  };

  const handleAddFriend = async () => {
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
        fetchFriends(userID); // Refresh the friends list
        setSearchUsername('');
        setSearchResult(null);
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    }
  };

  const handleRemoveFriend = async () => {
    if (selectedFriend) {
      try {
        await AxiosInstance.post(`/api/remove_friend/`, {
          user: currentUserID,
          friendee: selectedFriend.id,
        });
        setFriendStatus(`${selectedFriend.username} has been removed from your friends.`);
        setIsRemoveFriendDialogOpen(false); // Close the dialog after removal
        fetchFriends(userID); // Refresh the friends list
      } catch (error) {
        console.error('Error removing friend:', error);
      }
    }
  };

  const openAddFriendDialog = () => {
    setIsFriendDialogOpen(true);
    setIsRemoveFriendDialogOpen(false);
    setSearchUsername('');
    setFriendStatus('');
    setSearchResult(null);
  };

  const openRemoveFriendDialog = (friend) => {
    setSelectedFriend(friend); // Set the selected friend to be removed
    setIsRemoveFriendDialogOpen(true);
    setFriendStatus('');
  };

  return (
    <div className="Profile-friends">
      <div className="Friends-header">
        <h2>Friends</h2>
        {currentUserID === userID && (
          <button onClick={openAddFriendDialog} className="Add-friend-button">Add Friends</button>
        )}
      </div>

      <div className="Friends-list" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc' }}>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} className="friend-item">
              {friend.first_name} {friend.last_name} @
                <Link to={`/profile/${friend.username}`} className="friend-username-link">
                  {friend.username}
                </Link>
                {currentUserID === userID && (
                  <button
                    onClick={() => openRemoveFriendDialog(friend)}
                    className="Remove-friend-button">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends found.</p>
        )}
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

      {/* Dialog for Confirming Friend Removal */}
      {isRemoveFriendDialogOpen && selectedFriend && (
        <div className="FriendDialog">
          <h3>Remove {selectedFriend.username} as a friend?</h3>
          <p>Are you sure you want to remove {selectedFriend.username} from your friends list?</p>
          {friendStatus && <p>{friendStatus}</p>}
          <button onClick={handleRemoveFriend} className="confirm-remove-button">Yes, Remove</button>
          <button onClick={() => setIsRemoveFriendDialogOpen(false)} className="close-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default GetFriends;