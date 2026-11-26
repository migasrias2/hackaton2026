import {
  ARTISTS,
  NETWORK_QUESTIONS,
  NETWORK_ROLES,
  ORIGINALS,
  findTag,
  type Answer,
  type Dimension,
  type NetworkId,
} from "./data";

/**
 * Shared contract for the rest of the app (steps 2–6).
 * Read it with `loadSelfMight()`; it is written once onboarding finishes.
 */
export interface SelfMight {
  firstName: string;
  role?: string; // "Função / Papel" (optional)
  team?: string; // "Grupo / Equipa" (optional)
  tags: Record<Dimension, string>; // personality → head, power → body, character → arms
  network: {
    answers: Partial<Record<NetworkId, Answer>>; // the 5 social-graph questions
    role: NetworkId; // derived with networkRole()
  };
  artistId: string;
  figure: string; // image url under /public
  tagline: string; // first-person line, e.g. "I sense with my inner eye"
  bio: string; // third-person card line, e.g. "Reads the room, thinks three steps ahead…"
  source: "ai" | "library";
  createdAt: string; // ISO date
  timeToCreateMs: number; // from "Get started" to reveal
}

export type CopyInput = Pick<SelfMight, "firstName" | "role" | "team" | "tags" | "network">;

const KEY = "might:self";

export const loadSelfMight = (): SelfMight | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SelfMight) : null;
  } catch {
    return null;
  }
};
export const saveSelfMight = (m: SelfMight) => localStorage.setItem(KEY, JSON.stringify(m));
export const clearSelfMight = () => localStorage.removeItem(KEY);

/** Same three words → same Originals figure, so the figure feels "built" from the words. */
export function figureFor(artistId: string, tags: Record<Dimension, string>) {
  if (artistId !== "originals") return ARTISTS.find((a) => a.id === artistId)?.figure ?? ORIGINALS[8];
  const key = `${tags.personality}|${tags.power}|${tags.character}`;
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return ORIGINALS[h % ORIGINALS.length];
}

export function libraryCopy({ tags, network }: Pick<CopyInput, "tags" | "network">) {
  const tagline = findTag("personality", tags.personality)?.tagline ?? "I always create a way!";
  const bio = `${tags.personality} at heart, a natural ${tags.power.toLowerCase()}, guided by ${tags.character.toLowerCase()}. ${
    NETWORK_ROLES[network.role].line
  }`;
  return { tagline, bio };
}

/** Asks the dev server (Gemini) for a tagline; never throws — falls back to the word library. */
export async function generateCopy(input: CopyInput) {
  const { tags, network } = input;
  try {
    const res = await fetch("/api/tagline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: input.firstName,
        role: input.role,
        team: input.team,
        tags,
        examples: {
          personality: findTag("personality", tags.personality)?.tagline,
          power: findTag("power", tags.power)?.tagline,
          character: findTag("character", tags.character)?.tagline,
        },
        network: {
          role: NETWORK_ROLES[network.role].name,
          answers: NETWORK_QUESTIONS.filter((q) => network.answers[q.id]).map((q) => ({
            question: q.question,
            answer: network.answers[q.id],
          })),
        },
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { tagline?: string; bio?: string };
    if (!data.tagline) throw new Error("empty");
    return { tagline: data.tagline, bio: data.bio || libraryCopy(input).bio, source: "ai" as const };
  } catch {
    return { ...libraryCopy(input), source: "library" as const };
  }
}

export const haptic = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
};
