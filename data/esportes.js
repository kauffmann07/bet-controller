// ─── FUTEBOL ────────────────────────────────────────────────────────────────

const FUTEBOL_LIGAS = [
  'Brasileirão Série A','Brasileirão Série B','Brasileirão Série C','Copa do Brasil',
  'Premier League','FA Cup',
  'La Liga','Copa del Rey',
  'Serie A','Coppa Italia',
  'Bundesliga','DFB-Pokal',
  'Ligue 1','Coupe de France',
  'Eredivisie','KNVB Cup',
  'Primeira Liga','Taça de Portugal',
  'Champions League','Europa League','Conference League',
  'Eurocopa','Nations League',
  'Libertadores','Sul-Americana',
  'Copa do Mundo','Copa América',
  'Mundial de Clubes','Copa do Mundo de Clubes'
];

const TIMES_FUTEBOL = {
  'Brasileirão Série A': ['Atlético-MG','Botafogo','Flamengo','Fluminense','Vasco','Palmeiras','São Paulo','Corinthians','Santos','Red Bull Bragantino','Athletico-PR','Grêmio','Internacional','Sport','Fortaleza','Ceará','Bahia','Cruzeiro','Coritiba','Juventude'],
  'Brasileirão Série B': ['Mirassol','Novorizontino','Goiás','Operário','Chapecoense','Ituano','Ponte Preta','Guarani','CRB','ABC','Paysandu','Remo','Vila Nova','Botafogo-SP','Avaí','Londrina','Tombense','Sampaio Corrêa','Náutico','América-MG'],
  'Brasileirão Série C': ['Volta Redonda','Figueirense','Ferroviária','CSA','Confiança','Brusque','Manaus','Floresta','Caxias','São José-RS','Athletic Club','Aparecidense','Athletic-MG','Altos','Sousa','Botafogo-PB','Campinense','Castanhal','Tuna Luso','Atlético-CE'],
  'Copa do Brasil': ['Flamengo','Palmeiras','Atlético-MG','São Paulo','Corinthians','Grêmio','Internacional','Fluminense','Botafogo','Cruzeiro'],
  'Premier League': ['Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea','Crystal Palace','Everton','Fulham','Ipswich Town','Leicester City','Liverpool','Manchester City','Manchester United','Newcastle','Nottingham Forest','Southampton','Tottenham','West Ham','Wolverhampton'],
  'FA Cup': ['Arsenal','Chelsea','Liverpool','Manchester City','Manchester United','Tottenham','Aston Villa','Newcastle'],
  'La Liga': ['Athletic Bilbao','Atlético de Madrid','Barcelona','Betis','Celta Vigo','Espanyol','Getafe','Girona','Las Palmas','Leganés','Mallorca','Osasuna','Rayo Vallecano','Real Madrid','Real Sociedad','Real Valladolid','Sevilla','Valencia','Villarreal','Alavés'],
  'Copa del Rey': ['Real Madrid','Barcelona','Atlético de Madrid','Athletic Bilbao','Real Sociedad','Betis','Valencia','Villarreal'],
  'Serie A': ['AC Milan','Atalanta','Bologna','Cagliari','Como','Empoli','Fiorentina','Genoa','Inter','Juventus','Lazio','Lecce','Monza','Napoli','Parma','Roma','Torino','Udinese','Venezia','Verona'],
  'Coppa Italia': ['Inter','Juventus','Milan','Napoli','Roma','Lazio','Atalanta','Fiorentina'],
  'Bundesliga': ['Augsburg','Bayer Leverkusen','Bayern München','Bochum','Borussia Dortmund','Borussia Mönchengladbach','Eintracht Frankfurt','FC St. Pauli','Freiburg','Heidenheim','Hoffenheim','Holstein Kiel','Mainz','RB Leipzig','Stuttgart','Union Berlin','Werder Bremen','Wolfsburg'],
  'DFB-Pokal': ['Bayern München','Borussia Dortmund','Bayer Leverkusen','Eintracht Frankfurt','RB Leipzig','Stuttgart'],
  'Ligue 1': ['Angers','AS Monaco','Auxerre','Brest','Le Havre','Lens','Lille','Lyon','Marseille','Montpellier','Nantes','Nice','Paris Saint-Germain','Reims','Rennes','Saint-Étienne','Strasbourg','Toulouse'],
  'Coupe de France': ['PSG','Marseille','Lyon','Monaco','Lille','Nice','Lens','Rennes'],
  'Eredivisie': ['Ajax','AZ Alkmaar','Feyenoord','Fortuna Sittard','Go Ahead Eagles','Groningen','Heerenveen','Heracles','NAC Breda','NEC Nijmegen','PEC Zwolle','PSV','RKC Waalwijk','Sparta Rotterdam','Twente','Utrecht','Willem II','Almere City'],
  'KNVB Cup': ['Ajax','PSV','Feyenoord','AZ Alkmaar','Twente','Utrecht'],
  'Primeira Liga': ['Benfica','Boavista','Braga','Casa Pia','Estoril','Estrela da Amadora','Famalicão','Farense','Gil Vicente','Moreirense','Nacional','Porto','Rio Ave','Santa Clara','Sporting CP','Vizela','AVS','Arouca','Chaves'],
  'Taça de Portugal': ['Benfica','Porto','Sporting CP','Braga','Vitória Guimarães'],
  'Champions League': ['Arsenal','Aston Villa','Atlético de Madrid','Barcelona','Bayern München','Benfica','Bologna','Borussia Dortmund','Brest','Celtic','Club Brugge','Dinamo Zagreb','Feyenoord','Girona','Inter','Juventus','Bayer Leverkusen','Lille','Liverpool','Manchester City','AC Milan','Monaco','PSG','PSV','RB Leipzig','Real Madrid','Red Star','Salzburg','Shakhtar','Slovan Bratislava','Sparta Praha','Sporting CP','Sturm Graz','Young Boys'],
  'Europa League': ['Ajax','AZ Alkmaar','Anderlecht','Athletic Bilbao','Bodo/Glimt','Eintracht Frankfurt','Fenerbahçe','Galatasaray','PAOK','Porto','Rangers','Roma','Real Sociedad','Tottenham','Twente','Union Saint-Gilloise','Lazio','Lyon'],
  'Conference League': ['Chelsea','Fiorentina','PAOK','Heidenheim','Djurgarden','Molde','Lugano','Rapid Wien','Vitória','Shamrock Rovers','Jagiellonia','HJK','Betis'],
  'Libertadores': ['Atlético-MG','Botafogo','Flamengo','Fluminense','Palmeiras','Racing Club','River Plate','Boca Juniors','LDU Quito','Colo-Colo','Independiente del Valle','Peñarol','Nacional','Estudiantes','Talleres','Olimpia','Cerro Porteño','Universitario','Junior','Atlético Nacional'],
  'Sul-Americana': ['São Paulo','Cruzeiro','Grêmio','Internacional','Fortaleza','Corinthians','Athletico-PR','Independiente','Lanús','Vélez','Defensa y Justicia','Deportivo Pereira'],
  'Copa do Mundo': ['Brasil','Argentina','França','Espanha','Inglaterra','Alemanha','Portugal','Holanda','Bélgica','Croácia','Itália','Suíça','Sérvia','Dinamarca','Áustria','Escócia','Turquia','Hungria','Ucrânia','Eslováquia','República Tcheca','Polônia','Romênia','Eslovênia','Albânia','Geórgia','Estados Unidos','México','Canadá','Costa Rica','Panamá','Jamaica','Honduras','Colômbia','Uruguai','Venezuela','Equador','Peru','Bolívia','Chile','Paraguai','Marrocos','Senegal','Egito','Nigéria','Camarões','Costa do Marfim','Gana','Mali','África do Sul','Japão','Coreia do Sul','Irã','Arábia Saudita','Austrália','Qatar','China','Iraque'],
  'Copa América': ['Brasil','Argentina','Colômbia','Uruguai','Venezuela','Equador','Peru','Bolívia','Chile','Paraguai','EUA','México','Canadá','Jamaica','Panamá'],
  'Eurocopa': ['Espanha','França','Alemanha','Inglaterra','Portugal','Holanda','Itália','Bélgica','Croácia','Suíça','Sérvia','Dinamarca','Áustria','Escócia','Turquia','Hungria','Ucrânia','Eslovênia','Albânia','Geórgia','Eslováquia','República Tcheca','Polônia','Romênia'],
  'Nations League': ['Espanha','França','Alemanha','Inglaterra','Portugal','Holanda','Itália','Bélgica','Croácia','Suíça','Sérvia','Dinamarca'],
  'Mundial de Clubes': ['Real Madrid','Manchester City','Bayern München','PSG','Chelsea','Porto','Benfica','Ajax','Inter','Juventus','Flamengo','Palmeiras','River Plate','Boca Juniors','Al Hilal','Urawa Red Diamonds'],
  'Copa do Mundo de Clubes': ['Real Madrid','Manchester City','Bayern München','PSG','Chelsea','Borussia Dortmund','Atlético de Madrid','Porto','Benfica','Inter','Juventus','Flamengo','Palmeiras','Fluminense','River Plate','Boca Juniors','Al Hilal','Al Ahly','Wydad','Mamelodi Sundowns','Auckland City','Seattle Sounders','LAFC','CF Monterrey','León']
};

const FUTEBOL_TIPOS = [
  '1X2','Dupla Chance','Handicap Asiático','Handicap Europeu',
  'Over/Under Gols','Ambos Marcam','Resultado Exato',
  'Gols 1º Tempo','Resultado ao Intervalo','Over/Under 1º Tempo',
  'Primeiro Gol (Jogador)','Último Gol (Jogador)','A Qualquer Momento (Jogador)',
  'Gols do Jogador (Over/Under)','Assistências do Jogador (Over/Under)',
  'Escanteios (Jogo)','Escanteios (Time)','Escanteios (Jogador)',
  'Cartões (Jogo)','Cartões (Time)','Cartão (Jogador)',
  'Chutes a Gol (Jogo)','Chutes a Gol (Time)',
  'Clean Sheet (Time)'
];

const FUTEBOL_CONTEXTO = {
  '1X2':'jogo','Dupla Chance':'jogo','Handicap Asiático':'jogo','Handicap Europeu':'jogo',
  'Over/Under Gols':'jogo','Ambos Marcam':'jogo','Resultado Exato':'jogo',
  'Gols 1º Tempo':'jogo','Resultado ao Intervalo':'jogo','Over/Under 1º Tempo':'jogo',
  'Escanteios (Jogo)':'jogo','Cartões (Jogo)':'jogo','Chutes a Gol (Jogo)':'jogo',
  'Primeiro Gol (Jogador)':'jogador','Último Gol (Jogador)':'jogador',
  'A Qualquer Momento (Jogador)':'jogador','Gols do Jogador (Over/Under)':'jogador',
  'Assistências do Jogador (Over/Under)':'jogador','Escanteios (Jogador)':'jogador',
  'Cartão (Jogador)':'jogador',
  'Escanteios (Time)':'time','Cartões (Time)':'time',
  'Chutes a Gol (Time)':'time','Clean Sheet (Time)':'time'
};

const FUTEBOL_LINHAS = ['Over/Under Gols','Over/Under 1º Tempo','Gols 1º Tempo','Escanteios (Jogo)','Escanteios (Time)','Escanteios (Jogador)','Cartões (Jogo)','Cartões (Time)','Chutes a Gol (Jogo)','Chutes a Gol (Time)','Handicap Asiático','Handicap Europeu','Gols do Jogador (Over/Under)','Assistências do Jogador (Over/Under)'];

// ─── BASQUETE ────────────────────────────────────────────────────────────────
const NBA_TIMES = ['Atlanta Hawks','Boston Celtics','Brooklyn Nets','Charlotte Hornets','Chicago Bulls','Cleveland Cavaliers','Dallas Mavericks','Denver Nuggets','Detroit Pistons','Golden State Warriors','Houston Rockets','Indiana Pacers','LA Clippers','Los Angeles Lakers','Memphis Grizzlies','Miami Heat','Milwaukee Bucks','Minnesota Timberwolves','New Orleans Pelicans','New York Knicks','Oklahoma City Thunder','Orlando Magic','Philadelphia 76ers','Phoenix Suns','Portland Trail Blazers','Sacramento Kings','San Antonio Spurs','Toronto Raptors','Utah Jazz','Washington Wizards'];

const BASQUETE_TIPOS = ['Moneyline','Handicap Pontos','Over/Under Pontos','Over/Under 1º Quarto','Vencedor do Quarto','Pontos do Jogador (Over/Under)','Rebotes do Jogador (Over/Under)','Assistências do Jogador (Over/Under)','Duplo-Duplo (Jogador)','Triplo-Duplo (Jogador)'];

const BASQUETE_CONTEXTO = {
  'Moneyline':'jogo','Handicap Pontos':'jogo','Over/Under Pontos':'jogo',
  'Over/Under 1º Quarto':'jogo','Vencedor do Quarto':'jogo',
  'Pontos do Jogador (Over/Under)':'jogador','Rebotes do Jogador (Over/Under)':'jogador',
  'Assistências do Jogador (Over/Under)':'jogador','Duplo-Duplo (Jogador)':'jogador','Triplo-Duplo (Jogador)':'jogador'
};

// ─── TÊNIS ──────────────────────────────────────────────────────────────────
const TENIS_TIPOS = ['Moneyline','Handicap Games','Over/Under Sets','Over/Under Games','Set Correto','Vencedor do Set','Tiebreak no Jogo','Aces do Jogador (Over/Under)','Double Faults (Over/Under)'];

const TENIS_CONTEXTO = {
  'Moneyline':'jogo','Handicap Games':'jogo','Over/Under Sets':'jogo','Over/Under Games':'jogo',
  'Set Correto':'jogo','Vencedor do Set':'jogo','Tiebreak no Jogo':'jogo',
  'Aces do Jogador (Over/Under)':'jogador','Double Faults (Over/Under)':'jogador'
};

// ─── FUTEBOL AMERICANO ───────────────────────────────────────────────────────
const NFL_TIMES = ['Arizona Cardinals','Atlanta Falcons','Baltimore Ravens','Buffalo Bills','Carolina Panthers','Chicago Bears','Cincinnati Bengals','Cleveland Browns','Dallas Cowboys','Denver Broncos','Detroit Lions','Green Bay Packers','Houston Texans','Indianapolis Colts','Jacksonville Jaguars','Kansas City Chiefs','Las Vegas Raiders','Los Angeles Chargers','Los Angeles Rams','Miami Dolphins','Minnesota Vikings','New England Patriots','New Orleans Saints','New York Giants','New York Jets','Philadelphia Eagles','Pittsburgh Steelers','San Francisco 49ers','Seattle Seahawks','Tampa Bay Buccaneers','Tennessee Titans','Washington Commanders'];

const AMERICANO_TIPOS = ['Moneyline','Spread','Over/Under Pontos','Over/Under 1ª Metade','Vencedor da Metade','Primeiro TD (Jogador)','Anytime TD (Jogador)','Jardas Passadas (Over/Under)','Jardas Corridas (Over/Under)','Recepções (Over/Under)'];

const AMERICANO_CONTEXTO = {
  'Moneyline':'jogo','Spread':'jogo','Over/Under Pontos':'jogo',
  'Over/Under 1ª Metade':'jogo','Vencedor da Metade':'jogo',
  'Primeiro TD (Jogador)':'jogador','Anytime TD (Jogador)':'jogador',
  'Jardas Passadas (Over/Under)':'jogador','Jardas Corridas (Over/Under)':'jogador','Recepções (Over/Under)':'jogador'
};

// ─── FÓRMULA 1 ───────────────────────────────────────────────────────────────
const F1_PILOTOS_2026 = [
  'Max Verstappen','Liam Lawson',       // Red Bull
  'George Russell','Kimi Antonelli',    // Mercedes
  'Charles Leclerc','Lewis Hamilton',   // Ferrari
  'Lando Norris','Oscar Piastri',       // McLaren
  'Fernando Alonso','Lance Stroll',     // Aston Martin
  'Pierre Gasly','Jack Doohan',         // Alpine
  'Alexander Albon','Carlos Sainz',     // Williams
  'Yuki Tsunoda','Isack Hadjar',        // Racing Bulls
  'Esteban Ocon','Oliver Bearman',      // Haas
  'Nico Hülkenberg','Gabriel Bortoleto' // Audi
];

const F1_EQUIPES_2026 = ['Red Bull','Mercedes','Ferrari','McLaren','Aston Martin','Alpine','Williams','Racing Bulls','Haas','Audi'];

const F1_TIPOS = [
  'Vencedor da Corrida (Piloto)','Vencedor da Corrida (Equipe)',
  'Pole Position (Piloto)','Pole Position (Equipe)',
  'Pódio (Piloto)','Pontos Top-10 (Piloto)',
  'Melhor entre Companheiros (Piloto)',
  'Líder Após 1ª Volta (Piloto)','Mais Rápido na Corrida (Piloto)',
  'Volta Mais Rápida (Piloto)','DNF (Piloto)',
  'Safety Car na Corrida','Construtor Vencedor'
];

const F1_CONTEXTO = {
  'Vencedor da Corrida (Piloto)':'piloto','Pole Position (Piloto)':'piloto',
  'Pódio (Piloto)':'piloto','Pontos Top-10 (Piloto)':'piloto',
  'Melhor entre Companheiros (Piloto)':'piloto','Líder Após 1ª Volta (Piloto)':'piloto',
  'Mais Rápido na Corrida (Piloto)':'piloto','Volta Mais Rápida (Piloto)':'piloto','DNF (Piloto)':'piloto',
  'Vencedor da Corrida (Equipe)':'equipe','Pole Position (Equipe)':'equipe','Construtor Vencedor':'equipe',
  'Safety Car na Corrida':'nenhum'
};

// ─── OBJETO PRINCIPAL ────────────────────────────────────────────────────────
const ESPORTES = {
  futebol: {
    nome:'Futebol', emoji:'⚽',
    ligas: FUTEBOL_LIGAS, times: TIMES_FUTEBOL,
    tipos_aposta: FUTEBOL_TIPOS, contexto: FUTEBOL_CONTEXTO, linhas: FUTEBOL_LINHAS,
    liga_fixa: null, liga_livre: false
  },
  basquete: {
    nome:'Basquete', emoji:'🏀',
    ligas:['NBA'], liga_fixa:'NBA',
    times:{'NBA': NBA_TIMES},
    tipos_aposta: BASQUETE_TIPOS, contexto: BASQUETE_CONTEXTO,
    linhas:['Handicap Pontos','Over/Under Pontos','Over/Under 1º Quarto','Pontos do Jogador (Over/Under)','Rebotes do Jogador (Over/Under)','Assistências do Jogador (Over/Under)'],
    liga_livre: false
  },
  tenis: {
    nome:'Tênis', emoji:'🎾',
    ligas:[], liga_fixa: null, times:{},
    tipos_aposta: TENIS_TIPOS, contexto: TENIS_CONTEXTO,
    linhas:['Handicap Games','Over/Under Sets','Over/Under Games','Aces do Jogador (Over/Under)','Double Faults (Over/Under)'],
    liga_livre: true
  },
  americano: {
    nome:'Futebol Americano', emoji:'🏈',
    ligas:['NFL'], liga_fixa:'NFL',
    times:{'NFL': NFL_TIMES},
    tipos_aposta: AMERICANO_TIPOS, contexto: AMERICANO_CONTEXTO,
    linhas:['Spread','Over/Under Pontos','Over/Under 1ª Metade','Jardas Passadas (Over/Under)','Jardas Corridas (Over/Under)','Recepções (Over/Under)'],
    liga_livre: false
  },
  f1: {
    nome:'Fórmula 1', emoji:'🏎️',
    ligas:['F1 — Corrida','F1 — Classificação','F1 — Sprint','F2','F3'],
    liga_fixa:'F1 — Corrida',
    pilotos: F1_PILOTOS_2026, equipes: F1_EQUIPES_2026,
    tipos_aposta: F1_TIPOS, contexto: F1_CONTEXTO,
    linhas:[], liga_livre: false
  }
};

const CASA_APOSTA_UNICA = 'Bet365';

const TAGS = [
  { value:'valor',    label:'Valor',    desc:'Edge identificado' },
  { value:'sistema',  label:'Sistema',  desc:'Parte de estratégia' },
  { value:'impulso',  label:'Impulso',  desc:'Decisão emocional' },
  { value:'tipster',  label:'Tipster',  desc:'Seguindo dica' },
  { value:'pesquisa', label:'Pesquisa', desc:'Análise aprofundada' }
];
