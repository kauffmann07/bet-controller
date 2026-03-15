// dashboard.js

async function renderDashboard() {
  const stats = await getEstatisticasGerais();
  const saldo = await getSaldoAtual();
  const hoje = new Date().toISOString().split('T')[0];
  const inicioSemana = new Date(); inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const inicioMes = new Date(); inicioMes.setDate(1);

  // períodos: hoje, últimos 7 dias, últimos 30 dias
  const inicio7 = new Date(); inicio7.setDate(inicio7.getDate() - 6);
  const inicio30 = new Date(); inicio30.setDate(inicio30.getDate() - 29);
  const [statsHoje, stats7d, stats30d] = await Promise.all([
    getEstatisticasGerais({ dataInicio: hoje }),
    getEstatisticasGerais({ dataInicio: inicio7.toISOString().split('T')[0] }),
    getEstatisticasGerais({ dataInicio: inicio30.toISOString().split('T')[0] })
  ]);

  const apostas = await buscarApostas();
  const pendentes = apostas.filter(a => !a.resultado || a.resultado === 'pendente');
  const ultimas5 = apostas.slice(0, 5);
  const heatmap = await getMapaCalor();
  const evolucao = await getEvolucaoBankroll();
  const lucroDias = await getLucroPorDia(30);

  const sec = document.getElementById('sec-dashboard');
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">Dashboard</div>
        <div class="section-sub">${new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="navegar('nova-aposta')">+ Nova Aposta</button>
    </div>

    <!-- KPIs principais (linha 1: 5 colunas) -->
    <div class="grid-5 mb-16">
      <div class="card card-sm">
        <div class="card-title">Saldo atual</div>
        <div class="card-value ${saldo >= 0 ? 'pos' : 'neg'}">${fmtMoedaSimples(saldo)}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Win rate</div>
        <div class="card-value">${fmtPct(stats.winRate)}</div>
        <div class="card-sub">${stats.wins}W / ${stats.losses}L de ${stats.apostasResolvidas}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Apostas abertas</div>
        <div class="card-value ${pendentes.length>0?'warn':''}">${pendentes.length} abertas</div>
        <div class="card-sub">Em risco: ${fmtMoeda(pendentes.reduce((s,a)=>s+(a.stake||0),0))}</div>
      </div>
      <div class="card card-sm col-span-2">
        <div class="card-title">Lucro total</div>
        <div class="card-value ${stats.lucroTotal >= 0 ? 'pos' : 'neg'}">${fmtMoeda(stats.lucroTotal)}</div>
        <div class="card-sub">ROI: ${fmtPct(stats.roi)}</div>
      </div>
    </div>

    <!-- Período (linha 2: 5 colunas: 2 + 2 + 1) -->
    <div class="grid-5 mb-16">
      <div class="card card-sm col-span-2">
        <div class="card-title">Lucro hoje</div>
        <div class="card-value ${statsHoje.lucroTotal >= 0 ? 'pos' : 'neg'}" style="font-size:1.2rem">${fmtMoeda(statsHoje.lucroTotal)}</div>
        <div class="card-sub">${statsHoje.total} apostas · ${fmtPct(statsHoje.winRate)} WR</div>
      </div>
      <div class="card card-sm col-span-2">
        <div class="card-title">Lucro últimos 7 dias</div>
        <div class="card-value ${stats7d.lucroTotal >= 0 ? 'pos' : 'neg'}" style="font-size:1.2rem">${fmtMoeda(stats7d.lucroTotal)}</div>
        <div class="card-sub">${stats7d.total} apostas · ${fmtPct(stats7d.winRate)} WR</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Lucro últimos 30 dias</div>
        <div class="card-value ${stats30d.lucroTotal >= 0 ? 'pos' : 'neg'}" style="font-size:1.2rem">${fmtMoeda(stats30d.lucroTotal)}</div>
        <div class="card-sub">${stats30d.total} apostas · ${fmtPct(stats30d.winRate)} WR</div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title">Evolução da banca</div>
        <div class="chart-wrap" style="height:180px"><canvas id="chart-bankroll"></canvas></div>
      </div>
      <div class="card">
        <div class="card-title">Lucro diário (30 dias)</div>
        <div class="chart-wrap" style="height:180px"><canvas id="chart-lucro-diario"></canvas></div>
      </div>
    </div>

    <!-- Heatmap + Últimas apostas -->
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title mb-16">Win rate por dia da semana</div>
        <div class="heatmap">
          ${heatmap.map(h => {
            const cor = h.total === 0 ? 'var(--bg4)' :
              h.winRate >= 60 ? 'rgba(0,230,118,.15)' :
              h.winRate >= 40 ? 'rgba(255,171,64,.12)' : 'rgba(255,77,109,.12)';
            const txtCor = h.total === 0 ? 'var(--muted)' :
              h.winRate >= 60 ? 'var(--green)' :
              h.winRate >= 40 ? 'var(--amber)' : 'var(--red)';
            return `<div class="heatmap-cell" style="background:${cor}">
              <div class="dia">${h.dia}</div>
              <div class="wr" style="color:${txtCor}">${h.total > 0 ? fmtPct(h.winRate) : '—'}</div>
              <div class="qt">${h.total} ap.</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-16">
          <div class="card-title">Últimas apostas</div>
          <button class="btn-ghost btn btn-sm" onclick="navegar('historico')">Ver todas →</button>
        </div>
        ${ultimas5.length === 0 ? '<div class="text-muted" style="text-align:center;padding:20px">Nenhuma aposta registrada</div>' :
          ultimas5.map(a => `
          <div class="ultima-aposta-mini">
            <div>
              <span class="sport">${ESPORTES[a.esporte]?.emoji || ''} ${(a.liga && a.liga.trim()) ? a.liga : (ESPORTES[a.esporte]?.nome || a.esporte || '')}</span>
              <span class="text-muted" style="margin-left:8px;font-size:.7rem">${fmtData(a.data)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="odds">${fmtOdd(a.odd_total || a.odd)}</span>
              <span class="badge ${classeResultado(a.resultado)}">${labelResultado(a.resultado)}</span>
              ${a.resultado && a.resultado !== 'pendente' ? `<span class="${calcLucro(a) >= 0 ? 'text-green' : 'text-red'}" style="min-width:70px;text-align:right">${fmtMoeda(calcLucro(a))}</span>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;

  // Renderizar gráficos
  setTimeout(() => {
    renderChartBankroll(evolucao);
    renderChartLucroDiario(lucroDias);
  }, 50);
}

function renderChartBankroll(pontos) {
  const ctx = document.getElementById('chart-bankroll');
  if (!ctx) return;
  destroyChart('chart-bankroll');
  const labels = pontos.map(p => p.data);
  const data = pontos.map(p => p.saldo);
  const color = data[data.length-1] >= data[0] ? '#00e676' : '#ff4d6d';
  window._charts = window._charts || {};
  window._charts['chart-bankroll'] = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ data, borderColor: color, borderWidth: 2, fill: true,
      backgroundColor: color + '15', pointRadius: 0, tension: 0.3 }] },
    options: chartDefaults({ y: { ticks: { callback: v => 'R$' + v.toFixed(0) } } })
  });
}

function renderChartLucroDiario(dias) {
  const ctx = document.getElementById('chart-lucro-diario');
  if (!ctx) return;
  destroyChart('chart-lucro-diario');
  window._charts['chart-lucro-diario'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dias.map(d => d.data.slice(5)),
      datasets: [{ data: dias.map(d => d.lucro),
        backgroundColor: dias.map(d => d.lucro >= 0 ? '#00e67640' : '#ff4d6d40'),
        borderColor: dias.map(d => d.lucro >= 0 ? '#00e676' : '#ff4d6d'),
        borderWidth: 1, borderRadius: 3 }]
    },
    options: chartDefaults({ y: { ticks: { callback: v => 'R$' + v.toFixed(0) } } })
  });
}

function destroyChart(id) {
  window._charts = window._charts || {};
  if (window._charts[id]) { window._charts[id].destroy(); delete window._charts[id]; }
}

function chartDefaults(extraScales = {}) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#1e2230', titleColor: '#c8d0e0', bodyColor: '#7a849e',
      borderColor: '#252a38', borderWidth: 1
    }},
    scales: {
      x: { grid: { color: '#252a38' }, ticks: { color: '#4a5168', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: '#252a38' }, ticks: { color: '#4a5168', font: { family: 'JetBrains Mono', size: 10 } }, ...extraScales.y },
      ...extraScales
    }
  };
}
