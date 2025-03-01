import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Menus from './pages/Menus';

// Wrapper component to conditionally render Footer
const AppLayout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isDashboardRoute ? 'bg-gray-50' : ''}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features/" element={<Features />} />
        <Route path="/pricing/" element={<Pricing />} />
        <Route path="/signup/" element={<Signup />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/verify-email/" element={<VerifyEmail />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/dashboard/menus/" element={<Menus />} />
      </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;