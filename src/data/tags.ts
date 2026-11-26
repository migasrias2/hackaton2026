import { Dim, Tag } from './types';

// PROVISÓRIO: substituir pela Biblioteca de palavras do Drive (04. MighT Word Library).
// Personalidade = adjetivos neutros em género; Poder = verbos; Carácter = valores.
const raw: Record<Dim, [string, string][]> = {
  personalidade: [
    ['Adaptável', 'Ajusta-se depressa a pessoas e contextos novos.'],
    ['Audaz', 'Arrisca quando os outros hesitam.'],
    ['Entusiasta', 'Contagia os outros com energia.'],
    ['Exigente', 'Não se contenta com o suficiente.'],
    ['Idealista', 'Move-se por uma visão de como as coisas deviam ser.'],
    ['Independente', 'Avança sem precisar de instruções.'],
    ['Inteligente', 'Percebe depressa o essencial.'],
    ['Irreverente', 'Questiona o óbvio com humor.'],
    ['Otimista', 'Vê a possibilidade antes do problema.'],
    ['Paciente', 'Dá tempo às pessoas e às coisas.'],
    ['Perspicaz', 'Vê o que os outros não veem.'],
    ['Persistente', 'Não desiste à primeira.'],
    ['Sensível', 'Repara no que os outros sentem.'],
    ['Sociável', 'Liga-se facilmente às pessoas.'],
    ['Versátil', 'Faz bem coisas muito diferentes.'],
  ],
  poder: [
    ['Analisar', 'Transforma dados e factos em conclusões.'],
    ['Comunicar', 'Explica de forma clara e cativante.'],
    ['Construir', 'Põe coisas de pé, do zero.'],
    ['Criar', 'Inventa ideias, formas e soluções novas.'],
    ['Cuidar', 'Faz os outros sentirem-se bem.'],
    ['Decidir', 'Escolhe um caminho quando é preciso.'],
    ['Ensinar', 'Faz os outros aprender.'],
    ['Inovar', 'Muda a forma como as coisas se fazem.'],
    ['Liderar', 'Mobiliza pessoas para um objetivo.'],
    ['Negociar', 'Encontra acordos onde parecia não haver.'],
    ['Organizar', 'Põe ordem no caos.'],
    ['Planear', 'Vê os passos antes de os dar.'],
    ['Resolver', 'Desfaz problemas difíceis.'],
    ['Unir', 'Junta pessoas diferentes.'],
    ['Vender', 'Faz os outros acreditar numa ideia.'],
  ],
  caracter: [
    ['Coragem', 'Faz o que está certo, mesmo quando custa.'],
    ['Empatia', 'Põe-se no lugar do outro.'],
    ['Generosidade', 'Dá sem esperar nada em troca.'],
    ['Gratidão', 'Reconhece o que recebe.'],
    ['Honestidade', 'Diz a verdade, mesmo a difícil.'],
    ['Humildade', 'Não se põe acima dos outros.'],
    ['Integridade', 'É igual quando ninguém está a ver.'],
    ['Justiça', 'Trata todos com equidade.'],
    ['Lealdade', 'Está lá quando é preciso.'],
    ['Liberdade', 'Defende a autonomia, a sua e a dos outros.'],
    ['Resiliência', 'Levanta-se depois de cair.'],
    ['Respeito', 'Valoriza cada pessoa.'],
    ['Responsabilidade', 'Assume o que faz.'],
    ['Rigor', 'Faz bem feito, ao pormenor.'],
    ['Transparência', 'Não tem agendas escondidas.'],
  ],
};

const slug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const TAGS: Tag[] = (Object.keys(raw) as Dim[]).flatMap((dim) =>
  raw[dim].map(([label, def]) => ({ id: `${dim[0]}-${slug(label)}`, dim, label, def })),
);

export const TAG_BY_ID: Record<string, Tag> = Object.fromEntries(TAGS.map((t) => [t.id, t]));
export const tagsOf = (dim: Dim) => TAGS.filter((t) => t.dim === dim);
export const label = (id: string) => TAG_BY_ID[id]?.label ?? id;
/** Atalho: tag('Curioso','personalidade') → id */
export const tagId = (dim: Dim, lbl: string) => `${dim[0]}-${slug(lbl)}`;
