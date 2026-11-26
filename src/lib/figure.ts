// "IA" simulada: escolhe a figura e escreve a tagline a partir das 3 tags.
// Regra do briefing: cada figura mantém o estilo de UM só artista.
import { label } from '@/data/tags';
import { TagTriple } from '@/data/types';

export const FIGURES = {
  hippie: require('../../assets/figures/hippie.png'),
  'pop-art': require('../../assets/figures/pop-art.png'),
  'art-deco': require('../../assets/figures/art-deco.png'),
  'air-force': require('../../assets/figures/air-force.png'),
  matrioska: require('../../assets/figures/matrioska.png'),
  modrian: require('../../assets/figures/modrian.png'),
  'mystic-pink': require('../../assets/figures/mystic-pink.png'),
  'retro-mandala': require('../../assets/figures/retro-mandala.png'),
  surf: require('../../assets/figures/surf.png'),
  'diogo-machado': require('../../assets/figures/diogo-machado.png'),
} as const;
export type FigureKey = keyof typeof FIGURES;
export const FIGURE_BASE = require('../../assets/figures/base.png');

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function figureFor(t: TagTriple): FigureKey {
  const keys = Object.keys(FIGURES) as FigureKey[];
  return keys[hash(t.personalidade + t.poder + t.caracter) % keys.length];
}

export function taglineFor(t: TagTriple): string {
  const p = label(t.personalidade);
  const w = label(t.poder).toLowerCase();
  const c = label(t.caracter).toLowerCase();
  const templates = [
    `${p} por natureza, com ${c} como bússola. Nasceste para ${w}.`,
    `${p}, com ${c} no centro de tudo. O teu superpoder é ${w}.`,
    `Onde é preciso ${w}, apareces tu: ${p.toLowerCase()} e com ${c}.`,
  ];
  return templates[hash(p + w + c) % templates.length];
}
