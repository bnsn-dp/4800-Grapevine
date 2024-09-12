import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import About from "./pages/About";
import Projects from './pages/Projects';
import Logs from './pages/SCRUMLogs';

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<Test />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
