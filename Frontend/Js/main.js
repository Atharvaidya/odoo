// frontend/public/js/main.js
// API base for Option A: prefix '/data' on local Flask -> full URL
const API_BASE = window.API_BASE || 'http://127.0.0.1:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  // Activate nav link matching pathname (compare only filename)
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a => {
    try {
      const href = a.getAttribute('href') || '';
      const hrefFile = href.split('/').pop().toLowerCase();
      if (hrefFile === path) a.classList.add('active');
    } catch (e) { /* ignore malformed links */ }
  });

  // Normalize page checks (handle plural/singular and small naming differences)
  if (path.includes('dashboard')) populateDashboard();
  if (path.includes('product') && path.includes('list')) populateProducts();
  if (path.includes('product') && path.includes('update')) populateProductUpdateForm();
  if (path.includes('receipt') && path.includes('list')) populateReceipts();
  if (path.includes('receipt') && path.includes('create')) { /* nothing to auto-fill */ }
  if (path.includes('delivery') && path.includes('list')) populateDeliveries();
  if (path.includes('delivery') && path.includes('create')) { /* create handler attaches below */ }
  if (path.includes('transfer') && path.includes('list')) populateTransfers();
  if (path.includes('transfer') && path.includes('create')) { /* create handler attaches below */ }
  if (path.includes('adjust') && path.includes('list')) populateAdjustments();
  if (path.includes('adjust') && path.includes('create')) { /* create handler attaches below */ }
  if (path.includes('move') && path.includes('history')) populateMoves();

  // Attach handlers (only attach if forms exist)
  attachLoginHandler();
  attachRegisterHandler();
  attachProductCreateHandler();
  attachReceiptsCreateHandler();
  attachDeliveryCreateHandler();
  attachTransferCreateHandler();
  attachAdjustmentCreateHandler();
  attachProductUpdateHandler();
});

/**
 * Generic fetch -> returns parsed JSON or throws Error with useful message.
 * If you pass a relative api path (like '/products') it will be prefixed with API_BASE.
 */
async function fetchJson(url, opts = {}) {
  try {
    // If url looks like a path (starts with '/'), prefix API_BASE.
    let finalUrl = url;
    if (typeof url === 'string' && url.startsWith('/')) {
      finalUrl = API_BASE + url;
    }

    // Build headers, include token if available
    const headers = Object.assign({}, opts.headers || {});
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = 'Bearer ' + token;
    // Ensure fetch sends cookies when backend uses sessions
    const fetchOpts = Object.assign({}, opts, { credentials: 'include', headers });

    const res = await fetch(finalUrl, fetchOpts);
    // Try to get text if not ok for more helpful error
    if (!res.ok) {
      let errText = '';
      try { errText = await res.text(); } catch (e) { errText = res.statusText; }
      throw new Error(errText || `HTTP ${res.status}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return await res.json();
    // If no JSON returned, return null for callers that expect no body
    return null;
  } catch (err) {
    console.error('fetchJson error:', err);
    throw err;
  }
}

// ------------------- Populate functions -------------------
async function populateDashboard() {
  const row = document.querySelector('.kpi-row');
  if (!row) return;
  row.innerHTML = '';
  try {
    // backend expected: GET /data/kpis
    const kpis = await fetchJson('/kpis'); // becomes API_BASE + '/kpis'
    (kpis || []).forEach(k => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${k.title || k.t}</h3><p>${k.value || k.v}</p>`;
      row.appendChild(card);
    });
  } catch (err) {
    // fallback sample KPIs
    const kpis = [
      { t: 'Total Products', v: 1245 },
      { t: 'Low Stock', v: 31 },
      { t: 'Pending Receipts', v: 5 },
      { t: 'Pending Deliveries', v: 3 },
      { t: 'Internal Transfers', v: 2 }
    ];
    kpis.forEach(k => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${k.t}</h3><p>${k.v}</p>`;
      row.appendChild(card);
    });
  }
}

async function populateProducts() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const data = await fetchJson('/products');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const idOrSku = d.id || d.sku || '';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.sku || '')}</td><td>${escapeHtml(d.category || d.cat || '')}</td><td>${escapeHtml(String(d.stock || ''))}</td><td><a href="product-update.html?id=${encodeURIComponent(idOrSku)}" class="btn secondary">Edit</a></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load products</td></tr>';
  }
}

async function populateReceipts() {
  const tbody = document.getElementById('receipts-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const data = await fetchJson('/receipts');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.supplier)}</td><td>${escapeHtml(d.status)}</td><td>${escapeHtml(d.date)}</td><td><button class="btn secondary">View</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load receipts</td></tr>';
  }
}

async function populateDeliveries() {
  const tbody = document.getElementById('deliveries-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const data = await fetchJson('/deliveries');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.customer)}</td><td>${escapeHtml(d.status)}</td><td>${escapeHtml(d.date)}</td><td><button class="btn secondary">View</button></td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load deliveries</td></tr>';
  }
}

async function populateTransfers() {
  const tbody = document.getElementById('transfers-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const data = await fetchJson('/transfers');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.from)}</td><td>${escapeHtml(d.to)}</td><td>${escapeHtml(d.status)}</td><td>${escapeHtml(d.date)}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load transfers</td></tr>';
  }
}

async function populateAdjustments() {
  const tbody = document.getElementById('adjustments-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const data = await fetchJson('/adjustments');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.product)}</td><td>${escapeHtml(String(d.recorded || ''))}</td><td>${escapeHtml(String(d.counted || ''))}</td><td>${escapeHtml(String(d.diff || ''))}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load adjustments</td></tr>';
  }
}

async function populateMoves() {
  const tbody = document.getElementById('moves-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  try {
    const data = await fetchJson('/moves');
    tbody.innerHTML = '';
    (data || []).forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${escapeHtml(d.id)}</td><td>${escapeHtml(d.type)}</td><td>${escapeHtml(d.sku)}</td><td>${escapeHtml(String(d.qty || ''))}</td><td>${escapeHtml(d.from)}</td><td>${escapeHtml(d.to)}</td><td>${escapeHtml(d.date)}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="7">Failed to load move history</td></tr>';
  }
}

// ------------------- Form handlers -------------------
function attachLoginHandler() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = (document.getElementById('login-email') || {}).value;
    const password = (document.getElementById('login-password') || {}).value;
    try {
      const data = await fetchJson('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (data && data.token) localStorage.setItem('authToken', data.token);
      window.location = 'dashboard.html';
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + (err.message || 'unknown error'));
    }
  });
}

function attachRegisterHandler() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch(API_BASE + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Registration failed');
      }

      const data = await response.json();

      // auto login after register
      localStorage.setItem('authToken', data.token || '');

      window.location.href = 'dashboard.html';

    } catch (error) {
      console.error('REGISTER ERROR:', error);
      alert('Cannot register: ' + error.message);
    }
  });
}

function attachProductCreateHandler() {
  const form = document.getElementById('product-create-form') || document.getElementById('product-create-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      name: (document.getElementById('product-name') || {}).value,
      sku: (document.getElementById('product-sku') || {}).value,
      category: (document.getElementById('product-category') || {}).value,
      uom: (document.getElementById('product-uom') || {}).value,
      stock: Number((document.getElementById('product-stock') || {}).value) || 0
    };
    try {
      await fetchJson('/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Product created');
      window.location = 'products-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to create product: ' + (err.message || 'unknown'));
    }
  });
}

function attachReceiptsCreateHandler() {
  const form = document.getElementById('receipts-create-form') || document.getElementById('receipts-create-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      supplier: (document.getElementById('receipt-supplier') || {}).value,
      sku: (document.getElementById('receipt-sku') || {}).value,
      qty: Number((document.getElementById('receipt-qty') || {}).value) || 0
    };
    try {
      await fetchJson('/receipts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Receipt created');
      window.location = 'receipts-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to create receipt: ' + (err.message || 'unknown'));
    }
  });
}

function attachDeliveryCreateHandler() {
  const form = document.getElementById('delivery-create-form') || document.getElementById('delivery-create-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      customer: (document.getElementById('delivery-customer') || {}).value,
      sku: (document.getElementById('delivery-sku') || {}).value,
      qty: Number((document.getElementById('delivery-qty') || {}).value) || 0
    };
    try {
      await fetchJson('/deliveries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Delivery created');
      window.location = 'delivery-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to create delivery: ' + (err.message || 'unknown'));
    }
  });
}

function attachTransferCreateHandler() {
  const form = document.getElementById('transfer-create-form') || document.getElementById('transfer-create-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      from: (document.getElementById('transfer-from') || {}).value,
      to: (document.getElementById('transfer-to') || {}).value,
      sku: (document.getElementById('transfer-sku') || {}).value,
      qty: Number((document.getElementById('transfer-qty') || {}).value) || 0
    };
    try {
      await fetchJson('/transfers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Transfer created');
      window.location = 'transfer-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to create transfer: ' + (err.message || 'unknown'));
    }
  });
}

function attachAdjustmentCreateHandler() {
  const form = document.getElementById('adjustment-create-form') || document.getElementById('adjustment-create-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
      sku: (document.getElementById('adjust-sku') || {}).value,
      location: (document.getElementById('adjust-location') || {}).value,
      counted: Number((document.getElementById('adjust-counted') || {}).value) || 0
    };
    try {
      await fetchJson('/adjustments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Adjustment recorded');
      window.location = 'adjustments-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to record adjustment: ' + (err.message || 'unknown'));
    }
  });
}

function attachProductUpdateHandler() {
  const form = document.getElementById('product-update-form') || document.getElementById('product-update-form-alt');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || (document.getElementById('product-sku') || {}).value;
    const payload = {
      name: (document.getElementById('product-name') || {}).value,
      sku: (document.getElementById('product-sku') || {}).value,
      category: (document.getElementById('product-category') || {}).value,
      uom: (document.getElementById('product-uom') || {}).value
    };
    try {
      await fetchJson(`/products/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Product updated');
      window.location = 'products-list.html';
    } catch (err) {
      console.error(err);
      alert('Failed to update product: ' + (err.message || 'unknown'));
    }
  });
}

async function populateProductUpdateForm() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) return;
  try {
    const data = await fetchJson(`/products/${encodeURIComponent(id)}`);
    if (!data) return;
    const nameEl = document.getElementById('product-name'); if (nameEl) nameEl.value = data.name || '';
    const skuEl = document.getElementById('product-sku'); if (skuEl) skuEl.value = data.sku || id;
    const catEl = document.getElementById('product-category'); if (catEl) catEl.value = data.category || data.cat || '';
    const uomEl = document.getElementById('product-uom'); if (uomEl) uomEl.value = data.uom || data.uom || '';
  } catch (err) {
    console.warn('populateProductUpdateForm failed', err);
  }
}

// ------------------- Helpers -------------------
function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"'`=\/]/g, function (c) {
    return {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
    }[c];
  });
}
