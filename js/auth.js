/* ================================================================
   AutoLine — auth.js
   Injecteaza modal-ul de login/register in orice pagina
   si gestioneaza butonul din navbar dinamic.
================================================================ */

(function () {

  /* ---- Injecteaza HTML-ul modal + stiluri ---- */
  const html = `
  <style>
    /* Auth modal custom styles */
    .auth-tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:24px; }
    .auth-tab-btn {
      flex:1; padding:11px; background:none; border:none; cursor:pointer;
      font-family:var(--font); font-size:0.88rem; font-weight:600;
      color:var(--gray); border-bottom:2px solid transparent;
      margin-bottom:-1px; transition:all 0.2s;
    }
    .auth-tab-btn.active { color:var(--accent); border-bottom-color:var(--accent); }

    .auth-panel { display:none; flex-direction:column; gap:14px; }
    .auth-panel.active { display:flex; }

    .auth-error {
      background:rgba(248,113,113,0.08); border:1px solid rgba(248,113,113,0.2);
      color:var(--danger); border-radius:var(--r); padding:10px 14px;
      font-size:0.82rem; display:none;
    }

    /* Navbar auth button */
    #navAuthBtn {
      display:inline-flex; align-items:center; gap:7px;
      padding:6px 14px; border-radius:8px; cursor:pointer;
      font-family:var(--font); font-size:0.85rem; font-weight:500;
      border:none; background:none; transition:all 0.2s;
      color:var(--gray); position:relative;
    }
    #navAuthBtn:hover { color:var(--white); background:rgba(255,255,255,0.06); }
    #navAuthBtn.logged-in { color:var(--accent); }
    #navAuthBtn.logged-in:hover { background:rgba(200,169,110,0.1); }

    /* Dropdown user menu */
    #userDropdown {
      position:absolute; top:calc(100% + 8px); right:0;
      background:var(--bg2); border:1px solid var(--border2);
      border-radius:var(--r2); padding:6px;
      min-width:200px; box-shadow:var(--shadow2);
      opacity:0; pointer-events:none; transform:translateY(-6px);
      transition:all 0.18s ease; z-index:2000;
    }
    #userDropdown.open { opacity:1; pointer-events:all; transform:translateY(0); }
    .dropdown-header { padding:10px 12px 8px; border-bottom:1px solid var(--border); margin-bottom:4px; }
    .dropdown-header strong { display:block; font-size:0.87rem; }
    .dropdown-header span { font-size:0.75rem; color:var(--gray); }
    .dropdown-item {
      display:flex; align-items:center; gap:9px;
      padding:9px 12px; border-radius:8px; cursor:pointer;
      font-size:0.85rem; color:var(--gray2);
      text-decoration:none; transition:all 0.15s; border:none; background:none;
      width:100%; font-family:var(--font);
    }
    .dropdown-item:hover { background:rgba(255,255,255,0.05); color:var(--white); }
    .dropdown-item i { width:14px; text-align:center; font-size:0.8rem; }
    .dropdown-item.danger { color:var(--danger); }
    .dropdown-item.danger:hover { background:rgba(248,113,113,0.08); }
    .dropdown-divider { height:1px; background:var(--border); margin:4px 0; }
    .dropdown-badge {
      margin-left:auto; background:rgba(200,169,110,0.15);
      color:var(--accent); font-size:0.68rem; font-weight:700;
      padding:2px 7px; border-radius:999px; letter-spacing:0.05em;
    }
  </style>

  <!-- AUTH MODAL -->
  <div class="modal-overlay" id="authModal">
    <div class="modal-box" style="max-width:420px">
      <div class="modal-head">
        <h3 id="authModalTitle">Cont AutoLine</h3>
        <button class="modal-close" onclick="closeModal('authModal')">✕</button>
      </div>

      <!-- Tabs -->
      <div class="auth-tabs">
        <button class="auth-tab-btn active" id="tabLogin" onclick="switchAuthTab('login')">
          <i class="fas fa-right-to-bracket"></i> Autentificare
        </button>
        <button class="auth-tab-btn" id="tabRegister" onclick="switchAuthTab('register')">
          <i class="fas fa-user-plus"></i> Cont Nou
        </button>
      </div>

      <!-- LOGIN panel -->
      <div class="auth-panel active" id="panelLogin">
        <div class="form-group">
          <label>Utilizator</label>
          <input type="text" id="loginUsername" placeholder="username" autocomplete="username"
                 onkeydown="if(event.key==='Enter') doAuthLogin()"/>
        </div>
        <div class="form-group">
          <label>Parolă</label>
          <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password"
                 onkeydown="if(event.key==='Enter') doAuthLogin()"/>
        </div>
        <div class="auth-error" id="loginError"></div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px" onclick="doAuthLogin()">
          <i class="fas fa-right-to-bracket"></i> Autentificare
        </button>
        <p style="text-align:center;font-size:0.8rem;color:var(--gray)">
          Nu ai cont?
          <a href="#" onclick="switchAuthTab('register');return false" style="color:var(--accent);text-decoration:none">Înregistrează-te gratuit</a>
        </p>
      </div>

      <!-- REGISTER panel -->
      <div class="auth-panel" id="panelRegister">
        <div class="form-row">
          <div class="form-group">
            <label>Nume Complet *</label>
            <input type="text" id="regName" placeholder="Ion Popescu"/>
          </div>
          <div class="form-group">
            <label>Utilizator *</label>
            <input type="text" id="regUsername" placeholder="ionpopescu"/>
          </div>
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" id="regEmail" placeholder="email@exemplu.com"/>
        </div>
        <div class="form-group">
          <label>Parolă *</label>
          <input type="password" id="regPassword" placeholder="minim 6 caractere"
                 onkeydown="if(event.key==='Enter') doAuthRegister()"/>
        </div>
        <div class="auth-error" id="registerError"></div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px" onclick="doAuthRegister()">
          <i class="fas fa-user-plus"></i> Creează Contul
        </button>
        <p style="text-align:center;font-size:0.8rem;color:var(--gray)">
          Ai deja cont?
          <a href="#" onclick="switchAuthTab('login');return false" style="color:var(--accent);text-decoration:none">Autentifică-te</a>
        </p>
      </div>
    </div>
  </div>

  <!-- USER DROPDOWN (atasat la butonul din navbar) -->
  <div id="userDropdown">
    <div class="dropdown-header">
      <strong id="dropName">—</strong>
      <span id="dropRole">—</span>
    </div>
    <a href="programare.html" class="dropdown-item">
      <i class="fas fa-calendar-plus"></i> Programare Nouă
    </a>
    <div id="dropAdminLink" style="display:none">
      <div class="dropdown-divider"></div>
      <a href="admin.html" class="dropdown-item">
        <i class="fas fa-gauge"></i> Panou Admin
        <span class="dropdown-badge">Admin</span>
      </a>
    </div>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item danger" onclick="doAuthLogout()">
      <i class="fas fa-right-from-bracket"></i> Deconectare
    </button>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  /* ---- Adauga butonul in navbar ---- */
  function injectNavBtn() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    // Sterge link-ul Admin static daca exista
    navLinks.querySelectorAll('li').forEach(li => {
      const a = li.querySelector('a');
      if (a && (a.href.includes('admin.html') || a.classList.contains('nav-accent'))) {
        li.remove();
      }
    });

    // Creeaza elementul buton
    const li = document.createElement('li');
    li.style.position = 'relative';
    li.innerHTML = `<button id="navAuthBtn" onclick="toggleUserDropdown(event)">
      <i class="fas fa-circle-user" style="font-size:1rem"></i>
      <span id="navAuthLabel">Autentificare</span>
    </button>`;
    navLinks.appendChild(li);

    renderNavAuth();
  }

  /* ---- Randeaza starea butonului ---- */
  window.renderNavAuth = function() {
    const s = DB.getSession();
    const btn   = document.getElementById('navAuthBtn');
    const label = document.getElementById('navAuthLabel');
    const drop  = document.getElementById('userDropdown');
    if (!btn) return;

    if (s) {
      btn.classList.add('logged-in');
      label.textContent = s.name.split(' ')[0]; // primul prenume
      document.getElementById('dropName').textContent = s.name;
      document.getElementById('dropRole').textContent = s.role === 'admin' ? 'Administrator' : 'Client';
      document.getElementById('dropAdminLink').style.display = s.role === 'admin' ? 'block' : 'none';
      btn.onclick = toggleUserDropdown;
    } else {
      btn.classList.remove('logged-in');
      label.textContent = 'Autentificare';
      btn.onclick = () => openModal('authModal');
    }
  };

  /* ---- Toggle dropdown user ---- */
  window.toggleUserDropdown = function(e) {
    if (!DB.isLoggedIn()) { openModal('authModal'); return; }
    e && e.stopPropagation();
    const drop = document.getElementById('userDropdown');
    const btn  = document.getElementById('navAuthBtn');
    const rect = btn.getBoundingClientRect();
    // Pozitioneaza dropdown sub buton
    drop.style.top  = (btn.offsetParent ? btn.offsetTop + btn.offsetHeight + 8 : rect.bottom + 8) + 'px';
    drop.classList.toggle('open');
  };

  // Inchide dropdown la click in alta parte
  document.addEventListener('click', () => {
    document.getElementById('userDropdown')?.classList.remove('open');
  });

  /* ---- Tab switch ---- */
  window.switchAuthTab = function(tab) {
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
    document.getElementById('panelLogin').classList.toggle('active', tab === 'login');
    document.getElementById('panelRegister').classList.toggle('active', tab === 'register');
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('registerError').style.display = 'none';
  };

  /* ---- LOGIN ---- */
  window.doAuthLogin = function() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errEl    = document.getElementById('loginError');
    errEl.style.display = 'none';

    if (!username || !password) {
      errEl.textContent = 'Completează toate câmpurile.';
      errEl.style.display = 'block';
      return;
    }
    const user = DB.getUserByCredentials(username, password);
    if (!user) {
      errEl.textContent = 'Utilizator sau parolă incorectă.';
      errEl.style.display = 'block';
      return;
    }
    DB.setSession(user);
    closeModal('authModal');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    renderNavAuth();
    showToast('Bun venit, ' + user.name.split(' ')[0] + '!');

    // Daca e admin si e pe o pagina normala, nu redirectiona — ramane pe pagina
  };

  /* ---- REGISTER ---- */
  window.doAuthRegister = function() {
    const name     = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const errEl    = document.getElementById('registerError');
    errEl.style.display = 'none';

    if (!name || !username || !email || !password) {
      errEl.textContent = 'Completează toate câmpurile obligatorii.';
      errEl.style.display = 'block';
      return;
    }
    if (password.length < 6) {
      errEl.textContent = 'Parola trebuie să aibă minim 6 caractere.';
      errEl.style.display = 'block';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errEl.textContent = 'Adresa de email nu este validă.';
      errEl.style.display = 'block';
      return;
    }

    const result = DB.registerUser({ name, username, password, email });
    if (result.error) {
      errEl.textContent = result.error;
      errEl.style.display = 'block';
      return;
    }

    DB.setSession(result.user);
    closeModal('authModal');
    document.getElementById('regName').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    renderNavAuth();
    showToast('Cont creat cu succes! Bun venit, ' + result.user.name.split(' ')[0] + '!');
  };

  /* ---- LOGOUT ---- */
  window.doAuthLogout = function() {
    DB.clearSession();
    document.getElementById('userDropdown')?.classList.remove('open');
    renderNavAuth();
    showToast('Ai fost deconectat.');
    // Daca e pe admin.html, redirectioneaza
    if (window.location.pathname.includes('admin')) {
      window.location.href = 'index.html';
    }
  };

  // Injecteaza dupa ce DOM e gata
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavBtn);
  } else {
    injectNavBtn();
  }

})();
