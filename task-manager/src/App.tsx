import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import Navbar from './Components/NavBar'

const App: React.FC = () => {
  return (
    <Router>
<Routes>
        <Route path="/" Component={Login} />
        <Route path="/signup" Component={Login} />
        </Routes>
    </Router>
  );
};

export default App;
