// Estado partilhado da barra de separadores (evita imports circulares ui ↔ TabBar).
import { usePathname } from 'expo-router';

import { useMight } from '@/store/useMight';

/** Rotas de topo (sem botão "Voltar"). */
export const TAB_ROOTS = ['/', '/inbox', '/profile', '/discover', '/roles'];
/** Espaço a reservar no fundo dos ecrãs quando a barra está visível. */
export const TAB_SPACE = 72;

export function useTabBarVisible() {
  const hasMight = useMight((s) => !!s.me.self);
  const path = usePathname();
  return hasMight && path !== '/create';
}
