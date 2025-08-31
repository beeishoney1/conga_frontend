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
        return currentUser ? <PurchaseHistory user={currentUser} /> : <div>Please login first</div>;
      case 'admin':
        return currentUser?.is_admin ? <AdminPanel user={currentUser} /> : <div>Access denied</div>;
      default:
        return <Home currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Nav currentUser={currentUser} onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;