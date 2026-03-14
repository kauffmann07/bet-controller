// form.js — Formulário de nova aposta (simples + acumulada)

let formStep = 1;
let formData = {};
let editandoId = null;
let selecoes = [];

function initForm(apostaParaEditar = null) {
  editandoId = apostaParaEditar?.id || null;
  formStep = 1;
  selecoes = apostaParaEditar?.selecoes ? [...apostaParaEditar.selecoes] : [];
  formData = apostaParaEditar ? { ...apostaParaEditar } : {};

  const sec = document.getElementById('sec-nova-aposta');
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">${editandoId ? 'Editar Aposta' : 'Nova Aposta'}</div>
        <div class="section-sub">Registre os detalhes da aposta</div>
      </div>
    </div>
    <div class="card" style="max-width:760px;margin:0 auto">
      <div class="form-group">
        <label>Tipo de registro</label>
        <div class="tipo-toggle">
          <button id="btn-simples" onclick="setTipoRegistro('simples')">Simples</button>
          <button id="btn-acumulada" onclick="setTipoRegistro('acumulada')">Acumulada / Múltipla</button>
        </div>
      </div>
      <div class="step-bar">
        <div class="step-item" id="stab-1" onclick="irStep(1)">1. Contexto</div>
        <div class="step-item" id="stab-2" onclick="irStep(2)">2. Mercado</div>
        <div class="step-item" id="stab-3" onclick="irStep(3)">3. Resultado</div>
      </div>

      <!-- STEP 1 -->
      <div class="step-content" id="step-1">
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Data e hora</label>
            <input type="datetime-local" id="f-data" value="${formData.data || new Date().toISOString().slice(0,16)}">
          </div>
        </div>
        <div id="step1-extra"></div>
        <div style="display:flex;justify-content:flex-end;margin-top:8px">
          <button class="btn btn-primary" onclick="irStep(2)">Próximo →</button>
        </div>
      </div>

      <!-- STEP 2 -->
      <div class="step-content" id="step-2">
        <div id="campos-mercado"></div>
        <div style="display:flex;justify-content:space-between;margin-top:16px">
          <button class="btn btn-secondary" onclick="irStep(1)">← Voltar</button>
          <button class="btn btn-primary" onclick="irStep(3)">Próximo →</button>
        </div>
      </div>

      <!-- STEP 3 -->
      <div class="step-content" id="step-3">
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Resultado</label>
            <select id="f-resultado" onchange="onResultadoChange()">
              <option value="pendente" ${(!formData.resultado||formData.resultado==='pendente')?'selected':''}>Pendente</option>
              <option value="win"      ${formData.resultado==='win'?'selected':''}>WIN</option>
              <option value="loss"     ${formData.resultado==='loss'?'selected':''}>LOSS</option>
              <option value="void"     ${formData.resultado==='void'?'selected':''}>VOID (cancelada)</option>
              <option value="cashout"  ${formData.resultado==='cashout'?'selected':''}>Cashout</option>
            </select>
          </div>
          <div class="form-group" id="cashout-val-group" style="display:none">
            <label>Valor recebido (R$)</label>
            <input type="number" id="f-cashout-val" step="0.01" value="${formData.lucro_cashout||''}" oninput="atualizarPreviewLucro()">
          </div>
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Tag</label>
            <select id="f-tag">
              <option value="">Sem tag</option>
              ${TAGS.map(t=>`<option value="${t.value}" ${formData.tag===t.value?'selected':''}>${t.label} — ${t.desc}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Confiança</label>
            <div class="star-rating" id="star-rating">
              ${[1,2,3,4,5].map(i=>`<span data-v="${i}" class="${(formData.confianca||0)>=i?'on':''}" onclick="setStar(${i})">★</span>`).join('')}
            </div>
            <input type="hidden" id="f-confianca" value="${formData.confianca||0}">
          </div>
        </div>
        <div class="form-group">
          <label>Observações (opcional)</label>
          <textarea id="f-obs" rows="2" style="resize:vertical">${formData.obs||''}</textarea>
        </div>
        <div id="preview-lucro" style="margin-bottom:12px"></div>
        <div style="display:flex;justify-content:space-between">
          <button class="btn btn-secondary" onclick="irStep(2)">← Voltar</button>
          <button class="btn btn-primary" onclick="salvarApostaForm()" style="min-width:150px">
            ${editandoId ? 'Salvar alterações' : '✓ Registrar aposta'}
          </button>
        </div>
      </div>
    </div>
  `;

  setTipoRegistro(formData.tipo_registro || 'simples', true);
  irStep(1);
  if (formData.resultado === 'cashout') {
    document.getElementById('cashout-val-group').style.display = '';
  }
}

// ─── TIPO REGISTRO ──────────────────────────────────────────────────────────
function setTipoRegistro(tipo, silent = false) {
  formData.tipo_registro = tipo;
  document.getElementById('btn-simples')?.classList.toggle('active', tipo === 'simples');
  document.getElementById('btn-acumulada')?.classList.toggle('active', tipo === 'acumulada');
  renderStep1Extra();
  if (!silent) renderCamposMercado();
}

function renderStep1Extra() {
  const el = document.getElementById('step1-extra');
  if (!el) return;
  if (formData.tipo_registro === 'acumulada') {
    el.innerHTML = '';
    return;
  }
  // Simples: esporte + liga
  const esp = formData.esporte || '';
  const cfg = esp ? ESPORTES[esp] : null;
  const ligaFixa = cfg?.liga_fixa;
  const ligaLivre = cfg?.liga_livre;
  let ligaHtml = '';
  if (!esp) {
    ligaHtml = `<select id="f-liga" disabled><option>Selecione esporte primeiro</option></select>`;
  } else if (ligaLivre) {
    ligaHtml = `<input type="text" id="f-liga" placeholder="Ex: Wimbledon, Roland Garros..." value="${formData.liga||''}">`;
  } else if (ligaFixa) {
    ligaHtml = `<input type="text" id="f-liga" value="${ligaFixa}" readonly style="background:var(--bg3);color:var(--muted)">`;
  } else {
    const ligas = cfg?.ligas || [];
    ligaHtml = `<select id="f-liga"><option value="">Selecione...</option>${ligas.map(l=>`<option value="${l}" ${formData.liga===l?'selected':''}>${l}</option>`).join('')}</select>`;
  }

  el.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group">
        <label>Esporte</label>
        <select id="f-esporte" onchange="onEsporteChange()">
          <option value="">Selecione...</option>
          ${Object.entries(ESPORTES).map(([k,v])=>`<option value="${k}" ${esp===k?'selected':''}>${v.emoji} ${v.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>${ligaLivre ? 'Competição (escreva)' : 'Liga / Competição'}</label>
        ${ligaHtml}
      </div>
    </div>
  `;
  if (ligaFixa && esp) {
    formData.liga = ligaFixa;
  }
}

function onEsporteChange() {
  const el = document.getElementById('f-esporte');
  formData.esporte = el?.value || '';
  formData.liga = '';
  formData.tipo_aposta = '';
  renderStep1Extra();
  if (formStep === 2) renderCamposMercado();
}

// ─── STEP NAVIGATION ────────────────────────────────────────────────────────
function irStep(n) {
  // Salvar liga antes de trocar
  if (formStep === 1 && formData.tipo_registro === 'simples') {
    const ligaEl = document.getElementById('f-liga');
    if (ligaEl) formData.liga = ligaEl.value;
    const espEl = document.getElementById('f-esporte');
    if (espEl) formData.esporte = espEl.value;
  }
  formStep = n;
  document.querySelectorAll('.step-content').forEach((s,i) => s.classList.toggle('active', i+1===n));
  document.querySelectorAll('.step-item').forEach((s,i) => {
    s.classList.toggle('active', i+1===n);
    s.classList.toggle('done', i+1<n);
  });
  if (n === 2) renderCamposMercado();
  if (n === 3) atualizarPreviewLucro();
}

// ─── MERCADO ────────────────────────────────────────────────────────────────
function renderCamposMercado() {
  const el = document.getElementById('campos-mercado');
  if (!el) return;

  if (formData.tipo_registro === 'acumulada') {
    el.innerHTML = `
      <div class="form-group">
        <div class="flex items-center justify-between mb-16">
          <label style="margin-bottom:0">Seleções da acumulada</label>
          <button class="btn btn-secondary btn-sm" onclick="adicionarSelecao()">+ Adicionar seleção</button>
        </div>
        <div id="lista-selecoes"></div>
        <div class="odd-total-preview">
          <span class="label">Odd total (produto das seleções)</span>
          <span class="val" id="odd-total-display">—</span>
        </div>
      </div>
      <div class="form-group" style="max-width:220px">
        <label>Stake (R$)</label>
        <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||''}" oninput="atualizarOddTotal()">
      </div>
    `;
    renderSelecoes();
    return;
  }

  // Simples
  const esporte = formData.esporte;
  const cfg = esporte ? ESPORTES[esporte] : null;
  if (!esporte || !cfg) {
    el.innerHTML = `<div class="text-muted" style="padding:20px;text-align:center">Volte e selecione um esporte</div>`;
    return;
  }
  const tipos = cfg.tipos_aposta || [];

  el.innerHTML = `
    <div class="form-group">
      <label>Tipo de aposta</label>
      <select id="f-tipo-aposta" onchange="onTipoApostaChange()">
        <option value="">Selecione o tipo...</option>
        ${tipos.map(t=>`<option value="${t}" ${formData.tipo_aposta===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div id="campos-contexto-tipo"></div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label>Odd</label>
        <input type="number" id="f-odd" step="0.01" min="1.01" value="${formData.odd||''}" oninput="atualizarPreviewLucro()">
      </div>
      <div class="form-group">
        <label>Stake (R$)</label>
        <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||''}" oninput="atualizarPreviewLucro()">
      </div>
    </div>
  `;

  if (formData.tipo_aposta) onTipoApostaChange();
}

function onTipoApostaChange() {
  const tipoEl = document.getElementById('f-tipo-aposta');
  const tipo = tipoEl?.value || '';
  formData.tipo_aposta = tipo;
  const el = document.getElementById('campos-contexto-tipo');
  if (!el) return;
  el.innerHTML = renderCamposContextoTipo(formData.esporte, tipo, formData);
}

function renderCamposContextoTipo(esporte, tipo, dados = {}) {
  if (!esporte || !tipo) return '';
  const cfg = ESPORTES[esporte];
  if (!cfg) return '';
  const contexto = cfg.contexto?.[tipo] || 'nenhum';
  const temLinha = cfg.linhas?.includes(tipo);
  let html = '';

  if (esporte === 'f1') {
    if (contexto === 'piloto') {
      html += `<div class="form-group">
        <label>Piloto</label>
        <select id="f-piloto">
          <option value="">Selecione...</option>
          ${F1_PILOTOS_2026.map(p=>`<option value="${p}" ${dados.piloto===p?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>`;
      if (tipo === 'Melhor entre Companheiros (Piloto)') {
        html += `<div class="form-group">
          <label>Adversário (companheiro de equipe)</label>
          <select id="f-piloto2">
            <option value="">Selecione...</option>
            ${F1_PILOTOS_2026.map(p=>`<option value="${p}" ${dados.piloto2===p?'selected':''}>${p}</option>`).join('')}
          </select>
        </div>`;
      }
    } else if (contexto === 'equipe') {
      html += `<div class="form-group">
        <label>Equipe</label>
        <select id="f-equipe">
          <option value="">Selecione...</option>
          ${F1_EQUIPES_2026.map(e=>`<option value="${e}" ${dados.equipe===e?'selected':''}>${e}</option>`).join('')}
        </select>
      </div>`;
    }
    return html;
  }

  // Tênis: jogador = textbox (nome do atleta)
  if (esporte === 'tenis') {
    if (contexto === 'jogo') {
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>Jogador A</label><input type="text" id="f-time-a" value="${dados.time_a||''}" placeholder="Ex: Djokovic"></div>
        <div class="form-group"><label>Jogador B</label><input type="text" id="f-time-b" value="${dados.time_b||''}" placeholder="Ex: Alcaraz"></div>
      </div>`;
    } else if (contexto === 'jogador') {
      html += `<div class="form-group"><label>Jogador</label><input type="text" id="f-jogador" value="${dados.jogador||''}" placeholder="Ex: Sinner"></div>`;
    }
    if (temLinha) {
      html += `<div class="form-group" style="max-width:200px"><label>Linha (ex: 2.5)</label><input type="number" id="f-linha" step="0.5" value="${dados.linha||''}"></div>`;
    }
    return html;
  }

  // Futebol, Basquete, Americano
  const liga = dados.liga || (cfg.liga_fixa || '');
  const times = cfg.times?.[liga] || [];
  const timeOpts = times.length
    ? `<option value="">Selecione...</option>${times.map(t=>`<option value="${t}">${t}</option>`).join('')}`
    : `<option value="">Escreva o nome</option>`;
  const timeInput = times.length
    ? `<select id="f-time-a">${timeOpts}</select>`
    : `<input type="text" id="f-time-a" value="${dados.time_a||''}" placeholder="Nome do time">`;
  const timeBInput = times.length
    ? `<select id="f-time-b"><option value="">Selecione...</option>${times.map(t=>`<option value="${t}" ${dados.time_b===t?'selected':''}>${t}</option>`).join('')}</select>`
    : `<input type="text" id="f-time-b" value="${dados.time_b||''}" placeholder="Nome do time">`;

  if (contexto === 'jogo') {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time / Seleção A (mandante)</label>${timeInput}</div>
      <div class="form-group"><label>Time / Seleção B (visitante)</label>${timeBInput}</div>
    </div>`;
    // Setar valor pré-existente no select
    setTimeout(() => {
      const elA = document.getElementById('f-time-a');
      const elB = document.getElementById('f-time-b');
      if (elA && dados.time_a) elA.value = dados.time_a;
      if (elB && dados.time_b) elB.value = dados.time_b;
    }, 0);
  } else if (contexto === 'time') {
    const timeSingle = times.length
      ? `<select id="f-time-a"><option value="">Selecione...</option>${times.map(t=>`<option value="${t}" ${dados.time_a===t?'selected':''}>${t}</option>`).join('')}</select>`
      : `<input type="text" id="f-time-a" value="${dados.time_a||''}" placeholder="Nome do time">`;
    html += `<div class="form-group"><label>Time</label>${timeSingle}</div>`;
  } else if (contexto === 'jogador') {
    const timeParaJogador = times.length
      ? `<select id="f-time-a"><option value="">Selecione o time...</option>${times.map(t=>`<option value="${t}" ${dados.time_a===t?'selected':''}>${t}</option>`).join('')}</select>`
      : `<input type="text" id="f-time-a" value="${dados.time_a||''}" placeholder="Time do jogador">`;
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time do jogador</label>${timeParaJogador}</div>
      <div class="form-group"><label>Nome do jogador</label><input type="text" id="f-jogador" value="${dados.jogador||''}" placeholder="Ex: Vini Jr."></div>
    </div>`;
  }

  if (temLinha) {
    html += `<div class="form-group" style="max-width:200px"><label>Linha (ex: 2.5)</label><input type="number" id="f-linha" step="0.25" value="${dados.linha||''}"></div>`;
  }
  return html;
}

// ─── SELEÇÕES ACUMULADA ─────────────────────────────────────────────────────
function adicionarSelecao() {
  selecoes.push({ esporte:'', liga:'', tipo_aposta:'', odd:'', resultado:'pendente', ordem: selecoes.length+1 });
  renderSelecoes();
}

function removerSelecao(idx) {
  selecoes.splice(idx, 1);
  selecoes.forEach((s,i) => s.ordem = i+1);
  renderSelecoes();
}

function renderSelecoes() {
  const el = document.getElementById('lista-selecoes');
  if (!el) return;
  if (selecoes.length === 0) {
    el.innerHTML = `<div class="text-muted" style="text-align:center;padding:16px;border:1px dashed var(--border);border-radius:8px">Clique em "+ Adicionar seleção" para começar</div>`;
    atualizarOddTotal(); return;
  }
  el.innerHTML = selecoes.map((s,i) => {
    const cfg = s.esporte ? ESPORTES[s.esporte] : null;
    const ligaFixa = cfg?.liga_fixa;
    const ligaLivre = cfg?.liga_livre;
    const ligas = cfg?.ligas || [];
    let ligaHtml = '';
    if (!cfg) {
      ligaHtml = `<input type="text" disabled placeholder="Selecione esporte">`;
    } else if (ligaLivre) {
      ligaHtml = `<input type="text" value="${s.liga||''}" onchange="selecoes[${i}].liga=this.value" placeholder="Ex: Wimbledon">`;
    } else if (ligaFixa) {
      ligaHtml = `<input type="text" value="${ligaFixa}" readonly style="background:var(--bg4);color:var(--muted)">`;
    } else {
      ligaHtml = `<select onchange="onSelLiga(${i},this.value)"><option value="">Selecione...</option>${ligas.map(l=>`<option value="${l}" ${s.liga===l?'selected':''}>${l}</option>`).join('')}</select>`;
    }
    const tipos = cfg?.tipos_aposta || [];
    return `<div class="selecao-item">
      <div class="sel-header">
        <span class="selecao-numero">SELEÇÃO ${i+1}</span>
        <button class="btn btn-danger btn-sm" onclick="removerSelecao(${i})">✕</button>
      </div>
      <div class="form-row cols-3">
        <div class="form-group">
          <label>Esporte</label>
          <select onchange="onSelEsporte(${i},this.value)">
            <option value="">Selecione...</option>
            ${Object.entries(ESPORTES).map(([k,v])=>`<option value="${k}" ${s.esporte===k?'selected':''}>${v.emoji} ${v.nome}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>${ligaLivre?'Competição':'Liga'}</label>
          ${ligaHtml}
        </div>
        <div class="form-group">
          <label>Tipo de aposta</label>
          <select onchange="onSelTipo(${i},this.value)">
            <option value="">Selecione...</option>
            ${tipos.map(t=>`<option value="${t}" ${s.tipo_aposta===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="sel-ctx-${i}">${s.tipo_aposta ? renderCamposContextoTipoSel(i, s) : ''}</div>
      <div class="form-row cols-2" style="margin-top:8px">
        <div class="form-group">
          <label>Odd</label>
          <input type="number" step="0.01" min="1.01" value="${s.odd||''}" oninput="onSelOdd(${i},this.value)" placeholder="Ex: 1.85">
        </div>
        <div class="form-group">
          <label>Resultado desta seleção</label>
          <select onchange="selecoes[${i}].resultado=this.value">
            <option value="pendente" ${s.resultado==='pendente'?'selected':''}>Pendente</option>
            <option value="win"  ${s.resultado==='win'?'selected':''}>WIN</option>
            <option value="loss" ${s.resultado==='loss'?'selected':''}>LOSS</option>
            <option value="void" ${s.resultado==='void'?'selected':''}>VOID</option>
          </select>
        </div>
      </div>
    </div>`;
  }).join('');
  atualizarOddTotal();
}

function renderCamposContextoTipoSel(i, s) {
  const esporte = s.esporte;
  const tipo = s.tipo_aposta;
  if (!esporte || !tipo) return '';
  const cfg = ESPORTES[esporte];
  const contexto = cfg?.contexto?.[tipo] || 'nenhum';
  const temLinha = cfg?.linhas?.includes(tipo);
  let html = '';

  if (esporte === 'f1') {
    if (contexto === 'piloto') {
      html += `<div class="form-group"><label>Piloto</label><select onchange="selecoes[${i}].piloto=this.value"><option value="">Selecione...</option>${F1_PILOTOS_2026.map(p=>`<option value="${p}" ${s.piloto===p?'selected':''}>${p}</option>`).join('')}</select></div>`;
    } else if (contexto === 'equipe') {
      html += `<div class="form-group"><label>Equipe</label><select onchange="selecoes[${i}].equipe=this.value"><option value="">Selecione...</option>${F1_EQUIPES_2026.map(e=>`<option value="${e}" ${s.equipe===e?'selected':''}>${e}</option>`).join('')}</select></div>`;
    }
    return html;
  }

  if (esporte === 'tenis') {
    if (contexto === 'jogo') {
      html += `<div class="form-row cols-2"><div class="form-group"><label>Jogador A</label><input type="text" value="${s.time_a||''}" onchange="selecoes[${i}].time_a=this.value" placeholder="Ex: Djokovic"></div><div class="form-group"><label>Jogador B</label><input type="text" value="${s.time_b||''}" onchange="selecoes[${i}].time_b=this.value" placeholder="Ex: Alcaraz"></div></div>`;
    } else if (contexto === 'jogador') {
      html += `<div class="form-group"><label>Jogador</label><input type="text" value="${s.jogador||''}" onchange="selecoes[${i}].jogador=this.value"></div>`;
    }
    if (temLinha) html += `<div class="form-group" style="max-width:180px"><label>Linha</label><input type="number" step="0.5" value="${s.linha||''}" onchange="selecoes[${i}].linha=this.value"></div>`;
    return html;
  }

  const liga = s.liga || cfg?.liga_fixa || '';
  const times = cfg?.times?.[liga] || [];
  const mkSel = (id, val, ev) => times.length
    ? `<select onchange="${ev}"><option value="">Selecione...</option>${times.map(t=>`<option value="${t}" ${val===t?'selected':''}>${t}</option>`).join('')}</select>`
    : `<input type="text" value="${val||''}" onchange="${ev}" placeholder="Nome do time">`;

  if (contexto === 'jogo') {
    html += `<div class="form-row cols-2"><div class="form-group"><label>Time A (mandante)</label>${mkSel('',s.time_a,`selecoes[${i}].time_a=this.value`)}</div><div class="form-group"><label>Time B (visitante)</label>${mkSel('',s.time_b,`selecoes[${i}].time_b=this.value`)}</div></div>`;
  } else if (contexto === 'time') {
    html += `<div class="form-group"><label>Time</label>${mkSel('',s.time_a,`selecoes[${i}].time_a=this.value`)}</div>`;
  } else if (contexto === 'jogador') {
    html += `<div class="form-row cols-2"><div class="form-group"><label>Time do jogador</label>${mkSel('',s.time_a,`selecoes[${i}].time_a=this.value`)}</div><div class="form-group"><label>Nome do jogador</label><input type="text" value="${s.jogador||''}" onchange="selecoes[${i}].jogador=this.value" placeholder="Ex: Haaland"></div></div>`;
  }
  if (temLinha) html += `<div class="form-group" style="max-width:180px"><label>Linha</label><input type="number" step="0.25" value="${s.linha||''}" onchange="selecoes[${i}].linha=this.value"></div>`;
  return html;
}

function onSelEsporte(idx, val) {
  selecoes[idx].esporte = val;
  selecoes[idx].liga = ESPORTES[val]?.liga_fixa || '';
  selecoes[idx].tipo_aposta = '';
  renderSelecoes();
}
function onSelLiga(idx, val) { selecoes[idx].liga = val; renderSelecoes(); }
function onSelTipo(idx, val) { selecoes[idx].tipo_aposta = val; renderSelecoes(); }
function onSelOdd(idx, val) { selecoes[idx].odd = parseFloat(val)||0; atualizarOddTotal(); }

function atualizarOddTotal() {
  const prod = selecoes.reduce((p,s) => p * (parseFloat(s.odd)||1), 1);
  const el = document.getElementById('odd-total-display');
  if (el) el.textContent = selecoes.length > 0 ? fmtOdd(prod) : '—';
  atualizarPreviewLucro();
}

// ─── EVENTOS STEP 3 ─────────────────────────────────────────────────────────
function onResultadoChange() {
  const v = document.getElementById('f-resultado')?.value;
  const el = document.getElementById('cashout-val-group');
  if (el) el.style.display = v === 'cashout' ? '' : 'none';
  atualizarPreviewLucro();
}

function atualizarPreviewLucro() {
  const el = document.getElementById('preview-lucro');
  if (!el) return;
  const stake = parseFloat(document.getElementById('f-stake')?.value)||0;
  const resultado = document.getElementById('f-resultado')?.value;
  let odd = formData.tipo_registro === 'acumulada'
    ? selecoes.reduce((p,s) => p*(parseFloat(s.odd)||1), 1)
    : parseFloat(document.getElementById('f-odd')?.value)||0;
  if (!stake || !odd || !resultado || resultado === 'pendente') { el.innerHTML=''; return; }
  let msg = '';
  if (resultado === 'win') {
    const lucro = (odd-1)*stake;
    msg = `Lucro: <strong class="text-green">+${fmtMoedaSimples(lucro)}</strong> &nbsp;·&nbsp; Retorno: <strong class="text-green">${fmtMoedaSimples(odd*stake)}</strong>`;
  } else if (resultado === 'loss') {
    msg = `Prejuízo: <strong class="text-red">-${fmtMoedaSimples(stake)}</strong>`;
  } else if (resultado === 'cashout') {
    const cv = parseFloat(document.getElementById('f-cashout-val')?.value)||0;
    const l = cv - stake;
    msg = `Resultado: <strong class="${l>=0?'text-green':'text-red'}">${fmtMoeda(l)}</strong>`;
  } else if (resultado === 'void') {
    msg = `<span class="text-muted">Stake devolvido (VOID)</span>`;
  }
  el.innerHTML = `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:.78rem">${msg}</div>`;
}

function setStar(n) {
  document.getElementById('f-confianca').value = n;
  document.querySelectorAll('#star-rating span').forEach((s,i) => s.classList.toggle('on', i<n));
}

// ─── COLETAR DADOS CONTEXTO ─────────────────────────────────────────────────
function coletarContextoSimples() {
  const esporte = formData.esporte;
  const tipo = formData.tipo_aposta || document.getElementById('f-tipo-aposta')?.value || '';
  const cfg = ESPORTES[esporte];
  const contexto = cfg?.contexto?.[tipo] || 'nenhum';
  const out = { tipo_aposta: tipo };

  if (esporte === 'f1') {
    out.piloto = document.getElementById('f-piloto')?.value || '';
    out.piloto2 = document.getElementById('f-piloto2')?.value || '';
    out.equipe = document.getElementById('f-equipe')?.value || '';
  } else if (esporte === 'tenis') {
    out.time_a = document.getElementById('f-time-a')?.value || '';
    out.time_b = document.getElementById('f-time-b')?.value || '';
    out.jogador = document.getElementById('f-jogador')?.value || '';
  } else {
    if (contexto === 'jogo') {
      out.time_a = document.getElementById('f-time-a')?.value || '';
      out.time_b = document.getElementById('f-time-b')?.value || '';
    } else if (contexto === 'time') {
      out.time_a = document.getElementById('f-time-a')?.value || '';
    } else if (contexto === 'jogador') {
      out.time_a = document.getElementById('f-time-a')?.value || '';
      out.jogador = document.getElementById('f-jogador')?.value || '';
    }
  }
  out.linha = document.getElementById('f-linha')?.value || '';
  return out;
}

// ─── SALVAR ─────────────────────────────────────────────────────────────────
async function salvarApostaForm() {
  try {
    const tipo = formData.tipo_registro || 'simples';
    const base = {
      tipo_registro: tipo,
      data: document.getElementById('f-data')?.value || new Date().toISOString().slice(0,16),
      casa_aposta: CASA_APOSTA_UNICA,
      resultado: document.getElementById('f-resultado')?.value || 'pendente',
      lucro_cashout: parseFloat(document.getElementById('f-cashout-val')?.value)||0,
      tag: document.getElementById('f-tag')?.value || '',
      confianca: parseInt(document.getElementById('f-confianca')?.value)||0,
      obs: document.getElementById('f-obs')?.value || '',
    };

    if (tipo === 'simples') {
      const esporte = formData.esporte;
      const ligaEl = document.getElementById('f-liga');
      const liga = ligaEl?.value || formData.liga || '';
      const tipoAposta = document.getElementById('f-tipo-aposta')?.value || '';
      const odd = parseFloat(document.getElementById('f-odd')?.value);
      const stake = parseFloat(document.getElementById('f-stake')?.value);
      if (!esporte) { toast('Selecione o esporte', 'error'); irStep(1); return; }
      if (!tipoAposta) { toast('Selecione o tipo de aposta', 'error'); irStep(2); return; }
      if (!odd || odd < 1.01) { toast('Odd inválida (mínimo 1.01)', 'error'); irStep(2); return; }
      if (!stake || stake <= 0) { toast('Stake inválida', 'error'); irStep(2); return; }
      const ctx = coletarContextoSimples();
      Object.assign(base, { esporte, liga, odd_total: odd, odd, stake, ...ctx });
    } else {
      if (selecoes.length < 2) { toast('Adicione pelo menos 2 seleções', 'error'); return; }
      const stake = parseFloat(document.getElementById('f-stake')?.value);
      if (!stake || stake <= 0) { toast('Stake inválida', 'error'); return; }
      const odd_total = selecoes.reduce((p,s) => p*(parseFloat(s.odd)||1), 1);
      Object.assign(base, { stake, odd_total, selecoes: selecoes.map(s=>({...s})) });
    }

    if (editandoId) {
      await atualizarAposta(editandoId, base);
      toast('Aposta atualizada!');
    } else {
      await salvarAposta(base);
      toast('Aposta registrada!');
    }
    navegar('historico');
  } catch(e) {
    console.error(e);
    toast('Erro ao salvar: ' + e.message, 'error');
  }
}
