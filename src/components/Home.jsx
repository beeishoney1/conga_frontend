import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/backendAPI';
import { FaGem, FaGamepad, FaServer, FaMoneyBillWave, FaCreditCard, FaCrown, FaShoppingCart, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const Home = ({ currentUser }) => {
  const [prices, setPrices] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [gameId, setGameId] = useState('');
  const [serverId, setServerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Use ref to track submission state to prevent duplicates
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const data = await api.getDiamondPrices('Mobile Legends');
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const handleBuyClick = (price) => {
    if (!currentUser) {
      setShowLoginAlert(true);
      return;
    }
    setSelectedPackage(price);
    setShowPurchaseModal(true);
    setMessage('');
    setPaymentMethod('');
    setPaymentNumber('');
    setPaymentName('');
  };

  const handleLoginRedirect = () => {
    setShowLoginAlert(false);
    window.location.hash = '#login';
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions using ref
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    
    if (!gameId || !serverId || !paymentMethod || !paymentNumber || !paymentName) {
      setMessage('Please fill all fields');
      isSubmittingRef.current = false;
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await api.buyDiamonds(
        currentUser.id,
        selectedPackage.id,
        gameId,
        serverId,
        paymentNumber,
        paymentName
      );

      // Set success message and show alert
      setSuccessMessage(res.message || 'Purchase request submitted successfully!');
      setShowSuccessAlert(true);
      
      // Close modal immediately
      setShowPurchaseModal(false);
      
      // Clear form fields
      setGameId('');
      setServerId('');
      setPaymentMethod('');
      setPaymentNumber('');
      setPaymentName('');
      
    } catch (error) {
      console.error('Purchase error:', error);
      setMessage('Error submitting purchase: ' + error.message);
    } finally {
      setIsSubmitting(false);
      // Reset submission ref after a short delay to ensure no duplicate submissions
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  };

  const formatMMK = (price) => {
    return new Intl.NumberFormat('en-US').format(price) + ' MMK';
  };

  const getPackageName = (price) => {
    if (price.amount === 0 || price.amount === "0") {
      return 'Weekly Pass';
    }
    return `${price.amount} 💎`;
  };

  const getPackageIcon = (price) => {
    if (price.amount === 0 || price.amount === "0") {
      return <FaCrown className="text-yellow-400 text-xs" />;
    }
    return <FaGem className="text-cyan-400 text-xs" />;
  };

  const weeklyPass = prices.find(price => price.amount === 0 || price.amount === "0");
  const diamondPackages = prices.filter(price => price.amount !== 0 && price.amount !== "0")
    .sort((a, b) => a.amount - b.amount);

  return (
    <div className="p-2">
      {/* Success Alert Box */}
      {showSuccessAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-xs mx-auto animate-pop-in shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 text-sm mb-4">{successMessage}</p>
              <button
                onClick={() => setShowSuccessAlert(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with floating animation */}
      <div className="mb-3 text-center animate-float">
        <h1 className="text-sm font-bold text-white mb-1" style={{ textShadow: '0 0 4px rgba(0,230,255,0.8)' }}>
          {currentUser ? `Hi, ${currentUser.username}!` : 'ML Packages'}
        </h1>
        <p className="text-gray-300 text-xs">
          {currentUser ? 'Tap to purchase' : 'Login to purchase'}
        </p>
      </div>

      {/* Weekly Pass Card with floating animation */}
      {weeklyPass && (
        <div className="mb-3 animate-float" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-1">
            <h2 className="text-xs font-semibold text-yellow-300">Weekly Pass</h2>
          </div>
          <div
            className="rounded-lg overflow-hidden mx-auto max-w-xs transform transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.1) 100%)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,215,0,0.2)',
              boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
            }}
          >
            <div 
              className="p-2 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(218,165,32,0.15) 100%)',
              }}
            >
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full mb-1"
                style={{
                  background: 'rgba(255,215,0,0.2)',
                  border: '1px solid rgba(255,215,0,0.3)',
                }}
              >
                <FaCrown className="text-yellow-400 text-xs" />
              </div>
              <h3 className="text-xs font-bold text-white">Weekly Pass</h3>
              <div className="text-xs font-bold text-yellow-300 mt-1">
                {formatMMK(weeklyPass.price)}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => handleBuyClick(weeklyPass)}
                className="w-full py-1.5 rounded text-white font-semibold flex items-center justify-center gap-1 text-xs transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                }}
              >
                <FaShoppingCart className="text-xs" /> Buy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diamond Packages Grid */}
      {diamondPackages.length > 0 && (
        <div className="mb-3">
          <div className="text-center mb-2">
            <h2 className="text-xs font-semibold text-cyan-300">Diamonds</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {diamondPackages.map((price, index) => (
              <div
                key={price.id}
                className="rounded-lg overflow-hidden transform transition-transform hover:scale-105 animate-float"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                  background: 'linear-gradient(135deg, rgba(0,230,255,0.1) 0%, rgba(0,119,255,0.1) 100%)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(0,230,255,0.15)',
                  boxShadow: '0 4px 15px rgba(0,230,255,0.2)',
                }}
              >
                <div 
                  className="p-2 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,230,255,0.15) 0%, rgba(0,119,255,0.15) 100%)',
                  }}
                >
                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full mb-1"
                    style={{
                      background: 'rgba(0,230,255,0.2)',
                      border: '1px solid rgba(0,230,255,0.3)',
                    }}
                  >
                    <FaGem className="text-cyan-400 text-xs" />
                  </div>
                  <h3 className="text-xs font-bold text-white">
                    {price.amount}
                  </h3>
                </div>

                <div className="p-2">
                  <div className="text-center mb-1">
                    <div className="text-xs font-bold text-cyan-300">
                      {formatMMK(price.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyClick(price)}
                    className="w-full py-1.5 rounded-lg text-white font-semibold text-xs flex items-center justify-center gap-1 transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
                      boxShadow: '0 4px 15px rgba(0, 230, 255, 0.4)',
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Content */}
                    <FaShoppingCart className="text-xs transition-transform group-hover:scale-110" />
                    <span className="transition-transform group-hover:scale-105">Buy</span>
                    
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-lg animate-pulse group-hover:animate-none" 
                         style={{
                           boxShadow: '0 0 0 0 rgba(0, 230, 255, 0.7)',
                           animation: 'pulse-cyan 2s infinite'
                         }}>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login Alert Modal */}
      {showLoginAlert && (
        <div className="modal modal-open">
          <div
            className="modal-box p-3 max-w-xs mx-auto animate-pop-in"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#fff',
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 animate-pulse"
                style={{
                  background: 'rgba(255,193,7,0.2)',
                  border: '1px solid rgba(255,193,7,0.5)',
                }}
              >
                <FaExclamationTriangle className="text-yellow-400 text-lg" />
              </div>
              
              <h3 className="font-bold text-sm mb-1 text-yellow-300">Login Required</h3>
              <p className="text-xs mb-3 text-gray-300">
                You need to login first to purchase diamonds.
              </p>
              
              <div className="flex gap-2 w-full">
                <button
                  className="btn btn-sm flex-1 transition-all hover:scale-105"
                  onClick={() => setShowLoginAlert(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm flex-1 text-white transition-all hover:scale-105"
                  onClick={handleLoginRedirect}
                  style={{
                    background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
                  }}
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="modal modal-open">
          <div
            className="modal-box p-3 max-w-xs mx-auto animate-pop-in"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              color: '#fff',
            }}
          >
            <h3 className="font-bold text-sm mb-2 text-cyan-300">Purchase</h3>
            {selectedPackage && (
              <div
                className="my-2 p-2 rounded text-center animate-pulse"
                style={{
                  background: 'rgba(0,230,255,0.1)',
                  border: '1px solid rgba(0,230,255,0.3)',
                }}
              >
                <p className="font-bold text-sm flex justify-center items-center gap-1">
                  {getPackageIcon(selectedPackage)} {getPackageName(selectedPackage)}
                </p>
                <p className="text-xs mt-1 text-cyan-300">
                  Price: {formatMMK(selectedPackage.price)}
                </p>
              </div>
            )}

            <form onSubmit={handlePurchaseSubmit} className="space-y-2">
              <div className="form-control">
                <label className="label text-white text-xs flex items-center gap-1 p-1">
                  <FaGamepad className="text-xs" /> Game ID
                </label>
                <input
                  type="text"
                  placeholder="ML ID"
                  className="input input-bordered text-black bg-white input-sm p-2 text-xs"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label text-white text-xs flex items-center gap-1 p-1">
                  <FaServer className="text-xs" /> Server ID
                </label>
                <input
                  type="text"
                  placeholder="Server ID"
                  className="input input-bordered text-black bg-white input-sm p-2 text-xs"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label text-white text-xs p-1">Payment Method</label>
                <div className="flex gap-2 mb-2">
                  <label className="flex items-center gap-1 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wave"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                      className="radio radio-primary radio-xs"
                      disabled={isSubmitting}
                    />
                    <span className="flex items-center gap-1">
                      <FaMoneyBillWave className="text-xs" /> Wave
                    </span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kpay"
                      checked={paymentMethod === 'kpay'}
                      onChange={() => setPaymentMethod('kpay')}
                      className="radio radio-primary radio-xs"
                      disabled={isSubmitting}
                    />
                    <span className="flex items-center gap-1">
                      <FaCreditCard className="text-xs" /> KPay
                    </span>
                  </label>
                </div>
                
                {paymentMethod && (
                  <div className="bg-cyan-900/30 p-2 rounded space-y-2 text-xs">
                    <div className="p-2 bg-cyan-800/50 rounded">
                      <p className="text-white font-semibold text-xs">Send To:</p>
                      {paymentMethod === 'wave' && (
                        <>
                          <p className="text-cyan-300 text-xs">နံပတ်: 09695566044</p>
                          <p className="text-cyan-300 text-xs">နာမည်: Moe Sandar Shwe</p>
                        </>
                      )}
                      {paymentMethod === 'kpay' && (
                        <>
                          <p className="text-cyan-300 text-xs">နံပတ်: 09660765719</p>
                          <p className="text-cyan-300 text-xs">နာမည်: Moe Moe Htwe</p>
                        </>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label text-white py-0">
                        <span className="label-text text-xs">Payment - လုပ်ငန်းစဥ်နံပတ်</span>
                        
                      </label>
                      <input
                        type="text"
                        placeholder="လုပ်ငန်းစဥ်နံပတ်"
                        className="input input-bordered text-black bg-white input-sm p-2 text-xs"
                        value={paymentNumber}
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label text-white py-0">
                        <span className="label-text text-xs">ပေးချေသူနာမည်</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ပေးချေသူနာမည်"
                        className="input input-bordered text-black bg-white input-sm p-2 text-xs"
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </div>

              {message && (
                <div
                  className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} py-2 text-xs animate-fade-in`}
                >
                  {message}
                </div>
              )}

              <div className="modal-action flex flex-col gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-sm w-full transition-all hover:scale-105"
                  onClick={() => setShowPurchaseModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm w-full text-white transition-all hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pop-in {
          animation: pop-in 0.2s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
          
        @keyframes pulse-cyan {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 230, 255, 0.7);
          }
          70% {
            boxShadow: 0 0 0 10px rgba(0, 230, 255, 0);
          }
          100% {
            boxShadow: 0 0 0 0 rgba(0, 230, 255, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;