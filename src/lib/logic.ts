// REGRAS DO BRIEFING — explicáveis, sem caixa negra.
// Desbloqueio: 3 MighTs aceites · Peso: contagem ÷ total na dimensão · Semelhança: % de peso sobreposto
import { label } from '@/data/tags';
import { Circle, DIMS, Dim, Might, Role, TagTriple } from '@/data/types';

export const UNLOCK_AT = 3;
export type Weights = Record<Dim, Record<string, number>>;

export const received = (mights: Might[]) => mights.filter((m) => m.toId === 'me');
export const accepted = (mights: Might[], circle?: Circle | null) =>
  received(mights).filter((m) => m.status === 'aceite' && (!circle || m.circle === circle));
export const pending = (mights: Might[]) => received(mights).filter((m) => m.status === 'pendente');
export const sent = (mights: Might[]) => mights.filter((m) => m.fromId === 'me');
export const isUnlocked = (mights: Might[]) => accepted(mights).length >= UNLOCK_AT;

/** Peso de cada tag = nº de vezes que aparece ÷ total de tags nessa dimensão. */
export function weightsFrom(triples: TagTriple[]): Weights {
  const w: Weights = { personalidade: {}, poder: {}, caracter: {} };
  if (!triples.length) return w;
  for (const d of DIMS) for (const t of triples) w[d][t[d]] = (w[d][t[d]] ?? 0) + 1 / triples.length;
  return w;
}

/** Semelhança = média, por dimensão, de Σ min(pesoA, pesoB). 0..1 */
export function similarity(a: Weights, b: Weights, dims: readonly Dim[] = DIMS): number {
  let s = 0;
  for (const d of dims) {
    for (const t of Object.keys(a[d])) s += Math.min(a[d][t], b[d][t] ?? 0);
  }
  return s / dims.length;
}

export function commonTags(a: Weights, b: Weights, dims: readonly Dim[] = DIMS) {
  const out: { id: string; dim: Dim; w: number }[] = [];
  for (const d of dims)
    for (const t of Object.keys(a[d])) if (b[d][t]) out.push({ id: t, dim: d, w: Math.min(a[d][t], b[d][t]) });
  return out.sort((x, y) => y.w - x.w);
}

/** A maior diferença: a tag com mais peso numa pessoa do que na outra. */
export function biggestDiff(a: Weights, b: Weights, dims: readonly Dim[] = DIMS) {
  let best: { id: string; dim: Dim; diff: number; mine: boolean } | null = null;
  for (const d of dims) {
    const ids = new Set([...Object.keys(a[d]), ...Object.keys(b[d])]);
    for (const t of ids) {
      const diff = (a[d][t] ?? 0) - (b[d][t] ?? 0);
      if (!best || Math.abs(diff) > Math.abs(best.diff)) best = { id: t, dim: d, diff, mine: diff > 0 };
    }
  }
  return best;
}

export function topTags(w: Weights, d: Dim, n = 3) {
  return Object.entries(w[d]).sort((x, y) => y[1] - x[1]).slice(0, n).map(([id, wt]) => ({ id, w: wt }));
}

/** Tag mais forte por dimensão. */
export function topTriple(w: Weights): TagTriple | null {
  const out = {} as TagTriple;
  for (const d of DIMS) {
    const t = topTags(w, d, 1)[0];
    if (!t) return null;
    out[d] = t.id;
  }
  return out;
}

/** Encaixe numa função = média, por dimensão, do peso das tags da pessoa que a função pede. */
export function roleFit(w: Weights, role: Role): number {
  let s = 0;
  for (const d of DIMS) for (const t of role.tags[d]) s += w[d][t] ?? 0;
  return s / DIMS.length;
}

export function whyFits(w: Weights, role: Role): string {
  const hits = DIMS.flatMap((d) => role.tags[d].filter((t) => w[d][t]).map((t) => label(t).toLowerCase()));
  const top = topTriple(w);
  const how = top ? `${label(top.personalidade).toLowerCase()}, com talento para ${label(top.poder).toLowerCase()}` : '';
  if (!hits.length) return `Hipótese: quem te conhece vê-te ${how}, uma base para aprender ${role.title}.`;
  return `Porque quem te conhece te vê ${how}, e ${role.title} pede ${hits.slice(0, 3).join(', ')}.`;
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;
