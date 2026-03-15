// db.js — IndexedDB via Dexie.js
const db = new Dexie('BetTracker');

db.version(1).stores({
  apostas:   '++id, data, tipo_registro, esporte, liga, tipo_aposta, resultado, casa_aposta, tag, &[data+esporte]',
  selecoes:  '++id, aposta_id, esporte, resultado',
  bankroll:  '++id, data, tipo',
  config:    'chave'
});

// ─── APOSTAS ────────────────────────────────────────────────────────────────

async function salvarAposta(dados) {
  const { selecoes, ...aposta } = dados;
  const id = await db.apostas.add({ ...aposta, criado_em: new Date().toISOString() });
  if (selecoes && selecoes.length > 0) {
    await db.selecoes.bulkAdd(selecoes.map(s => ({ ...s, aposta_id: id })));
  }
  await recalcularBankroll();
  return id;
}

async function atualizarAposta(id, dados) {
  const { selecoes, ...aposta } = dados;
  await db.apostas.update(id, { ...aposta, atualizado_em: new Date().toISOString() });
  if (dados.tipo_registro === 'acumulada') {
    await db.selecoes.where('aposta_id').equals(id).delete();
    if (selecoes && selecoes.length > 0) {
      await db.selecoes.bulkAdd(selecoes.map(s => ({ ...s, aposta_id: id })));
    }
  }
  await recalcularBankroll();
}

async function excluirAposta(id) {
  await db.selecoes.where('aposta_id').equals(id).delete();
  await db.apostas.delete(id);
  await recalcularBankroll();
}

async function buscarApostas(filtros = {}) {
  let col = db.apostas.orderBy('data').reverse();
  const arr = await col.toArray();

  return arr.filter(a => {
    // Normalizar comparação de datas: permitir que filtros venham como 'YYYY-MM-DD'
    // e comparar usando timestamp (incluir todo o dia).
    if (filtros.dataInicio) {
      const ai = new Date(a.data).getTime();
      // Expecting filtros.dataInicio like 'YYYY-MM-DD'
      if (/^\d{4}-\d{2}-\d{2}$/.test(filtros.dataInicio)) {
        const [y,mo,da] = filtros.dataInicio.split('-').map(Number);
        const d0 = new Date(y, mo-1, da, 0,0,0,0).getTime();
        if (ai < d0) return false;
      } else {
        const d0 = new Date(filtros.dataInicio); d0.setHours(0,0,0,0);
        if (ai < d0.getTime()) return false;
      }
    }
    if (filtros.dataFim) {
      const ai = new Date(a.data).getTime();
      if (/^\d{4}-\d{2}-\d{2}$/.test(filtros.dataFim)) {
        const [y,mo,da] = filtros.dataFim.split('-').map(Number);
        const d1 = new Date(y, mo-1, da, 23,59,59,999).getTime();
        if (ai > d1) return false;
      } else {
        const d1 = new Date(filtros.dataFim); d1.setHours(23,59,59,999);
        if (ai > d1.getTime()) return false;
      }
    }
    if (filtros.esporte && a.esporte !== filtros.esporte) return false;
    if (filtros.liga && a.liga !== filtros.liga) return false;
    if (filtros.tipo_aposta && a.tipo_aposta !== filtros.tipo_aposta) return false;
    if (filtros.resultado && a.resultado !== filtros.resultado) return false;
    if (filtros.casa_aposta && a.casa_aposta !== filtros.casa_aposta) return false;
    if (filtros.tag && a.tag !== filtros.tag) return false;
    if (filtros.tipo_registro && a.tipo_registro !== filtros.tipo_registro) return false;
    if (filtros.confianca && a.confianca !== Number(filtros.confianca)) return false;
    return true;
  });
}

async function buscarApostaComSelecoes(id) {
  const aposta = await db.apostas.get(id);
  if (!aposta) return null;
  if (aposta.tipo_registro === 'acumulada') {
    aposta.selecoes = await db.selecoes.where('aposta_id').equals(id).sortBy('ordem');
  }
  return aposta;
}

// ─── BANKROLL ───────────────────────────────────────────────────────────────

async function salvarMovimentoBankroll(dados) {
  return db.bankroll.add({ ...dados, criado_em: new Date().toISOString() });
}

async function buscarMovimentosBankroll() {
  return db.bankroll.orderBy('data').toArray();
}

async function getSaldoAtual() {
  const cfg = await db.config.get('bankroll_inicial');
  const inicial = cfg ? cfg.valor : 0;
  const apostas = await db.apostas.toArray();
  const movimentos = await db.bankroll.toArray();

  // Calcular impacto das apostas no saldo atual.
  // - Apostas pendentes: stake está em risco (subtrair)
  // - Win: lucratividade = (odd_total - 1) * stake
  // - Loss: perda = -stake
  // - Cashout: valor recebido menos stake
  const lucroApostas = apostas.reduce((sum, a) => {
    const stake = a.stake || 0;
    const odd = (a.odd_total || a.odd || 1);
    if (!a.resultado || a.resultado === 'pendente') return sum - stake;
    if (a.resultado === 'win') return sum + ((odd - 1) * stake);
    if (a.resultado === 'loss') return sum - stake;
    if (a.resultado === 'cashout') return sum + (a.lucro_cashout || 0) - stake;
    return sum;
  }, 0);

  const movimentosExtra = movimentos.reduce((sum, m) => {
    if (m.tipo === 'deposito') return sum + m.valor;
    if (m.tipo === 'saque') return sum - m.valor;
    return sum;
  }, 0);

  return inicial + lucroApostas + movimentosExtra;
}

async function recalcularBankroll() {
  // Dispara evento para componentes atualizarem
  window.dispatchEvent(new CustomEvent('bankroll-updated'));
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────

async function getConfig(chave) {
  const r = await db.config.get(chave);
  return r ? r.valor : null;
}

async function setConfig(chave, valor) {
  return db.config.put({ chave, valor });
}

// ─── ANALYTICS HELPERS ──────────────────────────────────────────────────────

async function getEstatisticasGerais(filtros = {}) {
  const apostas = await buscarApostas(filtros);
  return calcularEstatisticas(apostas);
}

function calcularEstatisticas(apostas) {
  const total = apostas.length;
  const wins = apostas.filter(a => a.resultado === 'win').length;
  const losses = apostas.filter(a => a.resultado === 'loss').length;
  const voids = apostas.filter(a => a.resultado === 'void').length;
  const cashouts = apostas.filter(a => a.resultado === 'cashout').length;
  const pendentes = apostas.filter(a => !a.resultado || a.resultado === 'pendente').length;

  const apostasResolvidas = apostas.filter(a => a.resultado && a.resultado !== 'pendente' && a.resultado !== 'void');
  const totalStake = apostasResolvidas.reduce((s, a) => s + (a.stake || 0), 0);

  const lucroTotal = apostas.reduce((sum, a) => {
    if (a.resultado === 'win') return sum + ((a.odd_total || a.odd || 1) - 1) * (a.stake || 0);
    if (a.resultado === 'loss') return sum - (a.stake || 0);
    if (a.resultado === 'cashout') return sum + (a.lucro_cashout || 0) - (a.stake || 0);
    return sum;
  }, 0);

  const roi = totalStake > 0 ? (lucroTotal / totalStake) * 100 : 0;
  const winRate = apostasResolvidas.length > 0 ? (wins / apostasResolvidas.filter(a => a.resultado !== 'cashout').length) * 100 : 0;

  // Odd média
  const oddMedia = apostasResolvidas.length > 0
    ? apostasResolvidas.reduce((s, a) => s + (a.odd_total || a.odd || 1), 0) / apostasResolvidas.length
    : 0;

  // Streak atual
  const ordenadas = [...apostas].filter(a => a.resultado && a.resultado !== 'pendente' && a.resultado !== 'void')
    .sort((a, b) => new Date(b.data) - new Date(a.data));
  let streak = 0, streakTipo = null;
  for (const a of ordenadas) {
    const r = a.resultado === 'win' ? 'win' : 'loss';
    if (streakTipo === null) { streakTipo = r; streak = 1; }
    else if (r === streakTipo) streak++;
    else break;
  }

  // Maior sequência
  let maxWin = 0, maxLoss = 0, curW = 0, curL = 0;
  for (const a of [...ordenadas].reverse()) {
    if (a.resultado === 'win') { curW++; curL = 0; maxWin = Math.max(maxWin, curW); }
    else if (a.resultado === 'loss') { curL++; curW = 0; maxLoss = Math.max(maxLoss, curL); }
  }

  return {
    total, wins, losses, voids, cashouts, pendentes,
    totalStake, lucroTotal, roi, winRate, oddMedia,
    streak, streakTipo, maxWin, maxLoss,
    apostasResolvidas: apostasResolvidas.length
  };
}

async function getLucroPorDia(dias = 30) {
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - dias);
  const dataInicio = inicio.toISOString().split('T')[0];
  const apostas = await buscarApostas({ dataInicio });

  const mapa = {};
  apostas.forEach(a => {
    const dia = a.data.split('T')[0];
    if (!mapa[dia]) mapa[dia] = 0;
    if (a.resultado === 'win') mapa[dia] += ((a.odd_total || a.odd || 1) - 1) * (a.stake || 0);
    if (a.resultado === 'loss') mapa[dia] -= (a.stake || 0);
    if (a.resultado === 'cashout') mapa[dia] += (a.lucro_cashout || 0) - (a.stake || 0);
  });

  // Preencher dias sem apostas
  const resultado = [];
  for (let i = dias; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    resultado.push({ data: key, lucro: mapa[key] || 0 });
  }
  return resultado;
}

async function getEvolucaoBankroll() {
  const apostas = (await db.apostas.orderBy('data').toArray())
    .filter(a => a.resultado && a.resultado !== 'pendente');
  const cfg = await db.config.get('bankroll_inicial');
  let saldo = cfg ? cfg.valor : 0;
  const pontos = [{ data: 'Início', saldo }];
  for (const a of apostas) {
    if (a.resultado === 'win') saldo += ((a.odd_total || a.odd || 1) - 1) * (a.stake || 0);
    if (a.resultado === 'loss') saldo -= (a.stake || 0);
    if (a.resultado === 'cashout') saldo += (a.lucro_cashout || 0) - (a.stake || 0);
    pontos.push({ data: a.data.split('T')[0], saldo: parseFloat(saldo.toFixed(2)) });
  }
  return pontos;
}

async function getStatsPorSegmento(campo) {
  const apostas = await buscarApostas();
  const grupos = {};
  // Pré-carregar seleções para garantir que acumuladas tenham suas seleções disponíveis
  const todasSelecoes = await db.selecoes.toArray();
  const mapaSelecoes = {};
  todasSelecoes.forEach(s => { if (!mapaSelecoes[s.aposta_id]) mapaSelecoes[s.aposta_id] = []; mapaSelecoes[s.aposta_id].push(s); });

  for (const a of apostas) {
    // Para acumuladas, permitir segmentação por esporte/liga usando as seleções persistidas
    if (a.tipo_registro === 'acumulada' && (campo === 'esporte' || campo === 'liga')) {
      const sel = mapaSelecoes[a.id] || [];
      if (sel.length) {
        sel.forEach(s => {
          const key = (campo === 'esporte') ? (s.esporte || 'Não informado') : (s.liga || 'Não informado');
          if (!grupos[key]) grupos[key] = [];
          const parcelaStake = (a.stake || 0) / sel.length;
          const pseudo = {
            id: a.id,
            original_tipo: a.tipo_registro,
            esporte: s.esporte || a.esporte,
            liga: s.liga || a.liga,
            tipo_aposta: s.tipo_aposta || a.tipo_aposta,
            odd: s.odd || (a.odd || 0),
            odd_total: s.odd || (a.odd_total || 0),
            stake: parcelaStake,
            resultado: s.resultado || (a.resultado || 'pendente'),
          };
          grupos[key].push(pseudo);
        });
        continue;
      }
    }
    const key = a[campo] || 'Não informado';
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(a);
  }
  return Object.entries(grupos).map(([nome, list]) => ({
    nome,
    ...calcularEstatisticas(list),
    totalApostas: list.length
  })).sort((a, b) => b.roi - a.roi);
}

async function getMapaCalor() {
  const apostas = await buscarApostas();
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const mapa = dias.map(d => ({ dia: d, wins: 0, total: 0, lucro: 0 }));
  apostas.forEach(a => {
    if (!a.resultado || a.resultado === 'pendente') return;
    const dow = new Date(a.data).getDay();
    mapa[dow].total++;
    if (a.resultado === 'win') { mapa[dow].wins++; mapa[dow].lucro += ((a.odd_total || a.odd || 1) - 1) * (a.stake || 0); }
    if (a.resultado === 'loss') mapa[dow].lucro -= (a.stake || 0);
  });
  return mapa.map(m => ({ ...m, winRate: m.total > 0 ? (m.wins / m.total) * 100 : 0 }));
}

// ─── BACKUP / RESTORE ───────────────────────────────────────────────────────

async function exportarJSON() {
  const apostas = await db.apostas.toArray();
  const selecoes = await db.selecoes.toArray();
  const bankroll = await db.bankroll.toArray();
  const config = await db.config.toArray();
  return JSON.stringify({ apostas, selecoes, bankroll, config, exportado_em: new Date().toISOString() }, null, 2);
}

async function importarJSON(jsonStr) {
  const dados = JSON.parse(jsonStr);
  // Importar em ordem: movimentos de banca -> recalcular -> apostas/selecoes -> recalcular
  await db.transaction('rw', db.apostas, db.selecoes, db.bankroll, db.config, async () => {
    await db.apostas.clear(); await db.selecoes.clear();
    await db.bankroll.clear(); await db.config.clear();

    // 1) Restaurar movimentos de banca (depositos/saques)
    if (dados.bankroll?.length) await db.bankroll.bulkAdd(dados.bankroll);
    // Disparar recálculo para refletir saldo após movimentos
    await recalcularBankroll();

    // 2) Restaurar configurações (p.ex. bankroll_inicial)
    if (dados.config?.length) await db.config.bulkAdd(dados.config);

    // 3) Restaurar apostas e seleções
    if (dados.apostas?.length) await db.apostas.bulkAdd(dados.apostas);
    if (dados.selecoes?.length) await db.selecoes.bulkAdd(dados.selecoes);

    // 4) Recalcular novamente com apostas aplicadas
    await recalcularBankroll();
  });
}

async function exportarCSV() {
  const apostas = await db.apostas.toArray();
  const headers = ['id','data','tipo','esporte','liga','tipo_aposta','odd','stake','resultado','lucro','casa_aposta','tag','confianca','obs'];
  const rows = apostas.map(a => headers.map(h => {
    let v = a[h === 'tipo' ? 'tipo_registro' : h === 'odd' ? 'odd_total' : h] ?? '';
    return `"${String(v).replace(/"/g, '""')}"`;
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}
