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
        <select id="anal-periodo" style="width:auto;padding:6px 10px">
          <option value="1">Hoje</option>
          <option value="7">Semana</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="180">Últimos 6 meses</option>
          <option value="365">Último ano</option>
            <option value="-1" selected>Tudo</option>
        </select>
      </div>
    </div>
    <div id="anal-content"><div style="text-align:center;padding:40px;color:var(--muted)">Carregando análises...</div></div>
  `;

  setTimeout(async () => {
      const periodoEl = document.getElementById('anal-periodo');
      const val = parseInt(periodoEl?.value || '30');
      const dias = val === -1 ? 0 : val; // -1 => tudo (no filtro)
      // carregar inicialmente
      await carregarAnalises(val);
      // Não re-renderizar toda a view ao mudar o select — só recarregar filtros
      periodoEl.addEventListener('change', () => {
        const v = parseInt(periodoEl.value || '30');
        carregarAnalises(v);
      });
  }, 50);
}

async function carregarAnalises(dias) {
  let filtros = {};
  // dias param can be: -1 (tudo), 1 (hoje), 7 (semana), etc.
  if (dias === -1) {
    filtros = {};
  } else if (dias === 1) {
    const d = new Date(); filtros.dataInicio = d.toISOString().split('T')[0];
  } else if (dias > 1) {
    const d = new Date(); d.setDate(d.getDate() - dias);
    filtros.dataInicio = d.toISOString().split('T')[0];
  } else if (dias === 0) {
    filtros = {};
  }

  const [apostas, statsEsporte, statsLiga, statsTipo, statsCasa, statsTag,
         lucroDias, evolucao, heatmap] = await Promise.all([
    buscarApostas(filtros),
    getStatsPorSegmento('esporte'),
    getStatsPorSegmento('liga'),
    getStatsPorSegmento('tipo_aposta'),
    getStatsPorSegmento('casa_aposta'),
    getStatsPorSegmento('tag'),
    getLucroPorDia(dias > 0 ? dias : 365),
    getEvolucaoBankroll(),
    getMapaCalor()
  ]);

  const stats = calcularEstatisticas(apostas);

  // filtrar ligas para futebol quando possível
  const futebolLigas = (window.FUTEBOL_LIGAS || []).map(x => (x||'').toLowerCase());
  const statsLigaFiltrada = (statsLiga || []).filter(l => futebolLigas.includes((l.nome||'').toLowerCase()));

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
    <!-- KPIs (compact row) -->
    <div class="grid-3 mb-4">
      <div class="card card-sm h-100 kpi">
        <div class="card-title">Win rate</div>
        <div class="card-value ${stats.winRate >= 50 ? 'pos' : 'neg'}">${fmtPct(stats.winRate)}</div>
        <div class="card-sub">Stake total: ${fmtMoedaSimples(stats.totalStake)}</div>
      </div>
      <div class="card card-sm h-100 kpi">
        <div class="card-title">ROI</div>
        <div class="card-value ${stats.roi >= 0 ? 'pos' : 'neg'}">${fmtPct(stats.roi)}</div>
        <div class="card-sub">Odd média: ${fmtOdd(stats.oddMedia)}</div>
      </div>
      <div class="card card-sm h-100 kpi">
        <div class="card-title">Lucro total</div>
        <div class="card-value ${stats.lucroTotal >= 0 ? 'pos' : 'neg'}">${fmtMoeda(stats.lucroTotal)}</div>
        <div class="card-sub">Streak: ${stats.streakTipo === 'win' ? '+' : '-'}${stats.streak}</div>
      </div>
    </div>

    <!-- Lucro acumulado por dia (ocupando largura total) -->
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h5 class="card-title small mb-3">Lucro acumulado por dia</h5>
            <div class="chart-wrap" style="height:220px"><canvas id="anal-lucro-acum"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total de apostas por esporte (mais atraente que o KPI simples) -->
    <div class="row g-3 mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <h5 class="card-title small mb-0">Total de apostas por esporte</h5>
              <div class="text-muted small">Total: ${stats.total}</div>
            </div>
            <div class="chart-wrap" style="height:220px"><canvas id="anal-total-esporte"></canvas></div>
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

    <!-- Liga (removida a seção de casa de aposta, já que só usa Bet365) -->
    <div class="mb-16">
      <div class="card">
        <div class="card-title">Top ligas por ROI</div>
        <div class="chart-wrap" style="height:220px"><canvas id="anal-liga-roi"></canvas></div>
      </div>
    </div>

    <!-- Tag e confiança -->
    <div class="card mb-16">
      <div class="card-title">Performance por tag</div>
      ${renderTabelaSegmento(statsTag, 'tag')}
    </div>

    <!-- Resumo por esporte (tabela) -->
    <div class="grid-2 mb-16">
      <div class="card">
        <div class="card-title">Resumo por esporte</div>
        ${renderTabelaSegmento(statsEsporte.filter(s => s.totalApostas > 0), 'esporte')}
      </div>
      <div class="card">
        <div class="card-title">Top times por ROI</div>
        <div id="anal-top-times-placeholder">${'<div class="text-muted" style="padding:16px;text-align:center">Sem dados</div>'}</div>
      </div>
    </div>

    <!-- Tabela ligaa completa -->
    <div class="card mb-16">
      <div class="card-title">Ranking de ligas (por ROI)</div>
      ${renderTabelaSegmento(statsLigaFiltrada.filter(l => l.totalApostas >= 2), 'liga')}
    </div>
  `;

  setTimeout(() => renderChartsAnalises(apostas, stats, statsEsporte, statsTipo, statsLigaFiltrada, statsCasa, lucroDias, evolucao), 50);
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
  // Note: 'Evolução da banca' removed from analyses (dashboard keeps the main bankroll chart)

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

  // Total de apostas por esporte (novo)
  destroyChart('anal-total-esporte');
  const ctxTotal = document.getElementById('anal-total-esporte');
  if (ctxTotal && statsEsporte.length) {
    const filtered = statsEsporte.filter(s => s.totalApostas > 0).slice(0, 12);
    window._charts['anal-total-esporte'] = new Chart(ctxTotal, {
      type: 'bar',
      data: {
        labels: filtered.map(s => ESPORTES[s.nome]?.nome || s.nome),
        datasets: [{ data: filtered.map(s => s.totalApostas),
          backgroundColor: filtered.map(() => '#60a5fa40'),
          borderColor: filtered.map(() => '#60a5fa'),
          borderWidth: 1, borderRadius: 4 }]
      },
      options: { ...chartDefaults({ x: { grid: { display: false } } }), indexAxis: 'y' }
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
    // Preferir agrupar tipos que tenham nome válido; evitar 'Não informado' como destaque
    const tiposValidos = statsTipo.filter(s => s.nome && s.nome !== 'Não informado');
    let top = tiposValidos.filter(s => s.totalApostas >= 2).slice(0, 8);
    if (top.length === 0) top = statsTipo.filter(s => s.totalApostas >= 2).slice(0, 8);
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

  // Nota: gráfico de ROI por casa de aposta removido (uso apenas Bet365)

  // Top times por ROI (agregação simples baseada em campo `equipe` das apostas)
  try {
    const teamMap = {};
    (apostas||[]).forEach(a => {
      const t = a.equipe;
      if (!t) return;
      const lucro = calcLucro(a);
      if (!teamMap[t]) teamMap[t] = { nome: t, totalApostas: 0, wins: 0, losses: 0, lucroTotal: 0, totalStake: 0 };
      const obj = teamMap[t];
      obj.totalApostas += 1;
      obj.lucroTotal += Number(lucro||0);
      obj.totalStake += Number(a.stake||0);
      if (a.resultado === 'win') obj.wins += 1;
      else if (a.resultado === 'loss') obj.losses += 1;
    });
    const teamStats = Object.values(teamMap).map(x => ({
      nome: x.nome,
      totalApostas: x.totalApostas,
      winRate: x.totalApostas ? (x.wins / x.totalApostas * 100) : 0,
      roi: x.totalStake ? (x.lucroTotal / x.totalStake * 100) : 0,
      lucroTotal: x.lucroTotal
    }));
    teamStats.sort((a,b) => b.roi - a.roi);
    const topTimes = teamStats.slice(0, 10);
    const placeholder = document.getElementById('anal-top-times-placeholder');
    if (placeholder) placeholder.innerHTML = topTimes.length ? renderTabelaSegmento(topTimes, 'time') : '<div class="text-muted" style="padding:16px;text-align:center">Sem dados</div>';
  } catch (e) {
    console.warn('Erro ao gerar Top times', e);
  }
}
