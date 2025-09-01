import React, { useState, useEffect } from 'react';
import { api } from '../api/backendAPI';
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaEdit, FaTrash, FaSearch, FaSync, FaBars, FaTimes } from 'react-icons/fa';

const AdminPanel = ({ user }) => {
  const [allPurchases, setAllPurchases] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [priceToDelete, setPriceToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Diamond price form state
  const [priceForm, setPriceForm] = useState({
    id: '',
    game_name: '',
    server_name: '',
    amount: '',
    price: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Filter purchases based on active tab and username filter
  const filteredPurchases = allPurchases.filter(purchase => {
    const statusMatch = activeTab === 'all' || purchase.status.toLowerCase() === activeTab;
    const usernameMatch = !usernameFilter || 
      purchase.username.toLowerCase().includes(usernameFilter.toLowerCase());
    return statusMatch && usernameMatch;
  });

  useEffect(() => {
    if (activeTab !== 'prices') {
      loadPurchases();
    } else {
      loadPrices();
    }
  }, [activeTab]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const data = await api.getAllPurchases('All');
      setAllPurchases(data.purchases || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
      showAlert('Error loading purchases: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      setLoading(true);
      const data = await api.getDiamondPricesAdmin();
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error loading prices:', error);
      showAlert('Error loading prices: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    // Create a temporary alert element
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform animate-pop-in ${
      type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'
    } text-white`;
    alert.innerHTML = `
      <div class="flex items-center gap-2">
        ${type === 'error' ? '<FaTimesCircle />' : type === 'success' ? '<FaCheckCircle />' : '<FaClock />'}
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alert.remove();
    }, 3000);
  };

  const handleStatusUpdate = async (purchaseId, newStatus) => {
    try {
      setLoading(true);
      await api.updatePurchaseStatus(purchaseId, newStatus, adminNotes || 'Status updated by admin');
      showAlert(`Purchase ${newStatus.toLowerCase()} successfully!`, 'success');
      setAdminNotes('');
      setSelectedPurchase(null);
      loadPurchases();
    } catch (error) {
      showAlert('Error updating status: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!priceForm.game_name.trim()) errors.game_name = 'Game name is required';
    if (!priceForm.server_name.trim()) errors.server_name = 'Server name is required';
    if (!priceForm.amount || parseInt(priceForm.amount) <= 0) errors.amount = 'Valid amount is required';
    if (!priceForm.price || parseFloat(priceForm.price) <= 0) errors.price = 'Valid price is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePriceFormChange = (e) => {
    const { name, value } = e.target;
    setPriceForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreatePrice = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await api.createDiamondPrice(
        priceForm.game_name.trim(),
        priceForm.server_name.trim(),
        parseInt(priceForm.amount),
        parseFloat(priceForm.price)
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      showAlert('Price created successfully!', 'success');
      setPriceForm({ id: '', game_name: '', server_name: '', amount: '', price: '' });
      setFormErrors({});
      loadPrices();
    } catch (error) {
      console.error('Create error:', error);
      showAlert('Error creating price: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await api.updateDiamondPrice(
        priceForm.id,
        priceForm.game_name.trim(),
        priceForm.server_name.trim(),
        parseInt(priceForm.amount),
        parseFloat(priceForm.price)
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      showAlert('Price updated successfully!', 'success');
      setPriceForm({ id: '', game_name: '', server_name: '', amount: '', price: '' });
      setFormErrors({});
      setIsEditing(false);
      loadPrices();
    } catch (error) {
      console.error('Update error:', error);
      showAlert('Error updating price: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrice = (price) => {
    setPriceForm({
      id: price.id,
      game_name: price.game_name,
      server_name: price.server_name,
      amount: price.amount.toString(),
      price: price.price.toString()
    });
    setIsEditing(true);
    setFormErrors({});
  };

  const handleDeletePrice = async (id) => {
    try {
      setLoading(true);
      const response = await api.deleteDiamondPrice(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      showAlert('Price deleted successfully!', 'success');
      setPriceToDelete(null);
      setShowDeleteConfirm(false);
      loadPrices();
    } catch (error) {
      console.error('Delete error:', error);
      showAlert('Error deleting price: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setPriceForm({ id: '', game_name: '', server_name: '', amount: '', price: '' });
    setIsEditing(false);
    setFormErrors({});
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'bg-yellow-500 text-white', icon: <FaClock className="text-xs" /> },
      'Success': { class: 'bg-green-600 text-white', icon: <FaCheckCircle className="text-xs" /> },
      'Failed': { class: 'bg-red-600 text-white', icon: <FaTimesCircle className="text-xs" /> }
    };
    
    const config = statusConfig[status] || { class: 'bg-gray-600 text-white', icon: null };
    
    return (
      <span className={`badge flex items-center gap-1 ${config.class} px-2 py-1 rounded-full text-xs`}>
        {config.icon} {status}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const openPurchaseDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setAdminNotes(purchase.admin_notes || '');
  };

  const closePurchaseDetails = () => {
    setSelectedPurchase(null);
    setAdminNotes('');
  };

  const confirmDeletePrice = (price) => {
    setPriceToDelete(price);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="p-2 max-w-full mx-auto bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <button 
          className="md:hidden text-white p-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Tabs - Mobile optimized */}
      <div className={`tabs mb-3 ${mobileMenuOpen ? 'flex flex-col gap-1' : 'hidden md:flex overflow-x-auto'} rounded-lg bg-gray-800 p-1`}>
        <button 
          className={`tab ${activeTab === 'pending' ? 'tab-active bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${mobileMenuOpen ? 'w-full justify-center' : ''} px-3 py-1 rounded-md transition-colors`}
          onClick={() => {
            setActiveTab('pending');
            setMobileMenuOpen(false);
          }}
        >
          <FaClock className="mr-1" /> Pending
        </button>
        <button 
          className={`tab ${activeTab === 'success' ? 'tab-active bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${mobileMenuOpen ? 'w-full justify-center' : ''} px-3 py-1 rounded-md transition-colors`}
          onClick={() => {
            setActiveTab('success');
            setMobileMenuOpen(false);
          }}
        >
          <FaCheckCircle className="mr-1" /> Success
        </button>
        <button 
          className={`tab ${activeTab === 'failed' ? 'tab-active bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${mobileMenuOpen ? 'w-full justify-center' : ''} px-3 py-1 rounded-md transition-colors`}
          onClick={() => {
            setActiveTab('failed');
            setMobileMenuOpen(false);
          }}
        >
          <FaTimesCircle className="mr-1" /> Failed
        </button>
        <button 
          className={`tab ${activeTab === 'all' ? 'tab-active bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${mobileMenuOpen ? 'w-full justify-center' : ''} px-3 py-1 rounded-md transition-colors`}
          onClick={() => {
            setActiveTab('all');
            setMobileMenuOpen(false);
          }}
        >
          All
        </button>
        <button 
          className={`tab ${activeTab === 'prices' ? 'tab-active bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'} ${mobileMenuOpen ? 'w-full justify-center' : ''} px-3 py-1 rounded-md transition-colors`}
          onClick={() => {
            setActiveTab('prices');
            setMobileMenuOpen(false);
          }}
        >
          Prices
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-2">
          <div className="loading loading-spinner loading-md text-cyan-400"></div>
        </div>
      )}

      {/* Purchase Details Modal */}
      {selectedPurchase && (
        <div className="modal modal-open">
          <div
            className="modal-box p-3 max-w-xs mx-auto animate-pop-in"
            style={{
              background: 'rgba(30,30,30,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
          >
            <h3 className="font-bold text-md mb-2 text-cyan-300 flex items-center gap-1">
              <FaEye className="text-sm" /> Order #{selectedPurchase.id}
            </h3>
            
            <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Username:</span>
                <span className="text-cyan-300 text-xs">{selectedPurchase.username}</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Game:</span>
                <span className="text-cyan-300 text-xs">{selectedPurchase.game_id}</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Server:</span>
                <span className="text-cyan-300 text-xs">{selectedPurchase.server_id}</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Amount:</span>
                <span className="text-cyan-300 text-xs">{selectedPurchase.amount} diamonds</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Payment:</span>
                <span className="text-cyan-300 text-xs">{selectedPurchase.payment_number} ({selectedPurchase.payment_name})</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Status:</span>
                {getStatusBadge(selectedPurchase.status)}
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Created:</span>
                <span className="text-xs text-cyan-300">{formatDateTime(selectedPurchase.created_at)}</span>
              </div>
              
              <div className="flex justify-between items-center p-1 rounded bg-gray-700">
                <span className="font-semibold text-xs">Updated:</span>
                <span className="text-xs text-cyan-300">{formatDateTime(selectedPurchase.updated_at)}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="label p-0 mb-1">
                <span className="label-text text-white text-xs font-semibold">Admin Notes</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full bg-gray-700 text-white placeholder-gray-400 text-xs p-2 border-gray-600" 
                placeholder="Add admin notes here..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />
              
              {selectedPurchase.admin_notes && (
                <div className="mt-1 p-1 rounded bg-gray-800">
                  <p className="text-xs font-semibold text-cyan-300">Current Notes:</p>
                  <p className="text-xs text-gray-300">{selectedPurchase.admin_notes}</p>
                </div>
              )}
            </div>
            
            <div className="modal-action flex flex-col gap-1 p-0">
              <button 
                className="btn btn-sm w-full bg-gray-600 hover:bg-gray-500 text-white border-0"
                onClick={closePurchaseDetails}
              >
                Close
              </button>
              
              {selectedPurchase.status === 'Pending' && (
                <div className="flex gap-1 w-full">
                  <button 
                    className="btn btn-sm flex-1 bg-green-600 hover:bg-green-500 text-white border-0"
                    onClick={() => handleStatusUpdate(selectedPurchase.id, 'Success')}
                    disabled={loading}
                  >
                    <FaCheckCircle className="text-xs mr-1" /> Approve
                  </button>
                  <button 
                    className="btn btn-sm flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
                    onClick={() => handleStatusUpdate(selectedPurchase.id, 'Failed')}
                    disabled={loading}
                  >
                    <FaTimesCircle className="text-xs mr-1" /> Reject
                  </button>
                </div>
              )}
              
              {selectedPurchase.status !== 'Pending' && (
                <button 
                  className="btn btn-sm w-full bg-cyan-600 hover:bg-cyan-500 text-white border-0"
                  onClick={() => handleStatusUpdate(selectedPurchase.id, selectedPurchase.status)}
                  disabled={loading}
                >
                  Update Notes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && priceToDelete && (
        <div className="modal modal-open">
          <div
            className="modal-box p-3 max-w-xs mx-auto animate-pop-in"
            style={{
              background: 'rgba(30,30,30,0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
          >
            <h3 className="font-bold text-md mb-2 text-red-400 flex items-center gap-1">
              <FaTimesCircle className="text-sm" /> Confirm Deletion
            </h3>
            
            <p className="mb-3 text-center text-sm">
              Are you sure you want to delete this price?
            </p>
            
            <div className="bg-gray-700 p-2 rounded mb-3 text-sm">
              <p className="text-center font-semibold">
                {priceToDelete.amount} diamonds
              </p>
              <p className="text-center text-cyan-300">
                {priceToDelete.game_name} - {priceToDelete.server_name}
              </p>
              <p className="text-center text-yellow-300">
                ${priceToDelete.price}
              </p>
            </div>

            <div className="modal-action flex gap-1 p-0">
              <button 
                className="btn btn-sm flex-1 bg-gray-600 hover:bg-gray-500 text-white border-0"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-sm flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
                onClick={() => handleDeletePrice(priceToDelete.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchases Tabs */}
      {activeTab !== 'prices' && (
        <div>
          {/* User Filter */}
          <div className="mb-3">
            <div className="flex gap-1 items-center">
              <div className="relative flex-1">
                <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Filter by username"
                  className="input input-bordered input-xs pl-6 w-full bg-gray-700 text-white placeholder-gray-400 text-xs border-gray-600"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                />
              </div>
              <button 
                onClick={loadPurchases} 
                className="btn btn-xs bg-cyan-600 hover:bg-cyan-500 text-white border-0"
                disabled={loading}
              >
                <FaSync className={loading ? 'animate-spin text-xs' : 'text-xs'} />
              </button>
              {usernameFilter && (
                <button 
                  className="btn btn-xs bg-gray-600 hover:bg-gray-500 text-white border-0"
                  onClick={() => setUsernameFilter('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Purchases Table */}
          <div className="overflow-x-auto rounded-lg bg-gray-800 text-xs">
            <table className="table table-zebra table-xs w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-white p-1">User</th>
                  <th className="text-white p-1">Game/Server</th>
                  <th className="text-white p-1">Amount</th>
                  <th className="text-white p-1">Status</th>
                  <th className="text-white p-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400 text-xs">
                      No {activeTab !== 'all' ? activeTab : ''} purchases found
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map(purchase => (
                    <tr key={purchase.id} className="hover:bg-gray-700 transition-colors">
                      <td className="font-semibold text-cyan-300 p-1">{purchase.username}</td>
                      <td className="p-1">
                        <div className="text-xs">{purchase.game_id}</div>
                        <div className="text-xxs text-gray-400">{purchase.server_id}</div>
                      </td>
                      <td className="text-yellow-300 p-1">{purchase.amount}</td>
                      <td className="p-1">{getStatusBadge(purchase.status)}</td>
                      <td className="p-1">
                        <button 
                          onClick={() => openPurchaseDetails(purchase)}
                          className="btn btn-xxs bg-cyan-600 hover:bg-cyan-500 text-white p-0 h-5 w-10 min-h-0 border-0"
                          disabled={loading}
                        >
                          <FaEye className="text-xxs" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prices Tab */}
      {activeTab === 'prices' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-white">Diamond Prices</h3>
            <button 
              onClick={loadPrices} 
              className="btn btn-xs bg-cyan-600 hover:bg-cyan-500 text-white border-0"
              disabled={loading}
            >
              <FaSync className={loading ? 'animate-spin text-xs' : 'text-xs'} />
            </button>
          </div>

          {/* Price Form */}
          <form onSubmit={isEditing ? handleUpdatePrice : handleCreatePrice} 
            className="card p-2 mb-3 bg-gray-800 rounded-lg border border-gray-700 text-xs">
            <h4 className="font-semibold mb-2 text-cyan-300 flex items-center gap-1">
              <FaEdit className="text-xs" /> {isEditing ? 'Edit Price' : 'Create New Price'}
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="form-control">
                <label className="label p-0 mb-1 text-white">Game Name</label>
                <input
                  type="text"
                  name="game_name"
                  placeholder="Game Name"
                  className={`input input-bordered input-xs bg-gray-700 text-white border-gray-600 ${formErrors.game_name ? 'input-error border-red-500' : ''}`}
                  value={priceForm.game_name}
                  onChange={handlePriceFormChange}
                />
                {formErrors.game_name && <span className="text-red-400 text-xxs mt-1">{formErrors.game_name}</span>}
              </div>
              
              <div className="form-control">
                <label className="label p-0 mb-1 text-white">Server Name</label>
                <input
                  type="text"
                  name="server_name"
                  placeholder="Server Name"
                  className={`input input-bordered input-xs bg-gray-700 text-white border-gray-600 ${formErrors.server_name ? 'input-error border-red-500' : ''}`}
                  value={priceForm.server_name}
                  onChange={handlePriceFormChange}
                />
                {formErrors.server_name && <span className="text-red-400 text-xxs mt-1">{formErrors.server_name}</span>}
              </div>
              
              <div className="form-control">
                <label className="label p-0 mb-1 text-white">Diamond Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Diamond Amount"
                  className={`input input-bordered input-xs bg-gray-700 text-white border-gray-600 ${formErrors.amount ? 'input-error border-red-500' : ''}`}
                  value={priceForm.amount}
                  onChange={handlePriceFormChange}
                />
                {formErrors.amount && <span className="text-red-400 text-xxs mt-1">{formErrors.amount}</span>}
              </div>
              
              <div className="form-control">
                <label className="label p-0 mb-1 text-white">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  placeholder="Price"
                  className={`input input-bordered input-xs bg-gray-700 text-white border-gray-600 ${formErrors.price ? 'input-error border-red-500' : ''}`}
                  value={priceForm.price}
                  onChange={handlePriceFormChange}
                />
                {formErrors.price && <span className="text-red-400 text-xxs mt-1">{formErrors.price}</span>}
              </div>
            </div>
              
            <div className="flex gap-1 mt-2">
              <button 
                type="submit" 
                className="btn btn-xs flex-1 bg-cyan-600 hover:bg-cyan-500 text-white border-0"
                disabled={loading}
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-xs bg-gray-600 hover:bg-gray-500 text-white border-0"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Prices Table */}
          <div className="overflow-x-auto rounded-lg bg-gray-800 text-xs">
            <table className="table table-zebra table-xs w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="text-white p-1">Game</th>
                  <th className="text-white p-1">Server</th>
                  <th className="text-white p-1">Amount</th>
                  <th className="text-white p-1">Price</th>
                  <th className="text-white p-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400 text-xs">
                      No prices found. Create your first price above.
                    </td>
                  </tr>
                ) : (
                  prices.map(price => (
                    <tr key={price.id} className="hover:bg-gray-700 transition-colors">
                      <td className="font-semibold text-cyan-300 p-1">{price.game_name}</td>
                      <td className="text-white p-1">{price.server_name}</td>
                      <td className="text-yellow-300 p-1">{price.amount}</td>
                      <td className="text-green-300 p-1">${price.price}</td>
                      <td className="p-1">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEditPrice(price)}
                            className="btn btn-xxs bg-yellow-600 hover:bg-yellow-500 text-white p-0 h-5 w-5 min-h-0 border-0"
                            disabled={loading}
                          >
                            <FaEdit className="text-xxs" />
                          </button>
                          <button 
                            onClick={() => confirmDeletePrice(price)}
                            className="btn btn-xxs bg-red-600 hover:bg-red-500 text-white p-0 h-5 w-5 min-h-0 border-0"
                            disabled={loading}
                          >
                            <FaTrash className="text-xxs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.2s ease-out forwards;
        }
        .text-xxs {
          font-size: 0.65rem;
        }
        .btn-xxs {
          height: 1.25rem;
          min-height: 1.25rem;
          padding-left: 0.35rem;
          padding-right: 0.35rem;
          font-size: 0.65rem;
        }
        .input-xs {
          height: 1.75rem;
          min-height: 1.75rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          font-size: 0.75rem;
        }
        .table-xs td, .table-xs th {
          padding: 0.25rem;
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;