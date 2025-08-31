import React, { useState, useEffect } from 'react';
import { api } from '../api/backendAPI';
import { FaGem, FaGamepad, FaServer, FaMoneyBillWave, FaCreditCard, FaCrown, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

const Home = ({ currentUser }) => {
  const [prices, setPrices] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [gameId, setGameId] = useState('');
  const [serverId, setServerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'wave' or 'kpay'
  const [paymentNumber, setPaymentNumber] = useState(''); // Empty by default
  const [paymentName, setPaymentName] = useState(''); // Empty by default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false); // New state for login alert

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
    if (!gameId || !serverId || !paymentMethod || !paymentNumber || !paymentName) {
      setMessage('Please fill all fields');
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

      setMessage(res.message || 'Purchase request submitted successfully!');
      setTimeout(() => {
        setShowPurchaseModal(false);
        setGameId('');
        setServerId('');
        setPaymentMethod('');
        setPaymentNumber('');
        setPaymentName('');
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Purchase error:', error);
      setMessage('Error submitting purchase: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMMK = (price) => {
    return new Intl.NumberFormat('en-US').format(price) + ' MMK';
  };

  // Function to get package display name
  const getPackageName = (price) => {
    if (price.amount === 0 || price.amount === "0") {
      return 'Weekly Pass';
    }
    return `${price.amount} 💎`;
  };

  // Function to get package icon
  const getPackageIcon = (price) => {
    if (price.amount === 0 || price.amount === "0") {
      return <FaCrown className="text-yellow-400 text-xs" />;
    }
    return <FaGem className="text-cyan-400 text-xs" />;
  };

  // Separate weekly pass and diamonds
  const weeklyPass = prices.find(price => price.amount === 0 || price.amount === "0");
  const diamondPackages = prices.filter(price => price.amount !== 0 && price.amount !== "0")
    .sort((a, b) => a.amount - b.amount);

  return (
    <div className="p-1">
      <div className="mb-2 text-center">
        <h1 className="text-sm font-bold text-white mb-0.5" style={{ textShadow: '0 0 4px rgba(0,230,255,0.8)' }}>
          {currentUser ? `Hi, ${currentUser.username}!` : 'ML Packages'}
        </h1>
        <p className="text-gray-300 text-2xs">
          {currentUser ? 'Tap to purchase' : 'Login to purchase'}
        </p>
      </div>

      {/* Weekly Pass (Single Card on Top) */}
      {weeklyPass && (
        <div className="mb-2">
          <div className="text-center mb-0.5">
            <h2 className="text-2xs font-semibold text-yellow-300">Weekly Pass</h2>
          </div>
          <div
            className="rounded overflow-hidden mx-auto max-w-xs"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.1) 100%)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          >
            {/* Package Header */}
            <div 
              className="p-0.5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(218,165,32,0.15) 100%)',
              }}
            >
              <div className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                style={{
                  background: 'rgba(255,215,0,0.2)',
                  border: '1px solid rgba(255,215,0,0.3)',
                }}
              >
                <FaCrown className="text-yellow-400 text-2xs" />
              </div>
              <h3 className="text-2xs font-bold text-white mt-0.5">
                Weekly Pass
              </h3>
              <div className="text-2xs font-bold text-yellow-300">
                {formatMMK(weeklyPass.price)}
              </div>
            </div>

            {/* Package Body */}
            <div className="p-0.5">
              <button
                onClick={() => handleBuyClick(weeklyPass)}
                className="w-full py-0.5 rounded text-white font-semibold flex items-center justify-center gap-0.5 text-2xs"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #DAA520)',
                }}
              >
                <FaShoppingCart className="text-2xs" /> Buy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diamond Packages (2x2 Grid with more gap) */}
      {diamondPackages.length > 0 && (
        <div className="mb-2">
          <div className="text-center mb-0.5">
            <h2 className="text-2xs font-semibold text-cyan-300">Diamonds</h2>
          </div>
          <div className="grid grid-cols-2 gap-2"> {/* Increased gap from 1 to 2 */}
            {diamondPackages.map((price) => (
              <div
                key={price.id}
                className="rounded overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,230,255,0.1) 0%, rgba(0,119,255,0.1) 100%)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(0,230,255,0.15)',
                }}
              >
                {/* Package Header */}
                <div 
                  className="p-0.5 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,230,255,0.15) 0%, rgba(0,119,255,0.15) 100%)',
                  }}
                >
                  <div className="inline-flex items-center justify-center w-4 h-4 rounded-full"
                    style={{
                      background: 'rgba(0,230,255,0.2)',
                      border: '1px solid rgba(0,230,255,0.3)',
                    }}
                  >
                    <FaGem className="text-cyan-400 text-2xs" />
                  </div>
                  <h3 className="text-2xs font-bold text-white mt-0.5">
                    {price.amount}
                  </h3>
                </div>

                {/* Package Body */}
                <div className="p-0.5">
                  <div className="text-center">
                    <div className="text-2xs font-bold text-cyan-300">
                      {formatMMK(price.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyClick(price)}
                    className="w-full py-0.5 rounded text-white font-semibold text-2xs flex items-center justify-center gap-0.5 mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #00e6ff, #0077ff)',
                    }}
                  >
                    <FaShoppingCart className="text-2xs" /> Buy
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
            className="modal-box p-1 max-w-xs mx-auto"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#fff',
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                style={{
                  background: 'rgba(255,193,7,0.2)',
                  border: '1px solid rgba(255,193,7,0.5)',
                }}
              >
                <FaExclamationTriangle className="text-yellow-400 text-lg" />
              </div>
              
              <h3 className="font-bold text-sm mb-1 text-yellow-300">Login Required</h3>
              <p className="text-xs mb-2 text-gray-300">
                You need to login first to purchase diamonds.
              </p>
              
              <div className="flex gap-2 w-full">
                <button
                  className="btn btn-sm flex-1"
                  onClick={() => setShowLoginAlert(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm flex-1 text-white"
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
            className="modal-box p-1 max-w-xs mx-auto"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: '#fff',
            }}
          >
            <h3 className="font-bold text-2xs mb-0.5 text-cyan-300">Purchase</h3>
            {selectedPackage && (
              <div
                className="my-0.5 p-0.5 rounded text-center"
                style={{
                  background: 'rgba(0,230,255,0.1)',
                  border: '1px solid rgba(0,230,255,0.3)',
                }}
              >
                <p className="font-bold text-2xs flex justify-center items-center gap-0.5">
                  {getPackageIcon(selectedPackage)} {getPackageName(selectedPackage)}
                </p>
                <p className="text-2xs mt-0.5 text-cyan-300">
                  Price: {formatMMK(selectedPackage.price)}
                </p>
              </div>
            )}

            <form onSubmit={handlePurchaseSubmit}>
              <div className="form-control mb-0.5">
                <label className="label text-white text-2xs flex items-center gap-0.5 p-0.5">
                  <FaGamepad className="text-2xs" /> Game ID
                </label>
                <input
                  type="text"
                  placeholder="ML ID"
                  className="input input-bordered text-black bg-white input-xs p-0.5"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-0.5">
                <label className="label text-white text-2xs flex items-center gap-0.5 p-0.5">
                  <FaServer className="text-2xs" /> Server ID
                </label>
                <input
                  type="text"
                  placeholder="Server ID"
                  className="input input-bordered text-black bg-white input-xs p-0.5"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mb-0.5">
                <label className="label text-white text-2xs p-0.5">Payment Method</label>
                <div className="flex gap-0.5 mb-0.5">
                  <label className="flex items-center gap-0.5 cursor-pointer text-2xs">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wave"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                      className="radio radio-primary radio-xs"
                    />
                    <span className="flex items-center gap-0.5">
                      <FaMoneyBillWave className="text-2xs" /> Wave
                    </span>
                  </label>
                  <label className="flex items-center gap-0.5 cursor-pointer text-2xs">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kpay"
                      checked={paymentMethod === 'kpay'}
                      onChange={() => setPaymentMethod('kpay')}
                      className="radio radio-primary radio-xs"
                    />
                    <span className="flex items-center gap-0.5">
                      <FaCreditCard className="text-2xs" /> KPay
                    </span>
                  </label>
                </div>
                
                {paymentMethod && (
                  <div className="bg-cyan-900/30 p-0.5 rounded space-y-0.5 text-2xs">
                    {/* Recipient Info */}
                    <div className="p-0.5 bg-cyan-800/50 rounded">
                      <p className="text-white font-semibold text-2xs">Send To:</p>
                      {paymentMethod === 'wave' && (
                        <>
                          <p className="text-cyan-300 text-2xs">နံပတ်: 099813454</p>
                          <p className="text-cyan-300 text-2xs">နာမည်: Kyaw Kyaw</p>
                        </>
                      )}
                      {paymentMethod === 'kpay' && (
                        <>
                          <p className="text-cyan-300 text-2xs">နံပတ်: 09451234567</p>
                          <p className="text-cyan-300 text-2xs">နာမည်: Min Min</p>
                        </>
                      )}
                    </div>

                    {/* User Input - Empty by default */}
                    <div className="form-control">
                      <label className="label text-white py-0">
                        <span className="label-text text-2xs">Payment - လုပ်ငန်းစဥ်နံပတ်</span>
                      </label>
                      <input
                        type="text"
                        placeholder="လုပ်ငန်းစဥ်နံပတ်"
                        className="input input-bordered text-black bg-white input-xs p-0.5"
                        value={paymentNumber}
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label text-white py-0">
                        <span className="label-text text-2xs">ပေးချေသူနာမည်</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ပေးချေသူနာမည်"
                        className="input input-bordered text-black bg-white input-xs p-0.5"
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {message && (
                <div
                  className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} mb-0.5 py-0.5 text-2xs`}
                >
                  {message}
                </div>
              )}

              <div className="modal-action flex flex-col gap-0.5">
                <button
                  type="button"
                  className="btn btn-xs w-full"
                  onClick={() => setShowPurchaseModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-xs w-full text-white"
                  style={{ background: 'linear-gradient(135deg, #00e6ff, #0077ff)' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;