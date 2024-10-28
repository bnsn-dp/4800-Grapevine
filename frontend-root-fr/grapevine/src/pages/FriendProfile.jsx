import React, { useState, useEffect } from 'react';
import GetSidebar from '../functions/display';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../Axios'; 
import '../App.css';

function FriendProfile() {
  const { id } = useParams();  


  return (
      <div>
        <header className="App-header">
          <h1 className="App-title">Grapevine</h1>
        </header>
        <div className="App-content">
          <GetSidebar />
            </div>
          </div>
    );
}

export default FriendProfile;