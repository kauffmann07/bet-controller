// app.js — Roteador SPA + Utilitários

const routes = ['dashboard','nova-aposta','historico','analises','banca','config'];
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
    'analises':    renderAnalises,
    'banca':       renderBanca,
    'nova-aposta': () => initForm(),
    'config':      renderConfig
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
  return {win:'WIN',loss:'LOSS',void:'VOID',cashout:'CASHOUT',pendente:'PENDENTE'}[r]||'—';
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

// ─── CHARTS DEFAULTS ────────────────────────────────────────────────────────
function chartDefaults(extraScales={}) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff', titleColor: '#111827', bodyColor: '#5c6473',
        borderColor: '#dde0e6', borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: { grid: { color: '#f0f1f3' }, ticks: { color: '#9ba3b0', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: '#f0f1f3' }, ticks: { color: '#9ba3b0', font: { family: 'JetBrains Mono', size: 10 } }, ...extraScales.y },
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
  window.addEventListener('bankroll-updated', atualizarSaldoNav);
  await atualizarSaldoNav();
  const hash = window.location.hash.replace('#','');
  navegar(routes.includes(hash) ? hash : 'dashboard');
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
