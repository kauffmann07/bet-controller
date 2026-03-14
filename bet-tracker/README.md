# BetTracker 🎯

Controle pessoal de apostas esportivas. Site estático 100% client-side — roda no GitHub Pages, banco de dados local no navegador via IndexedDB (Dexie.js).

## Funcionalidades

- **Dashboard** — saldo, ROI, win rate, streak, gráficos de bankroll e lucro diário, heatmap por dia da semana
- **Nova Aposta** — formulário em 3 passos, suporte a apostas simples e acumuladas/múltiplas
- **Histórico** — tabela filtrável, ordenável, paginada, com exportação CSV/JSON e importação para backup
- **Análises** — ROI e win rate por esporte, liga, tipo de aposta, casa de aposta, faixa de odd, tag e confiança
- **Banca** — calculadora de stake, stop loss diário/mensal, meta mensal, alertas automáticos, depósitos e saques

## Esportes configurados

- ⚽ Futebol (Premier League, Brasileirão, Champions League, Libertadores, etc.)
- 🏀 Basquete (NBA, NBB, Euroliga, NCAA)
- 🎾 Tênis (ATP, WTA, Grand Slam)
- 🏈 Futebol Americano (NFL, NCAA)
- 🏎️ Fórmula 1 (corrida, quali, sprint)

## Como usar no GitHub Pages

1. Crie um repositório no GitHub (pode ser privado)
2. Faça upload de todos os arquivos desta pasta
3. Vá em Settings → Pages → Source: main branch / root
4. Acesse `https://seu-usuario.github.io/nome-do-repo`

> **Os dados ficam no seu navegador** (IndexedDB). Use Exportar JSON regularmente para backup.

## Estrutura de arquivos

```
bet-tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── db.js          — banco de dados (Dexie/IndexedDB)
│   ├── app.js         — roteador SPA e utilitários
│   ├── dashboard.js   — tela inicial
│   ├── form.js        — formulário de apostas
│   ├── historico.js   — tabela de histórico
│   ├── analises.js    — gráficos e análises
│   └── banca.js       — gestão de bankroll e config
└── data/
    └── esportes.js    — esportes, ligas e tipos de aposta
```

## Adicionar esportes ou ligas

Edite `data/esportes.js` — o formato é auto-explicativo. Adicione uma nova chave em `ESPORTES` ou insira uma liga no array `ligas` de um esporte existente.

## Tecnologias

- HTML + CSS + JavaScript vanilla (sem frameworks)
- [Dexie.js](https://dexie.org/) — wrapper para IndexedDB
- [Chart.js](https://www.chartjs.org/) — gráficos
- Fontes: JetBrains Mono + Syne (Google Fonts)
