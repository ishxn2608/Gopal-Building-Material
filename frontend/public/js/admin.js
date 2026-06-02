// Gopal Building Material – Admin Dashboard JS

const API = '/api/admin';
let authHeader = '';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const dashboard = document.getElementById('dashboard');

  // ── Login ──────────────────────────────────────────────────
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    authHeader = 'Basic ' + btoa(username + ':' + password);
    const ok = await loadStats();
    if (ok) {
      loginForm.closest('#loginSection').style.display = 'none';
      dashboard.style.display = 'block';
      loadEnquiries();
    } else {
      document.getElementById('loginError').textContent = 'Invalid credentials';
    }
  });

  // ── Filter buttons ─────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadEnquiries(btn.dataset.status);
    });
  });
});

async function loadStats() {
  try {
    const res = await fetch(API + '/stats', { headers: { Authorization: authHeader } });
    if (!res.ok) return false;
    const { data } = await res.json();
    document.getElementById('statTotal').textContent = data.total;
    document.getElementById('statNew').textContent = data.new;
    document.getElementById('statContacted').textContent = data.contacted;
    document.getElementById('statToday').textContent = data.today;
    return true;
  } catch { return false; }
}

async function loadEnquiries(status = '') {
  const tbody = document.getElementById('enquiryTable');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#8a7060">Loading…</td></tr>';
  const url = API + '/enquiries' + (status ? '?status=' + status : '');
  try {
    const res = await fetch(url, { headers: { Authorization: authHeader } });
    const { data } = await res.json();
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:#8a7060">No enquiries found</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(e => `
      <tr id="row-${e._id}">
        <td>${new Date(e.createdAt).toLocaleDateString('en-IN')}<br><span style="font-size:0.75rem;color:#8a7060">${new Date(e.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span></td>
        <td><strong>${e.name}</strong></td>
        <td>${e.phone}</td>
        <td>${e.service}</td>
        <td><span class="badge badge-${e.status}">${e.status}</span></td>
        <td>
          <div class="action-btns">
            <a href="https://wa.me/91${e.phone.replace(/[^0-9]/g,'')}" target="_blank" class="btn-wa">WA</a>
            <select onchange="updateStatus('${e._id}', this.value)" class="status-sel">
              <option value="new"       ${e.status==='new'?'selected':''}>New</option>
              <option value="contacted" ${e.status==='contacted'?'selected':''}>Contacted</option>
              <option value="closed"    ${e.status==='closed'?'selected':''}>Closed</option>
            </select>
            <button onclick="deleteEnquiry('${e._id}')" class="btn-del">✕</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="color:red;padding:1rem">Error loading data</td></tr>';
  }
}

async function updateStatus(id, status) {
  await fetch(API + '/enquiries/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ status })
  });
  loadStats();
  const badge = document.querySelector(`#row-${id} .badge`);
  if (badge) { badge.textContent = status; badge.className = 'badge badge-' + status; }
}

async function deleteEnquiry(id) {
  if (!confirm('Delete this enquiry?')) return;
  await fetch(API + '/enquiries/' + id, { method: 'DELETE', headers: { Authorization: authHeader } });
  document.getElementById('row-' + id)?.remove();
  loadStats();
}
