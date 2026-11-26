// Estilo minimalista (tipo iOS). Cores da marca MighT mantidas como acentos.
export const C = {
  // Paleta (Color Hunt): #EBFFFA · #C6FCE5 · #6EF3D6 · #0DCEDA
  mint50: '#EBFFFA',
  mint100: '#C6FCE5',
  mint300: '#6EF3D6',
  teal: '#0DCEDA',      // botão principal (texto escuro por cima)
  tealInk: '#087F87',   // teal escuro para texto/acentos legíveis em branco
  onTeal: '#04363A',    // texto sobre teal
  bg: '#EBFFFA',        // fundo
  surface: '#FFFFFF',   // cartões
  dark: '#1D1D1F',      // texto principal / botão principal
  light: '#FFFFFF',
  muted: '#8E8E93',     // texto secundário
  separator: 'rgba(4,54,58,0.08)',
  fill: '#FFFFFF', // chips / inputs
  // marca
  plum: '#087F87',      // acento (= tealInk; nome antigo mantido para os ecrãs)
  darkBlue: '#144B86',
  lightBlue: '#358EC0',
  confirmed: '#3D9061',
  confirmed2: '#DBF2E5',
  superpowers: '#0A5AA9',
  superpowers2: '#A7CDF3',
  hidden: '#E88F3D',
  hidden2: '#FFE5C7',
  purpleTop: '#C87BCE',
  purpleBottom: '#3E0C42',
  blueTop: '#D1EAFF',
  blueBottom: '#023460',
  bgLight: '#A9C6DE',
  glass: '#FFFFFF',
  glassBorder: 'transparent',
};

// Cor por dimensão (Cabeça · Braço · Mão)
export const DIM_COLOR = {
  personalidade: C.superpowers,
  poder: C.hidden,
  caracter: C.confirmed,
} as const;

// Tipo de letra do sistema (SF Pro no iPhone/Mac). Só pesos.
export const W = { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' } as const;
/** @deprecated usar W (fonte do sistema) */
export const F = { regular: undefined, medium: undefined, semibold: undefined, bold: undefined, extrabold: undefined };

export const R = { sm: 12, md: 18, lg: 26, pill: 999 };

// Sombra suave tipo iOS
export const SHADOW = {
  shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 2,
} as const;
