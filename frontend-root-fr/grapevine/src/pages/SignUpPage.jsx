import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';

const SignUpPage = () => {
  const defaultValues = {
    id: '',
    username: '',
    userpassword: '',
    status: 'Active',
    email: '',
    firstname: '',
    lastname: '',
  };

  const { handleSubmit, control } = useForm({ defaultValues });
  const navigate = useNavigate();

  const submission = (data) => {
    AxiosInstance.post('users/', {
      id: data.id,
      username: data.username,
      userpassword: data.userpassword,
      status: data.status,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
    })
    .then(() => {
      navigate("/");
    })
    .catch((error) => {
      console.error('Sign up failed', error);
    });
  };

  return (
    <form onSubmit={handleSubmit(submission)}>
      <div className='container'>
        <MyTextField label="ID" name="id" control={control} placeholder="ID" />
        <MyTextField label="First Name" name="firstname" control={control} placeholder="First Name" />
        <MyTextField label="Last Name" name="lastname" control={control} placeholder="Last Name" />
        <MyTextField label="Username" name="username" control={control} placeholder="Username" />
        <MyTextField label="Email" name="email" control={control} placeholder="Email Address" />
        <MyTextField label="Password" name="userpassword" control={control} placeholder="Enter User Password" />
        <button className="Intro-buttons" type="submit">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUpPage;