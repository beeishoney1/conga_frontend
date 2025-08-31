import React, { useState, useEffect } from 'react';
import { api } from '../api/backendAPI';
import { FaGem, FaDollarSign, FaGamepad, FaServer, FaClock, FaCheckCircle, FaTicketAlt, FaCrown, FaCopy, FaFilter } from 'react-icons/fa';

const PurchaseHistory = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [copiedVoucher, setCopiedVoucher] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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
      setError('Failed to load purchase history');
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
      Pending: { class: 'bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '⏳' },
      Approved: { class: 'bg-green-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '✅' },
      Success: { class: 'bg-green-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '✅' },
      Processing: { class: 'bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '🔄' },
      Rejected: { class: 'bg-red-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '❌' },
      Failed: { class: 'bg-red-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '❌' },
      Cancelled: { class: 'bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '🚫' },
    };
    
    const config = statusConfig[status] || { class: 'bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs', icon: '❓' };

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
    if (purchase.price !== undefined && purchase.price !== null) {
      return purchase.price;
    }
    
    const amount = purchase.amount ?? purchase.diamond_amount;
    if (amount !== undefined && amount !== null) {
      const matchedPrice = prices.find((p) => p.amount == amount);
      if (matchedPrice) {
        return matchedPrice.price;
      }
    }
    
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
      return <FaCrown className="text-yellow-400 text-sm" />;
    }
    return <FaGem className="text-cyan-400 text-sm" />;
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

  const generateVoucherNumber = (purchaseId) => {
    if (!purchaseId) return 'N/A';
    const paddedId = purchaseId.toString().padStart(6, '0');
    return `V${paddedId}`;
  };

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
        <h2 className="text-xl font-bold mb-4">Purchase History</h2>
        <span className="loading loading-spinner loading-md text-cyan-400"></span>
        <p className="mt-2 text-sm">Loading your purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Purchase History</h2>
        <div className="alert alert-error text-sm py-2">{error}</div>
        <button onClick={loadPurchaseHistory} className="btn btn-primary btn-sm mt-2">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Purchase History</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-sm flex items-center gap-1"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <FaFilter className="text-xs" />
          Filter
        </button>
      </div>

      {/* Status Filter */}
      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-1 p-2 rounded-lg" style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
        }}>
          {availableStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                filterStatus === status 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {status} <span className="ml-1 bg-gray-700 px-1 rounded">{statusCounts[status] || 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Purchases */}
      <div className="space-y-3">
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

          return (
            <div
              key={purchase.id || purchase._id || Math.random()}
              className="p-3 rounded-lg"
              style={{
                background: weeklyPass ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                border: weeklyPass ? '1px solid rgba(255,215,0,0.2)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {purchaseIcon}
                  <span className="font-semibold text-sm">{purchaseAmount}</span>
                  {getStatusBadge(purchaseStatus)}
                </div>
                <span className="text-cyan-300 font-bold text-sm">{formatPrice(purchasePrice)}</span>
              </div>

              {/* Voucher Number */}
              <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                <span>Voucher: {voucherNumber}</span>
                <button
                  onClick={() => copyVoucherNumber(voucherNumber)}
                  className="flex items-center gap-1 hover:text-cyan-300"
                  title="Copy voucher number"
                >
                  <FaCopy className="text-xs" />
                  {copiedVoucher === voucherNumber ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                <div className="flex items-center gap-1">
                  <FaGamepad className="text-gray-400" />
                  <span>{gameInfo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaServer className="text-gray-400" />
                  <span>{serverInfo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-gray-400" />
                  <span>{formatDate(purchase.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaDollarSign className="text-gray-400" />
                  <span>{purchaseType}</span>
                </div>
              </div>

              {/* Additional Info */}
              {(purchase.payment_number || purchase.admin_notes) && (
                <div className="mt-2 p-2 rounded text-xs" style={{
                  background: 'rgba(0,0,0,0.2)',
                }}>
                  {purchase.payment_number && (
                    <p className="text-cyan-300 mb-1">
                      Payment: {purchase.payment_number} ({purchase.payment_name})
                    </p>
                  )}
                  {purchase.admin_notes && (
                    <p className="text-yellow-300">
                      <strong>Note:</strong> {purchase.admin_notes}
                    </p>
                  )}
                </div>
              )}

              {/* Weekly Pass Info */}
              {weeklyPass && purchaseStatus === 'Success' && (
                <div className="mt-2 p-1 rounded text-xs text-yellow-300" style={{
                  background: 'rgba(255,215,0,0.1)',
                }}>
                  🎉 Weekly Pass Activated
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPurchases.length === 0 && (
        <div className="text-center py-8 text-white">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-sm font-semibold mb-1">
            {filterStatus === 'All' ? 'No purchases yet' : `No ${filterStatus.toLowerCase()} purchases`}
          </h3>
          <p className="text-gray-300 text-xs mb-3">
            {filterStatus === 'All'
              ? 'Your purchase history will appear here.'
              : `Try a different filter.`}
          </p>
          {filterStatus !== 'All' && (
            <button 
              onClick={() => setFilterStatus('All')} 
              className="btn btn-primary btn-sm text-xs"
            >
              View All
            </button>
          )}
        </div>
      )}

      {/* Voucher Info */}
      <div className="mt-4 p-2 rounded-lg text-xs" style={{
        background: 'rgba(0,230,255,0.1)',
      }}>
        <p className="text-cyan-300 font-semibold mb-1">💡 Voucher Numbers</p>
        <p className="text-gray-300">Use voucher numbers when contacting support for faster service.</p>
      </div>
    </div>
  );
};

export default PurchaseHistory;