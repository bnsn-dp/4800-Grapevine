import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const GetSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: '', last_name: '', username: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const NavItem = ({ href, iconSrc, altText, text }) => (
    <li>
      <a href="#" onClick={(e) => { e.preventDefault(); navigate(href); }}>
        <img src={iconSrc} alt={altText} className="nav-icons" />
        {text}
      </a>
    </li>
  );

  const SidebarContent = () => (
    <aside className="App-sidebar">
      <nav>
        <ul>
          <h2 className="Sidebar-title">Dashboard</h2>
          <NavItem href="/home" iconSrc="/icons/Home.png" altText="Home Icon" text="Home" />
          <NavItem href="/messages" iconSrc="/icons/Chat.png" altText="Chat Icon" text="Messages" />
          <NavItem href="/Communities/overview" iconSrc="/icons/Communities.png" altText="Community Icon" text="Communities" />
{/*           <NavItem href="/" iconSrc="/icons/Settings.png" altText="Setting Icon" text="Settings" /> */}
        </ul>
      </nav>

      <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/profile/${user.username}`); }} className="user-info">
        <img src="/SmiskiPFP.png" alt="Profile Picture" className="profile-pic" />
        <p>{user.first_name}</p>
        <p>@{user.username}</p>
      </a>
    </aside>
  );

  return <SidebarContent />;
};

export default GetSidebar;
