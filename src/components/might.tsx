// Peças MighT: Figura, Logo, grelha de tags, barras de peso. Dono: Design (Pessoa 4).
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { DIM_INFO, DIMS, Dim, TagTriple } from '@/data/types';
import { label, tagsOf } from '@/data/tags';
import { FIGURES, FIGURE_BASE, FigureKey } from '@/lib/figure';
import { pct } from '@/lib/logic';
import { C, DIM_COLOR, R, SHADOW } from '@/theme';
import { Pressy } from './ui';
import logoBlack from './logoBlack';
import logoWhite from './logoWhite';

export const Logo = ({ white, width = 110 }: { white?: boolean; width?: number }) =>
  <SvgXml xml={white ? logoWhite : logoBlack} width={width} height={(width * 107) / 357} />;

export function Figure({ figure, size = 220 }: { figure?: string | null; size?: number }) {
  const src = figure && figure in FIGURES ? FIGURES[figure as FigureKey] : FIGURE_BASE;
  return <Image source={src} style={{ width: size, height: size }} contentFit="contain" />;
}

/** As 3 tags como peças da figura: Cabeça · Braço · Mão */
export function TagParts({ tags, light, extra }: { tags: TagTriple; light?: boolean; extra?: string[] }) {
  return (
    <View style={s.parts}>
      {DIMS.map((d) => (
        <View key={d} style={s.part}>
          <Text style={[s.partDim, { color: DIM_COLOR[d] }]}>{DIM_INFO[d].part}</Text>
          <Text style={[s.partTag, light && { color: C.light }]} numberOfLines={2}>
            {d === 'personalidade' && extra?.length ? [tags[d], ...extra].map(label).join(' · ') : label(tags[d])}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Grelha de tags. Com `values`, permite escolher várias (onChange alterna). */
export function TagGrid({ dim, value, values, onChange }: { dim: Dim; value?: string; values?: string[]; onChange: (id: string) => void }) {
  return (
    <View style={s.grid}>
      {tagsOf(dim).map((t) => {
        const on = values ? values.includes(t.id) : value === t.id;
        return (
          <Pressy key={t.id} onPress={() => onChange(t.id)}
            style={[s.cell, on && { backgroundColor: DIM_COLOR[dim], borderColor: DIM_COLOR[dim] }]}>
            <Text style={[s.cellText, on && { color: C.light, fontWeight: '600' }]}>{t.label}</Text>
          </Pressy>
        );
      })}
    </View>
  );
}

export function WeightBars({ dim, items, selfId }: { dim: Dim; items: { id: string; w: number }[]; selfId?: string }) {
  return (
    <View style={{ gap: 6 }}>
      {items.map((it) => (
        <View key={it.id} style={{ gap: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={s.barLabel}>{label(it.id)}{it.id === selfId ? '  · também no teu Self' : ''}</Text>
            <Text style={s.barLabel}>{pct(it.w)}</Text>
          </View>
          <View style={s.track}><Bar w={it.w} color={DIM_COLOR[dim]} /></View>
        </View>
      ))}
    </View>
  );
}

/** Barra que cresce suavemente ao aparecer. */
function Bar({ w, color }: { w: number; color: string }) {
  const v = useSharedValue(0);
  useEffect(() => { v.value = withDelay(150, withTiming(w * 100, { duration: 700, easing: Easing.out(Easing.cubic) })); }, [w, v]);
  const st = useAnimatedStyle(() => ({ width: `${v.value}%` }));
  return <Animated.View style={[s.fill, { backgroundColor: color }, st]} />;
}

const s = StyleSheet.create({
  parts: { flexDirection: 'row', gap: 8, width: '100%' },
  part: { flex: 1, borderRadius: R.md, borderCurve: 'continuous', paddingVertical: 10, paddingHorizontal: 6, alignItems: 'center', gap: 2, backgroundColor: C.surface, ...SHADOW },
  partDim: { fontWeight: '600', fontSize: 11, letterSpacing: 0.3, textTransform: 'uppercase' },
  partTag: { fontWeight: '600', fontSize: 15, color: C.dark, letterSpacing: -0.2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '48%', flexGrow: 1, height: 48, borderRadius: 14, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.separator },
  cellText: { fontWeight: '500', fontSize: 15, color: C.dark, letterSpacing: -0.1 },
  barLabel: { fontWeight: '500', fontSize: 14, color: C.dark },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(4,54,58,0.07)', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});
