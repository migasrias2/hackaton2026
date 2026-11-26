// Kit de marca MighT (10. Visual identity/Colors/1. COLOR GUIDE.jpg)
export const C = {
  dark: '#1C1E28',
  light: '#FFFFFF',
  plum: '#753065', // botões, texto secundário
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
  glass: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.8)',
  muted: '#5B6070',
};

// Cor por dimensão (Cabeça · Braço · Mão)
export const DIM_COLOR = {
  personalidade: C.superpowers,
  poder: C.hidden,
  caracter: C.confirmed,
} as const;

export const F = {
  regular: 'Mona-Regular',
  medium: 'Mona-Medium',
  semibold: 'Mona-SemiBold',
  bold: 'Mona-Bold',
  extrabold: 'Mona-ExtraBold',
};

export const R = { sm: 10, md: 16, lg: 24, pill: 999 };
