// banca.js

async function renderBanca() {
  const saldo = await getSaldoAtual();
  const bancaInicial = await getConfig('bankroll_inicial') || 0;
  const movimentos = await buscarMovimentosBankroll();

  // Calcular lucro do mês
  const inicioMes = new Date(); inicioMes.setDate(1);
  const statsMes = await getEstatisticasGerais({ dataInicio: inicioMes.toISOString().split('T')[0] });
  const statsHoje = await getEstatisticasGerais({ dataInicio: new Date().toISOString().split('T')[0] });

  // Alertas (mantemos apenas alertas de sequência negativa)
  const alertas = [];
  if (statsMes.streak >= 4 && statsMes.streakTipo === 'loss') {
    alertas.push({ tipo: 'warn', msg: `Sequência de ${statsMes.streak} derrotas consecutivas. Considere uma pausa.` });
  }

  const sec = document.getElementById('sec-banca');
  sec.innerHTML = `
    <div class="section-header">
      <div><div class="section-title">Banca</div>
      <div class="section-sub">Gestão de bankroll e limites</div></div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-danger btn-sm" onclick="zerarConta()">Zerar conta</button>
      </div>
    </div>

    ${alertas.map(a => `<div class="alerta alerta-${a.tipo}">${a.msg}</div>`).join('')}

    <div class="grid-3 mb-16">
      <div class="card card-sm">
        <div class="card-title">Saldo atual</div>
        <div class="card-value ${saldo >= bancaInicial ? 'pos' : 'neg'}" title="Saldo atual: ${fmtMoedaSimples(saldo)} · ${ESPORTES?.f1?.emoji || ''} ${ESPORTES?.f1?.nome || ''}">${fmtMoedaSimples(saldo)}</div>
        <div class="card-sub">Inicial: ${fmtMoedaSimples(bancaInicial)}</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Lucro hoje</div>
        <div class="card-value ${statsHoje.lucroTotal >= 0 ? 'pos' : 'neg'}">${fmtMoeda(statsHoje.lucroTotal)}</div>
        <div class="card-sub">Atualizado</div>
      </div>
      <div class="card card-sm">
        <div class="card-title">Lucro mensal</div>
        <div class="card-value ${statsMes.lucroTotal >= 0 ? 'pos' : 'neg'}">${fmtMoeda(statsMes.lucroTotal)}</div>
        <div class="card-sub">Mês atual</div>
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

  // removed stake calculator
}
async function salvarConfigBanca() {
  // function removed: salvarConfigBanca (limits & metas removed)
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

async function zerarConta() {
  const ok = await showConfirm('Isto irá apagar todas as apostas, seleções e movimentações de banca. Deseja continuar?', 'Zerar conta');
  if (!ok) return;
  try {
    await db.transaction('rw', db.apostas, db.selecoes, db.bankroll, async () => {
      await db.selecoes.clear();
      await db.apostas.clear();
      await db.bankroll.clear();
    });
    // opcional: zerar o bankroll inicial
    await setConfig('bankroll_inicial', 0);
    await recalcularBankroll();
    toast('Conta zerada com sucesso', 'success');
    renderBanca();
  } catch (e) {
    console.error(e);
    toast('Erro ao zerar conta', 'error');
  }
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
