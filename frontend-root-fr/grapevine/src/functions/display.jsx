const GetSidebar = () => {
    return (
        <aside className="App-sidebar">
          <nav>
            <ul>
              <h2 className="Sidebar-title">The Winery</h2>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>
                  <img src="/icons/Home.png" alt="Home Icon" className="nav-icons" />
                  Home
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/messages"); }}>
                  <img src="/icons/Chat.png" alt="Chat Icon" className="nav-icons" />
                  Messages
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/Communities"); }}>
                  <img src="/icons/Communities.png" alt="Community Icon" className="nav-icons" />
                  Communities
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
                  <img src="/icons/Settings.png" alt="Setting Icon" className="nav-icons" />
                  Settings
                </a>
              </li>
            </ul>
          </nav>

          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/profile"); }} className="user-info">
            <img src="/SmiskiPFP.png" alt="Profile Picture" className="profile-pic" />
            <p className="user-name">Mayela</p>
            <p className="username">@mayela101</p>
          </a>
        </aside>
    );
  };
  
  export default GetSidebar;
  