import { ROLES } from './roles';
import { tagsOf } from './tags';
import { CIRCLES, Circle, DIMS, Person, TagTriple } from './types';

// Dados FICTÍCIOS e determinísticos (mesma semente = mesmos dados em todos os telemóveis).
// PROVISÓRIO: pode ser trocado pelos "30 pessoas / 90 MighTs" do Drive mantendo o tipo Person.

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(2026);
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)];

const NAMES = [
  'Ana R.', 'Bruno M.', 'Carla S.', 'Diogo V.', 'Eva L.', 'Filipe C.', 'Inês P.', 'João A.',
  'Joana F.', 'Leonor T.', 'Luís G.', 'Mafalda B.', 'Marta N.', 'Miguel D.', 'Nuno R.', 'Patrícia O.',
  'Pedro H.', 'Rita C.', 'Rui F.', 'Sara M.', 'Sofia A.', 'Tiago F.', 'Vasco P.', 'Beatriz Q.',
  'Gonçalo E.', 'Helena J.', 'Ricardo V.', 'Teresa K.', 'André Z.', 'Catarina I.',
];

/** Tags com viés para a função da pessoa (70%), resto aleatório. */
function triFor(roleIdx: number): TagTriple {
  const role = ROLES[roleIdx];
  const out = {} as TagTriple;
  for (const d of DIMS) out[d] = rand() < 0.7 ? pick(role.tags[d]) : pick(tagsOf(d)).id;
  return out;
}

export const PEOPLE: Person[] = NAMES.map((name, i) => {
  const roleIdx = i % ROLES.length;
  const n = 3 + Math.floor(rand() * 4); // 3–6 MighTs recebidos → 30 pessoas, ~135 MighTs
  return {
    id: `p${i + 1}`,
    name,
    roleId: ROLES[roleIdx].id,
    self: triFor(roleIdx),
    received: Array.from({ length: n }, () => ({
      fromName: pick(NAMES),
      circle: pick(CIRCLES) as Circle,
      tags: triFor(roleIdx),
    })),
  };
});

export const PERSON_BY_ID: Record<string, Person> = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

/** Para a simulação: tags "plausíveis" a partir de uma função aleatória. */
export function randomTriple(): TagTriple {
  return triFor(Math.floor(Math.random() * ROLES.length));
}
