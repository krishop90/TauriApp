import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Merchant from './pages/Merchant';
import './index.css';

const App: React.FC = () => (
  <Router>
    <div className="app">
      <nav className="navbar">
        <Link to="/">HOME</Link>
        <Link to="/merchant">MERCHANT</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/merchant" element={<Merchant />} />
      </Routes>
    </div>
  </Router>
);

export default App;