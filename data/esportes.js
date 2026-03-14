const ESPORTES = {
  futebol: {
    nome: 'Futebol',
    emoji: '⚽',
    ligas: [
      'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1',
      'Brasileirão Série A', 'Brasileirão Série B', 'Champions League',
      'Europa League', 'Conference League', 'Libertadores', 'Sul-Americana',
      'Copa do Brasil', 'Copa do Mundo', 'Eurocopa', 'Copa América'
    ],
    tipos_aposta: [
      '1X2', 'Dupla Chance', 'Handicap Asiático', 'Handicap Europeu',
      'Over/Under Gols', 'Ambos Marcam', 'Resultado Exato',
      'Primeiro a Marcar', 'Último a Marcar', 'Gols 1º Tempo',
      'Resultado ao Intervalo', 'Escanteios', 'Cartões', 'Chutes a Gol'
    ],
    campos_extras: {
      'Handicap Asiático': [{ id: 'linha', label: 'Linha (ex: -1.5)', type: 'number', step: '0.25' }],
      'Handicap Europeu': [{ id: 'linha', label: 'Linha (ex: -1)', type: 'number', step: '1' }],
      'Over/Under Gols': [{ id: 'linha', label: 'Linha (ex: 2.5)', type: 'number', step: '0.5' }],
      'Gols 1º Tempo': [{ id: 'linha', label: 'Linha (ex: 1.5)', type: 'number', step: '0.5' }],
      'Escanteios': [{ id: 'linha', label: 'Linha escanteios', type: 'number', step: '0.5' }],
      'Cartões': [{ id: 'linha', label: 'Linha cartões', type: 'number', step: '0.5' }],
    }
  },
  basquete: {
    nome: 'Basquete',
    emoji: '🏀',
    ligas: ['NBA', 'NBB', 'Euroliga', 'NCAA', 'NBA G League', 'FIBA'],
    tipos_aposta: [
      'Moneyline', 'Handicap Pontos', 'Over/Under Pontos',
      'Over/Under Pontos 1º Quarto', 'Vencedor do Quarto',
      'Duplo-Duplo', 'Triplo-Duplo', 'Pontos do Jogador',
      'Rebotes do Jogador', 'Assistências do Jogador'
    ],
    campos_extras: {
      'Handicap Pontos': [{ id: 'linha', label: 'Linha (ex: -5.5)', type: 'number', step: '0.5' }],
      'Over/Under Pontos': [{ id: 'linha', label: 'Linha (ex: 220.5)', type: 'number', step: '0.5' }],
      'Over/Under Pontos 1º Quarto': [{ id: 'linha', label: 'Linha 1Q', type: 'number', step: '0.5' }],
      'Pontos do Jogador': [
        { id: 'jogador', label: 'Jogador', type: 'text' },
        { id: 'linha', label: 'Linha pontos', type: 'number', step: '0.5' }
      ],
      'Rebotes do Jogador': [
        { id: 'jogador', label: 'Jogador', type: 'text' },
        { id: 'linha', label: 'Linha rebotes', type: 'number', step: '0.5' }
      ],
      'Assistências do Jogador': [
        { id: 'jogador', label: 'Jogador', type: 'text' },
        { id: 'linha', label: 'Linha assistências', type: 'number', step: '0.5' }
      ],
    }
  },
  tenis: {
    nome: 'Tênis',
    emoji: '🎾',
    ligas: ['ATP', 'WTA', 'Grand Slam', 'ATP Finals', 'WTA Finals', 'Davis Cup', 'Copa Billie Jean King'],
    tipos_aposta: [
      'Moneyline', 'Handicap Games', 'Over/Under Sets',
      'Over/Under Games', 'Set Correto', 'Vencedor do Set',
      'Tiebreak no Jogo', 'Aces do Jogador', 'Double Faults'
    ],
    campos_extras: {
      'Handicap Games': [{ id: 'linha', label: 'Linha games (ex: -3.5)', type: 'number', step: '0.5' }],
      'Over/Under Sets': [{ id: 'linha', label: 'Linha sets (ex: 2.5)', type: 'number', step: '0.5' }],
      'Over/Under Games': [{ id: 'linha', label: 'Linha games', type: 'number', step: '0.5' }],
      'Set Correto': [{ id: 'placar', label: 'Placar (ex: 2-1)', type: 'text' }],
      'Aces do Jogador': [
        { id: 'jogador', label: 'Jogador', type: 'text' },
        { id: 'linha', label: 'Linha aces', type: 'number', step: '0.5' }
      ],
    }
  },
  americano: {
    nome: 'Futebol Americano',
    emoji: '🏈',
    ligas: ['NFL', 'NCAA Football', 'CFL', 'Super Bowl'],
    tipos_aposta: [
      'Moneyline', 'Spread', 'Over/Under Pontos',
      'Over/Under 1ª Metade', 'Vencedor da Metade',
      'Primeiro TD', 'Anytime TD', 'Jardas do Jogador',
      'Touchdowns do Jogador'
    ],
    campos_extras: {
      'Spread': [{ id: 'linha', label: 'Spread (ex: -6.5)', type: 'number', step: '0.5' }],
      'Over/Under Pontos': [{ id: 'linha', label: 'Linha pontos (ex: 47.5)', type: 'number', step: '0.5' }],
      'Over/Under 1ª Metade': [{ id: 'linha', label: 'Linha 1ª metade', type: 'number', step: '0.5' }],
      'Jardas do Jogador': [
        { id: 'jogador', label: 'Jogador', type: 'text' },
        { id: 'linha', label: 'Linha jardas', type: 'number', step: '0.5' }
      ],
    }
  },
  f1: {
    nome: 'Fórmula 1',
    emoji: '🏎️',
    ligas: ['F1 — Corrida', 'F1 — Classificação', 'F1 — Sprint', 'F2', 'F3'],
    tipos_aposta: [
      'Vencedor da Corrida', 'Pole Position', 'Pódio (Top 3)',
      'Pontos (Top 10)', 'Melhor entre Companheiros',
      'Safety Car na Corrida', 'Líder Após 1ª Volta',
      'Mais Rápido na Corrida', 'DNF do Piloto',
      'Construtores — Vencedor', 'Volta Mais Rápida'
    ],
    campos_extras: {
      'Vencedor da Corrida': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Pole Position': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Pódio (Top 3)': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Pontos (Top 10)': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Melhor entre Companheiros': [
        { id: 'piloto', label: 'Piloto vencedor', type: 'text' },
        { id: 'adversario', label: 'Adversário', type: 'text' }
      ],
      'DNF do Piloto': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Mais Rápido na Corrida': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
      'Volta Mais Rápida': [{ id: 'piloto', label: 'Piloto', type: 'text' }],
    }
  }
};

const CASAS_APOSTA = [
  'Bet365', 'Betano', 'Sportingbet', 'KTO', 'Parimatch',
  'Superbet', 'Pixbet', 'Novibet', 'Betfair', 'Pinnacle',
  'Betsson', '1xBet', 'Betway', 'William Hill', 'Unibet', 'Outra'
];

const TAGS = [
  { value: 'valor', label: 'Valor', desc: 'Edge identificado' },
  { value: 'sistema', label: 'Sistema', desc: 'Parte de estratégia' },
  { value: 'impulso', label: 'Impulso', desc: 'Decisão emocional' },
  { value: 'tipster', label: 'Tipster', desc: 'Seguindo dica' },
  { value: 'pesquisa', label: 'Pesquisa', desc: 'Análise aprofundada' }
];
