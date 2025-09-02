const BASE_URL = 'https://congabackend.onrender.com';

export const api = {
  // Auth
  login: (username, password) => 
    fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(res => res.json()),

  register: (username, password, telegram_id) =>
    fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, telegram_id })
    }).then(res => res.json()),

  // Diamond Prices
  getDiamondPrices: (game_name, server_name) => {
    let url = `${BASE_URL}/diamond-prices`;
    if (game_name && server_name) {
      url += `?game_name=${game_name}&server_name=${server_name}`;
    } else if (game_name) {
      url += `?game_name=${game_name}`;
    }
    return fetch(url).then(res => res.json());
  },

  // Purchases - FIXED: Send packageId instead of amount
  buyDiamonds: (user_id, package_id, game_id, server_id, payment_number, payment_name) =>
    fetch(`${BASE_URL}/buy-diamond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user_id, 
        packageId: package_id,  // Changed from amount to packageId
        gameId: game_id, 
        serverId: server_id, 
        paymentNumber: payment_number,
        paymentName: payment_name
      })
    }).then(res => res.json()),

  getPurchaseHistory: (user_id) =>
    fetch(`${BASE_URL}/purchase-history?user_id=${user_id}`).then(res => res.json()),

  // Admin
  getAllPurchases: (status = 'Pending') =>
    fetch(`${BASE_URL}/admin/purchases?status=${status}`).then(res => res.json()),

  updatePurchaseStatus: (purchase_id, status, admin_notes) =>
    fetch(`${BASE_URL}/admin/update-purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchase_id, status, admin_notes })
    }).then(res => res.json()),

  getDiamondPricesAdmin: () =>
    fetch(`${BASE_URL}/admin/diamond-prices`).then(res => res.json()),

  createDiamondPrice: (game_name, server_name, amount, price) =>
    fetch(`${BASE_URL}/admin/diamond-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_name, server_name, amount, price })
    }).then(res => res.json()),

  updateDiamondPrice: (id, game_name, server_name, amount, price) =>
    fetch(`${BASE_URL}/admin/diamond-prices`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, game_name, server_name, amount, price })
    }).then(res => res.json()),

  deleteDiamondPrice: (id) =>
    fetch(`${BASE_URL}/admin/diamond-prices`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(res => res.json()),

  filterPurchases: (username) =>
    fetch(`${BASE_URL}/admin/filter-purchases?username=${username}`).then(res => res.json()),

  // Add this to your backendAPI.js file
getAllUsers: () =>
  fetch(`${BASE_URL}/admin/users`).then(res => res.json())
};
