import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Grapevine</h1>
      </header>
      <div className="App-content">
        <aside className="App-sidebar">
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </aside>
        <main className="App-main">
          <p>Welcome to Grapevine!</p>
        </main>
      </div>
    </div>
  );
}

export default App;
