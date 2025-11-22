// Frontend API base (override by setting `window.API_BASE` in global scope)
// Default set to `/data` to match the repository's data folder connected to backend.
const API_BASE = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
  // Activate nav link matching pathname
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // If dashboard, populate KPIs
  if (path === 'dashboard.html') populateDashboard();
  // If product list page, populate table
  if (path === 'product-list.html') populateProducts();
  if (path === 'product-update.html') populateProductUpdateForm();
  if (path === 'receipts-list.html') populateReceipts();
  if (path === 'delivery-list.html') populateDeliveries();
  if (path === 'transfer-list.html') populateTransfers();
  if (path === 'adjustments-list.html') populateAdjustments();
  if (path === 'move-history.html') populateMoves();
  // Attach example form handlers (if present)
  attachLoginHandler();
  attachRegisterHandler();
  attachProductCreateHandler();
  attachReceiptsCreateHandler();
  attachDeliveryCreateHandler();
  attachTransferCreateHandler();
  attachAdjustmentCreateHandler();
  attachProductUpdateHandler();
});

async function fetchJson(url, opts){
  try{
    const headers = (opts && opts.headers) ? Object.assign({}, opts.headers) : {};
    const token = localStorage.getItem('authToken');
    if(token) headers['Authorization'] = 'Bearer ' + token;
    const merged = Object.assign({}, opts || {}, {credentials:'include', headers});
    const res = await fetch(url, merged);
    if(!res.ok){
      const txt = await res.text();
      throw new Error(txt || res.statusText);
    }
    const ct = res.headers.get('content-type') || '';
    if(ct.includes('application/json')) return await res.json();
    return null;
  }catch(err){
    console.error('fetchJson', url, err);
    throw err;
  }
}

// Dummy data functions (replace with API calls)
async function populateDashboard(){
  const row = document.querySelector('.kpi-row');
  if(!row) return;
  row.innerHTML = '';
  try{
    const kpis = await fetchJson(`${API_BASE}/kpis`);
    (kpis || []).forEach(k=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${k.title||k.t}</h3><p>${k.value||k.v}</p>`;
      row.appendChild(card);
    });
  }catch(_){
    // fallback to local sample KPIs
    const kpis = [
      {t:'Total Products', v: 1245},
      {t:'Low Stock', v: 31},
      {t:'Pending Receipts', v: 5},
      {t:'Pending Deliveries', v: 3},
      {t:'Internal Transfers', v: 2}
    ];
    kpis.forEach(k=>{ const card = document.createElement('div'); card.className='card'; card.innerHTML = `<h3>${k.t}</h3><p>${k.v}</p>`; row.appendChild(card); });
  }
}

async function populateProducts(){
  const tbody = document.getElementById('products-tbody');
  if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try{
    const data = await fetchJson(`${API_BASE}/products`);
    tbody.innerHTML = '';
    (data || []).forEach(d=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${d.name}</td><td>${d.sku}</td><td>${d.category||d.cat||''}</td><td>${d.stock||''}</td><td><a href="product-update.html?id=${encodeURIComponent(d.id||d.sku||'')}" class="btn secondary">Edit</a></td>`;
      tbody.appendChild(tr);
    });
  }catch(err){
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Failed to load products</td></tr>';
  }
}

async function populateReceipts(){
  const tbody = document.getElementById('receipts-tbody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try{
    const data = await fetchJson(`${API_BASE}/receipts`);
    tbody.innerHTML = '';
    (data||[]).forEach(d=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.supplier}</td><td>${d.status}</td><td>${d.date}</td><td><button class="btn secondary">View</button></td>`; tbody.appendChild(tr); });
  }catch(err){ console.error(err); tbody.innerHTML = '<tr><td colspan="5">Failed to load receipts</td></tr>'; }
}
async function populateDeliveries(){
  const tbody = document.getElementById('deliveries-tbody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try{ const data = await fetchJson(`${API_BASE}/deliveries`); tbody.innerHTML=''; (data||[]).forEach(d=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.customer}</td><td>${d.status}</td><td>${d.date}</td><td><button class="btn secondary">View</button></td>`; tbody.appendChild(tr); }); }catch(err){ console.error(err); tbody.innerHTML = '<tr><td colspan="5">Failed to load deliveries</td></tr>'; }
}
async function populateTransfers(){
  const tbody = document.getElementById('transfers-tbody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try{ const data = await fetchJson(`${API_BASE}/transfers`); tbody.innerHTML=''; (data||[]).forEach(d=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.from}</td><td>${d.to}</td><td>${d.status}</td><td>${d.date}</td>`; tbody.appendChild(tr); }); }catch(err){ console.error(err); tbody.innerHTML = '<tr><td colspan="5">Failed to load transfers</td></tr>'; }
}
async function populateAdjustments(){
  const tbody = document.getElementById('adjustments-tbody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try{ const data = await fetchJson(`${API_BASE}/adjustments`); tbody.innerHTML=''; (data||[]).forEach(d=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.product}</td><td>${d.recorded}</td><td>${d.counted}</td><td>${d.diff}</td>`; tbody.appendChild(tr); }); }catch(err){ console.error(err); tbody.innerHTML = '<tr><td colspan="5">Failed to load adjustments</td></tr>'; }
}
async function populateMoves(){
  const tbody = document.getElementById('moves-tbody'); if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
  try{ const data = await fetchJson(`${API_BASE}/moves`); tbody.innerHTML=''; (data||[]).forEach(d=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${d.id}</td><td>${d.type}</td><td>${d.sku}</td><td>${d.qty}</td><td>${d.from}</td><td>${d.to}</td><td>${d.date}</td>`; tbody.appendChild(tr); }); }catch(err){ console.error(err); tbody.innerHTML = '<tr><td colspan="7">Failed to load move history</td></tr>'; }
}

// --- Example form handlers (login/register/product-create)
function attachLoginHandler(){
  const form = document.getElementById('login-form');
  if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try{
      const data = await fetchJson(`${API_BASE}/auth/login`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
      });
      // if backend returns token, store it (example)
      if(data && data.token) localStorage.setItem('authToken', data.token);
      window.location = 'dashboard.html';
    }catch(err){ alert('Login failed'); }
  });
}

function attachRegisterHandler(){
  const form = document.getElementById('register-form');
  if(!form) return;

  form.addEventListener('submit', async e =>{
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try{
      const res = await fetch(API_BASE + '/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name, email, password})
      });

      if(!res.ok){
        const text = await res.text();
        throw new Error(text || 'Registration failed');
      }

      alert('Registration successful ✅ Please login');
      window.location.href = 'login.html';

    }catch(err){
      console.error('REGISTER ERROR:', err);
      alert('Registration failed : ' + err.message);
    }
  });
}


function attachProductCreateHandler(){
  const form = document.getElementById('product-create-form');
  if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const payload = {
      name: document.getElementById('product-name').value,
      sku: document.getElementById('product-sku').value,
      category: document.getElementById('product-category').value,
      uom: document.getElementById('product-uom').value,
      stock: Number(document.getElementById('product-stock').value) || 0
    };
    try{
      await fetchJson(`${API_BASE}/products`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Product created');
      window.location = 'product-list.html';
    }catch(err){ alert('Failed to create product'); }
  });
}

function attachReceiptsCreateHandler(){
  const form = document.getElementById('receipts-create-form'); if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const payload = {
      supplier: document.getElementById('receipt-supplier').value,
      sku: document.getElementById('receipt-sku').value,
      qty: Number(document.getElementById('receipt-qty').value) || 0
    };
    try{
      await fetchJson(`${API_BASE}/receipts`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Receipt created');
      window.location = 'receipts-list.html';
    }catch(err){ alert('Failed to create receipt'); }
  });
}

function attachDeliveryCreateHandler(){
  const form = document.getElementById('delivery-create-form'); if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const payload = {
      customer: document.getElementById('delivery-customer').value,
      sku: document.getElementById('delivery-sku').value,
      qty: Number(document.getElementById('delivery-qty').value) || 0
    };
    try{
      await fetchJson(`${API_BASE}/deliveries`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Delivery created');
      window.location = 'delivery-list.html';
    }catch(err){ alert('Failed to create delivery'); }
  });
}

function attachTransferCreateHandler(){
  const form = document.getElementById('transfer-create-form'); if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const payload = {
      from: document.getElementById('transfer-from').value,
      to: document.getElementById('transfer-to').value,
      sku: document.getElementById('transfer-sku').value,
      qty: Number(document.getElementById('transfer-qty').value) || 0
    };
    try{
      await fetchJson(`${API_BASE}/transfers`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Transfer created');
      window.location = 'transfer-list.html';
    }catch(err){ alert('Failed to create transfer'); }
  });
}

function attachAdjustmentCreateHandler(){
  const form = document.getElementById('adjustment-create-form'); if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    const payload = {
      sku: document.getElementById('adjust-sku').value,
      location: document.getElementById('adjust-location').value,
      counted: Number(document.getElementById('adjust-counted').value) || 0
    };
    try{
      await fetchJson(`${API_BASE}/adjustments`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Adjustment recorded');
      window.location = 'adjustments-list.html';
    }catch(err){ alert('Failed to record adjustment'); }
  });
}

function attachProductUpdateHandler(){
  const form = document.getElementById('product-update-form'); if(!form) return;
  form.addEventListener('submit', async e =>{
    e.preventDefault();
    // try read id from query string
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || document.getElementById('product-sku').value;
    const payload = {
      name: document.getElementById('product-name').value,
      sku: document.getElementById('product-sku').value,
      category: document.getElementById('product-category').value,
      uom: document.getElementById('product-uom').value
    };
    try{
      await fetchJson(`${API_BASE}/products/${encodeURIComponent(id)}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      alert('Product updated');
      window.location = 'product-list.html';
    }catch(err){ alert('Failed to update product'); }
  });
}

async function populateProductUpdateForm(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id) return;
  try{
    const data = await fetchJson(`${API_BASE}/products/${encodeURIComponent(id)}`);
    if(!data) return;
    const nameEl = document.getElementById('product-name'); if(nameEl) nameEl.value = data.name || '';
    const skuEl = document.getElementById('product-sku'); if(skuEl) skuEl.value = data.sku || id;
    const catEl = document.getElementById('product-category'); if(catEl) catEl.value = data.category || data.cat || '';
    const uomEl = document.getElementById('product-uom'); if(uomEl) uomEl.value = data.uom || data.uom || '';
  }catch(err){ console.warn('populateProductUpdateForm failed', err); }
}
