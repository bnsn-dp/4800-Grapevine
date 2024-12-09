import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import '../Posts.css';
import { Link } from 'react-router-dom';

const CommunityPosts = ({ userID, communityID }) => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [showPostBox, setShowPostBox] = useState(false);
  const [imageLink, setImageLink] = useState('');
  const [description, setDescription] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [currentUserID, setUserID] = useState(userID)

  // Check if the user is a member
  const checkMembership = async () => {
    try {
      const response = await AxiosInstance.post('/api/is_member/', {
        userid: currentUserID,
        communityid: communityID,
      });
      setIsMember(response.data.isMember);
    } catch (error) {
      console.error('Error checking membership:', error);
      setIsMember(false);
    }
  };

  // Fetch community posts
  const fetchCommunityPosts = async () => {
    try {
      const response = await AxiosInstance.post('/api/get_community_posts/', { communityid: communityID });
      setCommunityPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
    }
  };

  useEffect(() => {
    if (communityID) {
      checkMembership();
      fetchCommunityPosts();
    }
  }, [communityID]);

  const refreshPosts = () => {
    if (communityID) fetchCommunityPosts();
  };

  // Toggle post creation box visibility
  const togglePostBox = () => {
    setShowPostBox(!showPostBox);
  };

  // Handle creating a post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (description.trim() !== '') {
      try {
        // Get Post ID
        const postIDResponse = await AxiosInstance.get('api/getpostid/');
        const postID = postIDResponse.data.genString;

        // Create post
        await AxiosInstance.post('posts/', {
          postid: postID,
          postdescription: description,
          imagelink: imageLink || null,
        });

        // Link post to community
        await AxiosInstance.post('/api/addCommunityPost/', {
          communityid: communityID,
          userid: userID,
          postid: postID,
        });

        // Clear form and hide dialog
        setImageLink('');
        setDescription('');
        setShowPostBox(false);
        refreshPosts();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  // Toggle like status for a post
  const handleLikeToggle = async (postId) => {
    const isLiked = userLikes[postId];
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

      setUserLikes((prev) => ({ ...prev, [postId]: !isLiked }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="posts-section">
      <div className="posts-header">
        <h2 className="trellis-heading">Community Posts</h2>
        {isMember && (
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

      <div className="App-posts" style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
        {communityPosts.length > 0 ? (
          communityPosts.map((post, index) => (
            <div key={index} className="post">
              <p>
                <strong>@</strong>
                <Link to={`/profile/${post.username}`} className="username-link">
                  {post.username}
                </Link>
              </p>
              {post.imagelink && (
                <p>
                  <strong>Image:</strong>
                  <img
                    src={post.imagelink}
                    alt="Post Image"
                    style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                  />
                </p>
              )}
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
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={250}
              rows={4}
              required
            ></textarea>
            <input
              type="text"
              placeholder="Image Link (optional)"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              maxLength={250}
            />
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

export default CommunityPosts;
