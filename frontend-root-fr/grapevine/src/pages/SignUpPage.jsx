import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MyTextField from '../forms/MyTextField';
import AxiosInstance from '../Axios';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false); // To manage loading state for the ID generation

  const defaultValues = {
    id: '',  // This will be set by the generated string
    username: '',
    userpassword: '',
    status: 'Active',
    email: '',
    firstname: '',
    lastname: '',
  };

  const { handleSubmit, control, setValue } = useForm({ defaultValues });
  const navigate = useNavigate();

  // Fetch the generated string and then submit the form
  const submission = (data) => {
    setLoading(true); // Start loading
    // Fetch the generated string for the ID
    AxiosInstance.get('api/getuserid/')
      .then((response) => {
        const generatedId = response.data.genString;

        // Set the generated ID to the form data
        setValue('id', generatedId);

        // Now submit the form with the generated ID
        return AxiosInstance.post('users/', {
          id: generatedId,
          username: data.username,
          userpassword: data.userpassword,
          status: data.status,
          email: data.email,
          firstname: data.firstname,
          lastname: data.lastname,
        });
      })
      .then(() => {
        navigate("/");  // Redirect after successful submission
      })
      .catch((error) => {
        console.error('Sign up failed', error);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <form onSubmit={handleSubmit(submission)}>
      <div className='container'>
        <MyTextField label="First Name" name="firstname" control={control} placeholder="First Name" />
        <MyTextField label="Last Name" name="lastname" control={control} placeholder="Last Name" />
        <MyTextField label="Username" name="username" control={control} placeholder="Username" />
        <MyTextField label="Email" name="email" control={control} placeholder="Email Address" />
        <MyTextField label="Password" name="userpassword" control={control} placeholder="Enter User Password" />
        <button className="Intro-buttons" type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default SignUpPage;
