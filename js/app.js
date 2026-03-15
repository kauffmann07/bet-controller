// app.js — Roteador SPA + Utilitários

const routes = ['dashboard','nova-aposta','historico','abertas','analises','banca'];
let rotaAtual = 'dashboard';

function navegar(rota) {
  rotaAtual = rota;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-'+rota)?.classList.add('active');
  document.querySelector(`.nav-links button[data-rota="${rota}"]`)?.classList.add('active');
  const handlers = {
    'dashboard':   renderDashboard,
    'historico':   renderHistorico,
    'abertas':     renderAbertas,
    'analises':    renderAnalises,
    'banca':       renderBanca,
    'nova-aposta': () => initForm(),
    // config removed
  };
  handlers[rota]?.();
  window.location.hash = rota;
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg, tipo='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 2800);
}

// ─── FORMATAÇÃO ─────────────────────────────────────────────────────────────
function fmtMoeda(v) {
  const n = Number(v)||0;
  return (n>=0?'+':'') + n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
function fmtMoedaSimples(v) {
  return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
function fmtPct(v)  { return (Number(v)||0).toFixed(1)+'%'; }
function fmtOdd(v)  { return Number(v||0).toFixed(2); }
function fmtData(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
}
function fmtDataHora(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
}
function classeResultado(r) {
  return {win:'badge-win',loss:'badge-loss',void:'badge-void',cashout:'badge-cashout',pendente:'badge-pendente'}[r]||'badge-pendente';
}
function labelResultado(r) {
  return {win:'WIN',loss:'LOSS',void:'VOID',cashout:'CASHOUT',pendente:'ABERTA'}[r]||'—';
}
function calcLucro(a) {
  if (a.resultado==='win')     return ((a.odd_total||a.odd||1)-1)*(a.stake||0);
  if (a.resultado==='loss')    return -(a.stake||0);
  if (a.resultado==='cashout') return (a.lucro_cashout||0)-(a.stake||0);
  return 0;
}

// ─── MODAL ──────────────────────────────────────────────────────────────────
function abrirModal(id)  { document.getElementById(id)?.classList.add('open'); }
function fecharModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ─── CUSTOM CONFIRM / PROMPT MODAL HELPERS ─────────────────────────────────
function closeCustomModal() {
  const el = document.getElementById('custom-modal');
  if (el) el.classList.remove('open');
}

function showCustomModal({ title = 'Confirmar', body = '', buttons = [] } = {}) {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-modal');
    if (!modal) { resolve(null); return; }
    document.getElementById('custom-modal-title').textContent = title;
    const bodyEl = document.getElementById('custom-modal-body');
    bodyEl.innerHTML = typeof body === 'string' ? `<div>${body}</div>` : '';
    const actions = document.getElementById('custom-modal-actions');
    actions.innerHTML = '';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = b.class || (b.primary ? 'btn btn-primary' : 'btn btn-secondary');
      btn.textContent = b.label;
      btn.onclick = () => {
        closeCustomModal();
        resolve(b.value);
      };
      actions.appendChild(btn);
    });
    modal.classList.add('open');
  });
}

function showConfirm(message, title = 'Confirmação') {
  return showCustomModal({ title, body: `<div style="padding:6px 0">${message}</div>`, buttons: [
    { label: 'Cancelar', value: false },
    { label: 'Confirmar', value: true, primary: true }
  ] });
}

function showPrompt(message, defaultValue = '', title = 'Entrada') {
  return new Promise(resolve => {
    const modal = document.getElementById('custom-modal');
    if (!modal) { resolve(null); return; }
    document.getElementById('custom-modal-title').textContent = title;
    const bodyEl = document.getElementById('custom-modal-body');
    bodyEl.innerHTML = `<div style="margin-bottom:12px">${message}</div><input id="custom-prompt-input" style="width:100%;padding:8px;border-radius:6px;border:1px solid var(--border)" value="${String(defaultValue||'')}">`;
    const actions = document.getElementById('custom-modal-actions');
    actions.innerHTML = '';
    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn btn-secondary';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => { closeCustomModal(); resolve(null); };
    const btnOk = document.createElement('button');
    btnOk.className = 'btn btn-primary';
    btnOk.textContent = 'OK';
    btnOk.onclick = () => { const v = document.getElementById('custom-prompt-input').value; closeCustomModal(); resolve(v); };
    actions.appendChild(btnCancel); actions.appendChild(btnOk);
    modal.classList.add('open');
    setTimeout(()=>document.getElementById('custom-prompt-input')?.focus(), 50);
  });
}

// ─── CHARTS DEFAULTS ────────────────────────────────────────────────────────
function chartDefaults(extraScales={}) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff', titleColor: '#111827', bodyColor: '#5c6473',
        borderColor: '#dde0e6', borderWidth: 1,
        padding: 10, displayColors: false, cornerRadius: 8,
        titleFont: { family: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', weight: '600' },
        bodyFont: { family: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }
      }
    },
    scales: {
      x: { grid: { color: '#f0f1f3' }, ticks: { color: '#9ba3b0', font: { family: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto', size: 11 } } },
      y: { grid: { color: '#f0f1f3' }, ticks: { color: '#9ba3b0', font: { family: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto', size: 11 } }, ...extraScales.y },
      ...extraScales
    }
  };
}

function destroyChart(id) {
  window._charts = window._charts||{};
  if (window._charts[id]) { window._charts[id].destroy(); delete window._charts[id]; }
}

// ─── INIT ────────────────────────────────────────────────────────────────────
async function init() {
  document.querySelectorAll('.nav-links button[data-rota]').forEach(btn => {
    btn.addEventListener('click', () => navegar(btn.dataset.rota));
  });
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target===m) m.classList.remove('open'); });
  });
  // Theme: default dark mode only
  document.documentElement.classList.add('dark');
  window.addEventListener('bankroll-updated', atualizarSaldoNav);
  await atualizarSaldoNav();
  const hash = window.location.hash.replace('#','');
  navegar(routes.includes(hash) ? hash : 'dashboard');
  // Auto-backup: salva uma cópia do DB em localStorage sempre que o bankroll for atualizado
  async function autoBackup() {
    try {
      const json = await exportarJSON();
      localStorage.setItem('bettracker_autobackup', json);
    } catch (e) { console.warn('AutoBackup falhou', e); }
  }
  window.addEventListener('bankroll-updated', autoBackup);

  // Tentativa de restauração ao iniciar: se DB estiver vazio e houver backup local, restaura
  try {
    const count = await db.apostas.count();
    if (count === 0) {
      const b = localStorage.getItem('bettracker_autobackup');
      if (b) {
        try {
          await importarJSON(b);
          await recalcularBankroll();
          toast('Dados restaurados do backup local');
        } catch (e) { console.warn('Restauração falhou', e); }
      }
    }
  } catch (e) { console.warn('Erro checando DB para restauração', e); }
}

async function atualizarSaldoNav() {
  const saldo = await getSaldoAtual();
  const el = document.getElementById('nav-saldo');
  if (el) {
    el.textContent = fmtMoedaSimples(saldo);
    el.className = 'val ' + (saldo >= 0 ? 'text-green' : 'text-red');
  }
}

document.addEventListener('DOMContentLoaded', init);
