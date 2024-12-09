// src/components/Home.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import GetSidebar from '../functions/display';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';
import GetPosts from '../functions/postFunctions';
import GetFriends from '../functions/Friends';

function Home() {
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showPostBox, setShowPostBox] = useState(false);
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '' });
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) {
      setUser(storedUser);
      fetchUserID(storedUser.username);
    }
  }, []);

  const fetchUserID = async (username) => {
    try {
      const response = await AxiosInstance.get(`/users/?username=${username}`);
      const userID = response.data[0]?.id;
      setUserID(userID);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const createPost = () => {
    setShowPostBox(true);
  };

//   const onSubmit = async (data) => {
//     const { imageLink, description } = data;
//     if (description.trim() !== '' && imageLink.trim() !== '') {
//       try {
//         const postIDResponse = await AxiosInstance.get('api/getpostid/');
//         const postID = postIDResponse.data.genString;
//
//         await AxiosInstance.post('posts/', {
//           postid: postID,
//           postdescription: description,
//           imagelink: imageLink,
//         });
//
//         const createdPostIDResponse = await AxiosInstance.get('api/getcreatedpostid/');
//         const createdPostID = createdPostIDResponse.data.genString;
//
//         await AxiosInstance.post('createdposts/', {
//           ucpid: createdPostID,
//           userid: userID,
//           postid: postID,
//         });
//
//         reset();
//         setShowPostBox(false);
//       } catch (error) {
//         console.error('Error creating post:', error);
//       }
//     }
//   };
//
//   const cancelPost = () => {
//     reset();
//     setShowPostBox(false);
//   };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>

      <div className="App-content">
        <GetSidebar />

        <main className="App-main">
          <div className="welcome-message">
            <p>Welcome back, <strong><em>{user.first_name}</em></strong>!</p>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Container to align GetPosts and GetFriends side by side */}
          <div className="content-container">
            <div className="posts-section">
              {/* Render PostsSection with Add Post button next to Refresh button */}
              <GetPosts userID={userID} type="all" onAddPost={createPost} />
            </div>

            <div className="friends-section">
              <GetFriends userID={userID} />
            </div>
          </div>

{/*           {showPostBox && ( */}
{/*             <form onSubmit={handleSubmit(onSubmit)}> */}
{/*               <div className="post-container"> */}
{/*                 <MyTextField */}
{/*                   label="Image Link" */}
{/*                   name="imageLink" */}
{/*                   control={control} */}
{/*                   placeholder="Enter image URL" */}
{/*                   maxLength={250} */}
{/*                 /> */}
{/*                 <MyTextField */}
{/*                   label="Description" */}
{/*                   name="description" */}
{/*                   control={control} */}
{/*                   placeholder="Enter description" */}
{/*                   multiline={true} */}
{/*                   rows={4} */}
{/*                   maxLength={250} */}
{/*                   resizable={true} */}
{/*                 /> */}
{/*                 <button className="confirm-button" type="submit">Confirm</button> */}
{/*                 <button className="confirm-button" type="button" onClick={cancelPost}>Cancel</button> */}
{/*               </div> */}
{/*             </form> */}
{/*           )} */}
        </main>
      </div>
    </div>
  );
}

export default Home;
