import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';

const LoginPage = () => {
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();

  const submission = (data) => {

    AxiosInstance.post('login/', {
      username: data.username,
      password: data.userpassword,
    })
    .then(() => {
      navigate("/home");
    })
    .catch((error) => {
      console.error('Login failed', error);
    });
  };

  return (
    <form onSubmit={handleSubmit(submission)}>
      <div className='container'>
        <MyTextField label="Username" name="username" control={control} placeholder="Username" />
        <MyTextField label="Password" name="userpassword" control={control} placeholder="Password" />
        <button onClick={() => {navigate("/home");}} className="Intro-buttons" type="submit">Log In</button>
      </div>
    </form>
  );
};

export default LoginPage;