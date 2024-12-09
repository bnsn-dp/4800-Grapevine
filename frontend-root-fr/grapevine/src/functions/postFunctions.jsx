import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import '../Posts.css';
import { Link } from 'react-router-dom';

const GetPosts = ({ userID, type }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({}); // Stores the number of likes for each post
  const [userLikes, setUserLikes] = useState({}); // Tracks whether the user has liked each post
  const [showPostBox, setShowPostBox] = useState(false); // State to control dialog visibility
  const [imageLink, setImageLink] = useState(''); // State for image link
  const [description, setDescription] = useState(''); // State for description

  // Fetch posts
const fetchUserPosts = async (userId) => {
  try {
    const response = await AxiosInstance.post('/api/get_user_posts/', {
      userid: userId,
      type: type,
    });
    const posts = response.data.posts;

    setUserPosts(posts);

    // Fetch likes and user engagement for each post
    const likesMap = {};
    const userLikesMap = {};

    for (const post of posts) {
      // Fetch likes count
      const likesResponse = await AxiosInstance.post('/api/get_post_likes/', {
        postid: post.postid,
      });
      likesMap[post.postid] = likesResponse.data.likes;

      // Fetch user engagement for the post
      const engagementResponse = await AxiosInstance.post('/api/get_engagement/', {
        userid: userID,
        postid: post.postid,
      });

      const engagement = engagementResponse.data.engagement;
      userLikesMap[post.postid] = engagement ? engagement.engagementtype === 'Liked' : false;
    }

    setLikesCount(likesMap);
    setUserLikes(userLikesMap);
  } catch (error) {
    console.error('Error fetching user posts or likes:', error);
  }
};

  useEffect(() => {
    if (userID) fetchUserPosts(userID);
  }, [userID]);

  const refreshPosts = () => {
    if (userID) fetchUserPosts(userID);
  };

  // Toggle dialog visibility
  const togglePostBox = () => {
    setShowPostBox(!showPostBox);
  };

  // Handle form submission
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (description.trim() !== '' && imageLink.trim() !== '') {
      try {
        // Get Post ID
        const postIDResponse = await AxiosInstance.get('api/getpostid/');
        const postID = postIDResponse.data.genString;

        // Create post
        await AxiosInstance.post('posts/', {
          postid: postID,
          postdescription: description,
          imagelink: imageLink,
        });

        // Get CreatedPost ID
        const createdPostIDResponse = await AxiosInstance.get('api/getcreatedpostid/');
        const createdPostID = createdPostIDResponse.data.genString;

        // Associate created post with the user
        await AxiosInstance.post('createdposts/', {
          ucpid: createdPostID,
          userid: userID,
          postid: postID,
        });

        // Clear form and hide dialog
        setImageLink('');
        setDescription('');
        setShowPostBox(false);
        refreshPosts(); // Refresh posts list after creating new post
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleLikeToggle = async (postId) => {
    const isLiked = userLikes[postId]; // Check if the post is currently liked by the user
    try {
      if (isLiked) {
        // Remove like
        await AxiosInstance.post('/api/remove_engagement/', {
          userid: userID,
          postid: postId,
        });
        setLikesCount((prev) => ({ ...prev, [postId]: prev[postId] - 1 }));
      } else {
        // Add like
        const engagementIDResponse = await AxiosInstance.get('/api/getengagementid/');
        const engagementID = engagementIDResponse.data.genString;

        await AxiosInstance.post('/api/add_engagement/', {
          engagementid: engagementID,
          userid: userID,
          postid: postId,
        });
        setLikesCount((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }

      setUserLikes((prev) => ({ ...prev, [postId]: !isLiked })); // Toggle the liked state
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="posts-section">
      <div className="posts-header">
        {type === 'all' && <h2 className="trellis-heading">The Trellis</h2>}
        {type === 'all' && (
          <div className="post-controls">
            <button className="refresh-button" onClick={refreshPosts}>
              &#x21bb;
            </button>
            <button className="create-post-button" onClick={togglePostBox}>
              +
            </button>
          </div>
        )}
      </div>

      <div className="App-posts">
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <div key={index} className="post">
              <p>
                <strong>@</strong>
                <Link to={`/profile/${post.username}`} className="username-link">
                  {post.username}
                </Link>
              </p>
              <p>
                <strong>Image:</strong>
                {post.imagelink && (
                  <img
                    src={post.imagelink}
                    alt="Post Image"
                    style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                  />
                )}
              </p>
              <p>
                <strong>Description:</strong> {post.description}
              </p>
              <p>
                <strong>Posted on:</strong> {new Date(post.datetime).toLocaleString()}
              </p>
              <div className="like-section">
                <button
                  className={`like-button ${userLikes[post.postid] ? 'liked' : ''}`}
                  onClick={() => handleLikeToggle(post.postid)}
                >
                  👍
                </button>
                <span>{likesCount[post.postid] || 0} likes</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts to display.</p>
        )}
      </div>

      {/* Post Creation Modal */}
      {showPostBox && (
        <div className="post-modal">
          <form onSubmit={handleCreatePost} className="post-form">
            <h3>Create New Post</h3>
            <input
              type="text"
              placeholder="Image Link"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              maxLength={250}
              required
            />
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={250}
              rows={4}
              required
            ></textarea>
            <button type="submit" className="confirm-button">
              Confirm
            </button>
            <button type="button" onClick={togglePostBox} className="cancel-button">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GetPosts;
