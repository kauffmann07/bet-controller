// historico.js

let histFiltros = {};
let histOrdem = { campo: 'data', asc: false };
let histPagina = 1;
const HIST_POR_PAG = 25;

async function renderHistorico() {
  const sec = document.getElementById('sec-historico');
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">Histórico</div>
        <div class="section-sub" id="hist-total-sub">Carregando...</div>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-secondary btn-sm" onclick="exportarCSVClick()">↓ CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="exportarJSONClick()">↓ JSON</button>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('import-file').click()">↑ Importar</button>
        <input type="file" id="import-file" accept=".json" style="display:none" onchange="importarJSONClick(this)">
      </div>
    </div>

    <div class="filtros-bar">
      <div><label>De</label><input type="date" id="filt-inicio" value="${histFiltros.dataInicio||''}"></div>
      <div><label>Até</label><input type="date" id="filt-fim" value="${histFiltros.dataFim||''}"></div>
      <div>
        <label>Esporte</label>
        <select id="filt-esporte" onchange="onFiltEsporte()">
          <option value="">Todos</option>
          ${Object.entries(ESPORTES).map(([k,v])=>`<option value="${k}" ${histFiltros.esporte===k?'selected':''}>${v.nome}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Liga</label>
        <select id="filt-liga">
          <option value="">Todas</option>
          ${histFiltros.esporte && ESPORTES[histFiltros.esporte] ? ESPORTES[histFiltros.esporte].ligas.map(l=>`<option value="${l}" ${histFiltros.liga===l?'selected':''}>${l}</option>`).join('') : ''}
        </select>
      </div>
      <div>
        <label>Resultado</label>
        <select id="filt-resultado">
          <option value="">Todos</option>
          <option value="win" ${histFiltros.resultado==='win'?'selected':''}>WIN</option>
          <option value="loss" ${histFiltros.resultado==='loss'?'selected':''}>LOSS</option>
          <option value="void" ${histFiltros.resultado==='void'?'selected':''}>VOID</option>
          <option value="cashout" ${histFiltros.resultado==='cashout'?'selected':''}>Cashout</option>
          <option value="pendente" ${histFiltros.resultado==='pendente'?'selected':''}>Pendente</option>
        </select>
      </div>
      <div>
        <label>Tag</label>
        <select id="filt-tag">
          <option value="">Todas</option>
          ${TAGS.map(t=>`<option value="${t.value}" ${histFiltros.tag===t.value?'selected':''}>${t.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Tipo</label>
        <select id="filt-tipo-reg">
          <option value="">Todos</option>
          <option value="simples" ${histFiltros.tipo_registro==='simples'?'selected':''}>Simples</option>
          <option value="acumulada" ${histFiltros.tipo_registro==='acumulada'?'selected':''}>Acumulada</option>
        </select>
      </div>
      <div style="display:flex;align-items:flex-end;gap:6px">
        <button class="btn btn-primary btn-sm" onclick="aplicarFiltros()" style="flex:1">Filtrar</button>
        <button class="btn btn-secondary btn-sm" onclick="limparFiltros()">✕</button>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th onclick="ordenarHist('data')">Data ${histOrdem.campo==='data'?(histOrdem.asc?'↑':'↓'):''}</th>
              <th>Tipo</th>
              <th onclick="ordenarHist('esporte')">Esporte / Jogo ${histOrdem.campo==='esporte'?(histOrdem.asc?'↑':'↓'):''}</th>
              <th>Liga(s) / Aposta</th>
              <th onclick="ordenarHist('odd_total')">Odd ${histOrdem.campo==='odd_total'?(histOrdem.asc?'↑':'↓'):''}</th>
              <th onclick="ordenarHist('stake')">Stake ${histOrdem.campo==='stake'?(histOrdem.asc?'↑':'↓'):''}</th>
              <th>Resultado</th>
              <th onclick="ordenarHist('lucro')">Lucro ${histOrdem.campo==='lucro'?(histOrdem.asc?'↑':'↓'):''}</th>
              <th>Tag</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="hist-tbody">
            <tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted)">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
      <div id="hist-paginacao" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border)"></div>
    </div>

    <!-- Modal seleções -->
    <div id="modal-selecoes" class="modal-overlay">
      <div class="modal" style="max-width:700px">
        <div class="modal-header">
          <span class="modal-title">Detalhes da acumulada</span>
          <button class="btn-ghost btn" onclick="fecharModal('modal-selecoes')">✕</button>
        </div>
        <div id="modal-selecoes-body"></div>
      </div>
    </div>
  `;

  await carregarTabelaHistorico();
}

function onFiltEsporte() {
  const esporte = document.getElementById('filt-esporte')?.value;
  const ligaSel = document.getElementById('filt-liga');
  if (ligaSel) {
    ligaSel.innerHTML = '<option value="">Todas</option>' +
      (esporte && ESPORTES[esporte] && !ESPORTES[esporte].liga_livre
        ? ESPORTES[esporte].ligas.map(l=>`<option value="${l}">${l}</option>`).join('')
        : '');
  }
}

function aplicarFiltros() {
  histFiltros = {};
  const v = (id) => document.getElementById(id)?.value || undefined;
  const f = { dataInicio: v('filt-inicio'), dataFim: v('filt-fim'), esporte: v('filt-esporte'),
    liga: v('filt-liga'), resultado: v('filt-resultado'), tag: v('filt-tag'), tipo_registro: v('filt-tipo-reg') };
  Object.keys(f).forEach(k => { if (f[k]) histFiltros[k] = f[k]; });
  histPagina = 1;
  carregarTabelaHistorico();
}

function limparFiltros() { histFiltros = {}; histPagina = 1; renderHistorico(); }
function ordenarHist(campo) {
  histOrdem = { campo, asc: histOrdem.campo===campo ? !histOrdem.asc : false };
  carregarTabelaHistorico();
}

// Gera string descritiva para acumulada
function descreverAcumulada(aposta) {
  if (!aposta.selecoes || aposta.selecoes.length === 0) return '—';
  const partes = aposta.selecoes.map(s => {
    const emoji = ESPORTES[s.esporte]?.emoji || '';
    const nomes = [];
    if (s.time_a && s.time_b) nomes.push(`${s.time_a} × ${s.time_b}`);
    else if (s.time_a) nomes.push(s.time_a);
    else if (s.jogador) nomes.push(s.jogador);
    else if (s.piloto) nomes.push(s.piloto);
    else if (s.equipe) nomes.push(s.equipe);
    const desc = nomes.length ? nomes.join(' ') : (s.tipo_aposta || '');
    return `${emoji} ${s.liga || ESPORTES[s.esporte]?.nome || s.esporte}: ${desc}`;
  });
  return partes.join(' | ');
}

// Ligas únicas de uma acumulada
function ligasAcumulada(aposta) {
  if (!aposta.selecoes) return '—';
  const ligas = [...new Set(aposta.selecoes.map(s => s.liga || ESPORTES[s.esporte]?.nome || s.esporte).filter(Boolean))];
  return ligas.join(', ');
}

// Esportes únicos de uma acumulada
function esportesAcumulada(aposta) {
  if (!aposta.selecoes) return '—';
  const esp = [...new Set(aposta.selecoes.map(s => ESPORTES[s.esporte]?.emoji + ' ' + ESPORTES[s.esporte]?.nome || s.esporte).filter(Boolean))];
  return esp.join(', ');
}

async function carregarTabelaHistorico() {
  let apostas = await buscarApostas(histFiltros);

  // Para acumuladas, carregar seleções
  for (let a of apostas) {
    if (a.tipo_registro === 'acumulada' && !a.selecoes) {
      const completa = await buscarApostaComSelecoes(a.id);
      a.selecoes = completa?.selecoes || [];
    }
  }

  apostas = apostas.map(a => ({ ...a, lucro: calcLucro(a) }));
  apostas.sort((a, b) => {
    let va = a[histOrdem.campo], vb = b[histOrdem.campo];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb||'').toLowerCase(); }
    if (va === undefined) va = -Infinity;
    if (vb === undefined) vb = -Infinity;
    return histOrdem.asc ? (va>vb?1:-1) : (va<vb?1:-1);
  });

  const total = apostas.length;
  const totalPages = Math.max(1, Math.ceil(total / HIST_POR_PAG));
  histPagina = Math.min(histPagina, totalPages);
  const slice = apostas.slice((histPagina-1)*HIST_POR_PAG, histPagina*HIST_POR_PAG);

  const sub = document.getElementById('hist-total-sub');
  if (sub) {
    const stats = calcularEstatisticas(apostas);
    sub.textContent = `${total} apostas · ${fmtPct(stats.winRate)} WR · ROI ${fmtPct(stats.roi)} · ${fmtMoeda(stats.lucroTotal)}`;
  }

  const tbody = document.getElementById('hist-tbody');
  if (!tbody) return;

  if (slice.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted)">Nenhuma aposta encontrada</td></tr>`;
  } else {
    tbody.innerHTML = slice.map(a => {
      const lucro = calcLucro(a);
      const isAcum = a.tipo_registro === 'acumulada';

      // Coluna esporte/jogo
      let esporteCell = '';
      if (isAcum) {
        esporteCell = `<div style="font-size:.72rem;color:var(--text2)">${esportesAcumulada(a)}</div>`;
      } else {
        const emoji = ESPORTES[a.esporte]?.emoji || '';
        const nomeJogo = (() => {
          if (a.time_a && a.time_b) return `<span style="font-size:.72rem">${a.time_a} × ${a.time_b}</span>`;
          if (a.time_a) return `<span style="font-size:.72rem">${a.time_a}</span>`;
          if (a.jogador) return `<span style="font-size:.72rem">${a.jogador}${a.time_a?' ('+a.time_a+')':''}</span>`;
          if (a.piloto) return `<span style="font-size:.72rem">${a.piloto}</span>`;
          if (a.equipe) return `<span style="font-size:.72rem">${a.equipe}</span>`;
          return '';
        })();
        esporteCell = `<div>${emoji} ${ESPORTES[a.esporte]?.nome||a.esporte||'—'}</div>${nomeJogo}`;
      }

      // Coluna liga/aposta
      let ligaCell = '';
      if (isAcum) {
        const nSel = a.selecoes?.length || '?';
        ligaCell = `
          <div style="font-size:.72rem;color:var(--text2);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${ligasAcumulada(a)}">${ligasAcumulada(a)}</div>
          <span class="badge badge-acumulada" style="cursor:pointer;margin-top:2px" onclick="verSelecoes(${a.id})">${nSel} seleções →</span>`;
      } else {
        const linhaStr = a.linha ? ` (${a.linha})` : '';
        ligaCell = `<div style="font-size:.73rem">${a.liga||'—'}</div><div style="color:var(--text2);font-size:.68rem">${a.tipo_aposta||'—'}${linhaStr}</div>`;
      }

      return `<tr>
        <td style="white-space:nowrap">${fmtDataHora(a.data)}</td>
        <td><span class="badge ${isAcum?'badge-acumulada':'badge-simples'}">${isAcum?'ACUM':'SIMPL'}</span></td>
        <td>${esporteCell}</td>
        <td>${ligaCell}</td>
        <td class="td-odd">${fmtOdd(a.odd_total||a.odd)}</td>
        <td>${fmtMoedaSimples(a.stake)}</td>
        <td><span class="badge ${classeResultado(a.resultado)}">${labelResultado(a.resultado)}</span></td>
        <td class="td-lucro ${lucro>0?'pos':lucro<0?'neg':''}">${a.resultado&&a.resultado!=='pendente'?fmtMoeda(lucro):'—'}</td>
        <td>${a.tag?`<span class="badge badge-simples">${a.tag}</span>`:'—'}</td>
        <td><div class="acoes-td">
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="editarAposta(${a.id})">✎</button>
          <button class="btn btn-danger btn-sm btn-icon" title="Excluir" onclick="excluirApostaClick(${a.id})">✕</button>
        </div></td>
      </tr>`;
    }).join('');
  }

  const pag = document.getElementById('hist-paginacao');
  if (pag) {
    pag.innerHTML = `
      <span style="font-size:.72rem;color:var(--muted)">${total} registros · página ${histPagina}/${totalPages}</span>
      <div class="flex gap-8">
        <button class="btn btn-secondary btn-sm" onclick="histPagina--;carregarTabelaHistorico()" ${histPagina<=1?'disabled':''}>← Ant.</button>
        <button class="btn btn-secondary btn-sm" onclick="histPagina++;carregarTabelaHistorico()" ${histPagina>=totalPages?'disabled':''}>Próx. →</button>
      </div>`;
  }
}

async function editarAposta(id) {
  const aposta = await buscarApostaComSelecoes(id);
  if (!aposta) return;
  navegar('nova-aposta');
  setTimeout(() => initForm(aposta), 60);
}

async function excluirApostaClick(id) {
  if (!confirm('Excluir esta aposta? Esta ação não pode ser desfeita.')) return;
  await excluirAposta(id);
  toast('Aposta excluída');
  carregarTabelaHistorico();
}

async function verSelecoes(id) {
  const aposta = await buscarApostaComSelecoes(id);
  if (!aposta?.selecoes) return;
  const body = document.getElementById('modal-selecoes-body');
  if (body) {
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div>
          <span class="text-muted">Odd total:</span> <strong class="text-amber" style="font-size:1.1rem">${fmtOdd(aposta.odd_total)}</strong>
          &nbsp;&nbsp;<span class="text-muted">Stake:</span> <strong>${fmtMoedaSimples(aposta.stake)}</strong>
          &nbsp;&nbsp;<span class="text-muted">Lucro:</span> <strong class="${calcLucro(aposta)>=0?'text-green':'text-red'}">${fmtMoeda(calcLucro(aposta))}</strong>
        </div>
        <span class="badge ${classeResultado(aposta.resultado)}">${labelResultado(aposta.resultado)}</span>
      </div>
      ${aposta.selecoes.map((s,i) => {
        const emoji = ESPORTES[s.esporte]?.emoji || '';
        const nomeEsporte = ESPORTES[s.esporte]?.nome || s.esporte || '—';
        const jogoDesc = (() => {
          if (s.time_a && s.time_b) return `${s.time_a} × ${s.time_b}`;
          if (s.jogador) return `${s.jogador}${s.time_a?' ('+s.time_a+')':''}`;
          if (s.piloto) return s.piloto;
          if (s.equipe) return s.equipe;
          if (s.time_a) return s.time_a;
          return '—';
        })();
        return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <strong style="font-size:.8rem">${emoji} Seleção ${i+1} — ${nomeEsporte}</strong>
            <span class="badge ${classeResultado(s.resultado)}">${labelResultado(s.resultado)}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:.75rem">
            <div><span class="text-muted">Liga:</span> ${s.liga||'—'}</div>
            <div><span class="text-muted">Tipo:</span> ${s.tipo_aposta||'—'}</div>
            <div><span class="text-muted">Odd:</span> <strong>${fmtOdd(s.odd)}</strong></div>
            <div style="grid-column:span 3"><span class="text-muted">Seleção:</span> <strong>${jogoDesc}</strong>${s.linha?` &nbsp;·&nbsp; Linha: <strong>${s.linha}</strong>`:''}</div>
          </div>
        </div>`;
      }).join('')}`;
  }
  abrirModal('modal-selecoes');
}

async function exportarCSVClick() {
  const csv = await exportarCSV();
  download('apostas.csv', csv, 'text/csv');
  toast('CSV exportado!');
}
async function exportarJSONClick() {
  const json = await exportarJSON();
  download('bet-tracker-backup.json', json, 'application/json');
  toast('Backup JSON exportado!');
}
async function importarJSONClick(input) {
  const file = input.files[0]; if (!file) return;
  const text = await file.text();
  if (!confirm('Isso irá SUBSTITUIR todos os dados existentes. Continuar?')) return;
  try {
    await importarJSON(text);
    toast('Dados importados com sucesso!');
    renderHistorico();
  } catch(e) { toast('Erro ao importar: '+e.message, 'error'); }
}
function download(nome, conteudo, tipo) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([conteudo], {type: tipo}));
  a.download = nome; a.click();
}
