// Estado da app (simulado, local ao telemóvel). Dono: Integrador.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PEOPLE, randomTriple } from '@/data/seed';
import { CIRCLES, Circle, Me, Might, TagTriple } from '@/data/types';
import { figureFor, taglineFor } from '@/lib/figure';

const uid = () => Math.random().toString(36).slice(2, 9);
const RECIPROCITY_MS = 5000; // "Vais ver que essa pessoa vai retribuir!"

type State = {
  me: Me;
  mights: Might[];
  startedAt: number | null;
  startTimer: () => void;
  createSelf: (name: string, tags: TagTriple) => void;
  send: (to: { id: string; name: string }, circle: Circle, tags: TagTriple) => void;
  ask: (name: string, circle: Circle) => string; // devolve link de convite
  receiveFromRoom: (n?: number) => void; // botão de demo
  respond: (id: string, status: 'aceite' | 'recusado') => void;
  reset: () => void;
};

const emptyMe: Me = { name: '', self: null, figure: null, tagline: null, createdMs: null };

const incoming = (fromName: string, circle: Circle, fromId = 'guest'): Might => ({
  id: uid(), fromId, fromName, toId: 'me', toName: 'Eu', circle, tags: randomTriple(),
  status: 'pendente', createdAt: Date.now(),
});

export const useMight = create<State>()(
  persist(
    (set, get) => ({
      me: emptyMe,
      mights: [],
      startedAt: null,

      startTimer: () => { if (!get().startedAt) set({ startedAt: Date.now() }); },

      createSelf: (name, tags) => {
        const started = get().startedAt ?? Date.now();
        set({
          me: { name, self: tags, figure: figureFor(tags), tagline: taglineFor(tags), createdMs: Date.now() - started },
        });
      },

      send: (to, circle, tags) => {
        const m: Might = { id: uid(), fromId: 'me', fromName: get().me.name, toId: to.id, toName: to.name,
          circle, tags, status: 'aceite', createdAt: Date.now() };
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

      reset: () => set({ me: emptyMe, mights: [], startedAt: null }),
    }),
    { name: 'might-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
