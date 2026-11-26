import { tagId as t } from './tags';
import { Role } from './types';

// PROVISÓRIO: substituir/complementar com a Tabela tag-função do Drive.
const P = (s: string) => t('personalidade', s);
const W = (s: string) => t('poder', s);
const K = (s: string) => t('caracter', s);

export const ROLES: Role[] = [
  { id: 'pm', title: 'Product Manager', blurb: 'Decide o que se constrói e porquê.',
    tags: { personalidade: [P('Perspicaz'), P('Adaptável'), P('Exigente')], poder: [W('Decidir'), W('Planear'), W('Unir')], caracter: [K('Responsabilidade'), K('Transparência')] },
    next: 'Head of Product', challenge: 'Fundar um produto próprio' },
  { id: 'ux', title: 'UX/Product Designer', blurb: 'Desenha experiências a partir das pessoas.',
    tags: { personalidade: [P('Sensível'), P('Idealista'), P('Irreverente')], poder: [W('Criar'), W('Inovar'), W('Analisar')], caracter: [K('Empatia'), K('Rigor')] },
    next: 'Design Lead', challenge: 'Service Designer em saúde pública' },
  { id: 'data', title: 'Data Analyst', blurb: 'Encontra a história escondida nos números.',
    tags: { personalidade: [P('Inteligente'), P('Paciente'), P('Perspicaz')], poder: [W('Analisar'), W('Resolver'), W('Organizar')], caracter: [K('Rigor'), K('Honestidade')] },
    next: 'Data Scientist', challenge: 'Analytics Lead de uma equipa de produto' },
  { id: 'eng', title: 'Software Engineer', blurb: 'Constrói o que os outros imaginam.',
    tags: { personalidade: [P('Persistente'), P('Independente'), P('Inteligente')], poder: [W('Construir'), W('Resolver'), W('Inovar')], caracter: [K('Rigor'), K('Responsabilidade')] },
    next: 'Tech Lead', challenge: 'CTO de uma startup' },
  { id: 'mkt', title: 'Marketing & Marca', blurb: 'Dá voz e imagem a uma ideia.',
    tags: { personalidade: [P('Entusiasta'), P('Irreverente'), P('Versátil')], poder: [W('Comunicar'), W('Criar'), W('Vender')], caracter: [K('Liberdade'), K('Coragem')] },
    next: 'Brand Manager', challenge: 'Diretor criativo' },
  { id: 'sales', title: 'Vendas & Parcerias', blurb: 'Abre portas e fecha acordos.',
    tags: { personalidade: [P('Sociável'), P('Audaz'), P('Otimista')], poder: [W('Vender'), W('Negociar'), W('Comunicar')], caracter: [K('Resiliência'), K('Lealdade')] },
    next: 'Key Account Manager', challenge: 'Abrir um mercado novo' },
  { id: 'people', title: 'People & Culture', blurb: 'Cuida de quem faz a empresa.',
    tags: { personalidade: [P('Sensível'), P('Sociável'), P('Paciente')], poder: [W('Cuidar'), W('Unir'), W('Ensinar')], caracter: [K('Empatia'), K('Justiça'), K('Respeito')] },
    next: 'Talent Lead', challenge: 'Chief People Officer' },
  { id: 'teach', title: 'Formador/Professor', blurb: 'Faz os outros crescer.',
    tags: { personalidade: [P('Paciente'), P('Entusiasta'), P('Adaptável')], poder: [W('Ensinar'), W('Comunicar'), W('Cuidar')], caracter: [K('Generosidade'), K('Respeito')] },
    next: 'Coordenador pedagógico', challenge: 'Criar um curso online próprio' },
  { id: 'consult', title: 'Consultor de Estratégia', blurb: 'Ajuda organizações a decidir.',
    tags: { personalidade: [P('Inteligente'), P('Exigente'), P('Versátil')], poder: [W('Analisar'), W('Planear'), W('Decidir')], caracter: [K('Integridade'), K('Rigor')] },
    next: 'Manager de consultoria', challenge: 'Estratégia num organismo internacional' },
  { id: 'ops', title: 'Gestor de Operações', blurb: 'Faz as coisas acontecer a tempo.',
    tags: { personalidade: [P('Persistente'), P('Exigente'), P('Paciente')], poder: [W('Organizar'), W('Planear'), W('Resolver')], caracter: [K('Responsabilidade'), K('Lealdade')] },
    next: 'Diretor de Operações', challenge: 'Gerir operações num mercado novo' },
  { id: 'founder', title: 'Empreendedor', blurb: 'Começa algo que ainda não existe.',
    tags: { personalidade: [P('Audaz'), P('Otimista'), P('Independente')], poder: [W('Inovar'), W('Liderar'), W('Vender')], caracter: [K('Coragem'), K('Resiliência'), K('Liberdade')] },
    next: 'Founder com equipa', challenge: 'Escalar para outro país' },
  { id: 'community', title: 'Community Manager', blurb: 'Junta pessoas à volta de uma causa.',
    tags: { personalidade: [P('Sociável'), P('Entusiasta'), P('Idealista')], poder: [W('Unir'), W('Comunicar'), W('Cuidar')], caracter: [K('Generosidade'), K('Gratidão')] },
    next: 'Head of Community', challenge: 'Lançar um movimento social' },
  { id: 'cs', title: 'Customer Success', blurb: 'Garante que o cliente ganha.',
    tags: { personalidade: [P('Paciente'), P('Otimista'), P('Adaptável')], poder: [W('Cuidar'), W('Resolver'), W('Negociar')], caracter: [K('Empatia'), K('Lealdade')] },
    next: 'Customer Success Lead', challenge: 'Desenhar a experiência do cliente de raiz' },
  { id: 'lead', title: 'Team Lead', blurb: 'Leva uma equipa mais longe.',
    tags: { personalidade: [P('Perspicaz'), P('Otimista'), P('Adaptável')], poder: [W('Liderar'), W('Decidir'), W('Unir')], caracter: [K('Justiça'), K('Humildade'), K('Coragem')] },
    next: 'Head of Department', challenge: 'Liderar uma transformação' },
];

export const ROLE_BY_ID: Record<string, Role> = Object.fromEntries(ROLES.map((r) => [r.id, r]));
