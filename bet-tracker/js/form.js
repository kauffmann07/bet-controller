// form.js — Formulário de nova aposta (simples + acumulada)

let formStep = 1;
let formData = {};
let editandoId = null;
let selecoes = [];

function initForm(apostaParaEditar = null) {
  editandoId = apostaParaEditar?.id || null;
  formStep = 1;
  selecoes = [];
  formData = apostaParaEditar ? { ...apostaParaEditar } : {};

  const sec = document.getElementById('sec-nova-aposta');
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">${editandoId ? 'Editar Aposta' : 'Nova Aposta'}</div>
        <div class="section-sub">Registre os detalhes da aposta</div>
      </div>
    </div>

    <div class="card" style="max-width:720px;margin:0 auto">
      <!-- Tipo de aposta: simples ou acumulada -->
      <div class="form-group">
        <label>Tipo de registro</label>
        <div style="display:flex;gap:8px">
          <button id="btn-simples" class="btn btn-secondary ${!formData.tipo_registro || formData.tipo_registro==='simples' ? 'btn-primary' : ''}" onclick="setTipoRegistro('simples')" style="flex:1">Simples</button>
          <button id="btn-acumulada" class="btn btn-secondary ${formData.tipo_registro==='acumulada' ? 'btn-primary' : ''}" onclick="setTipoRegistro('acumulada')" style="flex:1">Acumulada / Múltipla</button>
        </div>
      </div>

      <div class="step-bar">
        <div class="step-item ${formStep>=1?'active':''}" onclick="irStep(1)">1. Contexto</div>
        <div class="step-item ${formStep>=2?'active':''}" onclick="irStep(2)" id="step2-tab">2. Mercado</div>
        <div class="step-item ${formStep>=3?'active':''}" onclick="irStep(3)" id="step3-tab">3. Resultado</div>
      </div>

      <!-- STEP 1 -->
      <div class="step-content ${formStep===1?'active':''}" id="step-1">
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Data e hora</label>
            <input type="datetime-local" id="f-data" value="${formData.data || new Date().toISOString().slice(0,16)}">
          </div>
          <div class="form-group">
            <label>Casa de aposta</label>
            <select id="f-casa">
              <option value="">Selecione...</option>
              ${CASAS_APOSTA.map(c => `<option value="${c}" ${formData.casa_aposta===c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div id="campos-simples-step1">
          ${renderCamposContextoSimples()}
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:16px">
          <button class="btn btn-primary" onclick="irStep(2)">Próximo →</button>
        </div>
      </div>

      <!-- STEP 2 -->
      <div class="step-content ${formStep===2?'active':''}" id="step-2">
        <div id="campos-mercado"></div>
        <div style="display:flex;justify-content:space-between;margin-top:16px">
          <button class="btn btn-secondary" onclick="irStep(1)">← Voltar</button>
          <button class="btn btn-primary" onclick="irStep(3)">Próximo →</button>
        </div>
      </div>

      <!-- STEP 3 -->
      <div class="step-content ${formStep===3?'active':''}" id="step-3">
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Resultado</label>
            <select id="f-resultado">
              <option value="pendente" ${formData.resultado==='pendente'||!formData.resultado?'selected':''}>Pendente</option>
              <option value="win" ${formData.resultado==='win'?'selected':''}>WIN</option>
              <option value="loss" ${formData.resultado==='loss'?'selected':''}>LOSS</option>
              <option value="void" ${formData.resultado==='void'?'selected':''}>VOID (cancelada)</option>
              <option value="cashout" ${formData.resultado==='cashout'?'selected':''}>Cashout</option>
            </select>
          </div>
          <div class="form-group" id="cashout-val-group" style="${formData.resultado==='cashout'?'':'display:none'}">
            <label>Valor recebido no cashout (R$)</label>
            <input type="number" id="f-cashout-val" step="0.01" value="${formData.lucro_cashout||''}">
          </div>
        </div>
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Tag</label>
            <select id="f-tag">
              <option value="">Sem tag</option>
              ${TAGS.map(t => `<option value="${t.value}" ${formData.tag===t.value?'selected':''}>${t.label} — ${t.desc}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Confiança</label>
            <div class="star-rating" id="star-rating">
              ${[1,2,3,4,5].map(i => `<span data-v="${i}" class="${(formData.confianca||0)>=i?'on':''}" onclick="setStar(${i})">★</span>`).join('')}
            </div>
            <input type="hidden" id="f-confianca" value="${formData.confianca||0}">
          </div>
        </div>
        <div class="form-group">
          <label>Observações (opcional)</label>
          <textarea id="f-obs" rows="3" style="resize:vertical">${formData.obs||''}</textarea>
        </div>
        <div id="preview-lucro" style="margin-bottom:16px"></div>
        <div style="display:flex;justify-content:space-between;margin-top:8px">
          <button class="btn btn-secondary" onclick="irStep(2)">← Voltar</button>
          <button class="btn btn-primary" onclick="salvarApostaForm()" style="min-width:140px">
            ${editandoId ? 'Salvar alterações' : '✓ Registrar aposta'}
          </button>
        </div>
      </div>
    </div>
  `;

  // Listener resultado
  document.getElementById('f-resultado')?.addEventListener('change', e => {
    const cashoutGrp = document.getElementById('cashout-val-group');
    if (cashoutGrp) cashoutGrp.style.display = e.target.value === 'cashout' ? '' : 'none';
    atualizarPreviewLucro();
  });
  document.getElementById('f-cashout-val')?.addEventListener('input', atualizarPreviewLucro);

  // Tipo inicial
  setTipoRegistro(formData.tipo_registro || 'simples', true);
  if (formData.tipo_registro === 'acumulada' && formData.selecoes) {
    selecoes = formData.selecoes;
    renderSelecoes();
  }
}

function renderCamposContextoSimples() {
  return `
    <div class="form-row cols-2">
      <div class="form-group">
        <label>Esporte</label>
        <select id="f-esporte" onchange="onEsporteChange()">
          <option value="">Selecione...</option>
          ${Object.entries(ESPORTES).map(([k,v]) => `<option value="${k}" ${formData.esporte===k?'selected':''}>${v.emoji} ${v.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Liga / Competição</label>
        <select id="f-liga">
          <option value="">Selecione o esporte primeiro</option>
          ${formData.esporte ? ESPORTES[formData.esporte].ligas.map(l => `<option value="${l}" ${formData.liga===l?'selected':''}>${l}</option>`).join('') : ''}
        </select>
      </div>
    </div>
    <div class="form-row cols-2">
      <div class="form-group">
        <label>Time / Atleta (opcional)</label>
        <input type="text" id="f-time" value="${formData.time||''}" placeholder="Ex: Manchester City">
      </div>
      <div class="form-group">
        <label>Adversário (opcional)</label>
        <input type="text" id="f-adversario" value="${formData.adversario||''}" placeholder="Ex: Liverpool">
      </div>
    </div>
  `;
}

function setTipoRegistro(tipo, silencioso = false) {
  formData.tipo_registro = tipo;
  document.getElementById('btn-simples')?.classList.toggle('btn-primary', tipo === 'simples');
  document.getElementById('btn-simples')?.classList.toggle('btn-secondary', tipo !== 'simples');
  document.getElementById('btn-acumulada')?.classList.toggle('btn-primary', tipo === 'acumulada');
  document.getElementById('btn-acumulada')?.classList.toggle('btn-secondary', tipo !== 'acumulada');

  const step1Extra = document.getElementById('campos-simples-step1');
  if (step1Extra) {
    if (tipo === 'simples') {
      step1Extra.innerHTML = renderCamposContextoSimples();
      if (formData.esporte) onEsporteChange();
    } else {
      step1Extra.innerHTML = '';
    }
  }
  if (!silencioso) renderCamposMercado();
}

function onEsporteChange() {
  const esporte = document.getElementById('f-esporte')?.value;
  formData.esporte = esporte;
  const ligaSel = document.getElementById('f-liga');
  if (ligaSel && esporte && ESPORTES[esporte]) {
    ligaSel.innerHTML = `<option value="">Selecione...</option>` +
      ESPORTES[esporte].ligas.map(l => `<option value="${l}">${l}</option>`).join('');
  }
  // Atualizar tipos de aposta no step 2 se já estiver aberto
  if (formStep === 2) renderCamposMercado();
}

function irStep(n) {
  formStep = n;
  document.querySelectorAll('.step-content').forEach((s, i) => s.classList.toggle('active', i+1 === n));
  document.querySelectorAll('.step-item').forEach((s, i) => s.classList.toggle('active', i+1 === n));
  if (n === 2) renderCamposMercado();
  if (n === 3) atualizarPreviewLucro();
}

function renderCamposMercado() {
  const el = document.getElementById('campos-mercado');
  if (!el) return;
  const tipo = formData.tipo_registro;

  if (tipo === 'acumulada') {
    el.innerHTML = `
      <div class="form-group">
        <div class="flex items-center justify-between mb-16">
          <label style="margin-bottom:0">Seleções da acumulada</label>
          <button class="btn btn-secondary btn-sm" onclick="adicionarSelecao()">+ Adicionar seleção</button>
        </div>
        <div id="lista-selecoes"></div>
        <div class="odd-total-preview">
          <span class="label">Odd total (produto)</span>
          <span class="val" id="odd-total-display">—</span>
        </div>
      </div>
      <div class="form-row cols-2">
        <div class="form-group">
          <label>Stake (R$)</label>
          <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||''}" oninput="atualizarOddTotal()">
        </div>
      </div>
    `;
    renderSelecoes();
  } else {
    const esporte = document.getElementById('f-esporte')?.value || formData.esporte;
    const tipos = esporte && ESPORTES[esporte] ? ESPORTES[esporte].tipos_aposta : [];
    el.innerHTML = `
      <div class="form-row cols-2">
        <div class="form-group">
          <label>Tipo de aposta</label>
          <select id="f-tipo-aposta" onchange="onTipoApostaChange()">
            <option value="">Selecione...</option>
            ${tipos.map(t => `<option value="${t}" ${formData.tipo_aposta===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Odd</label>
          <input type="number" id="f-odd" step="0.01" min="1.01" value="${formData.odd||''}" oninput="atualizarPreviewLucro()">
        </div>
      </div>
      <div id="campos-extras-tipo"></div>
      <div class="form-row cols-2">
        <div class="form-group">
          <label>Stake (R$)</label>
          <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||''}" oninput="atualizarPreviewLucro()">
        </div>
      </div>
    `;
    if (formData.tipo_aposta) onTipoApostaChange();
  }
}

function onTipoApostaChange() {
  const esporte = document.getElementById('f-esporte')?.value || formData.esporte;
  const tipo = document.getElementById('f-tipo-aposta')?.value;
  const el = document.getElementById('campos-extras-tipo');
  if (!el || !esporte || !tipo) return;
  const extras = ESPORTES[esporte]?.campos_extras?.[tipo] || [];
  el.innerHTML = extras.length ? `<div class="form-row cols-${Math.min(extras.length, 3)}">` +
    extras.map(c => `<div class="form-group">
      <label>${c.label}</label>
      <input type="${c.type}" id="f-extra-${c.id}" step="${c.step||''}" value="${formData['extra_'+c.id]||''}">
    </div>`).join('') + '</div>' : '';
}

// ─── SELEÇÕES ACUMULADA ─────────────────────────────────────────────────────
function adicionarSelecao() {
  selecoes.push({ esporte: '', liga: '', tipo_aposta: '', odd: '', resultado: 'pendente', ordem: selecoes.length + 1 });
  renderSelecoes();
}

function removerSelecao(idx) {
  selecoes.splice(idx, 1);
  selecoes.forEach((s, i) => s.ordem = i + 1);
  renderSelecoes();
}

function renderSelecoes() {
  const el = document.getElementById('lista-selecoes');
  if (!el) return;
  if (selecoes.length === 0) {
    el.innerHTML = `<div class="text-muted" style="text-align:center;padding:16px;border:1px dashed var(--border);border-radius:8px">Clique em "+ Adicionar seleção" para começar</div>`;
    atualizarOddTotal(); return;
  }
  el.innerHTML = selecoes.map((s, i) => {
    const tipos = s.esporte && ESPORTES[s.esporte] ? ESPORTES[s.esporte].tipos_aposta : [];
    const ligas = s.esporte && ESPORTES[s.esporte] ? ESPORTES[s.esporte].ligas : [];
    return `<div class="selecao-item">
      <div class="sel-header">
        <span class="selecao-numero">SELEÇÃO ${i+1}</span>
        <button class="btn btn-danger btn-sm" onclick="removerSelecao(${i})">✕ Remover</button>
      </div>
      <div class="form-row cols-3">
        <div class="form-group">
          <label>Esporte</label>
          <select onchange="onSelEsporte(${i}, this.value)">
            <option value="">Selecione...</option>
            ${Object.entries(ESPORTES).map(([k,v]) => `<option value="${k}" ${s.esporte===k?'selected':''}>${v.emoji} ${v.nome}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Liga</label>
          <select onchange="selecoes[${i}].liga=this.value">
            <option value="">Selecione...</option>
            ${ligas.map(l => `<option value="${l}" ${s.liga===l?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Tipo de aposta</label>
          <select onchange="selecoes[${i}].tipo_aposta=this.value">
            <option value="">Selecione...</option>
            ${tipos.map(t => `<option value="${t}" ${s.tipo_aposta===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row cols-3">
        <div class="form-group">
          <label>Time/Atleta (opcional)</label>
          <input type="text" value="${s.time||''}" onchange="selecoes[${i}].time=this.value" placeholder="Ex: Real Madrid">
        </div>
        <div class="form-group">
          <label>Linha/Handicap</label>
          <input type="number" step="0.25" value="${s.linha||''}" onchange="selecoes[${i}].linha=this.value" placeholder="Ex: 2.5">
        </div>
        <div class="form-group">
          <label>Odd</label>
          <input type="number" step="0.01" min="1.01" value="${s.odd||''}" oninput="onSelOdd(${i}, this.value)" placeholder="Ex: 1.85">
        </div>
      </div>
      <div class="form-row cols-2">
        <div class="form-group">
          <label>Resultado desta seleção</label>
          <select onchange="selecoes[${i}].resultado=this.value">
            <option value="pendente" ${s.resultado==='pendente'?'selected':''}>Pendente</option>
            <option value="win" ${s.resultado==='win'?'selected':''}>WIN</option>
            <option value="loss" ${s.resultado==='loss'?'selected':''}>LOSS</option>
            <option value="void" ${s.resultado==='void'?'selected':''}>VOID</option>
          </select>
        </div>
      </div>
    </div>`;
  }).join('');
  atualizarOddTotal();
}

function onSelEsporte(idx, val) {
  selecoes[idx].esporte = val;
  selecoes[idx].liga = '';
  selecoes[idx].tipo_aposta = '';
  renderSelecoes();
}

function onSelOdd(idx, val) {
  selecoes[idx].odd = parseFloat(val) || 0;
  atualizarOddTotal();
}

function atualizarOddTotal() {
  const oddTotal = selecoes.reduce((prod, s) => prod * (parseFloat(s.odd) || 1), 1);
  const el = document.getElementById('odd-total-display');
  if (el) el.textContent = selecoes.length > 0 ? fmtOdd(oddTotal) : '—';
  atualizarPreviewLucro();
}

// ─── PREVIEW LUCRO ──────────────────────────────────────────────────────────
function atualizarPreviewLucro() {
  const el = document.getElementById('preview-lucro');
  if (!el) return;
  const stake = parseFloat(document.getElementById('f-stake')?.value) || 0;
  const resultado = document.getElementById('f-resultado')?.value;
  let odd;
  if (formData.tipo_registro === 'acumulada') {
    odd = selecoes.reduce((p, s) => p * (parseFloat(s.odd) || 1), 1);
  } else {
    odd = parseFloat(document.getElementById('f-odd')?.value) || 0;
  }
  if (!stake || !odd || !resultado || resultado === 'pendente') { el.innerHTML = ''; return; }

  let lucro = 0, msg = '';
  if (resultado === 'win') { lucro = (odd - 1) * stake; msg = `Lucro: <span class="text-green">+${fmtMoedaSimples(lucro)}</span>  ·  Retorno total: <span class="text-green">${fmtMoedaSimples(odd * stake)}</span>`; }
  else if (resultado === 'loss') { lucro = -stake; msg = `Prejuízo: <span class="text-red">${fmtMoeda(lucro)}</span>`; }
  else if (resultado === 'cashout') {
    const cv = parseFloat(document.getElementById('f-cashout-val')?.value) || 0;
    lucro = cv - stake;
    msg = `Resultado do cashout: <span class="${lucro >= 0 ? 'text-green' : 'text-red'}">${fmtMoeda(lucro)}</span>`;
  }
  else if (resultado === 'void') { msg = `<span class="text-muted">Stake devolvido (VOID)</span>`; }
  el.innerHTML = `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:.78rem">${msg}</div>`;
}

function setStar(n) {
  document.getElementById('f-confianca').value = n;
  document.querySelectorAll('#star-rating span').forEach((s, i) => s.classList.toggle('on', i < n));
}

// ─── SALVAR ─────────────────────────────────────────────────────────────────
async function salvarApostaForm() {
  try {
    const tipo = formData.tipo_registro || 'simples';
    const data = {
      tipo_registro: tipo,
      data: document.getElementById('f-data')?.value || new Date().toISOString().slice(0,16),
      casa_aposta: document.getElementById('f-casa')?.value || '',
      resultado: document.getElementById('f-resultado')?.value || 'pendente',
      lucro_cashout: parseFloat(document.getElementById('f-cashout-val')?.value) || 0,
      tag: document.getElementById('f-tag')?.value || '',
      confianca: parseInt(document.getElementById('f-confianca')?.value) || 0,
      obs: document.getElementById('f-obs')?.value || '',
    };

    if (tipo === 'simples') {
      const esporte = document.getElementById('f-esporte')?.value;
      const tipoAposta = document.getElementById('f-tipo-aposta')?.value;
      if (!esporte) { toast('Selecione o esporte', 'error'); irStep(1); return; }
      if (!tipoAposta) { toast('Selecione o tipo de aposta', 'error'); irStep(2); return; }
      const odd = parseFloat(document.getElementById('f-odd')?.value);
      const stake = parseFloat(document.getElementById('f-stake')?.value);
      if (!odd || odd < 1.01) { toast('Odd inválida', 'error'); irStep(2); return; }
      if (!stake || stake <= 0) { toast('Stake inválida', 'error'); irStep(2); return; }

      // Campos extras
      const esporteConfig = ESPORTES[esporte] || {};
      const extras = esporteConfig.campos_extras?.[tipoAposta] || [];
      extras.forEach(c => { data['extra_' + c.id] = document.getElementById('f-extra-' + c.id)?.value || ''; });

      Object.assign(data, {
        esporte, liga: document.getElementById('f-liga')?.value || '',
        tipo_aposta: tipoAposta,
        time: document.getElementById('f-time')?.value || '',
        adversario: document.getElementById('f-adversario')?.value || '',
        odd_total: odd, odd, stake
      });
    } else {
      if (selecoes.length < 2) { toast('Adicione pelo menos 2 seleções', 'error'); return; }
      const stake = parseFloat(document.getElementById('f-stake')?.value);
      if (!stake || stake <= 0) { toast('Stake inválida', 'error'); return; }
      const odd_total = selecoes.reduce((p, s) => p * (parseFloat(s.odd) || 1), 1);
      Object.assign(data, { stake, odd_total, selecoes: selecoes.map(s => ({ ...s })) });
    }

    if (editandoId) {
      await atualizarAposta(editandoId, data);
      toast('Aposta atualizada!');
    } else {
      await salvarAposta(data);
      toast('Aposta registrada!');
    }
    navegar('historico');
  } catch (e) {
    console.error(e);
    toast('Erro ao salvar: ' + e.message, 'error');
  }
}
