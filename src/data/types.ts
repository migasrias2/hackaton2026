// CONTRATO DE DADOS — fechado ao minuto 15. Alterar só depois de avisar a equipa.

export const DIMS = ['personalidade', 'poder', 'caracter'] as const;
export type Dim = (typeof DIMS)[number];

export const DIM_INFO: Record<Dim, { part: string; label: string; question: string; hint: string }> = {
  personalidade: {
    part: 'Cabeça',
    label: 'Personalidade',
    question: 'Que palavra descreve melhor a personalidade?',
    hint: 'Um adjetivo: as qualidades que tornam a pessoa única.',
  },
  poder: {
    part: 'Braço',
    label: 'Poder',
    question: 'Qual é o talento natural?',
    hint: 'Um verbo de ação: aquilo que faz com naturalidade.',
  },
  caracter: {
    part: 'Mão',
    label: 'Carácter',
    question: 'Que valor marca esta pessoa?',
    hint: 'Os traços mentais e éticos que a definem.',
  },
};

export const CIRCLES = ['familia', 'amigos', 'colegas', 'escola', 'comunidade', 'clientes'] as const;
export type Circle = (typeof CIRCLES)[number];
export const CIRCLE_LABEL: Record<Circle, string> = {
  familia: 'Família',
  amigos: 'Amigos',
  colegas: 'Colegas',
  escola: 'Escola',
  comunidade: 'Comunidade',
  clientes: 'Clientes',
};

/** Uma tag por dimensão (ids de data/tags.ts). */
export type TagTriple = Record<Dim, string>;

export type Tag = { id: string; dim: Dim; label: string; def: string };

export type MightStatus = 'pendente' | 'aceite' | 'recusado';

/** Um MighT: alguém dá 3 tags a alguém, a partir de um círculo social. */
export type Might = {
  id: string;
  fromId: string; // 'me' quando sou eu a enviar
  fromName: string;
  toId: string; // 'me' quando sou eu a receber
  toName: string;
  circle: Circle;
  tags: TagTriple;
  status: MightStatus;
  createdAt: number;
  check?: import('./profile').Answers; // validação do perfil (5 × Sim/Talvez/Não)
};

/** Pessoa fictícia da rede (dados semente). */
export type Person = {
  id: string;
  name: string; // só primeiro nome + inicial (regra de privacidade)
  roleId: string;
  self: TagTriple;
  received: { fromName: string; circle: Circle; tags: TagTriple }[];
};

/** Função/carreira com as tags que a definem. */
export type Role = {
  id: string;
  title: string;
  blurb: string;
  tags: Record<Dim, string[]>;
  next: string; // Próximo
  challenge: string; // Desafio
};

export type Me = {
  name: string;
  self: TagTriple | null;
  figure: string | null; // chave de FIGURES
  tagline: string | null;
  createdMs: number | null; // tempo até ao 1.º MighT
  answers?: import('./profile').Answers; // perguntas de entrada (autoavaliação)
};

/** Publicação "Como me sinto": foto (opcional, fica no telemóvel) + estado de espírito. */
export type Post = {
  id: string;
  personId: string; // 'me' quando é minha
  name: string;
  mood: string; // chave de FIGURES
  photo: string | null; // uri local
  note: string;
  createdAt: number;
};
