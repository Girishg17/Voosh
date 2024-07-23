import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import Home from './Pages/Home';


const App: React.FC = () => {
  return (
    <Router>
<Routes>
        <Route path="/" Component={Login} />
        <Route path='/home' Component={Home}/>
        </Routes>
    </Router>
  );
};

export default App;
