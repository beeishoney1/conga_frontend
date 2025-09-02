import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const ContactAdmin = () => {
  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6"
      style={{
        background: 'linear-gradient(135deg, #00010a, #000930)',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
        style={{
          background: 'rgba(0,230,255,0.2)',
          border: '1px solid rgba(0,230,255,0.5)',
          boxShadow: '0 4px 12px rgba(0,230,255,0.4)',
          color: '#fff',
          fontWeight: 500,
        }}
      >
        <FaArrowLeft />
        Back
      </button>

      {/* Page Title */}
      <h1
        className="text-2xl font-bold mb-6"
        style={{
          background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 12px rgba(0,230,255,0.8)',
        }}
      >
        Contact Admin
      </h1>

      {/* Admin Name Input Box */}
      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium text-cyan-300 mb-1">Admin Name</label>
        <input
          type="text"
          value="https://t.me/@CONGA376"
          readOnly
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-cyan-500 text-white cursor-not-allowed focus:outline-none"
        />
      </div>

      {/* Telegram Link Button */}
      <a
        href="https://t.me/@CONGA376"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-all mb-4 inline-block"
      >
        Open Telegram
      </a>

      {/* Optional message */}
      <p className="text-sm text-cyan-300 mt-2 text-center max-w-md">
        Contact the admin via Telegram for support, order issues, or inquiries.
      </p>
    </div>
  );
};

export default ContactAdmin;
