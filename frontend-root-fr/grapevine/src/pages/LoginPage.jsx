import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';

const LoginPage = () => {
  const { handleSubmit, control, setValue } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State to hold error message
  const defaultValues = {
    username: '',
    userpassword: '',
  };

  const submission = (data) => {
    // Clear any previous errors
    setError(null);

    AxiosInstance.post('api/login/', {
      username: data.username,
      userpassword: data.userpassword,
    })
    .then((response) => {
      if (response.data.status === 'success') {
        const { first_name, last_name, username } = response.data;

        // Store user information in localStorage
        localStorage.setItem('user', JSON.stringify({
          first_name,
          last_name,
          username
        }));
        navigate("/home");  // Redirect to home on successful login
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        setError('Username and/or password is incorrect');
      } else {
        setError('An error occurred during login');
      }
      console.error('Login failed', error);
    });
  };

  return (
    <div className="Login-content">
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>
      <form onSubmit={handleSubmit(submission)} className="login-form">
        <div className="container">
          <MyTextField label="Username" name="username" control={control} placeholder="Username" type="text" maxLength={45} />
          <MyTextField label="Password" name="userpassword" control={control} placeholder="Password" type="password" maxLength={45} />
          <button className="Login-buttons" type="submit">Log In</button>
          {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
