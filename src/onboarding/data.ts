// Source: CASE ASSETS/04. MighT Word Library (Tags) — official tags + taglines (EN).
export type Dimension = "personality" | "power" | "character";

export interface Tag {
  label: string;
  tagline: string;
  featured?: boolean;
}

const t = (label: string, tagline: string, featured = false): Tag => ({ label, tagline, featured });

export const DIMENSIONS: Record<
  Dimension,
  { title: string; part: string; question: string; hint: string; tags: Tag[] }
> = {
  personality: {
    title: "Personality",
    part: "Head",
    question: "Which word best describes your personality?",
    hint: "An adjective — what makes you, you.",
    tags: [
      t("Adaptable", "I always create a way!", true),
      t("Clever", "My brain is bigger than yours", true),
      t("Competitive", "Now let's race!"),
      t("Confident", "I can talk about that!"),
      t("Curious", "Let me take a look at that", true),
      t("Extroverted", "Hello everyone!!", true),
      t("Humorous", "It's always funny", true),
      t("Imaginative", "My head is filled with this"),
      t("Intelligent", "Just think about it"),
      t("Intuitive", "I sense with my inner eye"),
      t("Logical", "Left, right, up, down… that makes sense", true),
      t("Objective", "Focused and centered"),
      t("Optimistic", "Forward with a smile", true),
      t("Passionate", "Filled with love", true),
      t("People oriented", "I'm at home with anyone"),
      t("Persuasive", "Look at me. Now do it my way"),
      t("Practical", "Anything, anywhere, it's ok"),
      t("Sensitive", "Handle with care", true),
      t("Wise", "With the knowledge of the ages", true),
    ],
  },
  power: {
    title: "Power",
    part: "Body",
    question: "What's your natural talent?",
    hint: "An action — what you do best without trying.",
    tags: [
      t("Achiever", "The road was hard, but here I am"),
      t("Advisor", "Follow my advice and you shall succeed"),
      t("Analyzer", "Let's take a closer look"),
      t("Communicator", "I know how to talk so that people listen", true),
      t("Composer", "Putting everything together, with harmony"),
      t("Conceptualizer", "I'll conceive a plan"),
      t("Connector", "Just connect the dots", true),
      t("Creator", "The high being of all things still undone", true),
      t("Developer", "Developing, creating and rising"),
      t("Encourager", "Gooo!!!"),
      t("Energizer", "Filled with inner power", true),
      t("Entertainer", "Fun, cool and social"),
      t("Entrepreneur", "E-Power"),
      t("Explorer", "Find me everywhere", true),
      t("Illustrator", "Drawing, creating, painting, what else?!"),
      t("Influencer", "Listen to what I say"),
      t("Innovator", "I just thought of something new!", true),
      t("Investigator", "Let me check that out"),
      t("Leader", "People follow me", true),
      t("Learner", "Back to school!"),
      t("Moderator", "Wait… is that right? What do you have to say?"),
      t("Organizer", "Everything has a place and that's how it works", true),
      t("Planner", "This goes here, that goes there"),
      t("Solver", "So many questions… I have even more answers"),
      t("Strategizer", "Let's make a plan", true),
      t("Translator", "From this, to that, easy!"),
      t("Writer", "A pen is a sword, and I have many"),
    ],
  },
  character: {
    title: "Character",
    part: "Arms",
    question: "Which value guides you?",
    hint: "A value — what you stand for.",
    tags: [
      t("Altruism", "It's you and me… and all of us"),
      t("Collaboration", "Let's do it together", true),
      t("Compassion", "I'll give you my heart", true),
      t("Courage", "As a warrior", true),
      t("Discipline", "Like in the army"),
      t("Freedom", "I have invisible wings", true),
      t("Generosity", "My hand is open to give", true),
      t("Humility", "My simple robes are as my simple soul", true),
      t("Integrity", "Like the white knight", true),
      t("Maturity", "Trees grow slow, but strong"),
      t("Persistence", "I'll get it… I'll get it!", true),
      t("Responsibility", "A messed up… but beautiful burden", true),
      t("Sincerity", "The truth… always", true),
      t("Solidarity", "Holding and reaching each other"),
      t("Tolerance", "One amongst many"),
    ],
  },
};

export const DIMENSION_ORDER: Dimension[] = ["personality", "power", "character"];

export const findTag = (d: Dimension, label: string) =>
  DIMENSIONS[d].tags.find((x) => x.label === label);

// Source: "Perguntas de entrada do app" — Matriz Reduzida: 5 tags do grafo social (Sim / Talvez / Não).
export type Answer = "yes" | "maybe" | "no";
export type NetworkId = "centrality" | "bridge" | "initiative" | "reciprocity" | "silo";

export const NETWORK_QUESTIONS: { id: NetworkId; tag: string; question: string }[] = [
  { id: "centrality", tag: "Centrality & Reference", question: "Do people often come to you with questions or for help?" },
  { id: "bridge", tag: "Bridge & Cross-team", question: "Do you regularly talk with people from other groups and teams?" },
  { id: "initiative", tag: "Initiative & Outreach", question: "Do you usually take the initiative to reach out and involve others?" },
  { id: "reciprocity", tag: "Reciprocity & Facilitation", question: "Do you always reply when contacted, and help teams get aligned?" },
  { id: "silo", tag: "Silo & Observation", question: "Do you mostly stick to your own group, or prefer to stay low-key?" },
];

export const NETWORK_ROLES: Record<NetworkId, { name: string; line: string }> = {
  centrality: { name: "The Go-To", line: "People come to you for answers." },
  bridge: { name: "The Bridge", line: "You connect teams that rarely talk." },
  initiative: { name: "The Spark", line: "You reach out first and pull people in." },
  reciprocity: { name: "The Facilitator", line: "You answer, align and keep teams in sync." },
  silo: { name: "The Observer", line: "You go deep with your circle and watch before you act." },
};

const SCORE: Record<Answer, number> = { yes: 2, maybe: 1, no: 0 };

/** Highest-scoring connector trait wins (ties → question order); the Observer only wins outright. */
export function networkRole(answers: Partial<Record<NetworkId, Answer>>): NetworkId {
  const order: NetworkId[] = ["centrality", "bridge", "initiative", "reciprocity"];
  let best: NetworkId = "reciprocity";
  let top = -1;
  for (const id of order) {
    const s = SCORE[answers[id] ?? "no"];
    if (s > top) {
      top = s;
      best = id;
    }
  }
  return SCORE[answers.silo ?? "no"] > top ? "silo" : best;
}

// Source: CASE ASSETS/05. Figure Art Kit. Each figure keeps a single artist's style.
export interface Artist {
  id: string;
  name: string;
  blurb: string;
  figure: string; // for "originals" the figure is picked from the series by the three words
}

export const ORIGINALS = Array.from({ length: 9 }, (_, i) => `/figures/original-${i + 1}.webp`);

export const ARTISTS: Artist[] = [
  { id: "originals", name: "MighT Originals", blurb: "Your words pick the pattern", figure: ORIGINALS[8] },
  { id: "diogo-machado", name: "Diogo Machado", blurb: "Hearts & ornament", figure: "/figures/diogo-machado.webp" },
  { id: "pop-art", name: "Pop Art", blurb: "Loud, graphic, fearless", figure: "/figures/pop-art.webp" },
  { id: "retro-mandala", name: "Retro Mandala", blurb: "Warm folk geometry", figure: "/figures/retro-mandala.webp" },
  { id: "mystic-pink", name: "Mystic Pink", blurb: "Soft, bold, magnetic", figure: "/figures/mystic-pink.webp" },
  { id: "modrian", name: "Mondrian", blurb: "Primary colour blocks", figure: "/figures/modrian.webp" },
  { id: "art-deco", name: "Art Deco", blurb: "Gilded symmetry", figure: "/figures/art-deco.webp" },
  { id: "matrioska", name: "Matrioska", blurb: "Painted folk tale", figure: "/figures/matrioska.webp" },
  { id: "hippie", name: "Hippie", blurb: "Flower-power swirls", figure: "/figures/hippie.webp" },
  { id: "surf", name: "Surf", blurb: "Sun, waves, palm trees", figure: "/figures/surf.webp" },
  { id: "air-force", name: "Air Force", blurb: "Olive, badges, precision", figure: "/figures/air-force.webp" },
];
