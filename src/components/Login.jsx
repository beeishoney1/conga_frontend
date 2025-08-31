import React, { useState } from 'react';
import { api } from '../api/backendAPI';
import { FaUser, FaLock, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await api.login(username, password);
      if (data.message === 'Login successful') {
        onLogin(data.user);
        window.location.hash = '';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
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

        {/* Login Card */}
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
              background: 'linear-gradient(135deg, rgba(0,230,255,0.2) 0%, rgba(0,119,255,0.2) 100%)',
              border: '1px solid rgba(0,230,255,0.3)',
            }}>
              <FaUser className="text-cyan-400 text-lg" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-gray-300 text-xs">Sign in to your account</p>
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
                placeholder="Enter username"
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
                placeholder="Enter password"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-1 transition-all duration-300 text-sm"
              style={{
                background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
                boxShadow: '0 4px 15px rgba(0, 230, 255, 0.4)',
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="text-xs" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t border-gray-700">
            <p className="text-gray-400 text-xs">
              Don't have an account?{' '}
              <button
                onClick={() => (window.location.hash = '#register')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;