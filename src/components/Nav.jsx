import React, { useState } from 'react';
import { FaUser, FaQuestionCircle, FaHeadset, FaSignOutAlt, FaChevronDown, FaHistory, FaHome, FaCrown } from 'react-icons/fa';

const Nav = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  return (
    <div
      className="navbar p-2 mb-4"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        position: 'sticky',
        top: '0',
        zIndex: '1000'
      }}
    >
      <div className="navbar-start">
        <button
          onClick={() => (window.location.hash = '#home')}
          className="text-xl font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 12px rgba(0, 230, 255, 0.8)',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 'bold'
            
          }}
        >
          💎 Conga Shop
        </button>
      </div>

      <div className="navbar-end flex gap-2 items-center">
        {currentUser ? (
          <>
            {currentUser.is_admin && (
              <button
                onClick={() => (window.location.hash = '#admin')}
                className="neo-btn flex items-center gap-2"
              >
                <FaCrown className="text-sm" />
                Admin
              </button>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="neo-btn-user flex items-center gap-2 px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,230,255,0.3), rgba(0,119,255,0.3))',
                  border: '1px solid rgba(0,230,255,0.5)',
                  boxShadow: '0 4px 15px rgba(0,230,255,0.4)',
                }}
              >
                <FaUser className="text-cyan-300" />
                <span className="max-w-[100px] truncate font-medium">{currentUser.username}</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 rounded-xl z-50"
                  style={{
                    background: 'rgba(0, 10, 30, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(0, 230, 255, 0.4)',
                    boxShadow: '0 10px 40px rgba(0, 230, 255, 0.5)',
                  }}
                >
                  <div className="py-3">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-cyan-700/50 bg-cyan-900/20">
                      <p className="text-sm font-bold text-cyan-300 truncate">{currentUser.username}</p>
                      <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                        {currentUser.is_admin ? (
                          <>
                            <FaCrown className="text-yellow-400" /> Administrator
                          </>
                        ) : (
                          'Customer'
                        )}
                      </p>
                    </div>

                    {/* Home - Added to dropdown */}
                    <button
                      onClick={() => handleNavigation('#home')}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-cyan-900/40 transition-all duration-200 group"
                    >
                      <FaHome className="text-cyan-400 group-hover:text-cyan-300 text-base" />
                      <span className="text-sm font-medium text-white group-hover:text-cyan-100">Home</span>
                    </button>

                    {/* History */}
                    <button
                      onClick={() => handleNavigation('#history')}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-purple-900/40 transition-all duration-200 group"
                    >
                      <FaHistory className="text-purple-400 group-hover:text-purple-300 text-base" />
                      <span className="text-sm font-medium text-white group-hover:text-purple-100">Purchase History</span>
                    </button>

                    {/* Guide */}
                    <button
                      onClick={() => handleNavigation('#guide')}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-900/40 transition-all duration-200 group"
                    >
                      <FaQuestionCircle className="text-blue-400 group-hover:text-blue-300 text-base" />
                      <span className="text-sm font-medium text-white group-hover:text-blue-100">Guide & Help</span>
                    </button>

                    {/* Contact Admin */}
                    <button
                      onClick={() => handleNavigation('#contact')}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-green-900/40 transition-all duration-200 group"
                    >
                      <FaHeadset className="text-green-400 group-hover:text-green-300 text-base" />
                      <span className="text-sm font-medium text-white group-hover:text-green-100"><a href='https://t.me/CONGA376
'>Contact Admin</a></span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-900/40 transition-all duration-200 group border-t border-red-700/30"
                    >
                      <FaSignOutAlt className="text-red-400 group-hover:text-red-300 text-base" />
                      <span className="text-sm font-medium text-white group-hover:text-red-100">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => (window.location.hash = '#login')}
              className="neo-btn"
            >
              Login
            </button>
            <button
              onClick={() => (window.location.hash = '#register')}
              className="neo-btn-highlight"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <style jsx>{`
        .neo-btn {
          padding: 8px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 230, 255, 0.2);
        }
        .neo-btn:hover {
          background: rgba(0, 230, 255, 0.2);
          box-shadow: 0 8px 18px rgba(0, 230, 255, 0.4);
          transform: translateY(-1px);
        }
        .neo-btn-highlight {
          padding: 8px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, #00e6ff, #0077ff);
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(0, 230, 255, 0.5);
          transition: all 0.3s ease;
        }
        .neo-btn-highlight:hover {
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 8px 22px rgba(0, 230, 255, 0.8);
        }
        .neo-btn-user {
          padding: 8px 16px;
          border-radius: 12px;
          color: #fff;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .neo-btn-user:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0, 230, 255, 0.6);
        }
        .neo-btn-user::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .neo-btn-user:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default Nav;