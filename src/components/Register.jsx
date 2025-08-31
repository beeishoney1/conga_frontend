import React, { useState } from 'react';
import { api } from '../api/backendAPI';
import { FaUser, FaLock, FaTelegram, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

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

  const handleBack = () => {
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #0a1e32 0%, #0c2b48 100%)'
    }}>
      <div className="w-full max-w-xs">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 mb-4 text-cyan-300 hover:text-cyan-100 transition-colors text-xs"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Home</span>
        </button>

        {/* Register Card */}
        <div className="rounded-xl p-4" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2" style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(218,165,32,0.2) 100%)',
              border: '1px solid rgba(255,215,0,0.3)',
            }}>
              <FaUserPlus className="text-yellow-400 text-lg" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-gray-300 text-xs">Join our diamond shop</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text text-white flex items-center gap-1 text-xs">
                  <FaUser className="text-cyan-400 text-xs" /> Username
                </span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose username"
              />
            </div>

            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text text-white flex items-center gap-1 text-xs">
                  <FaLock className="text-cyan-400 text-xs" /> Password
                </span>
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create password"
              />
            </div>

            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text text-white flex items-center gap-1 text-xs">
                  <FaTelegram className="text-blue-400 text-xs" /> Telegram ID (Optional)
                </span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                }}
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                placeholder="Your Telegram username"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-1 transition-all duration-300 text-sm"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                <>
                  <FaUserPlus className="text-xs" />
                  Register
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <button
                onClick={() => (window.location.hash = '#login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;