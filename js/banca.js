// banca.js

async function renderBanca() {
  const saldo = await getSaldoAtual();
  const bancaInicial = await getConfig('bankroll_inicial') || 0;
  const stopLossDiario = await getConfig('stop_loss_diario') || 0;
  const stopLossMensal = await getConfig('stop_loss_mensal') || 0;
  const metaMensal = await getConfig('meta_mensal') || 0;
  const pctMaxAposta = await getConfig('pct_max_aposta') || 5;
  const movimentos = await buscarMovimentosBankroll();

  // Calcular lucro do mês
  const inicioMes = new Date(); inicioMes.setDate(1);
  const statsMes = await getEstatisticasGerais({ dataInicio: inicioMes.toISOString().split('T')[0] });
  const statsHoje = await getEstatisticasGerais({ dataInicio: new Date().toISOString().split('T')[0] });

  // Alertas
  const alertas = [];
  if (stopLossDiario > 0 && statsHoje.lucroTotal < 0 && Math.abs(statsHoje.lucroTotal) >= stopLossDiario) {
    alertas.push({ tipo: 'danger', msg: `STOP LOSS DIÁRIO atingido! Prejuízo de ${fmtMoedaSimples(Math.abs(statsHoje.lucroTotal))} hoje.` });
  }
  if (stopLossMensal > 0 && statsMes.lucroTotal < 0 && Math.abs(statsMes.lucroTotal) >= stopLossMensal) {
    alertas.push({ tipo: 'danger', msg: `STOP LOSS MENSAL atingido! Prejuízo de ${fmtMoedaSimples(Math.abs(statsMes.lucroTotal))} este mês.` });
  }
  if (statsMes.streak >= 4 && statsMes.streakTipo === 'loss') {
    alertas.push({ tipo: 'warn', msg: `Sequência de ${statsMes.streak} derrotas consecutivas. Considere uma pausa.` });
  }
  if (metaMensal > 0 && statsMes.lucroTotal >= metaMensal) {
    alertas.push({ tipo: 'ok', msg: `Meta mensal atingida! ${fmtMoedaSimples(statsMes.lucroTotal)} de ${fmtMoedaSimples(metaMensal)}.` });
  }

  const stakeRecomendada = saldo * (pctMaxAposta / 100);

  const sec = document.getElementById('sec-banca');
  sec.innerHTML = `
    <div class="section-header">
      <div><div class="section-title">Banca</div>
      <div class="section-sub">Gestão de bankroll e limites</div></div>
    </div>

    ${alertas.map(a => `<div class="alerta alerta-${a.tipo}">${a.msg}</div>`).join('')}

    <div class="grid-4 mb-16">
      <div class="card card-sm">
        <div class="card-title">Saldo atual</div>
        <div class="card-value ${saldo >= bancaInicial ? 'pos' : 'neg'}">${fmtMoedaSimples(saldo)}</div>
        <div class="card-sub">Inicial: ${fmtMoedaSimples(bancaInicial)}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Lucro hoje</div>
        <div class="card-value ${statsHoje.lucroTotal >= 0 ? 'pos' : 'neg'}" style="font-size:1.3rem">${fmtMoeda(statsHoje.lucroTotal)}</div>
        <div class="card-sub">Stop diário: ${stopLossDiario > 0 ? fmtMoedaSimples(stopLossDiario) : 'Não definido'}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Lucro mensal</div>
        <div class="card-value ${statsMes.lucroTotal >= 0 ? 'pos' : 'neg'}" style="font-size:1.3rem">${fmtMoeda(statsMes.lucroTotal)}</div>
        <div class="card-sub">Meta: ${metaMensal > 0 ? fmtMoedaSimples(metaMensal) : 'Não definida'}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Stake recomendada (${pctMaxAposta}%)</div>
        <div class="card-value" style="font-size:1.3rem">${fmtMoedaSimples(stakeRecomendada)}</div>
        <div class="card-sub">Baseada no saldo atual</div>
      </div>
    </div>

    <div class="grid-2 mb-16">
      <!-- Calculadora de stake -->
      <div class="card">
        <div class="card-title mb-16">Calculadora de stake</div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Saldo de referência (R$)</label>
            <input type="number" id="calc-saldo" step="0.01" value="${saldo.toFixed(2)}" oninput="calcStake()">
          </div>
          <div class="form-group">
            <label>% da banca</label>
            <input type="number" id="calc-pct" step="0.5" min="0.5" max="20" value="${pctMaxAposta}" oninput="calcStake()">
          </div>
        </div>
        <div class="form-group">
          <label>Odd da aposta</label>
          <input type="number" id="calc-odd" step="0.01" min="1.01" value="2.00" oninput="calcStake()">
        </div>
        <div id="calc-resultado" style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px;margin-top:8px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:.78rem">
            <div><div class="card-title">Stake</div><div class="text-bright" id="calc-stake-val">—</div></div>
            <div><div class="card-title">Retorno potencial</div><div class="text-green" id="calc-retorno-val">—</div></div>
          </div>
        </div>
      </div>

      <!-- Configurações de limites -->
      <div class="card">
        <div class="card-title mb-16">Limites e metas</div>
        <div class="form-group">
          <label>Banca inicial (R$)</label>
          <input type="number" id="cfg-banca-ini" step="0.01" value="${bancaInicial}">
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Stop loss diário (R$)</label>
            <input type="number" id="cfg-stop-diario" step="0.01" value="${stopLossDiario}">
          </div>
          <div class="form-group">
            <label>Stop loss mensal (R$)</label>
            <input type="number" id="cfg-stop-mensal" step="0.01" value="${stopLossMensal}">
          </div>
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Meta de lucro mensal (R$)</label>
            <input type="number" id="cfg-meta-mensal" step="0.01" value="${metaMensal}">
          </div>
          <div class="form-group">
            <label>% máximo por aposta</label>
            <input type="number" id="cfg-pct-max" step="0.5" min="0.5" max="20" value="${pctMaxAposta}">
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="salvarConfigBanca()">Salvar limites</button>
      </div>
    </div>

    <!-- Movimentos de banca -->
    <div class="card mb-16">
      <div class="flex items-center justify-between mb-16">
        <div class="card-title">Depósitos e saques</div>
        <button class="btn btn-secondary btn-sm" onclick="abrirModal('modal-movimento')">+ Registrar movimento</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Data</th><th>Tipo</th><th>Valor</th><th>Obs</th></tr></thead>
          <tbody>
            ${movimentos.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--muted)">Nenhum movimento registrado</td></tr>' :
              [...movimentos].reverse().map(m => `<tr>
                <td>${fmtData(m.data)}</td>
                <td><span class="badge ${m.tipo==='deposito'?'badge-win':'badge-loss'}">${m.tipo.toUpperCase()}</span></td>
                <td class="${m.tipo==='deposito'?'text-green':'text-red'}">${m.tipo==='deposito'?'+':'−'}${fmtMoedaSimples(m.valor)}</td>
                <td class="text-muted">${m.obs||'—'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal movimento -->
    <div id="modal-movimento" class="modal-overlay">
      <div class="modal" style="max-width:400px">
        <div class="modal-header">
          <span class="modal-title">Registrar movimento</span>
          <button class="btn-ghost btn" onclick="fecharModal('modal-movimento')">✕</button>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select id="mov-tipo">
            <option value="deposito">Depósito</option>
            <option value="saque">Saque</option>
          </select>
        </div>
        <div class="form-group">
          <label>Valor (R$)</label>
          <input type="number" id="mov-valor" step="0.01" min="0">
        </div>
        <div class="form-group">
          <label>Data</label>
          <input type="date" id="mov-data" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label>Observação (opcional)</label>
          <input type="text" id="mov-obs">
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
          <button class="btn btn-secondary" onclick="fecharModal('modal-movimento')">Cancelar</button>
          <button class="btn btn-primary" onclick="salvarMovimento()">Salvar</button>
        </div>
      </div>
    </div>
  `;

  calcStake();
}

function calcStake() {
  const saldo = parseFloat(document.getElementById('calc-saldo')?.value) || 0;
  const pct = parseFloat(document.getElementById('calc-pct')?.value) || 0;
  const odd = parseFloat(document.getElementById('calc-odd')?.value) || 0;
  const stake = saldo * (pct / 100);
  const retorno = stake * odd;
  const stakeEl = document.getElementById('calc-stake-val');
  const retornoEl = document.getElementById('calc-retorno-val');
  if (stakeEl) stakeEl.textContent = fmtMoedaSimples(stake);
  if (retornoEl) retornoEl.textContent = fmtMoedaSimples(retorno) + ` (+${fmtMoedaSimples(retorno - stake)})`;
}

async function salvarConfigBanca() {
  await setConfig('bankroll_inicial', parseFloat(document.getElementById('cfg-banca-ini')?.value) || 0);
  await setConfig('stop_loss_diario', parseFloat(document.getElementById('cfg-stop-diario')?.value) || 0);
  await setConfig('stop_loss_mensal', parseFloat(document.getElementById('cfg-stop-mensal')?.value) || 0);
  await setConfig('meta_mensal', parseFloat(document.getElementById('cfg-meta-mensal')?.value) || 0);
  await setConfig('pct_max_aposta', parseFloat(document.getElementById('cfg-pct-max')?.value) || 5);
  await recalcularBankroll();
  toast('Configurações salvas!');
  renderBanca();
}

async function salvarMovimento() {
  const tipo = document.getElementById('mov-tipo')?.value;
  const valor = parseFloat(document.getElementById('mov-valor')?.value);
  const data = document.getElementById('mov-data')?.value;
  const obs = document.getElementById('mov-obs')?.value;
  if (!valor || valor <= 0) { toast('Valor inválido', 'error'); return; }
  await salvarMovimentoBankroll({ tipo, valor, data, obs });
  await recalcularBankroll();
  fecharModal('modal-movimento');
  toast('Movimento registrado!');
  renderBanca();
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────
async function renderConfig() {
  const sec = document.getElementById('sec-config');
  sec.innerHTML = `
    <div class="section-header">
      <div><div class="section-title">Configurações</div>
      <div class="section-sub">Personalize ligas e esportes</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-title mb-16">Esportes configurados</div>
        ${Object.entries(ESPORTES).map(([k,v]) => `
          <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
            <span>${v.emoji} ${v.nome}</span>
            <span class="badge badge-simples">${v.ligas.length} ligas · ${v.tipos_aposta.length} tipos</span>
          </div>`).join('')}
        <div class="mt-16 text-muted" style="font-size:.72rem">Para adicionar esportes ou ligas personalizados, edite o arquivo data/esportes.js</div>
      </div>
      <div class="card">
        <div class="card-title mb-16">Casas de aposta</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${CASAS_APOSTA.map(c => `<span class="badge badge-simples">${c}</span>`).join('')}
        </div>
        <div class="mt-16 text-muted" style="font-size:.72rem">Para adicionar casas de aposta, edite data/esportes.js (array CASAS_APOSTA)</div>
        <div class="mt-24">
          <div class="card-title mb-16">Backup de dados</div>
          <div class="flex gap-8">
            <button class="btn btn-secondary btn-sm" onclick="exportarJSONClick()">↓ Exportar backup JSON</button>
            <button class="btn btn-secondary btn-sm" onclick="exportarCSVClick()">↓ Exportar CSV</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
