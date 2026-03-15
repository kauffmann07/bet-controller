// ─── FUTEBOL ─────────────────────────────────────────────────────────────────

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
  'Premier League': ['Manchester City FC','FC Arsenal','Chelsea FC','FC Liverpool','Tottenham Hotspur','Manchester United FC','Newcastle United','Nottingham Forest','Aston Villa FC','Crystal Palace FC','AFC Bournemouth','Brighton & Hove Albion','Brentford FC','FC Everton','FC Fulham','AFC Sunderland','Leeds United FC','Wolverhampton Wanderers','FC Burnley','Leicester City'],
  'FA Cup': ['Arsenal','Chelsea','Liverpool','Manchester City','Manchester United','Tottenham','Aston Villa','Newcastle'],
  'La Liga': ['Real Madrid CF','FC Barcelona','Atlético de Madrid','Athletic Bilbao','FC Villarreal','Real Sociedad','Real Betis Balompié','Valencia CF','Girona FC','Celta de Vigo','Sevilla FC','RCD Espanyol','Rayo Vallecano','CA Osasuna','Elche CF','Levante UD','RCD Mallorca','Getafe CF','Real Oviedo','Deportivo Alavés'],
  'Copa del Rey': ['Real Madrid','Barcelona','Atlético de Madrid','Athletic Bilbao','Real Sociedad','Betis','Valencia','Villarreal'],
  'Serie A': ['Inter de Milão','Juventus FC','AC Milan','Napoli','AS Roma','Atalanta BC','Como 1907','Bologna','ACF Fiorentina','SS Lazio','US Sassuolo','Parma Calcio 1913','Udinese Calcio','Torino FC','Genoa','Cagliari Calcio','Pisa Sporting Club','US Lecce','Hellas Verona','US Cremonese'],
  'Coppa Italia': ['Inter','Juventus','Milan','Napoli','Roma','Lazio','Atalanta','Fiorentina'],
  'Bundesliga': ['FC Bayern Munique','Borussia Dortmund','RB Leipzig','Bayer 04 Leverkusen','SG Eintracht Frankfurt','VfB Stuttgart','VfL Wolfsburg','TSG 1899 Hoffenheim','Werder Bremen','SC Freiburg','Borussia Mönchengladbach','FC Augsburg','Hamburger SV','1.FSV Mainz 05','1. FC Köln','1. FC Union Berlin','FC St. Pauli','1. FC Heidenheim 1846'],
  'DFB-Pokal': ['Bayern München','Borussia Dortmund','Bayer Leverkusen','Eintracht Frankfurt','RB Leipzig','Stuttgart'],
  'Ligue 1': ['FC Paris Saint-Germain','Olympique Marseille','AS Monaco','RC Strasbourg Alsace','LOSC Lille','Olympique Lyon','Stade Rennais FC','OGC Nice','Paris FC','RC Lens','FC Toulouse','FC Nantes','Stade Brestois 29','FC Lorient','AJ Auxerre','Le Havre AC','FC Metz','Angers SCO'],
  'Coupe de France': ['PSG','Marseille','Lyon','Monaco','Lille','Nice','Lens','Rennes'],
  'Eredivisie': ['PSV Eindhoven','Feyenoord','AFC Ajax','AZ Alkmaar','FC Utrecht','FC Twente','NEC Nijmegen','SC Heerenveen','FC Groningen','Go Ahead Eagles','Sparta Rotterdam','PEC Zwolle','Fortuna Sittard','FC Volendam','Excelsior Rotterdam','NAC Breda','Heracles Almelo','SC Telstar'],
  'KNVB Cup': ['Ajax','PSV','Feyenoord','AZ Alkmaar','Twente','Utrecht'],
  'Primeira Liga': ['Sporting CP','FC Porto','SL Benfica','SC Braga','FC Famalicão','Rio Ave Futebol Clube','CD Santa Clara','FC Arouca','GD Estoril Praia','Gil Vicente Futebol Clube','Vitória Sport Clube','Casa Pia AC','Moreirense FC','CD Nacional','Clube Desportivo Tondela','CF Estrela da Amadora','AVS Futebol','CF Os Belenenses'],
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
  'Finalizações do Jogador (Over/Under)','Passes do Jogador (Over/Under)',
  'Escanteios (Jogo)','Escanteios (Time)','Escanteios (Jogador)',
  'Cartões (Jogo)','Cartões (Time)','Cartão (Jogador)',
  'Chutes a Gol (Jogo)','Chutes a Gol (Time)','Finalizações (Jogo)',
  'Clean Sheet (Time)','Faltas (Jogo)','Faltas (Jogador)',
  'Desarmes do Jogador (Over/Under)'
];

const FUTEBOL_CONTEXTO = {
  '1X2':'jogo','Dupla Chance':'jogo','Handicap Asiático':'jogo','Handicap Europeu':'jogo',
  'Over/Under Gols':'jogo','Ambos Marcam':'jogo','Resultado Exato':'jogo',
  'Gols 1º Tempo':'jogo','Resultado ao Intervalo':'jogo','Over/Under 1º Tempo':'jogo',
  'Escanteios (Jogo)':'jogo','Cartões (Jogo)':'jogo','Chutes a Gol (Jogo)':'jogo',
  'Finalizações (Jogo)':'jogo','Faltas (Jogo)':'jogo',
  'Primeiro Gol (Jogador)':'jogador','Último Gol (Jogador)':'jogador',
  'A Qualquer Momento (Jogador)':'jogador','Gols do Jogador (Over/Under)':'jogador',
  'Assistências do Jogador (Over/Under)':'jogador','Escanteios (Jogador)':'jogador',
  'Cartão (Jogador)':'jogador','Finalizações do Jogador (Over/Under)':'jogador',
  'Passes do Jogador (Over/Under)':'jogador','Faltas (Jogador)':'jogador',
  'Desarmes do Jogador (Over/Under)':'jogador',
  'Escanteios (Time)':'time','Cartões (Time)':'time',
  'Chutes a Gol (Time)':'time','Clean Sheet (Time)':'time'
};

const FUTEBOL_LINHAS = [
  'Over/Under Gols','Over/Under 1º Tempo','Gols 1º Tempo',
  'Escanteios (Jogo)','Escanteios (Time)','Escanteios (Jogador)',
  'Cartões (Jogo)','Cartões (Time)','Chutes a Gol (Jogo)','Chutes a Gol (Time)',
  'Finalizações (Jogo)','Finalizações do Jogador (Over/Under)',
  'Passes do Jogador (Over/Under)','Faltas (Jogo)','Faltas (Jogador)',
  'Desarmes do Jogador (Over/Under)',
  'Handicap Asiático','Handicap Europeu',
  'Gols do Jogador (Over/Under)','Assistências do Jogador (Over/Under)'
];

// Tipos onde se seleciona o vencedor apostado
const FUTEBOL_VENCEDOR = {
  '1X2':           ['Casa','Empate','Fora'],
  'Dupla Chance':  ['1X','X2','12'],
  'Handicap Asiático': ['Casa','Fora'],
  'Handicap Europeu':  ['Casa','Empate','Fora'],
};

// ─── BASQUETE ─────────────────────────────────────────────────────────────────

const NBA_TIMES = ['Atlanta Hawks','Boston Celtics','Brooklyn Nets','Charlotte Hornets','Chicago Bulls','Cleveland Cavaliers','Dallas Mavericks','Denver Nuggets','Detroit Pistons','Golden State Warriors','Houston Rockets','Indiana Pacers','LA Clippers','Los Angeles Lakers','Memphis Grizzlies','Miami Heat','Milwaukee Bucks','Minnesota Timberwolves','New Orleans Pelicans','New York Knicks','Oklahoma City Thunder','Orlando Magic','Philadelphia 76ers','Phoenix Suns','Portland Trail Blazers','Sacramento Kings','San Antonio Spurs','Toronto Raptors','Utah Jazz','Washington Wizards'];

const BASQUETE_TIPOS = [
  // Jogo
  'Moneyline','Handicap Pontos','Over/Under Pontos',
  'Over/Under 1º Quarto','Over/Under 2º Quarto','Over/Under 3º Quarto','Over/Under 4º Quarto',
  'Handicap 1º Quarto','Vencedor do Quarto','Vencedor por Intervalo',
  'Maior Pontuação no Quarto',
  // Jogador — pontuação
  'Pontos do Jogador (Over/Under)',
  'Três Pontos do Jogador (Over/Under)',
  'Pontos no 1º Quarto (Over/Under)',
  // Jogador — outros stats
  'Rebotes do Jogador (Over/Under)',
  'Rebotes Ofensivos do Jogador (Over/Under)',
  'Assistências do Jogador (Over/Under)',
  'Roubos do Jogador (Over/Under)',
  'Bloqueios do Jogador (Over/Under)',
  'Lances Livres do Jogador (Over/Under)',
  'Erros do Jogador (Over/Under)',
  'Minutos do Jogador (Over/Under)',
  // Jogador — combos
  'Pts+Reb+Ast do Jogador (Over/Under)',
  'Pts+Reb do Jogador (Over/Under)',
  'Pts+Ast do Jogador (Over/Under)',
  'Reb+Ast do Jogador (Over/Under)',
  'Duplo-Duplo (Jogador)','Triplo-Duplo (Jogador)',
];

const BASQUETE_CONTEXTO = {
  'Moneyline':'jogo','Handicap Pontos':'jogo','Over/Under Pontos':'jogo',
  'Over/Under 1º Quarto':'jogo','Over/Under 2º Quarto':'jogo','Over/Under 3º Quarto':'jogo','Over/Under 4º Quarto':'jogo',
  'Handicap 1º Quarto':'jogo','Vencedor do Quarto':'jogo','Vencedor por Intervalo':'jogo',
  'Maior Pontuação no Quarto':'jogo',
  'Pontos do Jogador (Over/Under)':'jogador',
  'Três Pontos do Jogador (Over/Under)':'jogador',
  'Pontos no 1º Quarto (Over/Under)':'jogador',
  'Rebotes do Jogador (Over/Under)':'jogador',
  'Rebotes Ofensivos do Jogador (Over/Under)':'jogador',
  'Assistências do Jogador (Over/Under)':'jogador',
  'Roubos do Jogador (Over/Under)':'jogador',
  'Bloqueios do Jogador (Over/Under)':'jogador',
  'Lances Livres do Jogador (Over/Under)':'jogador',
  'Erros do Jogador (Over/Under)':'jogador',
  'Minutos do Jogador (Over/Under)':'jogador',
  'Pts+Reb+Ast do Jogador (Over/Under)':'jogador',
  'Pts+Reb do Jogador (Over/Under)':'jogador',
  'Pts+Ast do Jogador (Over/Under)':'jogador',
  'Reb+Ast do Jogador (Over/Under)':'jogador',
  'Duplo-Duplo (Jogador)':'jogador','Triplo-Duplo (Jogador)':'jogador',
};

const BASQUETE_VENCEDOR = {
  'Moneyline':       ['Casa','Fora'],
  'Handicap Pontos': ['Casa','Fora'],
  'Handicap 1º Quarto': ['Casa','Fora'],
  'Vencedor do Quarto':  ['Casa','Fora'],
  'Vencedor por Intervalo': ['Casa','Fora'],
};

// ─── TÊNIS ────────────────────────────────────────────────────────────────────

const TENIS_TIPOS = [
  // Jogo
  'Moneyline',
  'Handicap Games','Handicap Sets',
  'Over/Under Sets','Over/Under Games',
  'Over/Under Games no Set',
  'Set Correto',
  'Vencedor do 1º Set','Vencedor do 2º Set','Vencedor do Set',
  'Tiebreak no Jogo','Tiebreak no Set',
  // Jogador
  'Aces do Jogador (Over/Under)',
  'Double Faults (Over/Under)',
  'Winners do Jogador (Over/Under)',
  'Quebras de Serviço (Over/Under)',
  'Erros Não Forçados (Over/Under)',
  'Pontos de Serviço Vencidos (Over/Under)',
];

const TENIS_CONTEXTO = {
  'Moneyline':'jogo',
  'Handicap Games':'jogo','Handicap Sets':'jogo',
  'Over/Under Sets':'jogo','Over/Under Games':'jogo','Over/Under Games no Set':'jogo',
  'Set Correto':'jogo',
  'Vencedor do 1º Set':'jogo','Vencedor do 2º Set':'jogo','Vencedor do Set':'jogo',
  'Tiebreak no Jogo':'jogo','Tiebreak no Set':'jogo',
  'Aces do Jogador (Over/Under)':'jogador',
  'Double Faults (Over/Under)':'jogador',
  'Winners do Jogador (Over/Under)':'jogador',
  'Quebras de Serviço (Over/Under)':'jogador',
  'Erros Não Forçados (Over/Under)':'jogador',
  'Pontos de Serviço Vencidos (Over/Under)':'jogador',
};

const TENIS_VENCEDOR = {
  'Moneyline':          ['Jogador A','Jogador B'],
  'Vencedor do 1º Set': ['Jogador A','Jogador B'],
  'Vencedor do 2º Set': ['Jogador A','Jogador B'],
  'Vencedor do Set':    ['Jogador A','Jogador B'],
  'Handicap Games':     ['Jogador A','Jogador B'],
  'Handicap Sets':      ['Jogador A','Jogador B'],
};

// ─── FUTEBOL AMERICANO ────────────────────────────────────────────────────────

const NFL_TIMES = ['Arizona Cardinals','Atlanta Falcons','Baltimore Ravens','Buffalo Bills','Carolina Panthers','Chicago Bears','Cincinnati Bengals','Cleveland Browns','Dallas Cowboys','Denver Broncos','Detroit Lions','Green Bay Packers','Houston Texans','Indianapolis Colts','Jacksonville Jaguars','Kansas City Chiefs','Las Vegas Raiders','Los Angeles Chargers','Los Angeles Rams','Miami Dolphins','Minnesota Vikings','New England Patriots','New Orleans Saints','New York Giants','New York Jets','Philadelphia Eagles','Pittsburgh Steelers','San Francisco 49ers','Seattle Seahawks','Tampa Bay Buccaneers','Tennessee Titans','Washington Commanders'];

const AMERICANO_TIPOS = [
  // Jogo
  'Moneyline','Spread',
  'Over/Under Pontos','Over/Under 1ª Metade','Over/Under 2ª Metade',
  'Vencedor da 1ª Metade','Vencedor do 1º Quarto',
  'Over/Under Touchdowns','Over/Under Field Goals',
  'Equipe Marca Primeiro',
  // Jogador — QB
  'Jardas Passadas (Over/Under)','Touchdowns de Passe (Over/Under)',
  'Interceptações (Over/Under)',
  // Jogador — corredor/receptor
  'Jardas Corridas (Over/Under)','Recepções (Over/Under)',
  'Jardas por Recepção (Over/Under)',
  'TDs Corridos (Over/Under)',
  // Jogador — geral
  'Primeiro TD (Jogador)','Anytime TD (Jogador)',
  'Sacks do Jogador (Over/Under)',
  'Tackles+Assists do Jogador (Over/Under)',
];

const AMERICANO_CONTEXTO = {
  'Moneyline':'jogo','Spread':'jogo',
  'Over/Under Pontos':'jogo','Over/Under 1ª Metade':'jogo','Over/Under 2ª Metade':'jogo',
  'Vencedor da 1ª Metade':'jogo','Vencedor do 1º Quarto':'jogo',
  'Over/Under Touchdowns':'jogo','Over/Under Field Goals':'jogo',
  'Equipe Marca Primeiro':'jogo',
  'Jardas Passadas (Over/Under)':'jogador','Touchdowns de Passe (Over/Under)':'jogador',
  'Interceptações (Over/Under)':'jogador',
  'Jardas Corridas (Over/Under)':'jogador','Recepções (Over/Under)':'jogador',
  'Jardas por Recepção (Over/Under)':'jogador','TDs Corridos (Over/Under)':'jogador',
  'Primeiro TD (Jogador)':'jogador','Anytime TD (Jogador)':'jogador',
  'Sacks do Jogador (Over/Under)':'jogador',
  'Tackles+Assists do Jogador (Over/Under)':'jogador',
};

const AMERICANO_VENCEDOR = {
  'Moneyline':             ['Casa','Fora'],
  'Spread':                ['Casa','Fora'],
  'Vencedor da 1ª Metade': ['Casa','Fora'],
  'Vencedor do 1º Quarto': ['Casa','Fora'],
  'Equipe Marca Primeiro': ['Casa','Fora'],
};

// ─── FÓRMULA 1 ────────────────────────────────────────────────────────────────

const F1_PILOTOS_2026 = [
  'Max Verstappen','Liam Lawson',
  'George Russell','Kimi Antonelli',
  'Charles Leclerc','Lewis Hamilton',
  'Lando Norris','Oscar Piastri',
  'Fernando Alonso','Lance Stroll',
  'Pierre Gasly','Jack Doohan',
  'Alexander Albon','Carlos Sainz',
  'Yuki Tsunoda','Isack Hadjar',
  'Esteban Ocon','Oliver Bearman',
  'Nico Hülkenberg','Gabriel Bortoleto'
];

const F1_EQUIPES_2026 = ['Red Bull','Mercedes','Ferrari','McLaren','Aston Martin','Alpine','Williams','Racing Bulls','Haas','Audi'];

const F1_TIPOS = [
  'Vencedor da Corrida (Piloto)','Vencedor da Corrida (Equipe)',
  'Pole Position (Piloto)','Pole Position (Equipe)',
  'Pódio (Piloto)','Pontos Top-10 (Piloto)',
  'Melhor entre Companheiros (Piloto)',
  'Líder Após 1ª Volta (Piloto)',
  'Mais Rápido na Corrida (Piloto)',
  'Volta Mais Rápida (Piloto)',
  'DNF (Piloto)','Safety Car na Corrida',
  'Construtor Vencedor',
  'Posição de Chegada (Over/Under)',
];

const F1_CONTEXTO = {
  'Vencedor da Corrida (Piloto)':'piloto','Pole Position (Piloto)':'piloto',
  'Pódio (Piloto)':'piloto','Pontos Top-10 (Piloto)':'piloto',
  'Melhor entre Companheiros (Piloto)':'piloto_duelo',
  'Líder Após 1ª Volta (Piloto)':'piloto',
  'Mais Rápido na Corrida (Piloto)':'piloto',
  'Volta Mais Rápida (Piloto)':'piloto',
  'DNF (Piloto)':'piloto',
  'Posição de Chegada (Over/Under)':'piloto',
  'Vencedor da Corrida (Equipe)':'equipe','Pole Position (Equipe)':'equipe','Construtor Vencedor':'equipe',
  'Safety Car na Corrida':'nenhum',
};

// ─── MMA / UFC ────────────────────────────────────────────────────────────────

const MMA_ORGANIZACOES = ['UFC','Bellator','ONE Championship','PFL','RIZIN','KSW'];

const MMA_TIPOS = [
  // Vencedor
  'Vencedor da Luta',
  // Método
  'Método de Vitória — KO/TKO','Método de Vitória — Submission','Método de Vitória — Decisão',
  'Luta Vai à Decisão','Luta Termina no 1º Round','Luta Termina no 2º Round','Luta Termina no 3º Round',
  // Round/Timing
  'Round da Vitória (Over/Under)',
  'Duração da Luta (Over/Under)',
  // Props
  'Tentativas de Finalização (Over/Under)',
  'Derrubadas (Over/Under)',
  'Significant Strikes (Over/Under)',
  'Takedowns Completados (Over/Under)',
  'Knockdowns na Luta (Over/Under)',
];

const MMA_CONTEXTO = {
  'Vencedor da Luta':'luta',
  'Método de Vitória — KO/TKO':'luta',
  'Método de Vitória — Submission':'luta',
  'Método de Vitória — Decisão':'luta',
  'Luta Vai à Decisão':'luta',
  'Luta Termina no 1º Round':'luta',
  'Luta Termina no 2º Round':'luta',
  'Luta Termina no 3º Round':'luta',
  'Round da Vitória (Over/Under)':'luta_linha',
  'Duração da Luta (Over/Under)':'luta_linha',
  'Tentativas de Finalização (Over/Under)':'luta_linha',
  'Derrubadas (Over/Under)':'luta_linha',
  'Significant Strikes (Over/Under)':'luta_linha',
  'Takedowns Completados (Over/Under)':'luta_linha',
  'Knockdowns na Luta (Over/Under)':'luta_linha',
};

const MMA_VENCEDOR = {
  'Vencedor da Luta':                ['Lutador A','Lutador B'],
  'Método de Vitória — KO/TKO':      ['Lutador A','Lutador B'],
  'Método de Vitória — Submission':  ['Lutador A','Lutador B'],
  'Método de Vitória — Decisão':     ['Lutador A','Lutador B'],
  'Luta Termina no 1º Round':        ['Lutador A','Lutador B'],
  'Luta Termina no 2º Round':        ['Lutador A','Lutador B'],
  'Luta Termina no 3º Round':        ['Lutador A','Lutador B'],
};

// ─── VÔLEI ────────────────────────────────────────────────────────────────────

const VOLEI_LIGAS = [
  'Superliga Masculina','Superliga Feminina',
  'Champions League Vôlei','Campeonato Mundial',
  'Liga das Nações','Copa do Mundo Vôlei',
  'Olimpíadas','Beach Volley — World Tour'
];

const VOLEI_TIPOS = [
  // Jogo
  'Vencedor da Partida',
  'Handicap Sets','Over/Under Sets',
  'Set Correto',
  'Vencedor do 1º Set','Vencedor do 2º Set','Vencedor do 3º Set',
  // Pontos por set
  'Over/Under Pontos no Set',
  'Over/Under Pontos no 1º Set',
  'Over/Under Total de Pontos',
  // Jogador
  'Aces do Jogador (Over/Under)',
  'Erros de Saque (Over/Under)',
  'Pontos de Ataque (Over/Under)',
  'Bloqueios do Jogador (Over/Under)',
];

const VOLEI_CONTEXTO = {
  'Vencedor da Partida':'jogo',
  'Handicap Sets':'jogo','Over/Under Sets':'jogo',
  'Set Correto':'jogo',
  'Vencedor do 1º Set':'jogo','Vencedor do 2º Set':'jogo','Vencedor do 3º Set':'jogo',
  'Over/Under Pontos no Set':'jogo',
  'Over/Under Pontos no 1º Set':'jogo',
  'Over/Under Total de Pontos':'jogo',
  'Aces do Jogador (Over/Under)':'jogador',
  'Erros de Saque (Over/Under)':'jogador',
  'Pontos de Ataque (Over/Under)':'jogador',
  'Bloqueios do Jogador (Over/Under)':'jogador',
};

const VOLEI_VENCEDOR = {
  'Vencedor da Partida':  ['Casa','Fora'],
  'Vencedor do 1º Set':   ['Casa','Fora'],
  'Vencedor do 2º Set':   ['Casa','Fora'],
  'Vencedor do 3º Set':   ['Casa','Fora'],
  'Handicap Sets':        ['Casa','Fora'],
};

// ─── OBJETO PRINCIPAL ─────────────────────────────────────────────────────────

const ESPORTES = {
  futebol: {
    nome:'Futebol', emoji:'⚽',
    ligas: FUTEBOL_LIGAS, times: TIMES_FUTEBOL,
    tipos_aposta: FUTEBOL_TIPOS,
    contexto: FUTEBOL_CONTEXTO,
    linhas: FUTEBOL_LINHAS,
    vencedor: FUTEBOL_VENCEDOR,
    liga_fixa: null, liga_livre: false
  },
  basquete: {
    nome:'Basquete', emoji:'🏀',
    ligas:['NBA'], liga_fixa:'NBA',
    times:{'NBA': NBA_TIMES},
    tipos_aposta: BASQUETE_TIPOS,
    contexto: BASQUETE_CONTEXTO,
    vencedor: BASQUETE_VENCEDOR,
    linhas:[
      'Handicap Pontos','Handicap 1º Quarto',
      'Over/Under Pontos','Over/Under 1º Quarto','Over/Under 2º Quarto','Over/Under 3º Quarto','Over/Under 4º Quarto',
      'Pontos do Jogador (Over/Under)','Três Pontos do Jogador (Over/Under)','Pontos no 1º Quarto (Over/Under)',
      'Rebotes do Jogador (Over/Under)','Rebotes Ofensivos do Jogador (Over/Under)',
      'Assistências do Jogador (Over/Under)','Roubos do Jogador (Over/Under)','Bloqueios do Jogador (Over/Under)',
      'Lances Livres do Jogador (Over/Under)','Erros do Jogador (Over/Under)','Minutos do Jogador (Over/Under)',
      'Pts+Reb+Ast do Jogador (Over/Under)','Pts+Reb do Jogador (Over/Under)',
      'Pts+Ast do Jogador (Over/Under)','Reb+Ast do Jogador (Over/Under)',
    ],
    liga_livre: false
  },
  tenis: {
    nome:'Tênis', emoji:'🎾',
    ligas:[], liga_fixa: null, times:{},
    tipos_aposta: TENIS_TIPOS,
    contexto: TENIS_CONTEXTO,
    vencedor: TENIS_VENCEDOR,
    linhas:[
      'Handicap Games','Handicap Sets',
      'Over/Under Sets','Over/Under Games','Over/Under Games no Set',
      'Aces do Jogador (Over/Under)','Double Faults (Over/Under)',
      'Winners do Jogador (Over/Under)','Quebras de Serviço (Over/Under)',
      'Erros Não Forçados (Over/Under)','Pontos de Serviço Vencidos (Over/Under)',
    ],
    liga_livre: true
  },
  americano: {
    nome:'Futebol Americano', emoji:'🏈',
    ligas:['NFL'], liga_fixa:'NFL',
    times:{'NFL': NFL_TIMES},
    tipos_aposta: AMERICANO_TIPOS,
    contexto: AMERICANO_CONTEXTO,
    vencedor: AMERICANO_VENCEDOR,
    linhas:[
      'Spread',
      'Over/Under Pontos','Over/Under 1ª Metade','Over/Under 2ª Metade',
      'Over/Under Touchdowns','Over/Under Field Goals',
      'Jardas Passadas (Over/Under)','Touchdowns de Passe (Over/Under)','Interceptações (Over/Under)',
      'Jardas Corridas (Over/Under)','Recepções (Over/Under)',
      'Jardas por Recepção (Over/Under)','TDs Corridos (Over/Under)',
      'Sacks do Jogador (Over/Under)','Tackles+Assists do Jogador (Over/Under)',
    ],
    liga_livre: false
  },
  f1: {
    nome:'Fórmula 1', emoji:'🏎️',
    ligas:['F1 — Corrida','F1 — Classificação','F1 — Sprint','F2','F3'],
    liga_fixa:'F1 — Corrida',
    pilotos: F1_PILOTOS_2026, equipes: F1_EQUIPES_2026,
    tipos_aposta: F1_TIPOS,
    contexto: F1_CONTEXTO,
    vencedor: {},
    linhas:['Posição de Chegada (Over/Under)'],
    liga_livre: false
  },
  mma: {
    nome:'MMA / UFC', emoji:'🥊',
    ligas: MMA_ORGANIZACOES, liga_fixa: null,
    times: {},
    tipos_aposta: MMA_TIPOS,
    contexto: MMA_CONTEXTO,
    vencedor: MMA_VENCEDOR,
    linhas:[
      'Round da Vitória (Over/Under)','Duração da Luta (Over/Under)',
      'Tentativas de Finalização (Over/Under)','Derrubadas (Over/Under)',
      'Significant Strikes (Over/Under)','Takedowns Completados (Over/Under)',
      'Knockdowns na Luta (Over/Under)',
    ],
    liga_livre: false
  },
  volei: {
    nome:'Vôlei', emoji:'🏐',
    ligas: VOLEI_LIGAS, liga_fixa: null,
    times: {},
    tipos_aposta: VOLEI_TIPOS,
    contexto: VOLEI_CONTEXTO,
    vencedor: VOLEI_VENCEDOR,
    linhas:[
      'Handicap Sets','Over/Under Sets',
      'Over/Under Pontos no Set','Over/Under Pontos no 1º Set','Over/Under Total de Pontos',
      'Aces do Jogador (Over/Under)','Erros de Saque (Over/Under)',
      'Pontos de Ataque (Over/Under)','Bloqueios do Jogador (Over/Under)',
    ],
    liga_livre: false
  },
};

const CASA_APOSTA_UNICA = 'Bet365';

const TAGS = [
  { value:'valor',    label:'🎯 Valor',    desc:'Valor' },
  { value:'tip',  label:'📡 Tip',  desc:'Tip' }
];
