// form.js — Formulário de nova aposta (simples + acumulada)

let formStep = 1;
let formData = {};
let editandoId = null;
let selecoes = [];

// ─── GRUPOS DE MERCADO POR ESPORTE ────────────────────────────────────────────
const GRUPOS_MERCADO = {
  futebol: [
    { label: "Resultado",       tipos: ["1X2","Dupla Chance","Resultado Exato","Resultado ao Intervalo"] },
    { label: "Gols",            tipos: ["Over/Under Gols","Over/Under 1º Tempo","Gols 1º Tempo","Ambos Marcam"] },
    { label: "Handicap",        tipos: ["Handicap Asiático","Handicap Europeu"] },
    { label: "Jogador — Gol",   tipos: ["Primeiro Gol (Jogador)","Último Gol (Jogador)","A Qualquer Momento (Jogador)","Gols do Jogador (Over/Under)","Assistências do Jogador (Over/Under)"] },
    { label: "Jogador — Stats", tipos: ["Finalizações do Jogador (Over/Under)","Passes do Jogador (Over/Under)","Desarmes do Jogador (Over/Under)","Escanteios (Jogador)","Cartão (Jogador)","Faltas (Jogador)"] },
    { label: "Jogo — Stats",    tipos: ["Escanteios (Jogo)","Escanteios (Time)","Cartões (Jogo)","Cartões (Time)","Chutes a Gol (Jogo)","Chutes a Gol (Time)","Finalizações (Jogo)","Faltas (Jogo)","Clean Sheet (Time)"] },
  ],
  basquete: [
    { label: "Vencedor",        tipos: ["Moneyline","Vencedor do Quarto","Vencedor por Intervalo"] },
    { label: "Pontuação",       tipos: ["Handicap Pontos","Over/Under Pontos","Over/Under 1º Quarto","Over/Under 2º Quarto","Over/Under 3º Quarto","Over/Under 4º Quarto","Handicap 1º Quarto","Maior Pontuação no Quarto"] },
    { label: "Jogador — Pts",   tipos: ["Pontos do Jogador (Over/Under)","Três Pontos do Jogador (Over/Under)","Pontos no 1º Quarto (Over/Under)","Lances Livres do Jogador (Over/Under)"] },
    { label: "Jogador — Stats", tipos: ["Rebotes do Jogador (Over/Under)","Rebotes Ofensivos do Jogador (Over/Under)","Assistências do Jogador (Over/Under)","Roubos do Jogador (Over/Under)","Bloqueios do Jogador (Over/Under)","Erros do Jogador (Over/Under)","Minutos do Jogador (Over/Under)"] },
    { label: "Jogador — Combo", tipos: ["Pts+Reb+Ast do Jogador (Over/Under)","Pts+Reb do Jogador (Over/Under)","Pts+Ast do Jogador (Over/Under)","Reb+Ast do Jogador (Over/Under)","Duplo-Duplo (Jogador)","Triplo-Duplo (Jogador)"] },
  ],
  tenis: [
    { label: "Vencedor",      tipos: ["Moneyline","Vencedor do 1º Set","Vencedor do 2º Set","Vencedor do Set"] },
    { label: "Handicap",      tipos: ["Handicap Games","Handicap Sets"] },
    { label: "Totais",        tipos: ["Over/Under Sets","Over/Under Games","Over/Under Games no Set"] },
    { label: "Especiais",     tipos: ["Set Correto","Tiebreak no Jogo","Tiebreak no Set"] },
    { label: "Jogador",       tipos: ["Aces do Jogador (Over/Under)","Double Faults (Over/Under)","Winners do Jogador (Over/Under)","Quebras de Serviço (Over/Under)","Erros Não Forçados (Over/Under)","Pontos de Serviço Vencidos (Over/Under)"] },
  ],
  americano: [
    { label: "Vencedor",        tipos: ["Moneyline","Vencedor da 1ª Metade","Vencedor do 1º Quarto","Equipe Marca Primeiro"] },
    { label: "Handicap",        tipos: ["Spread"] },
    { label: "Pontuação",       tipos: ["Over/Under Pontos","Over/Under 1ª Metade","Over/Under 2ª Metade","Over/Under Touchdowns","Over/Under Field Goals"] },
    { label: "QB / Passe",      tipos: ["Jardas Passadas (Over/Under)","Touchdowns de Passe (Over/Under)","Interceptações (Over/Under)"] },
    { label: "Corrida / Rec.",  tipos: ["Jardas Corridas (Over/Under)","Recepções (Over/Under)","Jardas por Recepção (Over/Under)","TDs Corridos (Over/Under)"] },
    { label: "Jogador — Geral", tipos: ["Primeiro TD (Jogador)","Anytime TD (Jogador)","Sacks do Jogador (Over/Under)","Tackles+Assists do Jogador (Over/Under)"] },
  ],
  f1: [
    { label: "Piloto",        tipos: ["Vencedor da Corrida (Piloto)","Pole Position (Piloto)","Pódio (Piloto)","Pontos Top-10 (Piloto)","Líder Após 1ª Volta (Piloto)","Mais Rápido na Corrida (Piloto)","Volta Mais Rápida (Piloto)","DNF (Piloto)","Posição de Chegada (Over/Under)"] },
    { label: "Duelo",         tipos: ["Melhor entre Companheiros (Piloto)"] },
    { label: "Construtores",  tipos: ["Vencedor da Corrida (Equipe)","Pole Position (Equipe)","Construtor Vencedor"] },
    { label: "Especiais",     tipos: ["Safety Car na Corrida"] },
  ],
  mma: [
    { label: "Vencedor",    tipos: ["Vencedor da Luta"] },
    { label: "Método",      tipos: ["Método de Vitória — KO/TKO","Método de Vitória — Submission","Método de Vitória — Decisão","Luta Vai à Decisão"] },
    { label: "Round",       tipos: ["Luta Termina no 1º Round","Luta Termina no 2º Round","Luta Termina no 3º Round","Round da Vitória (Over/Under)","Duração da Luta (Over/Under)"] },
    { label: "Stats",       tipos: ["Tentativas de Finalização (Over/Under)","Derrubadas (Over/Under)","Significant Strikes (Over/Under)","Takedowns Completados (Over/Under)","Knockdowns na Luta (Over/Under)"] },
  ],
  volei: [
    { label: "Vencedor",    tipos: ["Vencedor da Partida","Vencedor do 1º Set","Vencedor do 2º Set","Vencedor do 3º Set"] },
    { label: "Sets",        tipos: ["Handicap Sets","Over/Under Sets","Set Correto"] },
    { label: "Pontos",      tipos: ["Over/Under Pontos no Set","Over/Under Pontos no 1º Set","Over/Under Total de Pontos"] },
    { label: "Jogador",     tipos: ["Aces do Jogador (Over/Under)","Erros de Saque (Over/Under)","Pontos de Ataque (Over/Under)","Bloqueios do Jogador (Over/Under)"] },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function tipoUsaDirecao(tipo) {
  const t = tipo.toLowerCase();
  return t.includes("over/under") || t.includes("(over/under)") ||
    ["escanteios (jogo)","escanteios (time)","escanteios (jogador)",
     "cartões (jogo)","cartões (time)","chutes a gol (jogo)","chutes a gol (time)",
     "finalizações (jogo)","faltas (jogo)","faltas (jogador)",
     "gols 1º tempo","duplo-duplo (jogador)","triplo-duplo (jogador)",
     "luta vai à decisão"].includes(tipo.toLowerCase());
}

function tipoEHandicap(tipo) {
  const t = tipo.toLowerCase();
  return t.includes("handicap") || t === "spread";
}

function tipoEPlacar(tipo) {
  return ["Resultado Exato","Set Correto"].includes(tipo);
}

function inferirUnidade(tipo) {
  const t = tipo.toLowerCase();
  if (t.includes("gol")) return "gols";
  if (t.includes("escanteio")) return "cant.";
  if (t.includes("cartão") || t.includes("cartões")) return "cart.";
  if (t.includes("ponto") || t.includes("point") || t.startsWith("pts")) return "pts";
  if (t.includes("rebote")) return "reb.";
  if (t.includes("assist")) return "ast.";
  if (t.includes("jarda")) return "yds";
  if (t.includes("ace")) return "aces";
  if (t.includes("fault") || t.includes("falta")) return "flts";
  if (t.includes("chute")) return "chutes";
  if (t.includes("finalização") || t.includes("finaliz")) return "fin.";
  if (t.includes("set")) return "sets";
  if (t.includes("game")) return "games";
  if (t.includes("round")) return "rnd";
  if (t.includes("minuto")) return "min";
  if (t.includes("bloqueio")) return "blk";
  if (t.includes("roubo")) return "stl";
  if (t.includes("lance livre")) return "FT";
  if (t.includes("sack")) return "sacks";
  if (t.includes("tackle")) return "tck";
  if (t.includes("derrubada") || t.includes("takedown")) return "TD";
  if (t.includes("strike")) return "str.";
  if (t.includes("knock")) return "KD";
  if (t.includes("posição")) return "pos.";
  if (t.includes("quebra")) return "brk";
  if (t.includes("winner")) return "win";
  if (t.includes("passe") || t.includes("pass")) return "pss";
  return "";
}

function gerarLinhaPreviewTexto(dir, val, tipo) {
  if (!dir || !val) return "";
  const v = parseFloat(val);
  if (isNaN(v)) return "";
  const un = inferirUnidade(tipo);
  const label = un ? `${v} ${un}` : String(v);
  if (dir === "over")  return `Mais de <strong>${label}</strong>`;
  if (dir === "under") return `Menos de <strong>${label}</strong>`;
  if (dir === "mais")  return `<strong>${v}+</strong>${un ? " " + un : ""}`;
  if (dir === "exato") return `Exatamente <strong>${label}</strong>`;
  return "";
}

// ─── INJETAR ESTILOS ──────────────────────────────────────────────────────────
function injetarEstilosForm() {
  if (document.getElementById("form-extra-styles")) return;
  const s = document.createElement("style");
  s.id = "form-extra-styles";
  s.textContent = `
    .mercado-grupos { display:flex; flex-direction:column; gap:14px; }
    .mg-label { font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); font-weight:600; margin-bottom:6px; font-family:var(--font-mono); }
    .mg-chips { display:flex; flex-wrap:wrap; gap:6px; }
    .chip-tipo { padding:5px 12px; border:1.5px solid var(--border2); border-radius:20px; font-size:.73rem; font-family:var(--font-mono); color:var(--text2); background:var(--bg2); cursor:pointer; transition:all .13s ease; white-space:nowrap; }
    .chip-tipo:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-bg); }
    .chip-tipo.active { border-color:var(--green2); color:var(--green2); background:var(--green-bg); font-weight:600; }

    .vencedor-row { margin:10px 0 4px; }
    .vencedor-label { font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; color:var(--text2); font-weight:600; margin-bottom:6px; display:block; font-family:var(--font-mono); }
    .vencedor-btns { display:flex; gap:8px; flex-wrap:wrap; }
    .vencedor-btn { flex:1; min-width:80px; max-width:220px; padding:9px 10px; text-align:center; border:1.5px solid var(--border2); border-radius:8px; font-size:.78rem; font-family:var(--font-mono); color:var(--text2); background:var(--bg2); cursor:pointer; transition:all .13s ease; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .vencedor-btn:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-bg); }
    .vencedor-btn.active { border-color:var(--amber); color:var(--amber); background:rgba(217,119,6,.1); font-weight:700; }
    .vencedor-btn.active-empate { border-color:var(--muted); color:var(--text2); background:var(--bg3); font-weight:700; }

    .linha-field { margin-top:2px; }
    .linha-field label { font-size:.68rem; color:var(--text2); margin-bottom:6px; text-transform:uppercase; letter-spacing:.05em; font-weight:500; }
    .linha-wrap { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .dir-btns { display:flex; border:1.5px solid var(--border2); border-radius:8px; overflow:hidden; flex-shrink:0; }
    .dir-btn { padding:7px 14px; font-size:.75rem; font-family:var(--font-mono); color:var(--text2); background:var(--bg2); border:none; border-right:1px solid var(--border2); transition:all .12s; cursor:pointer; }
    .dir-btn:last-child { border-right:none; }
    .dir-btn:hover { background:var(--bg3); color:var(--text); }
    .dir-btn.active-over  { background:var(--green);  color:#fff; font-weight:600; }
    .dir-btn.active-under { background:var(--red);    color:#fff; font-weight:600; }
    .dir-btn.active-mais  { background:var(--amber);  color:#fff; font-weight:600; }
    .dir-btn.active-exato { background:var(--blue);   color:#fff; font-weight:600; }
    .linha-valor-wrap { position:relative; display:flex; align-items:center; }
    .linha-valor-wrap input { width:110px; text-align:center; font-size:.95rem; font-weight:600; padding:7px 10px; border-radius:8px; }
    .linha-unidade { position:absolute; right:10px; font-size:.65rem; color:var(--muted); pointer-events:none; text-transform:uppercase; letter-spacing:.04em; }
    .linha-preview { font-size:.78rem; color:var(--muted); margin-top:6px; }

    .tag-chips { display:flex; flex-wrap:wrap; gap:7px; }
    .tag-chip { padding:6px 12px; border:1.5px solid var(--border2); border-radius:20px; font-size:.73rem; font-family:var(--font-mono); color:var(--text2); background:var(--bg2); cursor:pointer; transition:all .13s ease; }
    .tag-chip:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-bg); }
    .tag-chip.active { border-color:var(--void); color:var(--void); background:var(--void-bg); font-weight:600; }

    .selecao-item { border:1.5px solid var(--border); border-radius:var(--radius-lg); padding:14px 16px; margin-bottom:10px; background:var(--bg3); }
    .sel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
    .selecao-numero { font-size:.65rem; letter-spacing:.1em; font-weight:700; color:var(--muted); text-transform:uppercase; }
    .odd-total-preview { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg3); border:1px solid var(--border); border-radius:8px; margin-top:12px; }
    .odd-total-preview .label { font-size:.72rem; color:var(--text2); }
    .odd-total-preview .val { font-size:1.1rem; font-weight:700; color:var(--bright); font-family:var(--font-mono); }
  `;
  document.head.appendChild(s);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function initForm(apostaParaEditar = null) {
  injetarEstilosForm();
  editandoId = apostaParaEditar?.id || null;
  formStep = 1;
  selecoes = apostaParaEditar?.selecoes ? [...apostaParaEditar.selecoes] : [];
  formData = apostaParaEditar ? { ...apostaParaEditar } : {};

  const sec = document.getElementById("sec-nova-aposta");
  sec.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">${editandoId ? "Editar Aposta" : "Nova Aposta"}</div>
        <div class="section-sub">Registre os detalhes da aposta</div>
      </div>
    </div>
    <div class="card" style="max-width:760px;margin:0 auto">
      <div class="form-group">
        <label>Tipo de registro</label>
        <div class="tipo-toggle">
          <button id="btn-simples"   onclick="setTipoRegistro('simples')">Simples</button>
          <button id="btn-acumulada" onclick="setTipoRegistro('acumulada')">Acumulada / Múltipla</button>
        </div>
      </div>
      <div class="step-bar">
        <div class="step-item" id="stab-1" onclick="irStep(1)">1. Contexto</div>
        <div class="step-item" id="stab-2" onclick="irStep(2)">2. Mercado</div>
        <div class="step-item" id="stab-3" onclick="irStep(3)">3. Resultado</div>
      </div>
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
      <div class="step-content" id="step-2">
        <div id="campos-mercado"></div>
        <div style="display:flex;justify-content:space-between;margin-top:16px">
          <button class="btn btn-secondary" onclick="irStep(1)">← Voltar</button>
          <button class="btn btn-primary"   onclick="irStep(3)">Próximo →</button>
        </div>
      </div>
      <div class="step-content" id="step-3">
        <div class="form-row cols-2">
          <div class="form-group">
            <label>Resultado</label>
            <select id="f-resultado" onchange="onResultadoChange()">
              <option value="pendente" ${(!formData.resultado||formData.resultado==="pendente")?"selected":""}>Pendente</option>
              <option value="win"      ${formData.resultado==="win"?"selected":""}>WIN</option>
              <option value="loss"     ${formData.resultado==="loss"?"selected":""}>LOSS</option>
              <option value="void"     ${formData.resultado==="void"?"selected":""}>VOID (cancelada)</option>
              <option value="cashout"  ${formData.resultado==="cashout"?"selected":""}>Cashout</option>
            </select>
          </div>
          <div class="form-group" id="cashout-val-group" style="display:none">
            <label>Valor recebido (R$)</label>
            <input type="number" id="f-cashout-val" step="0.01" value="${formData.lucro_cashout||""}" oninput="atualizarPreviewLucro()">
          </div>
        </div>
        <div class="form-group">
          <label>Tag</label>
          <div class="tag-chips" id="tag-chips">
            <button class="tag-chip ${!formData.tag?"active":""}" onclick="setTag('')">Sem tag</button>
            ${TAGS.map(t=>`<button class="tag-chip ${formData.tag===t.value?"active":""}" onclick="setTag('${t.value}')" title="${t.desc}">${t.label}</button>`).join("")}
          </div>
          <input type="hidden" id="f-tag" value="${formData.tag||""}">
        </div>
        <div id="preview-lucro" style="margin-bottom:12px"></div>
        <div style="display:flex;justify-content:space-between">
          <button class="btn btn-secondary" onclick="irStep(2)">← Voltar</button>
          <button class="btn btn-primary" onclick="salvarApostaForm()" style="min-width:150px">
            ${editandoId ? "Salvar alterações" : "✓ Registrar aposta"}
          </button>
        </div>
      </div>
    </div>
  `;

  setTipoRegistro(formData.tipo_registro || "simples", true);
  irStep(1);
  if (formData.resultado === "cashout") document.getElementById("cashout-val-group").style.display = "";
}

function setTag(val) {
  formData.tag = val;
  document.getElementById("f-tag").value = val;
  document.querySelectorAll(".tag-chip").forEach(btn => {
    const isNone = btn.textContent.trim() === "Sem tag";
    btn.classList.toggle("active", isNone ? val === "" : btn.getAttribute("onclick").includes(`'${val}'`));
  });
}

// ─── TIPO REGISTRO ────────────────────────────────────────────────────────────
function setTipoRegistro(tipo, silent = false) {
  formData.tipo_registro = tipo;
  document.getElementById("btn-simples")?.classList.toggle("active", tipo === "simples");
  document.getElementById("btn-acumulada")?.classList.toggle("active", tipo === "acumulada");
  renderStep1Extra();
  if (!silent) renderCamposMercado();
}

function renderStep1Extra() {
  const el = document.getElementById("step1-extra");
  if (!el) return;
  if (formData.tipo_registro === "acumulada") { el.innerHTML = ""; return; }
  const esp = formData.esporte || "";
  const cfg = esp ? ESPORTES[esp] : null;
  const ligaFixa = cfg?.liga_fixa;
  const ligaLivre = cfg?.liga_livre;
  let ligaHtml = "";
  if (!esp) {
    ligaHtml = `<select id="f-liga" disabled><option>Selecione esporte primeiro</option></select>`;
  } else if (ligaLivre) {
    ligaHtml = `<input type="text" id="f-liga" placeholder="Ex: Wimbledon, Roland Garros..." value="${formData.liga||""}">`;
  } else if (ligaFixa) {
    ligaHtml = `<input type="text" id="f-liga" value="${ligaFixa}" readonly style="background:var(--bg3);color:var(--muted)">`;
  } else {
    const ligas = cfg?.ligas || [];
    ligaHtml = `<select id="f-liga"><option value="">Selecione...</option>${ligas.map(l=>`<option value="${l}" ${formData.liga===l?"selected":""}>${l}</option>`).join("")}</select>`;
  }
  el.innerHTML = `
    <div class="form-row cols-2">
      <div class="form-group">
        <label>Esporte</label>
        <select id="f-esporte" onchange="onEsporteChange()">
          <option value="">Selecione...</option>
          ${Object.entries(ESPORTES).map(([k,v])=>`<option value="${k}" ${esp===k?"selected":""}>${v.emoji} ${v.nome}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>${ligaLivre ? "Competição (escreva)" : "Liga / Competição"}</label>
        ${ligaHtml}
      </div>
    </div>
  `;
  if (ligaFixa && esp) formData.liga = ligaFixa;
}

function onEsporteChange() {
  const el = document.getElementById("f-esporte");
  formData.esporte = el?.value || "";
  formData.liga = "";
  formData.tipo_aposta = "";
  formData.vencedor = "";
  renderStep1Extra();
  if (formStep === 2) renderCamposMercado();
}

function irStep(n) {
  if (formStep === 1 && formData.tipo_registro === "simples") {
    const ligaEl = document.getElementById("f-liga");
    if (ligaEl) formData.liga = ligaEl.value;
    const espEl = document.getElementById("f-esporte");
    if (espEl) formData.esporte = espEl.value;
  }
  formStep = n;
  document.querySelectorAll(".step-content").forEach((s,i) => s.classList.toggle("active", i+1===n));
  document.querySelectorAll(".step-item").forEach((s,i) => {
    s.classList.toggle("active", i+1===n);
    s.classList.toggle("done", i+1<n);
  });
  if (n === 2) renderCamposMercado();
  if (n === 3) atualizarPreviewLucro();
}

// ─── MERCADO ──────────────────────────────────────────────────────────────────
function renderCamposMercado() {
  const el = document.getElementById("campos-mercado");
  if (!el) return;
  if (formData.tipo_registro === "acumulada") {
    el.innerHTML = `
      <div class="form-group">
        <div class="flex items-center justify-between mb-16">
          <label style="margin-bottom:0">Seleções da acumulada</label>
          <button class="btn btn-secondary btn-sm" onclick="adicionarSelecao()">+ Adicionar seleção</button>
        </div>
        <div id="lista-selecoes"></div>
        <div class="odd-total-preview">
          <span class="label">Odd total</span>
          <span class="val" id="odd-total-display">—</span>
        </div>
      </div>
      <div class="form-group" style="max-width:220px">
        <label>Stake (R$)</label>
        <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||""}" oninput="atualizarOddTotal()">
      </div>
    `;
    renderSelecoes(); return;
  }
  const esporte = formData.esporte;
  const cfg = esporte ? ESPORTES[esporte] : null;
  if (!esporte || !cfg) {
    el.innerHTML = `<div class="text-muted" style="padding:20px;text-align:center">Volte e selecione um esporte</div>`;
    return;
  }
  const grupos = GRUPOS_MERCADO[esporte] || [];
  const tipoSel = formData.tipo_aposta || "";
  const chipsHtml = grupos.map(g => {
    const chips = g.tipos.map(t =>
      `<button class="chip-tipo${t===tipoSel?" active":""}" onclick="selectTipoAposta('${t.replace(/'/g,"\\'")}')">${t}</button>`
    ).join("");
    return `<div class="mercado-grupo"><div class="mg-label">${g.label}</div><div class="mg-chips">${chips}</div></div>`;
  }).join("");
  el.innerHTML = `
    <div class="form-group">
      <label>Mercado</label>
      <div class="mercado-grupos">${chipsHtml}</div>
    </div>
    <div id="campos-contexto-tipo"></div>
    <div class="form-row cols-2" id="odd-stake-row" style="${tipoSel?"":"display:none"}">
      <div class="form-group">
        <label>Odd</label>
        <input type="number" id="f-odd" step="0.01" min="1.01" value="${formData.odd||""}" oninput="atualizarPreviewLucro()">
      </div>
      <div class="form-group">
        <label>Stake (R$)</label>
        <input type="number" id="f-stake" step="0.01" min="0" value="${formData.stake||""}" oninput="atualizarPreviewLucro()">
      </div>
    </div>
  `;
  if (tipoSel) renderCamposContextoTipoAtual();
}

function selectTipoAposta(tipo) {
  formData.tipo_aposta = tipo;
  formData.vencedor = "";
  document.querySelectorAll(".chip-tipo").forEach(btn => btn.classList.toggle("active", btn.textContent.trim() === tipo));
  const row = document.getElementById("odd-stake-row");
  if (row) row.style.display = "";
  renderCamposContextoTipoAtual();
}

function renderCamposContextoTipoAtual() {
  const el = document.getElementById("campos-contexto-tipo");
  if (!el) return;
  const html = renderCamposContextoTipo(formData.esporte, formData.tipo_aposta, formData);
  el.innerHTML = html ? `<div style="margin:14px 0 4px">${html}</div>` : "";
}

// ─── CAMPOS CONTEXTO ──────────────────────────────────────────────────────────
function renderCamposContextoTipo(esporte, tipo, dados = {}) {
  if (!esporte || !tipo) return "";
  const cfg = ESPORTES[esporte];
  if (!cfg) return "";
  const contexto = cfg.contexto?.[tipo] || "nenhum";
  const temLinha = cfg.linhas?.includes(tipo);
  const vencOpcoes = cfg.vencedor?.[tipo];
  let html = "";

  if (esporte === "f1") {
    const pilotos = cfg.pilotos || F1_PILOTOS_2026 || [];
    if (contexto === "piloto" || contexto === "piloto_duelo") {
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>Piloto</label><select id="f-piloto"><option value="">Selecione...</option>${pilotos.map(p=>`<option value="${p}" ${dados.piloto===p?"selected":""}>${p}</option>`).join("")}</select></div>`;
      if (contexto === "piloto_duelo") {
        html += `<div class="form-group"><label>Adversário</label><select id="f-piloto2"><option value="">Selecione...</option>${pilotos.map(p=>`<option value="${p}" ${dados.piloto2===p?"selected":""}>${p}</option>`).join("")}</select></div>`;
      }
      html += `</div>`;
    } else if (contexto === "equipe") {
      html += `<div class="form-group"><label>Equipe</label><select id="f-equipe"><option value="">Selecione...</option>${(cfg.equipes||F1_EQUIPES_2026||[]).map(e=>`<option value="${e}" ${dados.equipe===e?"selected":""}>${e}</option>`).join("")}</select></div>`;
    }
    if (temLinha) html += renderLinhaField(esporte, tipo, dados);
    return html;
  }

  if (esporte === "mma") {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Lutador A</label><input type="text" id="f-time-a" value="${dados.time_a||""}" placeholder="Ex: Jon Jones" oninput="atualizarVencedorLabels()"></div>
      <div class="form-group"><label>Lutador B</label><input type="text" id="f-time-b" value="${dados.time_b||""}" placeholder="Ex: Stipe Miocic" oninput="atualizarVencedorLabels()"></div>
    </div>`;
    if (vencOpcoes) html += renderVencedorBtns(vencOpcoes, dados.vencedor, dados.time_a, dados.time_b);
    if (temLinha) html += renderLinhaField(esporte, tipo, dados);
    return html;
  }

  if (esporte === "tenis") {
    if (contexto === "jogo" || contexto === "jogador") {
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>Jogador A</label><input type="text" id="f-time-a" value="${dados.time_a||""}" placeholder="Ex: Djokovic" oninput="atualizarVencedorLabels()"></div>
        <div class="form-group"><label>Jogador B</label><input type="text" id="f-time-b" value="${dados.time_b||""}" placeholder="Ex: Alcaraz" oninput="atualizarVencedorLabels()"></div>
      </div>`;
      if (contexto === "jogador") html += `<div class="form-group"><label>Jogador (prop)</label><input type="text" id="f-jogador" value="${dados.jogador||""}" placeholder="Ex: Sinner"></div>`;
    }
    if (vencOpcoes) html += renderVencedorBtns(vencOpcoes, dados.vencedor, dados.time_a, dados.time_b);
    if (temLinha) html += renderLinhaField(esporte, tipo, dados);
    return html;
  }

  if (esporte === "volei") {
    if (contexto === "jogo") {
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>Time / Seleção A (casa)</label><input type="text" id="f-time-a" value="${dados.time_a||""}" placeholder="Ex: Cruzeiro" oninput="atualizarVencedorLabels()"></div>
        <div class="form-group"><label>Time / Seleção B (fora)</label><input type="text" id="f-time-b" value="${dados.time_b||""}" placeholder="Ex: Sesi-SP" oninput="atualizarVencedorLabels()"></div>
      </div>`;
    } else if (contexto === "jogador") {
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>Time do jogador</label><input type="text" id="f-time-a" value="${dados.time_a||""}" placeholder="Nome do time"></div>
        <div class="form-group"><label>Jogador</label><input type="text" id="f-jogador" value="${dados.jogador||""}" placeholder="Ex: Wallace"></div>
      </div>`;
    }
    if (vencOpcoes) html += renderVencedorBtns(vencOpcoes, dados.vencedor, dados.time_a, dados.time_b);
    if (temLinha) html += renderLinhaField(esporte, tipo, dados);
    return html;
  }

  // Futebol / Basquete / Americano
  const liga = dados.liga || cfg.liga_fixa || "";
  const times = cfg.times?.[liga] || [];
  const mkSelect = (id, val, placeholder, onch) => times.length
    ? `<select id="${id}" ${onch?`onchange="${onch}"`:""}>
        <option value="">Selecione...</option>
        ${times.map(t=>`<option value="${t}" ${val===t?"selected":""}>${t}</option>`).join("")}
       </select>`
    : `<input type="text" id="${id}" value="${val||""}" placeholder="${placeholder}" ${onch?`oninput="${onch}"`:""}>`; 

  if (contexto === "jogo") {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time / Seleção A (casa)</label>${mkSelect("f-time-a",dados.time_a||"","Nome do time","atualizarVencedorLabels()")}</div>
      <div class="form-group"><label>Time / Seleção B (fora)</label>${mkSelect("f-time-b",dados.time_b||"","Nome do time",times.length?null:"atualizarVencedorLabels()")}</div>
    </div>`;
    if (times.length) setTimeout(()=>{
      const a=document.getElementById("f-time-a"); if(a&&dados.time_a) a.value=dados.time_a;
      const b=document.getElementById("f-time-b"); if(b&&dados.time_b) b.value=dados.time_b;
    },0);
  } else if (contexto === "time") {
    html += `<div class="form-group"><label>Time</label>${mkSelect("f-time-a",dados.time_a||"","Nome do time",null)}</div>`;
  } else if (contexto === "jogador") {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time do jogador</label>${mkSelect("f-time-a",dados.time_a||"","Time do jogador",null)}</div>
      <div class="form-group"><label>Nome do jogador</label><input type="text" id="f-jogador" value="${dados.jogador||""}" placeholder="Ex: Vini Jr."></div>
    </div>`;
  }

  if (vencOpcoes && (contexto === "jogo" || contexto === "time")) {
    html += renderVencedorBtns(vencOpcoes, dados.vencedor, dados.time_a, dados.time_b);
  }
  if (temLinha) html += renderLinhaField(esporte, tipo, dados);
  return html;
}

// ─── VENCEDOR ─────────────────────────────────────────────────────────────────
function renderVencedorBtns(opcoes, selecionado, timeA, timeB) {
  const btns = opcoes.map(op => {
    let label = op;
    if ((op==="Casa"||op==="Lutador A"||op==="Jogador A") && timeA) label = timeA;
    if ((op==="Fora"||op==="Lutador B"||op==="Jogador B") && timeB) label = timeB;
    const isEmpate = ["Empate","1X","X2","12"].includes(op);
    const activeCls = selecionado === op ? (isEmpate ? " active-empate" : " active") : "";
    return `<button class="vencedor-btn${activeCls}" data-venc="${op}" onclick="selectVencedor('${op.replace(/'/g,"\\'")}'">${label}</button>`;
  });
  return `<div class="vencedor-row">
    <span class="vencedor-label">Quem você apostou?</span>
    <div class="vencedor-btns" id="vencedor-btns">${btns.join("")}</div>
  </div>`;
}

function selectVencedor(opcao) {
  formData.vencedor = opcao;
  document.querySelectorAll(".vencedor-btn").forEach(btn => {
    const v = btn.dataset.venc;
    const isEmpate = ["Empate","1X","X2","12"].includes(v);
    btn.className = "vencedor-btn" + (v===opcao ? (isEmpate?" active-empate":" active") : "");
  });
}

function atualizarVencedorLabels() {
  const timeA = document.getElementById("f-time-a")?.value || "";
  const timeB = document.getElementById("f-time-b")?.value || "";
  document.querySelectorAll(".vencedor-btn").forEach(btn => {
    const v = btn.dataset.venc;
    if (["Casa","Lutador A","Jogador A"].includes(v)) btn.textContent = timeA || v;
    if (["Fora","Lutador B","Jogador B"].includes(v)) btn.textContent = timeB || v;
  });
}

// ─── CAMPO LINHA ──────────────────────────────────────────────────────────────
function renderLinhaField(esporte, tipo, dados = {}) {
  const dir = dados.linha_direcao || "";
  const val = dados.linha || "";
  if (tipoEPlacar(tipo)) {
    return `<div class="form-group linha-field" style="max-width:180px">
      <label>Placar (ex: 2-1)</label>
      <input type="text" id="f-linha" value="${val}" placeholder="2-1">
    </div>`;
  }
  if (tipoEHandicap(tipo)) {
    return `<div class="form-group linha-field" style="max-width:160px">
      <label>Spread / Handicap</label>
      <div class="linha-valor-wrap">
        <input type="number" id="f-linha" step="0.25" value="${val}" placeholder="-1.5" style="width:100%">
        <span class="linha-unidade">linha</span>
      </div>
    </div>`;
  }
  if (tipoUsaDirecao(tipo)) {
    const dirs = [
      {key:"over", label:"Over", cls:dir==="over"?"active-over":""},
      {key:"under",label:"Under",cls:dir==="under"?"active-under":""},
      {key:"mais", label:"X+",  cls:dir==="mais"?"active-mais":""},
      {key:"exato",label:"Exato",cls:dir==="exato"?"active-exato":""},
    ];
    const un = inferirUnidade(tipo);
    return `<div class="form-group linha-field">
      <label>Linha</label>
      <div class="linha-wrap">
        <div class="dir-btns">
          ${dirs.map(d=>`<button class="dir-btn ${d.cls}" onclick="setDirecao('${d.key}')">${d.label}</button>`).join("")}
        </div>
        <div class="linha-valor-wrap">
          <input type="number" id="f-linha" step="0.5" min="0" value="${val}" placeholder="0.0" oninput="atualizarLinhaPreview()">
          ${un?`<span class="linha-unidade">${un}</span>`:""}
        </div>
      </div>
      <div id="linha-preview" class="linha-preview">${gerarLinhaPreviewTexto(dir,val,tipo)}</div>
    </div>`;
  }
  return "";
}

function setDirecao(dir) {
  formData.linha_direcao = dir;
  document.querySelectorAll(".dir-btn").forEach(btn => {
    const l = btn.textContent.trim().toLowerCase();
    btn.className = "dir-btn";
    if ((dir==="over"&&l==="over")||(dir==="under"&&l==="under")||(dir==="mais"&&l==="x+")||(dir==="exato"&&l==="exato"))
      btn.classList.add(`active-${dir}`);
  });
  atualizarLinhaPreview();
}

function atualizarLinhaPreview() {
  const el = document.getElementById("linha-preview");
  const linhaEl = document.getElementById("f-linha");
  if (!el||!linhaEl) return;
  el.innerHTML = gerarLinhaPreviewTexto(formData.linha_direcao||"", linhaEl.value, formData.tipo_aposta||"");
}

// ─── SELEÇÕES ACUMULADA ────────────────────────────────────────────────────────
function adicionarSelecao() {
  selecoes.push({ esporte:"",liga:"",tipo_aposta:"",odd:"",resultado:"pendente",vencedor:"",ordem:selecoes.length+1 });
  renderSelecoes();
}

function removerSelecao(idx) {
  selecoes.splice(idx,1);
  selecoes.forEach((s,i)=>s.ordem=i+1);
  renderSelecoes();
}

function renderSelecoes() {
  const el = document.getElementById("lista-selecoes");
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
    let ligaHtml = "";
    if (!cfg) ligaHtml = `<input type="text" disabled placeholder="Selecione esporte">`;
    else if (ligaLivre) ligaHtml = `<input type="text" value="${s.liga||""}" onchange="selecoes[${i}].liga=this.value" placeholder="Ex: Wimbledon">`;
    else if (ligaFixa) ligaHtml = `<input type="text" value="${ligaFixa}" readonly style="background:var(--bg4);color:var(--muted)">`;
    else ligaHtml = `<select onchange="onSelLiga(${i},this.value)"><option value="">Selecione...</option>${ligas.map(l=>`<option value="${l}" ${s.liga===l?"selected":""}>${l}</option>`).join("")}</select>`;
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
            ${Object.entries(ESPORTES).map(([k,v])=>`<option value="${k}" ${s.esporte===k?"selected":""}>${v.emoji} ${v.nome}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>${ligaLivre?"Competição":"Liga"}</label>
          ${ligaHtml}
        </div>
        <div class="form-group">
          <label>Tipo de aposta</label>
          <select onchange="onSelTipo(${i},this.value)">
            <option value="">Selecione...</option>
            ${tipos.map(t=>`<option value="${t}" ${s.tipo_aposta===t?"selected":""}>${t}</option>`).join("")}
          </select>
        </div>
      </div>
      <div id="sel-ctx-${i}">${s.tipo_aposta ? renderCamposContextoTipoSel(i, s) : ""}</div>
      <div class="form-row cols-2" style="margin-top:8px">
        <div class="form-group">
          <label>Odd</label>
          <input type="number" step="0.01" min="1.01" value="${s.odd||""}" oninput="onSelOdd(${i},this.value)" placeholder="Ex: 1.85">
        </div>
        <div class="form-group">
          <label>Resultado desta seleção</label>
          <select onchange="selecoes[${i}].resultado=this.value">
            <option value="pendente" ${s.resultado==="pendente"?"selected":""}>Pendente</option>
            <option value="win"  ${s.resultado==="win"?"selected":""}>WIN</option>
            <option value="loss" ${s.resultado==="loss"?"selected":""}>LOSS</option>
            <option value="void" ${s.resultado==="void"?"selected":""}>VOID</option>
          </select>
        </div>
      </div>
    </div>`;
  }).join("");
  atualizarOddTotal();
}

function renderCamposContextoTipoSel(i, s) {
  const esporte = s.esporte, tipo = s.tipo_aposta;
  if (!esporte||!tipo) return "";
  const cfg = ESPORTES[esporte];
  const contexto = cfg?.contexto?.[tipo]||"nenhum";
  const temLinha = cfg?.linhas?.includes(tipo);
  const vencOpcoes = cfg?.vencedor?.[tipo];
  let html = "";

  if (esporte === "f1") {
    const pilotos = cfg.pilotos || F1_PILOTOS_2026 || [];
    if (contexto==="piloto"||contexto==="piloto_duelo") {
      html += `<div class="form-group"><label>Piloto</label><select onchange="selecoes[${i}].piloto=this.value"><option value="">Selecione...</option>${pilotos.map(p=>`<option value="${p}" ${s.piloto===p?"selected":""}>${p}</option>`).join("")}</select></div>`;
      if (contexto==="piloto_duelo") html += `<div class="form-group"><label>Adversário</label><select onchange="selecoes[${i}].piloto2=this.value"><option value="">Selecione...</option>${pilotos.map(p=>`<option value="${p}" ${s.piloto2===p?"selected":""}>${p}</option>`).join("")}</select></div>`;
    } else if (contexto==="equipe") {
      html += `<div class="form-group"><label>Equipe</label><select onchange="selecoes[${i}].equipe=this.value"><option value="">Selecione...</option>${(cfg.equipes||F1_EQUIPES_2026||[]).map(e=>`<option value="${e}" ${s.equipe===e?"selected":""}>${e}</option>`).join("")}</select></div>`;
    }
    if (temLinha) html += renderLinhaFieldSel(i,s,esporte,tipo);
    return html;
  }

  if (["mma","tenis","volei"].includes(esporte)) {
    if (contexto !== "nenhum") {
      const lblA = esporte==="mma"?"Lutador A":"Jogador A / Casa";
      const lblB = esporte==="mma"?"Lutador B":"Jogador B / Fora";
      html += `<div class="form-row cols-2">
        <div class="form-group"><label>${lblA}</label><input type="text" value="${s.time_a||""}" onchange="selecoes[${i}].time_a=this.value"></div>
        <div class="form-group"><label>${lblB}</label><input type="text" value="${s.time_b||""}" onchange="selecoes[${i}].time_b=this.value"></div>
      </div>`;
    }
    if (temLinha) html += renderLinhaFieldSel(i,s,esporte,tipo);
    return html;
  }

  const liga = s.liga||cfg?.liga_fixa||"";
  const times = cfg?.times?.[liga]||[];
  const mkSel = (val,ev) => times.length
    ? `<select onchange="${ev}"><option value="">Selecione...</option>${times.map(t=>`<option value="${t}" ${val===t?"selected":""}>${t}</option>`).join("")}</select>`
    : `<input type="text" value="${val||""}" onchange="${ev}" placeholder="Nome do time">`;

  if (contexto==="jogo") {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time A (casa)</label>${mkSel(s.time_a,`selecoes[${i}].time_a=this.value`)}</div>
      <div class="form-group"><label>Time B (fora)</label>${mkSel(s.time_b,`selecoes[${i}].time_b=this.value`)}</div>
    </div>`;
  } else if (contexto==="time") {
    html += `<div class="form-group"><label>Time</label>${mkSel(s.time_a,`selecoes[${i}].time_a=this.value`)}</div>`;
  } else if (contexto==="jogador") {
    html += `<div class="form-row cols-2">
      <div class="form-group"><label>Time do jogador</label>${mkSel(s.time_a,`selecoes[${i}].time_a=this.value`)}</div>
      <div class="form-group"><label>Jogador</label><input type="text" value="${s.jogador||""}" onchange="selecoes[${i}].jogador=this.value" placeholder="Ex: Haaland"></div>
    </div>`;
  }

  if (vencOpcoes) {
    const vencBtns = vencOpcoes.map(op => {
      const isEmp = ["Empate","1X","X2","12"].includes(op);
      const active = s.vencedor===op;
      return `<button class="vencedor-btn${active?(isEmp?" active-empate":" active"):""}" onclick="selecoes[${i}].vencedor='${op.replace(/'/g,"\\'")}';renderSelecoes()">${op}</button>`;
    }).join("");
    html += `<div class="vencedor-row"><span class="vencedor-label">Quem você apostou?</span><div class="vencedor-btns">${vencBtns}</div></div>`;
  }

  if (temLinha) html += renderLinhaFieldSel(i,s,esporte,tipo);
  return html;
}

function renderLinhaFieldSel(i,s,esporte,tipo) {
  const dir=s.linha_direcao||"", val=s.linha||"";
  if (tipoEPlacar(tipo)) return `<div class="form-group" style="max-width:160px"><label>Placar</label><input type="text" value="${val}" placeholder="2-1" onchange="selecoes[${i}].linha=this.value"></div>`;
  if (tipoEHandicap(tipo)) return `<div class="form-group" style="max-width:140px"><label>Handicap</label><input type="number" step="0.25" value="${val}" placeholder="-1.5" onchange="selecoes[${i}].linha=this.value"></div>`;
  if (tipoUsaDirecao(tipo)) {
    const dirs=[{key:"over",label:"Over",cls:dir==="over"?"active-over":""},{key:"under",label:"Under",cls:dir==="under"?"active-under":""},{key:"mais",label:"X+",cls:dir==="mais"?"active-mais":""}];
    return `<div class="form-group linha-field"><label>Linha</label>
      <div class="linha-wrap">
        <div class="dir-btns">${dirs.map(d=>`<button class="dir-btn ${d.cls}" onclick="selecoes[${i}].linha_direcao='${d.key}';renderSelecoes()">${d.label}</button>`).join("")}</div>
        <input type="number" step="0.5" min="0" value="${val}" placeholder="0.0" onchange="selecoes[${i}].linha=this.value" style="width:100px;text-align:center;font-size:.9rem;font-weight:600;border-radius:8px;padding:7px 10px">
      </div>
    </div>`;
  }
  return "";
}

function onSelEsporte(idx,val) { selecoes[idx].esporte=val; selecoes[idx].liga=ESPORTES[val]?.liga_fixa||""; selecoes[idx].tipo_aposta=""; selecoes[idx].vencedor=""; renderSelecoes(); }
function onSelLiga(idx,val)  { selecoes[idx].liga=val; renderSelecoes(); }
function onSelTipo(idx,val)  { selecoes[idx].tipo_aposta=val; selecoes[idx].vencedor=""; renderSelecoes(); }
function onSelOdd(idx,val)   { selecoes[idx].odd=parseFloat(val)||0; atualizarOddTotal(); }

function atualizarOddTotal() {
  const prod = selecoes.reduce((p,s)=>p*(parseFloat(s.odd)||1),1);
  const el = document.getElementById("odd-total-display");
  if (el) el.textContent = selecoes.length>0 ? fmtOdd(prod) : "—";
  atualizarPreviewLucro();
}

// ─── STEP 3 & SALVAR ─────────────────────────────────────────────────────────
function onResultadoChange() {
  const v = document.getElementById("f-resultado")?.value;
  const el = document.getElementById("cashout-val-group");
  if (el) el.style.display = v==="cashout" ? "" : "none";
  atualizarPreviewLucro();
}

function atualizarPreviewLucro() {
  const el = document.getElementById("preview-lucro");
  if (!el) return;
  const stake = parseFloat(document.getElementById("f-stake")?.value)||0;
  const resultado = document.getElementById("f-resultado")?.value;
  let odd = formData.tipo_registro==="acumulada"
    ? selecoes.reduce((p,s)=>p*(parseFloat(s.odd)||1),1)
    : parseFloat(document.getElementById("f-odd")?.value)||0;
  if (!stake||!odd||!resultado||resultado==="pendente") { el.innerHTML=""; return; }
  let msg="";
  if (resultado==="win") {
    const lucro=(odd-1)*stake;
    msg=`Lucro: <strong class="text-green">+${fmtMoedaSimples(lucro)}</strong> &nbsp;·&nbsp; Retorno: <strong class="text-green">${fmtMoedaSimples(odd*stake)}</strong>`;
  } else if (resultado==="loss") {
    msg=`Prejuízo: <strong class="text-red">-${fmtMoedaSimples(stake)}</strong>`;
  } else if (resultado==="cashout") {
    const cv=parseFloat(document.getElementById("f-cashout-val")?.value)||0;
    const l=cv-stake;
    msg=`Resultado: <strong class="${l>=0?"text-green":"text-red"}">${fmtMoeda(l)}</strong>`;
  } else if (resultado==="void") {
    msg=`<span class="text-muted">Stake devolvido (VOID)</span>`;
  }
  el.innerHTML=`<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:.78rem">${msg}</div>`;
}

function coletarContextoSimples() {
  const esporte = formData.esporte;
  const tipo = formData.tipo_aposta||"";
  const cfg = ESPORTES[esporte];
  const contexto = cfg?.contexto?.[tipo]||"nenhum";
  const out = { tipo_aposta:tipo, vencedor:formData.vencedor||"", linha_direcao:formData.linha_direcao||"" };
  if (esporte==="f1") {
    out.piloto  = document.getElementById("f-piloto")?.value||"";
    out.piloto2 = document.getElementById("f-piloto2")?.value||"";
    out.equipe  = document.getElementById("f-equipe")?.value||"";
  } else {
    out.time_a  = document.getElementById("f-time-a")?.value||"";
    out.time_b  = document.getElementById("f-time-b")?.value||"";
    out.jogador = document.getElementById("f-jogador")?.value||"";
  }
  out.linha = document.getElementById("f-linha")?.value||"";
  return out;
}

async function salvarApostaForm() {
  try {
    const tipo = formData.tipo_registro||"simples";
    const base = {
      tipo_registro: tipo,
      data:          document.getElementById("f-data")?.value||new Date().toISOString().slice(0,16),
      casa_aposta:   CASA_APOSTA_UNICA,
      resultado:     document.getElementById("f-resultado")?.value||"pendente",
      lucro_cashout: parseFloat(document.getElementById("f-cashout-val")?.value)||0,
      tag:           document.getElementById("f-tag")?.value||"",
    };
    if (tipo==="simples") {
      const esporte = formData.esporte;
      const liga = document.getElementById("f-liga")?.value||formData.liga||"";
      const tipoAposta = formData.tipo_aposta||"";
      const odd   = parseFloat(document.getElementById("f-odd")?.value);
      const stake = parseFloat(document.getElementById("f-stake")?.value);
      if (!esporte)           { toast("Selecione o esporte","error");        irStep(1); return; }
      if (!tipoAposta)        { toast("Selecione o tipo de aposta","error"); irStep(2); return; }
      if (!odd||odd<1.01)     { toast("Odd inválida (mínimo 1.01)","error"); irStep(2); return; }
      if (!stake||stake<=0)   { toast("Stake inválida","error");             irStep(2); return; }
      const ctx = coletarContextoSimples();
      Object.assign(base,{esporte,liga,odd_total:odd,odd,stake,...ctx});
    } else {
      if (selecoes.length<2)  { toast("Adicione pelo menos 2 seleções","error"); return; }
      const stake = parseFloat(document.getElementById("f-stake")?.value);
      if (!stake||stake<=0)   { toast("Stake inválida","error"); return; }
      const odd_total = selecoes.reduce((p,s)=>p*(parseFloat(s.odd)||1),1);
      Object.assign(base,{stake,odd_total,selecoes:selecoes.map(s=>({...s}))});
    }
    if (editandoId) { await atualizarAposta(editandoId,base); toast("Aposta atualizada!"); }
    else { await salvarAposta(base); toast("Aposta registrada!"); }
    navegar("historico");
  } catch(e) {
    console.error(e);
    toast("Erro ao salvar: "+e.message,"error");
  }
}
