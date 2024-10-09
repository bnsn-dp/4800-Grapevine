import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import GetSidebar from '../functions/display';
import MyTextField from '../forms/MyTextField'; // Import your MyTextField component
import AxiosInstance from '../Axios'; // Assuming AxiosInstance is configured for API calls

function Home() {
  const { handleSubmit, control, reset } = useForm(); // Initialize useForm
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [showPostBox, setShowPostBox] = useState(false);
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '' });
  const [userID, setUserID] = useState(null); // Store the user's ID
  const [userPosts, setUserPosts] = useState([]); // State to store user posts

  // Fetch user data from localStorage and get user posts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) {
      setUser(storedUser);
      fetchUserID(storedUser.username); // Fetch the user's ID based on the username
    }
  }, []);

  // Fetch the user's ID using the username
  const fetchUserID = async (username) => {
    try {
      const response = await AxiosInstance.get(`/users/?username=${username}`);
      const userID = response.data[0]?.id; // Get the user ID from the response
      setUserID(userID);
      fetchUserPosts(userID); // Fetch posts after getting the user ID
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch user posts from backend using a POST request
  const fetchUserPosts = async (userId) => {
    try {
        const response = await AxiosInstance.post('/api/get_user_posts/', {
            userid: userId,
        });

        if (response.data.logs) {
            // Log the messages from the server in the browser console
            response.data.logs.forEach(log => {
                console.log(log);
            });
        }

        setUserPosts(response.data.posts); // Set the posts data into state
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const createPost = () => {
    setShowPostBox(true);
  };

  const onSubmit = async (data) => {
    const { imageLink, description } = data;
    if (description.trim() !== '' && imageLink.trim() !== '') {
      try {
        // 1. Get Post ID by calling the GetPostID endpoint
        const postIDResponse = await AxiosInstance.get('api/getpostid/');
        const postID = postIDResponse.data.genString;

        // 2. Send the Post data to the Posts table
        await AxiosInstance.post('posts/', {
          postid: postID,
          postdescription: description,
          imagelink: imageLink,
        });

        // 3. Get the CreatedPost ID by calling the GetCreatedPostID endpoint
        const createdPostIDResponse = await AxiosInstance.get('api/getcreatedpostid/');
        const createdPostID = createdPostIDResponse.data.genString;

        // 4. Send the CreatedPost data to the CreatedPosts table
        await AxiosInstance.post('createdposts/', {
          ucpid: createdPostID,
          userid: userID,  // Use the fetched user ID
          postid: postID,
        });

        // Reset the form and hide the post box
        reset();
        setShowPostBox(false);
        fetchUserPosts(userID); // Fetch updated user posts after submission
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const cancelPost = () => {
    reset();
    setShowPostBox(false);
  };

  // Add a refresh function to fetch posts again when the button is clicked
  const refreshPosts = () => {
    if (userID) {
      fetchUserPosts(userID); // Fetch posts when the refresh button is clicked
    }
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
          <p>Welcome to Grapevine!</p>

          <button className="create-post-button" onClick={createPost}>+</button>

          {showPostBox && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="post-container">
                {/* MyTextField for Image Link */}
                <MyTextField
                  label="Image Link"
                  name="imageLink"
                  control={control} // Passing control prop
                  placeholder="Enter image URL"
                  maxLength={250}
                />
                {/* MyTextField for Description */}
                <MyTextField
                  label="Description"
                  name="description"
                  control={control} // Passing control prop
                  placeholder="Enter description"
                  multiline={true}
                  rows={4}
                  maxLength={250}
                />
                <button className="confirm-button" type="submit">Confirm</button>
                <button className="confirm-button" type="button" onClick={cancelPost}>Cancel</button>
              </div>
            </form>
          )}
        </main>

        <div className="App-posts">
          <div className="posts-header">
            <h2>Your Posts</h2>
            <button className="refresh-button" onClick={refreshPosts}>Refresh</button>
          </div>

          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <div key={index} className="post">
                <p><strong>@</strong> {post.username}</p>
                <p><strong>Image:</strong> <a href={post.imagelink} target="_blank" rel="noopener noreferrer">{post.imagelink}</a></p>
                <p><strong>Description:</strong> {post.description}</p>
                <p><strong>Posted on:</strong> {post.datetime}</p>
              </div>
            ))
          ) : (
            <p>No posts to display.</p>  // In case there are no posts yet
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
