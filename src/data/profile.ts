// Perfil no grafo social: 5 tags (Sim / Talvez / Não). Fonte: "Perguntas de entrada do app.pdf",
// "Validação de Perfil por Amigos.pdf" e "Versão final com as respostas.pdf".

export type Answer = 'sim' | 'talvez' | 'nao';
export type Answers = Answer[]; // 5 respostas, pela ordem de PROFILE_QS

export const ANSWER_LABEL: Record<Answer, string> = { sim: 'Sim', talvez: 'Talvez', nao: 'Não' };
export const ANSWERS: Answer[] = ['sim', 'talvez', 'nao'];
const SCORE: Record<Answer, number> = { sim: 2, talvez: 1, nao: 0 };

export const PROFILE_QS = [
  {
    tag: 'Centralidade & Referência',
    self: 'As pessoas procuram-te muitas vezes para tirar dúvidas ou pedir ajuda?',
    peer: (n: string) => `As pessoas procuram ${n} muitas vezes para tirar dúvidas ou pedir ajuda?`,
    profile: 'Hub / Referência',
    desc: 'Polo de atração: muitos te procuram para consulta e influência.',
  },
  {
    tag: 'Ponte & Transversalidade',
    self: 'Falas regularmente com pessoas de outros grupos e equipas?',
    peer: (n: string) => `${n} fala regularmente com pessoas de outros grupos e equipas?`,
    profile: 'Conector / Ponte',
    desc: 'Ligas grupos diferentes e evitas que se fechem em silos.',
  },
  {
    tag: 'Iniciativa & Divulgação',
    self: 'Costumas tomar a iniciativa de contactar e envolver outros colegas?',
    peer: (n: string) => `${n} costuma tomar a iniciativa de contactar e envolver outros colegas?`,
    profile: 'Divulgador / Apoiante',
    desc: 'Tomas a iniciativa e envolves os outros nas conversas.',
  },
  {
    tag: 'Reciprocidade & Facilitação',
    self: 'Respondes sempre às mensagens e ajudas a alinhar as equipas?',
    peer: (n: string) => `${n} responde sempre às mensagens e ajuda a alinhar as equipas?`,
    profile: 'Facilitador / Coesão',
    desc: 'Respondes, medeias e manténs as equipas alinhadas.',
  },
  {
    tag: 'Silo & Observação',
    self: 'Interages sobretudo com o teu grupo direto ou preferes ficar em segundo plano?',
    peer: (n: string) => `${n} interage sobretudo com o seu grupo direto ou prefere ficar em segundo plano?`,
    profile: 'Especialista / Observador',
    desc: 'Focas-te no teu grupo e observas antes de entrar.',
  },
] as const;

/**
 * Regra: Sim = 2, Talvez = 1, Não = 0 (ou a média, nas respostas dos amigos).
 * Ganha a tag 1–4 com mais pontos (empate → a primeira). Se nenhuma chega a pontos > 0,
 * ou a tag 5 (Silo) tem mais pontos que a vencedora, o perfil é Especialista / Observador.
 */
export function profileIndex(scores: number[]): number {
  let best = 0;
  for (let i = 1; i < 4; i++) if (scores[i] > scores[best]) best = i;
  return scores[best] === 0 || scores[4] > scores[best] ? 4 : best;
}

export const scoresOf = (a: Answers) => a.map((x) => SCORE[x]);

/** Média dos amigos por pergunta (0–2). */
export function peerScores(list: Answers[]): number[] | null {
  if (!list.length) return null;
  return PROFILE_QS.map((_, i) => list.reduce((s, a) => s + SCORE[a[i]], 0) / list.length);
}

export const profileOf = (a: Answers) => PROFILE_QS[profileIndex(scoresOf(a))];

export const randomAnswers = (): Answers =>
  PROFILE_QS.map((_, i) => {
    const r = Math.random();
    // Amigos tendem a dizer "Sim" nas tags 1–4 e "Não" no silo.
    return i < 4 ? (r < 0.5 ? 'sim' : r < 0.8 ? 'talvez' : 'nao') : r < 0.2 ? 'sim' : r < 0.5 ? 'talvez' : 'nao';
  });
