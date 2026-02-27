
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Planner from './components/Planner';
import AdminDashboard from './components/admin/AdminDashboard';
import CategoryLanding from './components/landing/CategoryLanding';

const App: React.FC = () => {
  console.log('App rendering, current path:', window.location.hash);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Planner />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/category/:slug" element={<CategoryLanding />} />
      </Routes>
    </Router>
  );
};

export default App;
