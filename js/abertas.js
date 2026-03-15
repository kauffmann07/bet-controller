// abertas.js — Página "Apostas Abertas" — lista visual de apostas pendentes

async function renderAbertas() {
  const sec = document.getElementById('sec-abertas');
  if (!sec) return;
  sec.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'open-bets-header';
  header.innerHTML = `
    <div>
      <div class="title">Apostas Abertas</div>
      <div class="subtitle">Acompanhe suas apostas em risco de forma clara e rápida</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button class="btn btn-secondary" onclick="navegar('historico')">Ver Histórico</button>
      <button class="btn btn-primary" onclick="navegar('nova-aposta')">+ Nova Aposta</button>
    </div>
  `;
  sec.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'open-bets-grid';
  sec.appendChild(grid);

  // Buscar todas as apostas e filtrar as pendentes
  let apostas = await buscarApostas();
  const abertas = apostas.filter(a => !a.resultado || a.resultado === 'pendente');

  if (!abertas.length) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.style.textAlign = 'center';
    empty.innerHTML = `<div style="padding:30px;color:var(--muted)"><strong>Nenhuma aposta em aberto</strong><div style="margin-top:8px">Quando você registrar apostas, elas aparecerão aqui.</div></div>`;
    grid.appendChild(empty);
    return;
  }

  // Ordenar por data crescente (as que começam mais cedo primeiro)
  abertas.sort((a,b) => new Date(a.data) - new Date(b.data));

  for (const aposta of abertas) {
    const card = document.createElement('div');
    card.className = 'open-bet-card';

    const top = document.createElement('div');
    top.className = 'open-bet-top';

    const meta = document.createElement('div');
    meta.className = 'open-bet-meta';
    const liga = aposta.liga || (ESPORTES[aposta.esporte] && ESPORTES[aposta.esporte].nome) || (aposta.esporte || '');
    meta.innerHTML = `<div style="display:flex;flex-direction:column">
        <div class="league">${liga}</div>
        <div class="date">${fmtDataHora(aposta.data)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end">
        <div style="font-size:.78rem;color:var(--muted);">${aposta.tipo_registro === 'acumulada' ? '<span class="badge badge-acumulada">Acumulada</span>' : '<span class="badge badge-simples">Simples</span>'}</div>
        <div style="margin-top:6px;" class="open-bet-odds">Odd: ${fmtOdd(aposta.odd_total || aposta.odd || 0)}</div>
      </div>`;

    const right = document.createElement('div');
    right.style.textAlign = 'right';
    right.innerHTML = `<div class="open-bet-stake">Stake: ${fmtMoedaSimples(aposta.stake||0)}</div>
      <div class="card-sub">Retorno: ${fmtMoedaSimples(((aposta.odd_total||aposta.odd||0) * (aposta.stake||0)).toFixed(2))}</div>`;

    top.appendChild(meta);
    top.appendChild(right);

    const body = document.createElement('div');
    body.className = 'open-bet-body';

    // Carregar seleções e mostrar times/jogadores de forma consistente
    function tituloSelecaoFallback(obj) {
      if (!obj) return '';
      if (obj.piloto) return obj.piloto;
      if (obj.equipe) return obj.equipe;
      if (obj.jogador) return obj.jogador;
      if (obj.time_a && obj.time_b) return `${obj.time_a} × ${obj.time_b}`;
      if (obj.time_a) return obj.time_a;
      if (obj.nome) return obj.nome;
      if (obj.descricao) return obj.descricao;
      if (obj.tipo_aposta) return obj.tipo_aposta;
      return obj.esporte || 'Seleção';
    }

    function descricaoSelecao(obj) {
      if (!obj) return { mercado: 'Seleção', escolha: '' };
      const mercado = obj.tipo_aposta || obj.descricao || obj.nome || obj.mercado || 'Aposta';
      let escolha = '';
      if (obj.vencedor) escolha = obj.vencedor;
      else if (obj.escolha) escolha = obj.escolha;
      else if (obj.selecao) escolha = obj.selecao;
      else if (obj.jogador) escolha = obj.jogador;
      else if (obj.equipe) escolha = obj.equipe;
      else if (obj.time_a && obj.time_b) {
        if (obj.vencedor === 'Casa' || obj.vencedor === 'Home') escolha = obj.time_a;
        else if (obj.vencedor === 'Fora' || obj.vencedor === 'Away') escolha = obj.time_b;
      }
      if (obj.linha) {
        // ex: Over/Under ou Handicaps
        if (mercado.toLowerCase().includes('over') || mercado.toLowerCase().includes('under') || mercado.toLowerCase().includes('gols')) {
          escolha = `${mercado} ${obj.linha}`;
        } else {
          escolha = escolha ? `${escolha} (${obj.linha})` : `${obj.linha}`;
        }
      }
      return { mercado, escolha };
    }

    // Carregar seleções (para acumuladas ou eventuais seleções embutidas)
    let selections = [];
    if (aposta.tipo_registro === 'acumulada') {
      const apostaFull = await buscarApostaComSelecoes(aposta.id);
      selections = apostaFull?.selecoes || [];
    } else if (Array.isArray(aposta.selecoes) && aposta.selecoes.length) {
      selections = aposta.selecoes;
    } else {
      // construir uma seleção a partir do próprio objeto de aposta (simples)
      selections = [aposta];
    }

    if (!selections.length) {
      const none = document.createElement('div');
      none.className = 'text-muted';
      none.textContent = 'Sem seleções gravadas nesta aposta.';
      body.appendChild(none);
    } else {
      // resumo rápido: contar mercados (ex: Escanteios, Gols, Vencedor)
      const marketCounts = {};
      selections.forEach(s => {
        const key = (s.tipo_aposta || s.descricao || s.nome || 'Outros');
        marketCounts[key] = (marketCounts[key] || 0) + 1;
      });
      const countsText = Object.entries(marketCounts).map(([k,v]) => `${k}: ${v}`).join(' • ');
      if (countsText) {
        const countsEl = document.createElement('div');
        countsEl.className = 'text-muted';
        countsEl.style.fontSize = '.78rem';
        countsEl.style.marginBottom = '6px';
        countsEl.textContent = countsText;
        body.appendChild(countsEl);
      }

      // Agrupar seleções por partida (data+time_a+time_b) para evitar repetição quando múltiplas na mesma partida
      const groups = {};
      selections.forEach(s => {
        const partKey = `${s.data||aposta.data||''}|${(s.time_a||s.home||'').trim()}|${(s.time_b||s.away||'').trim()}`;
        groups[partKey] = groups[partKey] || [];
        groups[partKey].push(s);
      });

      Object.values(groups).forEach(grp => {
        // se for mesma partida e tiver time_a/time_b, mostrar header da partida
        const first = grp[0];
        const hasMatch = (first.time_a && first.time_b) || (first.home && first.away);
        if (hasMatch) {
          const matchHeader = document.createElement('div');
          matchHeader.style.padding = '8px 0';
          matchHeader.style.borderBottom = '1px dashed var(--border)';
          matchHeader.innerHTML = `<div style="font-weight:700;color:var(--bright)">${first.time_a || first.home} × ${first.time_b || first.away}</div>
            <div style="font-size:.78rem;color:var(--muted)">${fmtDataHora(first.data||aposta.data)}</div>`;
          body.appendChild(matchHeader);
        }

        grp.forEach(s => {
          const sdiv = document.createElement('div');
          sdiv.className = 'open-bet-selecao';
          const left = document.createElement('div');
          const desc = descricaoSelecao(s);
          // se já mostramos header da partida, não repetir o match title — mostrar apenas mercado/escolha
          const titleText = hasMatch ? desc.mercado : (desc.escolha || desc.mercado || tituloSelecaoFallback(s));
          const subText = desc.escolha && hasMatch ? desc.escolha : (s.tipo_aposta || s.descricao || s.linha || s.liga || (ESPORTES[s.esporte]?.nome) || '');
          left.innerHTML = `<div style="font-weight:700;color:var(--bright)">${titleText}</div>
            <div style="font-size:.78rem;color:var(--muted)">${subText}</div>`;
          const rightSel = document.createElement('div');
          rightSel.style.textAlign = 'right';
          rightSel.innerHTML = `<div class="td-odd">${fmtOdd(s.odd || s.odd_total || aposta.odd || aposta.odd_total || 0)}</div>
            <div style="font-size:.78rem;color:var(--muted)">${labelResultado(s.resultado || aposta.resultado || 'pendente')}</div>`;
          sdiv.appendChild(left); sdiv.appendChild(rightSel);
          body.appendChild(sdiv);
        });
      });
    }

    const actions = document.createElement('div');
    actions.className = 'open-bet-actions';
    // Ações rápidas: Detalhes | Marcar WIN | Marcar LOSS | Cashout | Editar
    const btnWin = document.createElement('button');
    btnWin.className = 'btn btn-primary btn-sm';
    btnWin.textContent = 'Win';
    btnWin.onclick = async () => {
      const ok = await showConfirm('Marcar esta aposta como WIN?');
      if (!ok) return;
      try {
        await atualizarAposta(aposta.id, { resultado: 'win' });
        toast('Aposta marcada como WIN');
        await renderAbertas();
      } catch (e) { console.error(e); toast('Erro atualizando aposta', 'error'); }
    };

    const btnLoss = document.createElement('button');
    btnLoss.className = 'btn btn-danger btn-sm';
    btnLoss.textContent = 'Loss';
    btnLoss.onclick = async () => {
      const ok = await showConfirm('Marcar esta aposta como LOSS?');
      if (!ok) return;
      try {
        await atualizarAposta(aposta.id, { resultado: 'loss' });
        toast('Aposta marcada como LOSS');
        await renderAbertas();
      } catch (e) { console.error(e); toast('Erro atualizando aposta', 'error'); }
    };

    const btnCashout = document.createElement('button');
    btnCashout.className = 'btn btn-warning btn-sm';
    btnCashout.textContent = 'Cashout';
    btnCashout.onclick = async () => {
      const val = await showPrompt('Informe o valor recebido (R$)', (aposta.lucro_cashout||'').toString());
      if (val === null) return;
      const num = Number(String(val).replace(',', '.'));
      if (isNaN(num)) { toast('Valor inválido', 'error'); return; }
      try {
        await atualizarAposta(aposta.id, { resultado: 'cashout', lucro_cashout: num });
        toast('Aposta marcada como CASHOUT');
        await renderAbertas();
      } catch (e) { console.error(e); toast('Erro atualizando aposta', 'error'); }
    };

    // Apenas WIN | LOSS | CASHOUT na mesma linha
    actions.appendChild(btnWin);
    actions.appendChild(btnLoss);
    actions.appendChild(btnCashout);

    card.appendChild(top);
    card.appendChild(body);
    card.appendChild(actions);

    grid.appendChild(card);
  }
}
