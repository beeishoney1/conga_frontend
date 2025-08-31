import React, { useState, useEffect } from 'react';
import { api } from '../api/backendAPI';
import { FaGem, FaDollarSign, FaGamepad, FaServer, FaClock, FaCheckCircle, FaTicketAlt, FaCrown } from 'react-icons/fa';

const PurchaseHistory = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [copiedVoucher, setCopiedVoucher] = useState(null);

  useEffect(() => {
    loadPurchaseHistory();
    loadDiamondPrices();
  }, []);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPurchaseHistory(user.id);
      const purchasesData = data.purchases || data || [];
      setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
    } catch (error) {
      console.error('Error loading purchase history:', error);
      setError('Failed to load purchase history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDiamondPrices = async () => {
    try {
      const data = await api.getDiamondPrices('Mobile Legends');
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error loading diamond prices:', error);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      Pending: { class: 'bg-yellow-500 text-white px-3 py-1 rounded-full text-sm', icon: '⏳' },
      Approved: { class: 'bg-green-500 text-white px-3 py-1 rounded-full text-sm', icon: '✅' },
      Success: { class: 'bg-green-500 text-white px-3 py-1 rounded-full text-sm', icon: '✅' },
      Processing: { class: 'bg-blue-500 text-white px-3 py-1 rounded-full text-sm', icon: '🔄' },
      Rejected: { class: 'bg-red-500 text-white px-3 py-1 rounded-full text-sm', icon: '❌' },
      Failed: { class: 'bg-red-500 text-white px-3 py-1 rounded-full text-sm', icon: '❌' },
      Cancelled: { class: 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm', icon: '🚫' },
    };
    
    const config = statusConfig[status] || { class: 'bg-gray-500 text-white px-3 py-1 rounded-full text-sm', icon: '❓' };

    return (
      <span className={config.class}>
        {config.icon} {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    const priceValue = typeof price === 'number' ? price : parseFloat(price) || 0;
    return new Intl.NumberFormat('en-US').format(priceValue) + ' MMK';
  };

  const getPurchasePrice = (purchase) => {
    console.log('Purchase object:', purchase); // Debug log
    
    // First, try to get price directly from purchase object
    if (purchase.price !== undefined && purchase.price !== null) {
      return purchase.price;
    }
    
    // If no direct price, try to find it in the prices array using amount
    const amount = purchase.amount ?? purchase.diamond_amount;
    if (amount !== undefined && amount !== null) {
      const matchedPrice = prices.find((p) => p.amount == amount);
      if (matchedPrice) {
        return matchedPrice.price;
      }
    }
    
    // If still not found, return 0
    return 0;
  };

  const getPurchaseAmount = (purchase) => {
    const amount = purchase.amount ?? purchase.diamond_amount;
    if (amount === 0 || amount === '0') {
      return 'Weekly Pass';
    }
    return amount ? `${amount} 💎` : 'N/A';
  };

  const getPurchaseIcon = (purchase) => {
    const amount = purchase.amount ?? purchase.diamond_amount;
    if (amount === 0 || amount === '0') {
      return <FaCrown className="text-yellow-400" />;
    }
    return <FaGem className="text-cyan-400" />;
  };

  const getPurchaseType = (purchase) => {
    const amount = purchase.amount ?? purchase.diamond_amount;
    if (amount === 0 || amount === '0') {
      return 'Weekly Pass';
    }
    return 'Diamonds';
  };

  const getGameInfo = (purchase) => {
    return purchase.game_name || purchase.game_id || 'N/A';
  };

  const getServerInfo = (purchase) => {
    return purchase.server_name || purchase.server_id || 'N/A';
  };

  const getPurchaseStatus = (purchase) => {
    return purchase.status || 'Pending';
  };

  const isWeeklyPass = (purchase) => {
    const amount = purchase.amount ?? purchase.diamond_amount;
    return amount === 0 || amount === '0';
  };

  // Generate voucher number from purchase ID
  const generateVoucherNumber = (purchaseId) => {
    if (!purchaseId) return 'N/A';
    const paddedId = purchaseId.toString().padStart(8, '0');
    return `VOU-${paddedId}`;
  };

  // Copy voucher number to clipboard
  const copyVoucherNumber = (voucherNumber) => {
    navigator.clipboard.writeText(voucherNumber).then(() => {
      setCopiedVoucher(voucherNumber);
      setTimeout(() => setCopiedVoucher(null), 2000);
    });
  };

  const filteredPurchases = filterStatus === 'All' 
    ? purchases 
    : purchases.filter((p) => getPurchaseStatus(p) === filterStatus);

  const statusCounts = purchases.reduce(
    (acc, p) => {
      const status = getPurchaseStatus(p);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { All: purchases.length }
  );

  const allStatuses = [...new Set(purchases.map(p => getPurchaseStatus(p)))];
  const availableStatuses = ['All', ...allStatuses];

  if (loading) {
    return (
      <div className="p-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Purchase History</h2>
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
        <p className="mt-3">Loading your purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-white">
        <h2 className="text-3xl font-bold mb-6">Purchase History</h2>
        <div className="alert alert-error">{error}</div>
        <button onClick={loadPurchaseHistory} className="btn btn-primary mt-3">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-4xl font-bold mb-6 text-white" style={{ textShadow: '0 0 12px rgba(0,230,255,0.8)' }}>
        Your Purchase History
      </h2>

    
      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {availableStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-all ${
              filterStatus === status 
                ? 'bg-cyan-500 text-white shadow-lg' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {status} <span className="ml-2 bg-gray-700 px-2 rounded-full text-xs">{statusCounts[status] || 0}</span>
          </button>
        ))}
      </div>

      {/* Purchases */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => {
          const purchasePrice = getPurchasePrice(purchase);
          const purchaseAmount = getPurchaseAmount(purchase);
          const purchaseIcon = getPurchaseIcon(purchase);
          const purchaseType = getPurchaseType(purchase);
          const purchaseStatus = getPurchaseStatus(purchase);
          const gameInfo = getGameInfo(purchase);
          const serverInfo = getServerInfo(purchase);
          const voucherNumber = generateVoucherNumber(purchase.id);
          const weeklyPass = isWeeklyPass(purchase);

          console.log('Rendering purchase:', purchase.id, 'Price:', purchasePrice); // Debug log

          return (
            <div
              key={purchase.id || purchase._id || Math.random()}
              className="p-4 sm:p-5 rounded-xl"
              style={{
                background: weeklyPass ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                border: weeklyPass ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: weeklyPass ? '0 6px 18px rgba(255,215,0,0.2)' : '0 6px 18px rgba(0,230,255,0.2)',
                color: '#fff',
              }}
            >
              {/* Voucher Number Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <FaTicketAlt className="text-cyan-400 text-lg" />
                  <span className="text-sm text-gray-300">Voucher Number:</span>
                  <span className="font-mono font-bold text-cyan-300">{voucherNumber}</span>
                </div>
                <button
                  onClick={() => copyVoucherNumber(voucherNumber)}
                  className="btn btn-xs btn-ghost text-xs text-cyan-400 hover:text-cyan-300"
                  title="Copy voucher number"
                >
                  {copiedVoucher === voucherNumber ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold flex items-center gap-1">
                      {purchaseIcon} {purchaseAmount}
                    </h3>
                    {getStatusBadge(purchaseStatus)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                    <p className="flex items-center gap-1">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-medium">{purchaseType}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <FaGamepad /> Game: {gameInfo}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaServer /> Server: {serverInfo}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaDollarSign /> Price: {formatPrice(purchasePrice)}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaClock /> Date: {formatDate(purchase.created_at)}
                    </p>
                  </div>

                  {/* Show payment details if available */}
                  {(purchase.payment_number || purchase.payment_name) && (
                    <div className="mt-3 p-2 bg-cyan-900/30 rounded">
                      <p className="text-xs text-cyan-300">
                        Payment: {purchase.payment_number} ({purchase.payment_name})
                      </p>
                    </div>
                  )}

                  {/* Show admin notes if available */}
                  {purchase.admin_notes && (
                    <div className="mt-2 p-2 bg-gray-700/30 rounded">
                      <p className="text-xs text-gray-300">
                        <strong>Admin Notes:</strong> {purchase.admin_notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-xl sm:text-2xl font-bold text-cyan-300">{formatPrice(purchasePrice)}</p>
                  <p className="text-sm text-gray-400 mt-1">{purchaseType}</p>
                </div>
              </div>

              {/* Special instructions for weekly pass */}
              {weeklyPass && purchaseStatus === 'Success' && (
                <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg">
                  <p className="text-xs text-yellow-300">
                    <strong>🎉 Weekly Pass Activated!</strong> Your weekly benefits are now active. 
                    This pass will automatically renew every week until cancelled.
                  </p>
                </div>
              )}

              {/* Instructions for using voucher number */}
              {purchaseStatus === 'Pending' && (
                <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg">
                  <p className="text-xs text-yellow-300">
                    <strong>Note:</strong> Use voucher number <code className="bg-yellow-800 px-1 rounded">{voucherNumber}</code> when 
                    contacting support about this order.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPurchases.length === 0 && (
        <div className="text-center py-12 text-white">
          <div className="text-5xl sm:text-6xl mb-3">📦</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {filterStatus === 'All' ? 'No purchases yet' : `No ${filterStatus.toLowerCase()} purchases`}
          </h3>
          <p className="text-gray-300 mb-4">
            {filterStatus === 'All'
              ? 'Your purchase history will appear here once you make your first order.'
              : `You don't have any ${filterStatus.toLowerCase()} purchases.`}
          </p>
          {filterStatus !== 'All' && (
            <button onClick={() => setFilterStatus('All')} className="btn btn-primary">
              View All Purchases
            </button>
          )}
        </div>
      )}

      {/* Information about voucher numbers */}
      <div className="mt-8 p-4 bg-cyan-900/20 rounded-lg">
        <h4 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-2">
          <FaTicketAlt /> About Voucher Numbers
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Each purchase has a unique voucher number (VOU-XXXXXXX)</li>
          <li>• Use this number when contacting customer support</li>
          <li>• Click the "Copy" button to easily share your voucher number</li>
          <li>• Voucher numbers help us quickly locate your order in our system</li>
        </ul>
      </div>
    </div>
  );
};

export default PurchaseHistory;
