import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PurchaseHistory from './components/PurchaseHistory';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    // This ensures the loading spinner is hidden once React is fully loaded
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    document.body.classList.add('loaded');
    
    // Set body background color to prevent white flash
    document.body.style.backgroundColor = '#0a1e32';
  }, []);

  useEffect(() => {
    // Check hash for routing
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setCurrentView(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial call

    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.location.hash = '';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'register':
        return <Register onLogin={handleLogin} />;
      case 'history':
        return currentUser ? <PurchaseHistory user={currentUser} /> : <div className="text-white text-center p-4">Please login first</div>;
      case 'admin':
        return currentUser?.is_admin ? <AdminPanel user={currentUser} /> : <div className="text-white text-center p-4">Access denied</div>;
      default:
        return <Home currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#0a1e32',
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(0, 119, 255, 0.1) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 230, 255, 0.1) 0%, transparent 25%)'
    }}>
      <Nav currentUser={currentUser} onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;