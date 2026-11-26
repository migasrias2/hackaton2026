# MighT · MVP (Expo)

App mobile-first em Expo (SDK 58, expo-router, TypeScript, Zustand). Dados fictícios, tudo local (sem backend).

## Correr
```bash
npm install
npx expo start          # QR code → Expo Go no telemóvel
npx expo start --web    # browser
npm run typecheck
```

## Fluxo (passos 1–6)
| Passo | Ecrã | Ficheiro | Dono |
|---|---|---|---|
| — | Início / hub | `src/app/index.tsx` | Integrador (Miguel) |
| 1 | Cria o teu MighT | `src/app/create.tsx` | Pessoa 2 |
| 2A | Manda MighT | `src/app/send.tsx` | Pessoa 3 |
| 2B | Pede MighT (link) | `src/app/ask.tsx` | Pessoa 3 |
| 2→3 | Recebidos (aceitar/recusar, 3 = desbloqueia) | `src/app/inbox.tsx` | Pessoa 3 |
| 3 | All MighT (Self vs All, pesos) | `src/app/profile.tsx` | Pessoa 3 |
| 4 | MighT Card (PNG retrato/LinkedIn) | `src/app/card.tsx` | Pessoa 4 |
| 5 | Pessoas como tu | `src/app/discover.tsx` | Integrador |
| 6 | Funções e percursos | `src/app/roles.tsx` | Integrador |

## Partilhado (avisar a equipa antes de mudar)
- `src/data/types.ts` — **contrato de dados**. Não mudar sem avisar.
- `src/lib/logic.ts` — regras: desbloqueio = 3 aceites; peso = contagem ÷ total na dimensão; semelhança = média de Σ min(pesoA, pesoB); encaixe = soma dos pesos das tags da função.
- `src/store/useMight.ts` — estado (persistido). Recíprocos chegam 5 s depois; botão "Receber 3 MighTs da sala" para a demo.
- `src/data/tags.ts`, `roles.ts`, `seed.ts` — conteúdo (Pessoa 5). Tags provisórias.
- `src/theme.ts`, `src/components/` e `assets/` — design (Pessoa 4 / logos). Trocar cores, fontes, logo (`src/components/logoBlack.ts`, `logoWhite.ts`) e figuras aqui.

## Regras
- Um ecrã por pessoa → poucos conflitos. `git pull` antes de `git push`.
- Linguagem neutra em género (ex.: "quem te conhece te vê…").
- Nenhum beco sem saída: ecrã bloqueado mostra sempre o próximo passo.
