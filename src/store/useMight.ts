// Estado da app (simulado, local ao telemóvel). Dono: Integrador.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PEOPLE, randomTriple } from '@/data/seed';
import { CIRCLES, Circle, Me, Might, Post, TagTriple } from '@/data/types';
import { Answers, randomAnswers } from '@/data/profile';
import { figureFor, taglineFor } from '@/lib/figure';

const uid = () => Math.random().toString(36).slice(2, 9);
const RECIPROCITY_MS = 5000; // "Vais ver que essa pessoa vai retribuir!"

type State = {
  me: Me;
  mights: Might[];
  startedAt: number | null;
  startTimer: () => void;
  createSelf: (name: string, tags: TagTriple, answers?: Answers) => void;
  send: (to: { id: string; name: string }, circle: Circle, tags: TagTriple, check?: Answers) => void;
  ask: (name: string, circle: Circle) => string; // devolve link de convite
  receiveFromRoom: (n?: number) => void; // botão de demo
  respond: (id: string, status: 'aceite' | 'recusado') => void;
  posts: Post[];
  addPost: (mood: string, photo: string | null, note: string) => void;
  reset: () => void;
};

// Publicações de demo dos amigos (sem foto: mostra a personagem).
const SEED_MOODS = ['entusiasmo', 'serenidade', 'ansiedade', 'alegria', 'amor'];
const SEED_NOTES = ['Primeiro dia no estágio!', 'Domingo de praia.', 'Apresentação às 10h…', 'Passei no exame 🎉', 'Jantar com a família.'];
const seedPosts = (): Post[] => PEOPLE.slice(0, 5).map((p, i) => ({
  id: `seed-${i}`, personId: p.id, name: p.name, mood: SEED_MOODS[i], photo: null, note: SEED_NOTES[i],
  createdAt: Date.now() - (i + 1) * 47 * 60 * 1000,
}));

const emptyMe: Me = { name: '', self: null, figure: null, tagline: null, createdMs: null };

const incoming = (fromName: string, circle: Circle, fromId = 'guest'): Might => ({
  id: uid(), fromId, fromName, toId: 'me', toName: 'Eu', circle, tags: randomTriple(),
  status: 'pendente', createdAt: Date.now(), check: randomAnswers(),
});

export const useMight = create<State>()(
  persist(
    (set, get) => ({
      me: emptyMe,
      mights: [],
      startedAt: null,
      posts: seedPosts(),

      addPost: (mood, photo, note) => {
        const p: Post = { id: uid(), personId: 'me', name: get().me.name || 'Eu', mood, photo, note, createdAt: Date.now() };
        set({ posts: [p, ...get().posts] });
      },

      startTimer: () => { if (!get().startedAt) set({ startedAt: Date.now() }); },

      createSelf: (name, tags, answers) => {
        const started = get().startedAt ?? Date.now();
        set({
          me: { name, self: tags, figure: figureFor(tags), tagline: taglineFor(tags), createdMs: Date.now() - started, answers },
        });
      },

      send: (to, circle, tags, check) => {
        const m: Might = { id: uid(), fromId: 'me', fromName: get().me.name, toId: to.id, toName: to.name,
          circle, tags, check, status: 'aceite', createdAt: Date.now() };
        set({ mights: [m, ...get().mights] });
        // Simulação: a pessoa retribui passados uns segundos.
        setTimeout(() => set({ mights: [incoming(to.name, circle, to.id), ...get().mights] }), RECIPROCITY_MS);
      },

      ask: (name, circle) => {
        const code = uid();
        setTimeout(() => set({ mights: [incoming(name, circle), ...get().mights] }), RECIPROCITY_MS);
        return `https://might.app/r/${code}`; // link fictício, sem criar conta
      },

      receiveFromRoom: (n = 3) => {
        const news = Array.from({ length: n }, (_, i) => {
          const p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
          return incoming(p.name, CIRCLES[i % CIRCLES.length], p.id);
        });
        set({ mights: [...news, ...get().mights] });
      },

      respond: (id, status) =>
        set({ mights: get().mights.map((m) => (m.id === id ? { ...m, status } : m)) }),

      reset: () => set({ me: emptyMe, mights: [], startedAt: null, posts: seedPosts() }),
    }),
    { name: 'might-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
