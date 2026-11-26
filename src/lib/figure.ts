// "IA" simulada: escolhe a figura e escreve a tagline a partir das 3 tags.
// Regra do briefing: cada figura mantém o estilo de UM só artista.
import { label } from '@/data/tags';
import { TagTriple } from '@/data/types';

// Personagens do Rodrigo (assets/emotes/personagens, reduzidas a 512 px).
export const FIGURES = {
  alegria: require('../../assets/figures/alegria.png'),
  amor: require('../../assets/figures/amor.png'),
  autoconfianca: require('../../assets/figures/autoconfianca.png'),
  entusiasmo: require('../../assets/figures/entusiasmo.png'),
  frieza: require('../../assets/figures/frieza.png'),
  nojo: require('../../assets/figures/nojo.png'),
  raiva: require('../../assets/figures/raiva.png'),
  serenidade: require('../../assets/figures/serenidade.png'),
  tristeza: require('../../assets/figures/tristeza.png'),
} as const;
export type FigureKey = keyof typeof FIGURES;
export const FIGURE_BASE = FIGURES.alegria;

/** A figura sai da tag de Personalidade (a "cabeça") escolhida. */
const BY_PERSONALITY: Record<string, FigureKey> = {
  'Adaptável': 'serenidade', 'Paciente': 'serenidade',
  'Audaz': 'autoconfianca', 'Perspicaz': 'autoconfianca',
  'Entusiasta': 'entusiasmo', 'Versátil': 'entusiasmo',
  'Exigente': 'raiva', 'Persistente': 'raiva',
  'Idealista': 'amor',
  'Independente': 'frieza', 'Inteligente': 'frieza',
  'Irreverente': 'nojo',
  'Otimista': 'alegria', 'Sociável': 'alegria',
  'Sensível': 'tristeza',
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function figureFor(t: TagTriple): FigureKey {
  const hit = BY_PERSONALITY[label(t.personalidade)];
  if (hit) return hit;
  const keys = Object.keys(FIGURES) as FigureKey[];
  return keys[hash(t.personalidade) % keys.length];
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
