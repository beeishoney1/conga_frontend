import React, { useState, useEffect } from 'react';
import { api } from '../api/backendAPI';

const AdminPanel = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPurchases();
    loadPrices();
  }, [selectedStatus]);

  const loadPurchases = async () => {
    try {
      const data = await api.getAllPurchases(selectedStatus);
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const loadPrices = async () => {
    try {
      const data = await api.getDiamondPricesAdmin();
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  const handleStatusUpdate = async (purchaseId, newStatus) => {
    try {
      setLoading(true);
      await api.updatePurchaseStatus(purchaseId, newStatus, 'Status updated by admin');
      alert('Status updated successfully');
      loadPurchases();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      
      {/* Status Filter */}
      <div className="flex gap-2 mb-4">
        <select 
          className="select select-bordered select-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="All">All</option>
        </select>
        <button onClick={loadPurchases} className="btn btn-sm btn-primary">
          Refresh
        </button>
      </div>

      {/* Purchases List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Purchase Requests ({purchases.length})</h3>
        <div className="space-y-3">
          {purchases.map(purchase => (
            <div key={purchase.id} className="card bg-base-100 shadow-sm p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{purchase.username}</p>
                  <p className="text-sm">{purchase.game_id} - {purchase.server_id}</p>
                  <p className="text-sm">{purchase.amount} diamonds</p>
                  <p className="text-xs text-gray-600">Status: {purchase.status}</p>
                </div>
                {purchase.status === 'Pending' && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleStatusUpdate(purchase.id, 'Success')}
                      className="btn btn-sm btn-success"
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(purchase.id, 'Failed')}
                      className="btn btn-sm btn-error"
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diamond Prices Management */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Diamond Prices</h3>
        <div className="space-y-3">
          {prices.map(price => (
            <div key={price.id} className="card bg-base-100 shadow-sm p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{price.amount} diamonds</p>
                  <p className="text-sm">{price.game_name} - {price.server_name}</p>
                  <p className="text-sm">${price.price}</p>
                </div>
                <div className="flex gap-1">
                  <button className="btn btn-sm btn-warning">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;