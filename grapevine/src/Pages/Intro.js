import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form'
import MyTextField from '../forms/MyTextField'
import AxiosInstance from '../Axios'

    const IntroPage = () => {
    const defaultValues = {
    id: '',
    username : '',
    userpassword : '',
    status : 'Active',
    email : '',
    firstname: '',
    lastname : '',
    }

    const {handleSubmit, reset, setValue, control} = useForm({defaultValues:defaultValues})
    const submission = (data) =>
    {
        AxiosInstance.post('users/',{
            id: data.id,
            username: data.username,
            userpassword: data.userpassword,
            status: data.status,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,


        })
    }

  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleGoBackClick = () => {
    setShowLogin(false);
    setShowSignUp(false);
  };

  return (
    <form onSubmit={handleSubmit(submission)}>
    <div className="Intro-content">
      <header className="App-header">
        <h1 className="App-title">Grapevine!</h1>
      </header>

      {!showLogin && !showSignUp ? (
        <div className="Intro-cushion">
          <button className="Intro-buttons" onClick={handleLoginClick}>Log In</button>
          <button className="Intro-buttons" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      ) : showLogin ? (
        <div className='container'>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button className="Intro-buttons" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Confirm</button>
          <button className="Intro-buttons" onClick={handleGoBackClick}>Go Back</button>
        </div>
      ) : (
        <div className='container'>
               <MyTextField label ="ID" name="id" control={control} placeholder="ID"/>
               <MyTextField label ="First Name" name="firstname" control={control} placeholder="First Name"/>
               <MyTextField label ="Last Name" name="lastname" control={control} placeholder="Last Name"/>
               <MyTextField label ="Username" name="username" control={control} placeholder="Username"/>
               <MyTextField label ="Email" name="email" control={control} placeholder="Email Address"/>
               <MyTextField label ="Password" name="userpassword" control={control} placeholder="Enter User Password"/>
              <button className="Intro-buttons" variant="contained" type="submit">Confirm</button>
              <button className="Intro-buttons" onClick={handleGoBackClick}>Go Back</button>

        </div>
      )}
    </div>
    </form>
  );
};

export default IntroPage;
