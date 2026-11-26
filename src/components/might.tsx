// Peças MighT: Figura, Logo, grelha de tags, barras de peso. Dono: Design (Pessoa 4).
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { DIM_INFO, DIMS, Dim, TagTriple } from '@/data/types';
import { label, tagsOf } from '@/data/tags';
import { FIGURES, FIGURE_BASE, FigureKey } from '@/lib/figure';
import { pct } from '@/lib/logic';
import { C, DIM_COLOR, F, R } from '@/theme';
import logoBlack from './logoBlack';
import logoWhite from './logoWhite';

export const Logo = ({ white, width = 110 }: { white?: boolean; width?: number }) =>
  <SvgXml xml={white ? logoWhite : logoBlack} width={width} height={(width * 107) / 357} />;

export function Figure({ figure, size = 220 }: { figure?: string | null; size?: number }) {
  const src = figure && figure in FIGURES ? FIGURES[figure as FigureKey] : FIGURE_BASE;
  return <Image source={src} style={{ width: size, height: size }} contentFit="contain" />;
}

/** As 3 tags como peças da figura: Cabeça · Braço · Mão */
export function TagParts({ tags, light }: { tags: TagTriple; light?: boolean }) {
  return (
    <View style={s.parts}>
      {DIMS.map((d) => (
        <View key={d} style={[s.part, { borderColor: DIM_COLOR[d] }]}>
          <Text style={[s.partDim, { color: DIM_COLOR[d] }]}>{DIM_INFO[d].part}</Text>
          <Text style={[s.partTag, light && { color: C.light }]} numberOfLines={1}>{label(tags[d])}</Text>
        </View>
      ))}
    </View>
  );
}

export function TagGrid({ dim, value, onChange }: { dim: Dim; value?: string; onChange: (id: string) => void }) {
  return (
    <View style={s.grid}>
      {tagsOf(dim).map((t) => {
        const on = value === t.id;
        return (
          <Pressable key={t.id} onPress={() => onChange(t.id)}
            style={[s.cell, on && { backgroundColor: DIM_COLOR[dim], borderColor: DIM_COLOR[dim] }]}>
            <Text style={[s.cellText, on && { color: C.light }]}>{t.label}</Text>
          </Pressable>
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
          <View style={s.track}><View style={[s.fill, { width: `${it.w * 100}%`, backgroundColor: DIM_COLOR[dim] }]} /></View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  parts: { flexDirection: 'row', gap: 8, width: '100%' },
  part: { flex: 1, borderWidth: 1.5, borderRadius: R.sm, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center', backgroundColor: C.glass },
  partDim: { fontFamily: F.semibold, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  partTag: { fontFamily: F.bold, fontSize: 14, color: C.dark },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: '48%', flexGrow: 1, height: 48, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder },
  cellText: { fontFamily: F.semibold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: C.dark },
  barLabel: { fontFamily: F.medium, fontSize: 13, color: C.dark },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(28,30,40,0.1)', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
});
