import React from 'react';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';

// Fetch the user's ID by username
export const fetchUserID = async (username, setUserID, fetchUserPosts) => {
  try {
    const response = await AxiosInstance.get(`/users/?username=${username}`);
    const userID = response.data[0]?.id;
    setUserID(userID);
    if (userID) fetchUserPosts(userID);
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
};

// Fetch posts based on the user's ID
export const fetchUserPosts = async (userId, setUserPosts) => {
  try {
    const response = await AxiosInstance.post('/api/get_user_posts/', {
      userid: userId,
    });

    if (response.data.logs) {
      response.data.logs.forEach(log => {
        console.log(log);
      });
    }

    setUserPosts(response.data.posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
  }
};

export const createNewPost = async (data, userID, reset, setShowPostBox, fetchUserPosts) => {
  const { imageLink, description } = data;
  if (description.trim() !== '' && imageLink.trim() !== '') {
    try {
      const postIDResponse = await AxiosInstance.get('api/getpostid/');
      const postID = postIDResponse.data.genString;

      await AxiosInstance.post('posts/', {
        postid: postID,
        postdescription: description,
        imagelink: imageLink,
      });

      const createdPostIDResponse = await AxiosInstance.get('api/getcreatedpostid/');
      const createdPostID = createdPostIDResponse.data.genString;

      await AxiosInstance.post('createdposts/', {
        ucpid: createdPostID,
        userid: userID,
        postid: postID,
      });

      reset();
      setShowPostBox(false);
      fetchUserPosts(userID, setUserPosts);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }
};

export const CreatePostForm = ({ handleSubmit, onSubmit, control, cancelPost }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="post-container">
      <MyTextField
        label="Image Link"
        name="imageLink"
        control={control}
        placeholder="Enter image URL"
        maxLength={250}
      />
      <MyTextField
        label="Description"
        name="description"
        control={control}
        placeholder="Enter description"
        multiline={true}
        rows={4}
        maxLength={250}
        resizable={true}
      />
      <button className="confirm-button" type="submit">Confirm</button>
      <button className="confirm-button" type="button" onClick={cancelPost}>Cancel</button>
    </div>
  </form>
);