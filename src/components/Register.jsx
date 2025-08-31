import React, { useState } from 'react';
import { api } from '../api/backendAPI';

const Register = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await api.register(username, password, telegramId);
      if (data.message === 'User created successfully') {
        // Auto-login after registration
        const loginData = await api.login(username, password);
        if (loginData.message === 'Login successful') {
          onLogin(loginData.user);
          window.location.hash = '';
        }
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Telegram ID (Optional)</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Your Telegram username"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;