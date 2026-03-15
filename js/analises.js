// analises.js

async function renderAnalises() {
  const sec = document.getElementById('sec-analises');
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">Análises</div>
        <div class="section-sub">Performance detalhada das suas apostas</div>
      </div>
      <div class="flex gap-8" style="align-items:center">
        <select id="anal-periodo" onchange="renderAnalises()" style="width:auto;padding:6px 10px">
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="180">Últimos 6 meses</option>
          <option value="365">Último ano</option>
          <option value="0">Tudo</option>
        </select>
      </div>
    </div>
    <div id="anal-content"><div style="text-align:center;padding:40px;color:var(--muted)">Carregando análises...</div></div>
  `;

  setTimeout(async () => {
    const periodoEl = document.getElementById('anal-periodo');
    const dias = parseInt(periodoEl?.value || '30');
    await carregarAnalises(dias);
  }, 50);
}

async function carregarAnalises(dias) {
  let filtros = {};
  if (dias > 0) {
    const d = new Date(); d.setDate(d.getDate() - dias);
    filtros.dataInicio = d.toISOString().split('T')[0];
  }

  const [apostas, statsEsporte, statsLiga, statsTipo, statsCasa, statsTag, statsConfianca,
         lucroDias, evolucao, heatmap] = await Promise.all([
    buscarApostas(filtros),
    getStatsPorSegmento('esporte'),
    getStatsPorSegmento('liga'),
    getStatsPorSegmento('tipo_aposta'),
    getStatsPorSegmento('casa_aposta'),
    getStatsPorSegmento('tag'),
    getStatsPorSegmento('confianca'),
    getLucroPorDia(dias || 365),
    getEvolucaoBankroll(),
    getMapaCalor()
  ]);

  const stats = calcularEstatisticas(apostas);

  // Análise por faixa de odd
  const faixasOdd = [
    { label: '1.01–1.50', min: 1.01, max: 1.50 },
    { label: '1.50–2.00', min: 1.50, max: 2.00 },
    { label: '2.00–2.50', min: 2.00, max: 2.50 },
    { label: '2.50–3.00', min: 2.50, max: 3.00 },
    { label: '3.00–5.00', min: 3.00, max: 5.00 },
    { label: '5.00+',     min: 5.00, max: Infinity },
  ];
  const statsFaixa = faixasOdd.map(f => {
    const grupo = apostas.filter(a => {
      const odd = a.odd_total || a.odd || 0;
      return odd >= f.min && odd < f.max;
    });
    return { ...f, ...calcularEstatisticas(grupo), totalApostas: grupo.length };
  });

  const el = document.getElementById('anal-content');
  if (!el) return;

  el.innerHTML = `
    <!-- KPIs (Bootstrap cards) -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card shadow-sm h-100">
          <div class="card-body p-3 text-center">
            <h6 class="card-subtitle mb-2 text-muted">Total apostas</h6>
            <div class="h4 mb-1">${stats.total}</div>
            <div class="text-muted small">${stats.wins}W · ${stats.losses}L · ${stats.voids}V</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card shadow-sm h-100">
          <div class="card-body p-3 text-center">
            <h6 class="card-subtitle mb-2 text-muted">Win rate</h6>
            <div class="h4 mb-1 ${stats.winRate >= 50 ? 'text-success' : 'text-danger'}">${fmtPct(stats.winRate)}</div>
            <div class="text-muted small">Stake total: ${fmtMoedaSimples(stats.totalStake)}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card shadow-sm h-100">
          <div class="card-body p-3 text-center">
            <h6 class="card-subtitle mb-2 text-muted">ROI</h6>
            <div class="h4 mb-1 ${stats.roi >= 0 ? 'text-success' : 'text-danger'}">${fmtPct(stats.roi)}</div>
            <div class="text-muted small">Odd média: ${fmtOdd(stats.oddMedia)}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <div class="card shadow-sm h-100">
          <div class="card-body p-3 text-center">
            <h6 class="card-subtitle mb-2 text-muted">Lucro total</h6>
            <div class="h4 mb-1 ${stats.lucroTotal >= 0 ? 'text-success' : 'text-danger'}">${fmtMoeda(stats.lucroTotal)}</div>
            <div class="text-muted small">Streak: ${stats.streakTipo === 'win' ? '+' : '-'}${stats.streak}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos de evolução -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h5 class="card-title small mb-3">Evolução do bankroll</h5>
            <div class="chart-wrap" style="height:220px"><canvas id="anal-bankroll"></canvas></div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h5 class="card-title small mb-3">Lucro acumulado por dia</h5>
            <div class="chart-wrap" style="height:220px"><canvas id="anal-lucro-acum"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Por esporte e tipo -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h5 class="card-title small mb-3">ROI por esporte</h5>
            <div class="chart-wrap" style="height:200px"><canvas id="anal-esporte-roi"></canvas></div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h5 class="card-title small mb-3">Win rate por tipo de aposta (top 8)</h5>
            <div class="chart-wrap" style="height:200px"><canvas id="anal-tipo-wr"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Faixas de odd -->
    <div class="card mb-16">
      <div class="card-title mb-16">Performance por faixa de odd</div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Faixa</th><th>Apostas</th><th>Wins</th><th>Win Rate</th><th>ROI</th><th>Lucro</th>
          </tr></thead>
          <tbody>
            ${statsFaixa.filter(f => f.totalApostas > 0).map(f => `
              <tr>
                <td><strong>${f.label}</strong></td>
                <td>${f.totalApostas}</td>
                <td>${f.wins}</td>
                <td class="${f.winRate >= 50 ? 'text-green' : 'text-red'}">${fmtPct(f.winRate)}</td>
                <td class="${f.roi >= 0 ? 'text-green' : 'text-red'}">${fmtPct(f.roi)}</td>
                <td class="${f.lucroTotal >= 0 ? 'text-green' : 'text-red'}">${fmtMoeda(f.lucroTotal)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Liga e casa de aposta -->
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title">Top ligas por ROI</div>
        <div class="chart-wrap" style="height:220px"><canvas id="anal-liga-roi"></canvas></div>
      </div>
      <div class="card">
        <div class="card-title">ROI por casa de aposta</div>
        <div class="chart-wrap" style="height:220px"><canvas id="anal-casa-roi"></canvas></div>
      </div>
    </div>

    <!-- Tag e confiança -->
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title">Performance por tag</div>
        ${renderTabelaSegmento(statsTag, 'tag')}
      </div>
      <div class="card">
        <div class="card-title">Performance por nível de confiança</div>
        ${renderTabelaSegmento(statsTag.length ? statsConfianca.sort((a,b)=>Number(a.nome)-Number(b.nome)) : statsConfianca, 'confianca')}
      </div>
    </div>

    <!-- Heatmap -->
    <div class="card mb-16">
      <div class="card-title mb-16">Win rate por dia da semana</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px">
        ${heatmap.map(h => {
          const cor = h.total === 0 ? 'var(--bg4)' :
            h.winRate >= 60 ? 'rgba(0,230,118,.15)' :
            h.winRate >= 40 ? 'rgba(255,171,64,.12)' : 'rgba(255,77,109,.12)';
          const txtCor = h.total === 0 ? 'var(--muted)' :
            h.winRate >= 60 ? 'var(--green)' : h.winRate >= 40 ? 'var(--amber)' : 'var(--red)';
          return `<div style="background:${cor};border:1px solid var(--border);border-radius:8px;padding:14px 8px;text-align:center">
            <div style="font-size:.65rem;color:var(--text2);text-transform:uppercase;margin-bottom:4px">${h.dia}</div>
            <div style="font-size:1.1rem;font-weight:700;color:${txtCor}">${h.total>0?fmtPct(h.winRate):'—'}</div>
            <div style="font-size:.65rem;color:var(--muted);margin-top:2px">${h.total} ap. · ${fmtMoeda(h.lucro)}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Tabela ligaa completa -->
    <div class="card mb-16">
      <div class="card-title">Ranking de ligas (por ROI)</div>
      ${renderTabelaSegmento(statsLiga.filter(l => l.totalApostas >= 2), 'liga')}
    </div>
  `;

  setTimeout(() => renderChartsAnalises(apostas, stats, statsEsporte, statsTipo, statsLiga, statsCasa, lucroDias, evolucao), 50);
}

function renderTabelaSegmento(lista, campo) {
  if (!lista || lista.length === 0) return `<div class="text-muted" style="padding:16px;text-align:center">Sem dados</div>`;
  return `<div class="table-wrap"><table>
    <thead><tr><th>${campo}</th><th>Ap.</th><th>WR</th><th>ROI</th><th>Lucro</th></tr></thead>
    <tbody>
      ${lista.slice(0, 10).map(s => `<tr>
        <td>${campo === 'confianca' ? '★'.repeat(Number(s.nome)||0) || '—' : s.nome || '—'}</td>
        <td>${s.totalApostas}</td>
        <td class="${s.winRate>=50?'text-green':'text-red'}">${fmtPct(s.winRate)}</td>
        <td class="${s.roi>=0?'text-green':'text-red'}">${fmtPct(s.roi)}</td>
        <td class="${s.lucroTotal>=0?'text-green':'text-red'}">${fmtMoeda(s.lucroTotal)}</td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderChartsAnalises(apostas, stats, statsEsporte, statsTipo, statsLiga, statsCasa, lucroDias, evolucao) {
  // Bankroll
  destroyChart('anal-bankroll');
  const ctx1 = document.getElementById('anal-bankroll');
  if (ctx1) {
    const saldos = evolucao.map(p => p.saldo);
    const cor = saldos[saldos.length-1] >= saldos[0] ? '#00e676' : '#ff4d6d';
    window._charts['anal-bankroll'] = new Chart(ctx1, {
      type: 'line',
      data: { labels: evolucao.map(p => p.data), datasets: [{ data: saldos, borderColor: cor, borderWidth: 2, fill: true, backgroundColor: cor + '12', pointRadius: 0, tension: 0.3 }] },
      options: chartDefaults({ y: { ticks: { callback: v => 'R$'+v.toFixed(0) } } })
    });
  }

  // Lucro acumulado
  destroyChart('anal-lucro-acum');
  const ctx2 = document.getElementById('anal-lucro-acum');
  if (ctx2) {
    let acum = 0;
    const acumData = lucroDias.map(d => { acum += d.lucro; return parseFloat(acum.toFixed(2)); });
    const corAcum = acumData[acumData.length-1] >= 0 ? '#00e676' : '#ff4d6d';
    window._charts['anal-lucro-acum'] = new Chart(ctx2, {
      type: 'line',
      data: { labels: lucroDias.map(d => d.data.slice(5)), datasets: [{ data: acumData, borderColor: corAcum, borderWidth: 2, fill: true, backgroundColor: corAcum + '15', pointRadius: 0, tension: 0.3 }] },
      options: chartDefaults({ y: { ticks: { callback: v => 'R$'+v.toFixed(0) } } })
    });
  }

  // ROI por esporte
  destroyChart('anal-esporte-roi');
  const ctx3 = document.getElementById('anal-esporte-roi');
  if (ctx3 && statsEsporte.length) {
    const filtered = statsEsporte.filter(s => s.totalApostas > 0);
    window._charts['anal-esporte-roi'] = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: filtered.map(s => ESPORTES[s.nome]?.nome || s.nome),
        datasets: [{ data: filtered.map(s => parseFloat(s.roi.toFixed(2))),
          backgroundColor: filtered.map(s => s.roi >= 0 ? '#00e67640' : '#ff4d6d40'),
          borderColor: filtered.map(s => s.roi >= 0 ? '#00e676' : '#ff4d6d'),
          borderWidth: 1, borderRadius: 4 }]
      },
      options: { ...chartDefaults({ y: { ticks: { callback: v => v.toFixed(1)+'%' } } }), indexAxis: 'y' }
    });
  }

  // Win rate por tipo
  destroyChart('anal-tipo-wr');
  const ctx4 = document.getElementById('anal-tipo-wr');
  if (ctx4 && statsTipo.length) {
    const top = statsTipo.filter(s => s.totalApostas >= 2).slice(0, 8);
    window._charts['anal-tipo-wr'] = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: top.map(s => s.nome),
        datasets: [{ data: top.map(s => parseFloat(s.winRate.toFixed(1))),
          backgroundColor: top.map(s => s.winRate >= 50 ? '#00e67640' : '#ff4d6d40'),
          borderColor: top.map(s => s.winRate >= 50 ? '#00e676' : '#ff4d6d'),
          borderWidth: 1, borderRadius: 4 }]
      },
      options: { ...chartDefaults({ y: { ticks: { callback: v => v+'%' } } }), indexAxis: 'y' }
    });
  }

  // ROI por liga (top 8)
  destroyChart('anal-liga-roi');
  const ctx5 = document.getElementById('anal-liga-roi');
  if (ctx5 && statsLiga.length) {
    const top = statsLiga.filter(s => s.totalApostas >= 2).slice(0, 8);
    window._charts['anal-liga-roi'] = new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: top.map(s => s.nome),
        datasets: [{ data: top.map(s => parseFloat(s.roi.toFixed(2))),
          backgroundColor: top.map(s => s.roi >= 0 ? '#00e67640' : '#ff4d6d40'),
          borderColor: top.map(s => s.roi >= 0 ? '#00e676' : '#ff4d6d'),
          borderWidth: 1, borderRadius: 4 }]
      },
      options: { ...chartDefaults({ y: { ticks: { callback: v => v.toFixed(1)+'%' } } }), indexAxis: 'y' }
    });
  }

  // ROI por casa
  destroyChart('anal-casa-roi');
  const ctx6 = document.getElementById('anal-casa-roi');
  if (ctx6 && statsCasa.length) {
    const filtered = statsCasa.filter(s => s.totalApostas > 0);
    window._charts['anal-casa-roi'] = new Chart(ctx6, {
      type: 'bar',
      data: {
        labels: filtered.map(s => s.nome),
        datasets: [{ data: filtered.map(s => parseFloat(s.roi.toFixed(2))),
          backgroundColor: filtered.map(s => s.roi >= 0 ? '#448aff40' : '#ff4d6d40'),
          borderColor: filtered.map(s => s.roi >= 0 ? '#448aff' : '#ff4d6d'),
          borderWidth: 1, borderRadius: 4 }]
      },
      options: { ...chartDefaults({ y: { ticks: { callback: v => v.toFixed(1)+'%' } } }), indexAxis: 'y' }
    });
  }
}
