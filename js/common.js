/* ================================================================
   AutoLine — common.js  |  Utilitare partajate intre pagini
================================================================ */

/* ---- TOAST ---- */
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3200);
}

/* ---- NAVBAR hamburger ---- */
(function() {
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => menu.classList.remove('open'))
  );
})();

/* ---- REVEAL pe scroll ---- */
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ---- COUNTER animat ---- */
function animateCounter(el, duration = 1600) {
  const target = parseInt(el.dataset.target);
  const start  = Date.now();
  const t = setInterval(() => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target).toLocaleString('ro-RO');
    if (p >= 1) clearInterval(t);
  }, 16);
}

(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
})();

/* ---- MODAL helpers ---- */
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}
// Inchide la click pe overlay
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
});

/* ---- Status badge helper ---- */
function statusBadge(status) {
  const labels = { pending: 'În Așteptare', confirmed: 'Confirmat', completed: 'Finalizat', cancelled: 'Anulat' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}
