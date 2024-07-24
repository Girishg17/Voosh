import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import Home from './Pages/Home';
import ProtectedRoute from './Components/ProtectedRoutes';
import ErrorPage from './Pages/Error';


const App: React.FC = () => {
  return (
    <Router>
<Routes>
        <Route path="/" Component={Login} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="*" element={<ErrorPage />} />
        </Routes>
    </Router>
  );
};

export default App;
